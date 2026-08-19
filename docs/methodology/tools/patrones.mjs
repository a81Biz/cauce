/**
 * patrones — los patrones críticos del marco, en un solo sitio y con su contrato.
 *
 * POR QUÉ EXISTE
 *   Un patrón puede estar mal y compilar. Esa es la frase entera del problema.
 *
 *   Ocho veces en este proyecto una secuencia de escape se perdió al editar: `\b` quedó como
 *   el byte 0x08 y `\s` como la letra «s». El regex resultante es sintácticamente válido y no
 *   casa nada — o casa otra cosa. El verificador entonces informa «sin errores» porque no
 *   encuentra nada que reprochar, y **el fallo es indistinguible del éxito**. Ninguna revisión
 *   por lectura lo ve: `/AC-d+/` y `/AC-\d+/` se parecen demasiado.
 *
 *   La 4.8.0 añadió un detector de bytes de control. Eso trata un síntoma: caza `\b` → 0x08,
 *   y no caza `\d` → `d`, que es exactamente el mismo fallo con un carácter imprimible.
 *
 * QUÉ HACE EN SU LUGAR
 *   Cada patrón viaja con lo que tiene que casar y lo que no. Si un escape se degrada, el
 *   ejemplo deja de casar y `verify-patrones` lo dice con nombre y línea. No hay forma de que
 *   un patrón roto pase por bueno: tendría que romperse Y sus ejemplos tendrían que romperse
 *   en la misma dirección.
 *
 *   Es la misma exigencia que el marco le pone a un criterio de aceptación: si no se puede
 *   escribir la comprobación que lo tumba, no es un criterio.
 *
 * Y DE PASO
 *   La fórmula del sello estaba copiada en tres archivos. Normalizar dos dejó al tercero
 *   contradiciendo a los otros y cinco casos del selftest en rojo. Aquí hay una sola.
 */

import { createHash } from 'node:crypto';

// ── El sello: contenido normalizado, nunca bytes crudos ─────────────────────
// Git entrega LF en Linux y CRLF en Windows. Un sello sobre bytes hacía que el CI acusara de
// desincronizado un núcleo intacto.
export const RE_LINEA = /\r?\n/;
export const lineas = (txt) => String(txt).split(RE_LINEA);
export const selloDe = (txt) => createHash('sha1')
  .update(lineas(txt).join('\n')).digest('hex').slice(0, 12);

/**
 * Cada entrada: el patrón, qué comprueba, y su contrato.
 *   casa    — textos que TIENEN que casar
 *   noCasa  — textos que NO deben casar
 *
 * Un patrón sin ambas listas no se admite: `verify-patrones` lo rechaza. Solo `casa` deja
 * pasar un patrón demasiado laxo; solo `noCasa`, uno que no casa nada.
 */
/**
 * PT-016 · `SUITE-R38` · Los estados en los que el trabajo de una allocation ESTA TERMINADO.
 *
 * Tres reglas preguntan lo mismo y cada una traia su copia de la lista: `FDGE-R52` desde
 * `PT-044` —el reanclaje se escribe mientras se trabaja—, `FDGE-R19` desde `PT-047` —la rama no
 * se retrofecha— y `SUITE-R08` desde esta tarea —la fase tampoco—. Tres copias del mismo hecho
 * es exactamente lo que este marco existe para eliminar, y la cuarta habria divergido.
 *
 * `DONE` NO ESTA, y no es un olvido: un PT en `DONE` esta esperando `G4` y sigue vivo. Anadirlo
 * apagaria las tres comprobaciones A LA VEZ, porque desde aqui comparten la constante. Su caso
 * en `selftest.sh` existe para que anadirlo cueste un rojo.
 */
export const ESTADOS_TERMINALES = new Set([
  'INTEGRATED', 'CLOSED', 'REVERTED', 'REJECTED', 'DEFERRED',
]);

