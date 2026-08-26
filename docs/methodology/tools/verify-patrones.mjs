#!/usr/bin/env node
/**
 * verify-patrones — ejecuta el contrato de cada patrón crítico.
 *
 * POR QUÉ EXISTE
 *   Un patrón puede estar mal y compilar. Ocho veces en este proyecto una secuencia de escape
 *   se perdió al editar —`\b` quedó como el byte 0x08, `\s` como la letra «s»— y el regex
 *   resultante era válido y no casaba nada. El verificador informaba «sin errores» porque no
 *   encontraba nada que reprochar: el fallo era **indistinguible del éxito**.
 *
 *   El detector de bytes de control de la 4.8.0 caza `\b` → 0x08 y no caza `\d` → `d`, que es
 *   el mismo fallo con un carácter imprimible. Tratar el síntoma deja fuera la mitad de los
 *   casos, y la mitad que deja fuera es la silenciosa.
 *
 * QUÉ COMPRUEBA
 *   Que cada patrón case lo que debe y rechace lo que no. Un patrón degradado falla su propio
 *   ejemplo en la primera línea de la salida, con su nombre. Para pasar por bueno tendrían que
 *   romperse el patrón Y sus ejemplos en la misma dirección.
 *
 *   Y que ningún patrón viaje sin contrato: solo `casa` deja pasar uno demasiado laxo; solo
 *   `noCasa`, uno que no casa nada.
 *
 * Uso:  node verify-patrones.mjs
 * Exit: 0 todos cumplen · 1 alguno no
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  PATRONES, selloDe,
  COMPONENTES, FAMILIAS, SIN_EVALUAR,
  prefijos, opcionales, familiasEnProsa, ordenDePrefijos, triggers, promptsDe, fasesDe, siglaDe,
  SEVERIDADES, esSeveridad, RE_SEVERIDAD,
  reglaRE, reglaEnTabla, reglaEnLinea, PFX,
} from './patrones.mjs';

const errores = [];
const avisos = [];
const c = { rojo: '\x1b[31m', verde: '\x1b[32m', dim: '\x1b[2m', neg: '\x1b[1m', fin: '\x1b[0m' };

// Un regex con /g conserva lastIndex entre llamadas: reutilizarlo entre ejemplos daría
// resultados que dependen del orden. Se prueba siempre sobre una copia limpia.
const prueba = (re, texto) => new RegExp(re.source, re.flags.replace('g', '')).test(texto);

let total = 0;
for (const [nombre, p] of Object.entries(PATRONES)) {
  if (!(p.re instanceof RegExp)) { errores.push(`${nombre}: no expone un RegExp.`); continue; }
  if (!p.para) errores.push(`${nombre}: no dice para qué sirve.`);
  if (!Array.isArray(p.casa) || !p.casa.length) {
    errores.push(`${nombre}: sin ejemplos de lo que TIENE que casar. Un patrón sin ellos puede no casar nada y nadie se entera.`);
  }
  if (!Array.isArray(p.noCasa) || !p.noCasa.length) {
    errores.push(`${nombre}: sin ejemplos de lo que NO debe casar. Sin ellos, un patrón demasiado laxo pasa por bueno.`);
  }
  for (const t of p.casa ?? []) {
    total++;
    if (!prueba(p.re, t)) {
      errores.push(`${nombre}: debería casar ${JSON.stringify(t)} y no casa.\n      ${c.dim}patrón: ${p.re}${c.fin}\n      ${c.dim}Si un escape se degradó (\\d → d, \\s → s, \\b → 0x08), es aquí.${c.fin}`);
    }
  }
  for (const t of p.noCasa ?? []) {
    total++;
    if (prueba(p.re, t)) {
      errores.push(`${nombre}: NO debería casar ${JSON.stringify(t)} y casa.\n      ${c.dim}patrón: ${p.re}${c.fin}`);
    }
  }
}

// El sello tiene su propio contrato: es una función, no un patrón, y su propiedad es que no
// depende del fin de línea. Fue la que rompió el primer CI del marco.
total += 2;
if (selloDe('a\r\nb\r\n') !== selloDe('a\nb\n')) {
  errores.push('selloDe: el sello cambia con el fin de línea. Es lo que hacía que el CI acusara de desincronizado un núcleo intacto.');
}
if (selloDe('a\nb') === selloDe('a\nc')) {
  errores.push('selloDe: dos contenidos distintos dan el mismo sello.');
}

// ── El contrato de componentes ──────────────────────────────────────────── PT-144
//
// Mismo trato que `selloDe`, y por el mismo motivo: es un contrato que NO es un patrón, así que
// el mecanismo genérico de `PATRONES` —`casa` y `noCasa`— no lo alcanza. Lleva aserciones
// propias escritas para SU propiedad concreta.
//
// POR QUÉ ESTÁ AQUÍ Y NO EN OTRO SITIO. `EP-022` midió la lista de componentes escrita a mano en
// CATORCE sitios de cuatro herramientas. Lo grave no era la duplicación: `verify-suite.mjs:250`
// filtraba las reglas por una alternancia LITERAL de prefijos, así que un componente con prefijo
// nuevo tenía sus reglas INVISIBLES al verificador — y no daba error, PASABA EN VERDE. Un
// contrato sin comprobación que pueda fallar repite ese defecto un nivel más arriba (`RULE-02`).
//
// Cada bloque nombra el componente y el campo que falla: quien lea el error no tiene que deducir
// cuál de los seis está mal (`SUITE-R53`).
const CAMPOS_COMPONENTE = ['nombre', 'sigla', 'prefijo', 'directorio', 'obligatorio', 'triggers', 'fases', 'en_core'];
const CAMPOS_FAMILIA = ['prefijo', 'documento', 'orden', 'etiqueta'];

const listaDe = (x) => (x instanceof Map ? [...x.values()] : Object.values(x ?? {}));

{
  const comps = listaDe(COMPONENTES);
  const fams = listaDe(FAMILIAS);
  total += 6;

  // PT-149 · ESTO FIJABA «EXACTAMENTE SEIS», Y ESO NO ES UN CONTRATO: ES UN RETRATO. Dar de alta
  // un septimo componente ponia en rojo la prueba del contrato, asi que el alta EXIGIA EDITAR UNA
  // HERRAMIENTA — literalmente lo que E5 declara defecto y no paso, y lo contrario de lo que
  // SUITE-R60 promete («un septimo componente entra solo»). Lo salvable de la asercion se
  // conserva entero: que NINGUNO DE LOS SEIS DESAPAREZCA. Perder uno sigue siendo rojo; anadir
  // uno, no. La direccion importa: el contrato tiene que poder CRECER y no puede ENCOGER.
  const LOS_SEIS = ['FDGE', 'FQAGE', 'PTSA', 'Foundation', 'FPGE', 'FIDE'];
  const nombres = comps.map((c) => c.nombre);
  const perdidos = LOS_SEIS.filter((x) => !nombres.includes(x));
  if (perdidos.length) {
    errores.push(`COMPONENTES: falta(n) ${perdidos.join(' · ')}. La suite tiene estos seis y el contrato no puede perder ninguno.`);
  }
  // PT-149 · MISMA CORRECCION Y MISMO MOTIVO QUE ARRIBA. Fijar «exactamente diez» impedia dar de
  // alta una FAMILIA de reglas, que LEX-R36 declara un acto legitimo y DISTINTO del alta de un
  // componente. Se conserva entero lo que protegia: que no falte ninguna de las diez.
  const LAS_DIEZ = ['SUITE', 'LEX', 'EXEC', 'FND', 'FDGE', 'INTAKE', 'QA', 'PTSA', 'FPGE', 'FIDE'];
  const sinFamilia = LAS_DIEZ.filter((x) => !fams.some((f) => f.prefijo === x));
  if (sinFamilia.length) {
    errores.push(`FAMILIAS: falta(n) ${sinFamilia.join(' · ')}. Seis coinciden con un componente; SUITE, LEX, EXEC e INTAKE no, y ninguna puede desaparecer.`);
  }

  // Un campo ausente se distingue de uno en falso: `undefined` es «nadie lo escribió» y `null`
  // es «no tiene», que para `directorio` es un valor legítimo (RULE-06).
  for (const comp of comps) {
    for (const campo of CAMPOS_COMPONENTE) {
      if (comp?.[campo] === undefined) {
        errores.push(`COMPONENTES: «${comp?.nombre ?? '?'}» no declara «${campo}». Un campo ausente es el que luego se escribe a mano en la herramienta.`);
      }
    }
  }
  for (const fam of fams) {
    for (const campo of CAMPOS_FAMILIA) {
      if (fam?.[campo] === undefined) {
        errores.push(`FAMILIAS: «${fam?.prefijo ?? '?'}» no declara «${campo}».`);
      }
    }
  }

  // PT-144 · TS-08 lo destapo: sin esto, DUPLICAR un «orden» pasaba en verde. `ordenDePrefijos()`
  // ordena de forma estable, asi que dos familias con el mismo numero conservan su posicion en el
  // array y la secuencia emitida no cambia — la asercion de orden no lo veia.
  //
  // Es el caso que `design.md` §6 especificaba —«orden con huecos o repetido -> falla»— y que no
  // se habia escrito. Lo encontro romper el contrato a proposito, no leerlo: RULE-02 en su forma
  // ejecutable.
  //
  // Importa porque `orden` gobierna la emision de CORE.md: un empate hace que el nucleo dependa
  // del orden de declaracion en vez del declarado, y eso es un dato que se pierde al reordenar.
  total += 2;
  const ordenes = fams.map((f) => f?.orden).filter((o) => o !== undefined);
  const repetidos = ordenes.filter((o, i) => ordenes.indexOf(o) !== i);
  if (repetidos.length) {
    errores.push(`FAMILIAS: el «orden» ${JSON.stringify([...new Set(repetidos)])} esta repetido. CORE.md se emite con el, y un empate hace que el nucleo dependa del orden de declaracion en vez del declarado.`);
  }
  const esperado = [...Array(fams.length)].map((_, i) => i + 1);
  if (ordenes.length && [...ordenes].sort((a, b) => a - b).join() !== esperado.join()) {
    errores.push(`FAMILIAS: el «orden» no es 1..${fams.length} sin huecos. Hoy: ${JSON.stringify([...ordenes].sort((a, b) => a - b))}`);
  }

  // El caso irregular ES la prueba del diseño: si `sigla` no estuviera separada de `nombre`, el
  // ternario de `audit.mjs:214` seguiría existiendo, escrito en otro sitio. Y `FQAGE` es el
  // segundo caso, que aquel ternario no tenía (`LEX-R03`).
  total += 3;
  if (siglaDe('Foundation') !== 'FND') {
    errores.push(`siglaDe('Foundation') devuelve ${JSON.stringify(siglaDe('Foundation'))} y LEXICON declara «FND». Es el caso que obliga a que «sigla» sea un campo y no el nombre.`);
  }
  if (siglaDe('FQAGE') !== 'QA') {
    errores.push(`siglaDe('FQAGE') devuelve ${JSON.stringify(siglaDe('FQAGE'))} y LEX-R03 declara «QA» para triggers, rutas y nombres de archivo.`);
  }
  if (siglaDe('FDGE') !== 'FDGE') {
    errores.push('siglaDe(\'FDGE\') no devuelve «FDGE»: el caso regular tiene que seguir siéndolo.');
  }

  // `SIN_EVALUAR` no es un adorno: LEXICON §3 declara el rango de CINCO componentes y no tiene
  // apartado para FPGE. Un `[]` o un `null` aquí haría que `audit` auditara cero fases de FPGE y
  // saliera en verde — apagar la comprobación en silencio, que es el defecto que EP-022 quita.
  total += 3;
  const fFIDE = fasesDe('FIDE');
  if (!Array.isArray(fFIDE) || fFIDE[0] !== 1 || fFIDE[1] !== 5) {
    errores.push(`fasesDe('FIDE') devuelve ${JSON.stringify(fFIDE)} y LEXICON §3.5 declara PHASE 1-5. El dato EXISTE: no puede salir como desconocido.`);
  }
  // PT-156 · esta asercion NACIO al reves: exigia SIN_EVALUAR porque LEXICON no tenia apartado
  // para FPGE, y no lo tenia porque su recorrido numeraba los pasos [1]..[7] en vez de PHASE n.
  // Escrito el apartado, el dato EXISTE y ya no puede salir como desconocido — que es justo lo
  // que la version anterior de esta linea protegia, por el otro lado.
  const fFPGE = fasesDe('FPGE');
  if (!Array.isArray(fFPGE) || fFPGE[0] !== 1 || fFPGE[1] !== 7) {
    errores.push(`fasesDe('FPGE') devuelve ${JSON.stringify(fFPGE)} y LEXICON §3.6 declara PHASE 1-7. El dato EXISTE: no puede salir como desconocido.`);
  }
  if (!Array.isArray(fasesDe('PTSA'))) {
    errores.push('fasesDe(\'PTSA\') no devuelve un rango, y LEXICON §3.3 declara PHASE 0-14.');
  }
  // PT-156 · LAS TRES ASERCIONES DE ARRIBA CLAVAN CIFRAS, Y ESO NO BASTA. Mientras `FPGE` llevaba
  // SIN_EVALUAR, la asercion defendia la declaracion de ignorancia; al voltearla quedo un hueco:
  // nadie comprueba que LEXICON §3 TENGA el apartado del que el rango sale. Un `fases: [1, 7]`
  // escrito sin apartado pasaria en verde, y es LITERALMENTE el «rango inventado» contra el que
  // PT-144 escribio SIN_EVALUAR. El contraste se hace contra el documento, en los DOS sentidos,
  // y DERIVADO de COMPONENTES: un septimo componente entra solo.
  const AQUI = dirname(fileURLToPath(import.meta.url));
  let lexicon = null;
  try { lexicon = readFileSync(join(AQUI, '..', 'LEXICON.md'), 'utf8'); } catch { /* se dice abajo */ }
  // Si LEXICON.md no esta al lado, el contraste NO SE PUEDE HACER — y eso no es un fallo del
  // contrato: hay fixtures legitimos que copian solo tools/. Se DICE y no se cuenta como
  // comprobado (RULE-06), que es distinguible tanto de «paso» como de «fallo» (RULE-02). Fallar
  // aqui ponia en rojo tres casos de otras tareas por una razon ajena a lo que probaban — el
  // mismo defecto que PT-145 midio cuando su fixture copio solo *.md.
  if (lexicon === null) {
    avisos.push('LEXICON.md no esta junto a tools/: el contraste del rango de fases contra su dueno (LEX-R21) NO SE EVALUA.');
  } else {
    const apartados = lexicon.split(String.fromCharCode(10)).map((l) => l.trim()).filter((l) => l.startsWith('### 3.'));
    for (const comp of COMPONENTES) {
      total += 1;
      const tiene = apartados.some((l) => l.includes(comp.nombre));
      const declara = fasesDe(comp.nombre) !== SIN_EVALUAR;
      if (declara && !tiene) {
        errores.push(`el contrato declara fases para «${comp.nombre}» y LEXICON §3 no tiene apartado suyo. Un rango sin documento del que salir es un rango INVENTADO (RULE-06).`);
      }
      if (!declara && tiene) {
        errores.push(`LEXICON §3 tiene apartado para «${comp.nombre}» y el contrato lo da por SIN_EVALUAR. El dato EXISTE: declararlo desconocido apaga la comprobacion de audit en silencio.`);
      }
    }
  }


  // Las seis proyecciones tienen que reproducir EXACTAMENTE los literales que van a sustituir.
  // Si divergen, PT-145..PT-147 dejan de ser refactors y pasan a ser cambios de comportamiento
  // disfrazados — el riesgo que `scope.md` §4 declara como RC-03.
  total += 6;
  const mismos = (a, b) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

  const PREFIJOS_HOY = ['SUITE', 'LEX', 'FDGE', 'INTAKE', 'QA', 'PTSA', 'FPGE', 'FND', 'FIDE', 'EXEC'];
  // PT-149 · CONTIENE, no IGUALA: la alternancia de verify-suite se DERIVA de aqui, asi que un
  // prefijo nuevo entra sin tocarla — que es el punto entero de PT-145. Lo que no puede pasar es
  // que uno de los diez deje de estar: sus reglas se volverian invisibles al verificador y todo
  // pasaria en verde POR NO MIRARLAS, que es el defecto que abrio EP-022.
  const sinPrefijo = PREFIJOS_HOY.filter((x) => !prefijos().includes(x));
  if (sinPrefijo.length) {
    errores.push(`prefijos() ya no incluye ${sinPrefijo.join(' · ')}, y de aqui sale la alternancia de verify-suite.mjs (:250 · :254 · :256 · :289 · :403). Hoy: ${JSON.stringify(prefijos())}`);
  }

  // PT-149 · misma correccion y mismo motivo: fijar el conjunto EXACTO de opcionales impedia dar
  // de alta un componente opcional sin editar esta herramienta. Lo que hay que preservar es que
  // FIDE lo siga siendo —es el hecho que verify-suite.mjs:425 y comparar-marco.mjs:39 escribian
  // cada una por su cuenta, con dos nombres distintos (FIDE-R01)—, no que sea el unico.
  if (![...opcionales()].includes('FIDE')) {
    errores.push(`opcionales() ya no contiene FIDE, que FIDE-R01 declara el opcional de la suite y verify-suite.mjs:425 y comparar-marco.mjs:39 leen de aqui. Hoy: ${JSON.stringify([...opcionales()])}`);
  }

  // PT-149 · CONTIENE, no IGUALA. Lo que hay que preservar es POR QUE son siete y no diez: LEX,
  // EXEC y PTSA quedan fuera porque sus reglas NO VIVEN EN RULES.md, y esa es la distincion que
  // LEX-R36 escribio. Una familia nueva cuyas reglas si vivan ahi entra sin tocar nada.
  const PROSA_HOY = ['SUITE', 'FND', 'FDGE', 'INTAKE', 'QA', 'FPGE', 'FIDE'];
  const sinProsa = PROSA_HOY.filter((x) => !familiasEnProsa().includes(x));
  const coladas = ['LEX', 'EXEC', 'PTSA'].filter((x) => familiasEnProsa().includes(x));
  if (sinProsa.length || coladas.length) {
    errores.push(`familiasEnProsa() no reproduce build-core.mjs:171: falta(n) ${sinProsa.join(' · ') || 'ninguna'} y sobra(n) ${coladas.join(' · ') || 'ninguna'}. LEX, EXEC y PTSA NO van, porque sus reglas no viven en RULES.md. Hoy: ${JSON.stringify(familiasEnProsa())}`);
  }

  // PT-149 · LA PROPIEDAD ES EL ORDEN RELATIVO, NO LA IGUALDAD. CORE.md se emite con esta
  // secuencia, asi que las diez tienen que seguir apareciendo EN ESTE ORDEN — pero una familia
  // nueva intercalada o al final no rompe nada, y exigir igualdad la prohibia. Se comprueba
  // filtrando: la subsecuencia de las diez conocidas debe ser exactamente ORDEN_HOY.
  const ORDEN_HOY = ['SUITE', 'LEX', 'EXEC', 'FND', 'FDGE', 'INTAKE', 'QA', 'PTSA', 'FPGE', 'FIDE'];
  const subsecuencia = ordenDePrefijos().filter((x) => ORDEN_HOY.includes(x));
  if (subsecuencia.join() !== ORDEN_HOY.join()) {
    errores.push(`ordenDePrefijos() no reproduce build-core.mjs:183 EN SU ORDEN. CORE.md se emite con él, y las diez conocidas tienen que seguir en esta secuencia. Hoy: ${JSON.stringify(ordenDePrefijos())}`);
  }

  const t = triggers();
  if (!Array.isArray(t) || !t.includes('[START PTSA]') || !t.includes('[START FIDE]')) {
    errores.push('triggers() no reproduce la lista de build-core.mjs:433-437.');
  }

  const p = promptsDe('PTSA');
  if (p !== 'PTSA/PTSA-Prompts.md') {
    errores.push(`promptsDe('PTSA') devuelve ${JSON.stringify(p)} y audit.mjs:192-195 declara «PTSA/PTSA-Prompts.md».`);
  }
}

