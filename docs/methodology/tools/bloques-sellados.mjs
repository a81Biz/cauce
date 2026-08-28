#!/usr/bin/env node
/**
 * bloques-sellados · PT-176 · devuelve las secciones que TODAVIA hay que correr.
 *
 * Lo llama `selftest.sh` para acotar: imprime «|seccion|seccion|…» con las de los bloques ABIERTOS
 * mas las que no se pudieron clasificar. Si nada esta sellado, no imprime nada y la bateria corre
 * entera — el silencio aqui significa «no acotes», nunca «no hay nada que correr».
 *
 * EL SELLO SE COMPRUEBA, NO SE CREE. Un bloque solo se salta si su sello CASA con lo que hoy son
 * sus secciones y sus herramientas, y si su corrida termino en verde. Cualquier otra cosa
 * —REABIERTO, SELLADO_EN_ROJO, SIN_SELLAR— lo devuelve a la bateria.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = process.env.MTH_RAIZ
  || (() => { try { return execFileSync('git', ['-C', AQUI, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim(); } catch { return join(AQUI, '..', '..', '..'); } })();
const SELLOS = join(RAIZ, 'docs', 'implementation', 'SELLOS.json');
const SALTO = String.fromCharCode(10);

if (!existsSync(SELLOS)) process.exit(0);            // nada sellado: la bateria corre entera

const m = await import(pathToFileURL(join(AQUI, 'patrones.mjs')).href);
const git = (a) => { try { return execFileSync('git', ['-C', RAIZ, ...a], { encoding: 'utf8' }).trim(); } catch { return ''; } };

const ARNES = join(AQUI, 'selftest.sh');
const lineas = readFileSync(ARNES, 'utf8').split(SALTO);
const secciones = new Map();
let act = null;
for (const l of lineas) {
  if (l.startsWith('sec "')) { act = l.slice(5).replace(/"$/, '').trim(); secciones.set(act, []); }
  else if (act) secciones.get(act).push(l);
}

const mayorDe = (t) => {
  const sha = git(['log', '--reverse', '--format=%H', '-S', `sec "${t}"`, '--',
    'docs/methodology/tools/selftest.sh']).split(SALTO).filter(Boolean)[0];
  if (!sha) return null;
  const v = git(['show', `${sha}:package.json`]).match(/"version":\s*"(\d+)\./);
  return v ? v[1] : null;
};
const version = JSON.parse(readFileSync(join(RAIZ, 'package.json'), 'utf8')).version;
const metaDe = new Map(m.seccionesDelArnes(readFileSync(ARNES, 'utf8')).map((s) => [s.titulo, s]));
const { bloques, sinBloque } = m.bloquesDelArnes([...secciones.keys()], mayorDe, version);

const fuentes = {};
for (const f of readdirSync(AQUI).filter((x) => x.endsWith('.mjs'))) fuentes[f] = readFileSync(join(AQUI, f), 'utf8');
const previos = JSON.parse(readFileSync(SELLOS, 'utf8'));

const correr = [...sinBloque];                        // lo no clasificable corre SIEMPRE (RULE-06)
let saltados = 0;
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
  if (b.cerrado && est.estado === 'SELLADO') { saltados += 1; continue; }
  correr.push(...b.secciones);
}
// Si no se salta ninguno, no se acota: que la bateria corra entera es el comportamiento correcto,
// y acotar «a todo» solo anadiria una capa que puede equivocarse.
if (!saltados) process.exit(0);
process.stdout.write('|' + correr.join('|') + '|');