/**
 * PT-029 · `SUITE-R38` · Desde que compuerta es exigible cada artefacto.
 *
 * Tres comprobaciones de `verify-fdge` decian `if (gate)` sin decir de QUE compuerta hablaban, y
 * con eso `G1`, `G2` y `G3` heredaban las exigencias de `G4`: pedian en `PHASE 1` lo que el
 * procedimiento escribe en `PHASE 8`. Las tres compuertas anteriores a `G4` NO SE PODIAN EVALUAR
 * con la herramienta que existe para evaluarlas, y llevaban asi desde que existe el parametro.
 *
 * Nadie tropezo antes porque la ruta esta indocumentada: `CLAUDE.md` y la cabecera de la
 * herramienta solo enseñan `--gate G4`, y `EXEC-R06` resuelve `G1`-`G3` con `verify-fdge` SIN
 * `--gate`. Lo encontro `PT-020` ejecutando `--gate G3` por curiosidad — usandolo, no leyendolo.
 *
 * La FASE viaja al lado de la compuerta a proposito. Sin ella, `'G3'` es un numero que hay que
 * creerse; con ella es derivable —`manifest.json` se escribe en `PHASE 6` y la primera compuerta
 * posterior es `G3`— y su caso en `selftest.sh` comprueba esa RELACION, no el valor. Poner un
 * artefacto en una compuerta anterior a su fase cuesta un rojo aunque la tabla sea coherente.
 */
export const ORDEN_COMPUERTAS = ['G1', 'G2', 'G3', 'G4'];

export const EXIGIBLE_DESDE = {
  'manifest.json': { desde: 'G3', fase: 6 },    // PHASE 6 lo escribe · G3 cierra PHASE 7
  'self-review.md': { desde: 'G3', fase: 6 },   // idem
  'HISTORY.log': { desde: 'G4', fase: 8 },      // PHASE 8 lo escribe · G4 cierra PHASE 9
};

/**
 * Sin compuerta no se exige nada: `verify-fdge` sin `--gate` informa, no bloquea, y esa
 * distincion es la que permite trabajar con el repositorio a medias sin la bateria en rojo.
 *
 * Un artefacto que no este en la tabla se exige desde cualquier compuerta: el defecto de partida
 * era exigir de mas, y el defecto opuesto —relajar `G4` por olvidar una entrada— seria peor.
 */
export const exigibleEn = (gate, artefacto) => {
  if (!gate) return false;
  const e = EXIGIBLE_DESDE[artefacto];
  if (!e) return true;
  return ORDEN_COMPUERTAS.indexOf(gate) >= ORDEN_COMPUERTAS.indexOf(e.desde);
};

// ── PT-058 · la naturaleza de una cifra ─────────────────────────────────────
//
// Decision 4 del firmante: distinguir MEDIDO, ESTIMADO y SIN EVALUAR, y NUNCA presentar una
// estimacion como una medicion.
//
// PHASE 2 midio que estas palabras YA se usaban: «SIN EVALUAR» aparecia 50 veces en trece
// archivos —seis documentos normativos, incluido RULES.md, y siete herramientas— y CERO en
// LEXICON, que es exactamente lo que LEX-R21 prohibe. Esto no amplia el marco: lo pone al dia
// con su propia regla.
//
// Y los 50 usos eran PROSA. Sobre prosa no hay forma de que «una cifra sin naturaleza» falle,
// asi que esto es un TIPO, no una convencion de redaccion.

export const MEDIDO = 'MEDIDO';
export const ESTIMADO = 'ESTIMADO';
export const SIN_EVALUAR = 'SIN EVALUAR';

// Cerrado, y ORDENADO de mejor a peor. El orden ES la regla de contagio, no una convencion de
// escritura: anadir un cuarto valor aqui pone en rojo la comprobacion de verify-suite, que es
// lo que lo hace cerrado de verdad y no una lista de buenas intenciones.
//
// El valor de SIN_EVALUAR lleva ESPACIO porque es la cadena que ya aparece en los trece
// archivos. Cambiarla obligaria a tocarlos todos para no ganar nada.
export const NATURALEZAS = [MEDIDO, ESTIMADO, SIN_EVALUAR];

