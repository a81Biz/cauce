#!/usr/bin/env node
/**
 * revisar-secretos — compuerta de seguridad antes de publicar un repositorio.
 *
 * POR QUÉ EXISTE
 *   Instalar la suite implica que el repositorio va a publicarse, y publicar es irreversible
 *   donde importa: un secreto en la historia sigue ahí después de borrarlo del archivo. En la
 *   primera instalación real el proyecto no tenía remoto y sí una contraseña de base de datos
 *   en claro en el código de la API. Nada lo miraba: `FDGE-R45` escaneaba la evidencia de un PT
 *   y nadie el árbol ni el historial.
 *
 *   Y ocurrió otra vez, en el propio marco: el primer `npm publish` listó un
 *   `.claude/settings.local.json` con la ruta absoluta de una máquina dentro de un paquete
 *   público. Lo cazó un humano leyendo la salida, no una comprobación.
 *
 * QUÉ HACE
 *   Bloquea, y **propone la corrección**. Un escáner que solo dice «hay un secreto» deja el
 *   trabajo entero al que lo lee.
 *
 * Uso:  node revisar-secretos.mjs [ruta] [--historial] [--json]
 * Exit: 0 limpio · 1 hallazgos · 2 error
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/).
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const ARGS = process.argv.slice(2);
const ROOT = resolve(ARGS.find((a) => !a.startsWith('--')) ?? process.cwd());
const CON_HISTORIAL = ARGS.includes('--historial');
if (!existsSync(ROOT)) { console.error(`No existe: ${ROOT}`); process.exit(2); }

// Regex LITERALES. Montarlos desde strings ha fallado siete veces en este proyecto: \b se
// convierte en 0x08 y \s en «s» segun la capa de escapado, y el resultado compila sin casar nada.
const PATRONES = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'clave privada',
    'Sácala a un gestor de secretos o a una variable de entorno. Si ya se publicó, rótala: borrarla del archivo no la borra de la historia.'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'clave de acceso AWS',
    'Desactívala en IAM antes de nada. Una clave publicada se considera comprometida aunque nadie la haya usado.'],
  [/\bgh[pousr]_[A-Za-z0-9]{30,}/, 'token de GitHub',
    'Revócalo en Settings → Developer settings → Tokens. GitHub los revoca solo al detectarlos, pero no antes de que alguien haya podido leerlos.'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'token de Slack',
    'Revócalo en la configuración de la app de Slack.'],
  [/\bsk-[A-Za-z0-9]{32,}/, 'clave de API tipo sk-',
    'Revócala en el proveedor. Este formato lo usan OpenAI, Anthropic y varios más.'],
  [/\bBearer\s+eyJ[A-Za-z0-9._-]{20,}/, 'JWT en una cabecera Authorization',
    'Si es de ejemplo, sustitúyelo por «REDACTADO». Si es real, caduca la sesión.'],
  [/"(password|passwd|secret|api_?key|access_?token|refresh_?token)"\s*:\s*"(?!REDACTADO|<|\$\{|example|changeme)[^"]{4,}"/i,
    'campo de credencial con valor',
    'A variable de entorno, y el archivo con el valor a .gitignore. Deja un .env.example con el nombre y sin el valor.'],
  [/(?:^|[^A-Za-z_])(?:password|passwd|contraseña)\s*[=:]\s*(?!REDACTADO|<|\$\{|process\.env|os\.environ|example|changeme|"")["']?[^\s"';,]{6,}/i,
    'contraseña en texto plano',
    'A variable de entorno. Si es de desarrollo, sigue siendo una contraseña que alguien reutilizará.'],
];

// Lo que no es codigo del proyecto, o es un señuelo declarado.
const IGNORA_DIR = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage',
  'vendor', '__pycache__', '.venv', 'target', 'out', '.turbo', 'graphify-out']);
const BINARIO = /\.(png|jpe?g|gif|webp|pdf|zip|gz|tgz|mp4|webm|ico|woff2?|ttf|eot|so|dll|exe|bin|lock)$/i;
// El selftest de la propia suite lleva contraseñas de mentira a proposito: son el señuelo con
// el que se comprueba que este escaner funciona. Excluirlas por nombre seria fragil; se
// excluyen porque el archivo declara que lo son.
const RE_SEÑUELO = /señuelo|senuelo|fixture|de mentira|a propósito|a proposito/i;

let hallazgos = [];
const rel = (p) => relative(ROOT, p).split(sep).join('/');

function revisarTexto(texto, donde, esSeñuelo, ambito = donde) {
  texto.split(/\r?\n/).forEach((linea, i) => {
    if (linea.length > 500) return;                 // minificados y datos, no código
    for (const [re, qué, cómo] of PATRONES) {
      if (!re.test(linea)) continue;
      if (esSeñuelo || RE_SEÑUELO.test(linea)) return;
      // La huella identifica ESTE hallazgo, no el archivo: incluye lo encontrado. Si el valor
      // cambia, la excepción firmada deja de cubrirlo — que es justo lo que debe pasar.
      //
      // PT-005 · El ÁMBITO no es siempre el «dónde». Para la historia, «dónde» lleva el hash del
      // commit, y eso ataba la firma a la profundidad del clon: `actions/checkout` clona con
      // fetch-depth 1 y en un `pull_request` ese único commit es el merge SINTÉTICO de GitHub,
      // distinto en cada propuesta de merge. Ninguna excepción firmada encajaba jamás y la
      // compuerta quedaba en rojo permanente sobre todo PR — que es como funciona G4.
      // El ámbito de un hallazgo de historia es «la historia», no el commit donde apareció: es
      // el mismo secreto, ya revisado. Si el VALOR cambia, la huella cambia — que es lo que
      // FND-R29 promete y lo que sigue siendo cierto.
      const muestra = linea.trim().slice(0, 70);
      const huella = createHash('sha1').update(`${qué}|${ambito}|${muestra}`).digest('hex').slice(0, 12);
      hallazgos.push({ donde: `${donde}:${i + 1}`, qué, cómo, muestra, huella });
      return;
    }
  });
}

// ── el árbol de trabajo ─────────────────────────────────────────────────────
(function recorrer(dir) {
  let ents = [];
  try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!IGNORA_DIR.has(e.name)) recorrer(p); continue; }
    if (BINARIO.test(e.name)) continue;
    let txt;
    try {
      if (statSync(p).size > 2_000_000) continue;
      txt = readFileSync(p, 'utf8');
    } catch { continue; }
    revisarTexto(txt, rel(p), RE_SEÑUELO.test(txt.slice(0, 4000)));
  }
})(ROOT);

// ── la historia, que es donde no se borra ───────────────────────────────────
// Un secreto sigue en la historia despues de quitarlo del archivo: publicar el repositorio lo
// publica igual. Es caro de recorrer, asi que va tras --historial.
// PT-005 · Un clon SUPERFICIAL no es una historia. `actions/checkout` clona con fetch-depth 1,
// y ahi `git log` responde UN commit: la herramienta decia haber revisado la historia habiendo
// visto casi nada. Un arbol limpio habria salido verde sin mirar — el falso verde por omision,
// en la compuerta que protege lo irreversible. Lo que no se puede comprobar se DECLARA
// (RULE-06): ni «revisado» ni un error, sino SIN EVALUAR y como arreglarlo (RULE-07).
let historialRevisado = false;
let historialSuperficial = false;
if (CON_HISTORIAL && existsSync(join(ROOT, '.git'))) {
  try {
    const esSuperficial = execFileSync('git', ['rev-parse', '--is-shallow-repository'],
      { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim() === 'true';
    if (esSuperficial) {
      historialSuperficial = true;
    } else {
      const diff = execFileSync('git', ['log', '-p', '--no-color', '--max-count=400'],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe', maxBuffer: 200 * 1024 * 1024 });
      historialRevisado = true;
      let commit = '(sin commit)';
      for (const linea of diff.split(/\r?\n/)) {
        const m = linea.match(/^commit ([0-9a-f]{7,})/);
        if (m) { commit = m[1].slice(0, 8); continue; }
        if (!linea.startsWith('+') || linea.startsWith('+++')) continue;
        // El «dónde» conserva el commit para poder ir a buscarlo; el ÁMBITO de la huella, no.
        revisarTexto(linea.slice(1), `historia ${commit}`, false, 'historia');
      }
    }
  } catch { historialRevisado = false; }
}

// ── excepciones firmadas ────────────────────────────────────────────────────
// La herramienta exigía firmar la excepción por escrito y NO existía dónde firmarla. En el
// propio repositorio de cauce el escáner caza los fixtures del selftest —archivos falsos con
// contraseñas falsas, creados para probar que el escáner funciona— y la compuerta quedaba en
// rojo permanente. Una compuerta siempre roja enseña a saltársela: es peor que no tenerla.
//
// Esto NO silencia el escáner (FND-R29). Las excepciones se siguen mostrando, una por una, con
// quién firmó y por qué. Lo único que cambia es que dejan de bloquear. Y la firma cubre una
// huella concreta: si el valor cambia, vuelve a bloquear.
const FIRMADAS = join(ROOT, 'docs', 'implementation', 'SECRETOS-EXCEPCIONES.md');
const excepciones = new Map();
if (existsSync(FIRMADAS)) {
  const txt = readFileSync(FIRMADAS, 'utf8');
  // | huella | firmada por | fecha | motivo |
  for (const m of txt.matchAll(/^\|\s*`?([0-9a-f]{12})`?\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gm)) {
    const [, huella, quien, fecha, motivo] = m;
    // Una fila sin firmante no es una firma: es una fila. La plantilla sin rellenar no exime.
    if (!quien || /^[-–—\s]*$/.test(quien) || /^\[.*\]$/.test(quien)) continue;
    excepciones.set(huella, { quien, fecha, motivo });
  }
}
const firmados = hallazgos.filter((h) => excepciones.has(h.huella));
hallazgos = hallazgos.filter((h) => !excepciones.has(h.huella));

// ── informe ─────────────────────────────────────────────────────────────────
const c = { rojo: '\x1b[31m', verde: '\x1b[32m', dim: '\x1b[2m', neg: '\x1b[1m', fin: '\x1b[0m' };
console.log(`revisar-secretos · ${ROOT}`);
const notaHistoria = historialSuperficial
  ? ' · la historia SIN EVALUAR: el clon es superficial y solo ve un commit'
  : (historialRevisado ? ' + historia (400 commits)' : ' · la historia NO se revisó: añade --historial');
console.log(`${c.dim}árbol de trabajo${notaHistoria}${c.fin}\n`);
if (historialSuperficial) {
  console.log(`${c.neg}La historia queda SIN EVALUAR.${c.fin} Este clon es superficial: git solo responde por`);
  console.log('un commit, así que revisarla aquí diría «revisado» habiendo mirado casi nada — y un');
  console.log('árbol limpio saldría verde sin mirar. No se aprueba lo que no se ha podido comprobar.');
  console.log(`  → en CI:    ${c.neg}actions/checkout@v4${c.fin} con ${c.neg}fetch-depth: 0${c.fin}`);
  console.log(`  → en local: ${c.neg}git fetch --unshallow${c.fin}\n`);
}

const mostrarFirmadas = () => {
  if (!firmados.length) return;
  console.log(`${c.dim}${firmados.length} hallazgo(s) con excepción firmada — se muestran, no bloquean:${c.fin}`);
  for (const h of firmados) {
    const e = excepciones.get(h.huella);
    console.log(`  ${c.dim}${h.huella}  ${h.donde}${c.fin}`);
    console.log(`    ${c.dim}${h.qué} · firmada por ${e.quien} (${e.fecha}): ${e.motivo}${c.fin}`);
  }
  console.log('');
};
if (!hallazgos.length) {
  mostrarFirmadas();
  console.log(`${c.verde}Sin hallazgos sin firmar.${c.fin}`);
  if (!historialRevisado && existsSync(join(ROOT, '.git'))) {
    console.log(`${c.dim}Antes de publicar, revisa también la historia: un secreto borrado del archivo sigue ahí.${c.fin}`);
  }
  process.exit(0);
}

mostrarFirmadas();
const porQué = new Map();
for (const h of hallazgos) {
  if (!porQué.has(h.qué)) porQué.set(h.qué, { cómo: h.cómo, sitios: [] });
  porQué.get(h.qué).sitios.push(h);
}
for (const [qué, d] of porQué) {
  console.log(`${c.rojo}${c.neg}${qué}${c.fin} · ${d.sitios.length} sitio(s)`);
  for (const s of d.sitios.slice(0, 8)) console.log(`  ${s.donde}\n    ${c.dim}${s.muestra}${c.fin}`);
  if (d.sitios.length > 8) console.log(`  ${c.dim}… y ${d.sitios.length - 8} más${c.fin}`);
  console.log(`  ${c.neg}Corrección:${c.fin} ${d.cómo}`);
  console.log('');
}
console.log(`${hallazgos.length} hallazgo(s). Publicar un repositorio con esto dentro es irreversible:`);
console.log('un secreto en la historia sigue ahí después de borrarlo del archivo.');
console.log('');
console.log('Si alguno es un falso positivo, la excepción se firma por escrito, con nombre y');
console.log(`motivo, en ${relative(ROOT, FIRMADAS).split(sep).join('/')} — una fila por huella.`);
console.log('Sigue apareciendo en cada revisión: firmar no es silenciar (FND-R29).');
for (const h of hallazgos) console.log(`  ${c.dim}${h.huella}  ${h.donde}${c.fin}`);
process.exit(1);
