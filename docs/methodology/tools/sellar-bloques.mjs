#!/usr/bin/env node
/**
 * sellar-bloques · PT-176 · certifica los bloques cerrados tras una corrida completa en verde.
 *
 * Un bloque es el conjunto de secciones del arnes introducidas bajo una misma version MAYOR. El
 * bloque de la version VIGENTE nunca se sella: ahi se sigue escribiendo.
 *
 * QUE ESTABLECE UN SELLO: que el texto de las secciones del bloque y el de las herramientas que
 *   ejercitan son los mismos que cuando se sello, Y que la corrida que lo sello termino en verde.
 * QUE NO ESTABLECE: que el bloque pase HOY. Por eso el sello guarda su veredicto y su fecha: un
 *   bloque no se certifica por no haber cambiado, sino por haber PASADO.
 *
 * REABRIR NO ES VOLVER A CORRER. Si el sello deja de casar, el bloque vuelve a la bateria entera
 * hasta que otra corrida completa lo selle de nuevo. Este comando NO recalcula sellos rotos por su
 * cuenta: solo sella lo que se acaba de comprobar.
 *
 * ES DE LA VERSION DEL MARCO, NO DEL PROYECTO. El sello incluye las herramientas, asi que un
 * destino que las modifique deja de casar y vuelve a correr el bloque. Y el bloque se deriva del
 * commit que introdujo cada seccion —que cada destino tiene en su propio git—, asi que la
 * clasificacion es retroactiva sin que nadie declare nada.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = (() => {
  const g = (() => { try { return execFileSync('git', ['-C', AQUI, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim(); } catch { return ''; } })();
  return g || join(AQUI, '..', '..', '..');
})();
const ARNES = join(AQUI, 'selftest.sh');
const SELLOS = join(RAIZ, 'docs', 'implementation', 'SELLOS.json');
const SALTO = String.fromCharCode(10);
const APLICAR = process.argv.includes('--aplicar');

const m = await import(pathToFileURL(join(AQUI, 'patrones.mjs')).href);
const git = (a) => { try { return execFileSync('git', ['-C', RAIZ, ...a], { encoding: 'utf8' }).trim(); } catch { return ''; } };

// ── 1 · las secciones, con su cuerpo ──
const lineas = readFileSync(ARNES, 'utf8').split(SALTO);
const secciones = new Map();
let actual = null;
for (const l of lineas) {
  if (l.startsWith('sec "')) { actual = l.slice(5).replace(/"$/, '').trim(); secciones.set(actual, []); }
  else if (actual) secciones.get(actual).push(l);
}

// ── 2 · el bloque de cada seccion: el commit que la introdujo ──
const mayorDe = (titulo) => {
  const sha = git(['log', '--reverse', '--format=%H', '-S', `sec "${titulo}"`, '--',
    'docs/methodology/tools/selftest.sh']).split(SALTO).filter(Boolean)[0];
  if (!sha) return null;
  const v = git(['show', `${sha}:package.json`]).match(/"version":\s*"(\d+)\./);
  return v ? v[1] : null;
};
const version = JSON.parse(readFileSync(join(RAIZ, 'package.json'), 'utf8')).version;
const metaDe = new Map(m.seccionesDelArnes(readFileSync(ARNES ?? join(AQUI, 'selftest.sh'), 'utf8')).map((s) => [s.titulo, s]));
const { bloques, sinBloque } = m.bloquesDelArnes([...secciones.keys()], mayorDe, version);

// ── 3 · las herramientas: el cierre transitivo de lo que cada bloque ejercita ──
const fuentes = {};
for (const f of readdirSync(AQUI).filter((x) => x.endsWith('.mjs'))) {
  fuentes[f] = readFileSync(join(AQUI, f), 'utf8');
}

const previos = existsSync(SELLOS) ? JSON.parse(readFileSync(SELLOS, 'utf8')) : {};
const veredicto = process.argv.includes('--verde') ? 'OK' : null;
const hoy = git(['log', '-1', '--format=%cs']) || new Date().toISOString().slice(0, 10);

const salida = {};
const lineasOut = [];
for (const b of bloques) {
  const secs = Object.fromEntries(b.secciones.map((s) => [s, (secciones.get(s) ?? []).join(SALTO)]));
  // PT-176 · CADA BLOQUE SE SELLA CONTRA LO QUE EJERCITA, no contra todo.
  //
  // La primera version metia TODAS las herramientas en el sello de TODOS los bloques: tocar
  // cualquier archivo rompia todos los sellos, y en este repositorio casi toda sesion toca alguno.
  // El 95% de ahorro habria sido teorico — la bateria habria corrido entera igual.
  //
  // Las secciones declaran que ejercitan; de ahi sale el cierre HACIA ABAJO (dependenciasDe): un
  // cambio en una dependencia cambia el comportamiento aunque la seccion no la nombre.
  const suyas = new Set();
  for (const s of b.secciones) {
    const meta = metaDe.get(s);
    for (const h of (meta?.herramientas ?? [])) suyas.add(h);
  }
  const cierre = m.dependenciasDe(fuentes, [...suyas]);
  const herramientas = Object.fromEntries(cierre.map((f) => [f, fuentes[f]]).filter(([, v]) => v));
  const sello = m.selloDeBloque({ secciones: secs, herramientas });
  const est = m.estadoDeBloque(previos[b.mayor], sello);
  const marca = b.cerrado ? '' : '  ← abierto, no se sella';
  lineasOut.push(`  bloque ${String(b.mayor).padStart(2)}.x.x  ${String(b.secciones.length).padStart(2)} secciones  `
    + `${est.estado.padEnd(16)}${marca}`);
  if (!b.cerrado) { if (previos[b.mayor]) salida[b.mayor] = previos[b.mayor]; continue; }
  if (veredicto === 'OK') salida[b.mayor] = { sello, veredicto: 'OK', fecha: hoy, secciones: b.secciones.length };
  else if (previos[b.mayor]) salida[b.mayor] = previos[b.mayor];
}

console.log(`sellar-bloques · version ${version} · ${secciones.size} secciones`);
console.log('');
for (const l of lineasOut) console.log(l);
if (sinBloque.length) {
  // RULE-06 · lo que no se puede clasificar NO se sella: se declara y se sigue corriendo.
  console.log(`  sin bloque    ${sinBloque.length} seccion(es): no se sellan, corren siempre.`);
  for (const s of sinBloque) console.log(`      ${s.slice(0, 56)}`);
}
console.log('');
if (!veredicto) {
  console.log('  Sin --verde no se sella nada: un bloque se certifica por haber PASADO,');
  console.log('  no por que alguien ejecutara este comando (PT-175).');
} else if (!APLICAR) {
  console.log(`  --aplicar escribe ${SELLOS.replace(RAIZ, '.')} con ${Object.keys(salida).length} bloque(s).`);
} else {
  writeFileSync(SELLOS, JSON.stringify(salida, null, 2) + SALTO);
  console.log(`  ${Object.keys(salida).length} bloque(s) sellados en ${SELLOS.replace(RAIZ, '.')}`);
}