/**
 * Una cifra que dice QUE ES.
 *
 * Sin naturaleza LANZA. Podria asumirse la peor —SIN EVALUAR— y seria conservador, pero
 * convertiria un olvido del programador en un dato valido que se propaga en silencio. Lanzar lo
 * detiene donde se escribio, que es el unico sitio donde alguien puede arreglarlo.
 *
 * SIN EVALUAR no tiene valor: vale null. Un cero sobrevive a cualquier suma y desaparece del
 * resultado, asi que un presupuesto sin datos pareceria HOLGADO — el marco arrancaria trabajo
 * justo cuando menos sabe. Es la tercera vez en EP-015 que la respuesta correcta es null:
 * «corresponde» en PT-056 y «referencia» en PT-057.
 */
export function cifra(valor, naturaleza) {
  if (!NATURALEZAS.includes(naturaleza)) {
    throw new Error('cifra(): naturaleza no declarada. Tiene que ser una de: '
      + NATURALEZAS.join(', ') + '. Una cifra sin naturaleza no entra (LEX-R21).');
  }
  return Object.freeze({ valor: naturaleza === SIN_EVALUAR ? null : valor, naturaleza });
}

/**
 * La PEOR de varias naturalezas. Una resta entre un dato medido y una estimacion ES una
 * estimacion, y el orden de los operandos no puede cambiarlo: seria una regla que se cumple la
 * mitad de las veces.
 */
export const peorNaturaleza = (...ns) => NATURALEZAS[Math.max(...ns.map((n) => {
  const i = NATURALEZAS.indexOf(n);
  return i < 0 ? NATURALEZAS.length - 1 : i;   // lo que no se reconoce se trata como lo peor
}))];

/**
 * Operar dos cifras. La naturaleza contagia hacia la peor, y con SIN EVALUAR el valor desaparece.
 *
 * NO revienta: devuelve SIN EVALUAR con valor null, que es la respuesta correcta —no se sabe—.
 * Reventar invitaria a un fallback a cero en quien llama, que es el defecto que esto persigue.
 */
const operar = (a, b, f) => {
  const n = peorNaturaleza(a?.naturaleza, b?.naturaleza);
  return n === SIN_EVALUAR ? cifra(null, SIN_EVALUAR) : cifra(f(a.valor, b.valor), n);
};

export const sumar = (a, b) => operar(a, b, (x, y) => x + y);
export const restar = (a, b) => operar(a, b, (x, y) => x - y);

/**
 * El texto de una cifra. La naturaleza va PEGADA al numero, no en una nota al pie: en el momento
 * en que se separan, «1974» se lee como una medida.
 */
export const textoCifra = (c) => (c?.naturaleza === SIN_EVALUAR
  ? SIN_EVALUAR
  : `${c?.valor} (${c?.naturaleza})`);

// ── PT-059 · viabilidad: no empezar lo que no se puede terminar ─────────────
//
// «Nunca comenzar una unidad de trabajo que probablemente no pueda completarse dentro del
// presupuesto disponible.» El problema es que PHASE 2 midio que ese presupuesto NO EXISTE:
// «disponible = total - gastado» sale SIN EVALUAR siempre, porque el total es el contexto del
// modelo y el marco no puede medirlo (decision 4 del firmante).
//
// Asi que esto NO compara contra un presupuesto. Compara contra el PRECEDENTE: lo mayor que esta
// sesion ya completo. SAFE no promete que quepa — dice que ya se pudo con algo asi.

export const SAFE = 'SAFE';
export const MARGINAL = 'MARGINAL';
export const UNSAFE = 'UNSAFE';
export const VEREDICTOS = [SAFE, MARGINAL, UNSAFE];

// Cuanto por encima de lo ya completado sigue siendo MARGINAL en vez de UNSAFE. Es un JUICIO,
// como MINIMO_REFERENCIA en PT-057: nada demuestra que 1.5 sea el numero, y por eso vive aqui
// con nombre en vez de dentro de un `if`.
export const HOLGURA = 1.5;

// Estado de TAREA. La tarea NO ESTA FALLANDO: no debe ejecutarse todavia. No es terminal, y
// tiene que estar en VIVOS — un estado que no sea ni terminal ni vivo desapareceria del tablero
// sin estar cerrado, que es peor que cualquiera de las dos cosas.
export const BLOCKED_BY_CONTEXT = 'BLOCKED_BY_CONTEXT';