// ── Los patrones de identificador de regla ──────────────────────────────── PT-145
//
// Se construyen desde `prefijos()` en vez de escribirse, y eso los pone bajo `SUITE-R59`: un
// escape degradado NO revienta, CASA DE MENOS. En un verificador de reglas, casar de menos es
// dejar de ver reglas — es decir, pasar en verde.
//
// Por eso no basta leer el codigo: hay que EJECUTARLOS contra los diez prefijos. Y contra lo que
// no deben casar, porque un patron demasiado laxo tambien pasa por bueno.
{
  const DIEZ = prefijos();
  total += DIEZ.length + 4;

  const texto = DIEZ.map((p) => `${p}-R01`).join(' ');
  const casan = [...texto.matchAll(reglaRE('g'))].map((m) => m[1]);
  for (const p of DIEZ) {
    if (!casan.includes(p)) {
      errores.push(`reglaRE() no casa «${p}-R01». Si un escape se degradó al construirlo, es aquí: el patrón sigue siendo válido y deja de ver ese prefijo entero.`);
    }
  }

  if (reglaRE().test('XYZ-R01')) {
    errores.push('reglaRE() casa «XYZ-R01», que no es un prefijo declarado. Un patrón demasiado laxo pasa por bueno.');
  }
  if (reglaRE().test('SUITE-R ')) {
    errores.push('reglaRE() casa «SUITE-R» sin número.');
  }
  if (!reglaEnTabla().test('| `FPGE-R05` | HARD |')) {
    errores.push('reglaEnTabla() no casa una fila de RULES.md. Es como se recogen las reglas DEFINIDAS: si falla, verify-suite deja de ver definiciones y las da por inexistentes.');
  }
  if (!reglaEnLinea().test('`FIDE-R01` · el INSTALL no lo copia')) {
    errores.push('reglaEnLinea() no casa la forma en que LEXICON y EXECUTION-MODES definen fuera de tabla.');
  }
}

