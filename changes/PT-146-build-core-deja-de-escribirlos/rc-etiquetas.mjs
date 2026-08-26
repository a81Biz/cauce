/**
 * PT-146 · RC — el campo «etiqueta» COINCIDE con el mapa `label` de build-core:184.
 *
 * Se lee del ARCHIVO, no se copia aqui: si se copiara, compararia lo que yo escribi contra lo
 * que yo escribi. Es la leccion de RC-03 en PT-144, y la que destapo el sitio quince.
 */
import { readFileSync } from 'node:fs';
import { FAMILIAS } from 'file:///C:/DevOps/Desarrollos/cauce/docs/methodology/tools/patrones.mjs';

const bc = readFileSync('docs/methodology/tools/build-core.mjs', 'utf8');
const i = bc.indexOf('const label = {');
if (i < 0) { console.log('NO se encontro el mapa label'); process.exit(1); }
const bloque = bc.slice(i, bc.indexOf('};', i));

const enArchivo = new Map(
  [...bloque.matchAll(/(\w+):\s*'([^']*)'/g)].map((m) => [m[1], m[2]]),
);

const fallos = [];
let n = 0;
for (const [pre, etq] of enArchivo) {
  n += 1;
  const f = FAMILIAS.find((x) => x.prefijo === pre);
  if (!f) { fallos.push(`${pre}: esta en label y NO en FAMILIAS`); continue; }
  if (f.etiqueta !== etq) {
    fallos.push(`${pre}\n      label:    ${JSON.stringify(etq)}\n      contrato: ${JSON.stringify(f.etiqueta)}`);
  } else {
    console.log(`  ok  ${pre.padEnd(7)} ${etq}`);
  }
}
for (const f of FAMILIAS) {
  n += 1;
  if (!enArchivo.has(f.prefijo)) fallos.push(`${f.prefijo}: esta en FAMILIAS y NO en label`);
}

console.log(`\nRC · ${n} comparaciones contra el mapa label REAL de build-core.mjs`);
if (fallos.length) {
  console.log(`\n${fallos.length} DISCREPANCIA(S):`);
  for (const f of fallos) console.log('  X ' + f);
  process.exit(1);
}
console.log('CERO discrepancias: el contrato reproduce lo que hay.');
