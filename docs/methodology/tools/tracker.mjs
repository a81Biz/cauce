#!/usr/bin/env node
/**
 * tracker — el espejo entre el registro del proyecto y la plataforma de trabajo.
 *
 * POR QUÉ EXISTE
 *   El estado vivía en el contexto del agente. Cuando la sesión se comprime o termina se
 *   pierde, y la siguiente empieza explicando otra vez qué se estaba haciendo. Sacarlo a una
 *   plataforma —GitHub, Azure— lo vuelve consultable en un comando y deja de depender de la
 *   memoria de nadie.
 *
 * EL RIESGO QUE RESUELVE, Y NO CREA
 *   `SUITE-R08` exige que todo identificador salga de `REGISTRY.json`. Si la plataforma
 *   también asignara, habría dos fuentes divergiendo — la causa raíz que la v4 nació para
 *   eliminar, reintroducida por la puerta nueva. Aquí el registro **asigna** y la plataforma
 *   **espeja**: cada allocation guarda su número de issue, y el espejo se comprueba por
 *   enumeración en las dos direcciones (`SUITE-R35`).
 *
 * QUÉ RESPONDE CADA UNO
 *   La plataforma:  qué está abierto y qué sigue.
 *   El repositorio: qué se decidió y qué se probó.
 *
 * POR QUÉ CLI Y NO MCP
 *   La verificación tiene que correr en integración continua, donde no hay nadie delante para
 *   autorizar un servidor MCP por OAuth. `gh` y `az` funcionan sin cabeza, con un token.
 *
 * Uso:  node tracker.mjs <espejo|abrir|cerrar> [ruta-proyecto] [--aplicar]
 * Exit: 0 en orden · 1 divergencia o error · 2 sin plataforma configurada
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/).
 */

import { readFileSync, existsSync, writeFileSync, rmSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
// PT-052 · partir lineas se hace con la funcion compartida: RE_LINEA contempla CRLF, y dos
// formas de partir lineas en el repositorio serian dos fuentes del mismo hecho (SUITE-R38).
import {
  lineas, ESTADOS_TERMINALES,
  // PT-058 · cada cifra dice que es · PT-059 · el veredicto de viabilidad
  cifra, textoCifra, MEDIDO, ESTIMADO, SIN_EVALUAR, viabilidadDe,
  // PT-060 · la sesion es el worker, no el estado
  sesionDe, handoffDeSesion,
  // PT-061 · quien es quien
  personaDe, personaLocal,
  // PT-062 · los IDs por rangos reservados
  siguienteEnRango, solapes,
  // PT-063 · el usuario en la rama de tarea
  normalizaRef, ramaDeTarea, ramaLlevaUsuario,
  // PT-064 · de quien es cada commit
  soloDe, sinPersona,
  // PT-065 · la sesion es de alguien
  archivoSesion, sesionesAjenas, marcaDe, sesionesUnicas,
  // PT-085 · la deuda de sellado, los documentos de entrada y la deriva del grafo.
  sinSellar, selladoEnTag, cuerpoSinEnlaceConRef, issueAAdoptar, TIPOS_DE_ITEM, bloqueDeBacklog,
  MOTIVOS_DE_PARADA, DESENLACES_DE_PARADA, selloSinResolver, derivaDelGrafo, DOCUMENTOS_DE_ENTRADA, rutaRelativaDelManifiesto,
} from './patrones.mjs';
// PT-128 · las fases y sus compuertas salen de PHASES.md, no de una lista escrita aqui.
import { fasesDeFDGE, nodosSinVisitar } from './patrones.mjs';
// PT-087 · la guia de migracion ENUMERA las reglas nuevas: el paso 1 no comprobaba nada.
import { RIGE_DESDE, reglasNuevasFueraDeLaGuia } from './patrones.mjs';
// PT-096 · SUITE-R38 · un lote se reconoce por su ID, y el predicado vive en UN solo sitio.
import { esLote } from './patrones.mjs';
// PT-091 · las cifras del inventario se DERIVAN, no se transcriben.
import { cifrasTranscritas, cifrasQueMienten, recuentosDeClaude } from './patrones.mjs';

const SALTO = String.fromCharCode(10);
// PT-064 · separador de campos para `git log`: no aparece en un nombre ni en un asunto.
const SEP_REG = String.fromCharCode(30);

// ─── Lógica pura · exportada para poder probarla sin plataforma ──────────────
// PT-001 · El adaptador habla con `gh`; la comparación no habla con nadie.
//
// Separarlos no es un adorno: es lo que hace la diferencia entre poder probar el espejo y no
// poder. Sombrear un ejecutable en el PATH no es portable entre Windows y Ubuntu —se probó, y
// node siguió resolviendo el `gh` real— y ningún caso del arnés puede exigir `gh` AUTENTICADO,
// porque el arnés corre en CI y un PR desde un fork no recibe credenciales. Un caso así sería
// el rojo permanente que `SUITE-R35` existe para evitar.

// PT-001 · `VALIDATION_PENDING` y `DONE` FALTABAN, y se vio ejecutando el espejo de verdad:
// PT-004 pasó a DONE esperando su G4 y su issue quedó denunciado como huérfano. Un PT que
// espera el merge no es trabajo cerrado — es lo más abierto que hay, porque lo que le queda es
// una compuerta humana. `SUITE-R36` dice «solo lo vivo» y lo cerrado empieza en INTEGRATED.
// PT-059 · BLOCKED_BY_CONTEXT entra aqui. La tarea NO esta fallando: no debe ejecutarse
// todavia. Si no fuera «vivo» desapareceria del tablero sin estar cerrada, y el marco habria
// convertido «no es el momento» en «ya esta».
export const VIVOS = new Set(['DRAFT', 'READY', 'REOPENED', 'IN_PROGRESS', 'BLOCKED', 'BLOCKED_BY_CONTEXT',
  'BLOCKED_DOMAIN', 'VALIDATION_PENDING', 'DONE',
  // PT-013 · un aplazado esta VIVO para el espejo: su issue permanece abierto y en el tablero.
  // Para la verificacion esta exento —no tiene intake ni fases— y esos dos signos opuestos son
  // lo que hace que aplazar algo lo ponga a la vista en vez de sacarlo de ella.
  'DEFERRED']);

/** Las allocations que el espejo cubre. Lo cerrado es evidencia, no estado (`SUITE-R36`). */
export const vivasDe = (allocations) =>
  (Array.isArray(allocations) ? allocations : []).filter((a) => VIVOS.has(a?.status));

// PT-007 · La compuerta NO se almacena: se DERIVA de la fase, con el mapa que `CORE.md` §Fases
// ya declara. Un campo `gate` en el registro seria un hecho copiado que alguien tiene que
// acordarse de actualizar (`RULE-01`), y este marco tiene cicatrices de eso.
export const COMPUERTA_DE_FASE = { 1: 'G1', 4: 'G2', 7: 'G3', 9: 'G4' };

// PT-030 · Qué produce cada fase y qué la cierra. Es la MISMA tabla que PHASES.md describe en
// prosa; aquí está en forma consultable para que la respuesta a «¿qué sigue?» se DERIVE y no la
// improvise nadie. Si las dos divergen, verify-suite lo caza: PHASES.md manda sobre el texto,
// esta tabla sobre lo ejecutable, y ninguna inventa fases que la otra no tenga.
export const FASES = {
  0:  { nombre: 'Contexto',      produce: [],                              cierra: 'leer el estado y el registro' },
  1:  { nombre: 'Intake',        produce: ['intake.md'],                   cierra: 'G1 · firma humana (INTAKE-R06)' },
  2:  { nombre: 'Descubrimiento',produce: ['discovery.md'],                cierra: 'dónde está el defecto, con archivo y línea' },
  3:  { nombre: 'Estrategia',    produce: ['strategy.md'],                 cierra: 'los caminos descartados, con su por qué' },
  4:  { nombre: 'Propuesta',     produce: ['design.md', 'tasks.md', 'test-scenarios.md', 'out-of-scope.md', 'spec-changes.md', 'traceability.md'], cierra: 'G2 · aprobación' },
  5:  { nombre: 'Implementación',produce: [],                              cierra: 'los casos en verde y la comprobación inversa en rojo' },
  6:  { nombre: 'Evidencia',     produce: ['manifest.json', 'self-review.md'], cierra: 'cada AC con su evidencia, o declarado no verificado' },
  7:  { nombre: 'Validación',    produce: [],                              cierra: 'G3 · validación' },
  8:  { nombre: 'Persistencia',  produce: ['HISTORY.log', 'índice'],       cierra: 'estado retomable (SUITE-R33/R34)' },
  9:  { nombre: 'Integración',   produce: [],                              cierra: 'G4 · HUMANA sin excepción (EXEC-R04, SUITE-R06a)' },
  10: { nombre: 'Cierre',        produce: [],                              cierra: 'estado terminal en la rama por defecto, y ENTONCES cerrar (SUITE-R46)' },
};

/**
 * PT-030 · `SUITE-R48` · Qué toca ahora y cómo se cierra, DERIVADO del tablero.
 *
 * Existe porque el agente recorría las fases de memoria, y de memoria es exactamente como se
 * saltan: en una sola sesión di un merge por terminado sin mirar la compuerta que corre después,
 * cerré issues en un orden que ninguna regla decía, y declaré un cambio de especificación que no
 * hice. Cuatro veces decidí «qué sigue» sin preguntárselo a nada.
 *
 * No inventa: cruza el estado del registro con la fase declarada y devuelve qué produce esa fase
 * y qué la cierra. Función pura — quien llama le pasa lo que ya leyó.
 */
export function queSigue(alloc, opciones = {}) {
  const { comentarioPendiente = false, issueAbierto = null, arbol = null } = opciones;
  if (!alloc) return { error: 'no existe en el registro. El registro asigna (SUITE-R08): sin allocation no hay trabajo.' };
  if (!VIVOS.has(alloc.status)) {
    return { id: alloc.id, estado: alloc.status, terminado: true,
      siguiente: `${alloc.id} ya es ${alloc.status}. Lo cerrado es evidencia, no estado (SUITE-R36).` };
  }
  const bloqueos = [];
  const avisos = [];
  // SUITE-R43 · lo que una persona escribió se lee ANTES de avanzar. Va primero porque puede
  // cambiar todo lo demás: preguntar qué sigue sin haber leído la respuesta anterior es el
  // defecto que esta acción existe para impedir.
  if (comentarioPendiente === true) {
    // PT-122 · EL LIMITE VA EN EL MENSAJE. Un comentario SIN marca se atribuye a una persona
    // por defecto, y eso es lo correcto —una persona nunca pone la marca—, pero significa que
    // un comentario del AGENTE escrito fuera del comando tambien cuenta como humano. Los
    // diecisiete del cierre de EP-019 se contaron asi. Por contenido son indistinguibles: la
    // unica garantia es que la herramienta SIEMPRE marca los suyos, y por eso «cierre» existe.
    bloqueos.push(`hay un comentario sin responder en el issue #${alloc.issue}. Léelo y respóndelo antes de avanzar (SUITE-R43). El limite: un comentario sin marca se atribuye a una persona, asi que uno del agente escrito FUERA del comando cuenta igual: por contenido son indistinguibles.`);
  } else if (comentarioPendiente === null) {
    // PT-056 · RULE-06 · no es «no hay»: es que nadie pudo mirar. Callarlo convertiria SUITE-R43
    // en una garantia que se apaga sola cuando no hay credencial.
    avisos.push('SUITE-R43 SIN EVALUAR: no se pudo consultar el tablero, asi que no se sabe si hay un comentario sin responder.');
  }
  // PT-056 · STATE_MISMATCH · el arbol no corresponde al checkpoint. Va aqui porque «que sigue»
  // se responde SOBRE UN ESTADO: si el estado no es el declarado, la respuesta es sobre otro
  // trabajo. `corresponde: null` (sin checkpoint) NO bloquea — no tener foto no es tener una mala.
  if (arbol && arbol.corresponde === false) bloqueos.push(textoDiscrepancia(arbol));
  if (!alloc.issue) bloqueos.push(`no tiene issue. Lo que está abierto se consulta en el tablero (SUITE-R35):  tracker abrir --aplicar`);
  else if (issueAbierto === false) bloqueos.push(`su issue #${alloc.issue} no está abierto y ${alloc.id} sigue vivo (SUITE-R35).`);

  const f = alloc.phase;
  if (f === undefined || f === null) {
    return { id: alloc.id, estado: alloc.status, fase: null, bloqueos, avisos,
      siguiente: 'no declara «phase» en el registro: SIN EVALUAR. Sin fase no se puede derivar qué toca, y adivinarlo es lo que esta acción existe para impedir (RULE-06).' };
  }
  const actual = FASES[Number(f)];
  const proxima = FASES[Number(f) + 1];
  const compuerta = COMPUERTA_DE_FASE[Number(f)];
  return {
    id: alloc.id, estado: alloc.status, fase: Number(f), nombre: actual?.nombre ?? '¿?',
    produce: actual?.produce ?? [], cierra: actual?.cierra ?? '¿?', compuerta: compuerta ?? null,
    bloqueos, avisos,
    siguiente: bloqueos.length
      ? `RESUELVE PRIMERO lo de arriba. Después: ${actual?.cierra ?? '¿?'}`
      : `PHASE ${f} · ${actual?.nombre ?? '¿?'} — cierra con: ${actual?.cierra ?? '¿?'}`
      + (proxima ? `. Luego PHASE ${Number(f) + 1} · ${proxima.nombre}.` : '. Es la última fase.'),
  };
}

/** Las etiquetas que el registro DERIVA para el issue de una allocation. Función pura. */
export function etiquetasDe(alloc) {
  const et = [esLote(alloc) ? 'implementación' : 'tarea'];
  const f = alloc?.phase;
  if (f !== undefined && f !== null) {
    et.push(`fase: ${f}`);
    const g = COMPUERTA_DE_FASE[Number(f)];
    if (g) et.push(g);
  }
  return et;
}
const RE_DERIVADA = /^(fase: \d+|G[1-4])$/;

/** Compara registro y plataforma EN LAS DOS DIRECCIONES. Sin efectos y sin red. */
export function compararEspejo(vivas, issues, todas, refExiste, refDurable) {
  const div = [];
  const porNumero = new Map((issues ?? []).map((i) => [i.number, i]));
  for (const a of vivas ?? []) {
    if (!a.issue) {
      div.push({ regla: 'SUITE-R35', mensaje: `${a.id} está vivo (${a.status}) y no tiene issue. Lo que está abierto tiene que poder consultarse sin leer el repositorio entero.` });
    } else if (!porNumero.has(a.issue)) {
      div.push({ regla: 'SUITE-R35', mensaje: `${a.id} está vivo (${a.status}) y su issue #${a.issue} no está abierto. Tres lecturas: el trabajo terminó y el registro no se enteró; alguien cerró el issue a mano; o se cerró desde otra rama antes de que el estado terminal llegara aquí (SUITE-R46) — si esta es la rama por defecto y acabas de mergear, es la tercera.` });
    } else {
      // El estado publicado tiene que ser el que el registro deriva. Publicarlo sin comprobarlo
      // es escribir en dos sitios y esperar que no se separen — la avería que SUITE-R35 impide.
      const i = porNumero.get(a.issue);
      // PT-079 · SUITE-R56 · el rastro sobrevive a la rama.
      //
      // El enlace apuntaba a «la rama en la que corrio el espejo», y FDGE-R19 borra la rama
      // efimera al fusionar. El dia que se midio, 14 de los 16 enlaces daban 404 y uno
      // apuntaba a la rama de OTRA tarea. Nada lo decia, y por eso va aqui: un enlace que ya
      // no abre es exactamente una divergencia entre el registro y la plataforma.
      //
      // «refExiste» se inyecta para que esta funcion siga siendo comprobable sin git ni red.
      const ref = refDeEnlace(i.body);
      if (ref && refExiste && refExiste(ref) === false) {
        div.push({ regla: 'SUITE-R56', mensaje: `${a.id}: su issue #${a.issue} enlaza a «${ref}», que ya no existe. La rama efimera se borra al fusionar (FDGE-R19); el enlace tiene que apuntar a un ref DURABLE — la rama de integracion, o el commit. Se corrige republicando:  tracker abrir --aplicar` });
      }
      // PT-111 · SUITE-R35 · el TITULO, que es lo primero que una persona lee.
      //
      // El espejo comparaba el ESTADO —abierto o cerrado— y que una allocation reclamara el
      // issue. No comparaba lo que se LEE. Un titulo editado a mano en el tablero decia una cosa
      // y el registro otra, y «espejo» respondia «sin divergencias».
      //
      // Es la misma forma que EP-007 y PT-110: existe un comando que lo corrige —«abrir
      // --aplicar» republica el cuerpo desde PT-096— y NADA que lo eche en falta.
      //
      // Se compara el titulo DERIVADO, no el cuerpo entero: un issue lleva comentarios y
      // ediciones humanas legitimas, y marcarlas seria ruido.
      // Sin `slug` NO HAY TITULO QUE DERIVAR, y comparar contra una derivacion imposible
      // marcaria como divergente todo lo que no lo lleve. Lo delataron TRES fixtures de la
      // bateria que declaran «espejo exacto» sin slug: la comprobacion estaba mal, no ellos.
      const tituloDerivado = a.slug ? `${a.id} · ${a.slug}` : null;
      const tituloPublicado = String(porNumero.get(a.issue)?.title ?? '').trim();
      if (tituloDerivado && tituloPublicado && tituloPublicado !== tituloDerivado) {
        div.push({ regla: 'SUITE-R35', mensaje: `${a.id}: el titulo del issue #${a.issue} no es el `
          + `derivado del registro. Publicado «${tituloPublicado}», derivado «${tituloDerivado}». `
          + `Lo primero que una persona lee dice algo distinto de lo que el registro dice. `
          + `Se corrige con «tracker abrir ${a.id} --aplicar».` });
      }

      // PT-096 · SUITE-R51 · y el caso SIMETRICO, que faltaba: el cuerpo que no enlaza en absoluto.
      //
      // La guarda de arriba es «ref && …», asi que un cuerpo SIN enlace no era divergencia — y sin
      // enlace es como nace HOY todo cuerpo: en PHASE 1 el intake no esta commiteado, refDurableDe
      // responde null con razon, y nadie vuelve a preguntar. Por eso «tracker espejo» decia «el
      // espejo cuadra» con diez de 115 cuerpos publicados sin enlace.
      //
      // «refDurable» se INYECTA por el mismo motivo que «refExiste» desde PT-079: que esta funcion
      // siga siendo comprobable sin git ni red. Y es OPCIONAL: sin el dato la comprobacion no se
      // hace y el comportamiento es el de antes — un undefined no es un «no hay» (RULE-06).
      //
      // Solo acusa si HOY existe ref durable. Al abrir el issue no hay nada que enlazar, y exigirlo
      // entonces seria pedir un enlace a un commit que no existe; en cuanto el intake entra en un
      // commit, acusa — que es el primer instante en que se puede arreglar.
      if (refDurable && decisionDeEnlace(i.body, refExiste, refDurable(a)) === 'REPARAR_MUDO') {
        div.push({ regla: 'SUITE-R51', mensaje: `${a.id}: su issue #${a.issue} publica la ruta SIN enlace y el contenido ya esta en un ref durable. El cuerpo del issue enlaza donde el contenido esta (SUITE-R51); cuando se abrio todavia no habia ref durable y nadie volvio a preguntar. Se corrige republicando:  tracker abrir --aplicar` });
      }
      if (Array.isArray(i.labels)) {
        const tiene = i.labels.map((l) => l.name ?? l).filter((n) => RE_DERIVADA.test(n)).sort();
        const debe = etiquetasDe(a).filter((n) => RE_DERIVADA.test(n)).sort();
        if (tiene.join('|') !== debe.join('|')) {
          div.push({ regla: 'SUITE-R35', mensaje: `${a.id}: su issue #${a.issue} declara «${tiene.join(', ') || '—'}» y el registro dice «${debe.join(', ') || '—'}». El estado de la plataforma se DERIVA del registro: sincronízalo con  tracker abrir --aplicar` });
        }
      }
    }
  }
  // PT-028 · un issue reclamado por una allocation YA TERMINAL no es huérfano: es un cierre
  // pendiente. El orden que SUITE-R46 fija —apuntar el estado terminal, mergear, cerrar— crea
  // esa ventana a propósito, y sin distinguirla el espejo denunciaba como «trabajo que el
  // registro no conoce» justo el estado que la regla anterior obliga a atravesar. Dos reglas
  // mías chocando, encontrado ejecutando el orden que yo mismo acababa de escribir.
  const vivos = new Set((vivas ?? []).map((a) => a.issue).filter(Boolean));
  const porIssue = new Map((todas ?? vivas ?? []).filter((a) => a?.issue).map((a) => [a.issue, a]));
  for (const i of issues ?? []) {
    if (vivos.has(i.number)) continue;
    const duena = porIssue.get(i.number);
    if (duena) {
      div.push({ regla: 'SUITE-R35', mensaje: `El issue #${i.number} sigue abierto y ${duena.id} ya es ${duena.status}: es un cierre pendiente, no trabajo perdido. Ciérralo cuando el estado terminal esté en la rama por defecto (SUITE-R46):  tracker cerrar --aplicar`, pendienteDeCierre: true });
      continue;
    }
    div.push({ regla: 'SUITE-R35', mensaje: `El issue #${i.number} «${String(i.title ?? '').slice(0, 50)}» está abierto y ninguna allocation lo reclama. Se está trabajando en algo que el registro no conoce.` });
  }
  return div;
}

/** Las etiquetas que `abrir` necesita y que la plataforma todavía no tiene (`FND-R30`). */
export const ETIQUETAS = ['implementación', 'tarea'];
/** Todas las que el registro puede llegar a publicar, incluidas las derivadas (PT-007). */
export const etiquetasNecesarias = (allocs) => [...new Set([...ETIQUETAS,
  ...(allocs ?? []).flatMap((a) => etiquetasDe(a))])];
export const etiquetasQueFaltan = (existentes, necesarias = ETIQUETAS) =>
  necesarias.filter((e) => !(existentes ?? []).includes(e));

// PT-008 · La MARCA de procedencia. No se distingue por autor porque NO SE PUEDE: el agente
// comenta con la credencial de la persona, asi que los dos comentarios llevan el mismo login.
// Se midio antes de decidirlo. La marca es un comentario HTML, invisible al renderizar.
//
// Es falsificable —cualquiera puede pegarla— y eso se declara, como SUITE-R27 declara que
// prueba una firma: lo mecanizable es que la afirmacion sea contrastable, no que sea sincera.
export const MARCA_AGENTE = '<!-- cauce:agente -->';

/**
 * PT-054 · La marca de un commit de PROYECCION.
 *
 * `cauce/<usuario>` es DERIVADA por decision del firmante: solo la escribe la herramienta. Pero
 * una rama derivada en la que alguien escribe DEJA DE SERLO, y no se notaria — `cauce/alberto` con
 * un commit humano se ve exactamente igual que sin el. La marca es lo unico que los distingue.
 *
 * Es el mismo mecanismo que MARCA_AGENTE usa con las notas: invisible al leer, comprobable al
 * verificar. Y falsificable, como una firma — por eso se DECLARA en vez de presumirse.
 */
export const MARCA_PROYECCION = 'cauce:proyeccion';

/** El nombre de la rama derivada de una persona. Una referencia de git no admite cualquier cosa. */
// PT-063 · el normalizador se comparte con la rama de tarea (normalizaRef): si cada una
// normalizara por su cuenta, la misma persona tendria dos nombres segun que rama se mire.
export const ramaDe = (usuario) => {
  const n = normalizaRef(usuario);
  return n ? `cauce/${n}` : null;
};

/**
 * El cuerpo de ESTADO.md: una fila por allocation VIVA. Funcion pura.
 *
 * PT-079 · SUITE-R56 · Dos SHA, y no es redundancia:
 *
 *   SHA rama       la punta de SU rama. Dice donde esta el trabajo AHORA, y MUERE con la rama
 *                  —FDGE-R19 la borra al fusionar—.
 *   SHA contenido  el ultimo commit que toco changes/PT-NNN-slug/. NO muere: es lo que permite
 *                  reconstruir donde estaba cada cosa cuando las ramas ya no existen.
 *
 * Hasta aqui solo estaba el primero, y estaba VACIO justo para las tareas sin rama declarada
 * —las de PHASE 1 a 4—, que son las que mas lo necesitaran cuando la tengan y la pierdan. El
 * registro pensado para ser durable no estaba registrando lo durable.
 */
export function estadoProyectado(vivas, shaDe, fecha, shaContenidoDe) {
  const corto = (x) => (x ? String(x).slice(0, 7) : '—');
  const filas = vivas.map((a) => {
    // El SHA sale de la punta de SU rama, no de la actual: una tarea sin rama creada lo declara
    // VACIO en vez de heredar el de otra. Un SHA prestado seria una afirmacion falsa (RULE-06).
    const sha = a.branch ? (shaDe(a.branch) ?? '') : '';
    const cont = shaContenidoDe ? (shaContenidoDe(a) ?? '') : '';
    return `| ${a.id} | ${a.type ?? ''} | ${a.status ?? ''} | ${a.phase ?? '—'} | ${a.branch ?? '—'} | ${corto(sha)} | ${corto(cont)} |`;
  });
  return [
    '# ESTADO — proyección derivada de cauce',
    '',
    '> **Esta rama la escribe una herramienta.** Cada commit lleva la marca `cauce:proyeccion`, y',
    '> uno sin ella se reporta: una rama derivada en la que alguien escribe deja de serlo.',
    '>',
    '> No es la fuente de nada. Lo que decide vive en la rama de cada tarea, junto a su código.',
    '',
    `Proyectado el ${fecha ?? 'sin fecha'} · ${vivas.length} allocation(es) viva(s).`,
    '',
    '| Id | Tipo | Estado | Fase | Rama | SHA rama | SHA contenido |',
    '|:---|:---|:---|:---|:---|:---|:---|',
    ...filas,
    '',
  ].join('\n');
}

/**
 * ¿Hay un comentario humano posterior a la ultima nota del agente?
 * `true` pendiente · `false` limpio · `null` NO SE PUEDE SABER — ningun comentario lleva marca,
 * y eso no se aprueba ni se bloquea: se declara (RULE-06). Se cura solo en cuanto el agente
 * escribe uno marcado, sin migracion y sin tocar la historia del issue.
 */
export function comentarioSinResponder(cuerpos) {
  const lista = cuerpos ?? [];
  if (!lista.length) return false;
  const ultimoMarcado = lista.map((c) => String(c).includes(MARCA_AGENTE)).lastIndexOf(true);
  if (ultimoMarcado === -1) return null;
  return lista.slice(ultimoMarcado + 1).some((c) => !String(c).includes(MARCA_AGENTE));
}

/**
 * PT-009 · El mensaje que `tracker` publica al cerrar un issue. Lleva la marca porque lo
 * escribe la herramienta, y sin ella `SUITE-R43` lo contaba como humano: la regla que PT-008
 * creó se cazó a sí misma en la primera ejecución posterior, sobre el propio tracker.
 *
 * Es una función y no una plantilla en línea para que un caso pueda comprobarlo sin hablar
 * con la plataforma — el defecto existía justo porque nadie comprobaba lo que se escribía.
 */
/**
 * PT-116 · FDGE-R55 · El cuerpo de una PARADA. Puro y exportado.
 *
 * Es una funcion y no una plantilla en linea por el motivo que PT-009 dejo escrito tres funciones
 * mas arriba: «para que un caso pueda comprobarlo SIN HABLAR CON LA PLATAFORMA — el defecto
 * existia justo porque nadie comprobaba lo que se escribia».
 *
 * NO PUEDE CASAR RE_NOTA (LEX-R30). «contarNotas» cuenta los reanclajes buscando «PHASE n -> m», y
 * una parada que no sea transicion inflaria ese recuento: la tarea pareceria tener transiciones que
 * no tuvo, y FDGE-R52 daria por escrito lo que nadie escribio. Hay un caso que lo vigila.
 *
 * QUE ESTABLECE: que el cuerpo lleva la marca de procedencia, el motivo, la explicacion y el
 *   desenlace, y que no se confunde con un reanclaje.
 * QUE NO ESTABLECE: que la explicacion sea cierta ni util. No es mecanizable, y decirlo es mas
 *   honesto que fingir que se comprueba (SUITE-R26).
 */
export function cuerpoDeParada({ id, motivo, texto, desenlace, abre = null }) {
  const L = [];
  L.push(MARCA_AGENTE);
  L.push('**PARADA** · `' + id + '` · motivo: `' + motivo + '` · desenlace: `' + desenlace + '`'
    + (abre ? ' · abre `' + abre + '`' : ''));
  L.push('');
  L.push(String(texto ?? '').trim());
  L.push('');
  L.push('---');
  L.push('');
  L.push('> `FDGE-R55` · Lo que solo esta en la conversacion no esta (`SUITE-R04`). Append-only:'
    + ' una correccion se escribe como parada NUEVA que referencia a esta (`SUITE-R09`).');
  return L.join(String.fromCharCode(10));
}

export const mensajeDeCierre = (a) =>
  `${a?.id} pasó a ${a?.status}. La evidencia está en el repositorio.

${MARCA_AGENTE}`;

/**
 * PT-122 · El comentario de cierre de un LOTE. Puro, exportado y DERIVADO.
 *
 * Los diecisiete comentarios del cierre de EP-019 se escribieron con `gh issue comment` a mano:
 * salieron SIN MARCA, y `SUITE-R43` los conto como humanos. Es CE-006 —el acto hecho fuera del
 * comando— con la agravante de que el acto se hizo diecisiete veces.
 *
 * TODO LO QUE AFIRMA SE DERIVA. El texto de EP-019 acerto version, tag y commit, pero escritos a
 * mano: acertar no es lo mismo que no poder equivocarse. Aqui la version sale del registro, el
 * tag de `git tag --sort=v:refname` y el commit de a donde apunta ese tag.
 *
 * Y SI EL TAG NO EXISTE, NO SE AFIRMA QUE EXISTE. Se dice que falta y de quien es el paso: el 8,
 * humano y despues del merge (SUITE-R06a). Un comentario que anuncia un tag inexistente es
 * exactamente la clase de afirmacion que este marco existe para impedir.
 */
export function comentarioDeCierreDeLote({ lote, version, tag, commit, tareas }) {
  const S = String.fromCharCode(10);
  const L = [];
  L.push(`## ${lote} cerrado`);
  L.push('');
  L.push(`- **Version de la suite** \`${version ?? 'SIN EVALUAR'}\``);
  if (tag) {
    L.push(`- **Tag** \`${tag}\`${commit ? ` → \`${commit}\`` : ' → **SIN EVALUAR**: el tag no resuelve'}`);
  } else {
    L.push(`- **Tag** \`v${version}\` **todavia no existe**. Crearlo es el paso 8: humano y`);
    L.push('  DESPUES del merge (`SUITE-R06a`). Este comentario no afirma que exista.');
  }
  const cerradas = (tareas ?? []).filter((x) => x?.terminal).length;
  L.push(`- **Tareas** ${cerradas} de ${(tareas ?? []).length} en estado terminal`);
  const vivas = (tareas ?? []).filter((x) => !x?.terminal);
  if (vivas.length) {
    L.push(`- **Siguen vivas** ${vivas.map((x) => `\`${x.id}\` (${x.status})`).join(' · ')}`);
  }
  L.push('');
  L.push('> Publicado por `tracker cierre`. Toda cifra de aqui se DERIVA del arbol y del registro:');
  L.push('> ninguna se escribe a mano (`FND-R14`). Los comentarios anteriores no se editan');
  L.push('> (`SUITE-R09`).');
  L.push('');
  L.push(MARCA_AGENTE);
  return L.join(S);
}

/**
 * PT-010 · El cuerpo de un issue. Puro y exportado.
 *
 * El anterior componia un solo texto para tarea y para lote, y como un EP no tiene campo
 * `epic` caia en el else y escribia «sin implementacion» SOBRE LA IMPLEMENTACION. Y enlazaba
 * en relativo: en el cuerpo de un issue eso resuelve contra la raiz del sitio, no contra el
 * repositorio, asi que era un 404. Nadie lo detecto con una comprobacion — lo vio una persona
 * mirando el tablero, y por eso «no habia nada» en el issue de EP-002.
 *
 * El enlace apunta a la RAMA POR DEFECTO, no a la de trabajo: un issue es un artefacto largo y
 * una rama es corta. Antes del merge da 404, y el cuerpo lo dice para que no parezca un error.
 *
 * Sin `url` no se inventa ninguna: se escribe la ruta sin enlace y se dice por que (RULE-06).
 */
/**
 * PT-079 · SUITE-R56 · El ref al que apunta un cuerpo ya publicado. `null` si no enlaza.
 *
 * Es lo que verify-fdge necesita para comprobar que ese ref sigue existiendo: 14 de los 16
 * enlaces del tablero apuntaban a ramas borradas y nada lo decia.
 */
export const refDeEnlace = (cuerpo) =>
  (String(cuerpo ?? '').match(/\/tree\/([^/)\s]+(?:\/[^/)\s]+)*?)\/changes\//) ?? [null, null])[1];

/**
 * PT-096 · El MARCADOR por el que un cuerpo se reconoce como escrito por esta herramienta.
 *
 * `refDeEnlace` devuelve `null` para DOS cosas distintas: un cuerpo del tracker que no enlaza, y
 * cualquier issue que el tracker no escribio. Sin distinguirlas, «reparar lo mudo» reescribiria
 * issues ajenos — peor que el defecto que arregla.
 *
 * Lo escribe `cuerpoDeIssue` y lo lee la reparacion, asi que hay un caso del arnes que ATA las
 * dos cosas: cambiar el texto rompe ese caso en vez de apagar la reparacion en silencio.
 */
export const MARCADOR_CUERPO = 'Intake, criterios de aceptación y evidencia:';
export const esCuerpoDelTracker = (cuerpo) => String(cuerpo ?? '').includes(MARCADOR_CUERPO);

/**
 * PT-096 · SUITE-R51 · SUITE-R56 · ¿Que le pasa al enlace de este cuerpo?
 *
 * La DECISION, separada del EFECTO. `repararEnlacesMuertos` habla con la plataforma y escribe, y
 * `compararEspejo` reporta: los dos hacen la MISMA pregunta y hasta aqui la respondian por
 * separado, con la misma guarda copiada —«if (ref && …)» alli, «if (!ref || …) continue» aca—.
 * Una pregunta, una fuente (SUITE-R38).
 *
 * Cinco resultados, y cada uno con nombre a proposito. `REPARAR_MUDO` no faltaba porque estuviera
 * mal decidido: faltaba porque no habia DONDE decidirlo. Y `ROTO_SIN_SALIDA` y `AJENO` existen
 * para que no se confundan con `OK`, que es justo lo que pasaba — los tres caian por el mismo
 * `continue` que un cuerpo sano.
 *
 * `MUDO_SIN_REF_DURABLE` es el freno: al abrir el issue el intake todavia no esta commiteado, asi
 * que `refDurableDe` responde `null` CON RAZON y no hay nada que enlazar. Exigirlo ahi seria
 * pedir un enlace a un commit que no existe.
 */
export function decisionDeEnlace(cuerpo, refExiste, durable) {
  if (!esCuerpoDelTracker(cuerpo)) return 'AJENO';
  const ref = refDeEnlace(cuerpo);
  if (ref) {
    if (refExiste && refExiste(ref) === false) return durable ? 'REPARAR_MUERTO' : 'ROTO_SIN_SALIDA';
    return 'OK';
  }
  return durable ? 'REPARAR_MUDO' : 'MUDO_SIN_REF_DURABLE';
}


/**
 * PT-104 · La maquina de estados que el tablero no decia.
 *
 * Lo pidio el firmante el 2026-08-13 —«usarlo hasta de maquina de estados para saber que va
 * cuando»— y `EP-007` entrego `tracker siguiente`, un COMANDO. Su propio cierre lo declaro:
 * «un comando no puede exigir haber sido llamado». El tablero es lo que se mira SIN acordarse
 * de nada, y no decia en que paso estabas.
 *
 * `FASES` ya declaraba las tres piezas —`nombre`, `produce`, `cierra`— y `queSigue` ya derivaba
 * los bloqueos. Aqui no se inventa ninguna: se PUBLICAN.
 *
 * No copia contenido (`SUITE-R35`): no hay segunda copia porque no hay texto propio. Todo se
 * recalcula de la allocation y del arbol en cada `abrir --aplicar`, asi que no puede divergir.
 *
 * Y la distincion que lo hace util es «deberia» contra «esta»: publicar que `PHASE 4` produce
 * seis archivos no vale nada; publicar CUALES DE LOS SEIS EXISTEN convierte el issue en algo
 * que puede contradecir a quien lo escribe.
 */
export function maquinaDeEstados(a, opciones = {}) {
  const { artefactos = null, bloqueos = [], avisos = [] } = opciones;
  if (esLote(a)) return [];
  const fase = Number(a?.phase);
  const tic = String.fromCharCode(96);
  if (!Number.isInteger(fase) || !FASES[fase]) {
    // RULE-06 · no saber no es permiso. Una fase ausente se DICE, no se supone cero: con `?? 0`
    // «PHASE 0» y «nadie lo escribio» daban el mismo numero (PT-004).
    return ['', '### Dónde está', '',
      '> La allocation **no declara ' + tic + 'phase' + tic + '**, así que no se puede decir en qué paso está.',
      '> ' + tic + 'SUITE-R58' + tic + ' · debió crearse con ' + tic + 'tracker asignar' + tic + ', que la escribe.'];
  }
  const aqui = FASES[fase];
  const antes = FASES[fase - 1] ?? null;
  const luego = FASES[fase + 1] ?? null;
  const cod = (s) => tic + s + tic;
  const l = ['', '### Dónde está', '', '| | |', '|:--|:--|'];
  l.push('| **Paso** | ' + cod('PHASE ' + fase) + ' · ' + aqui.nombre + ' |');
  l.push(antes
    ? '| **Entró cuando** | ' + antes.cierra + ' |'
    : '| **Entró cuando** | es el primer paso: no hay transición de entrada |');
  l.push('| **Sale cuando** | ' + aqui.cierra + ' |');
  l.push(luego
    ? '| **Después** | ' + cod('PHASE ' + (fase + 1)) + ' · ' + luego.nombre + ' |'
    : '| **Después** | es el último paso |');
  // Lo que la fase produce, y lo que de verdad hay. Sin la segunda columna esto seria una copia
  // de FASES; con ella es un contraste — y un contraste puede contradecir a quien lo escribe.
  if (aqui.produce.length) {
    l.push('', '**Produce este paso:**', '');
    for (const f of aqui.produce) {
      const hay = artefactos ? artefactos.has(f) : null;
      l.push('- ' + (hay === true ? '✔' : '·') + ' ' + cod(f) + (hay === false ? ' — todavía no' : ''));
    }
    if (artefactos === null) {
      l.push('', '> No se pudo mirar el árbol, así que no se sabe cuáles existen (' + cod('RULE-06') + ').');
    }
  }
  if (bloqueos.length) {
    l.push('', '**No puede avanzar:**', '');
    for (const b of bloqueos) l.push('- ' + b);
  }
  if (avisos.length) {
    l.push('', '**Avisos:**', '');
    for (const v of avisos) l.push('- ' + v);
  }
  return l;
}

export function cuerpoDeIssue(a, opciones = {}) {
  const { url, rama, ramaTrabajo, hayDirectorio, refDurable } = opciones;
  const dir = a?.slug ? `changes/${a.id}-${a.slug}` : `changes/${a?.id}`;
  // PT-036 · el enlace apunta a donde el contenido ESTA, no a donde estara.
  //
  // PT-010 lo fijo en la rama por defecto razonando que «un issue es un artefacto largo y una
  // rama es corta». El razonamiento es bueno y el resultado era un 404 EN EL MOMENTO EN QUE MAS
  // SE LEE: un issue se abre al empezar el trabajo, y entonces su contenido solo existe en la
  // rama de trabajo. Lo dijo quien lo intento abrir, no un caso.
  //
  // Mientras la allocation esta VIVA se enlaza la rama de trabajo, donde el contenido existe;
  // cuando llega a INTEGRATED se reenlaza a la rama por defecto, que es donde se queda. El
  // cuerpo se resincroniza en cada `abrir --aplicar`, asi que la transicion es automatica.
  const viva = VIVOS.has(a?.status);
  // PT-079 · SUITE-R56 · el rastro sobrevive a la rama.
  //
  // Antes: «ramaTrabajo», que es la rama en la que corre EL ESPEJO, no la de la tarea
  // enlazada. Dos consecuencias medidas el 2026-08-19 sobre el tablero real: el issue de
  // PT-072 apuntaba a la rama de PT-074 —otra tarea— y 14 de los 16 enlaces vivos daban 404,
  // porque FDGE-R19 borra la rama efimera al fusionar.
  //
  // No se perdia la documentacion —changes/PT-075 tiene sus 10 archivos en «trabajo»— sino el
  // ENLACE. Por eso el arreglo apunta a un ref DURABLE, que el contexto calcula: la rama de
  // integracion si el contenido ya esta ahi, y si no el COMMIT que lo contiene. Ninguno de los
  // dos desaparece.
  //
  // Sin ref durable NO se inventa una URL (RULE-06). PT-036 ya lo dejo escrito para el caso
  // vecino: «inventar una seria peor que no ponerla».
  // El ref durable es la UNICA fuente. El respaldo anterior —«ramaTrabajo, o main»— es
  // literalmente lo que producia los 14 enlaces muertos: apuntaba a algo que podia no contener
  // el directorio, o directamente no existir. Si no hay ref durable, no hay enlace.
  const ramaDelEnlace = refDurable ?? null;
  // PT-048 · un enlace a un directorio que NO EXISTE es un 404 en el unico artefacto que una
  // allocation aplazada tiene. `SUITE-R44` la exime de tener artefactos y `PT-036` dice donde
  // apunta el enlace: las dos correctas por separado, y juntas producian el 404.
  //
  // Se mira el DIRECTORIO, no el estado: un PT recien asignado tampoco lo tiene hasta que
  // `PHASE 1` lo crea, y con `status === 'DEFERRED'` como criterio ese seguiria fallando.
  // Es `RULE-06` aplicado a un dato que se puede mirar en vez de inferir.
  //
  // `=== false` y no `!hayDirectorio`: si el dato no viaja —una llamada antigua, un caso que no
  // lo pase— el comportamiento tiene que ser el de HOY. Un `undefined` no es un «no existe», y
  // tratarlo como tal apagaria el enlace en TODOS los cuerpos.
  const enlace = hayDirectorio === false
    ? 'Sin artefactos todavía: es una allocation **aplazada** (`SUITE-R44`). Cuando se retome, '
      + 'su `PHASE 1` crea el directorio y este cuerpo se resincroniza solo.'
    : (url && ramaDelEnlace
      ? `[\`${dir}/\`](${url}/tree/${ramaDelEnlace}/${dir})`
      // PT-079 · sin ref durable, la ruta va SIN ENLACE y se dice. Una URL a una rama que el
      // marco borra a proposito es peor que ninguna (RULE-06, SUITE-R56).
      : `\`${dir}/\` — en el repositorio, sin enlace: no hay ref durable que lo contenga`);

  const l = [];
  l.push(esLote(a)
    ? `**Implementación abierta** · ${a.title ?? a.slug ?? ''}`
    : `**${a?.type ?? 'PT'}** · severidad ${a?.severity ?? '—'} · ${a?.epic ? `de la implementación \`${a.epic}\`` : 'sin implementación asignada'}`);
  l.push('');
  // PT-096 · SUITE-R51 · la jerarquia es ESTRUCTURA, no prosa.
  //
  // Aqui se enumeraban las tareas del lote. PT-035 lo declaro defecto —«una tarea es SUB-ISSUE de
  // su lote, NO un enlace en su cuerpo: un enlace no da progreso, no cierra en cascada y no sale
  // en el arbol»—, añadio el anidamiento real… y no retiro la copia narrada. Convivieron: 14
  // issues de lote la llevaban al medirlo.
  //
  // Que `esLote` fuera falso para los tres ultimos lotes estaba TAPANDO esa violacion, no
  // causandola. Por eso el arreglo del predicado NO es hacer que la lista salga en tres sitios
  // mas: es retirarla, que es lo que SUITE-R51 pide desde que existe.
  //
  // La cabecera de lote se queda: eso es informacion DEL lote, no una segunda representacion de
  // su jerarquia.
  // PT-074 · SUITE-R35 · el registro asigna y la plataforma ESPEJA. El veredicto de viabilidad
  // es estado —lo escribe «tracker viabilidad --registrar» (FDGE-R54)— y no se espejaba: vivia
  // en REGISTRY.allocations[].viabilidad y era invisible desde el tablero. El firmante lo pidio
  // TRES veces antes de que nadie mirara donde estaba el hueco.
  //
  // Se espeja el VEREDICTO y su BASE, no el razonamiento: SUITE-R35 prohibe copiar contenido al
  // issue —dos copias del mismo texto divergen— y el porque sigue viviendo en changes/.
  //
  // La naturaleza de la cifra y el «medido_en» no son adorno: un veredicto sin decir contra que
  // se midio es lo que PT-058 corrigio. Y la consecuencia de MARGINAL y UNSAFE se dice porque
  // el issue existe para consultarse SIN abrir el repositorio: un veredicto sin consecuencia es
  // un dato que no sirve para decidir.
  //
  // Sin viabilidad NO se emite nada. Una allocation recien asignada no la tiene hasta G2, y
  // escribir «SIN EVALUAR» ahi seria inventar un dato donde solo hay un hueco (RULE-06).
  const v = a?.viabilidad;
  if (v?.veredicto) {
    l.push('');
    l.push(`Viabilidad (\`FDGE-R54\`): **${v.veredicto}** · coste ${v.coste?.valor ?? '—'} `
      + `(${v.coste?.naturaleza ?? 'SIN EVALUAR'})`
      + (v.medido_en ? ` · medida contra \`${String(v.medido_en).slice(0, 7)}\`` : ''));
    if (v.veredicto === 'MARGINAL') {
      l.push('> `MARGINAL` no prohíbe: obliga a trabajo **atomico** con checkpoint entre pasos.');
    }
    if (v.veredicto === 'UNSAFE') {
      l.push('> `UNSAFE` **DETIENE**: checkpoint, handoff y parada.');
    }
  }

  l.push(`Intake, criterios de aceptación y evidencia: ${enlace}`);
  if (!url) {
    l.push('');
    l.push('> No se pudo derivar la URL del repositorio, así que la ruta va sin enlace:');
    l.push('> inventar una sería peor que no ponerla.');
  } else if (hayDirectorio === false) {
    // PT-048 · sin enlace, la nota que EXPLICA el enlace sobra. Se quedo ahi en el primer
    // intento —el cuerpo decia «sin artefactos todavia» y debajo «el enlace apunta a…»— y lo
    // vio mirar el issue publicado, no leer el diff.
    l.push('');
    l.push('> Un aplazado no tiene intake ni ha recorrido fases: eso es lo que `SUITE-R44` quiere.');
    l.push('> Aplazarlo lo **pone** en el tablero, no lo saca.');
  } else if (!ramaDelEnlace) {
    // PT-096 · SEGUNDA instancia de lo que PT-048 arreglo tres lineas mas arriba: la nota que
    // EXPLICA el enlace se emitia tambien cuando no hay enlace, y ahi `ramaDelEnlace` es null.
    // El cuerpo publicado decia, en dos frases seguidas:
    //     «…sin enlace: no hay ref durable que lo contenga»
    //     «> El enlace apunta a `null`, que es donde el contenido existe ahora.»
    // Diez de los 115 cuerpos del tablero lo publicaban. PT-048 corrigio la rama hermana
    // (hayDirectorio === false) y no esta: arreglar la instancia y no el patron.
    //
    // Y dice QUE HACER, no solo que pasa: quien lee un issue quiere llegar al intake. RULE-06
    // obliga a no inventar el dato; no obliga a ser oscuro.
    l.push('');
    l.push('> Todavía no hay ref durable que lo contenga: el intake aún no está en ningún commit.');
    l.push('> Aparecerá en cuanto se integre — y si ya lo está, `tracker abrir --aplicar` lo republica.');
  } else {
    l.push('');
    // PT-096 · el texto se deriva de A DONDE APUNTA, no de si la allocation esta viva.
    //
    // Decia «la rama por defecto: aqui es donde se queda» para toda allocation terminal, y
    // refDurableDe prefiere la rama de INTEGRACION: los veinte cuerpos reparados quedaban
    // llamando «rama por defecto» a «trabajo», que no lo es. Un enlace correcto con una nota
    // falsa al lado es la misma averia que el «null» que esta tarea vino a quitar, en version
    // suave — y se vio mirando el issue publicado, no el diff.
    const esPorDefecto = ramaDelEnlace === (rama ?? 'main');
    l.push(esPorDefecto
      ? `> El enlace apunta a \`${ramaDelEnlace}\`, la rama por defecto: aquí es donde se queda.`
      : `> El enlace apunta a \`${ramaDelEnlace}\`, que es donde el contenido existe ahora. Al`);
    if (!esPorDefecto) l.push(`> integrarse pasará a \`${rama ?? 'main'}\` y este cuerpo se actualizará solo.`);
  }
  // PT-104 · la maquina de estados va ANTES del pie: el pie explica por que no se copia el
  // contenido, y esa aclaracion solo tiene sentido despues de haber dicho lo que SI se publica.
  l.push(...maquinaDeEstados(a, opciones));

  l.push('');
  l.push('> Este issue dice **qué está abierto** y **en qué paso**. Lo que se decidió y lo que se probó vive en el');
  l.push('> repositorio, versionado junto al código. **No se copia aquí**: dos copias del mismo');
  l.push('> texto divergen (`SUITE-R35`).');
  return l.join(String.fromCharCode(10));
}