/**
 * ¿Se puede empezar esto AHORA? Tres veredictos, y el motivo SIEMPRE.
 *
 * `coste` y `precedente` son cifras de PT-058: llevan su naturaleza pegada. `techoHistorico` es
 * lo mayor que CUALQUIER sesion registrada hizo nunca.
 *
 * El ORDEN de las comprobaciones es la parte que importa, y no es de estilo:
 *   1. AC-06 va PRIMERO — una tarea que nunca cabria no puede salir MARGINAL porque falte el
 *      precedente, o el bucle infinito que existe para impedir se produce igual.
 *   2. SIN EVALUAR va ANTES que las comparaciones — comparar null con un numero da false EN
 *      SILENCIO, y un veredicto correcto por accidente sigue siendo un accidente.
 */
export function viabilidadDe(coste, precedente, techoHistorico = null, holgura = HOLGURA) {
  if (coste?.valor != null && techoHistorico?.valor != null && coste.valor > techoHistorico.valor) {
    return { veredicto: UNSAFE, nunca: true,
      motivo: `${coste.valor} supera las ${techoHistorico.valor} de la mayor sesion registrada. `
        + 'No es que esta sesion vaya justa: ninguna ha hecho nunca tanto. Hay que PARTIR la tarea '
        + '(el alcance lo firma una persona, INTAKE-R06), no reintentarla.' };
  }
  if (coste?.valor == null || precedente?.valor == null) {
    return { veredicto: MARGINAL, nunca: false,
      motivo: `no se puede comparar: ${coste?.valor == null ? 'el coste' : 'el precedente'} esta `
        + 'SIN EVALUAR. NO SE APRUEBA POR OMISION, y tampoco se prohibe sin evidencia — el '
        + 'presupuesto disponible es SIN EVALUAR siempre, asi que prohibir aqui bloquearia todo.' };
  }
  if (coste.valor <= precedente.valor) {
    return { veredicto: SAFE, nunca: false,
      motivo: `la sesion ya completo algo de ${precedente.valor}, mayor que ${coste.valor}. `
        + 'Es PRECEDENTE, no capacidad: no promete que quepa, dice que ya se pudo con algo asi.' };
  }
  if (coste.valor <= precedente.valor * holgura) {
    return { veredicto: MARGINAL, nunca: false,
      motivo: `${coste.valor} pasa de las ${precedente.valor} ya completadas pero cabe en la `
        + `holgura (x${holgura}). Solo trabajo ATOMICO: nada que deje algo a medias.` };
  }
  return { veredicto: UNSAFE, nunca: false,
    motivo: `${coste.valor} pasa de la holgura sobre las ${precedente.valor} completadas. Hay `
      + 'evidencia EN CONTRA, no solo falta de evidencia a favor: checkpoint, handoff y parada.' };
}

const SALTO_LINEA = String.fromCharCode(10);

// ── PT-060 · la sesion es el worker, no el estado ───────────────────────────
//
// SESSION != STATE != TASK. La sesion es un recurso TEMPORAL; el estado del trabajo pertenece al
// marco y es persistente.
//
// PHASE 2 midio el hueco: nada registraba cuando empieza una sesion. PT-059 aproximaba «una
// sesion = un dia», y hoy eso da 45 commits contra 44 — coinciden, y COINCIDEN POR CASUALIDAD,
// porque la sesion empezo hoy. El dia que no coincidan, nada lo notaria.

/**
 * El estado de la SESION, derivado. `marca` es lo que «sesion abrir» capturo.
 *
 * `desde` es una MARCA, no memoria: un dato verificable EN EL MOMENTO EN QUE SE PONE, igual que
 * el sha del checkpoint. LEX-R26 prohibe lo otro —«llevo unas tres horas»—, no esto.
 *
 * Sin marca NO se cae al dia: se dice SIN EVALUAR. Pasar una aproximacion por el dato bueno es
 * exactamente lo que PT-058 existe para impedir.
 */
