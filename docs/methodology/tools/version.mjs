#!/usr/bin/env node
/**
 * version — mueve la versión de la suite en un solo acto.
 *
 * POR QUÉ EXISTE
 *   La versión vigente se deriva del CHANGELOG (`SUITE-R40`), pero cada documento declara a qué
 *   versión pertenece —y eso son veintiún sitios escritos a mano. Subirlos uno a uno es
 *   exactamente el defecto que la v4 nació para eliminar: el mismo hecho copiado, divergiendo.
 *
 *   Y divergió. `verify-suite` tenía la versión fijada en una constante siendo la autoridad
 *   contra la que se comprueban todos los documentos, así que cuando `package.json` pasó a
 *   5.2.1 los veintiún documentos siguieron declarando 5.2.0 **y el verificador dijo que todo
 *   estaba bien**: comparaba contra su propia copia atrasada. El fallo era invisible porque el
 *   juez estaba equivocado en la misma dirección que los juzgados.
 *
 * QUÉ HACE
 *   Lee la versión vigente del CHANGELOG y la escribe donde toca: la cabecera de cada `.md` y
 *   el `package.json` del paquete. Nada más — el CHANGELOG lo escribe un humano, porque decir
 *   qué cambió y si rompe compatibilidad no es mecánico.
 *
 * Uso:
 *   node version.mjs [ruta]            qué está desalineado, sin tocar nada
 *   node version.mjs [ruta] --aplicar  alinear con el CHANGELOG
 *
 * Exit: 0 todo alineado (o aplicado) · 1 hay desalineados y no se aplicó
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
import { PATRONES } from './patrones.mjs';

const args = process.argv.slice(2);
const APLICAR = args.includes('--aplicar');
const BASE = resolve(args.find((a) => !a.startsWith('--')) ?? join(process.cwd(), 'docs', 'methodology'));
const c = { rojo: '\x1b[31m', verde: '\x1b[32m', dim: '\x1b[2m', neg: '\x1b[1m', fin: '\x1b[0m' };

if (!existsSync(BASE)) { console.error(`No existe: ${BASE}`); process.exit(1); }

// ── La fuente: la primera entrada del CHANGELOG (SUITE-R40) ─────────────────
const CAMBIOS = join(BASE, 'CHANGELOG.md');
if (!existsSync(CAMBIOS)) { console.error(`Falta ${CAMBIOS}.`); process.exit(1); }
const m = readFileSync(CAMBIOS, 'utf8').match(PATRONES.VERSION_VIGENTE.re);
if (!m) {
  console.error('El CHANGELOG no abre con «## X.Y.Z — AAAA-MM-DD». Es de donde se lee la vigente.');
  process.exit(1);
}
const VIGENTE = m[1];

const walk = (dir, out = []) => {
  for (const n of readdirSync(dir)) {
    if (n === '.claude' || n === 'node_modules') continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const rel = (p) => relative(BASE, p).split(sep).join('/');

// El CHANGELOG queda fuera: es la fuente, y sus entradas antiguas nombran versiones antiguas
// a propósito. Reescribirlas borraría la historia que este archivo existe para guardar.
const RE_DECLARA = /(Suite version:\s*\*\*)([\d.]+)(\*\*)/g;
const desalineados = [];

for (const f of walk(BASE).filter((f) => f.endsWith('.md') && rel(f) !== 'CHANGELOG.md')) {
  const txt = readFileSync(f, 'utf8');
  const vistas = [...txt.matchAll(RE_DECLARA)].map((x) => x[2]).filter((v) => v !== VIGENTE);
  if (vistas.length) desalineados.push([rel(f), [...new Set(vistas)].join(', '), f, txt]);
}

// El paquete, solo en el repositorio de cauce: un proyecto destino tiene el suyo, que nada
// tiene que ver con la versión de la suite.
const PKG = resolve(BASE, '..', '..', 'package.json');
let pkgDesalineado = null;
if (existsSync(PKG)) {
  try {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'));
    if (pkg.name === '@a81biz/cauce' && pkg.version !== VIGENTE) pkgDesalineado = pkg.version;
  } catch { /* ilegible: lo reporta verify-suite */ }
}

console.log(`version — vigente según el CHANGELOG: ${c.neg}${VIGENTE}${c.fin}\n`);

if (!desalineados.length && !pkgDesalineado) {
  console.log(`${c.verde}Todo declara ${VIGENTE}.${c.fin}`);
  process.exit(0);
}

for (const [nombre, vistas] of desalineados) console.log(`  ${c.rojo}✗${c.fin} ${nombre} ${c.dim}declara ${vistas}${c.fin}`);
if (pkgDesalineado) console.log(`  ${c.rojo}✗${c.fin} package.json ${c.dim}declara ${pkgDesalineado}${c.fin}`);

if (!APLICAR) {
  console.log(`\n${desalineados.length + (pkgDesalineado ? 1 : 0)} desalineado(s). Nada se ha tocado.`);
  console.log(`  node ${rel(process.argv[1]) || 'tools/version.mjs'} ${BASE} --aplicar`);
  process.exit(1);
}

for (const [nombre, , f, txt] of desalineados) {
  writeFileSync(f, txt.replace(RE_DECLARA, `$1${VIGENTE}$3`));
  console.log(`  ${c.verde}→${c.fin} ${nombre}`);
}
if (pkgDesalineado) {
  writeFileSync(PKG, readFileSync(PKG, 'utf8').replace(/("version":\s*")[\d.]+(")/, `$1${VIGENTE}$2`));
  console.log(`  ${c.verde}→${c.fin} package.json`);
}
console.log(`\n${c.verde}Alineado en ${VIGENTE}.${c.fin} Regenera el núcleo: node tools/build-core.mjs`);
process.exit(0);