// ── La escala de severidad ──────────────────────────────────────────────── PT-150
//
// Mismo trato que el contrato de componentes, sobre un hecho hermano. Estaba escrita dentro de
// `tracker.mjs` con un valor —`S0`— que LEXICON no declara, y sin `S4`, que si declara. Y el
// mensaje de error se la ATRIBUIA a LEXICON: no callaba, ensenaba el dato equivocado.
//
// `RE_SEVERIDAD` tiene su propio contrato porque es un patron CONSTRUIDO: la clase `[1-4]` que
// habia antes codificaba la escala dentro del regex, y `SUITE-R59` avisa de que ahi es donde los
// escapes se pierden al editar.
{
  total += 3;
  if (SEVERIDADES.join() !== 'S1,S2,S3,S4') {
    errores.push(`SEVERIDADES es ${JSON.stringify(SEVERIDADES)} y LEXICON §8.3 declara S1 · S2 · S3 · S4. Fue exactamente esta divergencia —S0 de mas, S4 de menos— la que hizo que el comando que abre lotes rechazara la severidad que LEXICON define como «se agrupa en lotes».`);
  }
  if (esSeveridad('S0')) {
    errores.push('esSeveridad(\'S0\') devuelve true y LEXICON no declara S0 en ninguna parte.');
  }
  if (!esSeveridad('S4')) {
    errores.push('esSeveridad(\'S4\') devuelve false y LEXICON §8.3 la declara: «cosmético, mejora, deuda sin impacto observable · se agrupa en lotes».');
  }

  // El patron tiene que tolerar el comentario que traen las plantillas del paquete y seguir
  // rechazando lo invalido. Es el caso de PT-083: quien instala el paquete, copia la plantilla y
  // la rellena, fallaba FDGE-R04 — y es el camino que el MANUAL describe, no un caso raro.
  total += 4;
  const casaSev = (t) => new RegExp(RE_SEVERIDAD.source, RE_SEVERIDAD.flags.replace('g', '')).test(t);
  const CON_COMENTARIO = 'severity: S4               # [HUMANO] S1 | S2 | S3 | S4';
  if (!casaSev(CON_COMENTARIO)) {
    errores.push(`RE_SEVERIDAD no casa la forma que traen las plantillas del paquete: ${JSON.stringify(CON_COMENTARIO)}. Es el defecto de PT-083, que costo que quien instalara el paquete fallara FDGE-R04 siguiendo el MANUAL.`);
  }
  if (!casaSev('severity: S1')) errores.push('RE_SEVERIDAD no casa «severity: S1».');
  if (casaSev('severity: S9')) errores.push('RE_SEVERIDAD casa «severity: S9», que no es una severidad. Un patron demasiado laxo pasa por bueno.');
  if (casaSev('severity:')) errores.push('RE_SEVERIDAD casa «severity:» vacio. Un campo sin valor no es un valor.');
}