export function sesionDe(marca, git = {}, checkpoint = null) {
  if (!marca?.desde) {
    return { abierta: false, desde: null,
      motivo: 'no hay sesion abierta: «tracker sesion abrir» marca el inicio. Sin marca, lo que '
        + 'lleva la sesion es SIN EVALUAR — el dia NO es la sesion.' };
  }
  const c = (v) => cifra(v ?? null, v == null ? SIN_EVALUAR : MEDIDO);
  return {
    abierta: true,
    desde: marca.desde,
    desde_corto: String(marca.desde).slice(0, 7),
    abierta_en: marca.abierta ?? null,
    commits: c(git.commits),
    archivos: c(git.archivos),
    lineas: c(git.lineas),
    tareas: git.tareas ?? [],
    pt: checkpoint?.pt ?? null,
    phase: checkpoint?.phase ?? null,
  };
}

/**
 * El handoff de CAMBIO DE SESION, derivado del checkpoint y de la sesion. Ni una linea de prosa.
 *
 * NO sustituye a HANDOFF.md: su bloque ESTADO lleva las decisiones del firmante y los «no hacer»
 * que salieron de ejecutar — lo unico del estado que NO se puede derivar, y lo mas valioso que
 * tiene. Derivarlo seria perderlo (AC-05).
 */
export function handoffDeSesion(sesion, checkpoint) {
  const l = [];
  l.push(sesion?.abierta
    ? `sesion       desde ${sesion.desde_corto}${sesion.abierta_en ? ` (${sesion.abierta_en})` : ''}`
    : 'sesion       SIN EVALUAR: no se abrio. El dia NO es la sesion.');
  if (sesion?.abierta) {
    l.push(`             ${textoCifra(sesion.commits)} commits · ${textoCifra(sesion.lineas)} lineas`);
  }
  if (sesion?.tareas?.length) l.push(`tareas       ${sesion.tareas.join(' · ')}`);
  if (!checkpoint) {
    l.push('en curso     SIN EVALUAR: no hay CHECKPOINT.json. «tracker checkpoint PT-NNN» lo escribe.');
    return l.join(SALTO_LINEA);
  }
  l.push(`en curso     ${checkpoint.pt} · PHASE ${checkpoint.phase}${checkpoint.fase ? ' ' + checkpoint.fase : ''}`);
  l.push(`sobre        ${checkpoint.sha_corto ?? 'SIN EVALUAR'}${checkpoint.rama ? '  ' + checkpoint.rama : ''}`);
  l.push(`sigue        ${checkpoint.siguiente ?? 'SIN EVALUAR: «tracker siguiente» lo deriva.'}`);
  return l.join(SALTO_LINEA);
}

// ── PT-061 · quien es quien ─────────────────────────────────────────────────
//
// Medido al abrir EP-016, en un repositorio de UNA persona: 218 commits como «Alberto Martinez
// <alberto@a81.biz>», 9 como «a81Biz <albe.mtz@gmail.com>» y 1 como «Alberto Martinez
// <albe.mtz@gmail.com>». Tres identidades, una persona. El desorden no viene de trabajar con mas
// gente: viene de cambiar de maquina.

/**
 * ¿De quien es este autor de git? La PERSONA declarada, o null CON MOTIVO.
 *
 * NO adivina por parecido. Mismo apellido o mismo dominio de correo convertiria una duda en un
 * dato, y las cuatro tareas siguientes de EP-016 construirian sobre el SIN QUE SUS CASOS LO
 * NOTARAN: cada una comprobaria correctamente sobre una identidad falsa.
 *
 * El par casa ENTERO. Solo el correo no basta —dos personas pueden compartir un buzon de equipo—
 * y solo el nombre tampoco: «a81Biz» no se parece a nada.
 */
export function personaDe(autor, personas = []) {
  if (!autor?.correo && !autor?.nombre) {
    return { persona: null, motivo: 'el commit no declara autor' };
  }
  for (const p of personas ?? []) {
    for (const id of p?.git ?? []) {
      if (id?.correo === autor.correo && id?.nombre === autor.nombre) {
        return { persona: p.nombre, motivo: null };
      }
    }
  }
  return {
    persona: null,
    motivo: `«${autor.nombre} <${autor.correo}>» no esta declarado en «personas». Si es de `
      + 'alguien ya declarado, anadelo a su lista «git»: no se adivina por parecido.',
  };
}

