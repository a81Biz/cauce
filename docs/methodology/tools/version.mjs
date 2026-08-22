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
//
// PT-102 · el patrón vive en `patrones.mjs`, no aquí. Este archivo llevaba el suyo propio y
// conocía UNA sola forma de declarar la versión, así que terminaba diciendo «Todo declara la
// vigente» con CUATRO documentos declarando otra con la otra forma. Un patrón crítico escrito
// en local no lo contrasta nadie (`SUITE-R38`).
const RE_DE = () => new RegExp(PATRONES.VERSION_DECLARADA.re.source, 'gm');
const desalineados = [];

// PT-102 · el `CLAUDE.md` del proyecto entra en el recorrido. Vive DOS niveles por encima de
// `docs/methodology/` y por eso quedaba fuera del árbol que se camina — y es justo donde vive
// la parametrización que `SUITE-R00` declara: mientras la suite iba por la 11.0.0, el
// `CLAUDE.md` de este mismo repositorio seguía diciendo 10.0.0 sin que nada lo viera.
const CLAUDE_MD = resolve(BASE, '..', '..', 'CLAUDE.md');
const aRevisar = walk(BASE).filter((f) => f.endsWith('.md') && rel(f) !== 'CHANGELOG.md');
if (existsSync(CLAUDE_MD)) aRevisar.push(CLAUDE_MD);

for (const f of aRevisar) {
  const txt = readFileSync(f, 'utf8');
  const vistas = [...txt.matchAll(RE_DE())].map((x) => x[2]).filter((v) => v !== VIGENTE);
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

// PT-108 · LA TERCERA FORMA DE DECLARAR LA VERSION, y esta en JSON.
//
// PT-102 encontro dos —«Suite version: **X.Y.Z**» y «suite_version: X.Y.Z» en Markdown— y dejo
// declarado lo que NO establecia: «cuantas formas mas existen. Se conocen dos». Esta es la
// respuesta, y aparecio AL SELLAR la 12.0.0: la herramienta dijo «Todo declara 12.0.0» y
// REGISTRY.json seguia en la 11.0.0, lo que dejo el proyecto en MODO RESTRINGIDO (SUITE-R17).
//
// El sello es la unica operacion que toca todas las declaraciones a la vez, y por eso es donde
// una que falta se nota.
//
// Se lee y se escribe SOLO ese campo, con el archivo entero reserializado: un descuido aqui
// borraria allocations, que es exactamente lo que PT-107 vivio el mismo dia.
const REG = resolve(BASE, '..', 'implementation', 'REGISTRY.json');
let regDesalineado = null;
if (existsSync(REG)) {
  try {
    const reg = JSON.parse(readFileSync(REG, 'utf8'));
    if (typeof reg.suite_version === 'string' && reg.suite_version !== VIGENTE) {
      regDesalineado = reg.suite_version;
    }
  } catch { /* ilegible: lo reporta verify-fdge */ }
}

console.log(`version — vigente según el CHANGELOG: ${c.neg}${VIGENTE}${c.fin}\n`);

if (!desalineados.length && !pkgDesalineado && !regDesalineado) {
  console.log(`${c.verde}Todo declara ${VIGENTE}.${c.fin}`);
  process.exit(0);
}

for (const [nombre, vistas] of desalineados) console.log(`  ${c.rojo}✗${c.fin} ${nombre} ${c.dim}declara ${vistas}${c.fin}`);
if (pkgDesalineado) console.log(`  ${c.rojo}✗${c.fin} package.json ${c.dim}declara ${pkgDesalineado}${c.fin}`);
if (regDesalineado) console.log(`  ${c.rojo}✗${c.fin} REGISTRY.json ${c.dim}declara ${regDesalineado}${c.fin}`);

if (!APLICAR) {
  console.log(`\n${desalineados.length + (pkgDesalineado ? 1 : 0) + (regDesalineado ? 1 : 0)} desalineado(s). Nada se ha tocado.`);
  console.log(`  node ${rel(process.argv[1]) || 'tools/version.mjs'} ${BASE} --aplicar`);
  process.exit(1);
}

for (const [nombre, , f, txt] of desalineados) {
  // `$3` es el cierre `**` de la forma A y queda vacio en la B, que no lo lleva: un grupo que no
  // participa se reemplaza por cadena vacia, asi que la misma linea sirve para las dos formas.
  writeFileSync(f, txt.replace(RE_DE(), `$1${VIGENTE}$3`));
  console.log(`  ${c.verde}→${c.fin} ${nombre}`);
}
if (pkgDesalineado) {
  writeFileSync(PKG, readFileSync(PKG, 'utf8').replace(/("version":\s*")[\d.]+(")/, `$1${VIGENTE}$2`));
  console.log(`  ${c.verde}→${c.fin} package.json`);
}
// PT-108 · el REGISTRO, y SOLO su campo de version.
//
// Se reemplaza sobre el TEXTO y no reserializando el JSON: `JSON.stringify` reordenaria claves,
// cambiaria el sangrado y produciria un diff enorme sobre el archivo que guarda el estado del
// marco — y PT-107 acaba de demostrar el mismo dia lo que cuesta escribir mal ese archivo.
//
// No pasa por el cerrojo de `tracker` porque vive en otra herramienta y no lo exporta. Se DECLARA
// (RULE-06): esta escritura NO esta protegida contra otro comando escribiendo a la vez. Es una
// operacion del SELLO, que no concurre con trabajo de tareas, pero decirlo es la diferencia entre
// un limite conocido y uno que alguien descubrira.
if (regDesalineado) {
  const antes = readFileSync(REG, 'utf8');
  const despues = antes.replace(/("suite_version"\s*:\s*")[\d.]+(")/, `$1${VIGENTE}$2`);
  if (despues === antes) {
    console.log(`  ${c.rojo}✗${c.fin} REGISTRY.json: no se pudo reemplazar el campo. NO se ha tocado.`);
  } else {
    writeFileSync(REG, despues);
    console.log(`  ${c.verde}→${c.fin} REGISTRY.json ${c.dim}(solo suite_version)${c.fin}`);
  }
}
console.log(`\n${c.verde}Alineado en ${VIGENTE}.${c.fin} Regenera el núcleo: node tools/build-core.mjs`);
process.exit(0);