/**
 * PT-035 · `SUITE-R51` · Que sub-issues le faltan a cada lote.
 *
 * La jerarquia ya existe en el registro —cada tarea declara su `epic`— y la plataforma la
 * contaba en PROSA, enlazando en el cuerpo del lote. Un enlace es texto: no da progreso, no
 * cierra en cascada y no sale en el arbol del tablero. Dos representaciones del mismo hecho, que
 * es justo lo que `SUITE-R35` existe para impedir.
 *
 * `yaAnidados` a `null` significa NO EVALUABLE —la plataforma no lo sabe decir—: entonces no se
 * afirma que falte nada, porque «no se» no es «no hay» (`RULE-06`).
 */
export function anidamientosQueFaltan(allocations, yaAnidados) {
  const faltan = [];
  const porId = new Map((allocations ?? []).map((a) => [a?.id, a]));
  for (const a of allocations ?? []) {
    if (!a?.epic || !a?.issue) continue;
    const padre = porId.get(a.epic);
    if (!padre?.issue) continue;
    const hijos = yaAnidados?.[padre.issue];
    if (hijos === null || hijos === undefined) continue;   // no evaluable para este padre
    if (!hijos.includes(a.issue)) faltan.push({ padre: padre.issue, hijo: a.issue, id: a.id, epic: a.epic });
  }
  return faltan;
}

/** Una nota de reanclaje declara una transición de fase (`FDGE-R52`), no es un comentario suelto. */
export const RE_NOTA = /PHASE\s*\d+\s*(?:→|->|a)\s*\d+|PHASE\s*\d+\s*→/i;
export const contarNotas = (textos) => (textos ?? []).filter((t) => RE_NOTA.test(String(t))).length;

/**
 * PT-024 · `SUITE-R46` · Qué issues pueden cerrarse SIN adelantarse a la rama por defecto.
 *
 * El tablero se deriva del registro (`SUITE-R35`), pero la compuerta corre sobre la rama por
 * defecto. Cerrar un issue mirando solo el registro de la rama de trabajo deja `main` diciendo
 * «DONE» —vivo— con el issue ya cerrado, y eso es una divergencia real: nueve salieron a la vez
 * tras el merge de EP-004 y EP-005.
 *
 * Y no era un despiste: el apunte `DONE → INTEGRATED` se escribe DESPUES de mergear, en la rama
 * de trabajo, asi que solo llega a la principal en el merge SIGUIENTE. Con ese orden la CI de
 * `main` fallaria tras cada merge, no solo tras aquel.
 *
 * `enPrincipal` es el registro de la rama por defecto, o `null` si no se pudo leer. `null` NO
 * se interpreta como permiso: sin saber lo que la principal sabe, no se cierra nada y se dice
 * por que (`RULE-06`, `SUITE-R38`) — un fallo mudo aqui volveria a romper la integracion.
 *
 * Devuelve `{ cerrables, adelantadas, evaluable }`.
 */
export function cerrablesSinAdelantarse(muertas, enPrincipal) {
  if (!Array.isArray(enPrincipal)) {
    return { cerrables: [], adelantadas: [], evaluable: false };
  }
  const estadoEnPrincipal = new Map(enPrincipal.map((a) => [a?.id, a?.status]));
  const cerrables = [];
  const adelantadas = [];
  for (const a of muertas ?? []) {
    // Si la principal no la conoce, la allocation nacio en esta rama: cerrar su issue no
    // contradice nada de lo que la principal afirma.
    if (!estadoEnPrincipal.has(a?.id)) { cerrables.push(a); continue; }
    const alla = estadoEnPrincipal.get(a.id);
    if (VIVOS.has(alla)) adelantadas.push({ ...a, statusEnPrincipal: alla });
    else cerrables.push(a);
  }
  return { cerrables, adelantadas, evaluable: true };
}

/**
 * PT-014 · En qué orden se crean los issues de una tanda.
 *
 * La dependencia va en UN SOLO sentido: el lote necesita que sus tareas tengan numero, y ellas no
 * necesitan nada de el. Creando en el orden del registro —donde el lote va primero— la relacion
 * se establecia cuando sus tareas aun no tenian numero: hacia falta repetir el comando.
 *
 * No se pide dos veces ni se pospone nada: se crea antes lo que no depende de nadie. Con la
 * dependencia en un sentido, un orden basta y no hay ciclo posible.
 *
 * PT-096 · el MOTIVO cambio y el orden NO. Este texto decia «el cuerpo del lote enumera sus
 * tareas con su numero», y esa enumeracion se ha retirado: era la copia narrada que SUITE-R51
 * prohibe. Lo que sigue necesitando el numero es el ANIDAMIENTO —`anidarSubIssues` pide el issue
 * hijo—, asi que el orden vale igual por una razon distinta. Se reescribe el porque en vez de
 * borrar la regla: un orden correcto con un motivo caduco es el que alguien quita el dia que lee
 * el motivo y no lo encuentra.
 *
 * Estable dentro de cada grupo (`Array.prototype.sort` lo es desde ES2019): dos tareas
 * conservan el orden del registro, que es el que el humano ve.
 */
export const ordenDeApertura = (pendientes) =>
  [...(pendientes ?? [])].sort((x, y) => (esLote(x) ? 1 : 0) - (esLote(y) ? 1 : 0));

const ARGS = process.argv.slice(2);
const ACCION = ARGS[0] ?? 'espejo';
const APLICAR = ARGS.includes('--aplicar');
// PT-039 · el identificador de `notas PT-NNN` o `siguiente EP-NNN` no es una ruta: sin excluirlo,
// `tracker siguiente EP-011` resolvia ROOT como el directorio «EP-011» y no encontraba el
// registro. Solo se excluia PT-NNN; `siguiente` acepta las dos formas desde PT-030.
// Lo encontro USAR la herramienta, no leerla.
// `tracker notas PT-004 .`
// resolvia ROOT como el directorio «PT-004» y no encontraba el registro.
// PT-053 · y el VALOR de una bandera tampoco es una ruta. `avanzar PT-053 --a 6 --nota "..."`
// resolvia ROOT como el directorio «6». Es la TERCERA vez en EP-014 que el valor de una bandera
// se cuela en el posicional —`-q` en PT-049, `--solo` en PT-050, `--a` aqui— y las tres veces lo
// dijo EJECUTARLO, sabiendo del defecto. Por eso las banderas con valor se declaran en UN sitio:
// la lista es lo que hace que la cuarta no repita el error.
// PT-064 · «--de» entra aqui. Septima vez que un argumento nuevo se cuela por la deteccion de
// ROOT, y la primera con un valor que EMPIEZA en mayuscula —un nombre de persona—, que
// ES_ETIQUETA no filtra. El patron es siempre el mismo: una opcion con valor que no se
// declara aqui deja su valor suelto entre los posicionales.
// PT-103 · los cuatro de «asignar» entran aqui. El comentario de abajo ya avisaba de que era la
// CUARTA vez que un argumento nuevo se colaba por aqui; esta fue la QUINTA, y se noto en el acto
// porque «--tipo BUG» hizo que se buscara el registro dentro de ./BUG. Un flag que se añade sin
// declararse aqui convierte su VALOR en la raiz del proyecto.
// PT-116 · LA REGLA DE FORMA, por fin. Van OCHO veces que un argumento nuevo se cuela por aqui
// —-q (PT-049), --solo (PT-050), --a (PT-053), las etiquetas y --de (PT-057), los subcomandos
// (PT-060), --slug (PT-062), --de otra vez (PT-064), y --motivo/--texto/--desenlace/--abre aqui—
// y las ocho se arreglaron IGUAL: anadiendo el flag nuevo a una lista escrita a mano.
//
// El comentario de PT-057 ya decia, hace cuatro instancias, que «se arreglan con una regla de
// FORMA, no con un caso mas». No se hizo, y por eso hay ocho. Esta es la regla de forma:
//
//   EL VALOR DE UN FLAG NUNCA ES LA RAIZ.
//
// Se deriva de la POSICION —lo que sigue a un «--algo»— en vez de enumerar cuales llevan valor.
// Un flag booleano seguido de una ruta deja de poder pasar la ruta ahi, y eso es correcto: la
// raiz es el PRIMER posicional, y ponerla detras de un booleano era ambiguo desde siempre.
//
// CON_VALOR se conserva porque hay un caso que la nombra y porque documenta cuales llevan valor,
// pero YA NO ES LA GUARDA: la guarda es la forma.
const CON_VALOR = new Set(['--a', '--nota', '--slug', '--de', '--epica', '--reentrada', '--revision', '--dueno',
  '--tipo', '--severidad', '--epica', '--titulo',
  '--motivo', '--texto', '--desenlace', '--abre',
  // PT-121 · CE-003, la clase con SIETE instancias declaradas: una bandera con valor que no
  // esta aqui hace que su valor se tome por la raiz del proyecto. Van al entrar, no despues.
  '--firmante', '--compuerta', '--fecha']);
const ES_ETIQUETA = /^[A-Z][A-Z_]*$/;
const SUBCOMANDOS = new Set(['abrir', 'cerrar', 'ver']);
const ROOT = resolve(ARGS.slice(1).find((a, i, xs) =>
  !a.startsWith('--')
  && !/^(?:PT|EP)-\d+$/.test(a)
  && !ES_ETIQUETA.test(a)
  && !SUBCOMANDOS.has(a)
  // La regla de FORMA: lo que sigue a un flag es su valor, sea cual sea el flag.
  && !String(xs[i - 1] ?? '').startsWith('--')) ?? process.cwd());
const IMPL = join(ROOT, 'docs', 'implementation');


const errores = [];
const notas = [];
const fail = (r, m) => errores.push({ r, m });
const di = (s = '') => console.log(s);

const leerJSON = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };

