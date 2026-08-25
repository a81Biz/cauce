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

import {
  PATRONES, selloDe,
  COMPONENTES, FAMILIAS, SIN_EVALUAR,
  prefijos, opcionales, familiasEnProsa, ordenDePrefijos, triggers, promptsDe, fasesDe, siglaDe,
} from './patrones.mjs';

const errores = [];
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
const CAMPOS_FAMILIA = ['prefijo', 'documento', 'orden'];

const listaDe = (x) => (x instanceof Map ? [...x.values()] : Object.values(x ?? {}));

{
  const comps = listaDe(COMPONENTES);
  const fams = listaDe(FAMILIAS);
  total += 6;

  if (comps.length !== 6) {
    errores.push(`COMPONENTES: declara ${comps.length} componente(s) y la suite tiene 6 (FDGE · FQAGE · PTSA · Foundation · FPGE · FIDE).`);
  }
  if (fams.length !== 10) {
    errores.push(`FAMILIAS: declara ${fams.length} familia(s) y hay 10 prefijos de regla. Seis coinciden con un componente; SUITE, LEX, EXEC e INTAKE no.`);
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
  if (fasesDe('FPGE') !== SIN_EVALUAR) {
    errores.push(`fasesDe('FPGE') devuelve ${JSON.stringify(fasesDe('FPGE'))} y LEXICON §3 NO tiene apartado para FPGE. Un rango inventado apaga la comprobación en silencio (RULE-06).`);
  }
  if (!Array.isArray(fasesDe('PTSA'))) {
    errores.push('fasesDe(\'PTSA\') no devuelve un rango, y LEXICON §3.3 declara PHASE 0-14.');
  }

  // Las seis proyecciones tienen que reproducir EXACTAMENTE los literales que van a sustituir.
  // Si divergen, PT-145..PT-147 dejan de ser refactors y pasan a ser cambios de comportamiento
  // disfrazados — el riesgo que `scope.md` §4 declara como RC-03.
  total += 6;
  const mismos = (a, b) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

  const PREFIJOS_HOY = ['SUITE', 'LEX', 'FDGE', 'INTAKE', 'QA', 'PTSA', 'FPGE', 'FND', 'FIDE', 'EXEC'];
  if (!mismos(prefijos(), PREFIJOS_HOY)) {
    errores.push(`prefijos() no reproduce la alternancia de verify-suite.mjs (:250 · :254 · :256 · :289 · :403). Hoy: ${JSON.stringify(prefijos())}`);
  }

  const OPCIONALES_HOY = ['FIDE'];
  if (!mismos([...opcionales()], OPCIONALES_HOY)) {
    errores.push(`opcionales() no reproduce Set(['FIDE']) de verify-suite.mjs:425 y comparar-marco.mjs:39. Hoy: ${JSON.stringify([...opcionales()])}`);
  }

  const PROSA_HOY = ['SUITE', 'FND', 'FDGE', 'INTAKE', 'QA', 'FPGE', 'FIDE'];
  if (!mismos(familiasEnProsa(), PROSA_HOY)) {
    errores.push(`familiasEnProsa() no reproduce build-core.mjs:171. Son 7 y NO incluyen LEX, EXEC ni PTSA, porque sus reglas no viven en RULES.md. Hoy: ${JSON.stringify(familiasEnProsa())}`);
  }

  const ORDEN_HOY = ['SUITE', 'LEX', 'EXEC', 'FND', 'FDGE', 'INTAKE', 'QA', 'PTSA', 'FPGE', 'FIDE'];
  if (ordenDePrefijos().join() !== ORDEN_HOY.join()) {
    errores.push(`ordenDePrefijos() no reproduce build-core.mjs:183 EN SU ORDEN. CORE.md se emite con él. Hoy: ${JSON.stringify(ordenDePrefijos())}`);
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

console.log(`verify-patrones — ${Object.keys(PATRONES).length} patrones · ${total} comprobaciones\n`);
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