console.log(`verify-patrones — ${Object.keys(PATRONES).length} patrones · ${total} comprobaciones\n`);
// PT-156 · lo NO EVALUADO se dice ANTES del veredicto, no despues ni en su lugar. «Todos los
// patrones cumplen su contrato» sin decir CUALES NO SE PUDIERON MIRAR es exactamente la promesa
// que SUITE-R26 prohibe: informar «sin errores» porque no se encontro nada, no porque no haya.
for (const a of avisos) console.log(`  ${c.dim}·${c.fin} SIN EVALUAR  ${a}`);
if (avisos.length) console.log('');
if (!errores.length) {
  console.log(`${c.verde}Todos los patrones cumplen su contrato.${c.fin}`);
  process.exit(0);
}
// PT-015 · el fallo CITA su regla. Esta herramienta ES la comprobación de `SUITE-R38` —«un
// patrón crítico vive en un solo sitio y viaja con su contrato»— y no la nombraba: quien viera
// el error tenía que deducir de qué regla venía, que es exactamente lo que `SUITE-R53` dice que
// no puede ser el camino.
//
// Y el ID se EMITE como dato, no se mete en el texto: `regla --fallos` deriva de `fail('ID', …)`
// y una cita en la prosa no la ve — con razón, porque mencionar no es emitir. Escribirlo dentro
// del template dejaba la regla igual de invisible para la derivación, y eso lo dijo ejecutar
// `regla --sin-comprobar` después de «arreglarlo».
const fail = (regla, msg) => console.log(`  ${c.rojo}✗${c.fin} ${regla}  ${msg}`);
for (const e of errores) fail('SUITE-R38', e);
console.log(`\n${errores.length} patrón(es) incumplen su contrato (SUITE-R38).`);
console.log('Un patrón que no casa lo que dice casar convierte un verificador en decoración:');
console.log('informa «sin errores» porque no encuentra nada, no porque no haya nada.');
process.exit(1);