/** El nombre canonico de quien usa esta maquina, si esta declarado. */
export const personaLocal = (nombre, correo, personas = []) =>
  personaDe({ nombre, correo }, personas);

// ── PT-062 · los IDs se reparten por rangos reservados ──────────────────────
//
// PHASE 2 lo reprodujo: si Ana y Bruno asignan PT-066 a la vez, el CONTADOR se fusiona SIN
// CONFLICTO —los dos escribieron 66, git lo da por acordado— y el conflicto queda reducido a una
// linea de «slug». Quien lo resuelva elige un texto y la otra tarea DESAPARECE ENTERA. El dano no
// es el conflicto: es que el conflicto PARECE PEQUENO.

/**
 * El siguiente ID del rango de una persona. El numero, o null CON MOTIVO.
 *
 * Se DERIVA de lo ya asignado dentro del rango, no de un contador aparte: un contador por persona
 * seria un segundo sitio donde vive el mismo hecho, y divergiria (SUITE-R38).
 */
export function siguienteEnRango(prefijo, rango, usados = []) {
  if (!Array.isArray(rango) || rango.length !== 2) {
    return { numero: null, motivo: `esta persona no declara rango para ${prefijo}` };
  }
  const [desde, hasta] = rango;
  // Los que estan FUERA del rango no cuentan: los 65 PT de este repositorio se asignaron sin
  // rango, y si contaran para el de otra persona su primer ID saltaria a 66 sin motivo.
  const dentro = (usados ?? []).filter((n) => n >= desde && n <= hasta);
  const siguiente = dentro.length ? Math.max(...dentro) + 1 : desde;
  if (siguiente > hasta) {
    return { numero: null,
      motivo: `rango ${prefijo} [${desde}-${hasta}] AGOTADO: ${dentro.length} usados y el ultimo `
        + `es ${Math.max(...dentro)}. Ampliar el rango es una decision humana; invadir el `
        + 'siguiente reproduce la colision que los rangos evitan.' };
  }
  return { numero: siguiente, motivo: null };
}

/**
 * ¿Se solapan dos rangos? Tocarse por un extremo YA es solaparse: ese numero compartido es
 * exactamente el que las dos personas pediran a la vez.
 */
export const seSolapan = (a, b) =>
  Array.isArray(a) && Array.isArray(b) && a.length === 2 && b.length === 2
  && a[0] <= b[1] && b[0] <= a[1];

/** Todos los solapes de una tabla de personas, para un prefijo. */
export function solapes(personas = [], prefijo = 'PT') {
  const out = [];
  const con = (personas ?? []).filter((p) => Array.isArray(p?.rango?.[prefijo]));
  for (let i = 0; i < con.length; i += 1) {
    for (let j = i + 1; j < con.length; j += 1) {
      if (seSolapan(con[i].rango[prefijo], con[j].rango[prefijo])) {
        out.push({ a: con[i].nombre, b: con[j].nombre,
          rangoA: con[i].rango[prefijo], rangoB: con[j].rango[prefijo] });
      }
    }
  }
  return out;
}

// ── PT-063 · el usuario vive en la rama de tarea ────────────────────────────
//
// Decision 3 del firmante: el usuario vive en la RAMA DE TAREA y «trabajo» sigue siendo unica,
// para no anadir un cuarto nivel ni multiplicar G4 contra EXEC-R03.

/**
 * Normaliza un nombre para una referencia de git. LO USAN LAS DOS ramas del marco —«cauce/
 * <usuario>» (PT-054) y la rama de tarea— y por eso vive aqui: si cada una normalizara por su
 * cuenta, la misma persona tendria dos nombres segun que rama se mire.
 */
