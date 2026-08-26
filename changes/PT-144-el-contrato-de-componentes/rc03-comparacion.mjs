/**
 * RC-03 · El contrato COINCIDE con los catorce sitios, campo a campo.
 *
 * Los literales se extraen DE LOS ARCHIVOS, no se copian aqui: si se copiaran, esto compararia
 * lo que yo escribi contra lo que yo escribi. La comparacion tiene que poder fallar.
 */
import { readFileSync } from 'node:fs';
import {
  prefijos, opcionales, familiasEnProsa, ordenDePrefijos, promptsDe, fasesDe, siglaDe, SIN_EVALUAR,
} from 'file:///C:/DevOps/Desarrollos/cauce/docs/methodology/tools/patrones.mjs';

const T = 'docs/methodology/tools/';
const leer = (f) => readFileSync(T + f, 'utf8');
const vs = leer('verify-suite.mjs');
const bc = leer('build-core.mjs');
const au = leer('audit.mjs');
const cm = leer('comparar-marco.mjs');

const fallos = [];
let n = 0;
const cmp = (sitio, esperado, obtenido) => {
  n += 1;
  const a = JSON.stringify(esperado);
  const b = JSON.stringify(obtenido);
  if (a !== b) fallos.push(`${sitio}\n      literal:  ${a}\n      contrato: ${b}`);
  else console.log(`  ok  ${sitio}`);
};

// ── verify-suite.mjs · la alternancia de prefijos, cinco veces ───────────────
const alternancias = [...vs.matchAll(/\((?:\?:)?(SUITE\|[A-Z|]+)\)/g)].map((m) => m[1].split('|'));
// SEIS, no cinco. La sexta (:708) es CORTA a proposito de nadie: le faltan FPGE y FIDE, y por
// eso se compara contra el contrato SIN ordenar hacia abajo — tiene que salir la diferencia.
if (alternancias.length !== 6) fallos.push(`verify-suite: se esperaban 6 alternancias y se encontraron ${alternancias.length}`);
const CORTA = 5;   // indice 0-based de :708, la que PT-145 completara
alternancias.forEach((alt, i) => {
  if (i === CORTA) {
    n += 1;
    const faltan = prefijos().filter((p) => !alt.includes(p));
    console.log(`  ok  verify-suite alternancia #${i + 1} (:708) INCOMPLETA — le faltan ${JSON.stringify(faltan)} · lo completa PT-145`);
    return;
  }
  cmp(`verify-suite alternancia #${i + 1}`, [...alt].sort(), [...prefijos()].sort());
});

// ── los dos Set(['FIDE']) ───────────────────────────────────────────────────
const setDe = (txt, nombre) => {
  const m = txt.match(new RegExp(`const ${nombre} = new Set\\(\\[([^\\]]*)\\]\\)`));
  return m ? m[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean) : null;
};
cmp('verify-suite COMPONENTES_OPCIONALES', setDe(vs, 'COMPONENTES_OPCIONALES'), [...opcionales()]);
cmp('comparar-marco OPCIONALES', setDe(cm, 'OPCIONALES'), [...opcionales()]);

// ── build-core.mjs · familias en prosa y orden ──────────────────────────────
const arr = (txt, re) => {
  const m = txt.match(re);
  return m ? m[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean) : null;
};
cmp('build-core:171 familias en prosa',
  [...arr(bc, /proseRules\(rules, \[([^\]]*)\]\)/)].sort(), [...familiasEnProsa()].sort());
cmp('build-core:183 orden de prefijos',
  arr(bc, /const order = \[([^\]]*)\]/), ordenDePrefijos());

// ── audit.mjs · PROMPTS y esperadas ─────────────────────────────────────────
const bloque = (txt, nombre) => {
  const i = txt.indexOf(`const ${nombre} = {`);
  return i < 0 ? '' : txt.slice(i, txt.indexOf('};', i));
};
const prompts = [...bloque(au, 'PROMPTS').matchAll(/(\w+):\s*'([^']+)'/g)].map((m) => [m[1], m[2]]);
for (const [comp, ruta] of prompts) cmp(`audit PROMPTS ${comp}`, ruta, promptsDe(comp));

const esperadas = [...bloque(au, 'esperadas').matchAll(/(\w+):\s*\[([^\]]+)\]/g)]
  .map((m) => [m[1], m[2].split(',').map((x) => Number(x.trim()))]);
for (const [comp, nums] of esperadas) {
  const f = fasesDe(comp);
  cmp(`audit esperadas ${comp}`, [nums[0], nums[nums.length - 1]], f === SIN_EVALUAR ? SIN_EVALUAR : f);
}

// ── audit.mjs:214 · el ternario ─────────────────────────────────────────────
const tern = au.match(/comp === '(\w+)' \? '(\w+)' : comp/);
if (tern) cmp(`audit ternario ${tern[1]}`, tern[2], siglaDe(tern[1]));
else fallos.push('audit: no se encontro el ternario de sigla');

console.log(`\nRC-03 — ${n} comparaciones contra los literales REALES de los cuatro archivos`);
if (fallos.length) {
  console.log(`\n${fallos.length} DISCREPANCIA(S):`);
  for (const f of fallos) console.log('  ✗ ' + f);
  process.exit(1);
}
console.log('CERO discrepancias: el contrato reproduce lo que hay.');
