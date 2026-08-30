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

/**
 * PT-081 · Desde qué VERSIÓN rige cada regla. La hermana de `EXIGIBLE_DESDE` en el eje del
 * tiempo: aquella decide qué compuerta exige un artefacto; ésta, desde cuándo existe la regla.
 *
 * `verify-fdge` tenía UNA constante —`DESDE = [5, 1, 0]`— gobernando tres comprobaciones de
 * reglas nacidas en versiones distintas. Medido en el CHANGELOG:
 *
 *   FDGE-R52  nace en 5.0.0   y se trataba como 5.1.0   → no regía sobre tareas de 5.0.0
 *   FDGE-R53  nace en 5.1.0   y se trataba como 5.1.0   → correcto
 *   FDGE-R54  nace AHORA      y se trataba como 5.1.0   → regía sobre todo desde el 12 de agosto
 *
 * El tercero es el que importa: un proyecto instalado en 8.2.0 que actualizara veria fallar
 * `--gate G2` en toda tarea en vuelo sin `viabilidad`, por una regla que no existia cuando esas
 * tareas se escribieron. Y la guia de migracion de la 9.0.0 dice que no hay que hacer nada.
 *
 * Sólo entran las reglas cuya comprobación DEPENDE de la versión. Una regla que siempre rigió no
 * necesita fila, y ponerla seria inventar una fecha.
 */
export const RIGE_DESDE = {
  'FDGE-R52': [5, 0, 0],    // reanclaje por fase · CHANGELOG 5.0.0
  'FDGE-R53': [5, 1, 0],    // la tarea declara cómo termina · CHANGELOG 5.1.0
  'FDGE-R54': [10, 0, 0],   // la viabilidad consta antes de G2 · nace con EP-017
  'SUITE-R56': [10, 0, 0],  // el rastro sobrevive a la rama · nace con EP-017
  'SUITE-R57': [10, 0, 0],  // lo integrado no se acumula sin sellar · nace con EP-017
  'SUITE-R09': [11, 0, 0],  // el ledger no pierde lineas · el verificador nace con EP-018
  'EXEC-R04':  [11, 0, 0],  // la G4 deja constancia · 18 merges historicos sin ella
  'EXEC-R04a': [11, 0, 0],  // la constancia tiene forma fija · nace con EP-018
  // PT-160 · EP-024 · que los AC de la matriz sean LOS DEL INTAKE nadie lo comprobaba. La primera
  // corrida encontro SEIS reales —PT-077 declara AC-06 y su matriz no lo recoge— y trece avisos,
  // todos sobre trabajo YA INTEGRADO. Juzgarlo hacia atras es CE-014: aquellas tareas no pudieron
  // cumplir lo que nadie les pedia, y el rojo no tendria salida porque su matriz ya se cerro.
  'FDGE-R15a': [13, 3, 0],
  'LEX-R27': [13, 3, 0],
  'LEX-R37': [13, 3, 0],
  'EXEC-R03': [13, 3, 0],          // PT-183 · un PT sin lote no esta bajo ninguna compuerta de lote
  'EXEC-R15': [13, 3, 0],          // la ejecucion de un lote es secuencial por defecto
  'LEX-R35': [13, 2, 0],
  'LEX-R36': [13, 2, 0],           // las diez familias de reglas no son los seis componentes           // PT-159 · un «declara» lleva su vuelta escrita           // PT-153 · el barrido del registro, no solo el lote verificado  // los AC de la matriz son los del intake · nace con EP-024
  // PT-099 · la entrada a VALIDATION_PENDING se vigila desde 12.0.0. La REGLA es vieja
  // —LEX-R08 severidad H, FDGE-R26 HARD— pero nadie la aplicaba: 51 BUG del registro y CERO
  // pasaron por ahi. Sin esta fila los 51 saldrian en rojo SIN SALIDA, porque un estado por el
  // que no se paso no se puede retrofechar. Es EXEC-R04a de PT-095, otra vez.
  // PT-115 · EP-020 · la parada entra al vocabulario y a las reglas. Anadir reglas vinculantes es
  // MAJOR (CHANGELOG, cabecera): el lote cierra en 13.0.0.
  //
  // RIGE_DESDE no es una formalidad aqui. FDGE-R55 exige publicar la parada en su tarea, y sin
  // esta fila juzgaria las 131 tareas cerradas antes de que la regla existiera — que es el defecto
  // que PT-081 y PT-095 documentaron y PT-106 midio: dos de cada diez reglas discrepan entre
  // cuando se REDACTARON y desde cuando JUZGAN.
  'FDGE-R55': [13, 0, 0],
  'LEX-R29':  [13, 0, 0],
  'LEX-R30':  [13, 0, 0],
  'LEX-R08': [12, 0, 0],
  'LEX-R31': [13, 0, 0],           // PT-118 · la tercera clase de identificador
  'LEX-R32': [13, 0, 0],           // PT-118 · citar un CE que LEXICON no declara
  'SUITE-R58': [12, 0, 0],
  'SUITE-R59': [12, 0, 0],

  // ── PT-106 · las veinte que EMPEZARON A JUZGAR despues del primer commit ──
  //
  // El reparto del lote decia «las 151 reglas HARD declaran desde cuando rigen». La medicion
  // dice VEINTE, y la diferencia no es un recorte: es lo que significa la regla.
  //
  //   152  HARD          87 no emiten nada -> NO PUEDEN JUZGAR, no necesitan fila
  //    65  emiten         7 ya la declaran
  //                      38 existen desde el PRIMER COMMIT -> nada anterior que juzgar mal
  //                      20 llegaron DESPUES  <- estas
  //
  // Y EL METODO OBVIO HABRIA MENTIDO. Derivar la version del CHANGELOG parece razonable y es
  // falso: ahi consta cuando se ESCRIBIO la regla, y esto dice desde cuando JUZGA. Contrastado
  // contra las que ya estaban a mano, DOS discrepan — EXEC-R04 consta en la 8.1.0 y rige desde
  // la 11.0.0; SUITE-R09 consta en la 4.13.0 y rige desde la 11.0.0. Una cifra plausible y
  // falsa es peor que ninguna (RULE-06).
  //
  // Estas veinte se derivan del ARBOL: el commit donde aparecio la EMISION, y la version que
  // el proyecto declaraba en ese commit. Cada una trazable a su sha, ninguna inventada.
  'FDGE-R19': [7, 7, 0],          // 3b528d6f
  'FDGE-R39': [7, 7, 0],          // 976b8bec
  'FDGE-R48': [4, 14, 0],          // 5d2772a0
  'FDGE-R49': [4, 14, 0],          // 5d2772a0
  'FDGE-R51': [4, 14, 0],          // 5d2772a0
  'FND-R29': [7, 7, 0],           // 976b8bec
  'FND-R30': [5, 2, 3],           // 2ad50bed
  'SUITE-R31': [8, 0, 0],         // 2b971378
  'SUITE-R33': [5, 0, 0],         // e88a63ba
  'SUITE-R34': [5, 0, 0],         // e88a63ba
  // SUITE-R35 NO lleva fila, y es una decision, no un olvido. La derivacion mecanica se la
  // puso —su comprobacion aparecio en la 5.0.0— y un caso de la bateria la retiro: PT-089 la
  // declaro «NO PROCEDE» con un motivo mejor que el mio. «Nace verde porque las seis se
  // resolvieron aqui... copiar el criterio habria anadido UNA FILA QUE MANTENER Y QUE NO
  // PROTEGE». Una fila derivada no es automaticamente correcta: si ningun trabajo historico
  // falla la regla, la fila no defiende a nadie y solo puede quedarse obsoleta.
  'SUITE-R38': [7, 7, 0],         // 976b8bec
  'SUITE-R40': [5, 2, 1],         // 59726298
  'SUITE-R42': [5, 3, 0],         // 4287a350
  'SUITE-R43': [6, 0, 0],         // 781f5e7f
  'SUITE-R44': [6, 0, 1],         // c7ba859f
  'SUITE-R45': [7, 0, 0],         // 7fd7eb41
  'SUITE-R46': [7, 0, 0],         // f0de9489
  'LEX-R33': [13, 1, 0],          // PT-137 · la puerta de vuelta de un aplazado
  'LEX-R34': [13, 1, 0],          // PT-138 · un aplazado declara cuando se revisa
  'FDGE-R19b': [13, 1, 0],        // PT-142 · el nombre de rama se contrasta con el derivado
  'SUITE-R56b': [13, 1, 0],       // PT-141 · los manejadores de error se enumeran
  'SUITE-R47': [7, 7, 0],         // 976b8bec
  'SUITE-R51': [7, 3, 0],         // 567eab2c
};

/**
 * ¿Rige `id` sobre una tarea escrita bajo `suiteDelPT`?
 *
 * Sin fila en la tabla, rige SIEMPRE: el defecto de partida era eximir de más —una regla que no
 * se aplica a nadie no protege— y una regla sin versión declarada es casi siempre una que existió
 * desde el principio. El caso contrario lo caza `reglasSinVersion`.
 */
export const rigeDesde = (id, suiteDelPT) => {
  const d = RIGE_DESDE[id];
  if (!d) return true;
  const v = String(suiteDelPT ?? '0.0.0').split('.').map((n) => Number(n) || 0);
  if (v[0] !== d[0]) return v[0] > d[0];
  if (v[1] !== d[1]) return v[1] > d[1];
  return v[2] >= d[2];
};

/**
 * PT-081 · `AC-08` · Las reglas HARD **nuevas** que no declaran desde cuándo rigen.
 *
 * Sin esto, esta tarea arregla tres casos y deja el mecanismo intacto para el cuarto — que es
 * literalmente lo que PT-075 documentó.
 *
 * «Nueva» es **no existía en la versión anterior**, no «no aparece en el CHANGELOG». Probé el
 * segundo criterio y devolvió 69: casi todas son reglas fundacionales anteriores al propio
 * CHANGELOG, y una lista con 69 falsos positivos es una lista que nadie mira. La comparación
 * contra el texto anterior de `RULES.md` da exactamente las que entran en esta versión.
 *
 * `idsAntes` son los identificadores de la versión previa, derivados con `reglasDelMarco` sobre
 * un lector de esa versión —`git show <ref>:docs/methodology/<doc>`—. **Los TRES documentos**: mi
 * primera versión sólo leía `RULES.md` de antes contra los tres de ahora, y las 26 `LEX-*` y las
 * 14 `EXEC-*` salían como nuevas todas. Comparar mitades distintas del mismo universo produce
 * exactamente el ruido que este detector existe para evitar.
 *
 * Si no se puede leer la versión previa se devuelve `null`: sin saber qué había antes no se sabe
 * qué es nuevo, y suponer que todo lo es da la misma lista inútil (`RULE-06`).
 */
export function reglasNuevasSinVersion(reglas, idsAntes) {
  if (idsAntes == null) return null;
  const previas = new Set(idsAntes);
  if (!previas.size) return null;
  return (reglas ?? [])
    .filter((r) => r.sev === 'HARD')
    .filter((r) => !previas.has(r.id))
    .filter((r) => !RIGE_DESDE[r.id])
    .map((r) => r.id);
}

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
/**
 * PT-129 · Las ramas que EXISTEN, contrastadas con la topologia que FDGE-R19 declara.
 *
 * verify-fdge comprobaba `allocations[].branch` —EL CAMPO QUE LA ALLOCATION DECLARA— y jamas
 * preguntaba al arbol que ramas hay. Con eso una rama puede sobrevivir a su tarea integrada, o
 * existir sin ninguna, sin que nada lo note: es donde se esconde el trabajo sin allocation que
 * persigue PT-127. El proxy en lugar del hecho, decima instancia.
 *
 * CUATRO TIPOS, no tres. La enumeracion de la regla decia tres y `tracker proyectar` lleva
 * creando `cauce/<usuario>` desde PT-054, declarada en LEXICON §6.5.
 *
 * QUE ESTABLECE: que cada rama encaja en un tipo declarado, y que ninguna efimera sobrevive a su
 *   tarea terminal.
 * QUE NO ESTABLECE: que la topologia declarada sea la correcta. Si lo declarado esta mal, esto
 *   sale verde.
 *
 * NUNCA BORRA (SUITE-R06f): nombra y describe el comando (EXEC-R07).
 *
 * @param ramas       string[]   las que existen, locales y remotas, sin prefijo
 * @param allocations las del registro
 * @param defecto     nombre de la rama por defecto · @param integracion la de integracion
 */
export function topologiaDeRamas(ramas, allocations, defecto = 'main', integracion = 'trabajo') {
  if (ramas == null) return null;                    // sin acceso: SIN EVALUAR (RULE-06)
  const porId = new Map((allocations ?? []).map((a) => [a?.id, a]));
  const sobrantes = [];
  const huerfanas = [];
  for (const r of ramas) {
    if (r === defecto || r === integracion) continue;            // por defecto · integracion
    if (/^cauce\/[^/]+$/.test(r)) continue;                      // derivada · LEXICON §6.5
    const id = r.match(/\/((?:PT|EP)-\d+)-/)?.[1] ?? r.match(/\/((?:PT|EP)-\d+)$/)?.[1];
    if (!id) { sobrantes.push(r); continue; }                    // no encaja en ningun tipo
    const a = porId.get(id);
    if (!a) { sobrantes.push(r); continue; }                     // cita un ID que no existe
    if (ESTADOS_TERMINALES.has(String(a.status))) huerfanas.push({ rama: r, id, estado: a.status });
  }
  return { sobrantes, huerfanas };
}

export function ramaDeTarea(tipo, id, slug, usuario = null) {
  // PT-129 · sin «type» NO hay nombre de rama. Antes devolvia «chore/...» con la misma cara que
  // devolveria un tipo real: un dato INVENTADO donde RULE-06 pide un «no lo se». Tiene caso hoy
  // —PT-125 y PT-126 estan sin «type» por el defecto de PT-124— y la respuesta era un nombre que
  // nadie habia decidido.
  if (!tipo) return null;
  const t = String(tipo).toLowerCase();
  const u = usuario ? normalizaRef(usuario) : null;
  const cola = `${id}-${slug}`;
  return u ? `${t}/${u}/${cola}` : `${t}/${cola}`;
}

/**
 * PT-153 · LA RAMA DE UN LOTE, DERIVADA.
 *
 * `ramaDeTarea` empieza por `type`, y LEX-R27 dice que un lote NO lleva `type`: se reconoce por su
 * identificador. Las dos cosas son correctas por separado y juntas daban `null` — no habia forma
 * derivable para la rama de un lote, asi que se inventaba una:
 *
 *   chore/alberto-martinez/EP-022-cierre
 *           tipo inventado         slug inventado — el suyo es «los-componentes-se-declaran»
 *
 * El prefijo es SIEMPRE `chore`: en esa rama se cierra el lote, no se construye el producto. El
 * resto sale del registro, que es el unico que asigna (SUITE-R08). Declarada en LEXICON 6.
 *
 * Devuelve `null` para lo que no es un lote: fuera de su objeto no inventa nada (RULE-06).
 */
