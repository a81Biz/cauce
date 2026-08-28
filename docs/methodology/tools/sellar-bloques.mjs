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
// PT-191 · apuntable a un arbol de pruebas, igual que su hermano `bloques-sellados.mjs:19`.
// Sin esto el sellador mira SIEMPRE el repositorio real, y un caso que le plante un recibo
// sintetico no lo leeria nunca: pasaria o fallaria por el motivo equivocado.
const RAIZ = process.env.MTH_RAIZ || (() => {
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
// ── PT-191 · EL VEREDICTO SALE DEL RECIBO DE LA CORRIDA, NO DE UNA BANDERA ──
//
// Esto era «process.argv.includes('--verde') ? 'OK' : null»: nada comprobaba que la corrida
// ocurriera, ni que fuera completa, ni que terminara en verde. El veredicto que el sello guarda
// —la pieza que PT-175 introdujo para que un bloque no quedara certificado por no haber
// cambiado— era la palabra de quien ejecuto el comando. Un proxy en lugar del hecho (CE-001), en
// el mecanismo construido para eliminarlo. La cabecera de este archivo ya decia «tras una corrida
// completa en verde»: la distancia entre esa linea y esta era el defecto entero.
//
// EL CASO QUE LO DESTAPO ES REAL. PT-190 cambio revisar-secretos.mjs, lo que reabrio el bloque 8,
// y la corrida que lo devolvio al verde fue la ACOTADA —122 casos—. Sellar ahi habria estampado
// con fecha de hoy los bloques 9, 10 y 11: 16 secciones que ese dia NO se ejecutaron.
//
// El recibo lo escribe SOLO «selftest.sh --todo», y lleva la huella del arnes: editar la bateria
// lo invalida sin que nadie tenga que acordarse. Si no hay recibo, o no se puede leer, o su
// corrida fallo, o es de otra bateria, NO SE SELLA — y se dice CUAL de las cuatro cosas es,
// porque una negativa que no distingue obliga a suponer (RULE-06).
const RECIBO = join(RAIZ, 'docs', 'implementation', 'CORRIDA.json');
const arnesHoy = git(['hash-object', ARNES]);
const recibo = (() => {
  if (!existsSync(RECIBO)) return null;
  try { return JSON.parse(readFileSync(RECIBO, 'utf8')); } catch { return 'ILEGIBLE'; }
})();
const porQueNo = !process.argv.includes('--verde')
  ? 'sin --verde no se sella: el sello es una DECISION, no un efecto de ejecutar el comando'
  : recibo === null
    ? `no hay recibo de corrida en ${RECIBO.replace(RAIZ, '.')}. Lo escribe «selftest.sh --todo», y es eso lo que certifica — no esta bandera (PT-191)`
    : recibo === 'ILEGIBLE'
      ? `el recibo de ${RECIBO.replace(RAIZ, '.')} no es JSON legible: un recibo que no se puede leer no certifica nada`
      : recibo.veredicto !== 'OK'
        ? `el recibo dice «${recibo.veredicto}»: una corrida que fallo no certifica nada`
        : recibo.arnes !== arnesHoy
          ? `el recibo es de otra bateria (${String(recibo.arnes).slice(0, 12)} != ${String(arnesHoy).slice(0, 12)}): el arnes cambio despues de correr`
          : null;
const veredicto = porQueNo ? null : 'OK';
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
  console.log(`  NO SE SELLA: ${porQueNo}.`);
  console.log('  Un bloque se certifica por haber PASADO, no por que alguien');
  console.log('  ejecutara este comando (PT-175, PT-191).');
} else if (!APLICAR) {
  console.log(`  --aplicar escribe ${SELLOS.replace(RAIZ, '.')} con ${Object.keys(salida).length} bloque(s).`);
} else {
  writeFileSync(SELLOS, JSON.stringify(salida, null, 2) + SALTO);
  console.log(`  ${Object.keys(salida).length} bloque(s) sellados en ${SELLOS.replace(RAIZ, '.')}`);
}
