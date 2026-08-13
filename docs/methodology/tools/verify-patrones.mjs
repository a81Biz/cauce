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

import { PATRONES, selloDe } from './patrones.mjs';

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

console.log(`verify-patrones — ${Object.keys(PATRONES).length} patrones · ${total} comprobaciones\n`);
if (!errores.length) {
  console.log(`${c.verde}Todos los patrones cumplen su contrato.${c.fin}`);
  process.exit(0);
}
for (const e of errores) console.log(`  ${c.rojo}✗${c.fin} ${e}`);
console.log(`\n${errores.length} patrón(es) incumplen su contrato.`);
console.log('Un patrón que no casa lo que dice casar convierte un verificador en decoración:');
console.log('informa «sin errores» porque no encuentra nada, no porque no haya nada.');
process.exit(1);