export function ramaDeLote(id, slug, usuario = null) {
  if (!/^EP-\d+$/.test(String(id ?? ''))) return null;
  if (!slug) return null;
  const u = usuario ? normalizaRef(usuario) : null;
  const cola = `${id}-${slug}`;
  return u ? `chore/${u}/${cola}` : `chore/${cola}`;
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

/**
 * PT-068 · De quien es la marca de sesion que se va a leer.
 *
 * PT-065 movio la ESCRITURA a SESSION-<persona>.json y dejo DOS lecturas apuntando al viejo
 * SESSION.json: viabilidad siempre, y sesion como respaldo. Reproducido contra el repositorio
 * real: una identidad no declarada heredaba 32 commits y 13 194 lineas ajenas, ETIQUETADAS
 * MEDIDO — no una estimacion optimista, sino un dato con autoridad de medida sobre trabajo
 * de otra persona.
 *
 * El respaldo NO se quita: AC-05 de PT-065 exige que un proyecto de UNA sola persona no cambie,
 * y los anteriores a la 8.3.0 solo tienen SESSION.json, sin campo «persona». Lo que faltaba no
 * era quitar el respaldo: era distinguir de QUIEN es.
 *
 *   sin archivo propio + SESSION.json SIN persona     -> mia (proyecto de una sola persona)
 *   sin archivo propio + SESSION.json de OTRA persona -> null, y se DICE
 *   con archivo propio                                -> mia
 *
 * «null» no es un fallo: sesionDe(null) ya responde «no se abrio una sesion» desde PT-060, con
 * sus casos. Aqui solo se llega a esa rama cuando corresponde.
 */
export function marcaDe(persona, leer) {
  // Sin persona NO hay archivo propio. archivoSesion(null) devuelve «SESSION.json», asi que
  // preguntarlo aqui haria que una identidad no declarada leyera el huerfano COMO SI FUERA
  // SUYO — que es exactamente el defecto. Lo dijo la ejecucion: personaLocal() devuelve null
  // para quien no esta declarado, y la primera version de esta funcion seguia heredando 33
  // commits ajenos.
  const propia = persona ? leer(archivoSesion(persona)) : null;
  if (propia) return propia;
  const vieja = leer('SESSION.json');
  if (!vieja) return null;
  if (!vieja.persona) return vieja;
  return persona && normalizaRef(vieja.persona) === normalizaRef(persona) ? vieja : null;
}

/**
 * PT-068 · Una persona, UNA sesion. Con SESSION.json declarando a Alberto y
 * SESSION-alberto-martinez.json tambien, Alberto salia DOS veces en «Otras sesiones abiertas»:
 * una sesion fantasma, que es justo lo que el HANDOFF avisa de no crear.
 *
 * Gana la marca del archivo PROPIO —marcada con «__propia»—, que es el que se escribe.
 */
export function sesionesUnicas(marcas) {
  const porPersona = new Map();
  for (const m of marcas ?? []) {
    if (!m) continue;
    const k = normalizaRef(m.persona ?? '');
    if (!porPersona.has(k) || m.__propia) porPersona.set(k, m);
  }
  return [...porPersona.values()];
}


/**
 * PT-101 · EL ESCAPE QUE NO EXISTE NO SE ROMPE.
 *
 * Lo señalo el firmante tras OCHO roturas en una sola sesion. Y el marco YA LO SABIA: llevaba la
 * cuenta en comentarios de CINCO archivos, cada uno con su cifra, y NINGUNO sumaba.
 *
 *   build-core.mjs:463      «ha fallado CINCO veces aqui»
 *   revisar-secretos.mjs:36 «ha fallado SIETE veces en este proyecto»
 *   verify-ptsa.mjs:108     «ha fallado CINCO veces en este proyecto»
 *   verify-qa.mjs:63        «ha fallado SEIS veces en este proyecto»
 *   verify-suite.mjs:526    «ha fallado CUATRO veces en este»
 *
 * Cinco cuentas del MISMO hecho, ninguna correcta. Es SUITE-R38 aplicado a una cifra, y estaba
 * ocurriendo DENTRO de los comentarios que avisan de otro defecto.
 *
 * Aqui vive la cuenta. Los cinco comentarios la CITAN en vez de llevar cada uno la suya.
 *
 * LA REGLA, que es lo unico que ha funcionado: EL ESCAPE QUE NO EXISTE NO SE ROMPE.
 *   · regex LITERALES, nunca `new RegExp` sobre una cadena
 *   · `String.fromCharCode(10)` en vez de un salto escapado
 *   · texto largo por un archivo, no por la linea de comandos
 *
 * Y `audit` caza el byte 0x08 CUANDO YA ESTA ESCRITO: util, y POSTERIOR al daño.
 */
export const ROTURAS_DE_ESCAPADO = {
  contadas: 29,
  donde: ['build-core.mjs', 'revisar-secretos.mjs', 'verify-ptsa.mjs', 'verify-qa.mjs',
          'verify-suite.mjs', 'verify-patrones.mjs'],
  nota: 'La suma de las cinco cuentas dispersas (5+7+5+6+4), mas las OCHO de la sesion de EP-019 '
      + 'que ninguna cazo: rompieron en la VIA —heredocs, replace de python, plantillas de texto '
      + 'transformadas— y no en el destino. El marco protegia el archivo y no el camino. '
      + 'EP-022 anadio DOS mas, las dos escribiendo verificadores: PT-148 dejo un \b degradado a '
      + 'byte 0x08 dentro del barrido de SUITE-R60 —COMPILABA Y NO CAZABA NADA, en verde, y solo '
      + 'salio mirando los bytes— y PT-156 partio verify-patrones.mjs con un /\r?\n/ que perdio '
      + 'sus escapes al escribirse. La segunda es MEJOR que la primera: reventar el arranque se ve, '
      + 'y un regex que compila sin casar nada no. Las dos se arreglaron IGUAL, quitando el regex.',
};


/**
 * PT-101 · SUITE-R59 · EL NORMALIZADOR. Lo que hace innecesario escribir un escape.
 *
 * La regla dice qué no hacer. Esto da con qué hacerlo, que es lo que faltaba: durante veintisiete
 * roturas el marco tenía el aviso y **no tenía la alternativa**, así que cada arreglo era de uno
 * en uno y el siguiente caso volvía a escribirlo a mano.
 *
 * Ninguna de estas funciones lleva una barra invertida dentro de una cadena. Esa es la única
 * propiedad que importa: lo que no está escrito no se puede perder al pasar por una capa de
 * escapado —un shell, un heredoc, un `replace`, una plantilla transformada—.
 */

/** Los caracteres que se escriben por código, nunca escapados. */
export const CAR = {
  SALTO: String.fromCharCode(10),
  RETORNO: String.fromCharCode(13),
  TAB: String.fromCharCode(9),
  BARRA: String.fromCharCode(92),
  COMILLA: String.fromCharCode(39),
  BACKTICK: String.fromCharCode(96),
  // Los dos separadores de registro de ASCII. Se usan para leer «git log»: no aparecen en
  // ningun asunto ni en ninguna ruta, asi que separan sin poder confundirse con el contenido.
  SEPARADOR: String.fromCharCode(30),
  UNIDAD: String.fromCharCode(31),
};

/** Las clases de un regex, como texto, sin escribir la barra. */
export const CLASE = {
  espacio: CAR.BARRA + 's',
  noEspacio: CAR.BARRA + 'S',
  digito: CAR.BARRA + 'd',
  noDigito: CAR.BARRA + 'D',
  palabra: CAR.BARRA + 'w',
  noPalabra: CAR.BARRA + 'W',
  limite: CAR.BARRA + 'b',
  salto: CAR.BARRA + 'n',
};

/**
 * Escapa un texto para meterlo LITERAL dentro de un regex.
 *
 * Es lo que casi siempre se quiere cuando se construye un patrón desde una variable: buscar ese
 * texto, no interpretarlo. Escribirlo a mano es donde nacieron la mayoría de las veintisiete.
 */
export function comoLiteral(texto) {
  let salida = '';
  const ESPECIALES = '.*+?^${}()|[]' + CAR.BARRA;
  for (const c of String(texto ?? '')) {
    salida += ESPECIALES.includes(c) ? CAR.BARRA + c : c;
  }
  return salida;
}

/**
 * Un regex que busca `texto` como palabra suelta.
 *
 * Sustituye a `new RegExp('\\b' + x + '\\b')`, que es la construcción que más veces se ha roto
 * en este repositorio: con la barra simple compila a la LETRA `b` y no casa nunca.
 */
export function comoPalabra(texto, banderas) {
  return new RegExp(CLASE.limite + comoLiteral(texto) + CLASE.limite, banderas ?? '');
}

/** Divide por líneas sin depender de cómo se escribieron los saltos. */
export function porLineas(texto) {
  return String(texto ?? '').split(new RegExp(CAR.BARRA + 'r?' + CAR.BARRA + 'n'));
}

/** Une líneas con un salto real. */
export function enLineas(lineas) {
  return (lineas ?? []).join(CAR.SALTO);
}


/**
 * PT-127 · EP-020 · Nada detecta el trabajo sin allocation.
 *
 * Lo pidio el firmante con una frase que se describe a si misma:
 *
 *   «lo empezaras a arreglar, ese arreglo te vas a saltar el marco de trabajo, entonces debes
 *    abrir el pt con el bug para poder hacer la correccion necesaria (SI NO TE LO DIGO, NO LO
 *    HARIAS) y esto es algo que se debe evitar»
 *
 * El parentesis es el defecto entero: lo que solo ocurre cuando una persona lo dice, no ocurre.
 *
 * Y hay una medicion que lo prueba: los commits del cierre de EP-019 citan «EP-019», que para
 * entonces estaba CLOSED, con formato «fix: EP-019» en vez de «fix: PT-NNN». FDGE-R19 exige un
 * PT y ningun verificador miraba el prefijo. Diez commits, ningun rojo.
 *
 * PURA a proposito: recibe los commits ya leidos y el registro. Un caso puede ejercerla sin git
 * y sin disco, que es lo que hace que el caso exista (PT-048, PT-097, PT-101).
 */

/** Las rutas que el marco gobierna: tocarlas es trabajo, y el trabajo necesita allocation. */
export const RUTAS_GOBERNADAS = ['docs/methodology/', 'docs/implementation/', 'changes/', 'bin/'];

/**
 * Los SEIS tipos que FDGE-R19 declara para un commit. La regla es su propietaria; aqui viven una
 * sola vez para que ningun verificador los reescriba (SUITE-R38).
 *
 * «merge» NO esta, y «revert» tampoco: anadirlos seria legislar desde una herramienta lo que la
 * regla no dice. Un merge se reconoce por su FORMA —dos padres— y no por un tipo inventado.
 */
export const TIPOS_DE_COMMIT = ['feat', 'fix', 'refactor', 'test', 'docs', 'chore'];

const RE_SUJETO = new RegExp(
  '^(' + TIPOS_DE_COMMIT.join('|') + ')' + CLASE.espacio + '*:' + CLASE.espacio + '*'
  + '(?:([A-Z]+)-(' + CLASE.digito + '+))?');

/**
 * Clasifica UN commit. Devuelve `null` si no toca ninguna ruta gobernada — un commit que no
 * toca lo que el marco gobierna no necesita allocation, y exigirsela seria ruido.
 *
 * `vivoEn` decide si el ID estaba vivo: se inyecta para que el caso pueda decidirlo sin registro.
 */
export function commitSinAllocation(commit, vivoEn) {
  // Un merge no es trabajo: es integracion, y su asunto lo escribe git. Se reconoce por tener mas
  // de un padre — el dato lo da git, no lo adivina una lista de tipos.
  if (Number(commit?.padres ?? 1) > 1) return null;

  const rutas = commit?.rutas ?? [];
  if (!rutas.some((r) => RUTAS_GOBERNADAS.some((g) => String(r).startsWith(g)))) return null;

  const m = RE_SUJETO.exec(String(commit?.sujeto ?? ''));
  if (!m) {
    return { sha: commit?.sha, clase: 'SIN_FORMATO',
      dice: 'el asunto no sigue «<type>: PT-NNN» con type en '
        + `«${TIPOS_DE_COMMIT.join(' · ')}» (FDGE-R19), asi que no cita ninguna allocation` };
  }
  const pfx = m[2];
  const id = pfx ? `${pfx}-${String(m[3]).padStart(3, '0')}` : null;

  if (!id) {
    return { sha: commit?.sha, clase: 'SIN_ID',
      dice: 'el asunto tiene tipo pero no cita ningun identificador' };
  }
  if (pfx !== 'PT') {
    return { sha: commit?.sha, clase: 'NO_ES_PT', id,
      dice: `cita «${id}», que no es un PT. FDGE-R19 pide un PT: un lote no es la unidad de trabajo` };
  }
  const v = vivoEn ? vivoEn(id, commit) : null;
  if (v === null || v === undefined) {
    return { sha: commit?.sha, clase: 'SIN_EVALUAR', id,
      dice: `no se pudo decidir si «${id}» estaba vivo. No saber no es permiso (RULE-06)` };
  }
  if (v === false) {
    return { sha: commit?.sha, clase: 'NO_VIVO', id,
      dice: `cita «${id}», que no estaba vivo en ese commit: el trabajo se hizo sin allocation abierta` };
  }
  return null;
}

/**
 * Separa las dos cosas que el ledger distingue y que NO son lo mismo (AC-04):
 *
 *   ELEGIDO   el agente rodeo el marco pudiendo no hacerlo
 *   FORZADO   el marco OBLIGO a rodearlo porque la herramienta no podia cumplirlo
 *
 * La diferencia no se infiere: se DECLARA, y una declaracion tiene DOS partes que van JUNTAS —
 * el identificador rodeado y la REGLA que se exceptua— dentro de UNA MISMA entrada del ledger.
 *
 * La primera version buscaba el identificador y la palabra «excepcion» en el ledger ENTERO. Con
 * eso, treinta y cuatro commits salian FORZADO porque el documento menciona «EP-019» en un sitio
 * y «excepcion» en otro, sin ninguna relacion entre ambos. Un motivo plausible y falso es peor
 * que no clasificar: RULE-06 lo prohibe, y aqui ademas repartia la culpa al reves.
 */
export function clasificaRodeo(hallazgo, textoDelLedger, regla = 'FDGE-R19') {
  const id = hallazgo?.id;
  if (!id) return { ...hallazgo, motivo: 'ELEGIDO' };
  // Se trocea por el ENCABEZADO de entrada. La primera version troceaba por «\b(?=## )» y no
  // troceaba nada —un limite de palabra no cae entre un salto y una almohadilla, que son las
  // dos no-palabra—: 226 entradas salian como UNA, y «la misma entrada» volvia a ser el
  // documento entero. La comprobacion de la comprobacion es lo que lo vio.
  const entradas = String(textoDelLedger ?? '').split(CAR.SALTO + '## ');
  const declarada = entradas.some((e) => e.includes(id) && e.includes(regla)
    && /[Ee]xcepci[oó]n/.test(e));
  return { ...hallazgo, motivo: declarada ? 'FORZADO' : 'ELEGIDO' };
}

/**
 * PT-198 · EL CAMPO DEL FRONTMATTER SE LEE POR UN SOLO SITIO.
 *
 * `[^\S\r\n]` es espacio horizontal: espacio o tabulador, NUNCA el salto. Escrito como `\s` se
 * tragaria la linea siguiente y el valor seria el campo de abajo.
 *
 * Los grupos: 1 = el valor, 2 = la cola —el comentario tal cual, si lo hay—. La cola SE CONSERVA
 * al escribir: un `phase: 5  # a medias` reescrito como `phase: 6` a secas destruiria informacion
 * que alguien puso a proposito, y eso seria cambiar un defecto por otro.
 */
/**
 * PT-206 · La clase se lee HASTA EL IDENTIFICADOR, y lo que venga detras es descripcion.
 *
 * Anclar a fin de linea confundia «declarada» con «declarada de una forma concreta», y la forma
 * concreta era la MINORITARIA. Lo que la regla quiere saber es si hay clase — no como se escribio.
 */
const RE_CLASE_EVENTO = /^Clase de evento:[^\S\r\n]*(CE-\d{3})\b/im;

/** La clase declarada por una entrada, o null. Un solo sitio (SUITE-R38). */
export function claseDeEvento(texto) {
  return RE_CLASE_EVENTO.exec(String(texto ?? ''))?.[1] ?? null;
}

const RE_CAMPO_INTAKE = /^([A-Za-z_][\w-]*):[^\S\r\n]*([^\s#][^\r\n#]*?)[^\S\r\n]*(#[^\r\n]*)?$/;

/**
 * Lee un campo escalar del frontmatter. Devuelve `null` si NO ESTA, y `{ valor: null }` si esta
 * y no se pudo leer — que son dos hechos distintos con arreglos distintos (RULE-02, PT-093).
 *
 * `linea` es 1-indexada y va en el mensaje: distinguir sin localizar obliga a buscar, y buscar es
 * donde se vuelve a suponer (RULE-06).
 */
export function campoDeIntake(txt, campo) {
  const lineas = porLineas(String(txt ?? ''));
  for (let i = 0; i < lineas.length; i += 1) {
    const l = lineas[i];
    if (!l.startsWith(`${campo}:`)) continue;        // ancla al inicio: «statuses:» no cuenta
    if (l[campo.length] !== ':') continue;
    const m = RE_CAMPO_INTAKE.exec(l);
    if (!m || m[1] !== campo) return { valor: null, linea: i + 1, comentario: null, cruda: l };
    return { valor: m[2], linea: i + 1, comentario: m[3] ?? null, cruda: l };
  }
  return null;                                        // no esta: es OTRO hecho, no un fallo de lectura
}

/**
 * Escribe el campo CONSERVANDO su comentario. Devuelve `null` si el campo no esta, y lanza si
 * esta y no se puede leer: quien llama distingue los tres estados por el valor de retorno.
 */
export function reemplazaCampoDeIntake(txt, campo, valor) {
  const hallado = campoDeIntake(txt, campo);
  if (!hallado) return null;
  const cola = hallado.comentario ? `   ${hallado.comentario}` : '';
  const lineas = porLineas(String(txt ?? ''));
  lineas[hallado.linea - 1] = `${campo}: ${valor}${cola}`;
  return enLineas(lineas);
}

// PT-155 · LOS SIETE PATRONES QUE VIVIAN FUERA DEL CONTRATO, AHORA ANTES DE EL.
// SUITE-R38 pide que un patron critico viaje CON SU CONTRATO, y estos siete estaban sueltos: sin
// `para`, sin `casa`, sin `noCasa`, y por tanto sin nada que cazara un escape degradado. Se
// declaran aqui arriba porque PATRONES los referencia, y se prueban abajo como los demas.
const RE_FILA_SELLO = /^\|\s*`?([\w.\-/]+)`?\s*\|\s*(ACTUALIZADO|NO PROCEDE)\s*\|\s*(.*?)\s*\|/gim;
const RE_LINEAS = /\r?\n/;
const RE_DEF_TABLA = /^\|\s*`([A-Z]+-R\d+[a-z]?)`\s*\|\s*(?:HARD|SOFT|CHECK)\s*\|/;
const RE_DEF_PROSA = /^`([A-Z]+-R\d+[a-z]?)`\s*·/;
const RE_NO_VERIFICABLE = /^\|\s*`?([A-Z]+-R\d+[a-z]?)`?\s*\|\s*(.+?)\s*\|/gim;
const RE_ANUNCIA = /G4|VoBo|autorizad/i;
const RE_ESPERA = /a la espera de|pendiente de|esperando|queda para|sin resolver/i;

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

  // PT-102 · la version se DECLARA de dos formas y version.mjs conocia una. Terminaba diciendo
  // «Todo declara 11.0.0» con CUATRO documentos declarando otra —el CLAUDE.md del propio
  // repositorio, la plantilla que VIAJA a cada proyecto destino, el README y el MANUAL—, porque
  // la forma que no miraba vivia fuera de aqui, en un regex local suyo. El grafo lo enseño antes
  // que el grep: era la herramienta que MENOS dependia de este archivo. Un patron critico que no
  // esta donde se contrasta no puede completarse (SUITE-R38).
  //
  // Anclado a inicio de linea A PROPOSITO: el CHANGELOG cita cifras viejas en mitad de una frase
  // y esas son HISTORIA (SUITE-R09). Y el grupo de captura exige tres numeros, que es lo que deja
  // fuera el marcador «X.Y.Z» de una plantilla sin personalizar — correcto tal como esta.
  VERSION_DECLARADA: {
    re: /^([>\s]*(?:Suite version:\s*\*\*|suite_version:\s*))(\d+\.\d+\.\d+)(\*\*)?/gm,
    para: 'toda declaracion de la version de la suite, en sus dos formas (SUITE-R40)',
    casa: [
      'Suite version: **11.0.0**',
      'suite_version: 11.0.0',
      '> Suite version: **5.2.0** \u00b7 Referencia: `docs/methodology/`',
    ],
    noCasa: [
      'suite_version: X.Y.Z',                      // la plantilla sin personalizar: correcta asi
      'y una tarea con suite_version: 8.2.0 no',   // una cifra citada en prosa: es historia
      'Suite version: **5.2**',                    // sin parche: no es una version de la suite
    ],
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

  // PT-155 · LOS SIETE QUE VIVIAN FUERA DEL CONTRATO.
  //
  // SUITE-R38 dice que un patron critico vive en UN SOLO SITIO y VIAJA CON SU CONTRATO. Habia
  // SIETE regex de primer nivel en este mismo archivo, sin `para`, sin `casa` y sin `noCasa`: la
  // prueba no los tocaba, y un escape que se degradara en ellos NO LO CAZABA NADIE.
  //
  // No es teorico. SUITE-R59 lleva DOCE roturas medidas en este repositorio, y las que se
  // encontraron fueron las que estaban EN PATRONES —viajan con sus ejemplos—; las de fuera
  // salieron por casualidad, mirando bytes con cat -A o viendo reventar el arranque.
  //
  // Los siete no eran «menos criticos»: eran menos visibles. Tres los escribi HOY, en PT-163 y
  // PT-149, y de haber degradado habrian dado verde sin casar nada.
  DEF_EN_TABLA: {
    re: RE_DEF_TABLA,
    para: 'una regla DEFINIDA como fila de RULES.md (PT-163)',
    casa: ['| `SUITE-R60` | CHECK | Un componente se declara.'],
    noCasa: ['| `SUITE-R60` | lo cita sin severidad |', 'Menciona `SUITE-R60` en prosa'],
  },
  DEF_EN_PROSA: {
    re: RE_DEF_PROSA,
    para: 'una regla DEFINIDA en prosa, como LEXICON y EXECUTION-MODES (PT-163)',
    casa: ['`LEX-R35` · Un componente se declara en el contrato.'],
    noCasa: ['Lo dice `LEX-R35` mas arriba', '| `LEX-R35` | H | tabla |'],
  },
  FILA_DE_SELLO: {
    re: RE_FILA_SELLO,
    para: 'una fila de SELLO.md: que se actualizo y que no procede',
    casa: ['| `CORE.md` | ACTUALIZADO | regenerado |', '| inventory | NO PROCEDE | sin cambios |'],
    noCasa: ['| `CORE.md` | PENDIENTE | a medias |'],
  },
  FILA_NO_VERIFICABLE: {
    re: RE_NO_VERIFICABLE,
    para: 'una regla declarada NO VERIFICABLE, con su motivo (SUITE-R26)',
    casa: ['| `SUITE-R01` | ninguna maquina lo comprueba |'],
    noCasa: ['| SUITE-R01 sin comillas ni motivo'],
  },
  ANUNCIA_AUTORIZACION: {
    re: RE_ANUNCIA,
    para: 'un encabezado de SESSION_LOG que anuncia una autorizacion (EXEC-R04)',
    casa: ['G4 de EP-022 autorizada', 'VoBo del firmante', 'Merge autorizado'],
    // PT-170 · «Autorizacion» NO casa: le falta la «d». Un encabezado real fue rechazado por eso
    // y el merge salio como NO autorizado teniendolo todo escrito. Queda como caso negativo
    // hasta que PT-170 decida si la constancia se reconoce por su FORMA en vez de su titulo.
    noCasa: ['Autorizacion expresa de excepcion', 'Nota sobre el cierre'],
  },
  ESPERA_NO_AUTORIZA: {
    re: RE_ESPERA,
    para: 'un encabezado que ANUNCIA LO CONTRARIO de una autorizacion (PT-095)',
    casa: ['a la espera de G4', 'pendiente de firma', 'queda para el cierre'],
    noCasa: ['G4 resuelta', 'autorizado por el firmante'],
  },
  SALTO_DE_LINEA: {
    re: RE_LINEAS,
    para: 'partir un texto en lineas sin depender de Windows o Unix',
    casa: ['a\nb', 'a\r\nb'],
    noCasa: ['ab'],
  },

  // PT-198 · UN CAMPO ESCALAR DEL FRONTMATTER, CON SU COMENTARIO SI LO LLEVA.
  //
  // Habia SIETE expresiones a mano en tracker.mjs —type:3105, phase:3754, status:3757/4594/4859,
  // epic:5158/5209— y las siete anclaban a FIN DE LINEA. Un comentario `#`, que es YAML valido,
  // las rompia: el status de EP-023 decia «READY   # G1 CHALLENGE aceptado» y el tracker
  // respondia «no declara status». No es que no supiera leerlo: AFIRMABA QUE NO ESTABA.
  //
  // El patron vive aqui porque aqui lo vigila verify-patrones. Un patron critico en el consumidor
  // no lo mira nadie, y por eso hubo siete copias (SUITE-R38).
  // PT-206 · LA CLASE DE EVENTO DE UNA ENTRADA, CON LO QUE VENGA DETRAS.
  //
  // LEX-R31 la leia con /^Clase de evento:\s*(CE-\d{3})\s*$/im — anclada a FIN DE LINEA— y la
  // convencion MAYORITARIA del propio HISTORY.log escribe «CE-NNN — descripcion». Medido:
  //
  //     entradas que DECLARAN una clase :  71
  //     que LEX-R31 llegaba a ver       :  17
  //     invisibles para la regla        :  54   (76 %)
  //
  // TRES DE CADA CUATRO ENTRADAS QUE CUMPLEN LA REGLA SALIAN COMO INCUMPLIENDOLA. Es el defecto
  // que PT-198 cerro en tracker.mjs, en otra herramienta — y PT-198 no lo cazo porque midio UN
  // ARCHIVO: su discovery declaro «ningun otro .mjs los tiene», cierto para status/phase/type/epic
  // y falso para la familia entera. CE-005 en la tarea que cerraba CE-005.
  //
  // NO se unifica con eventos.mjs, y se dice porque yo mismo lo afirme antes de comprobarlo:
  // eventos NO lee esta linea — clasifica por FRASES DEL CUERPO (eventos.mjs:40-47)—. Son dos
  // hechos distintos: eventos DEDUCE la clase de lo que la entrada cuenta; LEX-R31 comprueba que
  // la entrada la DECLARE. Fundirlas seria inventar un SUITE-R38 que no existe, y eso es peor que
  // el defecto.
  CLASE_DE_EVENTO: {
    re: RE_CLASE_EVENTO,
    para: 'la clase de evento de una entrada de HISTORY, con su descripcion si la lleva (PT-206)',
    casa: ['Clase de evento: CE-005', 'Clase de evento: CE-005 — verde por no haber mirado',
      'clase de evento:  CE-011  · lo que sea'],
    noCasa: ['Clase de evento: CE-5', 'Clase de evento:', 'Clase de evento: ninguna'],
  },
  CAMPO_DE_INTAKE: {
    re: RE_CAMPO_INTAKE,
    para: 'un campo escalar del frontmatter de un intake, con su comentario en linea (PT-198)',
    casa: ['status: READY', 'status: READY   # G1 CHALLENGE aceptado', 'phase: 5\t# a medias'],
    // «statuses: READY» NO esta aqui: el patron casa CUALQUIER campo y no sabe cual se pide —
    // eso lo discrimina `campoDeIntake` comparando el grupo 1. Ponerlo en noCasa afirmaria del
    // patron algo que no hace, y verify-patrones lo caza (asi salio este comentario).
    noCasa: ['status:', '  status: READY', '# status: READY'],
  },
};

/**
 * PT-067 · SUITE-R38 · El universo de reglas del marco, derivado UNA vez.
 *
 * `audit` lo derivaba con un regex propio que solo leia filas de `RULES.md`: 183 de las 223 que
 * el marco define, fuera las 26 `LEX-*` y las 14 `EXEC-*` —entre ellas `EXEC-R04`, merge humano
 * en los tres modos, y `EXEC-R07`, describir el comando en vez de ejecutarlo—. `LEX-R21` dice
 * que los documentos propietarios son TRES.
 *
 * Es el gemelo de `PT-066`: aquel arreglo a quien CONSULTA una regla, este a quien las CUENTA.
 * Por eso vive aqui y no en `audit`: una tercera derivacion del mismo hecho es como se llego a
 * que `PT-066` arreglara `regla.mjs` y esta se quedara como estaba.
 *
 * Las DOS formas son las de `PT-066`, no unas nuevas: `RULES.md` usa filas de tabla; `LEXICON`
 * y `EXECUTION-MODES` usan prosa, porque lo que definen son nombres y compuertas.
 *
 * `leer(nombre)` devuelve el texto del documento, o algo vacio si no se puede. Sin `fs`: el
 * arnes la prueba sin tocar el disco.
 */
export function reglasDelMarco(leer) {
  const reglas = new Map();
  // El primero gana, y el primero es RULES.md: es el documento propietario (LEX-R22). Hoy hay
  // tres IDs definidos dos veces —FDGE-R22, R40 y R41, ver PT-080— y esto NO lo arregla: lo
  // hace determinista. Contar 226 por una duplicidad seria medir mal el arreglo.
  const meter = (id, sev, doc) => { if (!reglas.has(id)) reglas.set(id, { id, sev, doc }); };
  for (const l of String(leer('RULES.md') ?? '').split(/\r?\n/)) {
    const m = /^\|\s*`([A-Z]+-R\d+[a-z]?)`\s*\|\s*(HARD|SOFT|CHECK)\s*\|/.exec(l);
    if (m) meter(m[1], m[2], 'RULES.md');
  }
  // El prefijo NO filtra. Aceptar solo `LEX-` y `EXEC-` habria ocultado las tres duplicadas, y
  // esconder un defecto para que salga un numero redondo es lo contrario de esta tarea.
  for (const doc of ['LEXICON.md', 'EXECUTION-MODES.md']) {
    for (const l of String(leer(doc) ?? '').split(/\r?\n/)) {
      const m = /^`([A-Z]+-R\d+[a-z]?)`\s*·/.exec(l);
      if (m) meter(m[1], 'HARD', doc);
    }
  }
  return [...reglas.values()];
}

/**
 * PT-067 · Qué herramientas verifican de verdad una regla.
 *
 * `t.includes(id)` daba por verificada cualquier regla cuyo ID apareciera en un COMENTARIO: 20
 * asi, incluida `FDGE-R17`, que `PT-079` acababa de declarar NO comprobable en `TD-16`.
 * Publicar como verificada una regla que sabemos que no lo esta es la peor forma del error: no
 * falla, miente con formato de respuesta correcta.
 *
 * Dos exclusiones, cada una con su motivo:
 *   · `selftest.sh` — el arnes prueba las herramientas; no lo ejecuta ninguna compuerta. Son 5,
 *     y `SUITE-R41` —cauce se instala sobre si mismo— es una de ellas.
 *   · las lineas de comentario — el ID explicando por que se hizo algo no comprueba nada.
 *
 * Lo que NO distingue: una cita dentro de una condicion que puede fallar de una que no. Eso es
 * analisis estatico de verdad, y `SUITE-R26` dice que esta metrica aspira, no exige: una medida
 * honesta y simple vale mas que una sofisticada que nadie audita. Queda declarado en TD.
 *
 * `herramientas` es una lista de pares `[nombre, texto]`.
 */
export function verificadoresDe(id, herramientas) {
  const esComentario = (l) => /^\s*(\/\/|\*|\/\*|#|<!--)/.test(l);
  return (herramientas ?? [])
    .filter(([nombre]) => nombre !== 'selftest.sh')
    .filter(([, txt]) => String(txt ?? '').split(/\r?\n/)
      .some((l) => l.includes(id) && !esComentario(l)))
    .map(([nombre]) => nombre);
}

// ── PT-085 · el sello de version ────────────────────────────────────────────
//
// Cinco defectos con una raiz comun: el marco REGISTRA lo que pasa y no comprueba que lo
// registrado siga siendo cierto. Dos de ellos —SUITE-R34 y FDGE-R43— son literalmente el mismo
// error: verificar un PROXY barato en lugar del hecho, y los dos gobiernan compuertas.

/**
 * PT-085 · `A` · Lo que el bloque ESTADO afirma y el registro DESMIENTE.
 *
 * SUITE-R34 comparaba las marcas de COMMIT de HANDOFF.md y de changes/: un handoff obsoleto pero
 * recien tocado pasaba. Y no es teorico — durante EP-017 el bloque decia «EP-016 CERRADA · lo
 * siguiente es EP-017, PROPUESTA y no abierta» con EP-017 llevando nueve tareas integradas.
 *
 * EL CRITERIO ES LA CONTRADICCION, NO LA OMISION. Se falla cuando el texto AFIRMA algo que el
 * registro desmiente, no cuando calla. Exigir exhaustividad convertiria el bloque en un volcado
 * del registro —dos fuentes del mismo hecho, SUITE-R38— y el handoff existe justo para lo que el
 * registro NO puede decir: «decisiones» y «no hacer».
 *
 * Y tiene que poder pasar: una comprobacion que siempre bloquea se termina desactivando.
 */
export function contradiceElRegistro(bloque, allocations) {
  const texto = String(bloque ?? '');
  const estado = new Map((allocations ?? []).map((a) => [a?.id, a?.status]));
  const linea = (pref) => (texto.split(/\r?\n/).find((l) => l.trim().startsWith(pref)) ?? '');
  const fallos = [];

  // «tarea:» — PT-130 · SE LEE EL SUJETO, NO LA LINEA ENTERA.
  //
  // La linea afirma UNA tarea en curso —el checkpoint es uno (LEX-R26)— y ese es su SUJETO: el
  // PRIMER identificador. Todo lo que viene despues es contexto: la tarea anterior, el lote, una
  // que se cerro, una que espera validacion.
  //
  // La version anterior cortaba en la primera palabra de estado terminal y juzgaba TODOS los
  // identificadores del trozo de delante. Con eso, escribir «los diez commits del cierre citaban
  // EP-019 estando CLOSED» —para REGISTRAR el defecto que PT-127 arreglaba— hacia fallar
  // SUITE-R34. La comprobacion acusaba a quien documentaba el hecho que ella vigila, que es
  // CE-017 y es la unica clase que se hace mas probable cuanto mejor se escribe el ledger.
  //
  // EL ARREGLO NO ES ESQUIVAR LA PALABRA. Anclar al sujeto quita el falso positivo sin pedirle
  // a nadie que deje de nombrar identificadores en prosa — que seria documentar la limitacion
  // en vez de quitarla.
  const lt = linea('tarea:');
  const sujeto = (lt.match(/\b(?:PT|EP)-\d{3}\b/) ?? [])[0] ?? null;
  if (sujeto) {
    const st = estado.get(sujeto);
    // Se mira si la propia linea DICE que esta cerrada: decirlo es correcto, y acusar al texto
    // que acierta seria el mismo defecto por el otro lado.
    // PT-157 · LA LISTA ESTABA ESCRITA A MANO y no era la de LEXICON: reconocia «INTEGRAD»,
    // «CERRAD», «CLOSED» y «DEFERRED», y NO «DONE», «REVERTED» ni «REJECTED». Escribir «PT-155
    // esta DONE» —el nombre canonico del estado— salia como CONTRADICCION: el bloque decia la
    // verdad y la comprobacion lo acusaba. Es CE-017, la comprobacion que acusa a quien documenta
    // el hecho, y ademas CE-008: dos listas de estados terminales con nombres distintos.
    //
    // Se deriva de ESTADOS_TERMINALES, que es la de LEXICON 5.1, y se conservan las formas en
    // prosa —«CERRAD», «INTEGRAD»— porque el bloque ESTADO se escribe para leerse, no en mayusculas.
    const terminales = [...ESTADOS_TERMINALES, 'INTEGRAD', 'CERRAD'].join('|');
    const loDeclara = new RegExp(sujeto + '[^.]{0,80}(' + terminales + ')', 'i').test(lt);
    if (ESTADOS_TERMINALES.has(st) && !loDeclara) {
      fallos.push(`«tarea:» afirma que ${sujeto} sigue en curso y el registro dice ${st}`);
    }
  }

  // «implementación:» — el lote que declare ABIERTA tiene que estarlo.
  const li = linea('implementación:') || linea('implementacion:');
  for (const m of li.matchAll(/\b(EP-\d{3})\b[^·]*?\b(ABIERTA|CERRADA)\b/gi)) {
    const st = estado.get(m[1]);
    const cerrado = ESTADOS_TERMINALES.has(st);
    if (/ABIERTA/i.test(m[2]) && cerrado) fallos.push(`«implementación:» declara ${m[1]} ABIERTA y el registro dice ${st}`);
    if (/CERRADA/i.test(m[2]) && st && !cerrado) fallos.push(`«implementación:» declara ${m[1]} CERRADA y el registro dice ${st}`);
  }
  return fallos;
}

/**
 * PT-085 · `C` · SUITE-R57 · Lo integrado que todavia no esta sellado.
 *
 * `idsEnTag` son los identificadores presentes en el ultimo tag de version. Se compara contra un
 * TAG y no contra una rama: PT-081 aprendio a golpes que una rama se mueve con cada integracion,
 * asi que un detector anclado en ella deja de detectar justo lo que acabas de integrar.
 *
 * `null` si no se pudo leer el tag: sin saber que hay sellado no se puede saber que falta, y
 * suponer que no hay nada sellado bloquearia el proyecto entero (RULE-06).
 *
 * NO CUENTA LAS TAREAS DE UN LOTE ABIERTO, y esto no es una concesion: EXEC-R03 dice que G4 es
 * la compuerta DEL LOTE y que no se multiplica por tarea, asi que la unidad de sellado es el
 * lote. Contar las tareas de un lote en curso bloquearia el lote consigo mismo — medido al
 * escribir esta funcion: 13 integradas contra un umbral de 3, y el sello de la version ES el
 * lote abierto. Un candado con la llave dentro, que es el error que esta misma tarea evita en
 * FDGE-R43 y en SUITE-R34.
 *
 * Lo que cuenta es lo que YA cerro y no se sello: ahi la deuda es real y tiene salida.
 */

/**
 * Un lote se reconoce por su IDENTIFICADOR, no por el campo «type».
 *
 * Lo escribi primero con `type === 'EP'` y no caso NINGUNO: EP-017 no tiene ese campo. El ID lo
 * asigna el registro (SUITE-R08) y siempre esta; el campo es opcional, asi que fiarse de el es
 * depender de dos fuentes del mismo hecho y quedarse con la peor (SUITE-R38).
 *
 * PT-096 · vive AQUI y se EXPORTA. Estaba escrito dentro de `sinSellar`, y `tracker.mjs`
 * respondia la misma pregunta de otra forma en OCHO sitios —`type === 'EP'`— mientras su
 * `indices()` ya usaba este predicado: dos redacciones del mismo hecho en un solo archivo.
 *
 * Lo que costo, medido: el registro guarda TRES valores para el mismo hecho —`EP` (16), ausente
 * (2), `EPIC` (1)— porque LEXICON §8.1 enumera el `type` de una TAREA y no declara ninguno para
 * un lote. Con eso, `tracker estado` perdia una tarea SIN DECIRLO: su lote no entraba en el
 * grupo de lotes, y ella declaraba `epic`, asi que tampoco era «suelta». Se contaba y no se
 * listaba.
 *
 * El hueco de LEXICON sigue abierto y es de otra tarea. Esto no lo cierra: lo rodea usando el
 * unico nombre que LEXICON SI declara.
 */
/**
 * PT-124 · Los tipos de trabajo que LEXICON §8.1 declara.
 *
 * tracker.mjs los tenia escritos a mano como ['BUG','FEATURE','CHANGE','TAREA'] y su mensaje de
 * error los ATRIBUIA a LEXICON. LEXICON nunca declaro eso.
 *
 * NO ERA UNA LISTA DESACTUALIZADA: ERA UNA LISTA DE OTRA COSA. «CHANGE» y «TAREA» no existen en
 * ningun otro sitio del codigo — son nombres de PLANTILLA de intake:
 *
 *   BUG · INVESTIGATION   ->  templates/BUG-REPORT.md
 *   FEATURE               ->  templates/FEATURE-REQUEST.md
 *   REFACTOR · CHORE      ->  templates/CHANGE-REQUEST.md
 *   una tarea de un lote  ->  templates/TAREA.md
 *
 * Alguien derivo la lista de las CUATRO plantillas y la etiqueto como los CINCO tipos. Por eso
 * se solapa en BUG y FEATURE —donde plantilla y tipo se llaman igual— y falla justo en los tres
 * donde no. El registro le da la razon a la documentacion: 30 CHORE y 2 INVESTIGATION escritos,
 * CERO CHANGE y CERO TAREA.
 *
 * Vivir aqui no basta: seria una copia, solo que UNA. verify-suite la compara con LEXICON §8.1
 * y falla si divergen — sin eso, esto se repite el dia que LEXICON cambie (PT-080).
 */
/**
 * PT-116 · FDGE-R55 · Las dos listas CERRADAS de la parada, que LEXICON §8.5 declara.
 *
 * Viven AQUI y no en tracker.mjs por lo que PT-124 acaba de medir: una lista escrita a mano en el
 * consumidor diverge del documento que la declara, y su mensaje de error acaba ATRIBUYENDO al
 * documento lo que el documento no dice. Paso con TIPOS_DE_ITEM, que era la lista de las
 * PLANTILLAS etiquetada como la de los tipos.
 *
 * Y vivir aqui NO BASTA: seria una copia, solo que UNA. verify-suite las compara con LEXICON §8.5
 * y falla si divergen — sin eso esto se repite el dia que LEXICON cambie (PT-080).
 *
 * Las seis de «motivo» no se inventaron: cada una nacio de una instancia medida en EP-020. Una
 * lista cerrada mal elegida SE RODEA, que es lo que PT-103 midio cuando a «asignar» le faltaban
 * campos: «cumplir el marco exigia saltarselo».
 */
export const MOTIVOS_DE_PARADA = [
  'hallazgo', 'condicion-bloqueante', 'compuerta',
  'abre-trabajo', 'limite-alcanzado', 'desafio-al-intake',
];

export const DESENLACES_DE_PARADA = [
  'continua', 'abre', 'cambia-fase', 'detiene', 'declara',
];

export const TIPOS_DE_ITEM = ['BUG', 'FEATURE', 'REFACTOR', 'INVESTIGATION', 'CHORE'];

// ── PT-150 · La escala de severidad ─────────────────────────────────────────
//
// POR QUE EXISTE
//   CUATRO fuentes declaraban esta escala y una contradecia a las otras tres:
//
//     LEXICON 8.3            S1 S2 S3 S4    <- la fuente (LEX-R21)
//     verify-fdge.mjs:166    S1 S2 S3 S4    correcta, pero escrita a mano dentro de un regex
//     INTAKE/templates x3    S1|S2|S3|S4    correcta
//     tracker.mjs:2556       S0 S1 S2 S3    <- y su mensaje CITABA a LEXICON
//
//   Las DOS herramientas se contradecian ENTRE SI: `severity: S4` la aceptaba verify-fdge y la
//   rechazaba tracker; `S0` al reves. Habia un rango donde el marco se contradecia consigo mismo.
//
//   Y el registro ya tenia el rastro: cuatro allocations con S4 —escritas A MANO, porque son
//   anteriores a que `asignar` escribiera el campo— y una con S0, que su propio intake declaraba.
//   Las cinco INTEGRATED. Un valor que solo se puede escribir saltandose la herramienta es un
//   valor que se escribe saltandose la herramienta (PT-103).
//
//   El agravante que este caso tiene y los quince sitios de componentes no: el mensaje de error
//   NO CALLABA, ENSENABA EL DATO EQUIVOCADO. No decia «S4 no vale»; decia «LEXICON declara
//   S0 · S1 · S2 · S3». Quien lo leyera corregia su severidad en vez de ir a LEXICON.
//
// DE DONDE SALE, y por que no se parsea
//   LEXICON 8.3, citado y no leido. Un parseo degradado devuelve lista vacia y todo pasa en
//   verde (RULE-02). Mismo criterio que el contrato de componentes de PT-144.
//
// LO QUE NO ESTABLECE
//   Que una severidad invalida no pueda entrar «por ningun camino». REGISTRY.json es un archivo
//   y se escribe a mano — asi entraron los cuatro S4. Lo que si se garantiza: el comando la
//   rechaza, y el verificador la caza en trabajo VIVO. Lo terminal no se rejuzga (RIGE_DESDE).
export const SEVERIDADES = ['S1', 'S2', 'S3', 'S4'];

/** ¿Es una severidad que LEXICON declara? */
export const esSeveridad = (v) => SEVERIDADES.includes(String(v ?? ''));

/**
 * El patron de la linea `severity:` de un intake.
 *
 * Se CONSTRUYE desde SEVERIDADES: la clase `[1-4]` que habia antes codificaba la escala DENTRO
 * del regex, asi que anadir un nivel obligaba a editar un patron — que es exactamente donde
 * SUITE-R59 avisa de que los escapes se pierden al editar. Aqui no hay una sola barra invertida
 * escrita: lo que no se escribe no se pierde.
 *
 * Tiene que tolerar el comentario que traen las plantillas del paquete:
 *     severity: S4               # [HUMANO] S1 | S2 | S3 | S4
 * y seguir rechazando `severity: S9` y `severity:` vacio (verify-fdge:165).
 */
export const RE_SEVERIDAD = new RegExp(
  '^' + CLASE.espacio + '*severity:' + CLASE.espacio + '*('
    + SEVERIDADES.map(comoLiteral).join('|')
    + ')' + CLASE.espacio + '*(?:#.*)?$',
  'im',
);


/**
 * PT-143 · Los prefijos de identificador que LEXICON declara, una sola vez.
 *
 * `asignar` derivaba el prefijo con `ARGS.find(a => /^[A-Z]+$/)`: el valor de `--tipo` es tambien
 * un argumento en mayusculas, asi que `--tipo BUG` sin un `PT` delante creaba `BUG-001` — un
 * espacio de nombres que LEXICON no reconoce, nacido de adivinar lo que era un argumento.
 *
 * Es CE-003, argumento por deteccion. `CON_VALOR` existe justo para saber que banderas llevan
 * valor y la lectura del prefijo no lo consultaba: la informacion estaba a diez lineas.
 */
export const PREFIJOS_DE_ID = ['PT', 'EP', 'QA', 'QR', 'QD', 'H', 'E', 'P', 'R', 'INC'];

// ── PT-144 · El contrato de componentes ─────────────────────────────────────
//
// POR QUE EXISTE
//   `EP-022` midio la lista de componentes de la suite escrita A MANO en CATORCE sitios de
//   cuatro herramientas, mientras este modulo —que existe para que un hecho tenga una sola
//   definicion y su contrato (`SUITE-R38`)— declaraba estados, compuertas, vigencia, prefijos de
//   identificador y tipos de item, pero NO los componentes.
//
//   Lo grave no era la duplicacion. `verify-suite.mjs:250` filtraba las reglas por una
//   alternancia LITERAL de prefijos, asi que un componente con prefijo nuevo tendria todas sus
//   reglas INVISIBLES al verificador — y no daria error: PASARIA EN VERDE. Es la forma de fallo
//   que este repositorio declara peor, y la que dejo a `QA` en 0/19 y a `FPGE` en 0/10
//   cumpliendose «solo por buena voluntad» (`verify-qa.mjs:7`).
//
// DE DONDE SALE CADA VALOR — y por que NO se parsea
//   `LEXICON` manda sobre los nombres (`LEX-R21`), asi que la tentacion es derivar esta tabla
//   leyendo `LEXICON.md` en tiempo de ejecucion. Se RECHAZO por `RULE-02`: un parseo degradado
//   devuelve lista vacia y TODO pasa en verde. Seria cambiar catorce literales por un unico
//   punto de fallo silencioso, dentro de las herramientas que verifican.
//
//   El contrato CITA su fuente en cada campo; no la lee. Cambiar `LEXICON` y no cambiar esto
//   hace fallar `verify-patrones`, que es como tiene que enterarse.
//
// DOS TABLAS, PORQUE SON DOS HECHOS
//   `build-core.mjs` afirmaba la lista dos veces con cifras distintas —7 en `:171`, 10 en `:183`—
//   y el intake lo describio como dos literales que «coinciden por costumbre». No era costumbre:
//   es LA MISMA TABLA filtrada por un campo que nadie habia escrito. `LEX`, `EXEC` y `PTSA` no
//   tienen sus reglas en `RULES.md` —viven en `LEXICON`, `EXECUTION-MODES` y la especificacion de
//   PTSA— asi que no se recogen de su prosa pero SI se ordenan al emitir.
//
//   De ahi que haya COMPONENTE (seis) y FAMILIA DE REGLAS (diez). `SUITE`, `LEX`, `EXEC` e
//   `INTAKE` son familia y no componente.

/**
 * Los seis componentes de la suite.
 *
 * nombre       el normativo, en prosa                          LEXICON §3 · CLAUDE.md
 * sigla        el que usan sus reglas, rutas y triggers        LEX-R03 para FQAGE→QA
 *              SEPARADA de `nombre` A PROPOSITO: `audit.mjs:214` resolvia
 *              `Foundation → FND` con un ternario, y una excepcion codificada como
 *              condicional obliga a la siguiente a escribirse igual, al lado.
 * prefijo      el de sus reglas                                RULES.md §Dónde vive cada familia
 * directorio   su carpeta propia, o null si no tiene           LEXICON §6
 * obligatorio  false solo para FIDE: el INSTALL no lo copia    FIDE-R01
 * triggers     los que lo activan                              LEXICON §7
 * fases        [desde, hasta], o SIN_EVALUAR si LEXICON no lo declara      LEXICON §3
 * en_core      si sus reglas entran en CORE.md, o en overlay propio        SUITE-R25
 */
export const COMPONENTES = [
  {
    nombre: 'FDGE',
    prompts: 'FDGE-Prompts.md',
    sigla: 'FDGE',
    prefijo: 'FDGE',
    directorio: null,
    obligatorio: true,
    triggers: ['[START PT]', '[START EP]', '[CIERRA]', '[IMPLEMENTACIÓN]'],
    fases: [0, 10],
    en_core: true,
  },
  {
    // LEX-R03 · se llama FQAGE en prosa normativa y QA en triggers, rutas y nombres de archivo.
    // No se admite una tercera grafia. `audit.mjs` usa hoy la SIGLA como clave, no el nombre.
    nombre: 'FQAGE',
    prompts: 'QA/QA-Prompts.md',
    sigla: 'QA',
    prefijo: 'QA',
    directorio: 'QA',
    obligatorio: true,
    triggers: ['[START QA]'],
    fases: [1, 7],
    en_core: true,
  },
  {
    // SUITE-R25 · sus 82 reglas van a un overlay propio, CORE-PTSA.md, que solo se carga con
    // [START PTSA]. Por eso `en_core` es false y no es un olvido.
    nombre: 'PTSA',
    prompts: 'PTSA/PTSA-Prompts.md',
    sigla: 'PTSA',
    prefijo: 'PTSA',
    directorio: 'PTSA',
    obligatorio: true,
    triggers: ['[START PTSA]'],
    fases: [0, 14],
    en_core: false,
  },
  {
    // EL CASO QUE PRUEBA EL DISENO: nombre y sigla no coinciden.
    nombre: 'Foundation',
    prompts: 'Foundation-Prompts.md',
    sigla: 'FND',
    prefijo: 'FND',
    directorio: null,
    obligatorio: true,
    triggers: ['[START FOUNDATION]', '[FOUNDATION VALIDATED]', '[START RECONCILE]'],
    fases: [0, 6],
    en_core: true,
  },
  {
    // PT-156 · `fases` estuvo SIN_EVALUAR desde PT-144 porque LEXICON §3 no tenia apartado para
    // FPGE, y NO era olvido de redaccion: su recorrido numeraba los siete pasos como [1]..[7].
    // §2 prohibe «Step n» y «Etapa n» POR SU NOMBRE, y un corchete no esta en esa lista — la
    // misma cosa con una grafia que la prohibicion no alcanzo. No habia fases que declarar, asi
    // que el rango no se invento: se REPORTO el hueco (RULE-06) hasta que hubo de donde sacarlo.
    nombre: 'FPGE',
    prompts: 'FPGE-Prompts.md',
    sigla: 'FPGE',
    prefijo: 'FPGE',
    directorio: null,
    obligatorio: true,
    triggers: ['[START FPGE]'],
    fases: [1, 7],
    en_core: true,
  },
  {
    // FIDE-R01 · el unico opcional: el INSTALL no lo copia al proyecto destino, porque se retira
    // tras incubarlo. Es el hecho que `verify-suite.mjs:425` y `comparar-marco.mjs:39` escribian
    // cada una por su cuenta, con dos nombres distintos, sin importar ninguna de la otra.
    nombre: 'FIDE',
    prompts: SIN_EVALUAR,
    sigla: 'FIDE',
    prefijo: 'FIDE',
    directorio: 'FIDE',
    obligatorio: false,
    triggers: ['[START FIDE]'],
    fases: [1, 5],
    en_core: true,
  },
];

/**
 * Las diez familias de reglas, con el documento que las gobierna.
 *
 * La tabla NO se inventa aqui: `RULES.md` §«Dónde vive cada familia de reglas» ya la publica.
 * `orden` es el de emision de `CORE.md`, y es parte del contrato porque el nucleo generado tiene
 * que salir identico byte a byte.
 *
 * `documento` es el campo que explicaba la discrepancia 7-vs-10 de `build-core.mjs`.
 */
export const FAMILIAS = [
  { prefijo: 'SUITE', documento: 'RULES.md', orden: 1, etiqueta: 'Transversales' },
  { prefijo: 'LEX', documento: 'LEXICON.md', orden: 2, etiqueta: 'Nombres' },
  { prefijo: 'EXEC', documento: 'EXECUTION-MODES.md', orden: 3, etiqueta: 'Compuertas y modos' },
  { prefijo: 'FND', documento: 'RULES.md', orden: 4, etiqueta: 'Foundation' },
  { prefijo: 'FDGE', documento: 'RULES.md', orden: 5, etiqueta: 'Desarrollo' },
  { prefijo: 'INTAKE', documento: 'RULES.md', orden: 6, etiqueta: 'Admisión' },
  { prefijo: 'QA', documento: 'RULES.md', orden: 7, etiqueta: 'Verificación de UX' },
  { prefijo: 'PTSA', documento: 'PTSA/PTSA-V3-Especificacion-Oficial.md', orden: 8, etiqueta: 'Auditoría — definidas en la especificación oficial' },
  { prefijo: 'FPGE', documento: 'RULES.md', orden: 9, etiqueta: 'Priorización' },
  { prefijo: 'FIDE', documento: 'RULES.md', orden: 10, etiqueta: 'Incubación' },
];

// ── Proyecciones ────────────────────────────────────────────────────────────
//
// Cada una DICE a que sitio sustituye. Es lo que evita que PT-145..PT-147 tengan que adivinar
// cual usar, y lo que hace que anadir un componente sea tocar la tabla y nada mas.

const componenteDe = (quien) => COMPONENTES.find((c) => c.nombre === quien || c.sigla === quien);

/** Los diez prefijos de regla. → verify-suite.mjs :250 · :254 · :256 · :289 · :403 */
export const prefijos = () => FAMILIAS.map((f) => f.prefijo);

/** Los componentes que pueden no estar instalados. → verify-suite.mjs:425 · comparar-marco.mjs:39 */
export const opcionales = () => new Set(COMPONENTES.filter((c) => !c.obligatorio).map((c) => c.sigla));

/** Las familias cuyas reglas se recogen de la PROSA de RULES.md. → build-core.mjs:171 */
export const familiasEnProsa = () => FAMILIAS.filter((f) => f.documento === 'RULES.md').map((f) => f.prefijo);

/** El orden de emision de CORE.md. → build-core.mjs:183 */
export const ordenDePrefijos = () => [...FAMILIAS].sort((a, b) => a.orden - b.orden).map((f) => f.prefijo);

/**
 * PT-152 · LOS TRIGGERS DE LA SUITE, QUE NO SON DE NINGUN COMPONENTE.
 *
 * `triggers()` derivaba de COMPONENTES y devolvia ONCE. LEXICON declara DOCE: falta
 * `[START MIGRATE]`, y no es un olvido — es que NO TENIA SITIO. LEXICON lo dice en su propia
 * columna: «[START MIGRATE] · SUITE · migrar el proyecto a la version vigente». Pertenece a la
 * suite, no a un componente, y el contrato solo tenia casa para los de componente.
 *
 * Lo que eso rompia, y no se veia: PT-161 escribio la comprobacion de que TODO TRIGGER TIENE CASO
 * en CASOS-DE-USO derivandola de `triggers()`. Como [START MIGRATE] no estaba ahi, esa
 * comprobacion NO LO MIRABA — una puerta del marco fuera del contrato de cobertura Y fuera de
 * quien lo vigila. Es la forma que EP-022 persiguio dieciseis veces: un hecho que existe y
 * ninguna herramienta deriva.
 *
 * Cada uno declara SU REGLA, porque un trigger sin dueno es lo que se acaba de arreglar.
 */
export const TRIGGERS_DE_SUITE = [
  { trigger: '[START MIGRATE]', regla: 'SUITE-R17', para: 'migrar el proyecto a la version vigente' },
];


/** Los triggers de arranque: los de cada componente MAS los de la suite. → build-core.mjs */
export const triggers = () => [
  ...COMPONENTES.flatMap((c) => c.triggers),
  ...TRIGGERS_DE_SUITE.map((t) => t.trigger),
];

/**
 * El archivo de prompts de un componente, o SIN_EVALUAR si no tiene. → audit.mjs:192-195
 *
 * PT-147 · NO se deriva por regla. Se derivaba —directorio + sigla + «-Prompts.md»— y para FIDE
 * daba «FIDE/FIDE-Prompts.md», que NO EXISTE: LEXICON §6.6 declara sus tres archivos y ninguno es
 * de prompts. FIDE es el unico componente que opera ANTES de que la suite exista, asi que su
 * texto de activacion es un CLAUDE.md anfitrion —FIDE-CLAUDE-Launcher.md—, no un *-Prompts.md
 * dentro de una metodologia instalada.
 *
 * Es la misma leccion que «sigla» frente a «nombre»: una regla con una excepcion obliga a la
 * siguiente excepcion a escribirse al lado. El dato se DECLARA.
 *
 * Y deja al descubierto una contradiccion que NO es de esta funcion: LEX-R15 dice que «todo
 * componente tiene exactamente un archivo de prompts» y enumera CINCO, mientras LEXICON §6.6
 * declara los de FIDE sin ninguno. Es PT-158.
 */
export const promptsDe = (quien) => componenteDe(quien)?.prompts ?? SIN_EVALUAR;

/**
 * El rango de fases, o SIN_EVALUAR. → audit.mjs:197-202
 *
 * Devuelve SIN_EVALUAR y no `[]` a proposito: un array vacio haria que quien lo recorra audite
 * cero fases y salga en verde. No saber no es permiso (RULE-06).
 */
export const fasesDe = (quien) => componenteDe(quien)?.fases ?? SIN_EVALUAR;

/** La sigla de sus reglas. → audit.mjs:214, que era un ternario con Foundation dentro */
export const siglaDe = (quien) => componenteDe(quien)?.sigla ?? null;

// ── PT-145 · Los patrones de identificador de regla ─────────────────────────
//
// POR QUE SON FUNCIONES Y NO CONSTANTES
//   Un regex con `/g` conserva `lastIndex` entre llamadas. `verify-patrones.mjs` ya lo documenta
//   —«reutilizarlo entre ejemplos daria resultados que dependen del orden»— y aqui los cinco usos
//   de `verify-suite` mezclan `/g` con sin banderas. Cada llamada devuelve un patron NUEVO.
//
// POR QUE NO LLEVAN UNA SOLA BARRA INVERTIDA ESCRITA
//   `SUITE-R59`. Ocho veces en este repositorio un escape se perdio al editar —`\b` quedo como el
//   byte 0x08, `\s` como la letra `s`— y el regex resultante era VALIDO Y NO CASABA NADA. En un
//   verificador de reglas, casar de menos es dejar de ver reglas: es decir, PASAR EN VERDE.
//
//   Se construyen con `CLASE` y `comoLiteral`, que existen para esto. Lo que no se escribe no se
//   pierde.
//
// DE DONDE SALEN LOS PREFIJOS
//   De `prefijos()`, que los deriva de `FAMILIAS` (PT-144). Estaban escritos a mano SEIS veces en
//   `verify-suite.mjs` — y la sexta, `:708`, llevaba OCHO en vez de diez: le faltaban `FPGE` y
//   `FIDE`. Guarda `EXEC-R08` —la matriz de compuertas no puede citar una regla— asi que una cita
//   de `FPGE-Rnn` o `FIDE-Rnn` pasaba en verde. No era una copia mas: era un guardarrail con dos
//   agujeros.

/** La alternancia de prefijos, como TEXTO. Para quien compone su propio patron alrededor. */
export const PFX = () => '(' + prefijos().map(comoLiteral).join('|') + ')';

/** `\b(PREFIJOS)-(R|P)\d+\b` — el identificador de una regla, suelto en el texto. */
export const reglaRE = (banderas) => new RegExp(
  CLASE.limite + PFX() + '-(R|P)' + CLASE.digito + '+' + CLASE.limite,
  banderas ?? '',
);

/** `^| \`ID\`` — la primera celda de una fila de tabla, donde `RULES.md` define. */
export const reglaEnTabla = () => new RegExp(
  '^' + comoLiteral('|') + CLASE.espacio + '*' + comoLiteral(CAR.BACKTICK)
    + '((?:' + prefijos().map(comoLiteral).join('|') + ')-R' + CLASE.digito + '+)'
    + comoLiteral(CAR.BACKTICK),
);

/** ``^`ID` ·`` — la forma en que LEXICON y EXECUTION-MODES definen, fuera de tabla. */
export const reglaEnLinea = () => new RegExp(
  '^' + comoLiteral(CAR.BACKTICK)
    + '((?:' + prefijos().map(comoLiteral).join('|') + ')-R' + CLASE.digito + '+)'
    + comoLiteral(CAR.BACKTICK) + CLASE.espacio + '*' + comoLiteral('·'),
);



// ── PT-123 · BACKLOG.md · el bloque DERIVADO, entre marcas ──────────────────
//
// El archivo dice de si mismo «regenerable desde REGISTRY.json» desde la primera version, el
// bloque «no hacer» prohibe editarlo a mano, y NINGUN comando lo escribia: «tracker indices»
// cubria DISCOVERY, ENRICHMENT y REFACTOR_SCOPE, y a el no.
//
// Las tres cosas a la vez dejaban una sola salida practicable —saltarse la regla—, que es
// FDGE-R51 aplicado al reves. Y la consecuencia esta medida en su propia cabecera: ocho lotes de
// retraso la primera vez, CUATRO cuando esto se escribio.
//
// NO SE GENERA ENTERO. El PORQUE del orden —«PT-088 va antes que PT-087 porque sus tres
// comprobaciones son el banco de pruebas del mecanismo»— no sale de ningun campo, y es lo mas
// valioso que tiene el archivo. Misma frontera que LEX-R26 traza en CHECKPOINT.json y HANDOFF.md
// entre lo derivado y la prosa: se reescribe SOLO lo de dentro de las marcas.
const MARCA_BACKLOG = ['<!-- BACKLOG:DERIVADO -->', '<!-- /BACKLOG:DERIVADO -->'];

export function bloqueDeBacklog(allocations, urlRepo = null) {
  const TERM = ESTADOS_TERMINALES;
  const enlace = (n) => (urlRepo && n ? `[#${n}](${urlRepo}/issues/${n})` : (n ? `#${n}` : '—'));
  const q = (s) => '`' + s + '`';
  const L = [];
  const lotes = (allocations ?? []).filter((a) => esLote(a) && !TERM.has(String(a?.status)));

  if (!lotes.length) {
    L.push('**Ninguna implementación abierta.** El registro no declara ningún lote vivo.');
    L.push('');
  }
  for (const lote of lotes) {
    const hijos = (allocations ?? []).filter((a) => a?.epic === lote.id);
    const cerradas = hijos.filter((h) => TERM.has(String(h.status)) || String(h.status) === 'DONE').length;
    L.push('## Implementación abierta — ' + q(lote.id));
    L.push('');
    L.push(q(lote.id) + ' · **' + (lote.title ?? '') + '** · ' + q(lote.status) + ' · issue ' + enlace(lote.issue) + '.');
    L.push('');
    L.push('| PT | Tipo | Sev | Estado | Fase | Issue | Qué resuelve |');
    L.push('|:---|:---|:---|:---|:---|:---|:---|');
    for (const h of hijos) {
      L.push('| ' + h.id + ' | ' + (h.type ?? '—') + ' | ' + (h.severity ?? '—') + ' | ' + h.status
        + ' | ' + (h.phase ?? '—') + ' | ' + enlace(h.issue) + ' | ' + (h.title ?? '') + ' |');
    }
    L.push('');
    L.push('**' + cerradas + ' de ' + hijos.length + ' cerradas.** Las cifras salen del registro: '
      + 'no se transcriben (' + q('PT-091') + ').');
    L.push('');
  }

  const aplazadas = (allocations ?? []).filter((a) => String(a?.status) === 'DEFERRED');
  L.push('## Aplazado — ' + aplazadas.length + ' allocation(s) ' + q('DEFERRED'));
  L.push('');
  L.push(q('SUITE-R44') + ' · aplazar algo lo **pone** en el tablero, no lo saca.');
  L.push('');
  if (!aplazadas.length) { L.push('Ninguna.'); } else {
    L.push('| Id | Tipo | Issue | Por qué sigue fuera |');
    L.push('|:---|:---|:---|:---|');
    for (const a of aplazadas) {
      const motivo = String(a.origin ?? '').split('·').pop().trim().slice(0, 120) || '—';
      L.push('| ' + a.id + ' | ' + (a.type ?? '—') + ' | ' + enlace(a.issue) + ' | ' + motivo + ' |');
    }
  }
  return L.join(String.fromCharCode(10));
}

export const esLote = (a) => /^EP-/.test(String(a?.id ?? ''));

/**
 * PT-131 · Lo que YA VIAJO en un tag, derivado del ARBOL y no de lo que el tag declaraba.
 *
 * PT-087 arreglo QUE TAG mirar —el mas alto— y siguio mirando su REGISTRY.json, que es una
 * DECLARACION SOBRE el trabajo y no el trabajo. Mientras el estado terminal se escriba en el
 * mismo commit que se etiqueta, las dos cosas coinciden y el proxy sale gratis. En cuanto el
 * terminal llega DESPUES del tag dejan de coincidir:
 *
 *   v12.0.0 -> 5b184af   su REGISTRY declaraba  EP-019 DRAFT · las 17 en DONE
 *   main    -> ee660db   su REGISTRY declara    EP-019 CLOSED · las 17 INTEGRATED
 *
 * DONE no esta en ESTADOS_TERMINALES —y hace bien, SUITE-R08 lo declara a proposito—, asi que
 * las diecisiete no constaban selladas y bloqueaban G2 de TODAS las tareas, incluida la que
 * produciria el tag que las limpiaria. El candado con la llave dentro, y es la segunda vez que
 * esta forma aparece aqui.
 *
 * DOS CONDICIONES, no una. Con «esta el directorio dentro del tag» a secas salian PT-025
 * —DEFERRED, nunca trabajada— y PT-032 —cerrada sin artefactos—: ninguna de las dos tiene
 * changes/ en ningun sitio, y UNA TAREA SIN TRABAJO NO TIENE NADA QUE SELLAR.
 *
 * QUE ESTABLECE: que el trabajo de una tarea viajo dentro del tag mas alto.
 * QUE NO ESTABLECE: que ese tag este publicado, ni que su contenido sea correcto. Solo que el
 *   directorio existe ahi.
 *
 * `ls` y `existe` se INYECTAN: este archivo no ejecuta git ni toca el disco, y asi la funcion
 * es pura y su inversa se puede escribir sin fabricar un repositorio.
 *
 * @param ls      () => string[] | null   los directorios de changes/ dentro del tag, o null
 * @param existe  (alloc) => boolean      si la tarea tiene trabajo en el arbol de HOY
 */
/**
 * PT-114 · ¿El cuerpo publicado se quedo SIN ENLACE con la ref durable ya existente?
 *
 * PT-096 decidio bien: sin ref durable se publica la ruta SIN enlace y se dice por que, en vez
 * de inventar una URL (RULE-06). Lo que faltaba es la otra mitad — QUE ALGO LO ECHE DE MENOS
 * DESPUES. El cuerpo se publica al abrir el issue, la rama se empuja despues, y nada vuelve a
 * mirar: «una vez que un cuerpo esta bien, NADA vuelve a mirarlo» (PT-096).
 *
 * La consecuencia no es cosmetica: el firmante NO PUEDE LEER el intake que se le pide firmar, asi
 * que G1 no puede pasar. Lo encontro una persona abriendo EP-020, no un verificador.
 *
 * Septima instancia de «existe la herramienta y nada la echa en falta»: el propio cuerpo dice
 * «`tracker abrir --aplicar` lo republica» — le pide a un humano que ejecute un comando que nada
 * exige.
 *
 * QUE ESTABLECE: que el cuerpo publica la ruta sin enlace TENIENDO ref durable.
 * QUE NO ESTABLECE: que el enlace resuelva. Eso depende de la plataforma, no del texto.
 *
 * @param cuerpo    el cuerpo publicado, o null si no se pudo leer
 * @param hayRef    true si existe ref durable, false si no, null si no se sabe
 */
export const RE_SIN_ENLACE = /sin enlace: no hay ref durable que lo contenga/;

/**
 * PT-132 · ¿Hay ya un issue ABIERTO con el titulo que esta allocation derivaria?
 *
 * Si lo hay, es lo que dejo una pasada interrumpida de `abrir`: el issue se creo —irreversible—
 * y el registro no llego a guardarse. Adoptarlo es recuperar; crear otro es duplicar, y asi
 * salieron DIECISEIS el 2026-08-22.
 *
 * QUE ESTABLECE: que existe un issue abierto con ese titulo exacto.
 * QUE NO ESTABLECE: que ese issue sea el correcto. Un titulo repetido a mano en el tablero
 *   tambien casa — y es preferible adoptar uno ajeno, que se ve en el espejo, a crear un
 *   duplicado que nadie mira.
 *
 * @param titulo   el derivado del registro · @param abiertos [{number,title}] o null
 */
export function issueAAdoptar(titulo, abiertos) {
  if (abiertos == null) return null;                       // sin saber, no se decide (RULE-06)
  const t = String(titulo ?? '').trim();
  if (!t) return null;
  const m = abiertos.find((i) => String(i?.title ?? '').trim() === t);
  return m ? m.number : null;
}

export function cuerpoSinEnlaceConRef(cuerpo, hayRef) {
  if (cuerpo == null || hayRef == null) return null;      // SIN EVALUAR (RULE-06)
  return hayRef === true && RE_SIN_ENLACE.test(String(cuerpo));
}

export function selladoEnTag(ls, existe, allocations) {
  const dirs = ls();
  if (dirs == null) return null;                 // sin tag o sin git: SIN EVALUAR (RULE-06)
  const enTag = new Set(dirs);
  return (allocations ?? [])
    .filter((a) => !existe(a) || enTag.has(`${a?.id}-${a?.slug}`))
    .map((a) => a?.id);
}

export function sinSellar(allocations, idsEnTag) {
  if (idsEnTag == null) return null;
  const sellados = new Set(idsEnTag);
  const abiertos = new Set((allocations ?? [])
    .filter((a) => esLote(a) && !ESTADOS_TERMINALES.has(a?.status))
    .map((a) => a.id));
  return (allocations ?? [])
    .filter((a) => !esLote(a) && ESTADOS_TERMINALES.has(a?.status))
    .filter((a) => !abiertos.has(a?.epic))
    .filter((a) => !sellados.has(a?.id))
    .map((a) => a.id);
}

/**
 * PT-085 · `D` · Los documentos que lee quien llega, y su decision al sellar.
 *
 * NO se comprueba que hayan cambiado. Exigirlo produciria cambios cosmeticos para acallar la
 * comprobacion —el equivalente documental de fabricar un verde— y ademas un manual que cambia no
 * prueba que se revisara lo que hacia falta.
 *
 * La forma es la de FND-R22 con el LAYOUT: cada fila lleva su decision, y una celda vacia no
 * pasa, porque es indistinguible de una que nadie miro.
 */
export const DOCUMENTOS_DE_ENTRADA = [
  'MANUAL.md',
  'CASOS-DE-USO.md',
  'README.md',
  'Suite-CLAUDE-Template.md',
  'graphify-out/',
];


export function selloSinResolver(actaDelSello) {
  const texto = String(actaDelSello ?? '');
  const resueltos = new Map();
  for (const m of texto.matchAll(RE_FILA_SELLO)) {
    // NO PROCEDE exige motivo: sin el, la fila dice «no hace falta» sin decir por que.
    const ok = m[2].toUpperCase() === 'ACTUALIZADO' || m[3].replace(/[—-]/g, '').trim().length > 0;
    resueltos.set(m[1], ok);
  }
  return DOCUMENTOS_DE_ENTRADA.filter((d) => resueltos.get(d) !== true);
}

/**
 * PT-085 · `E` · Deriva de CONTENIDO del grafo.
 *
 * FDGE-R43 declaraba STALE solo si un PT integrado creo, movio, renombro o elimino archivos
 * (`structural: true`). En todo el registro UNA sola allocation lo tiene. Modificar no contaba —
 * asi que ocho funciones nuevas y tres herramientas cambiadas dejaban el grafo «FRESH» con 12 de
 * sus 16 archivos ya distintos, y respondiendo que patrones.mjs tiene 2 importadores cuando
 * tiene 8.
 *
 * El dato ya estaba: `graphify-out/manifest.json` guarda `mtime` y `ast_hash` por archivo.
 *
 * AVISA, NO BLOQUEA. Si cualquier edicion pusiera el grafo en STALE, G2 quedaria bloqueada en
 * todos los MAJOR de forma permanente y la comprobacion se desactivaria. STALE bloqueante sigue
 * reservado a lo estructural; esto produce SUSPECT con la lista.
 */
export function derivaDelGrafo(manifest, huellaDe) {
  if (!manifest || typeof manifest !== 'object') return null;
  const cambiados = [];
  for (const [ruta, d] of Object.entries(manifest)) {
    const esperado = d?.ast_hash ?? d?.semantic_hash ?? null;
    const actual = huellaDe(ruta, esperado == null);
    if (actual == null) { cambiados.push(`${ruta} (no existe)`); continue; }
    // PT-090 · el manifiesto guarda «ast_hash» EN LA MISMA LINEA que «mtime», y esta funcion
    // usaba el mtime: el dato bueno estaba al lado y se eligio el barato. «git clone» reescribe
    // los mtime con la fecha del clon, asi que los 17 archivos salian cambiados aunque el
    // contenido fuera identico — y dos commit seguidos tambien los mueven. Paso DOS VECES en
    // este mismo lote, la ultima con 6 de 17 por una normalizacion de CRLF.
    //
    // Solo se cae al mtime si el manifiesto NO trae hash: un manifiesto viejo sigue midiendose
    // como antes en vez de dar todo por cambiado, que seria nacer rojo.
    if (esperado == null) {
      if (Math.abs(Number(actual) - Number(d?.mtime ?? 0)) > 1) cambiados.push(ruta);
    } else if (String(actual) !== String(esperado)) {
      cambiados.push(ruta);
    }
  }
  return cambiados;
}

/**
 * PT-090 · La ruta de un archivo del manifiesto, relativa a la raiz del proyecto.
 *
 * El manifiesto guarda rutas ABSOLUTAS —«C:\\DevOps\\…\\bin\\cauce.mjs»— asi que solo sirve en un
 * disco donde el proyecto este exactamente ahi. Versionar el grafo NO bastaria, que es lo que
 * H-005 daba por hecho.
 *
 * QUE ESTABLECE: la ruta relativa dentro del proyecto, con separadores «/».
 * QUE NO ESTABLECE: que el archivo exista. Solo normaliza la forma.
 */
export function rutaRelativaDelManifiesto(ruta, raiz) {
  const norm = (s) => String(s ?? '').split(String.fromCharCode(92)).join('/');
  const r = norm(ruta);
  const base = norm(raiz).replace(/\/+$/, '');
  if (!base) return r;
  const i = r.toLowerCase().indexOf(base.toLowerCase() + '/');
  return i >= 0 ? r.slice(i + base.length + 1) : r;
}

/**
 * PT-080 · SUITE-R38 · LEX-R22 · Un identificador definido en DOS documentos propietarios.
 *
 * La v3 tenia la misma regla escrita a mano en cuatro documentos y las cuatro copias
 * divergieron: ocho defectos criticos, incluido un ruleset que ordenaba destruir datos. La v4
 * corrige la causa — y en la v9 seguian TRES asi, con las tres copias YA divergidas y siempre en
 * la misma direccion: la de EXECUTION-MODES soltaba una obligacion.
 *
 *   FDGE-R22  RULES exige «solo severity: S1» y cinco fases retroactivas · la copia, ninguna
 *             de las dos. Dejaba el carril HOTFIX abierto a un S3, y ese carril difiere G2 y G3.
 *   FDGE-R40  RULES exige que los PTs solapados SE SERIALICEN · la copia lo omitia.
 *   FDGE-R41  RULES exige que el EP-NNN pase a BLOCKED · la copia lo omitia.
 *
 * verify-suite comprobaba vocabulario derogado, reglas citadas inexistentes, obligaciones en
 * documentos que solo explican, enlaces rotos y versiones desalineadas. NO comprobaba esto — la
 * unica de las cinco por la que se escribio la v4.
 *
 * `docs` es un mapa {nombre: texto}. Devuelve una fila por ID duplicado con DONDE esta cada
 * copia: decir «hay conflicto» sin nombrar los dos sitios obliga a buscarlos a mano.
 */
// PT-163 · los tres patrones, LITERALES y una sola vez. Montarlos desde strings es SUITE-R59, y
// este archivo lleva la cuenta: doce roturas medidas, dos de ellas escribiendo verificadores.

export function definidasDosVeces(docs) {
  // PT-163 · CONTABA DOCUMENTOS, NO DEFINICIONES. `donde` era un Set de documentos, asi que dos
  // definiciones del MISMO id en el MISMO archivo COLAPSABAN EN UNA y la comprobacion salia verde.
  //
  // No es teorico: PT-148 escribio LEX-R33 y LEX-R34 sobre dos IDs que ya existian desde PT-137 y
  // PT-138. Al regenerar, LAS DOS REGLAS VIEJAS DESAPARECIERON DE CORE.md —el unico archivo que el
  // agente carga— y esto no dijo nada. SUITE-R14 promete que verify-suite «rechaza cualquier
  // definicion duplicada»: cumplia la mitad, y la mitad que fallaba era la mas facil de cometer.
  //
  // Ahora cuenta POR DOCUMENTO, y los dos hechos se distinguen (RULE-02): «en dos documentos» y
  // «dos veces en el mismo» tienen arreglos distintos —elegir propietario contra renumerar— y
  // fundirlos mandaba a quien lo lee a averiguar cual de los dos era.
  const donde = new Map();
  const anota = (id, doc) => {
    if (!donde.has(id)) donde.set(id, new Map());
    const m = donde.get(id);
    m.set(doc, (m.get(doc) ?? 0) + 1);
  };
  for (const [doc, txt] of Object.entries(docs ?? {})) {
    for (const l of String(txt ?? '').split(RE_LINEAS)) {
      // Las dos formas de PT-066: RULES.md usa filas de tabla, los otros usan prosa.
      const t = RE_DEF_TABLA.exec(l);
      const q = RE_DEF_PROSA.exec(l);
      if (t) anota(t[1], doc);
      else if (q) anota(q[1], doc);
    }
  }
  const fuera = [];
  for (const [id, m] of donde.entries()) {
    const ds = [...m.keys()].sort();
    const repetido = ds.filter((d) => m.get(d) > 1);
    if (repetido.length) fuera.push({ id, docs: ds, dentroDe: repetido, veces: m.get(repetido[0]) });
    else if (ds.length > 1) fuera.push({ id, docs: ds, dentroDe: [], veces: 1 });
  }
  return fuera;
}

/**
 * PT-078 · SUITE-R26 · Ninguna regla queda sin clasificar.
 *
 * PT-075 arreglo DOS reglas concretas. Esto es el mecanismo: que NINGUNA pueda quedarse fuera en
 * silencio. Tres estados exhaustivos y excluyentes — y lo que cambia no es cuantas hay en cada
 * casilla, sino que NO EXISTA UNA CUARTA CASILLA SILENCIOSA.
 *
 *   VERIFICADA      alguna herramienta la EMITE — fail|warn|ok('ID'). Mencionarla en un
 *                   comentario o dentro del mensaje de otra regla NO cuenta: eso es lo que
 *                   PT-067 midio como 24 falsos positivos, incluida FDGE-R17.
 *   NO_VERIFICABLE  con MOTIVO escrito y firmado, como TD-14 hizo con «quien abrio el PR».
 *                   Es una decision, no una constatacion, y por eso lleva firma.
 *   PENDIENTE       verificable y sin escribir. Deuda DECLARADA, con su cifra publicada.
 *
 * `emisiones` es el texto de las herramientas; `declaradas` el mapa {id: motivo} del documento
 * firmado. Una regla que este en las dos —emitida Y declarada no verificable— se cuenta como
 * VERIFICADA y se señala: la declaracion sobra y probablemente esta vieja.
 */
// Concatenacion simple y comillas simples a proposito. Escrito con plantilla y pasado por un
// script, los `\b` y `\s` se convirtieron en byte de control y en «s» literal: el regex
// compilaba mal y reventaba. Novena vez del mismo escalon en este lote, y la salida vuelve a
// ser quitar el problema en vez de pelearse con el escapado.
const COMILLA = '[\'"`]';
const RE_EMISION = (id) => new RegExp('\\b(?:fail|warn|ok)\\s*\\(\\s*' + COMILLA + id + COMILLA);

export function clasificarReglas(reglas, textoHerramientas, declaradas, juzgadas) {
  const txt = String(textoHerramientas ?? '');
  const dec = declaradas ?? {};
  const juz = juzgadas ?? {};
  const salida = {
    VERIFICADA: [], NO_VERIFICABLE: [], PENDIENTE: [], sobran: [],
    // PT-204 · LA CUARTA CASILLA, que existia y estaba FUNDIDA dentro de PENDIENTE.
    //
    // «PENDIENTE» decia «deuda, no limite» y mezclaba DOS HECHOS con arreglos distintos:
    //
    //     DEUDA        alguien juzgo que es mecanizable y no esta hecho  -> escribir el verificador
    //     SIN_JUZGAR   NADIE HA MIRADO si se puede o no                  -> emitir un juicio
    //
    // Es RULE-02, y medido el 2026-08-30: DEUDA 0, SIN_JUZGAR 118. Un numero que fusiona «lo
    // decidimos y falta» con «no lo hemos mirado» no dice cuanto trabajo hay: dice cuanto hay MAS
    // lo que nadie ha pensado, y las dos mitades se resuelven de forma distinta.
    //
    // JUZGAR NO ES VERIFICAR, y ahi esta toda la diferencia de coste. Decidir que FIDE-R03 no es
    // mecanizable porque describe una conversacion cuesta UN PARRAFO con motivo y firma; escribir
    // su verificador cuesta UNA TAREA. Separarlos convierte una deuda de 118 tareas en 118 juicios
    // mas un lote de verificacion SOBRE LAS QUE SOBREVIVAN AL JUICIO.
    DEUDA: [], SIN_JUZGAR: [],
  };
  for (const r of reglas ?? []) {
    const emitida = RE_EMISION(r.id).test(txt);
    if (emitida) {
      salida.VERIFICADA.push(r.id);
      if (dec[r.id]) salida.sobran.push(r.id);
    } else if (dec[r.id]) {
      salida.NO_VERIFICABLE.push(r.id);
    } else {
      salida.PENDIENTE.push(r.id);          // se conserva: es la SUMA de las dos de abajo
      if (juz[r.id]) salida.DEUDA.push(r.id); else salida.SIN_JUZGAR.push(r.id);
    }
  }
  return salida;
}

/**
 * PT-078 · El documento firmado que declara qué reglas NO son verificables, y por qué.
 *
 * Formato: una fila por regla, con motivo. Sin motivo no cuenta — igual que en el sello y en el
 * LAYOUT: una celda vacia es indistinguible de una que nadie miro (FND-R22).
 */

/**
 * PT-204 · Las reglas JUZGADAS mecanizables y todavia sin verificador: DEUDA de verdad.
 *
 * Vive en el mismo documento que las NO_VERIFICABLE y por el mismo motivo: es UNA DECISION, y por
 * eso lleva motivo. Lo que cambia es el sentido — alli se declara que una regla NO se puede
 * comprobar; aqui, que SI se puede y aun no se ha hecho.
 *
 * SIN ESTA SECCION, TODO LO NO EMITIDO ES «SIN_JUZGAR» — que es la verdad cuando nadie ha mirado,
 * y es exactamente lo que hoy ocurre con 118 de las 244.
 */
export function juzgadasMecanizables(texto) {
  const m = {};
  const i = String(texto ?? '').indexOf('## Juzgadas MECANIZABLES');
  if (i < 0) return m;
  for (const f of String(texto).slice(i).matchAll(RE_NO_VERIFICABLE)) {
    const motivo = f[2].replace(/[—-]/g, '').trim();
    if (motivo) m[f[1]] = f[2].trim();
  }
  return m;
}

export function noVerificablesDeclaradas(texto) {
  const m = {};
  for (const f of String(texto ?? '').matchAll(RE_NO_VERIFICABLE)) {
    const motivo = f[2].replace(/[—-]/g, '').trim();
    if (motivo) m[f[1]] = f[2].trim();
  }
  return m;
}

/**
 * PT-086 · Qué secciones del arnés ejercitan una herramienta.
 *
 * `--solo` filtra ASERCIONES, no ANDAMIAJE: hay 211 llamadas a `build_fixture` a nivel superior,
 * fuera de los casos, asi que una corrida filtrada reconstruye el fixture las 211 veces igual.
 * Medido: corrida completa ~600 s, corrida con `--solo` de UN caso 171 s. El suelo es el
 * andamiaje, y por eso hay que saltarse la SECCION entera y no solo sus aserciones.
 *
 * El mapa NO se escribe a mano: se DERIVA del propio arnes. Una tabla de 35 entradas seria un
 * hecho copiado mas —RULE-01— y envejeceria en cuanto alguien añadiera una seccion. Se lee el
 * cuerpo de cada seccion y se mira que herramientas nombra, directamente o por sus helpers.
 *
 * Los helpers SI se declaran, porque su nombre no dice a que herramienta llaman. Son pocos y
 * cambian poco; si aparece uno nuevo sin declarar, su seccion no se asociara a nada y correra
 * SIEMPRE — que es el lado seguro del error.
 */
export const HELPERS_A_HERRAMIENTA = {
  TR: 'tracker.mjs', TRR: 'tracker.mjs', trlib: 'tracker.mjs', trlibno: 'tracker.mjs',
  YO: 'tracker.mjs', OTRO: 'tracker.mjs',
  V: 'verify-fdge.mjs', A: 'audit.mjs', patlib: 'patrones.mjs',
};

export function seccionesDelArnes(texto) {
  const lineas = String(texto ?? '').split(/\r?\n/);
  const secciones = [];
  let actual = null;
  for (const l of lineas) {
    const m = /^sec\s+"(.+)"\s*$/.exec(l);
    if (m) {
      actual = { titulo: m[1], cuerpo: [] };
      secciones.push(actual);
      continue;
    }
    if (actual) actual.cuerpo.push(l);
  }
  return secciones.map((s) => {
    const cuerpo = s.cuerpo.join('\n');
    const tools = new Set();
    for (const m of cuerpo.matchAll(/tools\/([a-z-]+\.(?:mjs|sh))/g)) tools.add(m[1]);
    for (const [h, t] of Object.entries(HELPERS_A_HERRAMIENTA)) {
      // PT-101 · la barra era SIMPLE y no sobrevivia a la cadena: el patron compilaba a
      // «(^|s)<helper>s» —la LETRA s— y NO CASABA NUNCA. Ningun helper se detectaba, y no
      // fallaba nada: devolvia una lista vacia. Lo encontro audit en su PRIMERA corrida con
      // la comprobacion de construcciones fragiles que esta misma tarea añadio.
      if (new RegExp(`(^|\\s)${h}\\s`, 'm').test(cuerpo)) tools.add(t);
    }
    // PT-169 · el cuerpo se DEVUELVE: `seccionesConCaso` lo necesita, y recalcularlo en dos
    // sitios seria el mismo hecho partido en dos (RULE-01).
    return { titulo: s.titulo, cuerpo: s.cuerpo, herramientas: [...tools].sort() };
  });
}

/**
 * PT-086 · Qué secciones hay que correr cuando cambian `cambiadas`.
 *
 * Una seccion que no nombra NINGUNA herramienta corre siempre: no se sabe qué ejercita, y
 * saltarla seria decidir sin dato (RULE-06). El lado seguro del desconocimiento es correr de
 * mas, no de menos — lo contrario convertiria esto en una fabrica de falsos verdes.
 */
/**
 * PT-169 · QUE SECCIONES CONTIENEN UN CASO QUE CASA CON UN PATRON.
 *
 * PT-086 construyo el salto de secciones —«una seccion inactiva se salta ENTERA: sus casos y su
 * andamiaje»— y lo cableo SOLO a `--afectados`. `--solo` siguio filtrando aserciones y pagando
 * el andamiaje completo, que es lo que existe para evitar.
 *
 * MEDIDO en PT-169: `selftest.sh --solo "ZZZ_NO_EXISTE_NADA"` ejecuta CERO casos de 1749 y tarda
 * 252 SEGUNDOS. Cuatro minutos y doce para no asertar nada. El flag que existe para iterar rapido
 * no aceleraba nada, y por eso «tarda veinte minutos en mandar el error de uno solo».
 *
 * QUE ESTABLECE: que ninguna seccion cuyo cuerpo contenga el patron queda fuera.
 * QUE NO ESTABLECE: que las que devuelve sean todas necesarias. Se compara contra el CUERPO
 *   ENTERO de la seccion, no solo contra los nombres de caso, asi que un patron que aparezca en
 *   un comentario activa la seccion. Es deliberado: PECA DE MAS, como seccionesAfectadas — lo
 *   contrario convertiria esto en una fabrica de falsos verdes, que es peor que correr de mas.
 *
 * La comparacion es LITERAL, como el `case ... in *"$SOLO"*` del arnes: si aqui fuera regex y
 * alli literal, un patron con un punto activaria secciones que luego no ejecutarian ningun caso.
 */
/**
 * PT-167 · CASOS INVERTIDOS: LOS QUE SOLO PASAN MIENTRAS EXISTE EL DEFECTO QUE VIGILAN.
 *
 * PT-147 escribio tres casos para afirmar que los seis componentes entran en la auditoria de
 * fases, buscando «FIDE PHASE» en la salida de audit. Esa linea SOLO SE EMITE COMO HUECO: los tres
 * pasaban PORQUE FIDE, FPGE y Foundation FALLABAN, y se pusieron en rojo el dia en que dejaron de
 * fallar. Estuvieron en verde todo EP-022 afirmando LO CONTRARIO de lo que ocurria.
 *
 * Es RULE-02 por el reverso: el EXITO DEL CASO ERA EL FALLO DEL SISTEMA. No es un verificador
 * debil — es un INDICADOR INVERTIDO, que avisa mientras el defecto se arregla.
 *
 * EL DISCRIMINADOR NO ES LA PROSA DEL HUECO. Se probaron dos criterios mas amplios y los dos
 * producian ruido: comparar contra el TERCER argumento de gap() —la explicacion— daba 30 falsos
 * positivos, y comparar contra el ESQUELETO literal del segundo daba 9, porque «PHASE» aparece en
 * media metodologia. Un barrido asi se desactiva en la primera corrida, y un verificador
 * desactivado es peor que ninguno (SUITE-R60).
 *
 * Lo que discrimina es el IDENTIFICADOR del hueco INSTANCIADO: `${comp} PHASE ${n}` con los
 * nombres y siglas que COMPONENTES declara produce «FIDE PHASE», «FPGE fases» — cadenas que la
 * herramienta emite SOLO cuando algo falta y que no aparecen en ningun documento.
 *
 * QUE ESTABLECE: que un `chk` cuyo patron contiene una de esas cadenas esta afirmando un HUECO.
 * QUE NO ESTABLECE: que sea un defecto. Un caso que prueba que una regla PUEDE FALLAR asierta
 *   exactamente eso, y es lo contrario de un defecto — PT-149 tiene tres. Por eso la salida es una
 *   LISTA DE CANDIDATOS y no un fallo: la diferencia entre «afirma un hueco» y «prueba que el
 *   hueco se caza» es de INTENCION, y la intencion no esta en el texto (SUITE-R26).
 *
 * Medido: caza los CUATRO conocidos —FIDE PHASE, FPGE PHASE, Foundation PHASE, FPGE fases— y
 * NINGUNO de los tres legitimos de PT-149.
 */
/**
 * PT-151 · LO QUE CORRE `npm run verify` Y LO QUE CORRE CI, DERIVADO DE SUS DOS FUENTES.
 *
 * El CLAUDE.md publicaba «npm run verify · todo lo anterior, como en CI» y NO era cierto. Medido
 * en EP-022: verify en verde y el check `marco` en rojo con OCHO errores bloqueantes, porque
 * `verify-fdge --all` no estaba en verify. Un comando que promete equivaler a CI y no equivale
 * produce el fallo que este marco persigue: CREER QUE SE VERIFICO LO QUE NO SE VERIFICO.
 *
 * Y las divergencias eran TRES, no una — la tercera EN SENTIDO CONTRARIO:
 *   - `verify-fdge --all`   en CI y no en verify   (la conocida)
 *   - `revisar-secretos`    con --historial en CI y SIN el en verify: un secreto commiteado y
 *                           borrado despues pasa en local y falla en CI
 *   - `matriz:check`        en verify y NO en CI: una comprobacion cuyo rojo NADIE VE EN EL PR
 *
 * Por eso la comparacion se hace en LOS DOS SENTIDOS. Que verify compruebe de MENOS es peor que
 * de mas, pero las dos son la misma promesa rota.
 *
 * QUE ESTABLECE: que los dos conjuntos de scripts coincidan.
 * QUE NO ESTABLECE: que el paso HAGA lo mismo en los dos sitios. Se comparan NOMBRES DE SCRIPT,
 *   que es lo que se puede comparar: si CI invocara la herramienta directamente con otras
 *   banderas —como hacia hasta hoy— la diferencia volveria a ser invisible. Igualarlos a `npm run
 *   <script>` en los dos lados es lo que hace la comparacion posible, y esta declarado.
 */
export function pasosDeCI(yaml) {
  const fuera = [];
  for (const l of String(yaml ?? '').split(String.fromCharCode(10))) {
    const t = l.trim();
    if (!t.startsWith('run: npm run ')) continue;
    fuera.push(t.slice('run: npm run '.length).trim());
  }
  return [...new Set(fuera)].sort();
}


export function pasosDeVerify(scripts) {
  const cadena = String((scripts ?? {}).verify ?? '');
  const fuera = [];
  for (const trozo of cadena.split('&&')) {
    const t = trozo.trim();
    if (!t.startsWith('npm run ')) continue;
    fuera.push(t.slice('npm run '.length).trim());
  }
  return [...new Set(fuera)].sort();
}


export function identificadoresDeHueco(textos, valores) {
  const RE = /gap\(\s*'[^']*'\s*,\s*`([^`]{4,60})`/g;
  const fuera = new Set();
  for (const txt of textos ?? []) {
    for (const m of String(txt).matchAll(RE)) {
      const p = m[1];
      if (!p.includes('${')) { if (p.trim().length >= 6) fuera.add(p.trim()); continue; }
      for (const v of valores ?? []) {
        const s = p.replace(/\$\{[^}]*\}/, v).split('${')[0].trim();
        if (s.length >= 6) fuera.add(s);
      }
    }
  }
  return [...fuera].sort();
}


export function casosInvertidos(arnes, identificadores) {
  const RE = /^chk\s+"([^"]+)"\s+"([^"]+)"/;
  const fuera = [];
  // SUITE-R59 · sin regex: el escape se degrado aqui al escribirlo, por undecima vez en este
  // SUITE-R59 · sin regex: el escape se degrado aqui al escribirlo, por undecima vez en este
  // repositorio. Partir por codigo de caracter y recortar no tiene escapes que perder.
  String(arnes ?? '').split(String.fromCharCode(10)).forEach((l, i) => {
    const m = RE.exec(l);
    if (!m) return;
    for (const s of identificadores ?? []) {
      if (m[2].includes(s)) { fuera.push({ linea: i + 1, caso: m[1], patron: m[2], hueco: s }); break; }
    }
  });
  return fuera;
}


export function seccionesConCaso(texto, patron) {
  const p = String(patron ?? '');
  if (!p) return [];
  return seccionesDelArnes(texto)
    .filter((s) => s.titulo.includes(p) || (s.cuerpo ?? []).some((l) => l.includes(p)))
    .map((s) => s.titulo);
}


/**
 * PT-174 · QUIEN IMPORTA A QUIEN, DERIVADO DEL CODIGO.
 *
 * `seccionesAfectadas` comparaba el NOMBRE del archivo que la seccion menciona con el que cambio, y
 * ahi se acababa. Un cambio en `patrones.mjs` activaba 16 de 46 secciones — y a `patrones.mjs` lo
 * importan NUEVE herramientas, asi que las secciones que ejercitan `audit`, `build-core`,
 * `verify-suite`, `migrate` o `comparar-marco` NO se activaban aunque su comportamiento dependa de
 * lo que cambio.
 *
 * Es la mitad de la pregunta que el sello necesita: sellar sobre entradas incompletas certifica DE
 * MENOS, y un bloque sellado que dependia de algo que cambio se queda certificando lo que ya no es.
 *
 * SE DERIVA DEL CODIGO, no de una tabla. Un `import ... from './x.mjs'` es el hecho; enumerar a
 * mano quien importa a quien es la clase de mapa que este lote lleva seis tareas quitando.
 *
 * PECA DE MAS a proposito, como `seccionesAfectadas` ya hacia: correr de mas es recuperable, y
 * saltarse una seccion que tenia el caso es un falso verde (PT-086).
 */
/**
 * PT-182 · EL MAPA FASE→ARTEFACTO, EN UN SOLO SITIO Y CON QUIEN LO CONSULTE.
 *
 * Estaba escrito DOS VECES y a mano: `RASTRO_H` dentro de `cursor`, y disperso en `verify-fdge`
 * como llamadas a `exigible(regla, fase, archivo)`. Dos mapas del mismo hecho, y por eso daban
 * respuestas distintas sobre las mismas tareas — el cursor reportaba «30 nodos sin rastro» sobre un
 * lote que verify-fdge daba por limpio.
 *
 * Y EL CURSOR SABE Y NADIE LE PREGUNTA. Comprueba, fase a fase, que cada una dejo su artefacto — y
 * no lo invoca `package.json`, ni la CI, ni `avanzar`, ni ninguna compuerta.
 *
 * ESO ES LO QUE COSTO SEIS TAREAS. EP-024 y EP-025 produjeron siete guardas nuevas, y CINCO
 * arreglaban lo mismo: una regla HARD cuya unica comprobacion vivia en G4. PT-178 cerro un peldaño
 * —`avanzar` ya no sale de PHASE 1 sin intake— y dejo los otros cuatro abiertos.
 *
 * Aqui el mapa se declara UNA vez y `avanzar` lo consulta en CADA transicion: la fase que se cierra
 * tiene que haber dejado lo suyo. Las cinco dejan de ser hallazgos de G4 y pasan a ser imposibles.
 */
export const ARTEFACTO_DE_FASE = {
  1: { produce: 'intake.md', donde: 'changes' },
  3: { produce: 'strategy.md', donde: 'changes' },
  4: { produce: 'traceability.md', donde: 'changes' },
  6: { produce: 'manifest.json', donde: 'evidencia', tambien: 'self-review.md' },
  8: { produce: 'HISTORY.log', donde: 'ledger' },
};

/**
 * Que falta para dar por cerrada una fase. Devuelve `null` cuando la fase no declara artefacto —
 * que NO es lo mismo que estar completa (RULE-06): es que no se sabe, y se dice.
 */
export function faltaDeFase(fase, hay) {
  const d = ARTEFACTO_DE_FASE[Number(fase)];
  if (!d) return null;
  const falta = [];
  if (!hay(d.donde, d.produce)) falta.push(d.produce);
  if (d.tambien && !hay(d.donde, d.tambien)) falta.push(d.tambien);
  return falta.length ? { fase: Number(fase), falta, donde: d.donde } : { fase: Number(fase), falta: [] };
}

/**
 * PT-176 · EL BLOQUE DE UNA SECCION SE DERIVA DE CUANDO SE AÑADIO.
 *
 * PT-172 fijo que la version se declara EN EL INTAKE. Eso vale para lo que venga y DEJA FUERA TODO
 * LO ESCRITO — que es lo que el firmante señalo: «si no solo lo hara hacia adelante y no lo
 * anterior». Y todos los proyectos destino ya van empezados.
 *
 * Agrupar por la version del PT que la seccion NOMBRA dejaba fuera 20 de 46, incluida
 * «P · plataforma», que sola es el 28% de la bateria: no todas nombran un PT.
 *
 * Lo que SI tiene toda seccion es el commit que la introdujo, y ese commit declara una version en
 * package.json. De ahi sale su MAYOR, y de ahi su bloque. Es RETROACTIVO POR CONSTRUCCION: no hace
 * falta que nadie declare nada, ya esta escrito en la historia — y la historia la tiene cada
 * destino en su propio git.
 *
 * Medido en este repositorio: 46 de 46 secciones caen en un bloque, y con la version 13.x.x abierta
 * quedan SELLABLES 45 secciones · 1797 casos = 95% de la bateria.
 *
 * `mayorDe` se INYECTA: esta funcion no habla con git. Asi se puede comprobar sin repositorio, que
 * es la misma razon por la que `refExiste` se inyecta desde PT-079.
 */
export function bloquesDelArnes(titulos, mayorDe, versionActual) {
  const actual = Number(String(versionActual ?? '').split('.')[0]);
  const bloques = new Map();
  const sinBloque = [];
  for (const t of titulos ?? []) {
    const mayor = mayorDe(t);
    if (mayor === null || mayor === undefined) { sinBloque.push(t); continue; }
    const k = String(mayor);
    if (!bloques.has(k)) bloques.set(k, { mayor: Number(k), secciones: [], cerrado: false });
    bloques.get(k).secciones.push(t);
  }
  for (const b of bloques.values()) {
    // Un bloque esta CERRADO cuando su version mayor es anterior a la vigente. El abierto es el
    // de la version en curso: ahi se sigue escribiendo, asi que no se puede sellar.
    b.cerrado = Number.isFinite(actual) && b.mayor < actual;
  }
  return {
    bloques: [...bloques.values()].sort((a, b) => a.mayor - b.mayor),
    // RULE-06 · lo que no se puede clasificar NO se sella: se declara. Sellar por defecto
    // certificaria lo que no se midio, que es exactamente lo contrario de para que existe esto.
    sinBloque,
  };
}

/**
 * PT-175 · EL SELLO DE UN BLOQUE SE DERIVA DE SUS ENTRADAS.
 *
 * Un bloque certificado deja de correr. Para que eso no sea un falso verde, el sello tiene que
 * romperse SOLO cuando cambia algo de lo que el bloque depende — y romperse SIEMPRE que cambia.
 *
 * QUE ESTABLECE: que el texto de las secciones del bloque y el de las herramientas que esas
 *   secciones ejercitan —con su cierre transitivo, PT-174— son los mismos que cuando se sello.
 * QUE NO ESTABLECE: que el bloque PASE. El sello dice «nada de lo que mide ha cambiado», no
 *   «esto funciona». Lo segundo lo dijo la corrida que lo sello, y por eso el sello guarda su
 *   veredicto y su fecha.
 *
 * REABRIR NO ES VOLVER A CORRER. El firmante lo dijo con todas las letras: «si se necesita hacer
 * algun cambio de lo que ya esta sellado necesita saber que ademas del cambio debe abrir y probar
 * de nuevo COMO NUEVO». Un sello que no case no se recalcula solo: el bloque vuelve a la bateria
 * entera hasta que una corrida completa lo vuelva a sellar.
 *
 * Y ES DE LA VERSION DEL MARCO, NO DEL PROYECTO. Un destino que instale el paquete hereda el
 * sello del marco; lo que NO hereda es haberlo corrido en SU arbol. Por eso el sello incluye las
 * herramientas: si el destino las modifica, el sello deja de casar y el bloque vuelve a correr.
 */
export function selloDeBloque({ secciones, herramientas }) {
  const partes = [];
  for (const [titulo, cuerpo] of Object.entries(secciones ?? {}).sort()) {
    partes.push(`sec:${titulo}`, selloDe(cuerpo));
  }
  for (const [nombre, texto] of Object.entries(herramientas ?? {}).sort()) {
    partes.push(`tool:${nombre}`, selloDe(texto));
  }
  return selloDe(partes.join('\n'));
}

/**
 * Que le pasa a un bloque sellado cuando algo cambia. Devuelve el veredicto y POR QUE, porque un
 * «no cuadra» sin la razon obliga a ir a buscarla — y eso es lo que hace que se ignore.
 */
export function estadoDeBloque(sellado, ahora) {
  if (!sellado || !sellado.sello) {
    return { estado: 'SIN_SELLAR', porque: 'no consta ningun sello: el bloque corre entero.' };
  }
  if (sellado.sello !== ahora) {
    return {
      estado: 'REABIERTO',
      porque: `el sello no casa (${String(sellado.sello).slice(0, 12)} != ${String(ahora).slice(0, 12)}): `
        + 'algo de lo que el bloque mide ha cambiado. Vuelve a la bateria ENTERA hasta que una '
        + 'corrida completa lo selle de nuevo — reabrir no es volver a correrlo (PT-175).',
    };
  }
  if (sellado.veredicto !== 'OK') {
    return {
      estado: 'SELLADO_EN_ROJO',
      porque: `el sello casa pero su corrida termino en «${sellado.veredicto}». Un bloque no se `
        + 'certifica por no haber cambiado: se certifica por haber PASADO.',
    };
  }
  return { estado: 'SELLADO', porque: `sellado el ${sellado.fecha ?? '?'} con veredicto OK.` };
}

/**
 * PT-176 · DE QUE DEPENDE UNA HERRAMIENTA — el cierre HACIA ABAJO.
 *
 * `importadoresDe` sube: quien importa a lo que cambio. Para SELLAR hace falta lo contrario: dado
 * lo que una seccion ejercita, de que depende — porque un cambio en una dependencia cambia el
 * comportamiento de la seccion aunque la seccion no la nombre.
 *
 * SIN ESTO EL SELLO ERA INUTIL EN LA PRACTICA. La primera version metia TODAS las herramientas en
 * el sello de TODOS los bloques: tocar cualquier archivo rompia todos los sellos, y en este
 * repositorio casi toda sesion toca alguno. El 95% de ahorro habria sido teorico — la bateria
 * habria corrido entera igual, con una capa mas encima.
 */
export function dependenciasDe(fuentes, objetivos) {
  const deps = new Map();
  for (const [nombre, texto] of Object.entries(fuentes ?? {})) {
    const d = new Set();
    for (const m of String(texto).matchAll(/from\s+'\.\/([A-Za-z0-9_.-]+\.mjs)'/g)) d.add(m[1]);
    for (const m of String(texto).matchAll(/import\([^)]*['"]\.\/([A-Za-z0-9_.-]+\.mjs)/g)) d.add(m[1]);
    deps.set(nombre, d);
  }
  const dentro = new Set((objetivos ?? []).map((f) => String(f).split('/').pop()));
  let crecio = true;
  while (crecio) {
    crecio = false;
    for (const n of [...dentro]) {
      for (const d of deps.get(n) ?? []) if (!dentro.has(d)) { dentro.add(d); crecio = true; }
    }
  }
  return [...dentro].filter((f) => deps.has(f));
}

export function importadoresDe(fuentes, objetivos) {
  const grafo = new Map();
  for (const [nombre, texto] of Object.entries(fuentes ?? {})) {
    const deps = new Set();
    for (const m of String(texto).matchAll(/from\s+'\.\/([A-Za-z0-9_.-]+\.mjs)'/g)) deps.add(m[1]);
    for (const m of String(texto).matchAll(/import\([^)]*['"]\.\/([A-Za-z0-9_.-]+\.mjs)/g)) deps.add(m[1]);
    grafo.set(nombre, deps);
  }
  // El cierre: quien importa a algo que ya esta dentro, entra.
  const dentro = new Set((objetivos ?? []).map((f) => String(f).split('/').pop()));
  let creció = true;
  while (creció) {
    creció = false;
    for (const [nombre, deps] of grafo) {
      if (dentro.has(nombre)) continue;
      for (const d of deps) if (dentro.has(d)) { dentro.add(nombre); creció = true; break; }
    }
  }
  return [...dentro];
}

export function seccionesAfectadas(texto, cambiadas) {
  const quiere = new Set((cambiadas ?? []).map((f) => f.split('/').pop()));
  return seccionesDelArnes(texto)
    .filter((s) => !s.herramientas.length || s.herramientas.some((t) => quiere.has(t)))
    .map((s) => s.titulo);
}


/**
 * PT-088 · `SUITE-R09` · Un ledger append-only no pierde lineas.
 *
 * QUE ESTABLECE: que, entre `base` y ahora, ninguna linea del archivo DESAPARECIO.
 * QUE NO ESTABLECE: que el contenido no se haya alterado. Una reescritura que conserve el
 *   RECUENTO pasa. Es mas fuerte que nada y mas debil que un hash encadenado, y la diferencia
 *   se dice aqui en vez de disimularse — es exactamente el defecto que PT-087 cierra.
 *
 * Por que la ventana es el TAG anterior y no `HEAD~1` ni `origin/main`:
 *   - `HEAD~1` deja pasar para siempre una reescritura de hace tres commits.
 *   - `origin/main` fue el error de PT-081: la comprobacion se apaga el dia que lo que busca
 *     aterriza en main. Un tag es una marca inmutable y deliberada, y SUITE-R57 garantiza que
 *     el anterior nunca queda muy atras.
 *
 * `diffDe(archivo)` devuelve el texto de `git diff <base> HEAD -- archivo`, o `null` si no se
 * pudo obtener. NULL NO ES CERO: sin repositorio o sin tag no hay reloj, y se devuelve `null`
 * para que quien llame lo distinga de «ninguna linea borrada». Es la leccion de PT-058.
 */
export function lineasPerdidas(archivos, diffDe) {
  const fuera = [];
  for (const f of archivos ?? []) {
    const d = diffDe(f);
    if (d == null) { fuera.push({ archivo: f, borradas: null }); continue; }
    let borradas = 0;
    for (const l of String(d).split(/\r?\n/)) {
      if (l.startsWith('---') || l.startsWith('+++')) continue;
      if (l.startsWith('-')) borradas++;
    }
    if (borradas > 0) fuera.push({ archivo: f, borradas });
  }
  return fuera;
}

/**
 * PT-088 · `EXEC-R04` · Todo avance de la rama por defecto deja constancia con nombre.
 *
 * QUE ESTABLECE: que existe una entrada de autorizacion, con un nombre que figura en
 *   `firmantes`, para cada merge a la rama por defecto POSTERIOR a la version de entrada.
 * QUE NO ESTABLECE: que la autorizacion fuera real. El agente escribe la constancia. Es el
 *   limite que SUITE-R27 declara para las firmas, y H-009 pide declararlo tambien aqui: lo
 *   decide PT-093.
 *
 * La ventana importa tanto como la comprobacion: medido en el repositorio real hay 18 merges
 * a main y UNO desde el ultimo tag. Sin ventana, la regla nace con 17 fallos sobre trabajo de
 * agosto — y una comprobacion que nace roja se apaga, que es lo que PT-023 midio.
 *
 * `merges` es [{sha, fecha}] ya acotado a la ventana; `constancias` es [{nombre, fecha}]
 * extraidas del ledger de sesion. Se empareja por FECHA, no por sha: la constancia se escribe
 * ANTES del merge y no puede citar un sha que todavia no existe.
 */
export function mergesSinConstancia(merges, constancias, firmantes) {
  const validos = new Set((firmantes ?? []).map((s) => String(s).trim()).filter(Boolean));
  const dias = new Set((constancias ?? [])
    .filter((c) => validos.has(String(c?.nombre ?? '').trim()))
    .map((c) => String(c?.fecha ?? '').slice(0, 10)));
  return (merges ?? [])
    .filter((m) => !dias.has(String(m?.fecha ?? '').slice(0, 10)))
    .map((m) => ({ sha: m.sha, fecha: m.fecha }));
}


/**
 * PT-087 · El SUJETO de una comprobacion: que hecho pretende establecer, y cual NO.
 *
 * Siete veces seguidas el marco comprobo un proxy barato en lugar del hecho, y las siete
 * tienen la misma forma: el observable es mas barato que el sujeto, y EL HUECO ENTRE LOS DOS
 * NO ESTABA ESCRITO EN NINGUN SITIO.
 *
 *   SUITE-R34   «el estado dice la verdad»          leia la FECHA del archivo
 *   FDGE-R43    «el grafo describe el codigo»       leia si se MOVIERON archivos
 *   audit       «la regla tiene verificador»        leia si su ID APARECE
 *   regla       «que dice una regla»                leia la PRIMERA LINEA que la cita
 *   sellar 1    «la guia enumera las nuevas»        leia que la entrada EXISTA
 *   SUITE-R27   «la firma es de la lista»           leia una FRASE en todo el archivo
 *   revento()   «la herramienta revento»            leia una PALABRA en toda la salida
 *
 * QUE ESTABLECE este mecanismo: que la comprobacion DECLARA su sujeto y su limite, y que el
 *   limite LLEGA AL MENSAJE que el usuario lee.
 * QUE NO ESTABLECE: que el sujeto declarado sea cierto. Un autor puede escribir «establece que
 *   el grafo describe el codigo» sobre una funcion que mira mtime, y esto lo aceptara.
 *   Comprobarlo exigiria entender el codigo, y prometerlo seria la OCTAVA instancia.
 *
 * Lo que si impide es lo que paso siete veces: que nadie se hiciera la pregunta, y que el
 * hueco no existiera por escrito donde el usuario lo ve.
 *
 * ADOPCION DECLARADA, no cobertura total. Hay 313 emisiones y 105 reglas que emiten; exigirlo
 * a todas de golpe nace con cientos de fallos, y una comprobacion que nace roja se apaga
 * (PT-023). La tabla crece; lo que la hace util es que NADIE PUEDA QUEDARSE FUERA EN SILENCIO.
 */
const BS_B = String.fromCharCode(92) + "b";
const BS_S = String.fromCharCode(92) + "s";
const BS_D = String.fromCharCode(92) + ".";
const BS_P = String.fromCharCode(92) + "(";
const BS_PC = String.fromCharCode(92) + ")";
const RE_SALTO = new RegExp(String.fromCharCode(92) + "r?" + String.fromCharCode(92) + "n");

/**
 * PT-130 · AC-04 · las lecturas de ALCANCE AMPLIO, enumeradas.
 *
 * Una lectura de alcance amplio busca una marca en TODO un texto y concluye algo sobre un hecho
 * concreto. Es barata y casi siempre acierta — hasta que el texto DESCRIBE el hecho que la marca
 * senala, y entonces acusa a quien lo documenta (CE-017).
 *
 * NO SE ARREGLAN AQUI. Se ENUMERAN, que es lo que RULE-06 pide: se declara lo medido y no se
 * promete lo no medido. Arreglar once lecturas de golpe, sin un caso que sostenga cada una,
 * seria cambiar once comportamientos a ciegas.
 *
 * QUE CUENTA COMO ALCANCE AMPLIO, y por que asi: una variable cuyo nombre dice que es un archivo
 * o un cuerpo entero —txt, texto, cuerpo, contenido, md, doc— sobre la que se pregunta
 * «.includes(» o «.test(». Es una heuristica y se dice: no enumera intenciones, enumera FORMAS.
 * Una lectura amplia legitima entra en la lista igual, y sacarla exige mirarla.
 */
export function lecturasDeAlcanceAmplio(fuentes) {
  if (!fuentes) return null;
  const RE = new RegExp(
    '(' + BS_B + '(?:txt|texto|cuerpo|contenido|md|doc|fuente|bloque)[A-Za-z]*)'
    + BS_S + '*' + BS_D + 'includes' + BS_P,
    'g');
  const RE2 = new RegExp(
    '(' + BS_B + '[A-Za-z_]*(?:RE|Re|regex|patron)[A-Za-z_]*)' + BS_D + 'test' + BS_P
    + BS_S + '*(?:txt|texto|cuerpo|contenido|md|doc|fuente|bloque)[A-Za-z]*' + BS_S + '*' + BS_PC,
    'g');
  const salida = [];
  for (const { archivo, texto } of fuentes) {
    String(texto).split(RE_SALTO).forEach((linea, i) => {
      const l = linea.trim();
      if (l.startsWith('//') || l.startsWith('*') || l.startsWith('/*')) return;
      const m = RE.exec(linea) ?? RE2.exec(linea);
      RE.lastIndex = 0; RE2.lastIndex = 0;
      if (m) salida.push({ archivo, linea: i + 1, sobre: m[1], texto: l.slice(0, 120) });
    });
  }
  return salida;
}

export const SUJETOS = {
  'SUITE-R09': {
    establece: 'ninguna linea anterior del ledger desaparecio ni cambio desde el tag',
    noEstablece: 'correccion legitima de una falsificacion',
  },
  // PT-130 · la lectura se ancla al SUJETO de cada linea. Decir aqui QUE evalua es lo que impide
  // que alguien lea el rojo como «el bloque entero contradice al registro».
  // PT-122 · la regla distingue por MARCA DE PROCEDENCIA, no por autor, y eso tiene un limite
  // que hay que decir: la marca solo garantiza lo que la herramienta escribe.
  'SUITE-R43': {
    establece: 'todo comentario posterior a la ultima nota MARCADA del agente esta sin responder, '
      + 'y si ninguno lleva marca lo dice SIN EVALUAR en vez de suponerlo',
    noEstablece: 'un comentario sin marca se atribuye a una persona, asi que uno del agente '
      + 'escrito FUERA del comando cuenta igual: por contenido son indistinguibles',
  },
  'SUITE-R34': {
    establece: 'el SUJETO de «tarea:» —el primer identificador— no esta terminal en el registro '
      + 'mientras la linea lo presenta en curso, y ningun lote declarado ABIERTA o CERRADA se '
      + 'contradice con su estado',
    noEstablece: 'NO evalua los demas identificadores que la linea mencione',
  },
  'EXEC-R04': {
    establece: 'existe constancia con un nombre de firmantes para cada merge a la principal',
    noEstablece: 'NO prueba que la autorización',
  },
  'SUITE-R01': {
    establece: 'nada: es una regla sombrilla y se instancia en FDGE-R23, FDGE-R24, PTSA-R14 y SUITE-R11',
    noEstablece: null,   // declarada NO_VERIFICABLE: no hay mensaje donde poner un limite
  },
  // PT-094 · el limite estaba escrito en un comentario de PT-056 y no llegaba a ningun mensaje:
  // `actions/checkout` deja detached HEAD en cada `pull_request`, y ahi la rama no se puede leer.
  // La comprobacion es CIEGA justo donde todos los PR la ejecutan, y solo abre los ojos en el
  // push a la principal — donde ya no hay PR que bloquear. Eso dejo `main` en rojo una hora sin
  // que ningun PR pudiera avisarlo.
  'LEX-R26': {
    establece: 'el commit declarado es alcanzable, y en una tarea VIVA el arbol corresponde a lo declarado',
    noEstablece: 'NO establece que la rama corresponda',
  },
  // PT-095 · la frontera es de DIA, y eso deja escapar lo escrito la vispera del sello. Se
  // prefiere ese error al contrario —juzgar hacia atras— que es el que dejaba main rojo sin
  // arreglo posible en un ledger append-only.
  'EXEC-R04a': {
    establece: 'toda entrada POSTERIOR al sello de la version que trajo la regla lleva un nombre de firmantes',
    noEstablece: 'NO establece nada sobre lo escrito el mismo dia del sello ni antes',
  },
};

/**
 * PT-095 · ¿este encabezado ANUNCIA una autorizacion?
 *
 * `EXEC-R04a` leia `/G4|VoBo|autorizad/` sobre el encabezado, y con eso tres entradas del
 * 2026-08-13 que dicen «`EP-00N` cerrado · version X · A LA ESPERA DE `G4`» contaban como
 * autorizaciones malformadas. Anuncian que ESPERAN una compuerta, que es lo contrario.
 *
 * No se afina el detector positivo —eso mueve el problema— sino que se EXCLUYE la espera, que es
 * un vocabulario corto y cerrado. El positivo se deja como estaba para no dejar fuera ninguna
 * constancia que hoy vale.
 *
 * QUE ESTABLECE: que el encabezado nombre una autorizacion y no una espera.
 * QUE NO ESTABLECE: que el cuerpo diga lo que el encabezado anuncia. Eso lo mira quien lo lee.
 */
/**
 * PT-170 · UNA CONSTANCIA SE RECONOCE POR SU FORMA, NO POR LAS PALABRAS DE SU TITULO.
 *
 * Reconocia el encabezado buscando «G4», «VoBo» o «autorizad». Una constancia REAL —con la frase
 * literal del firmante, su nombre en `firmantes` y sus limites declarados— salio como NO
 * AUTORIZADA porque su titulo decia «Autorizacion», que NO CONTIENE «autorizad»: FALLA POR UNA
 * «d». Y el mensaje mandaba a quien lo leia al sitio equivocado —«sin constancia»— cuando lo que
 * habia era una constancia QUE NO SE RECONOCE.
 *
 * Ampliar la lista de palabras seria perseguir el idioma, y ademas la haria mas ANCHA: un
 * encabezado que hable de autorizaciones sin serlo pasaria, que es contra lo que PT-095 escribio
 * `RE_ESPERA`. Lo que no se puede escribir «con otras palabras» es un DATO ESTRUCTURADO.
 *
 * Asi que se admiten LAS DOS VIAS y se dice cual es cual:
 *   - el ENCABEZADO anuncia —compatible con lo escrito hasta hoy—, o
 *   - el CUERPO lleva el campo `Autoriza:` con un nombre, que es la forma.
 * La segunda no depende de como se titule el bloque; la primera se conserva porque hay
 * constancias escritas asi y CE-014 dice que una regla nueva no juzga hacia atras.
 */
export const RE_CAMPO_AUTORIZA = /^\s*Autoriza:\s*(?!\[)(\S.*)$/im;

export const anunciaAutorizacion = (encabezado, cuerpo) => {
  const h = String(encabezado ?? '');
  if (RE_CAMPO_AUTORIZA.test(String(cuerpo ?? ''))) return true;
  return RE_ANUNCIA.test(h) && !RE_ESPERA.test(h);
};

/**
 * PT-095 · ¿alcanza esta regla a algo escrito en `fecha`?
 *
 * `PT-081` construyo `RIGE_DESDE` para que «una regla nueva no rija hacia atras», y quedo aplicado
 * A MEDIAS: la version de entrada decide si la COMPROBACION corre, no a que ALCANZA. `EXEC-R04a`
 * nacio con la 11.0.0 y estaba juzgando entradas del 13 de agosto — en un ledger append-only,
 * donde corregirlas esta PROHIBIDO. Una regla que no se puede cumplir no es exigente: esta rota.
 *
 * `frontera` es la fecha del tag de la version que trajo la regla, derivada de git. Si no hay tag
 * no hay frontera y la regla NO ALCANZA a nada: no poder situar el limite no es no tenerlo.
 *
 * QUE ESTABLECE: que lo juzgado se escribio DESPUES del dia en que la version se etiqueto.
 * QUE NO ESTABLECE: nada dentro de ese mismo dia. La granularidad es de DIA, asi que lo escrito
 *   la vispera del sello escapa — y se prefiere ese error al contrario, que es juzgar hacia atras.
 */
export function alcanzadaPor(fecha, frontera) {
  if (!frontera) return false;
  const f = String(fecha ?? '');
  return /^\d{4}-\d{2}-\d{2}$/.test(f) && f > String(frontera);
}

/**
 * PT-095 · una entrada MALFORMADA de un ledger append-only se corrige ANADIENDO.
 *
 * `SUITE-R09` prohibe editar, asi que sin esto una constancia con el nombre mal escrito deja la
 * rama principal roja PARA SIEMPRE: la unica salida seria editar el ledger, que es justo lo que
 * la otra regla prohibe. Dos reglas que se hacen imposibles entre si — lo que `PT-029` construyo
 * un detector para encontrar.
 *
 * `HISTORY.log` ya resuelve esto desde `PT-046` con las entradas `CORRIGE`, y `FDGE-R29` las
 * PREFIERE. Aqui se aplica el mismo mecanismo al mismo problema: no es vocabulario nuevo.
 *
 * QUE ESTABLECE: que existe una entrada DEL MISMO DIA que dice CORRIGE y lleva un nombre de
 * firmantes.
 * QUE NO ESTABLECE: que corrija ESA entrada en concreto. Eso lo dice su texto, y lo lee una
 *   persona — igual que `FDGE-R29` no comprueba que una correccion corrija lo que dice corregir.
 */
export function corregidaDespues(fecha, bloques, lista) {
  return (bloques ?? []).some((b) => {
    const m = /^(\d{4}-\d{2}-\d{2})\s+·\s+(.*)/.exec(b);
    // EL MISMO DIA, no «cualquier dia posterior». Lo encontro la prueba inversa de este PT: con
    // «posterior» UNA sola entrada CORRIGE excusaba TODO el ledger anterior para siempre, y la
    // inversa salio en cero — o sea que el caso no probaba nada. Excusar es facil de convertir
    // en un agujero, y ese era el agujero.
    //
    // El mismo dia es la ventana real: una constancia mal escrita se corrige al notarlo, y
    // EXEC-R04 ya empareja merges con constancias POR FECHA.
    if (!m || m[1] !== String(fecha)) return false;
    // Sin la clase de palabra de un regex: escribirla aqui ya se convirtio UNA vez en el
    // editor, y un regex que busca un caracter de control no casa nunca y NO SE VE al leer.
    // Es la misma leccion que PT-085 dejo sobre las secuencias de escape en tools/.
    if (!m[2].includes('CORRIGE')) return false;
    return (lista ?? []).some((n) => b.includes(n));
  });
}

/** El sujeto declarado de `id`, o `null` si la regla todavia no lo declara. */
export const sujetoDe = (id) => SUJETOS[id] ?? null;

/**
 * PT-087 · Las reglas del registro cuyo sujeto esta INCOMPLETO.
 *
 * Una celda vacia no pasa, por lo mismo que no pasa en LAYOUT ni en SELLO (FND-R22): es
 * indistinguible de una que nadie miro. `noEstablece: null` SI vale, y es distinto de vacio:
 * es una declaracion explicita de que no hay limite que expresar — el caso de una regla que
 * no se verifica en absoluto.
 */
export function sujetosIncompletos(sujetos = SUJETOS) {
  return Object.entries(sujetos ?? {})
    .filter(([, s]) => !String(s?.establece ?? '').trim() || s?.noEstablece === undefined)
    .map(([id]) => id);
}

/**
 * PT-087 · El limite declarado tiene que LLEGAR AL MENSAJE.
 *
 * Es la mitad que hace trabajo. En las siete instancias, cuando el limite estaba escrito vivia
 * en un COMENTARIO del codigo fuente — donde solo lo ve quien ya esta leyendo el codigo, o sea
 * quien no lo necesita. Un limite que no llega al mensaje no protege a nadie.
 *
 * `emisiones` es {herramienta: texto}. Se busca la frase de `noEstablece` en el texto de la
 * herramienta; basta con que aparezca en una. Las reglas con `noEstablece: null` se saltan.
 */
export function limitesQueNoLleganAlMensaje(sujetos, emisiones) {
  const cuerpos = Object.values(emisiones ?? {}).join('\n');
  return Object.entries(sujetos ?? {})
    .filter(([, s]) => s?.noEstablece != null && String(s.noEstablece).trim())
    .filter(([, s]) => !cuerpos.includes(String(s.noEstablece).trim()))
    .map(([id]) => id);
}

/**
 * PT-087 · QUINTA instancia del patron: la guia de migracion ENUMERA las reglas nuevas.
 *
 * El paso 1 de «tracker sellar» no comprobaba nada: era una linea de una lista. Yo verifique a
 * mano que la entrada del CHANGELOG existiera y DI POR HECHO que enumeraba lo nuevo. No lo
 * hacia: SUITE-R57 —regla HARD que bloquea G2— quedo fuera de la guia de la 10.0.0, y un
 * proyecto destino se habria encontrado G2 bloqueada sin una linea que se lo explicara.
 *
 * QUE ESTABLECE: que toda regla cuya version de entrada es la vigente aparece NOMBRADA en la
 *   entrada del CHANGELOG de esa version.
 * QUE NO ESTABLECE: que lo que la guia diga de ella sea correcto ni suficiente. Nombrarla es
 *   el minimo comprobable; que la instruccion sirva lo sabe quien la sigue.
 *
 * `entrada` es el texto de la entrada del CHANGELOG de `version`, ya recortado.
 */
export function reglasNuevasFueraDeLaGuia(rigeDesde, version, entrada) {
  if (!entrada) return null;                 // sin entrada no hay guia que contrastar
  const v = String(version ?? '').split('.').map((n) => Number(n) || 0);
  return Object.entries(rigeDesde ?? {})
    .filter(([, d]) => d[0] === v[0] && d[1] === v[1] && d[2] === v[2])
    .filter(([id]) => !String(entrada).includes(id))
    .map(([id]) => id);
}

/**
 * PT-091 · H-007 · Las cifras del inventario se DERIVAN, no se transcriben.
 *
 * `inventory/services.md` se genero el 2026-08-19 y OCHO de sus dieciseis cifras ya no
 * describian el arbol un dia despues. Todas hacia arriba, porque EP-017 aterrizo detras. Al
 * medirlo de nuevo durante EP-018 las distancias habian CRECIDO: selftest.sh documentado 3541
 * contra 4919 reales.
 *
 * PTSA-R76 obliga a construir el universo auditable DESDE el inventario. Un inventario que
 * envejece en un dia convierte la fuente mecanica de la auditoria en una fuente de memoria — y
 * en PTSA-2026-08-20 no llego a estropear nada solo porque el auditor enumero contra `ls`, que
 * fue una decision suya y no una propiedad del marco.
 *
 * QUE ESTABLECE: que cada cifra transcrita coincide con la que se deriva del arbol.
 * QUE NO ESTABLECE: que la DESCRIPCION en prosa sea cierta. Que services.md diga bien cuantas
 *   lineas tiene tracker.mjs no dice nada sobre si describe bien lo que hace.
 *
 * `texto` es el de services.md. Devuelve [{herramienta, lineas}] tal como estan ESCRITAS.
 */
export function cifrasTranscritas(texto) {
  const filas = [];
  for (const l of String(texto ?? '').split(/\r?\n/)) {
    const m = /^\|\s*`([a-z0-9-]+\.(?:mjs|sh))`\s*\|\s*(\d+)\s*\|/.exec(l);
    if (m) filas.push({ herramienta: m[1], lineas: Number(m[2]) });
  }
  return filas;
}

/**
 * PT-091 · Las cifras transcritas que ya no describen el arbol.
 *
 * `realDe(herramienta)` devuelve el recuento real, o `null` si el archivo no existe. NULL NO
 * ES CERO: una herramienta retirada es un hecho distinto de una con cero lineas, y se nombra
 * aparte para que no se confunda con una cifra desviada (PT-058).
 */
export function cifrasQueMienten(transcritas, realDe) {
  const fuera = [];
  for (const f of transcritas ?? []) {
    const real = realDe(f.herramienta);
    if (real == null) { fuera.push({ ...f, real: null, motivo: 'no existe' }); continue; }
    if (Number(real) !== Number(f.lineas)) fuera.push({ ...f, real: Number(real), motivo: 'desviada' });
  }
  return fuera;
}

/**
 * PT-091 · H-006 · Los recuentos de CLAUDE.md.
 *
 * Decia 15 herramientas y 4 comandos cuando eran 16 y 7. Se corrigio A MANO en la auditoria, y
 * ese arreglo es exactamente el que vuelve a caducar: la proxima herramienta lo falsea otra vez.
 *
 * QUE ESTABLECE: que el numero escrito coincide con el derivado.
 * QUE NO ESTABLECE: que la lista de comandos este completa ni en el orden util — solo que su
 *   CANTIDAD cuadre. Enumerarlos bien es prosa, y la prosa no se deriva.
 */
export function recuentosDeClaude(texto) {
  const out = {};
  const h = /HERRAMIENTAS\s*[-─—]+\s*(\d+)/.exec(String(texto ?? ''));
  if (h) out.herramientas = Number(h[1]);
  const c = /El binario[^:\n]*:\s*([^\n]+)/.exec(String(texto ?? ''));
  if (c) out.comandos = c[1].split('·').map((s) => s.trim()).filter(Boolean).length;
  return out;
}

/**
 * PT-128 · EL CURSOR · los nodos del recorrido se DERIVAN, no se enumeran a mano.
 *
 * «un cursor que nos indique en donde estamos parados, de donde venimos y a donde vamos, lo mas
 * parecido a un cursor en un arbol binario donde cada nodo es una cajita que tiene el dato, el
 * puntero de salida hacia la derecha y el de la izquierda, y va recorriendo los padres e hijos
 * para no perderse ninguna puerta ningun comportamiento».
 *
 * LAS FASES Y SUS COMPUERTAS SALEN DE PHASES.md. Escribirlas aqui seria una segunda copia de una
 * lista que ya existe, y PT-080 midio que tres copias de una regla divergen las tres sin que nada
 * las compare. El encabezado de PHASES.md ya lleva las dos cosas:
 *
 *     ### PHASE 1 · Intake — **G1**
 *     ### PHASE 2 · Analysis — `2-B` bug/investigacion · ...
 *
 * QUE ESTABLECE: que fase existe, como se llama, y que compuerta la cierra si la cierra alguna.
 * QUE NO ESTABLECE: que la fase se haya hecho. Eso lo dice el registro, y son cosas distintas —
 *   confundirlas es exactamente el defecto que este cursor existe para no repetir.
 */
export function fasesDeFDGE(textoDePhases) {
  const t = String(textoDePhases ?? '');
  // Solo el bloque de FDGE: Foundation y QA tienen sus propias PHASE con los mismos numeros, y
  // mezclarlas daria dos nodos distintos con el mismo nombre.
  const bloque = t.split(/^## FDGE\s*$/m)[1] ?? '';
  const hasta = bloque.split(/^## /m)[0] ?? '';
  const fases = [];
  for (const m of hasta.matchAll(/^### PHASE (\d+) · ([^\n]*)$/gm)) {
    const titulo = m[2];
    // La compuerta va en el propio encabezado, en negrita: «— **G1**».
    const g = titulo.match(/\*\*(G\d)\*\*/);
    fases.push({
      n: Number(m[1]),
      nombre: titulo.split(/ — | · /)[0].trim(),
      compuerta: g ? g[1] : null,
    });
  }
  return fases;
}

/**
 * PT-128 · AC-04 · LA GARANTIA ES POR ENUMERACION, NO POR CONSULTA.
 *
 * Es el mismo principio que PTSA-R79: se cierra cuando la enumeracion esta completa, no cuando el
 * que busca deja de encontrar. Un nodo sin visitar SE NOMBRA; no se asume cumplido.
 *
 * Y no se inventa lo que no se puede saber: una fase por la que el registro no puede decir si se
 * paso sale SIN EVALUAR, que es DISTINGUIBLE de «visitada» (RULE-06). Sin esa distincion el
 * cursor prometeria cobertura donde solo tiene silencio — el defecto que EP-020 midio NUEVE veces
 * en su propio lote.
 *
 * QUE ESTABLECE: que fases del recorrido tienen rastro, cuales no lo tienen, y cuales no se
 *   pueden evaluar.
 * QUE NO ESTABLECE: que lo hecho en una fase con rastro sea correcto. Que exista la nota de
 *   PHASE 5 no dice nada sobre el codigo que se escribio en ella.
 */
export function nodosSinVisitar(fases, faseActual, rastro) {
  const actual = Number(faseActual);
  if (!Number.isFinite(actual)) {
    return { visitados: [], sinVisitar: [], sinEvaluar: (fases ?? []).map((f) => f.n) };
  }
  const visitados = [];
  const sinVisitar = [];
  const sinEvaluar = [];
  for (const f of fases ?? []) {
    if (f.n > actual) continue;              // todavia no toca: no es «sin visitar», es futuro
    const r = rastro?.(f.n);
    if (r === null || r === undefined) sinEvaluar.push(f.n);
    else if (r) visitados.push(f.n);
    else sinVisitar.push(f.n);
  }
  return { visitados, sinVisitar, sinEvaluar };
}

/**
 * PT-141 · Manejadores de error que referencian un identificador que no existe en su ambito.
 *
 * `tracker.mjs:1849` tenia esto:
 *
 *     catch { fail('SUITE-R56', `... tiene el enlace ${origen} y no se pudo reescribir.`); }
 *
 * `origen` no existe ahi —la variable se llama `ref`—, asi que EL MANEJADOR DE ERROR LANZA OTRO
 * ERROR: tapa el fallo real, mata el comando, y lo hace en la ruta menos probada del codigo, la
 * que solo corre cuando algo YA ha ido mal.
 *
 * Se vio ejecutando `tracker abrir --aplicar`: revento con «origen is not defined» Y AUN ASI
 * HABIA CREADO EL ISSUE. Un comando que falla y deja efecto es lo contrario de lo que este marco
 * promete.
 *
 * QUE MIDE, exactamente: un bloque `catch` cuyo cuerpo interpola un identificador que (a) no es
 * el que el propio `catch` enlaza, (b) no es una funcion ni una constante del modulo, y (c) no se
 * declara dentro del bloque. Es una heuristica y se declara como tal: no sustituye a un
 * analizador, reconoce LA FORMA que ya mordio.
 *
 * `fuentes` es `[{ nombre, texto }]`. Devuelve `null` si no se le pasa nada —no se afirma que no
 * haya— y si no, la lista de hallazgos con archivo, linea y el identificador.
 */
export function manejadoresRotos(fuentes) {
  if (!Array.isArray(fuentes) || !fuentes.length) return null;   // sin fuentes: SIN EVALUAR
  const hallazgos = [];
  for (const { nombre, texto } of fuentes) {
    // Los COMENTARIOS se quitan antes de mirar. El comentario que EXPLICA este defecto lo
    // contiene —«catch { … ${origen} … }»— y la autorreferencia ya mordio cuatro veces en este
    // repositorio: el lint de PT-135 se encontro a si mismo, y PT-130 tuvo el mismo problema.
    //
    // Se sustituyen por espacios en vez de borrarse, para que los numeros de linea no se muevan:
    // un hallazgo que apunta a la linea equivocada es peor que no tenerlo.
    const src = String(texto ?? '')
      .replace(/\/\*[\s\S]*?\*\//g, (b) => b.replace(/[^\r\n]/g, ' '))
      .replace(/(^|[^:])\/\/[^\r\n]*/g, (b, p) => p + ' '.repeat(b.length - p.length));
    const lineas = src.split(/\r?\n/);
    // TODO lo que el archivo declara EN CUALQUIER SITIO. No se distingue el ambito —eso exigiria
    // un analizador— y por eso la heuristica solo afirma lo SEGURO: si un identificador no se
    // declara NUNCA en el archivo, no puede estar en ambito dentro de un catch suyo.
    //
    // La primera version solo miraba el nivel superior y daba NUEVE hallazgos, seis de ellos
    // locales de la funcion que envuelve al catch. Un detector que grita seis veces de nueve no
    // se usa: se apaga.
    const globales = new Set();
    for (const m of src.matchAll(/(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) globales.add(m[1]);
    for (const m of src.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)) globales.add(m[1]);
    for (const m of src.matchAll(/(?:const|let|var)\s*\{([^}]+)\}/g)) {
      for (const x of m[1].split(',')) globales.add(x.trim().split(/[:=]/)[0].trim());
    }
    for (const m of src.matchAll(/\(([^)]*)\)\s*=>/g)) {
      for (const x of m[1].split(',')) {
        const nom = x.trim().split(/[:=]/)[0].trim().replace(/^\.\.\./, '');
        if (/^[A-Za-z_$][\w$]*$/.test(nom)) globales.add(nom);
      }
    }
    for (const m of src.matchAll(/function[^(]*\(([^)]*)\)/g)) {
      for (const x of m[1].split(',')) {
        const nom = x.trim().split(/[:=]/)[0].trim().replace(/^\.\.\./, '');
        if (/^[A-Za-z_$][\w$]*$/.test(nom)) globales.add(nom);
      }
    }
    for (const m of src.matchAll(/import\s+\{([^}]+)\}/g)) {
      for (const x of m[1].split(',')) globales.add(x.trim().split(/\s+as\s+/).pop().trim());
    }
    lineas.forEach((linea, i) => {
      if (/^[ 	]*(?:\/\/|\*)/.test(linea)) return;   // un comentario que EXPLICA el defecto no es el defecto
      const m = linea.match(/\bcatch\s*(?:\(\s*([A-Za-z_$][\w$]*)\s*\))?\s*\{/);
      if (!m) return;
      const enlazado = m[1] ?? null;
      // El cuerpo: desde la llave hasta que se equilibra, con un techo de 8 lineas. Un catch mas
      // largo que eso no es un manejador, es otra funcion.
      let profundidad = 0;
      let cuerpo = '';
      for (let k = i; k < Math.min(lineas.length, i + 8); k += 1) {
        const trozo = k === i ? lineas[k].slice(lineas[k].indexOf('{', m.index)) : lineas[k];
        cuerpo += trozo + ' ';
        for (const c of trozo) {
          if (c === '{') profundidad += 1;
          else if (c === '}') profundidad -= 1;
        }
        if (profundidad <= 0 && k > i - 1) break;
      }
      // Lo que se declara DENTRO del bloque tambien esta en ambito.
      const locales = new Set();
      for (const d of cuerpo.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)) locales.add(d[1]);
      // Solo se miran las INTERPOLACIONES: `${x}`. Es donde vivia el defecto y donde un
      // identificador inexistente revienta en tiempo de ejecucion sin que nada lo avise antes.
      for (const interp of cuerpo.matchAll(/\$\{([^}]*)\}/g)) {
        // Las CADENAS de dentro no son identificadores. `${ref ?? 'sin enlace'}` daba «sin» y
        // «enlace»: el detector leia el texto que el mensaje muestra al humano. Se quitan antes
        // de mirar, igual que PT-135 tuvo que descartar heredocs en el lint de la bateria.
        const expr = String(interp[1]).replace(/'[^']*'|"[^"]*"/g, "''");
        for (const id of expr.matchAll(/(^|[^.\w$])([A-Za-z_$][\w$]*)/g)) {
          const nom = id[2];                     // el grupo 1 descarta el acceso a propiedad
          if (nom === enlazado || locales.has(nom) || globales.has(nom)) continue;
          if (['String', 'Number', 'Object', 'JSON', 'Math', 'Array', 'Boolean', 'process',
            'undefined', 'null', 'true', 'false', 'length', 'message', 'stack', 'name',
            'join', 'slice', 'map', 'filter', 'split', 'trim', 'toUpperCase', 'toLowerCase',
            'push', 'includes', 'replace', 'match', 'id', 'issue', 'status', 'rule', 'msg'].includes(nom)) continue;
          if (/^[a-z]$/.test(nom)) continue;                    // parametros de una letra: ruido
          hallazgos.push({ archivo: nombre, linea: i + 1, identificador: nom, enlazado });
        }
      }
    });
  }
  return hallazgos;
}
