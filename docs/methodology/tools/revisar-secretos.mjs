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

const hallazgos = [];
const rel = (p) => relative(ROOT, p).split(sep).join('/');

function revisarTexto(texto, donde, esSeñuelo) {
  texto.split(/\r?\n/).forEach((linea, i) => {
    if (linea.length > 500) return;                 // minificados y datos, no código
    for (const [re, qué, cómo] of PATRONES) {
      if (!re.test(linea)) continue;
      if (esSeñuelo || RE_SEÑUELO.test(linea)) return;
      hallazgos.push({ donde: `${donde}:${i + 1}`, qué, cómo, muestra: linea.trim().slice(0, 70) });
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
let historialRevisado = false;
if (CON_HISTORIAL && existsSync(join(ROOT, '.git'))) {
  try {
    const diff = execFileSync('git', ['log', '-p', '--no-color', '--max-count=400'],
      { cwd: ROOT, encoding: 'utf8', stdio: 'pipe', maxBuffer: 200 * 1024 * 1024 });
    historialRevisado = true;
    let commit = '(sin commit)';
    for (const linea of diff.split(/\r?\n/)) {
      const m = linea.match(/^commit ([0-9a-f]{7,})/);
      if (m) { commit = m[1].slice(0, 8); continue; }
      if (!linea.startsWith('+') || linea.startsWith('+++')) continue;
      revisarTexto(linea.slice(1), `historia ${commit}`, false);
    }
  } catch { historialRevisado = false; }
}

// ── informe ─────────────────────────────────────────────────────────────────
const c = { rojo: '\x1b[31m', verde: '\x1b[32m', dim: '\x1b[2m', neg: '\x1b[1m', fin: '\x1b[0m' };
console.log(`revisar-secretos · ${ROOT}`);
console.log(`${c.dim}árbol de trabajo${historialRevisado ? ' + historia (400 commits)' : ' · la historia NO se revisó: añade --historial'}${c.fin}\n`);

if (!hallazgos.length) {
  console.log(`${c.verde}Sin hallazgos.${c.fin}`);
  if (!historialRevisado && existsSync(join(ROOT, '.git'))) {
    console.log(`${c.dim}Antes de publicar, revisa también la historia: un secreto borrado del archivo sigue ahí.${c.fin}`);
  }
  process.exit(0);
}

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
console.log('Si alguno es un falso positivo, la excepción se firma como se firma el plan de');
console.log('terreno: por escrito, con nombre y motivo. No se silencia el escáner.');
process.exit(1);