export const normalizaRef = (nombre) => String(nombre ?? '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

/**
 * Como debe llamarse la rama de una tarea.
 *
 * El usuario sale del nombre CANONICO (PT-061), no de «git config» a pelo: desde la maquina que
 * produjo los 9 commits de «a81Biz», leerlo directo habria dado «chore/a81biz/PT-063-…» — otra
 * rama para la misma persona.
 *
 * Sin usuario resuelto, DOS niveles como siempre: un proyecto de una persona no cambia nada.
 */
export function ramaDeTarea(tipo, id, slug, usuario = null) {
  const t = String(tipo ?? 'chore').toLowerCase();
  const u = usuario ? normalizaRef(usuario) : null;
  const cola = `${id}-${slug}`;
  return u ? `${t}/${u}/${cola}` : `${t}/${cola}`;
}

/** ¿Lleva usuario esta rama? Tres niveles, con el identificador al final. */
export const ramaLlevaUsuario = (rama) => {
  const p = String(rama ?? '').split('/');
  return p.length >= 3 && /^(PT|EP)-\d+/.test(p[p.length - 1]);
};

// ── PT-064 · de quien es cada commit ────────────────────────────────────────
//
// PHASE 2 midio que NINGUNA cifra pedia el autor: las tres derivaciones piden el SHA, el asunto y
// la fecha. Con una persona da igual; con dos, cada una mezcla el trabajo de las dos, y sobre
// ellas decide la compuerta de PT-059.

/**
 * Filtra por persona, SOLO si hay a quien filtrar.
 *
 * Con `persona` null devuelve TODO: es el caso de un proyecto sin «personas» declaradas, y es lo
 * que hace que esta tarea no rompa EP-015 (AC-05).
 */
export const soloDe = (items, persona) =>
  (persona ? (items ?? []).filter((x) => x?.persona === persona) : (items ?? []));

/**
 * Cuantos quedaron fuera por no tener persona declarada.
 *
 * Se DICE, no se resta en silencio: un commit sin persona no se adjudica por parecido (PT-061), y
 * si ademas desapareciera sin contarse, las cifras encogerian sin que nada lo explicara.
 */
export const sinPersona = (items) => (items ?? []).filter((x) => !x?.persona).length;

// ── PT-065 · la sesion es de alguien ────────────────────────────────────────
//
// PHASE 2 lo reprodujo: SESSION.json esta VERSIONADO, asi que con dos personas la marca de una se
// PROPAGA y da conflicto en CADA merge. Y la resolucion obvia —quedarse con uno— borra la sesion
// del otro: a partir de ahi su precedente sale de una marca que no es suya.
//
// Un archivo por persona lo evita POR CONSTRUCCION: nadie escribe el de nadie. Es la misma logica
// que PT-062 aplico a los identificadores.

/** El archivo de sesion de una persona. Sin persona, el de siempre (compatibilidad). */
export const archivoSesion = (persona) =>
  (persona ? `SESSION-${normalizaRef(persona)}.json` : 'SESSION.json');

/**
 * Las sesiones AJENAS. No es cosmetico: si cada persona solo viera la suya, las dos creerian que
 * trabajan solas y ninguna entenderia por que las cifras no cuadran.
 *
 * Una marca SIN persona no cuenta como ajena — es la de un proyecto de una sola persona, y
 * contarla haria ver una sesion fantasma.
 */
export const sesionesAjenas = (marcas, yo) =>
  (marcas ?? []).filter((m) => m?.persona && m.persona !== yo);

export const PATRONES = {
  FIRMA_SOLICITANTE: {
    re: /\b(?:Reportado|Solicitado|Validado)\s+por:[ \t]*(?!\[)(\S.*)$/im,
    para: 'quién firmó el intake (INTAKE-R06)',
    casa: [
      'Solicitado por: Ada Lovelace',
      'Reportado por: Equipo de soporte',
      '  Validado por: A. Turing',
    ],
    noCasa: [
      'Solicitado por:',                        // vacío: el campo existe y nadie lo rellenó
      'Solicitado por: [nombre]',               // la plantilla sin personalizar
      'Solicitado por:\nFecha: 2026-08-05',     // \s se comía el salto y capturaba «Fecha:»
    ],
  },

  FIRMA_NOMBRE: {
    re: /(?:solicitad[oa]|integrad[oa]|resuelt[oa]|autorizad[oa]|validad[oa]|aprobad[oa]|cerrad[oa]|revisad[oa])[ \t]+por:[ \t]*(\S.*?)[ \t]*$/gim,
    para: 'toda firma, para contrastarla contra «firmantes:» (SUITE-R27)',
    casa: [
      'integrado por: Ada Lovelace',
      'Revisado por: A. Turing',
      '| PT-050 | BUG | INTEGRATED | validado por: Ada Lovelace |',
    ],
    noCasa: [
      'Revisado por:',
      'integrado por:\nFecha: 2026-08-06',
    ],
  },

  VALOR_FIRMADA: {
    re: /^[ \t]*Firmada por:[ \t]*(\S.*)$/im,
    para: 'la Declaración de Valor firmada (FND-R24)',
    casa: ['Firmada por: Ada Lovelace', '  Firmada por: Comité de producto'],
    noCasa: [
      'Firmada por:',
      'Firmada por:\nFecha: 2026-08-06',        // el verde falso que validaba una declaración en blanco
    ],
  },

  LOTE: {
    re: /Firmado\s+por\s+lote:\s*(EP-\d+)/i,
    para: 'un intake ligero que hereda del lote (INTAKE-R08, FDGE-R51)',
    casa: ['Firmado por lote: EP-014', 'firmado por lote: EP-001'],
    noCasa: ['Firmado por lote:', 'Firmado por lote: PT-014'],
  },

  SEVERIDAD: {
    re: /^\s*severity:\s*(S[1-4])\b/im,
    para: 'la severidad declarada por el humano (INTAKE-R04)',
    casa: ['severity: S1', '  severity: S3'],
    noCasa: ['severity:', 'severity: S5', 'severity: alta'],
  },

  CRITERIO_ACEPTACION: {
    re: /\bAC-\d+\b/,
    para: 'que una tarea traiga criterios de aceptación (FDGE-R51)',
    casa: ['| AC-01 | el login acepta |', 'cubre AC-12 y AC-13'],
    noCasa: ['| AC- | vacío |', 'ACC-01', 'AC-uno'],
  },

  NOTA_BITACORA: {
    re: /^\d{4}-\d{2}-\d{2}\s*·\s*PHASE/gim,
    para: 'cada transición de fase escrita en la tarea (FDGE-R52)',
    casa: ['2026-08-12 · PHASE 4 → 5', '2026-08-12 ·  PHASE 1 → 2'],
    noCasa: ['12-08-2026 · PHASE 4 → 5', 'PHASE 4 → 5', '2026-08-12 · fase 4'],
  },

  CIERRE_DECLARADO: {
    re: /^\s*>?\s*Termina cuando\s*:\s*\S/im,
    para: 'la condición observable que da final a la tarea (FDGE-R53)',
    casa: ['Termina cuando: el endpoint responde 200', '> Termina cuando: hay evidencia'],
    noCasa: ['Termina cuando:', 'Termina cuando : ', 'termina bien'],
  },

  SELLO_CUERPO: {
    re: /^<!-- cuerpo: ([0-9a-f]{12}) -->$/m,
    para: 'el sello que detecta una edición a mano del núcleo (SUITE-R16)',
    casa: ['<!-- cuerpo: 0b550ea075a8 -->'],
    noCasa: ['<!-- cuerpo: -->', '<!-- cuerpo: XYZ -->', '<!-- fuentes: RULES.md:abc -->'],
  },

  VERSION_VIGENTE: {
    re: /^##\s+(\d+\.\d+\.\d+)\s+—/m,
    para: 'la versión vigente, leída de la primera entrada del CHANGELOG (SUITE-R40)',
    casa: ['## 5.2.1 — 2026-08-12', '## 10.0.0 — 2026-01-01'],
    noCasa: [
      '## 5.2 — 2026-08-12',          // sin parche: no es una versión de la suite
      '## v5.2.1 — 2026-08-12',       // el prefijo no es el formato del CHANGELOG
      '### 5.2.1 — 2026-08-12',       // un subtítulo no abre una versión
    ],
  },

  ESTADO_BLOQUE: {
    re: /<!--\s*ESTADO\s*-->([\s\S]*?)<!--\s*\/ESTADO\s*-->/,
    para: 'el bloque de estado que hace retomable la sesión (SUITE-R33)',
    casa: ['<!-- ESTADO -->\nsiguiente: cerrar G3\n<!-- /ESTADO -->'],
    noCasa: ['<!-- ESTADO -->\nsiguiente: cerrar G3'],   // sin cerrar: no es un bloque
  },
};
