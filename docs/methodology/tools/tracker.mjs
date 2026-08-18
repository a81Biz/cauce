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

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
// PT-052 · partir lineas se hace con la funcion compartida: RE_LINEA contempla CRLF, y dos
// formas de partir lineas en el repositorio serian dos fuentes del mismo hecho (SUITE-R38).
import { lineas } from './patrones.mjs';

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
export const VIVOS = new Set(['DRAFT', 'READY', 'REOPENED', 'IN_PROGRESS', 'BLOCKED',
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
  const { comentarioPendiente = false, issueAbierto = null } = opciones;
  if (!alloc) return { error: 'no existe en el registro. El registro asigna (SUITE-R08): sin allocation no hay trabajo.' };
  if (!VIVOS.has(alloc.status)) {
    return { id: alloc.id, estado: alloc.status, terminado: true,
      siguiente: `${alloc.id} ya es ${alloc.status}. Lo cerrado es evidencia, no estado (SUITE-R36).` };
  }
  const bloqueos = [];
  // SUITE-R43 · lo que una persona escribió se lee ANTES de avanzar. Va primero porque puede
  // cambiar todo lo demás: preguntar qué sigue sin haber leído la respuesta anterior es el
  // defecto que esta acción existe para impedir.
  if (comentarioPendiente) {
    bloqueos.push(`hay un comentario sin responder en el issue #${alloc.issue}. Léelo y respóndelo antes de avanzar (SUITE-R43).`);
  }
  if (!alloc.issue) bloqueos.push(`no tiene issue. Lo que está abierto se consulta en el tablero (SUITE-R35):  tracker abrir --aplicar`);
  else if (issueAbierto === false) bloqueos.push(`su issue #${alloc.issue} no está abierto y ${alloc.id} sigue vivo (SUITE-R35).`);

  const f = alloc.phase;
  if (f === undefined || f === null) {
    return { id: alloc.id, estado: alloc.status, fase: null, bloqueos,
      siguiente: 'no declara «phase» en el registro: SIN EVALUAR. Sin fase no se puede derivar qué toca, y adivinarlo es lo que esta acción existe para impedir (RULE-06).' };
  }
  const actual = FASES[Number(f)];
  const proxima = FASES[Number(f) + 1];
  const compuerta = COMPUERTA_DE_FASE[Number(f)];
  return {
    id: alloc.id, estado: alloc.status, fase: Number(f), nombre: actual?.nombre ?? '¿?',
    produce: actual?.produce ?? [], cierra: actual?.cierra ?? '¿?', compuerta: compuerta ?? null,
    bloqueos,
    siguiente: bloqueos.length
      ? `RESUELVE PRIMERO lo de arriba. Después: ${actual?.cierra ?? '¿?'}`
      : `PHASE ${f} · ${actual?.nombre ?? '¿?'} — cierra con: ${actual?.cierra ?? '¿?'}`
      + (proxima ? `. Luego PHASE ${Number(f) + 1} · ${proxima.nombre}.` : '. Es la última fase.'),
  };
}

/** Las etiquetas que el registro DERIVA para el issue de una allocation. Función pura. */
export function etiquetasDe(alloc) {
  const et = [alloc?.type === 'EP' ? 'implementación' : 'tarea'];
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
export function compararEspejo(vivas, issues, todas) {
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
export const mensajeDeCierre = (a) =>
  `${a?.id} pasó a ${a?.status}. La evidencia está en el repositorio.

${MARCA_AGENTE}`;

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
export function cuerpoDeIssue(a, opciones = {}) {
  const { url, rama, tareas, ramaTrabajo, hayDirectorio } = opciones;
  const esLote = a?.type === 'EP';
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
  const ramaDelEnlace = (viva && ramaTrabajo) ? ramaTrabajo : (rama ?? 'main');
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
    : (url
      ? `[\`${dir}/\`](${url}/tree/${ramaDelEnlace}/${dir})`
      : `\`${dir}/\` — en el repositorio`);

  const l = [];
  l.push(esLote
    ? `**Implementación abierta** · ${a.title ?? a.slug ?? ''}`
    : `**${a?.type ?? 'PT'}** · severidad ${a?.severity ?? '—'} · ${a?.epic ? `de la implementación \`${a.epic}\`` : 'sin implementación asignada'}`);
  l.push('');
  if (esLote && (tareas ?? []).length) {
    l.push('Tareas de este lote:');
    l.push('');
    for (const t of tareas) l.push(`- \`${t.id}\`${t.issue ? ` · #${t.issue}` : ''} — ${t.title ?? t.slug ?? ''}`);
    l.push('');
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
  } else {
    l.push('');
    l.push(viva
      ? `> El enlace apunta a \`${ramaDelEnlace}\`, que es donde el contenido existe ahora. Al`
      : `> El enlace apunta a \`${ramaDelEnlace}\`, la rama por defecto: aquí es donde se queda.`);
    if (viva) l.push(`> integrarse pasará a \`${rama ?? 'main'}\` y este cuerpo se actualizará solo.`);
  }
  l.push('');
  l.push('> Este issue dice **qué está abierto**. Lo que se decidió y lo que se probó vive en el');
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
 * La dependencia entre cuerpos va en UN SOLO sentido: el de un lote enumera sus tareas **con su
 * número**, y el de una tarea cita a su lote **por identificador**. Creando en el orden del
 * registro —donde el lote va primero— su cuerpo se compone cuando sus tareas aún no tienen
 * número, y salía sin ellos: hacía falta repetir el comando.
 *
 * No se pide dos veces ni se pospone nada: se crea antes lo que no depende de nadie. Con la
 * dependencia en un sentido, un orden basta y no hay ciclo posible.
 *
 * Estable dentro de cada grupo (`Array.prototype.sort` lo es desde ES2019): dos tareas
 * conservan el orden del registro, que es el que el humano ve.
 */
export const ordenDeApertura = (pendientes) =>
  [...(pendientes ?? [])].sort((x, y) => (x?.type === 'EP' ? 1 : 0) - (y?.type === 'EP' ? 1 : 0));

const ARGS = process.argv.slice(2);
const ACCION = ARGS[0] ?? 'espejo';
const APLICAR = ARGS.includes('--aplicar');
// PT-039 · el identificador de `notas PT-NNN` o `siguiente EP-NNN` no es una ruta: sin excluirlo,
// `tracker siguiente EP-011` resolvia ROOT como el directorio «EP-011» y no encontraba el
// registro. Solo se excluia PT-NNN; `siguiente` acepta las dos formas desde PT-030.
// Lo encontro USAR la herramienta, no leerla.
// `tracker notas PT-004 .`
// resolvia ROOT como el directorio «PT-004» y no encontraba el registro.
const ROOT = resolve(ARGS.slice(1).find((a) => !a.startsWith('--') && !/^(?:PT|EP)-\d+$/.test(a)) ?? process.cwd());
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
        '--json', 'number,title,state,labels'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
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
    cerrar(numero, motivo) {
      execFileSync('gh', ['issue', 'close', String(numero), '--comment', motivo],
        { cwd: ROOT, stdio: 'pipe' });
    },
    comentarios(numero) {
      const out = execFileSync('gh', ['issue', 'view', String(numero), '--json', 'comments'],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return (JSON.parse(out).comments ?? []).map((c) => c.body ?? '');
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
/** Funcion PURA: el checkpoint que corresponde a una allocation, dado lo que git dice. */
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
    rama: alloc.branch ?? git.rama ?? null,
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

const EJECUTADO_DIRECTO = !!process.argv[1]
  && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (EJECUTADO_DIRECTO) {
const reg = leerJSON(join(IMPL, 'REGISTRY.json'));
if (!reg) { console.error('No hay docs/implementation/REGISTRY.json legible.'); process.exit(2); }
const PLATAFORMA = reg.tracker?.plataforma ?? null;


// PT-007 · `estado` lee SOLO el registro y no toca la plataforma — por eso responde «qué va
// cuándo» sin credencial y sin plataforma declarada. Exigirle la compuerta de acceso lo dejaba
// inútil justo donde más falta hace: en un proyecto que aún no espeja.
//
// PT-052 · `checkpoint` va en la misma lista, y por una razón más fuerte: es un artefacto DEL
// REPOSITORIO —todos sus campos salen del registro y de git— y el momento en que más falta hace
// es justo aquel en el que puede no haber credencial: retomar en una sesión nueva. Exigirle
// plataforma habría hecho que el estado dependiera de la red para poder escribirse.
const SIN_PLATAFORMA = new Set(['estado', 'checkpoint']);
const D = SIN_PLATAFORMA.has(ACCION) ? { codigo: 0 } : decidirSalida(reg, null);
if (D.codigo !== 0) {
  (D.codigo === 2 ? di : console.error)(D.mensaje);
  process.exit(D.codigo);
}
const adaptador = ADAPTADORES[PLATAFORMA];

// ── Qué está vivo según el registro ─────────────────────────────────────────
const all = Array.isArray(reg.allocations) ? reg.allocations : [];
const vivas = vivasDe(all);

// ── espejo ──────────────────────────────────────────────────────────────────
// El adaptador trae los issues; la comparación es la función pura de arriba, que es la que
// el arnés puede probar sin credenciales.
function espejo() {
  const issues = adaptador.abiertos();
  const div = compararEspejo(vivas, issues, all);
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
  tareas: a?.type === 'EP' ? all.filter((t) => t.epic === a.id) : undefined,
  // PT-048 · el dato viaja en el contexto y NO se lee dentro de `cuerpoDeIssue`: esa funcion es
  // pura y exportada a proposito —para que un caso pueda comprobarla sin hablar con la
  // plataforma ni con el disco—, y meterle un `existsSync` la habria devuelto a ser inprobable.
  hayDirectorio: existsSync(join(ROOT, 'changes', a?.slug ? `${a.id}-${a.slug}` : `${a?.id}`)),
});

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
    try { adaptador.anidar(f.padre, f.hijo); notas.push(`${f.id} #${f.hijo} → sub-issue de ${f.epic} #${f.padre}`); }
    catch { fail('SUITE-R51', `${f.id}: no se pudo anidar #${f.hijo} bajo #${f.padre}.`); }
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
  for (const a of ordenDeApertura(pendientes)) {
    // El issue REFERENCIA el intake; no lo copia. Dos copias del mismo texto divergen — es la
    // causa raiz que la v4 nacio para eliminar, reintroducida por la puerta nueva.
    const cuerpo = cuerpoDeIssue(a, contextoCuerpo(a));
    const etiquetas = etiquetasDe(a);   // PT-007 · incluye fase y compuerta, derivadas
    const n = adaptador.crear(`${a.id} · ${a.slug ?? a.type}`, cuerpo, etiquetas);
    a.issue = n;
    notas.push(`${a.id} → issue #${n}`);
  }
  // PT-035 · PT-036 · la pasada que CREA termina igual que la que no crea. Es la CUARTA vez en
  // este archivo que un arreglo queda detras de un `return` y no se ejecuta —PT-014 en
  // sincronizarCuerpos(), PT-022 en checkCierreDeLote(), PT-035 al anidar—. Cuatro veces no es
  // descuido: era que `abrir()` tenia dos finales y solo uno estaba completo. Ahora tiene uno.
  cerrarPasada();
  writeFileSync(join(IMPL, 'REGISTRY.json'), JSON.stringify(reg, null, 2) + '\n');
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
  const eps = all.filter((a) => a?.type === 'EP');
  const pts = all.filter((a) => a?.type !== 'EP');
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
function siguienteDe() {
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a));
  const objetivo = id
    ? [all.find((x) => x?.id === id)]
    : vivas.filter((a) => a?.type !== 'EP').sort((x, y) => (y.phase ?? -1) - (x.phase ?? -1));
  if (!objetivo.length || !objetivo[0]) {
    di(id ? `${id} no existe en el registro.` : 'Nada vivo en el registro: no hay trabajo abierto.');
    return;
  }
  for (const a of objetivo) {
    let pendiente = false;
    let abierto = null;
    if (a.issue && adaptador?.comentarios) {
      try { pendiente = comentarioSinResponder(adaptador.comentarios(a.issue)) === true; } catch { /* sin acceso: no se afirma */ }
    }
    if (a.issue && adaptador?.abiertos) {
      try { abierto = adaptador.abiertos().some((i) => i.number === a.issue); } catch { /* idem */ }
    }
    const r = queSigue(a, { comentarioPendiente: pendiente, issueAbierto: abierto });
    di('');
    di(`  ${r.id}  ${r.estado}${r.fase !== null && r.fase !== undefined ? `  ·  PHASE ${r.fase} ${r.nombre}` : ''}${a.issue ? `  ·  #${a.issue}` : ''}`);
    if (r.compuerta) di(`  compuerta:  ${r.compuerta}`);
    if (r.produce?.length) di(`  produce:    ${r.produce.join(' · ')}`);
    for (const b of r.bloqueos ?? []) di(`  ✗ BLOQUEA:  ${b}`);
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
const gitDe = (args) => {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim(); }
  catch { return null; }
};

function checkpoint() {
  const id = ARGS.slice(1).find((a) => /^(PT|EP)-\d+$/.test(a));
  if (!id) { throw new Error('checkpoint necesita una allocation:  tracker checkpoint PT-052'); }
  const a = all.find((x) => x?.id === id);
  // RULE-06 · si no esta en el registro no se inventan los campos: se dice.
  if (!a) { throw new Error(`${id} no existe en el registro. El registro asigna (SUITE-R08): sin allocation no hay checkpoint.`); }

  const sucio = gitDe(['status', '--porcelain']);
  const cp = checkpointDe(a, {
    sha: gitDe(['rev-parse', 'HEAD']),
    rama: gitDe(['rev-parse', '--abbrev-ref', 'HEAD']),
    fecha: gitDe(['log', '-1', '--format=%cs']),
    sucio: sucio === null ? null : sucio.length > 0,
    archivos: lineas(sucio ?? '').filter(Boolean).map((l) => l.slice(3)).sort(),
  });

  if (ARGS.includes('--ver')) { di(JSON.stringify(cp, null, 2)); return; }
  writeFileSync(join(ROOT, 'docs/implementation/CHECKPOINT.json'), JSON.stringify(cp, null, 2) + '\n');
  notas.push(`CHECKPOINT.json escrito: ${cp.pt} · PHASE ${cp.phase} ${cp.fase} · ${cp.sha_corto ?? 'sin sha'}` +
    (cp.sucio ? ` · ${cp.archivos.length} archivo(s) sin commitear` : ''));
}

const acciones = { espejo, abrir, cerrar, notas: notasDe, pr: prAbierto, estado, pendiente: pendienteDe, siguiente: siguienteDe, checkpoint };
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