// ── Qué plataforma, y hay acceso ────────────────────────────────────────────
// La plataforma se DECLARA en el registro. Deducirla de la URL del remoto adivinaría, y
// adivinar es como se acaba escribiendo en el sitio equivocado.
const ADAPTADORES = {
  github: {
    disponible: () => { try { execFileSync('gh', ['auth', 'status'], { stdio: 'pipe' }); return true; } catch { return false; } },
    comoAutenticarse: 'gh auth login',
    abiertos() {
      const out = execFileSync('gh', ['issue', 'list', '--state', 'open', '--limit', '500',
        // PT-079 · «body» tambien: sin el, el espejo no puede ver a donde apunta el enlace
        // publicado, y 14 de 16 apuntaban a ramas borradas sin que nada lo dijera (SUITE-R56).
        '--json', 'number,title,state,labels,body'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return JSON.parse(out);
    },
    crear(titulo, cuerpo, etiquetas) {
      const args = ['issue', 'create', '--title', titulo, '--body', cuerpo];
      for (const e of etiquetas ?? []) args.push('--label', e);
      const out = execFileSync('gh', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
      return Number(out.split('/').pop());
    },
    // PT-035 · una tarea de un lote es un SUB-ISSUE de su lote, no un enlace en su cuerpo.
    // El enlace es texto: no da progreso, no cierra en cascada y no aparece en el arbol del
    // tablero. La jerarquia estaba en el registro y la plataforma la contaba en prosa —dos
    // representaciones del mismo hecho, que es lo que SUITE-R35 existe para impedir.
    //
    // La API pide el ID del issue, no su numero: son cosas distintas y confundirlas da un 422
    // silencioso si nadie lee la respuesta.
    idDeIssue(numero) {
      const out = execFileSync('gh', ['api', `repos/{owner}/{repo}/issues/${numero}`, '--jq', '.id'],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
      return Number(out);
    },
    subIssues(numeroPadre) {
      try {
        const out = execFileSync('gh', ['api', `repos/{owner}/{repo}/issues/${numeroPadre}/sub_issues`,
          '--jq', '.[].number'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
        return out ? out.split(/\r?\n/).map(Number) : [];
      } catch { return null; }          // no evaluable: no se afirma que no haya (RULE-06)
    },
    anidar(numeroPadre, numeroHijo) {
      const id = this.idDeIssue(numeroHijo);
      execFileSync('gh', ['api', '-X', 'POST', `repos/{owner}/{repo}/issues/${numeroPadre}/sub_issues`,
        '-F', `sub_issue_id=${id}`], { cwd: ROOT, stdio: 'pipe' });
    },
    // PT-137 · un issue solo puede colgar de UN padre. Al reasignar la epica con «retomar
    // --epica», el anidamiento seguia bajo el lote viejo y «anidar» fallaba sin decir por que:
    // la reasignacion quedaba a medias entre el registro y el tablero (SUITE-R35).
    desanidar(numeroPadre, numeroHijo) {
      const id = this.idDeIssue(numeroHijo);
      execFileSync('gh', ['api', '-X', 'DELETE', `repos/{owner}/{repo}/issues/${numeroPadre}/sub_issue`,
        '-F', `sub_issue_id=${id}`], { cwd: ROOT, stdio: 'pipe' });
    },
    cerrar(numero, motivo) {
      execFileSync('gh', ['issue', 'close', String(numero), '--comment', motivo],
        { cwd: ROOT, stdio: 'pipe' });
    },
    comentarios(numero) {
      const out = execFileSync('gh', ['issue', 'view', String(numero), '--json', 'comments'],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return (JSON.parse(out).comments ?? []).map((c) => c.body ?? '');
    },
    // PT-053 · el UNICO acto irreversible de `avanzar`, y por eso va el ultimo. Publicar la nota
    // no se puede deshacer; escribir cuatro archivos si.
    comentar(numero, cuerpo) {
      execFileSync('gh', ['issue', 'comment', String(numero), '--body', cuerpo],
        { cwd: ROOT, stdio: 'pipe' });
    },
    // SUITE-R42 · ¿hay pull request abierto para esta rama? Solo lectura: el agente NO abre el
    // PR ni lo fusiona. Comprobar que exista es lo que hace verificable dónde se propuso G4;
    // abrirlo se describe (EXEC-R07) y fusionarlo es humano sin excepción (EXEC-R04).
    prDeLaRama(rama) {
      const out = execFileSync('gh', ['pr', 'list', '--state', 'open', '--head', rama,
        '--json', 'number'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return JSON.parse(out).map((p) => p.number);
    },
    // FND-R30 · `abrir` necesita estas etiquetas y `gh issue create` falla sin ellas. Se
    // descubrió abriendo los issues de EP-001: no existían y hubo que crearlas a mano.
    etiquetas() {
      try {
        const out = execFileSync('gh', ['label', 'list', '--json', 'name'],
          { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
        return JSON.parse(out).map((l) => l.name);
      } catch { return []; }
    },
    // PT-010 · de donde sale el enlace absoluto. Si no se puede derivar, se devuelve null y el
    // cuerpo escribe la ruta SIN enlace: inventar una URL seria peor que no ponerla (RULE-06).
    repo() {
      try {
        const out = execFileSync('gh', ['repo', 'view', '--json', 'url,defaultBranchRef'],
          { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
        const j = JSON.parse(out);
        return { url: j.url ?? null, rama: j.defaultBranchRef?.name ?? null };
      } catch { return { url: null, rama: null }; }
    },
    editarCuerpo(numero, cuerpo) {
      execFileSync('gh', ['issue', 'edit', String(numero), '--body', cuerpo],
        { cwd: ROOT, stdio: 'pipe' });
    },
    etiquetasDeIssue(numero) {
      const out = execFileSync('gh', ['issue', 'view', String(numero), '--json', 'labels'],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return (JSON.parse(out).labels ?? []).map((l) => l.name);
    },
    // PT-079 · el cuerpo de UN issue, abierto o cerrado. `abiertos()` no sirve para reparar el
    // enlace de una tarea terminada: su issue esta cerrado, y es justo el que se rompe.
    cuerpoRemoto(numero) {
      const out = execFileSync('gh', ['issue', 'view', String(numero), '--json', 'body'],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return JSON.parse(out).body ?? '';
    },
    etiquetar(numero, poner, quitar) {
      const args = ['issue', 'edit', String(numero)];
      for (const e of poner ?? []) args.push('--add-label', e);
      for (const e of quitar ?? []) args.push('--remove-label', e);
      execFileSync('gh', args, { cwd: ROOT, stdio: 'pipe' });
    },
    crearEtiqueta(nombre) {
      execFileSync('gh', ['label', 'create', nombre, '--description',
        `Espejo de REGISTRY.json (SUITE-R35) · ${nombre}`], { cwd: ROOT, stdio: 'pipe' });
    },
  },
  azure: {
    disponible: () => { try { execFileSync('az', ['--version'], { stdio: 'pipe' }); return true; } catch { return false; } },
    comoAutenticarse: 'az login && az extension add --name azure-devops',
    abiertos() {
      throw new Error('El adaptador de Azure DevOps declara el contrato y no lo implementa todavía. '
        + 'Se escribe contra un caso real, no contra ninguno: es lo que evitó que el de GitHub '
        + 'naciera con suposiciones. El contrato está en LEXICON §tracker.');
    },
    crear() { return ADAPTADORES.azure.abiertos(); },
    cerrar() { return ADAPTADORES.azure.abiertos(); },
  },
};

/**
 * Qué hacer antes de tocar nada, según lo que el proyecto declara y el acceso que hay.
 * `sonda` responde si la plataforma es alcanzable; se inyecta para poder probar la decisión
 * sin depender de qué binarios estén instalados en la máquina que ejecuta el arnés.
 *
 *   0  declarada y con acceso        2  sin plataforma declarada — elección legítima
 *   3  declarada y SIN acceso        ← FND-R30
 *
 * `2` y `3` estaban fundidos en `2` y son decisiones OPUESTAS: una es una elección del
 * proyecto, la otra una precondición incumplida. El código de salida es el contrato que
 * consumen las compuertas, así que tiene que distinguirlas.
 */
export function decidirSalida(reg, sonda, adaptadores = ADAPTADORES) {
  const p = reg?.tracker?.plataforma ?? null;
  if (!p) {
    return { codigo: 2, plataforma: null, mensaje: [
      'El proyecto no declara plataforma de trabajo en REGISTRY.tracker.plataforma.', '',
      '  "tracker": { "plataforma": "github" }     o  "azure"', '',
      'Sin ella el estado vive solo en el repositorio, que sigue siendo válido: la plataforma',
      'responde «qué está abierto», no «qué se decidió». Declararla es opcional y humano.',
    ].join('\n') };
  }
  const ad = adaptadores[p];
  if (!ad) {
    return { codigo: 2, plataforma: p,
      mensaje: `Plataforma desconocida: ${p}. Conocidas: ${Object.keys(adaptadores).join(', ')}` };
  }
  if (!(sonda ?? ad.disponible)()) {
    return { codigo: 3, plataforma: p, mensaje: [
      `Plataforma ${p} declarada y sin acceso desde aquí.`,
      `  → ${ad.comoAutenticarse}`, '',
      'La credencial se comprueba ANTES de necesitarla (FND-R30): descubrirlo a mitad de sesión',
      'es perder la sesión. Esto no es «el espejo no cuadra» — es que nadie pudo mirar.',
    ].join('\n') };
  }
  return { codigo: 0, plataforma: p, mensaje: null };
}

// ─── El programa. Solo corre si me ejecutan directamente ────────────────────
// Importarme para probar la lógica de arriba no debe leer un registro, abrir un proceso ni
// exigir credenciales. Sin este guard, importar el módulo ejecutaba la herramienta entera.
// ── PT-057 · la referencia de coste ─────────────────────────────────────────
//
// El umbral de AC-03. Es un JUICIO, no un resultado: nada demuestra que cinco sea el numero.
// Vive aqui, con nombre, para que se pueda DISCUTIR — no enterrado dentro de un `if`.
//
// Lo que si esta medido es que decide. Con cinco: dan referencia BUG/STANDARD (13),
// CHORE/STANDARD (13), BUG/TRIVIAL (7) y FEATURE/STANDARD (6); se quedan sin ella
// INVESTIGATION/STANDARD, CHORE/TRIVIAL y CHORE/SIMPLE (1 tarea cada uno) y BUG/SIMPLE (3).
export const MINIMO_REFERENCIA = 5;

/**
 * De QUIEN es un commit. El primer PT del ASUNTO, y solo del asunto.
 *
 * PHASE 2 lo midio: 61 de 162 commits nombran mas de un PT y uno nombra DIEZ, porque el cuerpo
 * cita las tareas anteriores —«CORRIGE PT-052», «el mismo defecto que PT-023 encontro»— y eso es
 * lo CORRECTO en una bitacora append-only (SUITE-R09). Atribuir por `--grep` daba a una tarea el
 * trabajo de otras, y con esa medicion BUG/TRIVIAL y BUG/STANDARD salian identicos HASTA LA
 * LINEA: 5 commits, 65 archivos, 2708 lineas los dos. Una cifra falsa con toda la autoridad de
 * un numero derivado del historial real.
 */
export const duenoDe = (asunto) => (String(asunto ?? '').match(/PT-\d{3}/) ?? [null])[0];

/**
 * Mediana y rango. NUNCA media.
 *
 * Los grupos son de 6 a 13 tareas y la dispersion llega a un factor de diez —BUG/TRIVIAL va de
 * 242 a 2591 lineas—: una media la arrastra un solo caso. Y el rango viaja SIEMPRE con la
 * mediana, porque una cifra central sin dispersion se lee como una prediccion.
 */
export function resumen(xs) {
  const v = [...(xs ?? [])].map((x) => Number(x) || 0).sort((a, b) => a - b);
  if (!v.length) return null;
  const mediana = v.length % 2
    ? v[(v.length - 1) / 2]
    : Math.round((v[v.length / 2 - 1] + v[v.length / 2]) / 2);
  return { mediana, min: v[0], max: v[v.length - 1], n: v.length };
}

/**
 * La referencia de coste de un tipo de tarea, DERIVADA de las cerradas.
 *
 * `cerradas` son objetos {id, type, complexity, commits, archivos, lineas} que quien llama ya
 * derivo de git y del registro: esta funcion no toca git ni el disco.
 *
 * TRES resultados, como `estadoDelArbol`: hay referencia, hay datos pero POCOS, y no hay nada.
 * Las tres situaciones son distintas y por eso las tres respuestas lo son. Devolver cero o NaN
 * en lugar de `null` los meteria en PT-058 y PT-059 COMO SI FUERAN MEDIDAS, que es exactamente
 * lo que PT-056 acaba de demostrar que es peor que no tener el dato.
 */
export function costeDe(cerradas, opciones = {}) {
  const { tipo = null, complejidad = null, minimo = MINIMO_REFERENCIA } = opciones;
  const grupo = (cerradas ?? []).filter((c) =>
    (!tipo || c?.type === tipo) && (!complejidad || c?.complexity === complejidad));
  const base = { tipo, complejidad, casos: grupo.length, minimo };
  if (!grupo.length) {
    return { ...base, referencia: null, motivo: 'ninguna tarea cerrada de este tipo' };
  }
  if (grupo.length < minimo) {
    // Se enseñan los casos EN CRUDO. No es lo mismo no tener dato que tener pocos, y esconder
    // los pocos que hay obligaria a ir a buscarlos a mano justo cuando menos se sabe.
    return {
      ...base,
      referencia: null,
      motivo: `solo ${grupo.length}, y hacen falta ${minimo}`,
      casos_crudos: grupo.map((c) => ({ id: c.id, commits: c.commits, archivos: c.archivos, lineas: c.lineas })),
    };
  }
  const m = (campo) => resumen(grupo.map((c) => c?.[campo]));
  return { ...base, referencia: { commits: m('commits'), archivos: m('archivos'), lineas: m('lineas') } };
}

/** Funcion PURA: el checkpoint que corresponde a una allocation, dado lo que git dice. */
/**
 * PT-056 · STATE_MISMATCH · ¿el arbol CORRESPONDE a lo que el checkpoint declara?
 *
 * PT-052 dejo el `sha` y verify-fdge exige que sea ALCANZABLE. Eso impide la averia obvia —un
 * checkpoint que apunta a nada— y NO impide la peligrosa: un sha real que describe un arbol que ya
 * no existe. Ese MIENTE SIN QUE NADA LO NOTE, y el presupuesto, la compuerta y el handoff de
 * EP-015 decidirian sobre el.
 *
 * SOLO `sha` y `rama` sostienen la correspondencia. `sucio` y `archivos` describen PROGRESO:
 * medido en PHASE 2, la lista paso de 3 a 5 archivos con el sha intacto en el tiempo de escribir
 * tres parrafos. Si fueran criterio, la discrepancia seria el ESTADO NORMAL y el aviso se
 * ignoraria desde el primer dia — y entonces el dia que fuera real tampoco se leeria.
 *
 * TRES resultados, no dos. `corresponde: null` cuando no hay checkpoint: no tener foto y tener una
 * foto equivocada son cosas distintas, y es RULE-06 en la forma que este repositorio ya usa.
 *
 * NO repara. Reescribir el checkpoint al detectar el desfase borraria la unica prueba de que hubo
 * divergencia, y decidir si el arbol o la foto es lo bueno es humano (SUITE-R06).
 */
export function estadoDelArbol(cp, git = {}) {
  if (!cp) return { corresponde: null, pt: null, discrepancias: [], motivo: 'sin checkpoint: no hay nada que contrastar' };
  // PT-094 · Una tarea TERMINAL no tiene arbol contra el que contrastar, y su rama se borro al
  // fusionarse. El propio checkpoint de PT-092 lo llevaba escrito dentro —«PT-092 ya es
  // INTEGRATED. Lo cerrado es evidencia, no estado (SUITE-R36)»— mientras esta funcion lo
  // evaluaba como estado y dejaba `main` en rojo, bloqueando la publicacion.
  //
  // `DONE` NO cuenta como terminal, y eso es lo que impide que el arreglo apague la comprobacion:
  // un PT en DONE espera G4 con su rama viva, y ahi un sha que describe otro arbol SI miente.
  // ESTADOS_TERMINALES ya excluye DONE por esa misma razon (PT-085), asi que la exclusion se
  // hereda en vez de escribirse otra vez — SUITE-R38.
  if (ESTADOS_TERMINALES.has(String(cp.status))) {
    return {
      corresponde: null,
      pt: cp.pt ?? null,
      discrepancias: [],
      motivo: `${cp.pt ?? 'la tarea'} esta en ${cp.status}: lo cerrado es evidencia, no estado (SUITE-R36). `
        + 'Su rama se borro al integrar y no hay arbol vivo contra el que contrastar.',
    };
  }
  const d = [];
  // No se contrasta lo que no se declaro: un checkpoint con `sha: null` ya lo avisa PT-052.
  //
  // Y `sha !== HEAD` NO es, por si solo, una discrepancia. PHASE 2 lo midio: las tareas de EP-014
  // hicieron hasta DIEZ commits contra NUEVE transiciones de fase, asi que la ventana en la que el
  // sha declarado ya no es HEAD es el ESTADO HABITUAL entre transiciones. Exigir igualdad haria
  // saltar el aviso despues de cada commit — y un aviso que salta siempre no se lee el dia que es
  // cierto, que es justo lo que esta comprobacion existe para impedir.
  //
  // Lo que distingue es de que HISTORIA es: un checkpoint cuyo commit es ANTECESOR del actual
  // describe un estado del que el de ahora desciende — va por detras, no miente. Uno que no lo es
  // esta en otra rama o en una historia reescrita, y ahi si.
  //
  // `descendiente` lo deriva quien llama (`git merge-base --is-ancestor`): esta funcion no toca
  // git. Si nadie lo derivo llega `null`, y entonces un sha distinto SI cuenta: no poder demostrar
  // que desciende no es haberlo demostrado.
  if (cp.sha && git.sha && cp.sha !== git.sha && git.descendiente !== true) {
    d.push({ campo: 'sha', declarado: cp.sha, real: git.sha });
  }
  // `git rev-parse --abbrev-ref HEAD` devuelve la cadena «HEAD» cuando el repositorio esta en
  // detached HEAD, que es EXACTAMENTE lo que deja `actions/checkout` en CI. Eso no es el nombre de
  // una rama: es no poder leerlo, y tratarlo como valor hacia que la comprobacion se disparara
  // contra si misma en cada PR. Lo encontro CI en el primer PR de PT-056, no yo.
  const ramaReal = git.rama === 'HEAD' ? null : git.rama;
  // PT-094 · AC-09 · la rama CORROBORA, no dispara sola.
  //
  // Encontrado ejecutando el propio G4 de esta tarea: al fusionarse el PR de revision su rama se
  // borro, y el checkpoint quedo declarando una rama muerta con el trabajo YA CONTENIDO en el
  // arbol. Rojo en `trabajo`, y rojo otra vez en `main` tras el merge — con otro nombre de rama
  // cada vez. Toda fusion invalidaba el checkpoint, que es el caso NORMAL y no una divergencia.
  //
  // El criterio que ya usa `sha` es el bueno y no estaba aplicado aqui: lo que distingue no es la
  // igualdad, es DE QUE HISTORIA es. Si el commit declarado esta contenido en esta historia, el
  // checkpoint describe un estado pasado DE ESTA historia y el nombre de rama es una etiqueta
  // vieja, no una divergencia. Si NO lo esta, entonces si: otra rama corrobora otra historia.
  //
  // Deroga la decision de PT-056 de que `rama` disparara por si sola. No era gratuita —queria
  // cazar «estas en otra rama»— pero midiendo salio que el caso que cazaba de verdad era el
  // legitimo: cambiar de rama dentro de la misma historia pasa en CADA merge.
  const otraHistoria = d.some((x) => x.campo === 'sha');
  if (otraHistoria && cp.rama && ramaReal && cp.rama !== ramaReal) {
    d.push({ campo: 'rama', declarado: cp.rama, real: ramaReal });
  }
  return { corresponde: d.length === 0, pt: cp.pt ?? null, discrepancias: d };
}

/** El texto de una discrepancia. Dice CUAL es y PROPONE el comando — no lo ejecuta (AC-04, AC-05). */
export function textoDiscrepancia(e) {
  const filas = e.discrepancias.map((x) => {
    const corto = (s) => (/^[0-9a-f]{40}$/.test(String(s)) ? String(s).slice(0, 7) : String(s));
    return `${x.campo.padEnd(6)} declarado ${corto(x.declarado)}   real ${corto(x.real)}`;
  });
  return [
    `STATE_MISMATCH · el arbol no corresponde al checkpoint de ${e.pt ?? '¿?'} (LEX-R26):`,
    ...filas.map((f) => `  ${f}`),
    'Reanudar con esta discrepancia es una DECISION HUMANA (SUITE-R06). Si el checkpoint esta',
    `viejo y el arbol es el bueno:  tracker checkpoint ${e.pt ?? 'PT-NNN'}`,
  ].join('\n');
}

export function checkpointDe(alloc, git = {}) {
  if (!alloc) return null;
  const r = queSigue(alloc);
  const sha = git.sha ?? null;
  return {
    pt: alloc.id,
    type: alloc.type ?? null,
    epic: alloc.epic ?? null,
    status: alloc.status ?? null,
    phase: alloc.phase ?? null,
    fase: r.nombre ?? null,
    // PT-056 · la rama DECLARADA solo vale si existe. Al integrar, la rama de tarea se borra y el
    // checkpoint pasaba a afirmar una referencia muerta — que es exactamente lo que STATE_MISMATCH
    // existe para impedir. Quien llama dice si sigue viva; si no lo dice, se cree lo declarado.
    rama: (git.ramaDeclaradaViva === false ? git.rama : (alloc.branch ?? git.rama)) ?? null,
    sha,
    sha_corto: sha ? sha.slice(0, 7) : null,
    sucio: git.sucio ?? null,
    archivos: git.archivos ?? [],
    compuerta: r.compuerta ?? null,
    produce: r.produce ?? [],
    siguiente: r.siguiente ?? null,
    generado: git.fecha ?? null,
  };
}

/**
 * PT-098 · SUITE-R08 · LEXICON §5.1 · ¿el arbol sostiene el «INTEGRATED» que el registro afirma?
 *
 * LEXICON define INTEGRATED como «mergeado a la linea principal»: es un hecho del ARBOL, no una
 * opinion del registro. Y `avanzar` lo escribia por el mero hecho de que alguien pidiera la
 * ultima fase — sin mirar nada.
 *
 * Eso apaga SEIS comprobaciones de verify-fdge que se eximen de lo terminal. La exencion es
 * CORRECTA —existe para no exigir bitacora retroactiva a lo integrado antes de la 5.1.0— y lo
 * que fallaba era el dato que la dispara. INC-011 de la calculadora lo midio: al corregir dos
 * estados a DONE se encendieron cinco reglas y CUATRO salieron en rojo sobre trabajo del dia
 * anterior, mientras «verify-fdge --all» daba verde todos los dias.
 *
 * Un falso rojo se investiga; un falso VERDE se archiva.
 *
 * TRES valores y no dos, y el tercero es el que importa:
 *   true    su changes/ esta en la rama por defecto
 *   false   esta en la de integracion pero NO en la principal
 *   null    no se puede saber  ->  SIN EVALUAR (RULE-06: no saber no es permiso, pero
 *           tampoco es una acusacion). Un clon superficial o una rama sin traer no dicen
 *           nada del estado, y PT-056 pago DOS veces por comprobaciones que se ponian en
 *           rojo en CI por el entorno y no por el hecho.
 *
 * NO necesita que la allocation declare rama, que es lo que hacia parecer inviable la
 * comprobacion: 58 de las 91 INTEGRATED de este registro no la declaran. Pregunta por el
 * DIRECTORIO, igual que refDurableDe — el mecanismo que PT-096 construyo.
 */
export function estadoTerminalDe(a, integrado) {
  // La guarda que ya habia se CONSERVA: un CLOSED o un REVERTED no vuelven a INTEGRATED
  // porque alguien avance de fase.
  if (ESTADOS_TERMINALES.has(String(a?.status))) return null;
  // null y false escriben DONE: no se afirma un merge que no consta. Y DONE no es una
  // acusacion — es el estado correcto de algo terminado que aun no consta integrado, y el
  // que SUITE-R46 pide apuntar ANTES de mergear (FDGE-R34: «G4 exige DONE»).
  return integrado === true ? 'INTEGRATED' : 'DONE';
}

/**
 * PT-099 · LEX-R08 (H) · FDGE-R26 · LEXICON §5.1 · la transicion de un BUG la aplica el COMANDO.
 *
 * LEXICON declara «IN_REVIEW --> VALIDATION_PENDING : tipo BUG · siempre» y FDGE-R26 dice que un
 * BUG «transita a VALIDATION_PENDING y ahi SE DETIENE: solo un humano lo lleva a DONE». PHASES
 * lo situa sin ambiguedad en PHASE 7 · Validacion: «BUG -> VALIDATION_PENDING y PARA».
 *
 * Y no lo aplicaba nadie. Medido: 51 BUG en este registro y CERO han pasado por ahi. Los tres en
 * DONE son PT-096, PT-097 y PT-098 —las tareas de este mismo lote— y los tres se escribieron A
 * MANO, declarando la excepcion cada vez, porque el comando no lo hacia.
 *
 * Ningun verificador cita LEX-R08. FDGE-R26 vigila la SALIDA —un BUG que YA esta en DONE— y nadie
 * vigilaba la ENTRADA: un BUG que llega a PHASE 9 con otro estado no esta en DONE, asi que la
 * comprobacion no lo mira y «--all» lo verifica limpio. Es la forma de PT-096: una comprobacion
 * escrita para un fallo no ve su AUSENCIA.
 *
 * EXTIENDE estadoTerminalDe en vez de añadir un segundo sitio que escriba «status». PT-098 acaba
 * de crear el unico que habia; un segundo seria la averia de SUITE-R38 cometida UNA TAREA despues
 * de arreglarla.
 *
 * La FASE avanza; el ESTADO se detiene. FDGE-R26 dice que el BUG «se detiene», y lo que se
 * detiene es el estado: el trabajo siguio, asi que la fase sube. Confundirlos fue lo que se
 * rechazo en PT-098 (A-1) y volvia a aparecer aqui.
 *
 * Devuelve null = «no se toca». Misma convencion que estadoTerminalDe.
 */
export function estadoDeFase(a, destino, ctx = {}) {
  // La fase de validacion se identifica por su NOMBRE en FASES, no por un 7 suelto: si alguien
  // renumera las fases, un literal se apagaria en silencio (el riesgo que PT-096 documento con
  // su marcador). Hay un caso que ata el numero al nombre.
  const faseValidacion = ctx.faseValidacion
    ?? Number(Object.keys(FASES).find((n) => FASES[n].nombre === 'Validación'));
  const tipo = String(a?.type ?? '');
  const st = String(a?.status ?? '');
  if (tipo === 'BUG' && Number(destino) === faseValidacion
      && st !== 'DONE' && !ESTADOS_TERMINALES.has(st)) {
    // Un BUG que YA esta en DONE no vuelve atras: deshacer una firma humana de G3 al avanzar de
    // fase seria peor que no aplicar la transicion.
    return 'VALIDATION_PENDING';
  }
  // PT-105 · EL PELDANO DE EN MEDIO, que faltaba y no lo parecia.
  //
  // PT-098 puso el de arriba —el terminal, derivado del arbol— y PT-099 el de abajo —la parada
  // de un BUG—. Entre los dos quedo un hueco que ninguno de los dos podia ver, porque cada uno
  // resolvia su propio caso: un no-BUG que cierra Validacion con G3 y entra en Persistencia NO
  // pasaba a DONE, y FDGE-R34 exige DONE para G4 — que es la fase SIGUIENTE.
  //
  // La compuerta quedaba incumplible sin escribir REGISTRY.json a mano, que es la averia que
  // PT-103 nombro: cumplir el marco exigiendo saltarse la herramienta. Llevaba QUINCE FEATURE
  // sin verse porque siempre se habia tapado escribiendo el registro a mano.
  //
  // Un BUG NO entra aqui: se detiene en VALIDATION_PENDING y solo una persona lo mueve
  // (FDGE-R26, LEX-R08, SUITE-R06b). Y un estado YA terminal no se toca: FDGE-R53 dice que la
  // tarea declara como termina, y el comando no lo decide por ella.
  if (tipo !== 'BUG' && Number(destino) === faseValidacion + 1
      && !ESTADOS_TERMINALES.has(st)) {
    return 'DONE';
  }
  if (ctx.esFinal) return estadoTerminalDe(a, ctx.integrado);
  return null;
}

/**
 * PT-098 · el veredicto que verify-fdge publica sobre un estado terminal.
 * Se separa del efecto, como decisionDeEnlace en PT-096: la decision es pura y comprobable.
 */
export function estadoContrastado(a, integrado) {
  if (String(a?.status) !== 'INTEGRATED') return null;
  const r = typeof integrado === 'function' ? integrado(a) : integrado;
  if (r === true) return null;
  if (r === null || r === undefined) {
    return { nivel: 'aviso', regla: 'SUITE-R08', mensaje: `${a.id}: declara INTEGRATED y no se pudo contrastar con la rama por defecto — SIN EVALUAR. No saber no es permiso, pero tampoco es una acusacion (RULE-06).` };
  }
  return { nivel: 'error', regla: 'SUITE-R08', mensaje: `${a.id}: declara INTEGRATED y su «changes/» NO esta en la rama por defecto. LEXICON §5.1 define INTEGRATED como «mergeado a la linea principal»: el registro afirma un merge que el arbol no tiene, y ese estado APAGA seis comprobaciones que se eximen de lo terminal.` };
}

const EJECUTADO_DIRECTO = !!process.argv[1]
  && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (EJECUTADO_DIRECTO) {
const reg = leerJSON(join(IMPL, 'REGISTRY.json'));
if (!reg) { console.error('No hay docs/implementation/REGISTRY.json legible.'); process.exit(2); }
// PT-107 · SUITE-R08 · el registro no se reescribe a ciegas.
//
// LO QUE PASO, medido: `abrir --aplicar` cargo el registro (124 allocations); mientras corria,
// `asignar` escribio PT-106 (125); al terminar, `abrir` escribio SU copia —la de antes— y
// PT-106 DESAPARECIO. Sin error, sin aviso, y el contador RETROCEDIO de 106 a 105. Lo unico que
// lo hizo visible fue ir a leer el estado por otro motivo.
//
// Cuatro sitios escribian `REGISTRY.json` entero y UNO SOLO lo leia, al arrancar el proceso.
// Entre esa lectura y cualquiera de las cuatro escrituras cabe otro comando entero.
//
// SUITE-R08 llama a este archivo «el unico asignador de identificadores». Un asignador que
// puede perder un identificador en silencio no asigna: reparte y a veces olvida.
//
// Esto NO hace el registro concurrente —eso exigiria un bloqueo, y un bloqueo mal puesto deja
// el proyecto colgado—. Hace que la perdida sea IMPOSIBLE DE NO VER: si el archivo cambio
// desde que se leyo, no se escribe encima y se DICE que hay que repetir el comando.
// PT-132 · la huella era `const` y no se actualizaba nunca, asi que la guarda asumia UNA
// escritura por ejecucion. En cuanto un comando escribe dos veces —lo que «abrir» hace desde
// PT-132, uno por issue— la segunda se acusa a si misma: «el registro cambio mientras corria».
//
// La guarda existe para cazar a OTRO proceso, no al propio. Tras una escritura nuestra, lo
// escrito ES la nueva linea base. Se conserva todo lo demas: el cerrojo, la comparacion, y el
// negarse a fusionar.
let HUELLA_AL_LEER = (() => {
  try { return readFileSync(join(IMPL, 'REGISTRY.json'), 'utf8'); } catch { return null; }
})();

// No se exporta: vive DENTRO del bloque que solo corre cuando el modulo se ejecuta como
// comando (EJECUTADO_DIRECTO). Quien lo importa como libreria no escribe el registro.
// PT-107 · la comparacion SOLA no basta, y lo destapo su propio caso siendo INTERMITENTE.
//
// Leer-comparar-escribir no es atomico: si los dos procesos releen ANTES de que ninguno haya
// escrito, los dos ven la huella original, los dos pasan la comparacion y el ultimo pisa al
// primero. La ventana es pequeña —microsegundos— y por eso el caso pasaba a mano y fallaba en la
// bateria. Un caso intermitente es peor que ninguno: enseña a ignorarlo.
//
// El cerrojo lo crea `wx`, que es atomico en el sistema de archivos: o lo creas tu o existe. No
// hay ventana. Se espera a que se libere, con un limite —un cerrojo abandonado no puede colgar
// el proyecto (SUITE-R17)— y se borra siempre, tambien si la escritura falla.
const CERROJO = join(IMPL, 'REGISTRY.json.lock');
const VIDA_MAXIMA_MS = 30000;

function esperaSincrona(ms) {
  // Sincrona a proposito: todo este archivo lo es, y meter async aqui obligaria a reescribir las
  // cuatro llamadas y sus caminos de error.
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function tomarCerrojo(quien) {
  for (let intento = 0; intento < 100; intento += 1) {
    try {
      writeFileSync(CERROJO, `${process.pid} ${quien}${SALTO}`, { flag: 'wx' });
      return true;
    } catch {
      // Un cerrojo viejo es de un proceso que murio sin limpiarlo. Se retira con su edad medida,
      // no «por si acaso»: borrarlo antes de tiempo devuelve el defecto que esto arregla.
      try {
        const edad = Date.now() - statSync(CERROJO).mtimeMs;
        if (edad > VIDA_MAXIMA_MS) { rmSync(CERROJO, { force: true }); continue; }
      } catch { /* desaparecio entre medias: se reintenta */ }
      esperaSincrona(50);
    }
  }
  return false;
}

function guardarRegistro(datos, quien) {
  const ruta = join(IMPL, 'REGISTRY.json');
  if (!tomarCerrojo(quien)) {
    throw new Error(
      'No se pudo tomar el cerrojo de REGISTRY.json en 5 s durante «' + quien + '». '
      + 'NO se ha escrito nada. Otro comando lo tiene ocupado, o quedo un '
      + 'docs/implementation/REGISTRY.json.lock de un proceso muerto — mira su antiguedad '
      + 'antes de borrarlo.');
  }
  try {
    return escribirRegistro(ruta, datos, quien);
  } finally {
    rmSync(CERROJO, { force: true });
  }
}

function escribirRegistro(ruta, datos, quien) {
  // Dentro del cerrojo la comparacion ya no es una carrera: es la red por si alguien escribio
  // SIN pasar por aqui — a mano, o con una version anterior de esta herramienta.
  const ahora = (() => { try { return readFileSync(ruta, 'utf8'); } catch { return null; } })();
  if (HUELLA_AL_LEER !== null && ahora !== null && ahora !== HUELLA_AL_LEER) {
    // No se escribe encima, y no se intenta fusionar: fusionar dos versiones de un registro
    // sin saber cual gana es como se pierde el dato que esto existe para no perder.
    const nAntes = (() => { try { return JSON.parse(HUELLA_AL_LEER).allocations?.length ?? '?'; } catch { return '?'; } })();
    const nAhora = (() => { try { return JSON.parse(ahora).allocations?.length ?? '?'; } catch { return '?'; } })();
    throw new Error(
      'REGISTRY.json cambio mientras corria «' + quien + '»: tenia ' + nAntes
      + ' allocations al leerlo y ahora tiene ' + nAhora + '. NO se ha escrito nada. '
      + 'Otro comando lo modifico en paralelo — escribir encima habria borrado su trabajo '
      + 'en silencio (SUITE-R08). Espera a que termine y repite este comando.');
  }
  const contenido = JSON.stringify(datos, null, 2) + SALTO;
  writeFileSync(ruta, contenido);
  // PT-132 · lo que acabamos de escribir es la nueva linea base. Sin esto, la segunda escritura
  // de la misma ejecucion se denuncia a si misma.
  HUELLA_AL_LEER = contenido;
}

const PLATAFORMA = reg.tracker?.plataforma ?? null;


// PT-007 · `estado` lee SOLO el registro y no toca la plataforma — por eso responde «qué va
// cuándo» sin credencial y sin plataforma declarada. Exigirle la compuerta de acceso lo dejaba
// inútil justo donde más falta hace: en un proyecto que aún no espeja.
//
// PT-052 · `checkpoint` va en la misma lista, y por una razón más fuerte: es un artefacto DEL
// REPOSITORIO —todos sus campos salen del registro y de git— y el momento en que más falta hace
// es justo aquel en el que puede no haber credencial: retomar en una sesión nueva. Exigirle
// plataforma habría hecho que el estado dependiera de la red para poder escribirse.
// PT-053 · `avanzar` tambien entra aqui, y NO porque no necesite plataforma —la exige, es lo
// contrario que `checkpoint`— sino porque sus validaciones que NO necesitan red tienen que
// correr PRIMERO. Salir en la compuerta de acceso hacia que «sin --nota» y «saltar una fase»
// se contestaran con un mensaje sobre la plataforma: el diagnostico equivocado para el
// defecto real. La exigencia de plataforma es una validacion mas, y va dentro.
// PT-056 · `siguiente` entra aqui. Responde «que toca» DERIVANDOLO del registro (SUITE-R48); del
// tablero saca dos datos —si hay un comentario sin responder y si el issue sigue abierto— que ya
// van envueltos en try/catch porque son opcionales. Exigir credencial para responder algo que se
// deriva de un archivo del repositorio dejaba la accion inservible justo donde importa: en CI, que
// es donde se decide un merge, y donde no hay `gh auth`. Lo encontro PT-056 al ver sus cuatro
// casos rojos en CI y verdes en local.
//
// Lo que NO se hace es callar la diferencia: sin tablero, SUITE-R43 no se puede evaluar, y una
// garantia que deja de comprobarse en silencio es peor que una que no existe (RULE-06).
const SIN_PLATAFORMA = new Set(['estado', 'checkpoint', 'avanzar', 'proyectar', 'siguiente', 'coste', 'viabilidad', 'sesion', 'personas', 'asignar', 'rama', 'sellar',
  // PT-121 · «integrar» y «firmar» escriben el REGISTRO y el YAML del intake, los dos
  // locales. Exigirles plataforma repetiria lo que PT-133 acabo de arreglar en «parada»:
  // pedir credencial para escribir un archivo del repositorio, y dejar sin viaje de vuelta
  // al proyecto que no declara tablero — el caso que SUITE-R22 declara soportado.
  'integrar', 'firmar', 'validar',
  // PT-137 · «retomar» escribe el registro; publica si hay tablero y si no, al ledger.
  'retomar', 'aplazar',
  // PT-122 · «cierre» sin --aplicar solo DERIVA y enumera el texto: no habla con nadie.
  'cierre', 'indices',
  // PT-091 · «inventario» recalcula cifras del arbol y NO espeja nada: exigirle plataforma
  // seria pedirle una credencial para leer «wc -l», y dejaria sin arreglo a un proyecto
  // que no declara tablero — el caso que SUITE-R22 declara soportado y PT-084 defendio.
  // PT-128 · el cursor LEE: registro, PHASES.md y disco. No espeja nada. Exigirle plataforma
  // seria el defecto EXACTO de PT-133 dos comandos mas alla — y SUITE-R22 declara soportado el
  // proyecto que no declara tablero.
  'cursor',
  'inventario',
  // PT-133 · «parada» escribe en el issue SI hay plataforma y en TRANSICIONES.log si no — igual
  // que «avanzar», que ya estaba aqui. Faltando de esta lista, la herramienta salia ANTES de
  // llegar a su propio codigo y la rama del ledger, que ESTA ESCRITA, era INALCANZABLE.
  //
  // PT-116 lo declaro cumplido con verified: true. Su evidencia fue «la rama sin
  // adaptador.comentar»: se comprobo que la rama EXISTE, no que se EJECUTA — la clase que PT-124
  // nombro. Y PT-084 habia medido este defecto exacto en «avanzar»; PT-116 CITO ese precedente en
  // su propio AC-03 y volvio a cometerlo en el archivo de al lado, en la misma sesion.
  'parada']);
const D = SIN_PLATAFORMA.has(ACCION) ? { codigo: 0 } : decidirSalida(reg, null);
if (D.codigo !== 0) {
  (D.codigo === 2 ? di : console.error)(D.mensaje);
  process.exit(D.codigo);
}
const adaptador = ADAPTADORES[PLATAFORMA];
// ¿Se puede mirar el tablero de verdad? `siguiente` ya no lo exige, asi que tiene que poder
// distinguir «no hay comentarios pendientes» de «nadie pudo mirar».
const HAY_TABLERO = (() => {
  if (!adaptador) return false;
  try { return decidirSalida(reg, null).codigo === 0; } catch { return false; }
})();

// ── Qué está vivo según el registro ─────────────────────────────────────────
const all = Array.isArray(reg.allocations) ? reg.allocations : [];
const vivas = vivasDe(all);

// ── espejo ──────────────────────────────────────────────────────────────────
// El adaptador trae los issues; la comparación es la función pura de arriba, que es la que
// el arnés puede probar sin credenciales.
function espejo() {
  const issues = adaptador.abiertos();
  // PT-096 · «refDurableDe» se inyecta para que el espejo vea tambien el cuerpo que NO enlaza.
  const div = compararEspejo(vivas, issues, all, refExiste, refDurableDe);
  // PT-026 · SUITE-R47 · el espejo BLOQUEA donde el registro asigna, e INFORMA donde es una foto.
  //
  // El registro que asigna vive en la rama de trabajo. El de la rama por defecto es el del
  // momento del merge, y el tablero sigue avanzando: comparar una foto contra algo vivo diverge
  // SIEMPRE. No es una ventana de tiempo, es estructural — mientras haya trabajo en curso, y
  // siempre lo hay, la compuerta de la principal estaria en rojo permanente. Eso es justo lo
  // que SUITE-R35 existe para evitar, y se estaba causando desde dentro.
  //
  // Informar NO es callar: las divergencias se enumeran igual. Lo que cambia es que no bloquean
  // ahi, porque desde ahi no se arreglan — el arreglo es siempre en la rama de trabajo.
  if (esRamaPorDefecto()) {
    for (const d of div) notas.push(`INFORMATIVO · ${d.regla} · ${d.mensaje}`);
    notas.push(`Rama por defecto (${REPO.rama}): el espejo INFORMA y no bloquea (SUITE-R47). Aqui el `
      + `registro es la foto del ultimo merge y el tablero refleja el trabajo en curso, asi que `
      + `divergen por construccion. Donde decide es en G4, sobre la rama de trabajo:  `
      + `node tools/verify-fdge.mjs --gate G4 PT-NNN`);
    return;
  }
  // PT-028 · un cierre pendiente NO bloquea: es la ventana que SUITE-R46 obliga a atravesar
  // —apuntar el estado terminal, mergear, cerrar—. Bloquear ahi seria exigir que se cerraran
  // los issues antes del merge, que es exactamente lo que SUITE-R46 prohibe. Se dice, no se
  // castiga: informar y bloquear no son lo mismo.
  // PT-015 · `SUITE-R47` se citaba solo en la rama por defecto, donde el espejo INFORMA. Aquí,
  // que es donde BLOQUEA, no se nombraba: la regla que decide dónde muerde no aparecía en el
  // momento en que muerde. Se añade al mensaje sin cambiar cuándo bloquea (`SUITE-R53`).
  for (const d of div) {
    if (d.pendienteDeCierre) notas.push(`PENDIENTE DE CIERRE · ${d.mensaje}`);
    else fail(d.regla, d.mensaje);
  }
  // PT-015 · SUITE-R47 se emite UNA vez y con la rama CORRECTA. El primer intento uso REPO.rama
  // —que es la rama POR DEFECTO— para decir «no es la rama por defecto», y lo repetia por cada
  // divergencia. Las dos cosas las dijo ejecutarlo: leyendo, el nombre de la variable parecia
  // el bueno.
  if (div.some((d) => !d.pendienteDeCierre)) {
    fail('SUITE-R47', `el espejo BLOQUEA aquí y no solo informa: «${RAMA_TRABAJO ?? '¿?'}» no es la rama por defecto («${REPO.rama ?? '¿?'}»), así que es donde el registro asigna.`);
  }
  // PT-114 · el cuerpo que publica la ruta SIN ENLACE teniendo ya ref durable.
  //
  // PT-096 decidio bien —sin ref durable no se inventa una URL— y faltaba la otra mitad: que algo
  // lo eche de menos DESPUES. El cuerpo se publica al abrir el issue, la rama se empuja despues,
  // y «una vez que un cuerpo esta bien, NADA vuelve a mirarlo» (PT-096).
  //
  // La consecuencia la encontro una PERSONA abriendo EP-020, no un verificador: el firmante no
  // podia leer el intake que se le pedia firmar, asi que G1 no podia pasar. Va en el espejo y no
  // en verify-fdge porque el espejo es lo que corre CON credencial en los dos workflows.
  //
  // Se REPORTA, no se repara: repararlo aqui mezclaria informar con actuar, y «abrir --aplicar»
  // ya lo hace. Lo que faltaba era que alguien lo exigiera.
  if (adaptador.cuerpoRemoto) {
    const mudos = [];
    for (const a of vivas.filter((x) => x.issue)) {
      let publicado = null;
      try { publicado = adaptador.cuerpoRemoto(a.issue); } catch { /* sin acceso: no se afirma */ }
      const veredicto = cuerpoSinEnlaceConRef(publicado, refDurableDe(a) ? true : false);
      if (veredicto === true) mudos.push(`${a.id} #${a.issue}`);
    }
    if (mudos.length) {
      fail('SUITE-R35', `${mudos.length} cuerpo(s) publican la ruta SIN ENLACE y YA existe ref durable que la `
        + `contiene: ${mudos.join(', ')}. Quien abra el issue no puede llegar al intake, y sin leerlo no se `
        + `puede firmar (INTAKE-R06). Se republica:  tracker abrir --aplicar`);
    }
  }

  if (!errores.length) {
    notas.push(`${vivas.length} allocation(s) viva(s) y ${issues.length} issue(s) abierto(s): el espejo cuadra.`);
  }
}

/**
 * PT-026 · ¿estamos en la rama por defecto? Se compara la rama del clon con la que el adaptador
 * declara. Si cualquiera de las dos no se sabe, la respuesta es **no**: ante la duda se bloquea,
 * porque equivocarse hacia «informativo» apaga la compuerta y equivocarse hacia «bloquea» solo
 * pide un arreglo de mas.
 */
function esRamaPorDefecto() {
  if (!REPO.rama) return false;
  try {
    const actual = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return !!actual && actual === REPO.rama;
  } catch { return false; }
}

// ── notas · cuántas notas de reanclaje lleva el issue de un PT (FDGE-R52) ────
// Solo lectura. Existe para que `verify-fdge` no necesite su propio cliente de plataforma:
// la regla la hace cumplir el verificador, el acceso lo encapsula quien ya lo tiene.
function notasDe() {
  const pt = ARGS.slice(1).find((a) => /^PT-\d+$/.test(a));
  if (!pt) { console.error('Uso: tracker.mjs notas PT-NNN [ruta]'); process.exit(2); }
  const a = all.find((x) => x?.id === pt);
  if (!a?.issue) { console.log('0'); return; }
  console.log(String(contarNotas(adaptador.comentarios(a.issue))));
}

// ── abrir · crea los issues que faltan, con permiso ─────────────────────────
// PT-010 · lo que `cuerpoDeIssue` necesita del entorno: la URL del repositorio, su rama por
// defecto y —si es un lote— las tareas que lo componen, para que el issue diga de que va sin
// salir de GitHub.
// `estado` corre SIN plataforma, así que aquí no hay adaptador. Sin el `?.` esto reventaba
// justo en la acción que existe para funcionar sin credencial — lo dijo su caso, no yo.
const REPO = adaptador?.repo ? adaptador.repo() : { url: null, rama: null };
// PT-036 · la rama en la que se esta trabajando ahora mismo. Sin ella no se puede enlazar
// «donde el contenido esta»; si no se sabe, se cae en la rama por defecto y el enlace vuelve a
// poder dar 404 — pero eso se prefiere a inventar un nombre de rama (RULE-06).
const RAMA_TRABAJO = (() => {
  try {
    const r = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return (r && r !== 'HEAD') ? r : null;
  } catch { return null; }
})();

const contextoCuerpo = (a) => ({
  ...REPO,
  ramaTrabajo: RAMA_TRABAJO,
  // PT-048 · el dato viaja en el contexto y NO se lee dentro de `cuerpoDeIssue`: esa funcion es
  // pura y exportada a proposito —para que un caso pueda comprobarla sin hablar con la
  // plataforma ni con el disco—, y meterle un `existsSync` la habria devuelto a ser inprobable.
  hayDirectorio: existsSync(join(ROOT, 'changes', a?.slug ? `${a.id}-${a.slug}` : `${a?.id}`)),
  // PT-079 · el ref DURABLE se calcula aqui, no en cuerpoDeIssue: esa funcion es pura a
  // proposito (PT-048) y meterle git la devolveria a ser improbable.
  refDurable: refDurableDe(a),
  // PT-104 · que artefactos EXISTEN de verdad, mirados en el arbol. Mismo contrato que las dos
  // lineas de arriba: el disco se lee AQUI y `cuerpoDeIssue` sigue siendo pura.
  //
  // Es la mitad que hace util la maquina de estados. Publicar que PHASE 4 «produce seis
  // archivos» es copiar FASES; publicar cuales de los seis ESTAN es un contraste, y un
  // contraste puede contradecir a quien lo escribe.
  artefactos: artefactosDe(a),
  // Los bloqueos ya los deriva `queSigue` desde PT-030. Vivian solo en `tracker siguiente`, que
  // hay que acordarse de ejecutar — y EP-007 cerro declarando justo eso: «un comando no puede
  // exigir haber sido llamado».
  ...(() => { const r = queSigue(a); return { bloqueos: r.bloqueos ?? [], avisos: r.avisos ?? [] }; })(),
});

/**
 * PT-104 · Los artefactos que hay, no los que deberia haber.
 *
 * Devuelve `null` —y no un conjunto vacio— cuando el directorio no existe: no es lo mismo «no
 * ha producido nada» que «no se pudo mirar», y el cuerpo lo dice distinto (`RULE-06`).
 */
function artefactosDe(a) {
  const dir = join(ROOT, 'changes', a?.slug ? `${a.id}-${a.slug}` : `${a?.id}`);
  if (!existsSync(dir)) return null;
  try { return new Set(readdirSync(dir)); } catch { return null; }
}

/**
 * PT-079 · SUITE-R56 · Un ref que no desaparece cuando la rama de la tarea se borra.
 *
 *   1. la rama de INTEGRACION, si el contenido ya esta ahi   -> legible y permanente
 *   2. si no, el COMMIT que lo contiene                      -> permanente
 *   3. si no hay ninguno                                     -> null, y el cuerpo lo DICE
 *
 * El orden importa: quien abre el issue prefiere ver «trabajo» a un hexadecimal, y el commit
 * es la red para el trabajo que aun vive solo en su rama efimera.
 */
// PT-079 · el resolvedor va INYECTADO en compararEspejo: esa funcion sigue siendo comprobable
// sin git ni credenciales. Aqui vive porque lo usan dos sitios —el espejo y la reparacion de
// enlaces muertos—, y tenerlo dos veces seria dos fuentes del mismo hecho (SUITE-R38).
const refExiste = (r) => gitDe(['rev-parse', '--verify', '--quiet', r]) !== null
  || gitDe(['rev-parse', '--verify', '--quiet', `origin/${r}`]) !== null;

// PT-098 · el contraste con el arbol. Vive junto a refDurableDe porque comparte su mecanismo:
// preguntar a git si «changes/<ID>-<slug>/» esta en un ref. NO se duplica el «git cat-file» —una
// segunda copia seria lo que PT-096 acaba de quitar de en medio.
function integradoEnPrincipal(a) {
  const dir = `changes/${a?.slug ? `${a.id}-${a.slug}` : a?.id}`;
  const porDefecto = REPO.rama ?? 'main';
  const integracion = reg?.tracker?.rama_integracion ?? 'trabajo';
  const hay = (ref) => {
    try { execFileSync('git', ['cat-file', '-e', `${ref}:${dir}`], { cwd: ROOT, stdio: 'pipe' }); return true; }
    catch { return false; }
  };
  if (hay(porDefecto)) return true;
  // Solo se afirma «NO integrado» si el directorio EXISTE en algun sitio. Si no esta en ninguno
  // no se sabe nada: puede ser un clon superficial, una rama sin traer, o una allocation sin
  // artefactos (SUITE-R44). RULE-06.
  if (hay(integracion)) return false;
  return null;
}

function refDurableDe(a) {
  const dir = `changes/${a?.slug ? `${a.id}-${a.slug}` : a?.id}`;
  const integracion = reg?.tracker?.rama_integracion ?? 'trabajo';
  const hay = (ref) => {
    try {
      execFileSync('git', ['cat-file', '-e', `${ref}:${dir}`], { cwd: ROOT, stdio: 'pipe' });
      return true;
    } catch { return false; }
  };
  // PT-096 · SUITE-R51 lo dice literalmente: el cuerpo enlaza «la rama de trabajo mientras la
  // allocation esta viva, LA RAMA POR DEFECTO cuando llega a INTEGRATED». Aqui se devolvia
  // siempre la de integracion, asi que una tarea ya integrada enlazaba a «trabajo» y su cuerpo
  // publicaba «al integrarse pasara a main» — sobre trabajo que YA esta en main.
  //
  // Lo vio mirar el issue #14 recien republicado, no leer la regla: el texto se contradecia con
  // el estado de la propia tarea.
  const porDefecto = REPO.rama ?? 'main';
  const terminal = ESTADOS_TERMINALES.has(String(a?.status));
  const orden = terminal ? [porDefecto, integracion] : [integracion, porDefecto];
  for (const ref of orden) if (ref && hay(ref)) return ref;
  const sha = gitDe(['log', '-1', '--format=%H', '--', dir]);
  return sha || null;
}

// PT-010 · sincronizar el CUERPO de los issues abiertos, no solo sus etiquetas. Sin esto el
// arreglo no alcanzaria a los que ya existen — incluidos los de este mismo lote, que nacieron
// con el cuerpo defectuoso.
function sincronizarCuerpos() {
  if (!adaptador.editarCuerpo) return;
  for (const a of vivas.filter((x) => x.issue)) {
    if (!APLICAR) { notas.push(`${a.id} #${a.issue}: se regeneraria el cuerpo`); continue; }
    try { adaptador.editarCuerpo(a.issue, cuerpoDeIssue(a, contextoCuerpo(a))); notas.push(`${a.id} #${a.issue}: cuerpo sincronizado`); }
    catch { fail('SUITE-R35', `${a.id}: no se pudo sincronizar el cuerpo de #${a.issue}.`); }
  }
  repararEnlacesMuertos();
}

/**
 * PT-079 · SUITE-R56 · reparar el enlace de las tareas YA TERMINADAS.
 *
 * `sincronizarCuerpos` recorria solo las vivas, y una tarea viva tiene su rama: su enlace
 * funciona. El enlace que se rompe es el de la tarea CERRADA — la rama efimera se borro al
 * fusionar (FDGE-R19) y el cuerpo publicado quedo apuntando a un ref que ya no existe. Es
 * exactamente el caso para el que existe SUITE-R56, y era el que no se alcanzaba: medido sobre
 * el tablero completo, 20 de 40 enlaces seguian muertos con el arreglo ya puesto.
 *
 * Solo toca lo que esta ROTO y solo si hay a donde apuntar: si el ref publicado sigue vivo no
 * se reescribe nada, y si no se puede derivar un ref durable se DICE en vez de inventar uno
 * (RULE-06). Reescribir el cuerpo de un issue cerrado no cambia su estado — arregla un enlace,
 * que es dato derivado del registro (SUITE-R35).
 */
function repararEnlacesMuertos() {
  if (!adaptador.editarCuerpo || !adaptador.cuerpoRemoto) return;
  const terminadas = all.filter((a) => a.issue && !vivas.some((v) => v.id === a.id));
  for (const a of terminadas) {
    let publicado;
    // PT-096 · un cuerpo que NO SE PUDO LEER no es un cuerpo sano. El «catch { continue; }» que
    // habia aqui hacia indistinguible «no pude mirar» de «no hay nada que hacer», y eso es
    // exactamente lo que RULE-06 prohibe: no saber no es permiso.
    //
    // Medido: en una pasada sobre 99 issues, CUATRO lecturas fallaron y la herramienta declaro
    // seis reparaciones sin decir que faltaban cuatro por mirar. Con eso, «0 cuerpos mudos» al
    // terminar habria sido «0 de los que pude leer», publicado como si fuera del tablero entero —
    // el error de muestreo que PT-079 documenta sobre si mismo.
    try { publicado = adaptador.cuerpoRemoto(a.issue); }
    catch (e) {
      notas.push(`${a.id} #${a.issue}: no se pudo leer el cuerpo (${String(e?.message ?? e).split(String.fromCharCode(10))[0].slice(0, 80)}). SIN EVALUAR: no se afirma que este bien.`);
      continue;
    }
    const ref = refDeEnlace(publicado);
    const durable = refDurableDe(a);
    // PT-096 · la decision es UNA y vive en decisionDeEnlace. Aqui estaba «if (!ref || …) continue»,
    // que salta el cuerpo SIN enlace — que son justo los que nunca lo tuvieron, ocho de los diez, y
    // ademas terminales, o sea los unicos a los que esta pasada llega. SUITE-R56 reparaba el enlace
    // MUERTO y pasaba de largo por el AUSENTE.
    const decision = decisionDeEnlace(publicado, refExiste, durable);
    if (decision === 'AJENO') continue;
    // PT-096 · el cuerpo se reescribe cuando DIFIERE del que se generaria hoy, no solo cuando el
    // enlace esta roto. SUITE-R35 dice que la plataforma ESPEJA el registro, y un espejo que solo
    // se actualiza cuando se rompe no es un espejo.
    //
    // Lo midio esta misma tarea: retirada la lista en prosa que SUITE-R51 prohibe, los CATORCE
    // cuerpos de lote que la llevaban NO se limpiaron —sus enlaces funcionaban, la decision era
    // OK y la pasada los saltaba—. Es la averia de esta tarea un nivel mas arriba: el enlace roto
    // se reparaba solo si estaba roto; el cuerpo entero se reescribia solo si el ENLACE fallaba.
    // Una vez «OK», nada volvia a mirarlo, asi que ninguna mejora del texto alcanzaba lo publicado.
    //
    // Se comparan las lineas SIN espacios al borde: la plataforma normaliza finales de linea, y
    // comparar bytes crudos reescribiria los 115 cuerpos en cada pasada (la leccion de PT-090
    // sobre huellas con CRLF).
    const derivado = cuerpoDeIssue(a, contextoCuerpo(a));
    const norm = (t) => String(t ?? '').split(String.fromCharCode(10)).map((l) => l.trimEnd()).join(String.fromCharCode(10)).trim();
    if (decision === 'OK' && norm(publicado) === norm(derivado)) continue;
    if (decision === 'ROTO_SIN_SALIDA') {
      notas.push(`${a.id} #${a.issue}: enlaza a «${ref}», que ya no existe, y no hay ref durable del que derivar uno. Queda roto y consta.`);
      continue;
    }
    if (decision === 'MUDO_SIN_REF_DURABLE') {
      notas.push(`${a.id} #${a.issue}: publica la ruta sin enlace y no hay ref durable todavia. No se inventa uno (RULE-06): consta.`);
      continue;
    }
    // PT-096 · el ORIGEN se nombra segun el caso. Con «${ref}» a secas, el cuerpo mudo —donde ref
    // es null— habria escrito «se repararia el enlace «null» -> «trabajo»»: exactamente el defecto
    // que esta tarea arregla, reapareciendo en la nota que lo arregla.
    const que = decision === 'OK'
      ? 'el texto del cuerpo no coincide con el derivado'
      : `${decision === 'REPARAR_MUDO' ? 'sin enlace' : `«${ref}»`} -> «${durable}»`;
    if (!APLICAR) { notas.push(`${a.id} #${a.issue}: se republicaria: ${que}`); continue; }
    try { adaptador.editarCuerpo(a.issue, derivado); notas.push(`${a.id} #${a.issue}: republicado: ${que}`); }
    catch { fail('SUITE-R56', `${a.id}: su issue #${a.issue} tiene el enlace ${origen} y no se pudo reescribir.`); }
  }
}

// PT-007 · sincronizar las etiquetas derivadas de los issues que YA existen. Sin esto, el
// estado se publicaba al abrir y nunca se actualizaba: el tablero diría «fase 1» para siempre.
function sincronizarEtiquetas() {
  const conIssue = vivas.filter((a) => a.issue);
  if (!conIssue.length || !adaptador.etiquetasDeIssue) return;
  for (const a of conIssue) {
    const debe = etiquetasDe(a);
    const tiene = adaptador.etiquetasDeIssue(a.issue);
    const quitar = tiene.filter((n) => RE_DERIVADA.test(n) && !debe.includes(n));
    const poner = debe.filter((n) => !tiene.includes(n));
    if (!quitar.length && !poner.length) continue;
    if (!APLICAR) { notas.push(`${a.id} #${a.issue}: faltaría [${poner.join(', ')}] y sobraría [${quitar.join(', ')}]`); continue; }
    try { adaptador.etiquetar(a.issue, poner, quitar); notas.push(`${a.id} #${a.issue} → ${debe.join(', ')}`); }
    catch { fail('SUITE-R35', `${a.id}: no se pudieron sincronizar las etiquetas de #${a.issue}.`); }
  }
}

// PT-036 · EL UNICO final de `abrir()`. Todo lo que debe quedar sincronizado va aqui, para que
// no vuelva a existir un camino que se lo salte: etiquetas, cuerpos y jerarquia.
function cerrarPasada() {
  sincronizarEtiquetas();
  sincronizarCuerpos();
  anidarSubIssues();
}

// PT-035 · declarar en la plataforma la jerarquia que el registro ya tiene.
function anidarSubIssues() {
  if (!adaptador.subIssues || !adaptador.anidar) return;
  const padres = [...new Set(all.filter((a) => a?.epic).map((a) => a.epic))]
    .map((id) => all.find((x) => x?.id === id)).filter((p) => p?.issue);
  const yaAnidados = {};
  for (const p of padres) yaAnidados[p.issue] = adaptador.subIssues(p.issue);
  const faltan = anidamientosQueFaltan(all, yaAnidados);
  for (const f of faltan) {
    if (!APLICAR) { notas.push(`${f.id} #${f.hijo}: seria sub-issue de ${f.epic} #${f.padre}`); continue; }
    // PT-137 · si el hijo cuelga de OTRO padre, se retira de ahi primero: un issue solo tiene
    // uno. Sin esto, reasignar la epica dejaba el registro diciendo una cosa y el tablero otra.
    const otro = Object.entries(yaAnidados)
      .find(([padre, hijos]) => Number(padre) !== f.padre && Array.isArray(hijos) && hijos.includes(f.hijo));
    if (otro && adaptador.desanidar) {
      try { adaptador.desanidar(Number(otro[0]), f.hijo); notas.push(`${f.id} #${f.hijo}: retirado de #${otro[0]}`); }
      catch (e) {
        fail('SUITE-R51', `${f.id}: cuelga de #${otro[0]} y no se pudo retirar `
          + `(${String(e.message ?? e).split(SALTO)[0]}). Mientras siga ahi, no puede colgar de #${f.padre}.`);
        continue;
      }
    }
    // El motivo del fallo se DICE. Un «no se pudo» mudo obliga a reproducirlo a mano para saber
    // por que, y esta misma linea costo una diagnosis en la sesion que la escribio.
    try { adaptador.anidar(f.padre, f.hijo); notas.push(`${f.id} #${f.hijo} → sub-issue de ${f.epic} #${f.padre}`); }
    catch (e) {
      fail('SUITE-R51', `${f.id}: no se pudo anidar #${f.hijo} bajo #${f.padre} `
        + `(${String(e.message ?? e).split(SALTO)[0]}).`);
    }
  }
}

function abrir() {
  const pendientes = vivas.filter((a) => !a.issue);
  if (!pendientes.length) {
    notas.push('Nada que abrir: toda allocation viva tiene su issue.');
    if (adaptador.etiquetas) {
      const faltan = etiquetasQueFaltan(adaptador.etiquetas(), etiquetasNecesarias(vivas));
      for (const e of faltan) {
        if (!APLICAR) { notas.push(`faltaría crear la etiqueta «${e}»`); continue; }
        try { adaptador.crearEtiqueta(e); notas.push(`etiqueta «${e}» creada`); }
        catch { fail('FND-R30', `falta la etiqueta «${e}» y no se pudo crear:  gh label create "${e}"`); }
      }
    }
    cerrarPasada();
    return;
  }
  if (!APLICAR) {
    di(`${pendientes.length} allocation(s) viva(s) sin issue:`);
    for (const a of pendientes) di(`  ${a.id}  ${a.type}  ${a.slug ?? ''}`);
    di('');
    di('  --aplicar   los crea. Sin la marca, esto solo enumera.');
    return;
  }
  // FND-R30 · el terreno se prepara antes de necesitarlo. `gh issue create` falla si la
  // etiqueta no existe, y hasta ahora eso se descubria a mitad de la creacion del primer issue.
  if (adaptador.etiquetas) {
    const faltan = etiquetasQueFaltan(adaptador.etiquetas(), etiquetasNecesarias(vivas));
    for (const e of faltan) {
      try { adaptador.crearEtiqueta(e); notas.push(`etiqueta «${e}» creada`); }
      catch { fail('FND-R30', `falta la etiqueta «${e}» y no se pudo crear. Créala y repite:  gh label create "${e}"`); }
    }
    if (errores.length) return;
  }
  // PT-014 · las tareas antes que su lote, para que el cuerpo del lote las enumere con numero
  // en esta misma pasada. Es un reordenamiento: ni una llamada mas a la plataforma.
  // PT-132 · EL ORDEN LO DECIDE LA REVERSIBILIDAD, y aqui estaba al reves.
  //
  // Se creaban TODOS los issues —acto irreversible— y el registro se guardaba al FINAL del bucle.
  // Una interrupcion a mitad —timeout, red, Ctrl+C— dejaba los issues creados y el registro sin
  // conocerlos, y la pasada siguiente los volvia a crear. Medido el 2026-08-22: DIECISEIS
  // duplicados en EP-020, PT-129 por TRES.
  //
  // Es el contrato que «avanzar» declara tres funciones mas abajo, contradicho aqui: dos comandos
  // del mismo archivo con reglas opuestas sobre lo mismo (SUITE-R38).
  //
  // DOS defensas, y las dos hacen falta:
  //   AC-01  guardar DESPUES DE CADA UNO: una interrupcion cuesta como mucho UNO, no trece.
  //   AC-02  ADOPTAR el issue abierto que ya lleva el titulo derivado, en vez de crear otro: lo
  //          que quedo huerfano de una pasada anterior se recupera solo.
  //
  // Y si no se puede consultar la plataforma NO SE CREA A CIEGAS (RULE-06): crear sin poder
  // comprobar es exactamente como se duplico.
  const yaAbiertos = (() => {
    try { return adaptador.abiertos(); }
    catch { return null; }
  })();
  if (yaAbiertos === null) {
    fail('SUITE-R35', 'no se pudo consultar que issues hay abiertos, asi que NO se crea ninguno: '
      + 'crear sin poder comprobar es como se duplicaron dieciseis (PT-132).');
    cerrarPasada();
    return;
  }
  for (const a of ordenDeApertura(pendientes)) {
    const titulo = `${a.id} · ${a.slug ?? a.type}`;
    const huerfano = issueAAdoptar(titulo, yaAbiertos);
    if (huerfano) {
      a.issue = huerfano;
      guardarRegistro(reg, ACCION);
      notas.push(`${a.id} → issue #${huerfano} ADOPTADO: ya estaba abierto con este titulo y el `
        + `registro no lo reclamaba. Es lo que deja una pasada interrumpida (PT-132).`);
      continue;
    }
    // El issue REFERENCIA el intake; no lo copia. Dos copias del mismo texto divergen — es la
    // causa raiz que la v4 nacio para eliminar, reintroducida por la puerta nueva.
    const cuerpo = cuerpoDeIssue(a, contextoCuerpo(a));
    const etiquetas = etiquetasDe(a);   // PT-007 · incluye fase y compuerta, derivadas
    const n = adaptador.crear(titulo, cuerpo, etiquetas);
    a.issue = n;
    guardarRegistro(reg, ACCION);       // PT-132 · uno a uno, no al final del bucle
    notas.push(`${a.id} → issue #${n}`);
  }
  // PT-035 · PT-036 · la pasada que CREA termina igual que la que no crea. Es la CUARTA vez en
  // este archivo que un arreglo queda detras de un `return` y no se ejecuta —PT-014 en
  // sincronizarCuerpos(), PT-022 en checkCierreDeLote(), PT-035 al anidar—. Cuatro veces no es
  // descuido: era que `abrir()` tenia dos finales y solo uno estaba completo. Ahora tiene uno.
  cerrarPasada();
  guardarRegistro(reg, ACCION);
}

/**
 * PT-024 · el `REGISTRY.json` tal y como lo ve la rama por defecto. Se lee del clon local, sin
 * red y sin cambiar de rama: `git show origin/<rama>:<ruta>`. Devuelve `null` si no se puede —
 * clon superficial, `origin` ausente, rama sin traer— y quien llama NO lo interpreta como
 * permiso: no saber no es lo mismo que estar de acuerdo.
 */
function registroDePrincipal() {
  const rama = REPO.rama;
  if (!rama) return null;
  try {
    const salida = execFileSync('git', ['show', `origin/${rama}:docs/implementation/REGISTRY.json`],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const j = JSON.parse(salida);
    return j.allocations ?? j.asignaciones ?? null;
  } catch { return null; }
}

// ── cerrar · los issues cuyo trabajo ya no está vivo ────────────────────────
function cerrar() {
  const muertas = all.filter((a) => a.issue && !VIVOS.has(a?.status));
  const issues = adaptador.abiertos();
  const abiertos = new Set(issues.map((i) => i.number));
  const candidatas = muertas.filter((a) => abiertos.has(a.issue));
  // PT-024 · SUITE-R46 · no adelantarse a la rama por defecto.
  const { cerrables, adelantadas, evaluable } = cerrablesSinAdelantarse(candidatas, registroDePrincipal());
  if (!evaluable) {
    fail('SUITE-R46', `no se pudo leer el registro de la rama por defecto (${REPO.rama ?? '¿?'}), `
      + `asi que no se cierra nada. Cerrar un issue cuyo estado terminal no esta todavia ahi deja `
      + `a la principal diciendo «vivo» con el issue cerrado, y su compuerta en rojo. `
      + `Trae la rama:  git fetch origin ${REPO.rama ?? 'main'}`);
    return;
  }
  if (adelantadas.length) {
    const cual = adelantadas.map((a) => `${a.id} (aqui ${a.status}, en ${REPO.rama} ${a.statusEnPrincipal})`).join(' · ');
    fail('SUITE-R46', `${adelantadas.length} issue(s) no se cierran: su estado terminal todavia no `
      + `esta en «${REPO.rama}». ${cual}. El orden es: apuntar el estado terminal AQUI, mergear, y `
      + `cerrar DESPUES. Al reves, la principal queda diciendo «vivo» con el issue cerrado y su `
      + `compuerta falla — y falla tras CADA merge, no solo tras este.`);
    return;
  }
  const porCerrar = cerrables;
  if (!porCerrar.length) { notas.push('Nada que cerrar.'); return; }
  if (!APLICAR) {
    di(`${porCerrar.length} issue(s) de trabajo ya terminado:`);
    for (const a of porCerrar) di(`  #${a.issue}  ${a.id}  ${a.status}`);
    di('');
    di('  --aplicar   los cierra.');
    return;
  }
  for (const a of porCerrar) {
    adaptador.cerrar(a.issue, mensajeDeCierre(a));
    notas.push(`#${a.issue} cerrado · ${a.id} ${a.status}`);
  }
}

// ── pr · ¿hay pull request abierto para la rama? (SUITE-R42) ────────────────
// Sale 0 si lo hay y 1 si no, con los mismos códigos que `espejo` para 2 y 3: quien llama ya
// sabe leerlos. No abre nada.
function prAbierto() {
  let rama = '';
  try {
    rama = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'],
      { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch { console.error('No se pudo leer la rama actual: ¿es un repositorio git?'); process.exit(2); }
  const nums = adaptador.prDeLaRama(rama);
  if (nums.length) { notas.push(`rama «${rama}» → pull request #${nums[0]} abierto.`); return; }
  fail('SUITE-R42', `no hay pull request abierto para la rama «${rama}». G4 se resuelve sobre un PR `
    + 'para que el merge se proponga donde se pueda revisar. Ábrelo tú:  '
    + `gh pr create --base main --head ${rama}`);
}

// ── estado · el tablero, leyendo SOLO el registro (PT-007) ──────────────────
// No toca la plataforma: por eso responde «qué va cuándo» sin credencial y sin plataforma
// declarada. Las etiquetas responden lo mismo en GitHub; esto lo responde aquí.
function estado() {
  const eps = all.filter((a) => esLote(a));
  const pts = all.filter((a) => !esLote(a));
  const linea = (a) => {
    const g = COMPUERTA_DE_FASE[Number(a.phase)];
    return `  ${String(a.id).padEnd(8)}${String(a.type ?? '').padEnd(15)}${String(a.severity ?? '—').padEnd(4)}`
      + `${String(a.status ?? '').padEnd(20)}${(a.phase !== undefined && a.phase !== null ? `fase ${a.phase}` : 'sin fase').padEnd(10)}`
      + `${(g ? `${g} pendiente` : '—').padEnd(15)}${a.issue ? `#${a.issue}` : ''}`;
  };
  for (const ep of eps) {
    di(`${ep.id} · ${ep.slug ?? ''}   ${ep.status}${ep.issue ? `   #${ep.issue}` : ''}`);
    for (const pt of pts.filter((p) => p.epic === ep.id)) di(linea(pt));
    di('');
  }
  const sueltos = pts.filter((p) => !p.epic);
  if (sueltos.length) { di('Sin implementación'); for (const p of sueltos) di(linea(p)); di(''); }
  notas.push(`${eps.length} implementación(es) · ${pts.length} tarea(s) · leído del registro, sin tocar la plataforma.`);
}

// ── pendiente · ¿queda un comentario humano sin responder? (SUITE-R43) ──────
function pendienteDe() {
  const pt = ARGS.slice(1).find((a) => /^PT-\d+$/.test(a));
  if (!pt) { console.error('Uso: tracker.mjs pendiente PT-NNN [ruta]'); process.exit(2); }
  const a = all.find((x) => x?.id === pt);
  if (!a?.issue) { console.log('0'); return; }
  const r = comentarioSinResponder(adaptador.comentarios(a.issue));
  if (r === null) { console.log('4'); return; }   // no evaluable: ninguna marca
  console.log(r ? '1' : '0');
}

// ── siguiente · qué toca ahora y cómo se cierra, PREGUNTÁNDOSELO AL TABLERO ──
// PT-030 · La respuesta no sale de la memoria del agente: sale del registro cruzado con el
// estado real del issue. Consultar el tablero deja de ser una buena costumbre y pasa a ser el
// único sitio donde está la respuesta.
// ── coste · lo que suele costar un tipo de tarea, DERIVADO de las cerradas ──
//
// Ninguna cifra sale de la memoria del agente ni de una tabla escrita a mano (AC-04): el tipo y
// la complejidad los pone REGISTRY.json, y commits, archivos y lineas los pone git.

/** Las tareas cerradas con su coste, derivado. Es lo unico que toca git en todo esto. */
function cerradasConCoste() {
  const CERRADO = new Set(['INTEGRATED', 'CLOSED']);
  const cer = all.filter((a) => a?.id?.startsWith('PT-') && CERRADO.has(a.status));
  // Un solo recorrido de la historia: 162 commits hoy, y `git show` por commit seria lento.
  // Separador: un espacio. El SHA no lleva ninguno, asi que el primero parte limpio — y un
  // byte de control aqui sobrevive al editor pero no a la revision (lo marca `audit`).
  // PT-064 · cada commit trae su AUTOR resuelto, para que la tarea sepa de quien es.
  const porPt = new Map();
  const quienPt = new Map();
  for (const c of commitsConAutor()) {
    const id = duenoDe(c.asunto);
    if (!id) continue;
    if (!porPt.has(id)) porPt.set(id, []);
    porPt.get(id).push(c.sha);
    // La persona de una tarea es la de su PRIMER commit propio: quien la empezo. Si dos personas
    // tocan la misma tarea, la referencia sigue siendo de quien la abrio — repartir una tarea
    // entre dos seria inventar una fraccion que nadie ha medido.
    if (!quienPt.has(id) && c.persona) quienPt.set(id, c.persona);
  }
  return cer.map((a) => {
    const shas = porPt.get(a.id) ?? [];
    const archivos = new Set();
    let lineasTocadas = 0;
    for (const sha of shas) {
      for (const l of lineas(gitDe(['show', '--numstat', '--format=', '--no-renames', sha]) ?? '')) {
        const [mas, menos, f] = l.split('	');
        if (!f) continue;
        archivos.add(f);
        lineasTocadas += (Number(mas) || 0) + (Number(menos) || 0);
      }
    }
    return { id: a.id, type: a.type, complexity: a.complexity ?? null,
      persona: quienPt.get(a.id) ?? null,
      commits: shas.length, archivos: archivos.size, lineas: lineasTocadas, sinCommit: !shas.length };
  });
}

function coste() {
  // PT-064 · el coste se filtra A PETICION: mas casos es mejor referencia, y el coste de un
  // BUG/STANDARD no depende necesariamente de quien lo haga. El precedente y el techo SI se
  // filtran siempre, porque responden «¿puedo YO, ahora?».
  const iDe = ARGS.indexOf('--de');
  const quienPide = ARGS.includes('--mio')
    ? personaLocal(gitDe(['config', 'user.name']), gitDe(['config', 'user.email']), reg.personas ?? []).persona
    : (iDe >= 0 ? ARGS[iDe + 1] : null);
  const args = ARGS.slice(1).filter((x) => !x.startsWith('-'));
  // El ROOT tambien llega como posicional. Se distingue por forma: los tipos y complejidades son
  // MAYUSCULAS sin separadores; una ruta no lo es.
  const [tipo = null, complejidad = null] = args.filter((x) => /^[A-Z_]+$/.test(x));
  const todas = cerradasConCoste();
  const conDatoTodas = todas.filter((c) => !c.sinCommit);
  const conDato = soloDe(conDatoTodas, quienPide);
  const sinDato = todas.length - conDatoTodas.length;
  const noDeclarados = sinPersona(conDatoTodas);

  const grupos = tipo || complejidad
    ? [[tipo, complejidad]]
    : [...new Set(conDato.map((c) => `${c.type}/${c.complexity}`))].map((k) => k.split('/'));

  const filas = grupos
    .map(([tp, cx]) => costeDe(conDato, { tipo: tp || null, complejidad: cx || null }))
    .sort((a, b) => b.casos - a.casos);

  for (const r of filas) {
    const nombre = [r.tipo ?? '*', r.complejidad ?? '*'].join('/');
    di('');
    if (r.referencia) {
      // AC-03 · SIEMPRE se dice de quien es la cifra. Lo peligroso no es dar una u otra: es no
      // saber cual te estan dando.
      di(`  ${nombre} · ${r.casos} tareas cerradas · ${quienPide ? `solo de ${quienPide}` : 'de TODAS las personas'}`);
      for (const [k, v] of Object.entries(r.referencia)) {
        di(`    ${k.padEnd(9)} ${String(v.mediana).padStart(5)}     (${v.min} – ${v.max})`);
      }
    } else {
      di(`  ${nombre} · ${r.casos} ${r.casos === 1 ? 'tarea' : 'tareas'} — SIN REFERENCIA (${r.motivo})`);
      for (const c of r.casos_crudos ?? []) {
        di(`    ${c.id}    commits ${c.commits} · archivos ${c.archivos} · lineas ${c.lineas}`);
      }
      // RULE-06 · no se da una cifra que no se sostiene. Los casos estan ahi; el juicio es humano.
      di('    Una mediana de una tarea no es una mediana. Ahi esta lo que hay.');
    }
  }
  di('');
  if (noDeclarados && (reg.personas ?? []).length) {
    di(`  ${noDeclarados} tarea(s) de autores sin declarar no se reparten (SIN EVALUAR).`);
    di('  → «tracker personas» los enumera. No se adjudican por parecido (LEXICON 6.5f).');
    di('');
  }
  di(`  Derivado de ${conDato.length} de las ${todas.length} tareas cerradas. ${sinDato} no tienen`);
  di('  commit propio: no costaron cero, es que NO SE PUEDE SABER — trabajo anterior a la');
  di('  convencion de mensajes. Es una REFERENCIA de su tipo, no una prediccion de tu tarea:');
  di('  dice de CUANTAS tareas sale, no de CUANDO, y las anteriores a FDGE-R19 llevaban el');
  di('  trabajo entero en un commit.');
}

// ── viabilidad · ¿se puede empezar esto AHORA? ──────────────────────────────
//
// Las tres cifras se DERIVAN, y cada una llega con su naturaleza (PT-058):
//   coste        de las tareas cerradas de su tipo (PT-057) → ESTIMADO, o SIN EVALUAR si <5
//   precedente   lo mayor completado HOY                    → MEDIDO, o SIN EVALUAR si nada
//   techo        la mayor sesion registrada jamas            → MEDIDO
//
// El «presupuesto disponible» NO aparece porque no existe: PHASE 2 lo midio.

/** Lo que cada dia de trabajo movio. Un dia es la unica aproximacion observable a una sesion. */
function porSesion() {
  // PT-064 · una sesion es de un DIA y de una PERSONA. El dia de dos personas son dos sesiones,
  // y contarlas como una infla el techo del que depende AC-06 de PT-059.
  const fmt = ['%H', '%an', '%ae', '%cs'].join('%x1e');
  const personas = reg.personas ?? [];
  const dias = new Map();
  for (const l of lineas(gitDe(['log', '--no-merges', `--format=${fmt}`]) ?? '').filter(Boolean)) {
    const [sha, nombre, correo, dia] = l.split(SEP_REG);
    const quien = personaDe({ nombre, correo }, personas).persona;
    const clave = `${String(dia).trim()}${SEP_REG}${quien ?? ''}`;
    if (!dias.has(clave)) dias.set(clave, { dia: String(dia).trim(), persona: quien, shas: [] });
    dias.get(clave).shas.push(sha);
  }
  const out = [];
  for (const [, s] of dias) {
    const { dia, persona, shas } = s;
    let n = 0;
    for (const sha of shas) {
      for (const x of lineas(gitDe(['show', '--numstat', '--format=', '--no-renames', sha]) ?? '')) {
        const [mas, menos, f] = x.split('	');
        if (!f) continue;
        n += (Number(mas) || 0) + (Number(menos) || 0);
      }
    }
    out.push({ dia, persona, commits: shas.length, lineas: n });
  }
  return out;
}

function viabilidad() {
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a));
  if (!id) throw new Error('viabilidad necesita una allocation:  tracker viabilidad PT-059');
  const a = all.find((x) => x?.id === id);
  if (!a) throw new Error(`${id} no existe en el registro. El registro asigna (SUITE-R08).`);

  const conDato = cerradasConCoste().filter((c) => !c.sinCommit);
  // PT-064 · el precedente y el techo se filtran SIEMPRE por la persona local: comparar contra el
  // trabajo de otro es comparar contra nada. El coste tipico NO se filtra aqui — es una referencia
  // del TIPO de tarea, y mas casos es mejor referencia.
  const yo = personaLocal(gitDe(['config', 'user.name']), gitDe(['config', 'user.email']),
    reg.personas ?? []).persona;
  const ref = costeDe(conDato, { tipo: a.type, complejidad: a.complexity ?? null });
  const coste = ref.referencia
    ? cifra(ref.referencia.lineas.mediana, ESTIMADO)
    : cifra(null, SIN_EVALUAR);

  const sesiones = porSesion();
  const hoy = gitDe(['log', '-1', '--format=%cs']);
  // PT-060 · si hay sesion abierta, el precedente sale de la SESION REAL. Sin marca sale del dia,
  // que es una APROXIMACION —PHASE 2 de PT-060 lo midio: coinciden por casualidad— y se DICE.
  // PT-068 · la MISMA marca que lee «sesion». Antes leia SESSION.json siempre, asi que el
  // mismo tracker daba dos respuestas sobre que sesion esta abierta: sesion decia 7735ff4 y
  // viabilidad 258be16. Los quince veredictos de EP-017 se registraron con esa base.
  const marcaSesion = marcaDe(yo, (f) => leerJSON(join(IMPL, f)));
  // El precedente es lo mayor COMPLETADO en esta sesion. Si la sesion acaba de empezar no hay
  // con que comparar, y eso es SIN EVALUAR — no cero.
  const deLaSesion = marcaSesion?.desde ? new Set(movidoDesde(marcaSesion.desde).tareas) : null;
  const mayorHoy = Math.max(0, ...soloDe(conDato, yo)
    .filter((c) => (deLaSesion ? deLaSesion.has(c.id) : ultimoDiaDe(c.id) === hoy))
    .map((c) => c.lineas));
  const precedente = mayorHoy > 0 ? cifra(mayorHoy, MEDIDO) : cifra(null, SIN_EVALUAR);
  const mias = soloDe(sesiones, yo);
  const techo = mias.length
    ? cifra(Math.max(...mias.map((s) => s.lineas)), MEDIDO)
    : cifra(null, SIN_EVALUAR);

  const v = viabilidadDe(coste, precedente, techo);
  di('');
  di(`  ${a.id} · ${a.type}/${a.complexity ?? '?'}`);
  di(`    coste tipico    ${textoCifra(coste)}${ref.casos ? `   de ${ref.casos} cerradas` : ''}`);
  di(`    mayor hecho     ${textoCifra(precedente)}   ${marcaSesion?.desde
    ? `en la sesion abierta en ${String(marcaSesion.desde).slice(0, 7)}`
    : `en el DIA ${hoy} — no hay sesion abierta, y el dia NO es la sesion (PT-060)`}`);
  di(`    techo historico ${textoCifra(techo)}   la mayor sesion registrada${yo ? ` de ${yo}` : ''}`);
  di('');
  di(`    veredicto       ${v.veredicto}${v.nunca ? '  ·  NUNCA CABRIA' : ''}`);
  di('');
  for (const linea of envolver(v.motivo, 88)) di(`  ${linea}`);
  di('');
  di('  Esto mide PRECEDENTE, no capacidad: el presupuesto disponible es SIN EVALUAR siempre,');
  di('  porque el contexto del modelo no se puede medir desde aqui (LEXICON 6.5d).');

  // PT-075 · FDGE-R54 · consultar no basta si no consta. Una compuerta cuyo resultado no se
  // escribe no se puede auditar, y esta llevaba cuatro lotes sin que nadie supiera si se habia
  // abierto: no habia regla que la exigiera, fase que la abriera ni verificador que la echara
  // en falta.
  //
  // Se escribe SOLO lo derivado (LEX-R26). «medido_en» declara CONTRA QUE sesion se comparo, y
  // no es un adorno: mientras PT-068 no cierre, la marca sale de SESSION.json —el huerfano— y
  // el campo deja constancia de cual era la base de cada registro.
  if (!ARGS.includes('--registrar')) {
    di('  Y es CONSULTA: para que CONSTE hace falta --registrar (FDGE-R54).');
    return;
  }
  a.viabilidad = {
    veredicto: v.veredicto,
    coste: { valor: coste.valor, naturaleza: coste.naturaleza },
    precedente: { valor: precedente.valor, naturaleza: precedente.naturaleza },
    techo: { valor: techo.valor, naturaleza: techo.naturaleza },
    medido_en: marcaSesion?.desde ?? null,
    fecha: hoy,
  };
  guardarRegistro(reg, ACCION);
  notas.push(`${id}: viabilidad ${v.veredicto} registrada en REGISTRY.allocations[].viabilidad`);
  di(`  REGISTRADO: ${id}.viabilidad = ${v.veredicto} (FDGE-R54).`);
}

/** Corta un texto en lineas de ancho maximo, sin partir palabras. */
function envolver(texto, ancho) {
  const out = [];
  let fila = '';
  for (const palabra of String(texto).split(/\s+/)) {
    if ((fila + ' ' + palabra).trim().length > ancho) { out.push(fila.trim()); fila = palabra; }
    else fila += ' ' + palabra;
  }
  if (fila.trim()) out.push(fila.trim());
  return out;
}

/** El dia del ULTIMO commit propio de una tarea. */
function ultimoDiaDe(id) {
  const s = gitDe(['log', '--no-merges', '-1', '--format=%cs', '--grep', `^[a-z]*: ${id}`, '-E']);
  return s || null;
}

// ── sesion · el worker, no el estado ────────────────────────────────────────
//
// SESSION != STATE != TASK. «abrir» es lo UNICO que marca; «sesion» y «cerrar» solo derivan.

/**
 * El archivo de sesion de la persona local. PT-065: con «personas» declaradas, cada una escribe
 * el suyo — dos personas nunca tocan el mismo archivo, asi que no hay conflicto que resolver.
 */
const yoSoy = () => personaLocal(gitDe(['config', 'user.name']), gitDe(['config', 'user.email']),
  reg.personas ?? []).persona;
const F_SESION = () => join(IMPL, archivoSesion(yoSoy()));

/** Todas las marcas de sesion que hay en el disco, para ver las ajenas (AC-06). */
const marcasDeSesion = () => sesionesUnicas(todasLasMarcas());
const todasLasMarcas = () => {
  try {
    return readdirSync(IMPL)
      .filter((f) => /^SESSION(-.+)?\.json$/.test(f))
      // PT-068 · se marca cual viene del archivo PROPIO para que gane al deduplicar.
      .map((f) => { const m = leerJSON(join(IMPL, f)); return m && f !== 'SESSION.json' ? { ...m, __propia: true } : m; })
      .filter(Boolean);
  } catch { return []; }
};

/** Lo que la sesion lleva movido, derivado de «desde..HEAD». */
function movidoDesde(desde) {
  const shas = lineas(gitDe(['log', '--no-merges', '--format=%H %s', `${desde}..HEAD`]) ?? '').filter(Boolean);
  const archivos = new Set();
  const tareas = new Set();
  let lin = 0;
  for (const l of shas) {
    const corte = l.indexOf(' ');
    const sha = corte < 0 ? l : l.slice(0, corte);
    const id = duenoDe(corte < 0 ? '' : l.slice(corte + 1));
    if (id) tareas.add(id);
    for (const x of lineas(gitDe(['show', '--numstat', '--format=', '--no-renames', sha]) ?? '')) {
      const [mas, menos, f] = x.split('	');
      if (!f) continue;
      archivos.add(f);
      lin += (Number(mas) || 0) + (Number(menos) || 0);
    }
  }
  return { commits: shas.length, archivos: archivos.size, lineas: lin, tareas: [...tareas].sort() };
}

/** Apila una linea en el ledger de sesiones. SUITE-R09: se anade, nunca se reescribe. */
function apilarEnLog(texto) {
  const f = join(IMPL, 'SESSION_LOG.md');
  if (!existsSync(f)) return false;
  writeFileSync(f, readFileSync(f, 'utf8').replace(/\s*$/, '') + SALTO + SALTO + texto + SALTO);
  return true;
}

function sesion() {
  const sub = ARGS.slice(1).find((a) => ['abrir', 'cerrar'].includes(a)) ?? 'ver';
  // PT-068 · la propia; y el respaldo SOLO si no declara otra persona. Un proyecto de una sola
  // persona no cambia (AC-05 de PT-065); una identidad ajena deja de heredar trabajo que no es
  // suyo.
  const marca = marcaDe(yoSoy(), (f) => leerJSON(join(IMPL, f)));
  const cp = leerJSON(join(IMPL, 'CHECKPOINT.json'));

  if (sub === 'abrir') {
    // Lo UNICO capturado en todo esto. Es una MARCA —verificable en el momento en que se pone—,
    // no memoria. LEX-R26 prohibe lo otro.
    const desde = gitDe(['rev-parse', 'HEAD']);
    if (!desde) throw new Error('no se pudo leer HEAD: sin git no hay marca, y una marca inventada seria peor que ninguna (RULE-06).');
    const nueva = { persona: yoSoy(), desde, abierta: gitDe(['log', '-1', '--format=%cs']), generado: gitDe(['log', '-1', '--format=%cs']) };
    writeFileSync(F_SESION(), JSON.stringify(nueva, null, 2) + SALTO);
    apilarEnLog(`## ${nueva.abierta} · sesion abierta en \`${desde.slice(0, 7)}\`` + SALTO + SALTO
      + '<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.');
    notas.push(`${archivoSesion(nueva.persona)} escrito: desde ${desde.slice(0, 7)}`);
    di('');
    di(`  sesion abierta desde ${desde.slice(0, 7)}`);
    return;
  }

  const s = sesionDe(marca, marca?.desde ? movidoDesde(marca.desde) : {}, cp);

  if (sub === 'cerrar') {
    const h = handoffDeSesion(s, cp);
    di('');
    for (const l of lineas(h)) di(`  ${l}`);
    di('');
    apilarEnLog(`## ${gitDe(['log', '-1', '--format=%cs'])} · sesion cerrada` + SALTO + SALTO
      + '<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:' + SALTO + SALTO
      + '```' + SALTO + h + SALTO + '```');
    // PT-068 · el mensaje afirmaba que la marca vieja se reescribiria al abrir la siguiente, y
    // era FALSO desde PT-065: nadie vuelve a escribir SESSION.json. Se dice lo que ocurre.
    //
    // El texto anterior NO se cita literalmente aqui a proposito: hay un caso que comprueba su
    // ausencia en el archivo, y una cita en un comentario lo pondria en rojo. Es la familia de
    // PT-051 —un patron literal en un comentario contado como emision real—, y me paso al
    // arreglar precisamente esto.
    di(`  Apilado en SESSION_LOG.md. ${archivoSesion(yoSoy())} NO se borra: al abrir la siguiente`);
    di('  se sobrescribe. Un SESSION.json antiguo, si lo hay, ya no se escribe (PT-068).');
    di('  Y HANDOFF.md queda INTACTO: su prosa es lo unico del estado que no se puede derivar.');
    // PT-085 · B · y se COMMITEA, o no se dice que cerro.
    //
    // SUITE-R09 hace este ledger append-only para que sea la prueba de que algo ocurrio. Una
    // prueba que vive solo en el arbol de trabajo no es una prueba: la entrada del cierre del
    // 2026-08-19 seguia sin commitear a la mañana siguiente, y la encontro una revision, no una
    // comprobacion.
    //
    // Se commitea SOLO SESSION_LOG.md. Arrastrar el resto del arbol mezclaria trabajo ajeno en
    // un commit de cierre — y `tracker avanzar` ya establecio la forma: los actos de un comando
    // son suyos o no son.
    // `gitDe` devuelve null en vez de lanzar, asi que el fallo se comprueba mirando el valor.
    // Envolverlo en try/catch no habria cazado nada — y el caso habria pasado en verde.
    const LEDGER = 'docs/implementation/SESSION_LOG.md';
    const anadido = gitDe(['add', '--', LEDGER]);
    if (anadido === null) {
      throw new Error('la sesion NO se cierra: la entrada se escribio en SESSION_LOG.md y git no pudo indexarla. '
        + 'Un ledger append-only sin commit no es un rastro (SUITE-R09).');
    }
    const pendiente = gitDe(['diff', '--cached', '--name-only', '--', LEDGER]);
    if (pendiente) {
      const hecho = gitDe(['commit', '-m', 'chore: sesion cerrada · entrada del ledger (SUITE-R09)',
        '--only', '--', LEDGER]);
      if (hecho === null) {
        throw new Error('la sesion NO se cierra: la entrada esta en SESSION_LOG.md y el commit fallo. '
          + 'Un cierre que dice haber ocurrido sin dejar rastro es peor que no cerrar, porque la sesion '
          + 'siguiente confia en el. Commitea a mano y vuelve a ejecutar.');
      }
      di('  Entrada COMMITEADA: un ledger append-only sin commitear no es un rastro.');
    } else {
      di('  (la entrada ya estaba commiteada)');
    }
    return;
  }

  di('');
  if (!s.abierta) { di(`  ${s.motivo}`); return; }
  di(`  sesion desde ${s.desde_corto}${s.abierta_en ? ` (${s.abierta_en})` : ''}`);
  di(`    commits    ${textoCifra(s.commits)}`);
  di(`    archivos   ${textoCifra(s.archivos)}`);
  di(`    lineas     ${textoCifra(s.lineas)}`);
  if (s.tareas.length) di(`    tareas     ${s.tareas.join(' · ')}`);
  if (s.pt) di(`    en curso   ${s.pt} · PHASE ${s.phase}`);
  // AC-06 · las ajenas SE VEN. Si cada persona solo viera la suya, las dos creerian que trabajan
  // solas y ninguna entenderia por que las cifras no cuadran.
  const ajenas = sesionesAjenas(marcasDeSesion(), yoSoy());
  if (ajenas.length) {
    di('');
    di('  Otras sesiones abiertas:');
    for (const a of ajenas) {
      di(`    ${a.persona} · desde ${String(a.desde ?? '').slice(0, 7)}${a.abierta ? ` (${a.abierta})` : ''}`);
    }
  }
}

// ── personas · quien es quien ───────────────────────────────────────────────
//
// Los NO DECLARADOS salen SIEMPRE, no bajo una bandera: el riesgo de esta tabla es que se quede
// vieja en silencio, y esconderlo detras de una opcion es garantizar que nadie lo mire.

// ── asignar · lo UNICO que escribe un identificador ─────────────────────────
//
// PHASE 2 de PT-062 midio que NADIE asignaba: SUITE-R08 decia que el registro asigna y ninguna
// accion lo hacia — lo hacia quien editaba el archivo a mano. La regla era una afirmacion sin
// nadie que la ejecutara.

/**
 * Un commit con su AUTOR resuelto a persona declarada (PT-061), o null.
 *
 * El separador es %x1e —un caracter de control que no aparece ni en un nombre ni en un asunto—.
 * NO se usa un espacio, como en PT-057: alli el SHA no lleva ninguno y bastaba; aqui un NOMBRE si
 * los lleva, y «Alberto Martinez» se partiria en dos campos.
 */
const commitsConAutor = (rango = null) => {
  const fmt = ['%H', '%an', '%ae', '%s'].join('%x1e');
  const args = ['log', '--no-merges', `--format=${fmt}`];
  if (rango) args.push(rango); else args.push('--all');
  const personas = reg.personas ?? [];
  return lineas(gitDe(args) ?? '').filter(Boolean).map((l) => {
    const [sha, nombre, correo, asunto] = l.split(SEP_REG);
    return {
      sha, nombre, correo, asunto,
      persona: personaDe({ nombre, correo }, personas).persona,
    };
  });
};

/** Los numeros ya usados de un prefijo, derivados de las allocations. */
const usadosDe = (prefijo) => all
  // El escapado dentro de un RegExp construido con plantilla necesita DOS barras: con una,
  // el patron busca la letra «d» literal y no casa nada — y «asignar» decia 0 usados
  // mientras «personas» decia 65. Lo vio ejecutar las dos seguidas.
  .map((a) => String(a?.id ?? '').match(new RegExp('^' + prefijo + '-(\\d+)$')))
  .filter(Boolean)
  .map((m) => Number(m[1]));

// PT-103 · los tipos que LEXICON declara. Se enumeran aqui —y no se acepta cualquier cadena—
// porque un campo que admite lo que sea es un campo que no decide nada: es el mismo defecto que
// PT-100 arreglo para los tipos de caso QA, un paso mas arriba.
// PT-124 · la lista vive en patrones.mjs y verify-suite la compara con LEXICON §8.1.
const SEVERIDADES = ['S0', 'S1', 'S2', 'S3'];

function asignar() {
  const prefijo = ARGS.slice(1).find((a) => /^[A-Z]+$/.test(a)) ?? 'PT';
  const iSlug = ARGS.indexOf('--slug');
  const slug = iSlug >= 0 ? ARGS[iSlug + 1] : null;
  const soloVer = ARGS.includes('--ver');
  if (!slug && !soloVer) {
    throw new Error('asignar necesita un slug:  tracker asignar PT --slug lo-que-sea');
  }

  // PT-103 · esto escribia CUATRO campos de nueve y dejaba fuera «type», «severity», «epic» y
  // «phase» — los que el marco EXIGE. Un BUG de un lote con severidad no se podia registrar con
  // el comando, asi que cada tarea nueva OBLIGABA a escribir REGISTRY.json a mano; sin «phase»,
  // avanzar no movia nada. Una regla que solo se puede cumplir saltandose la herramienta no se
  // cumple: se rodea. En la sesion que abrio esta tarea se rodeo cinco veces.
  const flag = (n) => { const i = ARGS.indexOf(n); return i >= 0 ? ARGS[i + 1] : null; };
  const tipo = flag('--tipo');
  const sev = flag('--severidad');
  const epica = flag('--epica');
  const titulo = flag('--titulo');
  if (tipo && !TIPOS_DE_ITEM.includes(tipo)) {
    throw new Error(`«${tipo}» no es un tipo de item. LEXICON §8.1 declara: ${TIPOS_DE_ITEM.join(' · ')}`);
  }
  if (sev && !SEVERIDADES.includes(sev)) {
    throw new Error(`«${sev}» no es una severidad. LEXICON declara: ${SEVERIDADES.join(' · ')}`);
  }
  if (epica && !esLote({ id: epica })) {
    throw new Error(`«${epica}» no es un lote: un lote se reconoce por su ID (LEX-R27).`);
  }

  const yo = personaLocal(gitDe(['config', 'user.name']), gitDe(['config', 'user.email']),
    reg.personas ?? []).persona;
  const mia = (reg.personas ?? []).find((p) => p?.nombre === yo);
  const usados = usadosDe(prefijo);

  let numero;
  let deDonde;
  if (mia?.rango?.[prefijo]) {
    const r = siguienteEnRango(prefijo, mia.rango[prefijo], usados);
    if (r.numero == null) { throw new Error(r.motivo); }
    numero = r.numero;
    const [d, h] = mia.rango[prefijo];
    deDonde = `del rango de ${yo}: ${prefijo} [${d}-${h}] · ${usados.filter((n) => n >= d && n <= h).length} usados`;
  } else {
    // AC-06 · sin rangos, EXACTAMENTE como hoy: el contador global.
    numero = Number(reg.counters?.[prefijo] ?? Math.max(0, ...usados)) + 1;
    deDonde = mia
      ? `${yo} no declara rango para ${prefijo}: del contador global, como siempre`
      : 'sin rangos declarados: del contador global, como siempre';
  }

  const id = `${prefijo}-${String(numero).padStart(3, '0')}`;
  di('');
  di(`  ${id}${slug ? ` · ${slug}` : ''}`);
  di(`  ${deDonde}`);
  // PT-103 · se DICE con que nace, incluido lo que no se declaro. Un campo ausente que nadie
  // nombra es el que luego se escribe a mano.
  if (tipo) di(`  tipo: ${tipo}`);
  if (sev) di(`  severidad: ${sev}`);
  if (epica) di(`  lote: ${epica}`);
  di('  arranca en PHASE 1');
  const faltan = [!tipo && '--tipo', !sev && '--severidad'].filter(Boolean);
  if (faltan.length) di(`  sin declarar: ${faltan.join(' ')} — habra que declararlos antes de G1`);
  // PT-117 · SUITE-R18 · la allocation nace declarando bajo que version se abre, y no es un
  // campo mas: `checkPT` deriva el alcance de una regla de
  //
  //     intake.match(RE_SUITE_YAML)?.[1] ?? enRegistroPT?.suite_version ?? "0.0.0"
  //
  // y una allocation RECIEN CREADA no tiene intake todavia. Sin este campo cae a "0.0.0", asi
  // que NINGUNA regla nueva la alcanza — y la recien creada es justo la que FDGE-R55 tiene que
  // cazar. La comprobacion habria salido VERDE POR CONSTRUCCION sobre su propio caso de uso.
  //
  // Si la version no se puede leer NO SE INVENTA (RULE-06): un "0.0.0" escrito a proposito
  // afirmaria que la allocation nacio antes de todo, y eso apagaria comprobaciones en silencio.
  // Ausente se distingue de falso; un valor inventado, no.
  //
  // VA ANTES del return de --ver: esa bandera existe para DECIR con que nace la allocation sin
  // escribirla, y una version que solo se dice cuando ya se ha escrito no sirve para eso.
  const versionAlNacer = VERSION_DEL_PROYECTO !== '0.0.0' ? VERSION_DEL_PROYECTO : null;
  if (versionAlNacer) di(`  suite_version: ${versionAlNacer}`);
  else di(`  suite_version: SIN EVALUAR — el registro no la declara y no se inventa (RULE-06)`);
  if (soloVer) { di(''); di('  --ver: no se ha escrito nada.'); return; }

  reg.counters = reg.counters ?? {};
  if (!mia?.rango?.[prefijo]) reg.counters[prefijo] = numero;
  // PT-103 · «phase: 1» SIEMPRE. Sin el, Number(undefined) es NaN y avanzar no puede mover la
  // allocation nunca — que es como PT-096 descubrio esto: fue la primera creada con «asignar»
  // desde PT-062, y hubo que escribir el campo a mano.

  reg.allocations.push({
    id, slug, created: gitDe(['log', '-1', '--format=%cs']), status: 'DRAFT', phase: 1,
    ...(versionAlNacer ? { suite_version: versionAlNacer } : {}),
    ...(tipo ? { type: tipo } : {}),
    ...(sev ? { severity: sev } : {}),
    ...(epica ? { epic: epica } : {}),
    ...(titulo ? { title: titulo } : {}),
  });
  guardarRegistro(reg, ACCION);
  notas.push(`${id} asignado y escrito en REGISTRY.json`);
}

// ── parada · FDGE-R55 · lo que se detiene se escribe en su tarea ────────────
//
// El medio ya existia: «avanzar» publica su nota en el issue, o en TRANSICIONES.log si no hay
// plataforma (PT-084). Lo que faltaba era un comando para la parada QUE NO ES UNA TRANSICION —
// el hallazgo, la condicion bloqueante, la compuerta, el limite—, y por eso las explicaciones
// vivian en la conversacion: la unica forma de publicarlas era a mano.
//
// Medido en EP-020: SIETE tareas cerradas con todos sus hallazgos solo en el chat, y las siete
// notas publicadas a mano despues de que lo senalara el firmante.
//
// EL TEXTO ENTRA POR ARCHIVO (SUITE-R59). Una explicacion son parrafos, y esta sesion acumulo
// CINCO roturas de escapado por construir texto dentro del literal de otro lenguaje.
function parada() {
  // PT-117 · «--pendientes» es CONSULTA: enumera las allocations que la regla alcanza y todavia
  // no citan la parada que las produjo. No escribe nada y no toca la plataforma.
  //
  // Existe porque el hook Stop necesita algo REAL que invocar. Sin esto, el hook habria llamado a
  // una bandera inventada — y una segunda red que no puede ejecutarse es exactamente el defecto
  // que PT-133 acaba de arreglar: codigo correcto detras de una puerta cerrada.
  //
  // La lista se DERIVA del registro. No hay estado nuevo: un segundo sitio donde apuntar que algo
  // esta pendiente seria un hecho con dos nombres (LEX-R22).
  if (ARGS.includes('--pendientes')) {
    const desde = RIGE_DESDE['FDGE-R55'] ?? [13, 0, 0];
    const alcanza = (v) => {
      const p = String(v ?? '0.0.0').split('.').map(Number);
      for (let i = 0; i < 3; i += 1) {
        if ((p[i] ?? 0) !== (desde[i] ?? 0)) return (p[i] ?? 0) > (desde[i] ?? 0);
      }
      return true;
    };
    const sinCitar = all.filter((a) => a?.suite_version && alcanza(a.suite_version)
      && !a.origen_parada?.de
      && !(String(a.id ?? '').startsWith('EP-') && !a.epic));
    di('');
    if (!sinCitar.length) {
      di('  FDGE-R55: ninguna allocation alcanzada sin citar su parada.');
    } else {
      di(`  FDGE-R55 · ${sinCitar.length} allocation(s) sin citar la parada que las produjo:`);
      for (const a of sinCitar) di(`    ${a.id}${a.slug ? ` · ${a.slug}` : ''}`);
      di('');
      di('  tracker parada <PT que paro> --motivo <clase> --texto <ruta> --desenlace abre --abre <ID>');
    }
    return;
  }

  const id = ARGS.slice(1).find((x) => /^(PT|EP)-\d+$/.test(x));
  const flag = (n) => { const i = ARGS.indexOf(n); return i >= 0 ? ARGS[i + 1] : null; };
  const motivo = flag('--motivo');
  const ruta = flag('--texto');
  const desenlace = flag('--desenlace');
  const abre = flag('--abre');

  if (!id) throw new Error('parada necesita una allocation:  tracker parada PT-131 --motivo hallazgo --texto nota.md --desenlace continua');
  const a = all.find((x) => x?.id === id);
  if (!a) throw new Error(`${id} no existe en el registro. El registro asigna (SUITE-R08): sin allocation no hay parada.`);

  // Las dos listas son CERRADAS y las declara LEXICON §8.5. Un valor fuera de ellas se RECHAZA:
  // aceptarlo convertiria la clase en prosa, y entonces la matriz de PT-119 no podria contar nada.
  if (!motivo || !MOTIVOS_DE_PARADA.includes(motivo)) {
    throw new Error(`--motivo es obligatorio y de la lista cerrada. LEXICON §8.5 declara: ${MOTIVOS_DE_PARADA.join(' · ')}`);
  }
  if (!desenlace || !DESENLACES_DE_PARADA.includes(desenlace)) {
    throw new Error(`--desenlace es obligatorio y de la lista cerrada. LEXICON §8.5 declara: ${DESENLACES_DE_PARADA.join(' · ')}`);
  }
  if (!ruta) throw new Error('--texto es obligatorio y es una RUTA a un archivo, no el texto: una explicacion son parrafos (SUITE-R59).');
  if (!existsSync(ruta)) throw new Error(`no existe «${ruta}». --texto es una RUTA (SUITE-R59): escribe la explicacion en un archivo.`);
  const texto = readFileSync(ruta, 'utf8').trim();
  if (!texto) throw new Error(`«${ruta}» esta vacio. Una parada sin explicacion es una nota que no explica nada.`);

  // «abre» sin destino seria una afirmacion sin contraste, y es justo el enlace que PT-117
  // necesita para exigir que toda allocation nueva cite la parada que la produjo.
  if (desenlace === 'abre') {
    if (!abre) throw new Error('--desenlace abre exige --abre con la allocation que nace.');
    if (!all.some((x) => x?.id === abre)) {
      throw new Error(`--abre cita «${abre}», que no esta en el registro. El registro asigna (SUITE-R08).`);
    }
  } else if (abre) {
    throw new Error(`--abre solo tiene sentido con «--desenlace abre», y este dice «${desenlace}».`);
  }

  // Una transicion de fase NO se publica por aqui: es FDGE-R52 y la escribe «avanzar», que ademas
  // mueve el registro en el mismo acto atomico. Publicarla suelta dejaria una nota sobre una
  // transicion que no ocurrio (LEX-R30).
  if (desenlace === 'cambia-fase') {
    throw new Error('«cambia-fase» es el caso particular de FDGE-R52 y lo escribe «avanzar», que '
      + 'ademas mueve el registro en el mismo acto. Publicarla aqui dejaria una nota sobre una '
      + 'transicion que no ocurrio (LEX-R30):  tracker avanzar ' + id + ' --a <fase> --nota "..."');
  }

  const cuerpo = cuerpoDeParada({ id, motivo, texto, desenlace, abre });

  // PT-117 · TS-05 · las precondiciones de plataforma suben AQUI, antes de escribir nada.
  // Estaban dentro del if que publica, o sea DESPUES del guardado: una parada que no pudiera
  // publicarse habria dejado un origen_parada apuntando a una nota que no existe. El orden es
  // VALIDAR TODO -> escribir lo reversible -> publicar lo irreversible, y es el mismo contrato
  // que PT-132 arreglo en «abrir».
  if (adaptador?.comentar) {
    if (!a.issue) throw new Error(`${id} no tiene issue y hay plataforma declarada: la parada debe espejarse (SUITE-R35).  tracker abrir --aplicar`);
    if (adaptador.disponible && !adaptador.disponible()) {
      throw new Error('hay plataforma declarada y no hay acceso: la parada no podria publicarse (FND-R30).  gh auth login');
    }
  }
  // PT-117 · FDGE-R55 · EL ENLACE ES UN HECHO DEL REGISTRO, no una nota que haya que leer.
  //
  // La regla declara su propio limite: lo mecanizable es «toda allocation nueva cita la parada
  // que la produjo». Se escribe AQUI, en el mismo acto que publica, porque la pregunta «que
  // parada abrio esto» solo tiene respuesta fiable EN EL MOMENTO: a las dos horas se
  // reconstruye de memoria, que es el defecto original.
  //
  // Contra el REGISTRO y no contra los comentarios del issue: un verificador que necesitara red
  // para decidir si una tarea cumple no podria correr en un repositorio sin plataforma, y
  // SUITE-R22 declara ese caso soportado. El registro asigna (SUITE-R08); el tablero espeja.
  //
  // ORDEN: el registro se guarda ANTES de publicar. Lo reversible primero, lo irreversible al
  // final — contrato de avanzar (PT-053) y el que PT-132 acaba de arreglar en abrir. Si se
  // publicara primero y fallara el guardado, quedaria una nota sin enlace; al reves solo queda
  // un enlace que la siguiente ejecucion vuelve a intentar publicar.
  if (desenlace === 'abre') {
    const nacida = all.find((x) => x?.id === abre);
    nacida.origen_parada = {
      de: id,
      motivo,
      fecha: gitDe(['log', '-1', '--format=%cs']) ?? null,
    };
    guardarRegistro(reg, ACCION);
    notas.push(`${abre}: origen_parada ← ${id} · motivo ${motivo}`);
  }

  if (adaptador?.comentar) {
    adaptador.comentar(a.issue, cuerpo);
    notas.push(`${id}: parada publicada en #${a.issue} · motivo ${motivo} · desenlace ${desenlace}`);
  } else {
    // PT-084 · sin tablero, al ledger. Append-only (SUITE-R09): una parada que se reescribe deja
    // de ser un rastro, y SUITE-R22 declara soportado el proyecto que no espeja.
    const rutaLog = join(IMPL, 'TRANSICIONES.log');
    const previo = (() => { try { return readFileSync(rutaLog, 'utf8'); } catch { return ''; } })();
    const cuando = gitDe(['log', '-1', '--format=%cs']) ?? 'sin-fecha';
    writeFileSync(rutaLog, `${previo}${SALTO}## ${cuando} · ${id} · PARADA · ${motivo}${SALTO}${SALTO}${cuerpo}${SALTO}`, 'utf8');
    notas.push(`${id}: parada en docs/implementation/TRANSICIONES.log — no hay plataforma declarada`);
  }
}

// ── tipo · el «type» del registro sale del intake, que es quien manda ───────
//
// PT-124 · PT-125 y PT-126 quedaron SIN «type» en el registro porque «asignar» rechazaba
// INVESTIGATION y CHORE. Sus intakes SI lo declaran, y PT-004 dice que manda el YAML: es lo que
// el PT dice de si mismo.
//
// NO SE ESCRIBE A MANO en REGISTRY.json —el registro solo lo escribe el comando (PT-103,
// PT-107)— y no se INVENTA: se DERIVA del intake, se valida contra LEXICON §8.1, y si el intake
// no lo declara se dice en vez de adivinar (RULE-06).
//
// Lo general —sincronizar TODO lo que el YAML manda hacia el registro— es de PT-121. Esto es el
// campo que PT-124 dejo pendiente, y nada mas.
function tipo() {
  const id = ARGS.slice(1).find((x) => /^(PT|EP)-\d+$/.test(x));
  if (!id) throw new Error('tipo necesita una allocation:  tracker tipo PT-125');
  const a = all.find((x) => x?.id === id);
  if (!a) throw new Error(`${id} no existe en el registro. El registro asigna (SUITE-R08).`);
  if (esLote(a)) throw new Error(`${id} es un lote y un lote NO lleva «type» (LEX-R27).`);

  const fIntake = join(ROOT, 'changes', a.slug ? `${a.id}-${a.slug}` : a.id, 'intake.md');
  if (!existsSync(fIntake)) throw new Error(`${id} no tiene intake en ${fIntake}: sin el no hay de donde derivar el tipo.`);
  const enYaml = readFileSync(fIntake, 'utf8').match(/^type:[ \t]*([A-Z]+)[ \t]*$/m)?.[1];
  if (!enYaml) {
    throw new Error(`el intake de ${id} no declara «type». Se declara ahi primero: manda el YAML `
      + '(PT-004), y el registro lo espeja.');
  }
  if (!TIPOS_DE_ITEM.includes(enYaml)) {
    throw new Error(`el intake de ${id} declara «${enYaml}», que no es un tipo de item. `
      + `LEXICON §8.1 declara: ${TIPOS_DE_ITEM.join(' · ')}`);
  }
  if (a.type === enYaml) { notas.push(`${id}: el registro ya declara «${enYaml}». Nada que hacer.`); return; }
  if (a.type && a.type !== enYaml) {
    // No se elige: se DICE. La precedencia de PT-004 no cambia, pero pisar en silencio un valor
    // distinto es lo que SUITE-R35 existe para impedir.
    di('');
    di(`  ${id}: el registro dice «${a.type}» y su intake «${enYaml}».`);
    di('  Se espeja el del intake, que es lo que el PT dice de si mismo (PT-004).');
    di('');
  }
  a.type = enYaml;
  guardarRegistro(reg, ACCION);
  notas.push(`${id}: «type: ${enYaml}» espejado desde el intake al registro (PT-004, SUITE-R35)`);
}

// ── rama · como debe llamarse la de una tarea ───────────────────────────────
//
// PROPONE, no crea: crear una rama toca el arbol de trabajo y si falla a mitad deja a quien la
// usa en otro sitio (PT-054). Lo que no se automatiza se describe (EXEC-R07).
function rama() {
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a));
  if (!id) throw new Error('rama necesita una allocation:  tracker rama PT-063');
  const a = all.find((x) => x?.id === id);
  if (!a) throw new Error(`${id} no existe en el registro. El registro asigna (SUITE-R08).`);

  const yo = personaLocal(gitDe(['config', 'user.name']), gitDe(['config', 'user.email']),
    reg.personas ?? []).persona;
  const propuesta = ramaDeTarea(a.type, a.id, a.slug, yo);
  const integracion = 'trabajo';

  // PT-129 · sin «type» no se propone un nombre inventado: se dice que falta y de donde sale.
  if (propuesta === null) {
    di('');
    di(`  ${id} no declara «type», asi que NO hay nombre de rama que proponer.`);
    di('');
    di('  El <type> de una rama es el «type» del item en minusculas, que declara LEXICON §4.1');
    di('  y escribe el registro (FDGE-R19). Sin el, cualquier nombre seria inventado.');
    di('');
    di(`    node docs/methodology/tools/tracker.mjs asignar --tipo <TIPO>   # o declararlo en el intake`);
    return;
  }

  di('');
  di(`  ${propuesta}`);
  di('');
  if (!yo) {
    di('  Sin persona resuelta: dos niveles, como siempre. Un proyecto de una sola persona');
    di('  no tiene que declarar nada (LEXICON 6.5f).');
    di('');
  }
  // PT-129 · FDGE-R19 exige que un PT vivo en PHASE 5+ declare su rama en
  // REGISTRY.allocations[].branch, y NINGUN comando la escribia: 47 de 151 la llevan, todas a
  // mano. Una regla que solo se puede cumplir escribiendo el registro a mano es la averia que
  // PT-103 y PT-107 cierran — el registro solo lo escribe el comando.
  //
  // «--declarar» escribe la rama REAL, la que git dice que esta en curso, no la propuesta: son
  // cosas distintas cuando un lote se trabaja sobre una sola rama, como hizo EP-019.
  if (ARGS.includes('--declarar')) {
    const actual = gitDe(['rev-parse', '--abbrev-ref', 'HEAD']);
    if (!actual || actual === 'HEAD') {
      throw new Error('no hay rama en curso que declarar: git esta en HEAD desacoplado.');
    }
    if (actual !== propuesta) {
      di(`  La rama en curso es «${actual}» y la propuesta era «${propuesta}».`);
      di('  Se declara LA REAL: el registro dice donde esta el trabajo, no donde deberia estar.');
      di('');
    }
    a.branch = actual;
    guardarRegistro(reg, ACCION);
    notas.push(`${id}: rama «${actual}» declarada en REGISTRY.allocations[].branch (FDGE-R19)`);
    return;
  }

  di('  Asi debe llamarse. NO se crea: crear una rama toca el arbol de trabajo, y si falla');
  di('  a mitad deja a quien la usa en otro sitio. Lo que no se automatiza se describe:');
  di('');
  di(`    git switch ${integracion}`);
  di(`    git checkout -b ${propuesta}`);
  di('');
  di('  Y cuando exista, se DECLARA en el registro — FDGE-R19 la exige desde PHASE 5:');
  di('');
  di(`    node docs/methodology/tools/tracker.mjs rama ${id} --declarar`);
}

function personas() {
  const decl = reg.personas ?? [];
  const crudo = gitDe(['log', '--format=%an%x09%ae']) ?? '';
  const cuenta = new Map();
  for (const l of lineas(crudo).filter(Boolean)) {
    const [nombre, correo] = l.split('	');
    const k = `${nombre}	${correo}`;
    cuenta.set(k, (cuenta.get(k) ?? 0) + 1);
  }
  const sinDeclarar = [];
  const porPersona = new Map(decl.map((p) => [p.nombre, []]));
  for (const [k, n] of cuenta) {
    const [nombre, correo] = k.split('	');
    const r = personaDe({ nombre, correo }, decl);
    if (r.persona) porPersona.get(r.persona).push({ nombre, correo, n });
    else sinDeclarar.push({ nombre, correo, n });
  }
  di('');
  if (!decl.length) {
    di('  Ninguna persona declarada. El marco funciona como si no existieran, y con una sola');
    di('  persona no hace falta declarar nada (LEXICON 6.5f).');
  }
  for (const [nombre, ids] of porPersona) {
    const p = decl.find((x) => x?.nombre === nombre);
    const r = p?.rango?.PT;
    if (r) {
      const usados = all.map((a) => String(a?.id ?? '').match(/^PT-(\d+)$/)).filter(Boolean)
        .map((m) => Number(m[1])).filter((n) => n >= r[0] && n <= r[1]);
      const sig = siguienteEnRango('PT', r, usados);
      di(`  ${nombre}`.padEnd(30) + `PT [${r[0]}-${r[1]}] · ${usados.length} usados · siguiente ${sig.numero ?? 'AGOTADO'}`);
    } else {
      di(`  ${nombre}`);
    }
    for (const i of ids.sort((a, b) => b.n - a.n)) {
      di(`    ${i.nombre} <${i.correo}>`.padEnd(52) + `${i.n} commits`);
    }
    di('');
  }
  if (sinDeclarar.length) {
    const total = sinDeclarar.reduce((s, i) => s + i.n, 0);
    di(`  SIN DECLARAR (${sinDeclarar.length} autor(es) · ${total} commit(s))`);
    for (const i of sinDeclarar.sort((a, b) => b.n - a.n)) {
      di(`    ${i.nombre} <${i.correo}>`.padEnd(52) + `${i.n} commits`);
    }
    di('    → si es de una persona ya declarada, anadelo a su lista «git».');
    di('      No se agrupa por parecido: quien es quien lo dice una persona (LEXICON 6.5f).');
    di('');
  }
  // Esto dice a quien ATRIBUIR un commit, no quien lo escribio: es una declaracion, como
  // «firmantes:», y SUITE-R27 ya dice que una firma no prueba que firmara una persona.
  di('  Esto dice a QUIEN ATRIBUIR un commit, no quien puede hacer que: «firmantes:» de');
  di('  CLAUDE.md sigue respondiendo quien puede firmar, y son cosas distintas.');
}

function siguienteDe() {
  let cp = null;
  try { cp = JSON.parse(readFileSync(join(ROOT, 'docs/implementation/CHECKPOINT.json'), 'utf8')); }
  catch { /* sin checkpoint o ilegible: no se afirma nada. verify-fdge es quien juzga el archivo. */ }
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a));
  const objetivo = id
    ? [all.find((x) => x?.id === id)]
    : vivas.filter((a) => !esLote(a)).sort((x, y) => (y.phase ?? -1) - (x.phase ?? -1));
  if (!objetivo.length || !objetivo[0]) {
    di(id ? `${id} no existe en el registro.` : 'Nada vivo en el registro: no hay trabajo abierto.');
    return;
  }
  for (const a of objetivo) {
    // `null` = no se pudo mirar. `false` = se miro y no hay. La diferencia se REPORTA.
    let pendiente = HAY_TABLERO ? false : null;
    let abierto = null;
    if (HAY_TABLERO && a.issue && adaptador?.comentarios) {
      try { pendiente = comentarioSinResponder(adaptador.comentarios(a.issue)) === true; } catch { /* sin acceso: no se afirma */ }
    }
    if (HAY_TABLERO && a.issue && adaptador?.abiertos) {
      try { abierto = adaptador.abiertos().some((i) => i.number === a.issue); } catch { /* idem */ }
    }
    // Solo se contrasta contra el checkpoint SI ES EL DE ESTA allocation: el checkpoint es UNO
    // (LEX-R26) y el de otra tarea no dice nada de esta.
    const arbol = cp?.pt === a.id
      ? estadoDelArbol(cp, {
        sha: gitDe(['rev-parse', 'HEAD']),
        rama: gitDe(['rev-parse', '--abbrev-ref', 'HEAD']),
        descendiente: desciendeDe(cp.sha),
      })
      : null;
    const r = queSigue(a, { comentarioPendiente: pendiente, issueAbierto: abierto, arbol });
    di('');
    di(`  ${r.id}  ${r.estado}${r.fase !== null && r.fase !== undefined ? `  ·  PHASE ${r.fase} ${r.nombre}` : ''}${a.issue ? `  ·  #${a.issue}` : ''}`);
    if (r.compuerta) di(`  compuerta:  ${r.compuerta}`);
    if (r.produce?.length) di(`  produce:    ${r.produce.join(' · ')}`);
    // Un bloqueo puede ser de varias lineas (STATE_MISMATCH enumera cada discrepancia): se
    // indentan TODAS, o la continuacion se lee como si fuera otra cosa.
    for (const v of r.avisos ?? []) di(`  · ${v}`);
    for (const b of r.bloqueos ?? []) {
      const [cabeza, ...resto] = String(b).split(SALTO);
      di(`  ✗ BLOQUEA:  ${cabeza}`);
      for (const l of resto) di(`              ${l}`);
    }
    di(`  siguiente:  ${r.siguiente}`);
  }
  di('');
  di('  Esto se DERIVA del registro y del tablero (SUITE-R48). No es una opinión: si algo aquí');
  di('  no cuadra con lo que crees que toca, el que se equivoca no es el tablero.');
}

// ── checkpoint · el estado de la tarea EN CURSO, legible por maquina ────────
// PT-052 · LEX-R26 · TODO campo se DERIVA. Ninguno se recuerda.
//
// El criterio no es de estilo: un campo que solo puede rellenar la memoria del agente miente
// CON LA AUTORIDAD DE UN DATO ESTRUCTURADO, y eso es peor que decirlo en prosa — la prosa se lee
// con la duda puesta y un JSON no. La especificacion de la que sale EP-015 pedia «decisions»,
// «blockers» y un «estimated_used: 67» que nadie puede medir; ninguno entra.
//
// Es UNO y se sobrescribe: el estado en curso es el de la tarea que se esta tocando. N archivos
// serian N-1 mintiendo desde el momento de escribirse. Por eso declara de que `pt` es — leerlo
// sin mirar ese campo es el error que lo haria peligroso.
/**
 * ¿El commit declarado es ANTECESOR del actual? `null` si no se puede decidir — y `null` no es
 * `false`: no poder demostrarlo no es haber demostrado lo contrario (RULE-06).
 */
const desciendeDe = (sha) => {
  if (!sha) return null;
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', sha, 'HEAD'], { cwd: ROOT, stdio: 'pipe' });
    return true;
  } catch (e) {
    // Codigo 1 = respondio que NO. Cualquier otro = no pudo responder, y eso no es un no.
    return e?.status === 1 ? false : null;
  }
};

const gitDe = (args, { crudo = false } = {}) => {
  try {
    const s = execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
    // PT-056 · CORRIGE PT-052 · `status --porcelain` empieza cada linea con DOS columnas de estado,
    // y la primera es un ESPACIO cuando el cambio no esta indexado. `trim()` se lo comia y el
    // `slice(3)` posterior cortaba un caracter del path: el CHECKPOINT.json vigente declaraba
    // «hanges/…/intake.md». Un artefacto de gobernanza que afirma una ruta que no existe.
    return crudo ? (s.endsWith(SALTO) ? s.slice(0, -1) : s) : s.trim();
  } catch { return null; }
};

// PT-094 · ¿existe esa rama? Una sola forma de preguntarlo: estaba en linea dentro de
// `checkpoint()` y `avanzar` no la tenia. Un criterio escrito a mano en un sitio es un criterio
// que el otro camino no aplica (SUITE-R38).
const ramaViva = (nombre) => {
  try { execFileSync('git', ['rev-parse', '--verify', `refs/heads/${nombre}`], { cwd: ROOT, stdio: 'pipe' }); return true; }
  catch { return false; }
};

function checkpoint() {
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a));
  if (!id) { throw new Error('checkpoint necesita una allocation:  tracker checkpoint PT-052'); }
  const a = all.find((x) => x?.id === id);
  // RULE-06 · si no esta en el registro no se inventan los campos: se dice.
  if (!a) { throw new Error(`${id} no existe en el registro. El registro asigna (SUITE-R08): sin allocation no hay checkpoint.`); }

  const sucio = gitDe(['status', '--porcelain'], { crudo: true });
  const ramaReal = gitDe(['rev-parse', '--abbrev-ref', 'HEAD']);
  const declaradaViva = a.branch ? ramaViva(a.branch) : null;
  const cp = checkpointDe(a, {
    sha: gitDe(['rev-parse', 'HEAD']),
    rama: ramaReal === 'HEAD' ? null : ramaReal,
    ramaDeclaradaViva: declaradaViva,
    fecha: gitDe(['log', '-1', '--format=%cs']),
    sucio: sucio === null ? null : sucio.length > 0,
    archivos: lineas(sucio ?? '').filter(Boolean).map((l) => l.slice(3)).sort(),
  });

  if (ARGS.includes('--ver')) { di(JSON.stringify(cp, null, 2)); return; }
  writeFileSync(join(ROOT, 'docs/implementation/CHECKPOINT.json'), JSON.stringify(cp, null, 2) + '\n');
  notas.push(`CHECKPOINT.json escrito: ${cp.pt} · PHASE ${cp.phase} ${cp.fase} · ${cp.sha_corto ?? 'sin sha'}` +
    (cp.sucio ? ` · ${cp.archivos.length} archivo(s) sin commitear` : ''));
}

// ── proyectar · ver en que se trabaja sin esperar al merge ──────────────────
// PT-054 · Medido: 13 ramas de tarea en el remoto. La visibilidad existe y esta repartida en trece
// sitios, asi que para ver en que se trabaja hay que saber DE ANTEMANO que rama mirar — que es lo
// que la pregunta pretende evitar. Y `trabajo` solo agrega TRAS FUSIONAR cada tarea.
//
// La rama es DERIVADA por decision del firmante, no autorada: mover la gobernania a otra rama
// romperia el vinculo que ata un cambio a su evidencia —que viajen en el MISMO commit— y dejaria
// a SUITE-R34 comparando fechas entre dos ramas, que no significa nada.
//
// Se escribe con FONTANERIA, que no toca el arbol de trabajo:
//   hash-object -w  ->  mktree  ->  commit-tree  ->  update-ref
// Las alternativas —worktree, checkout— tocan el directorio donde se esta trabajando, y la peor
// deja al usuario EN OTRA RAMA si falla a mitad.
function proyectar({ silencioso = false } = {}) {
  // PT-061 · el nombre sale de la TABLA si la hay. Antes se leia «git config user.name» a pelo,
  // y desde la maquina que produjo los 9 commits de «a81Biz» habria escrito «cauce/a81biz»: OTRA
  // rama, para la MISMA persona, sin que nada lo notara.
  //
  // Sin «personas» declaradas se comporta EXACTAMENTE como antes: un proyecto de una persona no
  // tiene que declarar nada.
  const usuario = personaLocal(gitDe(['config', 'user.name']), gitDe(['config', 'user.email']),
    reg.personas ?? []).persona ?? gitDe(['config', 'user.name']);
  const rama = ramaDe(usuario);
  // RULE-06 · sin usuario no se proyecta. Una rama «cauce/desconocido» seria peor que ninguna:
  // agregaria el trabajo de todos bajo un nombre que no es de nadie.
  if (!rama) {
    const m = 'sin «git config user.name» no se puede saber de quien es la proyeccion: no se proyecta (RULE-06).';
    if (silencioso) return { rama: null, motivo: m };
    notas.push(m);
    return { rama: null, motivo: m };
  }

  const gitEntrada = (args, entrada) => execFileSync('git', args,
    { cwd: ROOT, encoding: 'utf8', input: entrada, stdio: ['pipe', 'pipe', 'pipe'] }).trim();

  // Un commit sin la marca es HUMANO. Se REPORTA y no se borra: decidir que hacer con el trabajo
  // de alguien es humano (SUITE-R06), y borrarlo seria reescribirlo sin preguntar.
  const padre = gitDe(['rev-parse', '--verify', `refs/heads/${rama}`]);

  // PT-140 · SI FALTA LA RAMA LOCAL PERO EL REMOTO LA TIENE, NO SE EMPIEZA DE CERO.
  //
  // Sin esto, «padre» quedaba null, el commit se creaba SIN «-p» y la rama arrancaba un linaje
  // nuevo — con una salida IDENTICA a la del caso bueno. Ocurrio el 2026-08-24 al dejar una sola
  // rama local. No se perdio nada porque el push normal habria sido rechazado por no ser
  // fast-forward: PROTEGIDO POR ACCIDENTE, NO POR DISEÑO, y con el rechazo sin explicacion la
  // lectura obvia —«la rama esta rara, la fuerzo»— si destruye.
  //
  // Es CE-005, verde por no haber mirado. SUITE-R31 ya tenia el criterio para el caso hermano —un
  // commit sin la marca se REPORTA y no se borra— y faltaba la mitad simetrica.
  //
  // NO se trae la rama sola: un «fetch» implicito dentro de un comando que escribe es el efecto
  // colateral que este marco evita. Se DESCRIBE el comando (EXEC-R07).
  if (!padre) {
    // `null` = no se pudo mirar el remoto. `false` = se miro y no esta. No saber NO es permiso.
    let enRemoto = null;
    try {
      const o = execFileSync('git', ['ls-remote', '--heads', 'origin', rama],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
      enRemoto = o.length > 0;
    } catch { enRemoto = null; }
    if (enRemoto === true) {
      fail('SUITE-R31', `«${rama}» no existe en local y SI en origin: proyectar empezaria un linaje `
        + 'NUEVO y la publicacion seria rechazada sin decir por que. Traela primero:  '
        + `git branch ${rama} origin/${rama}`);
      return { rama: null, motivo: 'sin rama local y con rama remota' };
    }
    if (enRemoto === null) {
      fail('SUITE-R31', `«${rama}» no existe en local y NO SE PUDO MIRAR el remoto. No saber no es `
        + 'permiso (RULE-06): empezar de cero podria descartar una historia que existe. '
        + `Comprueba con:  git ls-remote --heads origin ${rama}`);
      return { rama: null, motivo: 'remoto no evaluable' };
    }
    // Se miro y no esta en ninguna parte: es la primera vez, y SE DICE.
    if (!silencioso) notas.push(`${rama}: no existe ni en local ni en origin — se crea AHORA, es la primera proyeccion.`);
  }
  let ajenos = 0;
  if (padre) {
    const msgs = gitDe(['log', '--format=%s%n%b', `refs/heads/${rama}`]) ?? '';
    const sinMarca = (gitDe(['log', '--format=%H', `refs/heads/${rama}`]) ?? '').split(/\r?\n/).filter(Boolean)
      .filter((sha) => !(gitDe(['log', '-1', '--format=%s%n%b', sha]) ?? '').includes(MARCA_PROYECCION));
    ajenos = sinMarca.length;
    void msgs;
  }

  const fecha = gitDe(['log', '-1', '--format=%cs']);
  const contenido = {
    // PT-079 · el cuarto resolvedor es el SHA del CONTENIDO: el ultimo commit que toco el
    // directorio de la tarea. Existe desde PHASE 1 y NO muere con la rama, que es lo que hace
    // reconstruible el rastro cuando FDGE-R19 la borra al fusionar (SUITE-R56).
    'ESTADO.md': estadoProyectado(vivas, (r) => gitDe(['rev-parse', '--verify', r]), fecha,
      (a) => gitDe(['log', '-1', '--format=%H', '--',
        `changes/${a?.slug ? `${a.id}-${a.slug}` : a?.id}`])),
  };
  const cp = join(IMPL, 'CHECKPOINT.json');
  if (existsSync(cp)) contenido['CHECKPOINT.json'] = readFileSync(cp, 'utf8');

  const entradas = Object.entries(contenido).map(([nombre, txt]) => {
    const blob = gitEntrada(['hash-object', '-w', '--stdin'], txt);
    return `100644 blob ${blob}\t${nombre}`;
  });
  const arbol = gitEntrada(['mktree'], entradas.join('\n') + '\n');
  const mensaje = `${MARCA_PROYECCION} · estado de ${vivas.length} allocation(es) viva(s) · ${fecha ?? ''}`;
  const args = ['commit-tree', arbol, '-m', mensaje];
  if (padre) args.push('-p', padre);
  const commit = gitEntrada(args, '');
  execFileSync('git', ['update-ref', `refs/heads/${rama}`, commit], { cwd: ROOT, stdio: 'pipe' });

  if (ajenos) {
    fail('SUITE-R31', `«${rama}» tiene ${ajenos} commit(s) SIN la marca «${MARCA_PROYECCION}»: alguien escribio a mano `
      + 'en una rama DERIVADA, y entonces deja de serlo. No se borra nada — decidir que hacer con eso es humano (SUITE-R06).');
  }
  if (!silencioso) {
    notas.push(`${rama} ← ${commit.slice(0, 7)} · ${vivas.length} allocation(es), ${Object.keys(contenido).length} archivo(s)`);
    if (ARGS.includes('--publicar')) {
      try {
        execFileSync('git', ['push', '-q', 'origin', `${rama}:${rama}`], { cwd: ROOT, stdio: 'pipe' });
        notas.push(`publicada en origin/${rama}`);
      } catch (e) { fail('SUITE-R35', `no se pudo publicar «${rama}»: ${String(e.message ?? e).split('\n')[0]}`); }
    } else {
      notas.push('local. Publicarla es una decision, no un efecto colateral:  tracker proyectar --publicar');
    }
  }
  return { rama, commit, ajenos };
}

// ── avanzar · la transicion de fase, en UN acto ─────────────────────────────
// PT-053 · Medido en EP-013 y EP-014: 107 transiciones x 5 actos manuales = ~535 operaciones.
// FDGE-R52 cazo LA MISMA transicion tres veces en un solo lote, y la tercera con el fallo
// ANUNCIADO en la propia nota — predecir el fallo no lo evita.
//
// Por que falla siempre en el mismo punto, y no es disciplina:
//   avanzar el registro  ->  se nota en el siguiente verify
//   escribir la nota     ->  no se nota hasta que alguien CUENTA
// Un acto sin consecuencia inmediata, repetido 107 veces, se salta.
//
// EL ORDEN LO DECIDE LA REVERSIBILIDAD. Lo irreversible —publicar el comentario— va el ULTIMO, y
// todo lo anterior se restaura si algo falla. La alternativa dejaria, ante un fallo tardio, UNA
// NOTA SOBRE UNA TRANSICION QUE NO OCURRIO: un registro falso es peor que un estado incompleto,
// porque el incompleto lo caza el verificador y el falso parece correcto.
function avanzar() {
  const id = ARGS.slice(1).find((x) => /^(PT|EP)-\d+$/.test(x));
  const iA = ARGS.indexOf('--a');
  const destino = iA >= 0 ? Number(ARGS[iA + 1]) : NaN;
  const iN = ARGS.indexOf('--nota');
  const nota = iN >= 0 ? String(ARGS[iN + 1] ?? '') : null;

  // ── 0 · VALIDAR · todas, ANTES de tocar nada ──────────────────────────────
  if (!id) throw new Error('avanzar necesita una allocation:  tracker avanzar PT-053 --a 6 --nota "..."');
  const a = all.find((x) => x?.id === id);
  if (!a) throw new Error(`${id} no existe en el registro. El registro asigna (SUITE-R08): sin allocation no hay transicion.`);
  if (ESTADOS_TERMINALES.has(a.status)) {
    throw new Error(`${id} esta en ${a.status}. Lo cerrado es evidencia, no estado (SUITE-R36): no avanza.`);
  }
  // La nota es LA razon del comando. Sin ella no se avanza — no es un aviso, es una NEGATIVA:
  // avisar es lo que FDGE-R52 ya hace, DESPUES, y cazo tres veces en un solo lote.
  if (nota === null || !nota.trim()) {
    throw new Error('avanzar exige --nota con contenido. Es el acto que se olvida, y por eso es la unica forma de invocar el comando (FDGE-R52).');
  }
  const actual = Number(a.phase);
  if (!Number.isInteger(destino)) throw new Error('avanzar necesita --a con la fase destino.');
  // Ni salta ni retrocede: saltar apaga las comprobaciones que la fase saltada habilita, que es
  // el defecto que PT-044 documento.
  if (destino !== actual + 1) {
    throw new Error(`${id} esta en PHASE ${actual} y --a dice ${destino}. Solo se avanza a la SIGUIENTE: `
      + 'saltar apaga las comprobaciones que la fase saltada habilita, y retroceder no es una transicion.');
  }
  if (!FASES[destino]) throw new Error(`PHASE ${destino} no existe en el procedimiento.`);

  // PT-077 · el mismo STATE_MISMATCH que `siguiente` BLOQUEA, `avanzar` lo ignoraba.
  //
  // La guarda existia UNA sola vez, en la consulta. Encontrado ejecutandolo: «tracker siguiente»
  // bloqueo la transicion de PT-075 y «tracker avanzar» la hizo igual, en la misma orden y con
  // el mismo bloqueo delante. Una compuerta que solo vigila el camino que nadie usa no vigila.
  //
  // No se repara el checkpoint: reescribirlo borra la unica prueba de que hubo divergencia, y
  // decidir si manda el arbol o la foto es de SUITE-R06. Se detiene y se propone el comando.
  const arbolAqui = (() => {
    const cp = leerJSON(join(IMPL, 'CHECKPOINT.json'));
    if (!cp || cp.pt !== id) return null;   // sin foto de ESTE PT no hay nada que contrastar
    try {
      // El contrato es {sha, rama, descendiente} con VALORES, no funciones. Lo escribi con
      // funciones y el mensaje imprimio el CODIGO de la funcion como si fuera la rama real:
      // «real () => gitDe([...])». Bloqueaba bien y explicaba mal — y un mensaje que no dice la
      // verdad sobre el estado es media compuerta. Se copia la llamada que ya funciona.
      return estadoDelArbol(cp, {
        sha: gitDe(['rev-parse', 'HEAD']),
        rama: gitDe(['rev-parse', '--abbrev-ref', 'HEAD']),
        descendiente: desciendeDe(cp.sha),
      });
    } catch { return null; }
  })();
  if (arbolAqui && arbolAqui.corresponde === false) {
    throw new Error(`${textoDiscrepancia(arbolAqui)}${SALTO}${SALTO}`
      + 'avanzar NO continua: cambiar de fase sobre un arbol que no es el declarado registra una '
      + 'transicion que no ocurrio donde dice. Es el mismo bloqueo que «tracker siguiente» ya '
      + 'aplicaba, y que aqui faltaba (PT-077).');
  }
  // PT-084 · la nota necesita DONDE IR, y el tablero no es el unico sitio.
  //
  // Hasta aqui: avanzar exigia --nota, la nota exigia issue y el issue exigia plataforma. Y
  // FDGE-R52 hace de avanzar la UNICA forma sancionada de cambiar de fase, asi que un proyecto
  // sin tablero no podia avanzar NI UNA FASE. Mientras tanto SUITE-R22 declara soportado el
  // equipo de una sola persona y migrate escribe «OPCIONAL — declarar plataforma de trabajo.
  // Sin ella no cambia nada». Era falso, y lo midio PT-072 no declarandola a proposito.
  //
  // La salida facil era hacerla obligatoria. Rompe SUITE-R22, que es una promesa del marco.
  // La nota vive ahora en TRANSICIONES.log —append-only, SUITE-R09— cuando no hay tablero, que
  // es donde ya viven los hechos que no tienen plataforma.
  const HAY_TABLERO_PARA_LA_NOTA = Boolean(adaptador?.comentar);
  if (HAY_TABLERO_PARA_LA_NOTA) {
    if (!a.issue) throw new Error(`${id} no tiene issue: hay plataforma declarada y la nota debe espejarse (SUITE-R35).  tracker abrir --aplicar`);
    // El acceso tambien es una validacion: mejor no escribir nada que escribir y revertir.
    if (adaptador.disponible && !adaptador.disponible()) {
      throw new Error('hay plataforma declarada y no hay acceso: la nota no podria publicarse (FND-R30).  gh auth login');
    }
  }

  if (ARGS.includes('--ver')) {
    notas.push(`--ver: ${id} PHASE ${actual} -> ${destino} ${FASES[destino].nombre}. Valido, y NO se ha escrito nada.`);
    return;
  }

  // ── RESPALDO ──────────────────────────────────────────────────────────────
  // «antes === null» importa: CHECKPOINT.json puede NO EXISTIR antes del primer avanzar, y
  // restaurarlo significa BORRARLO. Un archivo vacio donde no habia nada es un estado que no
  // existia, y eso es lo que su caso comprueba.
  const fIntake = join(ROOT, 'changes', a.slug ? `${a.id}-${a.slug}` : a.id, 'intake.md');
  const tocados = [join(IMPL, 'REGISTRY.json'), fIntake, join(IMPL, 'CHECKPOINT.json'), join(IMPL, 'HANDOFF.md')];
  const respaldo = tocados.map((f) => ({ f, antes: existsSync(f) ? readFileSync(f, 'utf8') : null }));
  const restaurar = () => {
    for (const { f, antes } of respaldo) {
      if (antes === null) { try { rmSync(f, { force: true }); } catch { /* no habia nada que quitar */ } }
      else writeFileSync(f, antes);
    }
  };

  try {
    // 1 · el registro ASIGNA
    a.phase = destino;
    // PT-089 · H-004. «avanzar» sincronizaba «phase» en las dos fuentes y NO «status», asi que
    // al llegar a la ultima fase alguien tenia que marcar el estado terminal A MANO — y lo hacia
    // en el registro, dejando el YAML atras. De ahi salian las SEIS divergencias medidas, y las
    // seis eran de la clase que apaga comprobaciones.
    //
    // Marcar terminal es parte del MISMO acto atomico: los cinco actos o ninguno (FDGE-R52).
    // NO se toca un estado que ya sea terminal: una tarea puede acabar REJECTED o DEFERRED, y
    // FDGE-R53 dice que la tarea declara como termina — esto no lo decide por ella.
    const esFinal = Number(destino) === Math.max(...Object.keys(FASES).map(Number));
    // PT-098 · aqui se escribia INTEGRATED sin mirar nada, y ese estado APAGA seis
    // comprobaciones de verify-fdge. LEXICON §5.1 define INTEGRATED como «mergeado a la linea
    // principal»: es un hecho del ARBOL. El que corresponde al terminar la ultima fase —antes
    // del merge— es DONE, que es lo que SUITE-R46 pide apuntar y lo que FDGE-R34 exige para G4.
    //
    // No se NIEGA: escribe lo cierto. Negarse fue el primer diseño y rompia SUITE-R46, que
    // obliga al orden «apuntar el estado terminal, mergear, cerrar despues».
    // PT-099 · la escalera la aplica el COMANDO. estadoDeFase cubre los dos peldaños que el
    // marco declara obligatorios: la parada de un BUG en la fase de validacion (LEXICON §5.1,
    // FDGE-R26, LEX-R08 severidad H) y el terminal que PT-098 derivo del arbol.
    const enPrincipal = esFinal ? integradoEnPrincipal(a) : null;
    const nuevoEstado = estadoDeFase(a, destino, { esFinal, integrado: enPrincipal });
    // PT-105 · se DICE, con la misma forma que el peldaño del BUG. Un estado que cambia en
    // silencio es el que luego nadie sabe quien puso — y este es justo el que G4 comprueba.
    if (nuevoEstado === 'DONE' && !esFinal) {
      a.status = 'DONE';
      notas.push(`${id}: cerro Validacion, asi que pasa a DONE — el estado que FDGE-R34 exige `
        + 'para G4, que es la fase siguiente. La firma de G3 va en la linea «Compuertas:» de '
        + 'HISTORY.log; esto solo escribe el estado que esa firma implica.');
    }
    if (nuevoEstado === 'VALIDATION_PENDING') {
      a.status = 'VALIDATION_PENDING';
      // Se DICE, y con la forma que FDGE-R26 exige para la firma. El comando no puede firmar:
      // un BUG «se detiene» aqui y solo un humano lo mueve.
      notas.push(`${id}: es un BUG — queda en VALIDATION_PENDING y AHI SE DETIENE (FDGE-R26, LEX-R08). `
        + `Solo una persona lo lleva a DONE, y al hacerlo registra quien y cuando en la linea `
        + `«Compuertas:» de HISTORY.log:  G3 ${gitDe(['log', '-1', '--format=%cs']) ?? 'YYYY-MM-DD'} <nombre>`);
    }
    const terminal = esFinal && !ESTADOS_TERMINALES.has(String(a.status));
    if (terminal) {
      a.status = estadoTerminalDe(a, enPrincipal);
      // Se DICE. Un cambio silencioso de estado es lo que causo el problema: «nadie tuvo que
      // decidirlo» (INC-011).
      notas.push(enPrincipal === true
        ? `${id}: estado terminal INTEGRATED — su «changes/» esta en la rama por defecto.`
        : `${id}: estado terminal DONE${enPrincipal === null ? ' — no se pudo contrastar con la rama por defecto (SIN EVALUAR)' : ' — su «changes/» todavia NO esta en la rama por defecto'}. Pasara a INTEGRATED cuando el merge ocurra y se vuelva a avanzar o se sincronice.`);
    }
    guardarRegistro(reg, ACCION);

    // 2 · el YAML del intake · PT-004: es lo que el PT dice de si mismo
    if (existsSync(fIntake)) {
      const txt = readFileSync(fIntake, 'utf8');
      let nuevo = txt.replace(/^phase:[ \t]*\d+[ \t]*$/m, `phase: ${destino}`);
      if (nuevo === txt) throw new Error(`el intake de ${id} no declara «phase»: no se puede sincronizar (SUITE-R08).`);
      if (terminal) {
        const conEstado = nuevo.replace(/^status:[ 	]*\S+[ 	]*$/m, `status: ${a.status}`);
        if (conEstado === nuevo) throw new Error(`el intake de ${id} no declara «status»: no se puede sincronizar (SUITE-R08).`);
        nuevo = conEstado;
      }
      writeFileSync(fIntake, nuevo);
    }

    // 3 · el checkpoint · PT-052
    //
    // PT-094 · `ramaDeclaradaViva` FALTABA aqui. `checkpointDe` lo documenta desde PT-056 —«al
    // integrar, la rama de tarea se borra y el checkpoint pasaba a afirmar una referencia
    // muerta»— y solo lo pasaba `checkpoint()`, que es el camino manual. `avanzar` es el que
    // escribe el checkpoint en CADA transicion de fase, o sea el que de verdad lo escribe: la
    // guarda estaba construida y muerta justo donde hacia falta.
    const sucio = gitDe(['status', '--porcelain'], { crudo: true });
    const ramaAhora = gitDe(['rev-parse', '--abbrev-ref', 'HEAD']);
    const cp = checkpointDe(a, {
      sha: gitDe(['rev-parse', 'HEAD']),
      rama: ramaAhora === 'HEAD' ? null : ramaAhora,
      ramaDeclaradaViva: a.branch ? ramaViva(a.branch) : null,
      fecha: gitDe(['log', '-1', '--format=%cs']),
      sucio: sucio === null ? null : sucio.length > 0,
      archivos: lineas(sucio ?? '').filter(Boolean).map((l) => l.slice(3)).sort(),
    });
    writeFileSync(join(IMPL, 'CHECKPOINT.json'), JSON.stringify(cp, null, 2) + '\n');

    // 4 · EL ESTADO · SUITE-R34 · no puede quedarse mas viejo que el trabajo
    //
    // FALTABA, y lo dijo la CI en rojo — la TERCERA vez que SUITE-R34 caza este patron en la
    // sesion. `avanzar` escribe en `changes/` (el YAML del intake), asi que sin tocar HANDOFF.md
    // el estado queda atras y la compuerta bloquea. El comando VIOLABA POR CONSTRUCCION la regla
    // que dice que el estado viaja con el trabajo.
    //
    // Solo se estampa la linea «actualizado:», que es DERIVABLE: la fecha sale de git y el hecho
    // —que PT-NNN esta en PHASE N— sale del registro. El resto de HANDOFF.md es prosa humana y no
    // se toca: estamparla seria inventar, y LEX-R26 dice que lo que no se deriva no se escribe.
    const fHandoff = join(IMPL, 'HANDOFF.md');
    if (existsSync(fHandoff)) {
      const h = readFileSync(fHandoff, 'utf8');
      const sello = `actualizado:    ${gitDe(['log', '-1', '--format=%cs']) ?? 'sin fecha'} · ${id} en PHASE ${destino} ${FASES[destino].nombre}`;
      const nuevoH = h.replace(/^actualizado:.*$/m, sello);
      if (nuevoH !== h) writeFileSync(fHandoff, nuevoH);
    }

    // 5 · EL ESPEJO · SUITE-R35 · el registro asigna, la plataforma espeja
    //
    // FALTABA, y lo dijo `npm run verify` en rojo: `avanzar` prometia acabar con el «cuatro de
    // cinco» y hacia cuatro de cinco. La etiqueta «fase: N» del issue cambia en CADA transicion.
    //
    // Va ANTES de la nota y despues de los escritos, y el orden entre los dos actos irreversibles
    // no es indiferente: una etiqueta desincronizada es DERIVADA y se rehace sola con
    // `abrir --aplicar`; una nota que falta no se rehace, y es justo lo que este comando existe
    // para impedir. Lo que se puede recuperar va primero.
    // PT-084 · `adaptador?.` — sin plataforma declarada no hay adaptador, y el espejo de este
    // paso simplemente no aplica. Antes reventaba con «Cannot read properties of undefined».
    if (adaptador?.etiquetasDeIssue && adaptador?.etiquetar) {
      const debe = etiquetasDe(a);
      const tiene = adaptador.etiquetasDeIssue(a.issue);
      const quitar = tiene.filter((n) => RE_DERIVADA.test(n) && !debe.includes(n));
      const poner = debe.filter((n) => !tiene.includes(n));
      // La etiqueta «fase: N» de una fase a la que nadie ha llegado aun NO EXISTE en el
      // repositorio, y `etiquetar` falla con «not found». `abrir` las crea; `avanzar` no lo hacia
      // y reventaba en el quinto acto — lo dijo la primera transicion de PT-054, y la atomicidad
      // funciono en vivo: NADA quedo aplicado, la fase se quedo donde estaba.
      if (adaptador.crearEtiqueta) {
        const existen = adaptador.etiquetas ? adaptador.etiquetas() : null;
        for (const e of poner) {
          if (existen && !existen.includes(e)) adaptador.crearEtiqueta(e);
        }
      }
      if (quitar.length || poner.length) adaptador.etiquetar(a.issue, poner, quitar);
    }

    // 6 · LA NOTA · irreversible, y por eso la ultima
    const r = queSigue(a);
    const cuerpo = `${MARCA_AGENTE}\n**PHASE ${actual} → ${destino}** · \`${id}\`\n\n${nota.trim()}\n\n`
      + `**Dónde:** \`PHASE ${destino}\` · ${FASES[destino].nombre}. **Sigue:** ${r.siguiente}`;
    if (HAY_TABLERO_PARA_LA_NOTA) {
      adaptador.comentar(a.issue, cuerpo);
    } else {
      // PT-084 · sin tablero, la nota va al ledger de transiciones. Append-only (SUITE-R09):
      // es la prueba de que la fase cambio, y una prueba que se reescribe no lo es.
      const ruta = join(IMPL, 'TRANSICIONES.log');
      const previo = (() => { try { return readFileSync(ruta, 'utf8'); } catch { return ''; } })();
      const cuando = gitDe(['log', '-1', '--format=%cs']) ?? 'sin-fecha';
      const entrada = `${SALTO}## ${cuando} · ${id} · PHASE ${actual} -> ${destino}${SALTO}${SALTO}${cuerpo}${SALTO}`;
      writeFileSync(ruta, previo + entrada, 'utf8');
      notas.push(`${id}: nota en docs/implementation/TRANSICIONES.log — no hay plataforma declarada`);
    }

    // 7 · LA PROYECCION · PT-054 · va DESPUES de la nota, y esto CORRIGE lo que la estrategia
    // de PT-054 escribio.
    //
    // Alli dije «va dentro del respaldo: si la proyeccion falla, la transicion entera se
    // revierte». Es IMPOSIBLE: la nota ya se publico y un comentario no se despublica. Revertir
    // los archivos dejaria una nota sobre una transicion que el registro niega — el registro
    // falso que todo este orden existe para impedir.
    //
    // Lo correcto es lo contrario: la proyeccion es lo MAS recuperable de todo —esta enteramente
    // derivada y se rehace con `tracker proyectar`—, asi que va la ultima y su fallo NO revierte
    // nada. La transicion ya ocurrio y esta registrada; la proyeccion es una vista.
    try { proyectar({ silencioso: true }); }
    catch (e) { notas.push(`la proyeccion no se pudo escribir (${String(e.message ?? e).split('\n')[0]}). La transicion SI ocurrio: rehazla con  tracker proyectar`); }

    notas.push(`${id}: PHASE ${actual} -> ${destino} ${FASES[destino].nombre}`);
    notas.push(`registro, intake, CHECKPOINT y el sello del HANDOFF escritos; espejo, nota y proyeccion`);
  } catch (e) {
    restaurar();
    throw new Error(`${String(e.message ?? e)}\n\n  NADA quedo aplicado: los archivos volvieron a como estaban. `
      + 'Cuatro de cinco no es una version degradada del exito, es el defecto que este comando existe para impedir.');
  }
}

// ── PT-085 · C · D · E · sellar ─────────────────────────────────────────────
//
// SUITE-R57 · La deuda de sellado no se prohibe: se hace imposible de ignorar. Esta accion
// enumera lo que falta para cerrar una version y SE DETIENE en lo humano (EXEC-R07).
//
// No publica ni etiqueta: los dos son SUITE-R06a. Lo que hace es que nadie pueda decir que no
// sabia que faltaba.
const VERSION_DEL_PROYECTO = reg?.suite_version ?? '0.0.0';

function sellar() {
  // PT-131 · el observable vive UNA vez, en patrones.mjs · selladoEnTag. Aqui estaba duplicado
  // con verify-fdge, comentario incluido, y esa duplicacion es como el defecto de PT-087
  // sobrevivio a su propio arreglo (SUITE-R38): se corrigio en un lado y el otro siguio igual.
  const idsDelTag = (() => {
    const tag = (gitDe(['tag', '--list', 'v*', '--sort=-v:refname']) ?? '')
      .trim().split(/\s+/).filter(Boolean)[0];
    if (!tag) return { tag: null, ids: null };
    const ids = selladoEnTag(
      () => {
        const s = gitDe(['ls-tree', '--name-only', tag, 'changes/'], { crudo: true });
        if (s == null) return null;
        return s.trim().split(/\r?\n/).filter(Boolean)
          .map((x) => x.replace(/^changes\//, '').replace(/\/$/, ''));
      },
      (a) => existsSync(join(ROOT, 'changes', a?.slug ? `${a.id}-${a.slug}` : `${a?.id}`)),
      reg.allocations ?? [],
    );
    return { tag, ids };
  })();

  const falta = sinSellar(reg.allocations ?? [], idsDelTag.ids);
  const umbral = Number(reg?.tracker?.umbral_sellado ?? 3);

  di('');
  di(`  sellar · version vigente ${VERSION_DEL_PROYECTO} · tag anterior ${idsDelTag.tag ?? 'NINGUNO'}`);

  // PT-121 · AC-06 · EL TAG SE COMPRUEBA, NO SE SUPONE.
  //
  // Dos cosas distintas y las dos importan:
  //
  //   el ANTERIOR      un nombre en la lista no prueba que resuelva: un tag roto da un nombre y
  //                    ningun arbol, y «sellado en el tag» se calcula sobre ESE arbol.
  //   el QUE VIENE     antes de sellar NO existe, y esta bien: crearlo es el paso 8, HUMANO y
  //                    DESPUES del merge (SUITE-R06a). Decirlo evita la pregunta de siempre.
  //
  // Y el orden se deriva con «--sort=v:refname», no con el de por defecto: el alfabetico pone
  // v10, v11 y v12 ANTES de v4.13.0, y leer el final de esa lista da «v9.0.0» como ultimo tag.
  // Ese error de medicion es real y esta escrito en el propio intake de esta tarea.
  const tagDeEstaVersion = `v${VERSION_DEL_PROYECTO}`;
  const resuelve = (ref) => gitDe(['rev-parse', '--verify', `${ref}^{commit}`]) !== null;
  di('');
  if (idsDelTag.tag === null) {
    di('  tag anterior       NINGUNO — no hay con que comparar lo ya sellado (RULE-06).');
  } else if (!resuelve(idsDelTag.tag)) {
    di(`  tag anterior       ${idsDelTag.tag} FIGURA EN LA LISTA Y NO RESUELVE a ningun commit.`);
    di('                     Lo sellado se calcula sobre SU arbol, asi que sin arbol es SIN EVALUAR.');
  } else {
    di(`  tag anterior       ${idsDelTag.tag} resuelve.`);
  }
  if (resuelve(tagDeEstaVersion)) {
    di(`  tag de esta version ${tagDeEstaVersion} YA EXISTE. Si aun no se ha mergeado, apunta a un`);
    di('                     arbol sin lo que la version trae (PT-081).');
  } else {
    di(`  tag de esta version ${tagDeEstaVersion} todavia NO existe, y es lo normal: lo crea el`);
    di('                     paso 8, humano y DESPUES del merge (SUITE-R06a).');
  }
  di('');
  if (falta === null) {
    di('  deuda de sellado   SIN EVALUAR — no se pudo leer el registro del tag anterior.');
    di('                     Sin saber que hay sellado no se sabe que falta, y suponerlo');
    di('                     bloquearia el proyecto entero (RULE-06).');
  } else {
    di(`  deuda de sellado   ${falta.length} de lotes CERRADOS · umbral ${umbral}`);
    if (falta.length) di(`                     ${falta.join(' · ')}`);
    di('                     Las tareas de un lote ABIERTO no cuentan: EXEC-R03 hace del lote');
    di('                     la unidad de sellado, y contarlas lo bloquearia consigo mismo.');
  }

  // E · el grafo al dia
  const man = leerJSON(join(ROOT, 'graphify-out', 'manifest.json'));
  // PT-090 cambio derivaDelGrafo para comparar HASH y esta llamada seguia pasando el mtime:
  // decia «17 de 17 cambiaron» recien regenerado el grafo. DOS LECTORES DEL MISMO HECHO,
  // divergentes — y lo cazo «sellar», no una lectura del codigo.
  //
  // La huella es de BYTES CRUDOS, que es lo que graphify guarda en «ast_hash».
  const deriva = derivaDelGrafo(man, (ruta, usaMtime) => {
    const rel = rutaRelativaDelManifiesto(ruta, ROOT);
    const f = join(ROOT, rel);
    if (!existsSync(f)) return null;
    if (usaMtime) { try { return statSync(f).mtimeMs / 1000; } catch { return null; } }
    try { return createHash('md5').update(readFileSync(f)).digest('hex'); } catch { return null; }
  });
  di('');
  // PT-110 · las cifras del inventario, MEDIDAS aqui.
  //
  // FND-R14 ha caido SIETE VECES en este lote: cada tarea que toca una herramienta desvia las
  // cifras de inventory/services.md, y cada vez alguien las reescribio a mano. El comando existia
  // —«tracker inventario --aplicar»— y no lo llamaba nadie: sellar recorria el grafo, los
  // documentos de entrada y la guia de migracion, y el inventario no estaba en la lista.
  //
  // Se MIDE y se DICE, no se arregla: sellar informa, y arreglar es una decision (EXEC-R07). Pero
  // ahora la deuda aparece en el mismo sitio donde se decide sellar, en vez de en una bateria que
  // se corre despues.
  const desviadas = (() => {
    try {
      const f = join(ROOT, 'docs', 'enterprise-documentation', 'inventory', 'services.md');
      if (!existsSync(f)) return null;
      const txt = readFileSync(f, 'utf8');
      const dirT = join(ROOT, 'docs', 'methodology', 'tools');
      const mal = [];
      let total = 0;
      for (const m of txt.matchAll(/\|\s*`([a-z-]+\.(?:mjs|sh))`\s*\|\s*(\d+)\s*\|/g)) {
        total += 1;
        const ruta = join(dirT, m[1]);
        if (!existsSync(ruta)) continue;
        const real = readFileSync(ruta, 'utf8').split(SALTO).length - 1;
        if (real !== Number(m[2])) mal.push(`${m[1]} ${m[2]}→${real}`);
      }
      return { mal, total };
    } catch { return null; }
  })();
  di('');
  if (desviadas === null) {
    di('  inventario         SIN EVALUAR — no se pudo leer inventory/services.md (RULE-06).');
  } else if (desviadas.mal.length) {
    di(`  inventario         ${desviadas.mal.length} de ${desviadas.total} cifras ya no describen el arbol`);
    di(`                     ${desviadas.mal.slice(0, 3).join(', ')}${desviadas.mal.length > 3 ? ' …' : ''}`);
    di('                     Se recalculan: node tools/tracker.mjs inventario --aplicar (FND-R14)');
  } else {
    di(`  inventario         las ${desviadas.total} cifras coinciden con el arbol.`);
  }

  // PT-126 · LA MATRIZ SE MIDE DONDE YA SE MIRA. Es el patron de PT-110: la deuda de sellado, el
  // inventario y el grafo ya se recorren aqui, y una medicion en un comando nuevo es una medicion
  // que nadie ejecuta — CE-007, «existe la herramienta y nada la echa en falta», siete instancias.
  //
  // TRES DESENLACES, no dos. Una MATRIZ.md ausente NO es una matriz sin candidatos: la primera
  // dice «no se pudo mirar» y la segunda «no hay nada que corregir», y decirlas igual es lo que
  // RULE-06 prohibe.
  const matriz = (() => {
    try {
      const txt = readFileSync(join(IMPL, 'MATRIZ.md'), 'utf8');
      // Se leen las filas de la tabla, que es lo que matriz.mjs deriva. La ultima columna dice
      // si la regla dueña puede fallar; la penultima, quien es dueña.
      const filas = [...txt.matchAll(/^\|\s*`(CE-\d{3})`\s*\|([^|]*)\|\s*(\d+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/gm)]
        .map((m) => ({
          id: m[1], nombre: m[2].trim(), veces: Number(m[3]),
          duena: m[7].trim(), verificador: m[8].trim(),
        }));
      if (!filas.length) return null;
      return filas;
    } catch { return null; }
  })();

  di('');
  if (matriz === null) {
    di('  matriz de eventos  SIN EVALUAR — no se pudo leer MATRIZ.md o no tiene filas (RULE-06).');
    di('                     Se deriva: node tools/matriz.mjs. Una matriz ausente NO es una');
    di('                     matriz sin candidatos.');
  } else {
    // EL UMBRAL ES UN PARAMETRO DECLARADO, no un numero escondido (SUITE-R38). Vive en el
    // registro para que un proyecto pueda subirlo o bajarlo y que se vea que lo hizo.
    const umbralClase = Number(reg?.tracker?.umbral_clase_sin_dueno ?? 3);
    const huerfanas = matriz.filter((f) => f.veces >= umbralClase && f.duena === '**—**');
    const sinVerificador = matriz.filter((f) => f.duena !== '**—**'
      && f.verificador.startsWith('**NO**'));
    di(`  matriz de eventos  ${matriz.length} clases · umbral ${umbralClase} para ser candidata`);
    if (huerfanas.length) {
      di(`                     ${huerfanas.length} sin regla que las reclame y con ${umbralClase}+ instancias:`);
      for (const f of huerfanas.sort((a, b) => b.veces - a.veces)) {
        di(`                       ${f.id}  ${f.veces}x  ${f.nombre}`);
      }
    } else {
      di('                     ninguna clase sin dueño llega al umbral.');
    }
    // Este caso es PEOR que no tener regla: hay obligacion y no puede fallar (P-003).
    for (const f of sinVerificador) {
      di(`                     ${f.id}: tiene regla (${f.duena}) y NADA EMITE POR ELLA.`);
    }
    if (huerfanas.length || sinVerificador.length) {
      di('                     No se promueve nada: son CANDIDATOS y decide una persona (FPGE-R04).');
    }
  }

  if (deriva === null) di('  grafo              SIN MANIFIESTO — no hay con que comparar (FDGE-R43).');
  else if (deriva.length) {
    di(`  grafo              SUSPECT · ${deriva.length} de ${Object.keys(man).length} archivos cambiaron`);
    di('                     Regeneralo antes de sellar: /graphify (FDGE-R32, lo dispara el humano)');
  } else di('  grafo              al dia.');

  // D · los documentos que lee quien llega
  const acta = (() => { try { return readFileSync(join(IMPL, 'SELLO.md'), 'utf8'); } catch { return ''; } })();
  const sinResolver = selloSinResolver(acta);
  di('');
  di('  documentos de entrada  (cada uno ACTUALIZADO o NO PROCEDE con motivo — FND-R22)');
  for (const d of DOCUMENTOS_DE_ENTRADA) {
    di(`    ${sinResolver.includes(d) ? '✗' : '✓'}  ${d}`);
  }
  if (sinResolver.length) {
    di('');
    di(`  ${sinResolver.length} sin resolver en docs/implementation/SELLO.md. Una celda vacia es`);
    di('  indistinguible de una que nadie miro, y por eso no pasa.');
  }

  const RE_LINEA_CH = new RegExp('\r?\n');
  const RE_ENTRADA_CH = new RegExp('^## [0-9]+[.][0-9]+[.][0-9]+ ');
  const SALTO_CH = String.fromCharCode(10);
  // ── PT-087 · el paso 1 comprueba el HECHO, no que la entrada exista ───────
  //
  // QUINTA instancia del patron. Este paso era una linea de una lista: no comprobaba nada.
  // Yo mire a mano que la entrada del CHANGELOG existiera y DI POR HECHO que enumeraba lo
  // nuevo. No lo hacia — SUITE-R57 quedo fuera de la guia de la 10.0.0.
  //
  // QUE ESTABLECE: que toda regla cuya version de entrada es la vigente esta NOMBRADA en la
  //   entrada del CHANGELOG de esa version.
  // QUE NO ESTABLECE: que lo que la guia diga de ella sea correcto ni suficiente.
  const entradaDeLaVersion = (() => {
    const fCh = join(ROOT, 'docs', 'methodology', 'CHANGELOG.md');
    const ch = existsSync(fCh) ? readFileSync(fCh, 'utf8') : null;
    if (!ch) return null;
    const lineas = ch.split(RE_LINEA_CH);
    const i = lineas.findIndex((l) => l.startsWith(`## ${VERSION_DEL_PROYECTO} `));
    if (i < 0) return null;
    const j = lineas.findIndex((x, k) => k > i && RE_ENTRADA_CH.test(x));
    return lineas.slice(i, j < 0 ? lineas.length : j).join(SALTO_CH);
  })();
  const fueraDeLaGuia = reglasNuevasFueraDeLaGuia(RIGE_DESDE, VERSION_DEL_PROYECTO, entradaDeLaVersion);
  di('');
  if (entradaDeLaVersion === null) {
    di(`  guia de migracion  SIN ENTRADA para ${VERSION_DEL_PROYECTO} en CHANGELOG.md. SUITE-R19 la exige.`);
  } else if (fueraDeLaGuia && fueraDeLaGuia.length) {
    di(`  guia de migracion  ${fueraDeLaGuia.length} regla(s) nueva(s) NO nombradas: ${fueraDeLaGuia.join(', ')}.`);
    di('                     Un proyecto destino se encontraria la regla sin una linea que se la');
    di('                     explique. Nombrarlas es el minimo; que la instruccion sirva no se');
    di('                     comprueba aqui.');
  } else {
    di('  guia de migracion  enumera las reglas que entran con esta version.');
  }

  di('');
  di('  ── lo que falta para sellar ──────────────────────────────────────────');
  di('  1 · entrada en CHANGELOG.md que ENUMERE las reglas nuevas   [SUITE-R19]');
  di('  2 · node tools/version.mjs --aplicar   (los 21 documentos)');
  di('  3 · node tools/build-core.mjs          (CORE regenerado)');
  di('  4 · bash tools/selftest.sh             BATERIA COMPLETA, no parcial');
  di('  5 · /graphify   y REGISTRY.graph al dia                     [FDGE-R32]');
  di('  6 · docs/implementation/SELLO.md con los cinco resueltos');
  di('  7 · PR a la rama por defecto  ·  HUMANO                     [EXEC-R04]');
  di('  8 · git tag -a v<version>     ·  HUMANO, y DESPUES del merge');
  di('');
  di('  Los pasos 7 y 8 NO los ejecuta el agente (SUITE-R06a). El 8 va despues del 7:');
  di('  un tag antes del merge apunta a un arbol sin lo que la version trae, y la linea');
  di('  base de FDGE-R43 y de AC-08 quedaria mintiendo (PT-081).');

  // ── PT-120 · --gate · «sellar» podia decirlo todo y no impedir nada ─────
  //
  // Salia con codigo 0 SIEMPRE, asi que ningun workflow podia usarlo de compuerta. La 12.0.0
  // se publico con dos reglas fuera de su guia de migracion y publicar.yml corrio ocho
  // comprobaciones sin llamar a la unica que lo habria visto — porque llamarla no habria
  // servido de nada: informa, no bloquea.
  //
  // QUE BLOQUEA: solo lo MECANICO y solo lo que se puede evaluar aqui. Los pasos 7 y 8 son
  // humanos (SUITE-R06a) y no entran; el grafo tampoco, porque graphify-out/ esta en
  // .gitignore y en CI sale MISSING — hacerlo fallar dejaria la publicacion bloqueada por algo
  // que NO ES EVALUABLE ahi, que es lo contrario de lo que RULE-06 pide.
  //
  // QUE NO ESTABLECE: que la guia SIRVA. Nombrar la regla es el minimo comprobable; que la
  // instruccion sea util lo lee una persona.
  // NO llama a cerrarPasada(): esa sincroniza con la plataforma, y una compuerta que necesita
  // red BLOQUEA LA PUBLICACION CUANDO NO PUEDE HABLAR CON GITHUB — no porque el sello este mal.
  // Convertir «no lo se» en «no pasas» es tan falso como convertirlo en verde (RULE-06), y una
  // compuerta que falla por motivos ajenos se acaba desactivando. «--gate» juzga EL ARBOL;
  // espejar es de «espejo», que tiene su propio paso en publicar.yml.
  if (ARGS.includes('--gate')) {
    const motivos = [];
    if (entradaDeLaVersion === null) {
      motivos.push(`SUITE-R19: no hay entrada para ${VERSION_DEL_PROYECTO} en CHANGELOG.md.`);
    } else if (fueraDeLaGuia && fueraDeLaGuia.length) {
      motivos.push(`SUITE-R19: ${fueraDeLaGuia.length} regla(s) nueva(s) fuera de la guia: ${fueraDeLaGuia.join(
)}.`);
    }
    if (sinResolver.length) {
      motivos.push(`FND-R22: ${sinResolver.length} documento(s) de entrada sin resolver en SELLO.md: ${sinResolver.join(
)}.`);
    }
    if (desviadas && desviadas.mal && desviadas.mal.length) {
      motivos.push(`FND-R14: ${desviadas.mal.length} cifra(s) de inventory/services.md ya no describen el arbol.`);
    }
    di('');
    if (!motivos.length) {
      di('  --gate: lo mecanico del sello esta resuelto.');
      di('  NO dice que se pueda publicar: los pasos 7 y 8 son humanos, y el grafo no se');
      di('  evalua aqui (FDGE-R32, .gitignore). SIN EVALUAR no es lo mismo que aprobado.');
      return;
    }
    di('  --gate: EL SELLO NO ESTA RESUELTO. No se publica.');
    di('');
    for (const m of motivos) di(`    ✗ ${m}`);
    di('');
    di('  La 12.0.0 salio a npm con dos reglas fuera de su guia porque esto no bloqueaba nada.');
    // LANZA, no pone process.exitCode: la ultima linea del despachador hace process.exit(0)
    // incondicional y lo pisaria. Esa era la primera version de este bloque, y tenia el defecto
    // EXACTO que PT-120 corrige: decir «no se publica» y salir en verde. Lo cazo comprobar el
    // codigo de salida — leyendo el bloque no se ve, porque la linea que lo anula esta a 190
    // lineas y en otra funcion.
    throw new Error(`el sello no esta resuelto: ${motivos.length} condicion(es) sin cumplir. No se publica.`);
  }

  cerrarPasada();
}

// ── PT-069 · los indices se DERIVAN del registro ────────────────────────────
//
// PHASE 8 ordena regenerarlos, SUITE-R35 exige que espejen el registro, verify-fdge lo comprueba
// y el «no hacer» del HANDOFF prohibe editarlos a mano. Y NINGUNA herramienta los generaba: las
// cuatro instrucciones no se podian cumplir a la vez.
//
// El resultado de editarlos a mano esta medido: REFACTOR_SCOPE acabo con catorce filas pegadas
// en una linea, y BACKLOG llevo ocho lotes declarando un estado de tres versiones atras.
//
// Cada indice tiene su TIPO, y el reparto sale de LEX-R12: los bugs y las investigaciones a
// DISCOVERY, las features a ENRICHMENT, los refactors y chores a REFACTOR_SCOPE.
const INDICES = {
  'DISCOVERY.md': {
    tipos: new Set(['BUG', 'INVESTIGATION']),
    titulo: 'DISCOVERY — índice de bugs e investigaciones',
    que: 'el análisis',
  },
  'ENRICHMENT.md': {
    tipos: new Set(['FEATURE']),
    titulo: 'ENRICHMENT — índice de features',
    que: 'el enriquecimiento',
  },
  'REFACTOR_SCOPE.md': {
    tipos: new Set(['REFACTOR', 'CHORE']),
    titulo: 'REFACTOR_SCOPE — índice de refactors y chores',
    que: 'el alcance',
  },
};

const filaDeIndice = (a) => `| ${a.id} | ${a.type ?? '?'} | ${a.severity ?? '—'} | ${a.status ?? '?'} `
  + `| ${a.epic ?? '—'} | ${(a.title ?? a.slug ?? '').replace(/\|/g, '/')} |`;

function indices() {
  const escribir = ARGS.includes('--aplicar');
  for (const [archivo, def] of Object.entries(INDICES)) {
    const filas = (reg.allocations ?? [])
      .filter((a) => !esLote(a))
      .filter((a) => def.tipos.has(a?.type))
      .sort((x, y) => String(x.id).localeCompare(String(y.id)))
      .map(filaDeIndice);
    const cuerpo = [
      `# ${def.titulo}`,
      '',
      'Índice, no contenido (`LEX-R12`). Una línea por PT; ' + def.que + ' vive en',
      '`changes/PT-XXX-slug/`.',
      '',
      // La cabecera NO cita ningun identificador de tarea: verify-fdge busca la PRIMERA linea
      // que contenga el ID para leer su estado, y una cita aqui la secuestraba — LEX-R07 acusaba
      // a la cabecera de no usar un estado canonico. Es la familia de PT-067: contar una mencion
      // como si fuera un dato.
      '> **DERIVADO del registro.** No se edita a mano: `tracker indices --aplicar`',
      '> lo regenera. Editarlo aquí se pierde en la siguiente regeneración, y editarlo a mano es',
      '> lo que dejó catorce filas pegadas en una línea en el índice de refactors.',
      '',
      '| Id | Tipo | Sev | Estado | Lote | Título |',
      '|:---|:---|:---|:---|:---|:---|',
      ...filas,
      '',
    ].join(SALTO);
    const ruta = join(IMPL, archivo);
    const antes = (() => { try { return readFileSync(ruta, 'utf8'); } catch { return null; } })();
    if (!escribir) {
      notas.push(`${archivo}: ${filas.length} fila(s)${antes === cuerpo ? ' · ya al dia' : ' · se regeneraria'}`);
      continue;
    }
    if (antes === cuerpo) { notas.push(`${archivo}: ya al dia`); continue; }
    writeFileSync(ruta, cuerpo, 'utf8');
    notas.push(`${archivo}: ${filas.length} fila(s) escritas`);
  }
  // PT-123 · BACKLOG.md · se reescribe SOLO lo de dentro de las marcas.
  //
  // No entra en INDICES porque no es la misma forma: los otros tres son «todos los PT de estos
  // tipos» y este es «el lote abierto y sus tareas». Por eso quedo fuera del generador que habia,
  // y por eso llevaba CUATRO lotes declarando EP-015 como implementacion abierta — su propia
  // cabecera registra que la vez anterior fueron OCHO.
  //
  // El PORQUE del orden queda FUERA de las marcas y no se toca: no sale de ningun campo y es lo
  // mas valioso que tiene el archivo (LEX-R26, y la misma frontera que HANDOFF.md).
  {
    const ruta = join(IMPL, 'BACKLOG.md');
    const marca = ['<!-- BACKLOG:DERIVADO -->', '<!-- /BACKLOG:DERIVADO -->'];
    const derivado = bloqueDeBacklog(reg.allocations ?? [], REPO.url ?? null);
    const actual = existsSync(ruta) ? readFileSync(ruta, 'utf8') : null;
    if (actual === null) {
      notas.push('BACKLOG.md: no existe, no se crea desde aqui.');
    } else if (!actual.includes(marca[0]) || !actual.includes(marca[1])) {
      notas.push('BACKLOG.md: sin las marcas ' + marca[0] + ' … ' + marca[1] + ', asi que NO se toca. '
        + 'Anadirlas es una decision: lo de dentro se reescribe entero y lo de fuera no (RULE-06).');
    } else {
      const i = actual.indexOf(marca[0]) + marca[0].length;
      const j = actual.indexOf(marca[1]);
      const nuevo = actual.slice(0, i) + SALTO + SALTO + derivado + SALTO + SALTO + actual.slice(j);
      if (nuevo === actual) notas.push('BACKLOG.md: ya al dia');
      else if (!escribir) notas.push('BACKLOG.md: se reescribiria el bloque derivado');
      else { writeFileSync(ruta, nuevo); notas.push('BACKLOG.md: bloque derivado reescrito'); }
    }
  }

  if (!escribir) notas.push('--aplicar los escribe. Sin la marca, esto solo enumera.');
  cerrarPasada();
}

// ── PT-091 · H-007 · inventario · las cifras se recalculan ──────────────────
//
// services.md se genero el 2026-08-19 y OCHO de sus dieciseis cifras ya no describian el arbol
// un dia despues. Durante EP-018 las distancias habian CRECIDO: selftest.sh documentado 3541
// contra 4919 reales. PTSA-R76 obliga a construir el universo auditable DESDE el inventario, y
// un inventario que envejece en un dia lo convierte en una fuente de memoria.
//
// QUE ESTABLECE: que cada cifra transcrita coincide con la derivada del arbol.
// QUE NO ESTABLECE: que la DESCRIPCION en prosa sea cierta. Que diga bien cuantas lineas tiene
//   tracker.mjs no dice nada sobre si describe bien lo que hace.
const RE_LINEA_INV = new RegExp(String.fromCharCode(92) + 'r?' + String.fromCharCode(92) + 'n');
const RE_TOOL_INV = new RegExp('[.](mjs|sh)$');
const F_SERVICES = join(ROOT, 'docs', 'enterprise-documentation', 'inventory', 'services.md');
const DIR_TOOLS = join(ROOT, 'docs', 'methodology', 'tools');

function lineasDe(herramienta) {
  const f = join(DIR_TOOLS, herramienta);
  if (!existsSync(f)) return null;
  return readFileSync(f, 'utf8').split(RE_LINEA_INV).length - 1;
}

function inventario() {
  if (!existsSync(F_SERVICES)) {
    notas.push('no hay inventory/services.md: nada que recalcular.');
    return;
  }
  const texto = readFileSync(F_SERVICES, 'utf8');
  const mal = cifrasQueMienten(cifrasTranscritas(texto), lineasDe);

  // El ancla: de que commit sale el recuento. FND-R14 lo hace con pt_at_generation para el
  // grafo, y el inventario no tenia equivalente — asi que nada distinguia «al dia» de «nadie
  // lo ha vuelto a mirar».
  const ancla = gitDe(['rev-parse', '--short', 'HEAD']);

  const cl = join(ROOT, 'CLAUDE.md');
  const rec = existsSync(cl) ? recuentosDeClaude(readFileSync(cl, 'utf8')) : {};
  const nTools = existsSync(DIR_TOOLS) ? readdirSync(DIR_TOOLS).filter((f) => RE_TOOL_INV.test(f)).length : null;

  if (!mal.length) notas.push(`las ${cifrasTranscritas(texto).length} cifras de services.md coinciden con el arbol${ancla ? ` (${ancla})` : ''}.`);
  for (const m of mal) {
    notas.push(m.motivo === 'no existe'
      ? `${m.herramienta}: en services.md y NO en el arbol.`
      : `${m.herramienta}: services.md dice ${m.lineas} y son ${m.real}.`);
  }
  if (rec.herramientas != null && nTools != null && rec.herramientas !== nTools) {
    notas.push(`CLAUDE.md declara ${rec.herramientas} herramientas y hay ${nTools}.`);
  }

  if (!APLICAR) {
    if (mal.length) notas.push('--aplicar   las reescribe. Sin la marca, esto solo las enumera.');
    return;
  }
  if (!mal.length) return;
  let nuevo = texto;
  for (const m of mal) {
    if (m.real == null) continue;
    const re = new RegExp('(^\\|\\s*`' + m.herramienta.replace('.', '[.]') + '`\\s*\\|\\s*)\\d+', 'm');
    nuevo = nuevo.replace(re, `$1${m.real}`);
  }
  writeFileSync(F_SERVICES, nuevo);
  notas.push(`${mal.filter((m) => m.real != null).length} cifra(s) reescritas en services.md.`);
}


// ── cursor · PT-128 · donde estas, de donde vienes, a donde vas ─────────────
//
// «un cursor que nos indique en donde estamos parados, de donde venimos y a donde vamos, lo mas
// parecido a un cursor en un arbol binario donde cada nodo es una cajita que tiene el dato, el
// puntero de salida hacia la derecha y el de la izquierda, y va recorriendo los padres e hijos
// para no perderse ninguna puerta ningun comportamiento».
//
// EL ARBOL:   lote  ->  tarea  ->  fase  ->  compuerta
//
// Todo se DERIVA: los lotes y tareas del registro (SUITE-R08), las fases y sus compuertas de
// PHASES.md (LEX-R21: manda el documento), y el rastro de cada fase de lo que hay EN DISCO. Nada
// se escribe a mano y nada se recuerda — recordar es justo lo que este comando existe para no
// tener que hacer.
//
// NO ESCRIBE NADA. Avanzar es de «avanzar», con su nota (FDGE-R52). Un comando que informa y a la
// vez mueve no se puede consultar sin consecuencias, y entonces no se consulta.
//
// LA GARANTIA ES POR ENUMERACION, NO POR CONSULTA (AC-04). Es PTSA-R79 aplicado al recorrido: se
// cierra cuando la enumeracion esta completa, no cuando el que busca deja de encontrar. Un nodo
// sin rastro SE NOMBRA; uno que no se puede evaluar sale SIN EVALUAR y es distinguible de
// «visitado» (RULE-06). Sin esa distincion el cursor prometeria cobertura donde solo tiene
// silencio, que es el defecto que este lote lleva NUEVE veces midiendo.
function cursor() {
  const foco = ARGS.slice(1).find((x) => /^(PT|EP)-\d+$/.test(x));

  const fases = (() => {
    const p = join(ROOT, 'docs', 'methodology', 'PHASES.md');
    if (!existsSync(p)) return [];
    return fasesDeFDGE(readFileSync(p, 'utf8'));
  })();
  if (!fases.length) {
    throw new Error('no se pudo derivar las fases de PHASES.md. No saber no es permiso (RULE-06): '
      + 'si la seccion cambio de forma, el cursor hay que arreglarlo, no adivinar el recorrido.');
  }

  // El foco por defecto: la implementacion abierta. FDGE-R48 garantiza que como mucho hay una.
  const lote = all.find((a) => String(a?.id ?? '').startsWith('EP-') && a?.status === 'IN_PROGRESS')
    ?? all.find((a) => String(a?.id ?? '').startsWith('EP-') && !ESTADOS_TERMINALES.has(String(a?.status ?? '')));
  const nodo = foco ? all.find((a) => a?.id === foco) : null;
  if (foco && !nodo) {
    throw new Error(`${foco} no esta en el registro. El registro asigna (SUITE-R08).`);
  }

  const esLoteNodo = (a) => String(a?.id ?? '').startsWith('EP-');
  const actual = nodo ?? lote;
  if (!actual) {
    di('');
    di('  cursor: no hay implementacion abierta ni foco. Nada que recorrer.');
    return;
  }

  // ── el NODO y su DATO ────────────────────────────────────────────────────
  di('');
  di(`  ESTAS EN   ${actual.id}${actual.slug ? ` · ${actual.slug}` : ''}`);
  di(`             ${actual.type ?? 'sin tipo'} · ${actual.status ?? 'sin estado'}`
    + (actual.phase != null ? ` · PHASE ${actual.phase}` : ''));

  // ── DE DONDE VIENES ──────────────────────────────────────────────────────
  di('');
  di('  VIENES DE');
  if (actual.origen_parada?.de) {
    di(`    ${actual.origen_parada.de} · la parada que abrio esta (${actual.origen_parada.motivo})`);
  }
  if (actual.epic) {
    const p = all.find((x) => x?.id === actual.epic);
    di(`    ${actual.epic}${p?.slug ? ` · ${p.slug}` : ''} · el lote que la contiene`);
  }
  if (!actual.epic && !actual.origen_parada?.de) {
    di('    nada la precede: es raiz del recorrido.');
  }

  // ── A DONDE VAS ──────────────────────────────────────────────────────────
  di('');
  di('  PUEDES IR A');
  const hijos = all.filter((x) => x?.epic === actual.id);
  if (esLoteNodo(actual)) {
    const vivos = hijos.filter((x) => !ESTADOS_TERMINALES.has(String(x?.status ?? '')));
    const cerrados = hijos.length - vivos.length;
    di(`    ${hijos.length} tarea(s): ${cerrados} cerrada(s), ${vivos.length} viva(s)`);
    for (const h of vivos.slice(0, 8)) {
      di(`      ${h.id} · ${h.status ?? '?'}${h.phase != null ? ` · PHASE ${h.phase}` : ''}`);
    }
    if (vivos.length > 8) di(`      … y ${vivos.length - 8} mas`);
  } else {
    const sig = fases.find((f) => f.n === Number(actual.phase) + 1);
    if (sig) {
      di(`    PHASE ${sig.n} · ${sig.nombre}${sig.compuerta ? ` — cierra ${sig.compuerta}` : ''}`);
      di(`      node docs/methodology/tools/tracker.mjs avanzar ${actual.id} --a ${sig.n} --nota "..."`);
    } else di('    no hay fase siguiente declarada en PHASES.md.');
  }

  // ── LO QUE NO SE HA VISITADO ─────────────────────────────────────────────
  //
  // El rastro de una fase es lo que esa fase DEJA EN DISCO. Se comprueba el ARTEFACTO, no que la
  // fase «se hiciera»: PT-133 midio la diferencia entre comprobar que una rama existe y
  // ejecutarla, y aqui es la misma. Una fase cuyo artefacto no sabemos nombrar sale SIN EVALUAR.

  // PT-128 · AC-04 · LA ENUMERACION TAMBIEN PARA UN LOTE, que es donde el propio intake puso la
  // prueba: «recorrer EP-019 entero y comprobar si el cursor habria nombrado los nodos que su
  // cierre se salto. Si no los nombra, el cursor no sirve».
  //
  // La primera version CONTABA las tareas —«17 cerradas, 0 vivas»— y no nombraba ninguna. Contar
  // es lo contrario de enumerar: un recuento correcto convive con cualquier hueco, porque no dice
  // CUAL. Es la forma que PTSA-R79 rechaza —«se cierra cuando la matriz esta completa, no cuando
  // el que busca deja de encontrar»— y la que este lote entero persigue.
  //
  // Se recorre el SUBARBOL: cada tarea del lote, y de cada una sus fases. Un nodo sin rastro se
  // NOMBRA con su tarea y su fase; uno que no se sabe evaluar sale SIN EVALUAR, que no es lo
  // mismo (RULE-06).
  if (esLoteNodo(actual)) {
    const sinRastro = [];
    const sinEvaluar = [];
    for (const h of hijos) {
      const dh = join(ROOT, 'changes', h.slug ? `${h.id}-${h.slug}` : String(h.id));
      const eh = join(IMPL, 'evidence', String(h.id));
      const hay = (p) => existsSync(p);
      const RASTRO_H = {
        1: () => hay(join(dh, 'intake.md')),
        3: () => hay(join(dh, 'strategy.md')),
        4: () => hay(join(dh, 'traceability.md')),
        6: () => hay(join(eh, 'manifest.json')) && hay(join(eh, 'self-review.md')),
        8: () => {
          const f = join(IMPL, 'HISTORY.log');
          if (!existsSync(f)) return null;
          return readFileSync(f, 'utf8').includes(`## ${h.id} `);
        },
      };
      const r = nodosSinVisitar(fases, h.phase, (n) => (RASTRO_H[n] ? RASTRO_H[n]() : null));
      for (const n of r.sinVisitar) sinRastro.push(`${h.id} PHASE ${n}`);
      for (const n of r.sinEvaluar) sinEvaluar.push(`${h.id} PHASE ${n}`);
    }
    di('');
    di('  ENUMERADO, no consultado   (PTSA-R79 · el SUBARBOL entero, nodo a nodo)');
    di(`    tareas recorridas   ${hijos.length}`);
    if (sinRastro.length) {
      di(`    SIN RASTRO    ${sinRastro.length} nodo(s):`);
      for (const s of sinRastro.slice(0, 12)) di(`      ${s}`);
      if (sinRastro.length > 12) di(`      … y ${sinRastro.length - 12} mas`);
      di('                  la tarea dice haber pasado por ahi y no dejo el artefacto.');
    } else di('    SIN RASTRO    ninguno: cada fase recorrida dejo su artefacto.');
    if (sinEvaluar.length) {
      di(`    SIN EVALUAR   ${sinEvaluar.length} nodo(s) · no se sabe nombrar su artefacto (RULE-06)`);
      for (const s of sinEvaluar.slice(0, 6)) di(`      ${s}`);
      if (sinEvaluar.length > 6) di(`      … y ${sinEvaluar.length - 6} mas`);
    }
  }

  if (!esLoteNodo(actual)) {
    const dir = join(ROOT, 'changes', actual.slug ? `${actual.id}-${actual.slug}` : String(actual.id));
    const ev = join(IMPL, 'evidence', String(actual.id));
    const hay = (p) => existsSync(p);
    const RASTRO = {
      1: () => hay(join(dir, 'intake.md')),
      3: () => hay(join(dir, 'strategy.md')),
      4: () => hay(join(dir, 'traceability.md')),
      6: () => hay(join(ev, 'manifest.json')) && hay(join(ev, 'self-review.md')),
      8: () => {
        const h = join(IMPL, 'HISTORY.log');
        if (!existsSync(h)) return null;
        return readFileSync(h, 'utf8').includes(`## ${actual.id} `);
      },
    };
    const r = nodosSinVisitar(fases, actual.phase, (n) => (RASTRO[n] ? RASTRO[n]() : null));
    di('');
    di('  ENUMERADO, no consultado   (PTSA-R79 · un nodo sin rastro SE NOMBRA)');
    di(`    con rastro    ${r.visitados.length ? r.visitados.map((n) => `PHASE ${n}`).join(' · ') : 'ninguna'}`);
    if (r.sinVisitar.length) {
      di(`    SIN RASTRO    ${r.sinVisitar.map((n) => `PHASE ${n}`).join(' · ')}`);
      di('                  la tarea dice haber pasado por ahi y no dejo el artefacto.');
    }
    if (r.sinEvaluar.length) {
      di(`    SIN EVALUAR   ${r.sinEvaluar.map((n) => `PHASE ${n}`).join(' · ')}`);
      di('                  no se sabe nombrar su artefacto. NO es lo mismo que visitada (RULE-06).');
    }
  }

  di('');
  di('  El cursor NO escribe: avanzar es de «avanzar», con su nota (FDGE-R52).');
}

// ── integrar · el viaje de vuelta tras el merge   PT-121 · AC-01 ────────────
//
// PHASE 9 manda «tras el merge: PT→INTEGRATED · intake.md CLOSED», y NINGUN COMANDO lo hacia.
// Se escribia a mano en dos sitios —registro y YAML— y por eso divergian: cerrando EP-019 el
// estado terminal se quedo en la rama de tarea y «main» declaro el lote DRAFT con sus diecisiete
// tareas en DONE durante todo el ciclo de publicacion.
//
// Es CE-006 —el acto hecho fuera del comando— por la unica razon que lo hace inevitable: no
// habia comando. Y CE-009, porque el estado terminal acababa escrito a mano.
//
// UN SOLO ACTO, y en el orden que ya usan «avanzar» y «abrir»: lo reversible primero. Si el YAML
// no se puede escribir, el registro NO se toca — al reves quedaria un registro diciendo
// INTEGRATED sobre un intake que dice otra cosa, que es la divergencia que esto viene a cerrar.
function integrar() {
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a));
  if (!id) {
    console.error('integrar necesita una allocation:  tracker integrar PT-131 [--aplicar]');
    process.exit(2);
  }
  const a = all.find((x) => x?.id === id);
  if (!a) { fail('SUITE-R08', `${id} no esta en el registro. El registro asigna (SUITE-R08).`); return; }

  // PT-121 · UN LOTE CIERRA DISTINTO QUE UNA TAREA, y por eso tiene su propia rama.
  //
  // Una tarea va DONE -> INTEGRATED. Un lote va READY -> CLOSED, y solo cuando NINGUNA de sus
  // tareas sigue viva: cerrar un lote con trabajo dentro seria declarar terminado lo que no lo
  // esta. La condicion se DERIVA de las tareas, no se pregunta.
  //
  // Esto se escribio cerrando EP-020, despues de escribir su estado A MANO con un «node -e» —
  // CE-006 cometido dentro del cierre del lote que existe para impedirlo. Se deshizo y se
  // rehizo con el comando, que es lo que el lote entero defiende.
  const esLote = /^EP-/.test(id);
  const destino = esLote ? 'CLOSED' : 'INTEGRATED';
  if (esLote) {
    if (a.status !== 'READY') {
      fail('SUITE-R46', `${id} esta en «${a.status}»: un lote cierra desde READY. Escribir CLOSED `
        + 'sobre otro estado borraria uno que alguien puso por algo.');
      return;
    }
    const vivas = all.filter((x) => x?.epic === id && !ESTADOS_TERMINALES.has(x?.status)
      && x?.status !== 'DEFERRED');
    if (vivas.length) {
      fail('SUITE-R45', `${id} tiene ${vivas.length} tarea(s) que no estan terminales: `
        + `${vivas.map((x) => `${x.id} (${x.status})`).join(' · ')}. Cerrar un lote con trabajo `
        + 'dentro seria declarar terminado lo que no lo esta.');
      return;
    }
  } else if (a.status !== 'DONE') {
    // DONE es la unica entrada legitima para una TAREA: FDGE-R34 la exige para G4, y G4 es lo que
    // acaba de pasar. Un BUG en VALIDATION_PENDING no entra — lo cierra una persona por
    // «tracker validar» (FDGE-R26, SUITE-R06b).
    fail('SUITE-R46', `${id} esta en «${a.status}» y integrar solo escribe DONE -> INTEGRATED. `
      + `FDGE-R34 exige DONE para G4, asi que un estado distinto significa que G4 no ha pasado `
      + `— o que ya se integro. No se adivina cual (RULE-06).`);
    return;
  }

  const dir = join(ROOT, 'changes', a.slug ? `${a.id}-${a.slug}` : a.id);
  const intake = join(dir, 'intake.md');
  if (!existsSync(intake)) {
    fail('FDGE-R23', `${id}: no existe ${intake.replace(ROOT, '.')}. El YAML del intake es la `
      + `mitad de esta transicion, y escribir solo la otra mitad deja las dos fuentes diciendo `
      + `cosas distintas — que es el defecto que este comando cierra.`);
    return;
  }

  const antes = readFileSync(intake, 'utf8');
  const RE_ESTADO = /^status:[ 	]*(\S+)[ 	]*$/m;
  const m = RE_ESTADO.exec(antes);
  if (!m) {
    fail('FDGE-R23', `${id}: su intake no declara «status:». Sin el, no hay transicion que `
      + 'escribir y suponerla seria inventar un dato (SUITE-R08).');
    return;
  }

  if (!APLICAR) {
    di(`  ${id}: ${a.status} -> ${destino}`);
    di(`    registro          allocations[].status`);
    di(`    intake            ${intake.replace(ROOT, '.')} · status: ${m[1]} -> ${destino}`);
    di('');
    di('  --aplicar   escribe las dos, en un solo acto.');
    return;
  }

  // Lo reversible primero: el YAML. Si falla, el registro se queda como estaba.
  writeFileSync(intake, antes.replace(RE_ESTADO, `status: ${destino}`), 'utf8');
  a.status = destino;
  guardarRegistro(reg, ACCION);
  notas.push(`${id}: ${m[1]} -> ${destino} en el intake y en el registro, en un solo acto`);
}

// ── firmar · el estado que produce una compuerta   PT-121 · AC-05 ───────────
//
// El gemelo de «integrar», por el otro extremo del ciclo: al pasar G1 un lote debe quedar READY,
// y eso tambien se escribia A MANO. Un lote que sigue DRAFT con su G1 resuelta es un registro que
// contradice a su propia acta.
//
// LA FIRMA SE CONTRASTA (SUITE-R27): un nombre que no esta en «firmantes» falla. No prueba que
// firmara una persona —el agente escribe el archivo— pero convierte la firma en una afirmacion
// contrastable, y quien aparece en la lista responde de lo que lleva su nombre.
function firmar() {
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a));
  const flag = (n) => { const i = ARGS.indexOf(n); return i >= 0 ? ARGS[i + 1] : null; };
  const quien = flag('--firmante');
  const compuerta = (flag('--compuerta') ?? 'G1').toUpperCase();
  if (!id || !quien) {
    console.error('firmar necesita allocation y firmante:  '
      + 'tracker firmar EP-020 --compuerta G1 --firmante "Nombre" [--fecha AAAA-MM-DD] [--aplicar]');
    process.exit(2);
  }
  if (compuerta !== 'G1') {
    fail('EXEC-R03', `este comando solo escribe el estado que produce G1. «${compuerta}» produce `
      + 'otro, y fingir que son el mismo seria inventar una transicion.');
    return;
  }
  const a = all.find((x) => x?.id === id);
  if (!a) { fail('SUITE-R08', `${id} no esta en el registro (SUITE-R08).`); return; }

  const firmantes = reg?.firmantes ?? reg?.personas?.map((p) => p?.nombre) ?? [];
  if (firmantes.length && !firmantes.includes(quien)) {
    fail('SUITE-R27', `«${quien}» no esta en la lista de firmantes (${firmantes.join(' · ')}). `
      + 'Es la unica defensa mecanica que existe contra una firma inventada.');
    return;
  }
  if (a.status !== 'DRAFT') {
    fail('SUITE-R46', `${id} esta en «${a.status}»: G1 produce READY desde DRAFT. Escribir READY `
      + 'sobre otra cosa borraria un estado que alguien puso por algo.');
    return;
  }
  if (!APLICAR) {
    di(`  ${id}: DRAFT -> READY   (${compuerta} · ${quien})`);
    di('');
    di('  --aplicar   lo escribe.');
    return;
  }
  a.status = 'READY';
  // PT-121 · LA FECHA ES LA DE LA COMPUERTA, NO LA DE EJECUTAR EL COMANDO.
  //
  // La primera version derivaba la fecha del ultimo commit, y al usarla sobre EP-020 —cuya G1
  // paso el 2026-08-22— escribio el 23. Una compuerta se resuelve cuando se resuelve, y el
  // comando puede correr despues: grabar «cuando lo escribi» en el campo que dice «cuando se
  // firmo» es una cifra plausible y falsa, que es lo que RULE-06 prohibe.
  //
  // Por defecto sigue siendo hoy —el caso normal es firmar y registrar en el mismo acto— pero
  // se puede DECIR la real. Lo encontro usar el comando sobre datos de verdad.
  a.compuertas = { ...(a.compuertas ?? {}), [compuerta]: { firmante: quien,
    fecha: flag('--fecha') ?? gitDe(['log', '-1', '--format=%cs']) ?? null } };
  guardarRegistro(reg, ACCION);
  notas.push(`${id}: DRAFT -> READY · ${compuerta} firmada por ${quien}`);
}

// ── validar · la validacion humana de un BUG, escrita por el comando   PT-136 ──
//
// FDGE-R26 dice que un BUG «transita a VALIDATION_PENDING y ahi SE DETIENE: solo un humano lo
// lleva a DONE». Lo que NO decia nadie es COMO se escribe eso, y por eso las tres unicas veces
// que ocurrio —PT-096, PT-097 y PT-098— se escribio A MANO declarando la excepcion cada vez.
//
// Es la clase de EP-020 en su forma mas pura: el acto es humano y legitimo, no hay comando, y por
// tanto la unica via es rodear el registro. Este comando NO decide: registra una decision que ya
// se tomo, y la deja contrastable — el firmante se comprueba contra la lista (SUITE-R27) y la
// fecha se DICE, porque una validacion puede registrarse despues de ocurrir (la leccion de
// PT-121, encontrada usando «firmar» sobre una G1 de dos dias antes).
//
// Lo que sigue siendo humano es la DECISION. Esto solo la escribe.
function validar() {
  const flag = (n) => { const i = ARGS.indexOf(n); return i >= 0 ? ARGS[i + 1] : null; };
  const ids = ARGS.slice(1).filter((a) => /^(PT|EP)-\d+$/.test(a));
  const quien = flag('--firmante');
  if (!ids.length || !quien) {
    console.error('validar necesita allocation(es) y firmante:  '
      + 'tracker validar PT-121 PT-122 --firmante "Nombre" [--fecha AAAA-MM-DD] [--aplicar]');
    process.exit(2);
  }
  const firmantes = reg?.firmantes ?? reg?.personas?.map((p) => p?.nombre) ?? [];
  if (firmantes.length && !firmantes.includes(quien)) {
    fail('SUITE-R27', `«${quien}» no esta en la lista de firmantes (${firmantes.join(' · ')}). `
      + 'Es la unica defensa mecanica que existe contra una firma inventada.');
    return;
  }
  const fecha = flag('--fecha') ?? gitDe(['log', '-1', '--format=%cs']) ?? null;

  const aplicables = [];
  for (const id of ids) {
    const a = all.find((x) => x?.id === id);
    if (!a) { fail('SUITE-R08', `${id} no esta en el registro (SUITE-R08).`); return; }
    if (a.type !== 'BUG') {
      fail('FDGE-R26', `${id} es ${a.type}, no BUG. Esta validacion es la que FDGE-R26 reserva a `
        + 'una persona para los BUG; usarla en otra cosa seria inventar una transicion.');
      return;
    }
    if (a.status !== 'VALIDATION_PENDING') {
      fail('LEX-R08', `${id} esta en «${a.status}»: la validacion humana va de VALIDATION_PENDING `
        + 'a DONE. Escribir DONE sobre otro estado borraria uno que alguien puso por algo.');
      return;
    }
    aplicables.push(a);
  }

  if (!APLICAR) {
    for (const a of aplicables) di(`  ${a.id}: VALIDATION_PENDING -> DONE   (G3 · ${quien} · ${fecha})`);
    di('');
    di('  --aplicar   lo escribe. La DECISION es humana; esto solo la registra.');
    return;
  }
  for (const a of aplicables) {
    a.status = 'DONE';
    a.compuertas = { ...(a.compuertas ?? {}), G3: { firmante: quien, fecha } };
    notas.push(`${a.id}: VALIDATION_PENDING -> DONE · G3 ${quien} ${fecha}`);
  }
  guardarRegistro(reg, ACCION);
}

// ── aplazar · la puerta de ida, con lo que debio pedir siempre   PT-138 ────
//
// PT-137 encontro que DEFERRED no tenia salida. Midiendo esta tarea resulta que TAMPOCO TENIA
// ENTRADA: ningun comando escribia el estado. Los dos aplazados que existian —PT-025 y PT-134—
// se teclearon a mano, y por eso ninguno declara cuando se revisa ni quien responde.
//
// SUITE-R44 garantiza que el aplazado quede VIVO en el espejo y EXENTO de artefactos, y ahi
// terminaba. Un aplazado de ayer y uno de hace meses eran indistinguibles en el tablero — y
// tambien indistinguibles de un abandono.
//
// Los tres campos se exigen AQUI, no en la compuerta: un dato que solo se pide al final se
// rellena al final, y entonces es una fecha inventada. Al no haber otra forma de escribir el
// estado, la obligacion no se puede rodear.
function aplazar() {
  const flag = (n) => { const i = ARGS.indexOf(n); return i >= 0 ? ARGS[i + 1] : null; };
  const de = flag('--de');
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a) && a !== de);
  const reentrada = flag('--reentrada');
  const revision = flag('--revision');
  const dueno = flag('--dueno');
  if (!id) {
    console.error('aplazar necesita una allocation:  '
      + 'tracker aplazar PT-NNN --reentrada "que tiene que pasar" --revision AAAA-MM-DD '
      + '--dueno "Nombre" [--de PT-NNN] [--aplicar]');
    process.exit(2);
  }
  const a = all.find((x) => x?.id === id);
  if (!a) { fail('SUITE-R08', `${id} no esta en el registro (SUITE-R08).`); return; }
  // PT-138 · un aplazado que YA lo esta se puede ACTUALIZAR: es como se le ponen sus terminos a
  // los que se escribieron a mano antes de que existiera este comando. Cualquier otro terminal se
  // niega — escribir DEFERRED sobre algo cerrado lo reabriria sin que nadie lo decidiera.
  const yaAplazada = a.status === 'DEFERRED';
  if (!yaAplazada && ESTADOS_TERMINALES.has(String(a.status))) {
    fail('SUITE-R44', `${id} esta en «${a.status}», que es terminal. Aplazar es aparcar trabajo `
      + 'VIVO: escribir DEFERRED sobre algo ya cerrado lo reabriria sin que nadie lo decidiera.');
    return;
  }

  // LOS TRES SE PIDEN JUNTOS Y SE NOMBRAN LOS QUE FALTAN. Pedirlos de uno en uno obliga a
  // ejecutar tres veces para descubrir que hacian falta tres.
  const faltan = [!reentrada && '--reentrada', !revision && '--revision', !dueno && '--dueno'].filter(Boolean);
  if (faltan.length) {
    fail('SUITE-R44', `${id}: falta ${faltan.join(' · ')}. Un aplazado sin condicion de reentrada, `
      + 'sin fecha de revision y sin dueno no se distingue de un abandono: es lo que hacia que '
      + 'PT-134 y PT-025 fueran identicos en el tablero.');
    return;
  }

  // «Que tiene que pasar» no es mecanizable, pero SI se puede exigir que no sea una celda
  // rellenada para callar la comprobacion. Se mide lo unico medible —que diga algo— y el resto
  // se DECLARA en design.md como no mecanizable (SUITE-R26).
  const texto = String(reentrada).trim();
  if (texto.length < 12 || texto.split(/\s+/).length < 3) {
    fail('SUITE-R26', `${id}: «${texto}» no es una condicion de reentrada. Se exige que DIGA algo; `
      + 'que diga algo UTIL no es mecanizable y lo sabe quien conoce el trabajo.');
    return;
  }

  // Una revision ya pasada nace caducada, y un aplazado que nace caducado es indistinguible del
  // que no declara nada: el defecto de esta tarea, reintroducido por la puerta de al lado.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(revision)) || Number.isNaN(Date.parse(String(revision)))) {
    fail('SUITE-R44', `${id}: «${revision}» no es una fecha AAAA-MM-DD.`);
    return;
  }
  // PT-138 · SIN GIT NO SE SALTA LA COMPROBACION. La primera version usaba solo la fecha del
  // ultimo commit, asi que en un repositorio sin git «hoy» era null y la caducidad NO SE MIRABA:
  // verde por no haber mirado (CE-005) dentro del comando que existe para impedirlo, y lo cazo
  // un caso sobre fixture. El reloj del sistema SI se puede leer siempre; se prefiere la fecha de
  // git cuando la hay porque es la que usa el resto del marco.
  const hoy = gitDe(['log', '-1', '--format=%cs']) ?? new Date().toISOString().slice(0, 10);
  if (String(revision) <= hoy) {
    fail('SUITE-R44', `${id}: la revision «${revision}» no es futura (hoy es ${hoy}). Un aplazado `
      + 'que nace caducado no se distingue del que no declara nada.');
    return;
  }

  const conocidas = [...(reg?.firmantes ?? []), ...((reg?.personas ?? []).map((p) => p?.nombre))]
    .filter(Boolean);
  if (conocidas.length && !conocidas.includes(dueno)) {
    fail('SUITE-R27', `«${dueno}» no esta declarado (${conocidas.join(' · ')}). Un dueno inventado `
      + 'es un aplazado sin dueno con mejor letra.');
    return;
  }

  const fecha = flag('--fecha') ?? hoy ?? null;
  if (!APLICAR) {
    di(yaAplazada
      ? `  ${id}: YA esta DEFERRED · se ACTUALIZAN sus terminos   (dueno ${dueno} · revision ${revision})`
      : `  ${id}: ${a.status} -> DEFERRED   (dueno ${dueno} · revision ${revision})`);
    di(`    reentrada         ${texto}`);
    if (de) di(`    de                ${de}`);
    di('');
    di('  --aplicar   lo escribe. La DECISION es humana; esto solo la registra.');
    return;
  }

  a.status = 'DEFERRED';
  a.aplazamiento = { reentrada: texto, revision: String(revision), dueno, ...(de ? { de } : {}), fecha };
  guardarRegistro(reg, ACCION);
  notas.push(`${id}: ${yaAplazada ? 'terminos ACTUALIZADOS' : '-> DEFERRED'} · revision ${revision} · dueno ${dueno}`);

  // SUITE-R59 · se compone con SALTO, no con secuencias escapadas.
  const L = [];
  L.push(MARCA_AGENTE);
  L.push(yaAplazada
    ? `**APLAZAMIENTO ACTUALIZADO** · \`${id}\` sigue en \`DEFERRED\``
    : `**APLAZADA** · \`${id}\` pasa a \`DEFERRED\``);
  L.push('');
  L.push('| | |');
  L.push('|:--|:--|');
  L.push(`| Se retoma cuando | ${texto} |`);
  L.push(`| Se revisa el | ${revision} |`);
  L.push(`| Responde | ${dueno} |`);
  if (de) L.push(`| Sale de | ${de} |`);
  L.push('');
  L.push('Un aplazado queda **vivo** en el tablero y exento de artefactos (`SUITE-R44`). Vuelve');
  L.push('con `tracker retomar` (`LEX-R33`), y no antes de que su condicion se cumpla.');
  const cuerpo = L.join(SALTO);

  if (adaptador?.comentar && a.issue) {
    try {
      adaptador.comentar(a.issue, cuerpo);
      notas.push(`${id}: aplazamiento publicado en #${a.issue}`);
    } catch (e) {
      fail('SUITE-R35', `${id}: el registro ya dice DEFERRED y la nota no se pudo publicar en `
        + `#${a.issue} (${String(e.message ?? e).split(SALTO)[0]}).`);
    }
  } else {
    const rutaLog = join(IMPL, 'TRANSICIONES.log');
    const previo = (() => { try { return readFileSync(rutaLog, 'utf8'); } catch { return ''; } })();
    writeFileSync(rutaLog, `${previo}${SALTO}## ${fecha} · ${id} · APLAZADA${SALTO}${SALTO}${cuerpo}${SALTO}`, 'utf8');
    notas.push(`${id}: aplazamiento escrito en TRANSICIONES.log (sin plataforma)`);
  }
}

// ── retomar · la puerta de vuelta de un aplazado   PT-137 ──────────────────
//
// SUITE-R44 pone la tarea aplazada en el tablero y declara que queda EXENTA de artefactos: no
// tiene intake. `integrar` es el unico comando con destino de estado arbitrario y EXIGE que el
// intake declare «status:» (4148), ademas de filtrar DEFERRED antes (4119). Las otras cuatro
// asignaciones de estado escriben DONE, VALIDATION_PENDING y READY, y ninguna toca DEFERRED.
//
// Es un lazo cerrado: LA REGLA QUE PONE LA TAREA EN EL TABLERO ES LA MISMA QUE LA DEJA
// INALCANZABLE. Retomarla exigia escribir REGISTRY.json a mano — el acto que SUITE-R08 existe
// para impedir, y CE-006 en su forma pura. Lo encontro USAR el marco: al ir a mover PT-134 a su
// lote, ningun comando podia.
//
// NO decide nada. Registra una decision ya tomada, con firmante contrastado (SUITE-R27) y fecha
// que se DICE, porque retomar puede registrarse despues de decidirse (la leccion de PT-121).
function retomar() {
  const flag = (n) => { const i = ARGS.indexOf(n); return i >= 0 ? ARGS[i + 1] : null; };
  const epica = flag('--epica');
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a) && a !== epica);
  const quien = flag('--firmante');
  if (!id || !quien) {
    console.error('retomar necesita allocation y firmante:  '
      + 'tracker retomar PT-134 --firmante "Nombre" [--fecha AAAA-MM-DD] [--epica EP-021] [--aplicar]');
    process.exit(2);
  }
  const a = all.find((x) => x?.id === id);
  if (!a) { fail('SUITE-R08', `${id} no esta en el registro (SUITE-R08).`); return; }

  // El estado se comprueba PRIMERO, y se DICE cual se encontro: «no se puede» sin el dato
  // obliga a ir a mirar el registro a mano, que es lo que este comando existe para evitar.
  if (a.status !== 'DEFERRED') {
    fail('SUITE-R44', `${id} esta en «${a.status}», no DEFERRED. Este comando es la puerta de `
      + 'vuelta de un APLAZADO: usarlo sobre otro estado escribiria DRAFT encima de uno que '
      + 'alguien puso por algo. Aplazar no es rechazar, y REJECTED no tiene vuelta.');
    return;
  }

  const firmantes = reg?.firmantes ?? reg?.personas?.map((p) => p?.nombre) ?? [];
  if (firmantes.length && !firmantes.includes(quien)) {
    fail('SUITE-R27', `«${quien}» no esta en la lista de firmantes (${firmantes.join(' · ')}). `
      + 'Es la unica defensa mecanica que existe contra una firma inventada.');
    return;
  }

  // AC-04 · reasignar a un lote CERRADO devuelve al limbo por otra puerta: la tarea queda viva
  // bajo un lote que ya no responde de ella. Es EXACTAMENTE el estado del que PT-134 sale, asi
  // que permitirlo haria inutil el comando en su propio caso de uso.
  if (epica) {
    const lote = all.find((x) => x?.id === epica);
    if (!lote) { fail('SUITE-R08', `--epica cita «${epica}», que no esta en el registro (SUITE-R08).`); return; }
    if (!esLote(lote)) { fail('LEX-R27', `--epica cita «${epica}», que no es un lote.`); return; }
    if (ESTADOS_TERMINALES.has(String(lote.status))) {
      fail('SUITE-R44', `${epica} esta en «${lote.status}»: reasignar a un lote cerrado deja la `
        + 'tarea viva bajo algo que ya no responde de ella. Es el limbo del que este comando saca.');
      return;
    }
  }

  const fecha = flag('--fecha') ?? gitDe(['log', '-1', '--format=%cs']) ?? null;
  const destinoEpica = epica ?? a.epic ?? null;

  // PT-137 · EL DESTINO SE DERIVA DEL ARBOL, y no es un detalle: LEXICON §5.1 declara
  // «DEFERRED --> READY» y SUITE-R44 declara que un aplazado NO TIENE INTAKE. Los dos no pueden
  // ser ciertos del mismo aplazado: volver a READY afirma una G1 sobre un alcance escrito, y sin
  // intake no hay alcance escrito ni firma que afirmar.
  //
  // Son DOS aplazados distintos y el marco los llamaba igual:
  //   el que se aparco DESDE READY conserva su intake  -> vuelve a READY, como dice LEXICON
  //   el que nacio aplazado no tuvo ninguno            -> vuelve a DRAFT/PHASE 1, a escribirlo
  //
  // Se decide MIRANDO si el intake existe, no preguntando ni suponiendo. Elegir un destino fijo
  // habria derogado a uno de los dos documentos desde una herramienta (SUITE-R00).
  const fIntake = join(ROOT, 'changes', a.slug ? `${a.id}-${a.slug}` : a.id, 'intake.md');
  const conIntake = existsSync(fIntake);
  const destino = conIntake ? 'READY' : 'DRAFT';
  const faseDestino = conIntake ? (a.phase ?? 1) : 1;
  const porque = conIntake
    ? 'conserva su intake: vuelve a READY, como declara LEXICON §5.1'
    : 'nacio aplazado y no tiene intake: vuelve a DRAFT · PHASE 1, a escribirlo (SUITE-R44)';

  if (!APLICAR) {
    di(`  ${id}: DEFERRED -> ${destino} · PHASE ${faseDestino}   (${quien} · ${fecha})`);
    di(`    por que           ${porque}`);
    di(`    epica             ${a.epic ?? 'ninguna'}${epica ? ` -> ${epica}` : ' (sin cambio)'}`);
    di(`    retomada          por ${quien}, el ${fecha}, de DEFERRED`);
    di('');
    if (!conIntake) di('  Vuelve a PHASE 1: hay que ESCRIBIR su intake. Este comando no lo genera.');
    di('  --aplicar   lo escribe. La DECISION es humana; esto solo la registra.');
    return;
  }

  // El campo importa tanto como el estado: sin el, una allocation retomada es indistinguible de
  // una que nunca se aplazo. SUITE-R44 existe porque algo aplazado se perdio; perder el rastro
  // de lo DESaplazado seria el mismo defecto con el signo cambiado.
  a.status = destino;
  a.phase = faseDestino;
  a.retomada = { por: quien, fecha, de: 'DEFERRED', destino, conIntake };
  if (epica) a.epic = epica;
  guardarRegistro(reg, ACCION);
  notas.push(`${id}: DEFERRED -> ${destino} · PHASE ${faseDestino} · retomada por ${quien} el ${fecha}`
    + (epica ? ` · epica ${epica}` : ''));

  // SUITE-R59 · el texto se compone con SALTO, no con secuencias escapadas dentro de una
  // plantilla. La primera version de este bloque se rompio justo ahi, que es CE-002.
  const L = [];
  L.push(MARCA_AGENTE);
  L.push(`**RETOMADA** · \`${id}\` vuelve de \`DEFERRED\` a \`${destino}\` · \`PHASE ${faseDestino}\``);
  L.push('');
  L.push('| | |');
  L.push('|:--|:--|');
  L.push(`| Quien | ${quien} |`);
  L.push(`| Fecha | ${fecha} |`);
  L.push(`| Lote | ${destinoEpica ?? 'ninguno'} |`);
  L.push('');
  L.push(porque.charAt(0).toUpperCase() + porque.slice(1) + '.');
  const cuerpo = L.join(SALTO);

  // Lo reversible primero, lo irreversible al final: contrato de «avanzar» (PT-053) y el que
  // PT-132 arreglo en «abrir». Si la publicacion falla, el registro ya esta escrito.
  if (adaptador?.comentar && a.issue) {
    try {
      adaptador.comentar(a.issue, cuerpo);
      notas.push(`${id}: retomada publicada en #${a.issue}`);
    } catch (e) {
      fail('SUITE-R35', `${id}: el registro ya dice DRAFT y la nota no se pudo publicar en `
        + `#${a.issue} (${String(e.message ?? e).split(SALTO)[0]}).`);
    }
  } else {
    // PT-084 · sin tablero, al ledger. Append-only (SUITE-R09).
    const rutaLog = join(IMPL, 'TRANSICIONES.log');
    const previo = (() => { try { return readFileSync(rutaLog, 'utf8'); } catch { return ''; } })();
    writeFileSync(rutaLog, `${previo}${SALTO}## ${fecha} · ${id} · RETOMADA${SALTO}${SALTO}${cuerpo}${SALTO}`, 'utf8');
    notas.push(`${id}: retomada escrita en TRANSICIONES.log (sin plataforma)`);
  }
}

// ── cierre · el comentario de cierre de un lote, por comando   PT-122 ───────
//
// AC-01 · es la UNICA forma sancionada: lleva MARCA_AGENTE por construccion, y un comentario sin
// marca no se puede producir con las herramientas del marco.
function cierre() {
  const id = ARGS.slice(1).find((a) => /^EP-\d+$/.test(a));
  if (!id) {
    console.error('cierre necesita un lote:  tracker cierre EP-020 [--aplicar]');
    process.exit(2);
  }
  const lote = all.find((x) => x?.id === id);
  if (!lote) { fail('SUITE-R08', `${id} no esta en el registro (SUITE-R08).`); return; }

  const tareas = all.filter((x) => x?.epic === id)
    .map((x) => ({ id: x.id, status: x.status, issue: x.issue,
      terminal: ESTADOS_TERMINALES.has(x.status) }));

  // TODO SE DERIVA. El tag se busca por VERSION, no por alfabeto: el orden de por defecto pone
  // v10 antes de v4.13.0 y da un tag equivocado (PT-121).
  const version = VERSION_DEL_PROYECTO;
  const tagEsperado = `v${version}`;
  const existe = gitDe(['rev-parse', '--verify', `${tagEsperado}^{commit}`]);
  const cuerpo = comentarioDeCierreDeLote({
    lote: id, version, tag: existe ? tagEsperado : null,
    commit: existe ? existe.trim().slice(0, 8) : null, tareas,
  });

  const destinos = [lote, ...tareas].filter((x) => x?.issue);
  if (!APLICAR) {
    di(`  ${id}: comentario de cierre para ${destinos.length} issue(s)`);
    di('');
    for (const linea of cuerpo.split(String.fromCharCode(10))) di(`    ${linea}`);
    di('');
    di('  --aplicar   lo publica, con la marca del agente.');
    return;
  }
  if (!adaptador?.comentar) {
    fail('SUITE-R35', 'la plataforma declarada no sabe comentar: no se publica nada. Sin eso el '
      + 'cierre vive solo en el repositorio, que sigue siendo valido (SUITE-R22).');
    return;
  }
  for (const d of destinos) {
    adaptador.comentar(d.issue, cuerpo);
    notas.push(`#${d.issue} · cierre de ${id} publicado con marca`);
  }
}

const acciones = { espejo, inventario, abrir, cerrar, integrar, firmar, cierre, validar, retomar, aplazar, notas: notasDe, pr: prAbierto, estado, pendiente: pendienteDe, siguiente: siguienteDe, checkpoint, avanzar, proyectar, coste, viabilidad, sesion, personas, asignar, rama, tipo, parada, sellar, indices, cursor };
if (!acciones[ACCION]) {
  console.error(`Acción desconocida: ${ACCION}. Conocidas: ${Object.keys(acciones).join(' · ')}`);
  process.exit(2);
}
if (ACCION === 'notas' || ACCION === 'pendiente') {
  try { acciones[ACCION](); process.exit(0); } catch (e) { console.error(String(e.message ?? e)); process.exit(1); }
}
try { acciones[ACCION](); } catch (e) { console.error(String(e.message ?? e)); process.exit(1); }

console.log(`tracker · ${PLATAFORMA} · acción ${ACCION}\n`);
for (const n of notas) console.log(`  · ${n}`);
if (errores.length) {
  console.log('');
  for (const e of errores) console.log(`  ✗ ${e.r.padEnd(12)} ${e.m}`);
  console.log(`\n${errores.length} divergencia(s) entre el registro y la plataforma.`);
  process.exit(1);
}
console.log(errores.length ? '' : '\nSin divergencias.');
process.exit(0);

} // fin de EJECUTADO_DIRECTO
