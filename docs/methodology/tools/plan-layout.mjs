#!/usr/bin/env node
/**
 * plan-layout — Enumera el terreno de la RAÍZ y DECIDE, con criterios escritos, qué proponer.
 *
 * POR QUÉ EXISTE
 *   La suite se instalaba copiando `docs/methodology/` en una carpeta y ya. Nadie miraba QUÉ
 *   había en esa carpeta. En la primera instalación real la suite quedó en una carpeta de
 *   investigación con el repositorio git y todo el código un nivel más abajo: la raíz estaba
 *   FUERA del repositorio, así que G4 no tenía merge que verificar, PHASE 10 no tenía dónde
 *   revertir y la evidencia no se podía anclar a un commit. Nada lo detectaba.
 *
 * POR QUÉ DECIDE Y NO SOLO ENUMERA
 *   La primera versión enumeraba y dejaba las decisiones al agente: destino del código,
 *   estrategia de historia git, qué versionar, alcance del grafo. El resultado dependía de lo
 *   que el agente opinara ese día — es decir, no era reproducible: dos instalaciones del mismo
 *   proyecto podían acabar distintas. Ahora los criterios están AQUÍ, escritos y verificables
 *   (FND-R25..R28); el agente los aplica y el humano los aprueba o los corrige en G0.
 *
 * QUÉ HACE Y QUÉ NO
 *   Propone. Escribe `docs/implementation/LAYOUT.md`. **No mueve un solo archivo**, no ejecuta
 *   git y no toca `.gitignore`: eso lo decide una persona en G0 (FND-R21, FND-R22).
 *
 * Uso:  node plan-layout.mjs [ruta-raíz] [--write]
 * Exit: 0 el terreno ya está en orden · 1 hay propuestas que decidir · 2 error
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/). En JS, «.» NO casa \r —es terminador de
 * linea—, de modo que un regex anclado en $ sin flag m falla en archivos de Windows.
 */

import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

const ARGS = process.argv.slice(2);
const WRITE = ARGS.includes('--write');
const ROOT = resolve(ARGS.find((a) => !a.startsWith('--')) ?? process.cwd());
if (!existsSync(ROOT)) { console.error(`No existe: ${ROOT}`); process.exit(2); }

const SUITE = join(ROOT, 'docs', 'methodology');
if (!existsSync(SUITE)) {
  console.error(`No existe docs/methodology bajo ${ROOT}.`);
  console.error('La raíz es la carpeta que recibe la suite. Copia docs/methodology/ ahí primero.');
  process.exit(2);
}

// ── Vocabulario del terreno ─────────────────────────────────────────────────
const IGNORAR = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.turbo', '.venv',
  '__pycache__', 'coverage', '.cache', 'out', 'target', 'vendor', '.svelte-kit', '.nuxt']);
const CODIGO = /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rb|rs|java|kt|cs|php|swift|scala|ex|exs|vue|svelte)$/i;
// Marca de RAIZ DE PROYECTO: si estos archivos viven en la carpeta, esa carpeta ES el proyecto,
// no una subcarpeta de codigo. Meterlos bajo src/ rompe a la herramienta que los busca arriba.
const MARCA_RAIZ = ['package.json', 'pyproject.toml', 'go.mod', 'Cargo.toml', 'pom.xml',
  'build.gradle', 'composer.json', 'Gemfile', 'docker-compose.yml', 'playwright.config.ts',
  'next.config.ts', 'next.config.js', 'vite.config.ts', 'Makefile'];
const CONTENEDOR_CODIGO = ['src', 'apps', 'packages', 'lib', 'services', 'internal', 'cmd'];
const DOC_RAIZ_OK = ['README.md', 'CLAUDE.md', 'AGENTS.md', 'CHANGELOG.md', 'CONTRIBUTING.md',
  'LICENSE.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md'];
// Fuera del grafo: no es codigo propio, o no describe el sistema sino como se comprueba.
// PT-070 · «docs» sale de la exclusion GENERAL y pasa a excluirse solo cuando NO contiene
// codigo propio. Excluir docs/ entero es correcto para documentacion y falso para codigo: en
// cauce las 16 herramientas viven en docs/methodology/tools/ —viajan dentro del paquete y ahi
// esta su sitio— y quedaban fuera del grafo. plan-layout devolvia «alcance: bin», 1 archivo,
// mientras el registro decia «bin, docs/methodology/tools» desde PT-020 porque alli se escribio
// A MANO. Cualquier instalacion nueva nacia con el defecto.
//
// La condicion es el CONTENIDO, no el nombre: un directorio de docs sin codigo sigue fuera, y
// uno con codigo entra. Es la misma leccion que FDGE-R43 —mirar el hecho, no un proxy—.
// «_archive» entra aqui: es historia guardada, no el sistema. Aparecio al dejar de excluir
// docs/ por su nombre — en el legado real, docs/_archive/2026-08-06 se colaba en el alcance.
const FUERA_DEL_GRAFO = /(^|\/)(node_modules|\.git|\.next|dist|build|coverage|vendor|__pycache__|\.venv|target|out|_archive)(\/|$)/;
// PERO docs/methodology/ es LA SUITE INSTALADA, y en cualquier proyecto que no sea cauce es
// marco de terceros: FND-R28 lo deja fuera igual que node_modules. En cauce es codigo propio
// —SUITE-R41, se aloja a si mismo— y ahi si entra.
//
// La identidad se comprueba como la comprueba el instalador: por el «name» del package.json.
// Lo detecto ejecutandolo en el proyecto de PT-072, donde el alcance salio «docs/methodology/
// tools src» — habria metido las 16 herramientas del marco en el grafo de un proyecto ajeno.
const ES_CAUCE = (() => {
  try { return JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).name === '@a81biz/cauce'; }
  catch { return false; }
})();
const SUITE_AJENA = (r) => !ES_CAUCE && /(^|\/)docs\/methodology(\/|$)/.test(r);
const ES_CONFIG = /\.(config|conf)\.[a-z]+$|^(eslint|vite|vitest|next|tailwind|postcss|rollup|webpack|babel|jest)\./i;
// PT-070 · «evidence» entra en la exclusion de pruebas. Al dejar de excluir docs/ por su
// nombre aparecieron docs/implementation/evidence/PT-023 y PT-029 en el alcance: son salidas
// GUARDADAS de una tarea —fixtures de su evidencia—, no el sistema. FND-R28 ya las excluye por
// concepto; lo que faltaba era nombrarlas, porque hasta ahora vivian bajo el docs/ que se
// excluia entero y nadie las habia visto.
const ES_PRUEBA = /(^|\/)(tests?|__tests__|e2e|spec|fixtures|mocks|stories|evidence)(\/|$)|\.(test|spec|stories)\.[a-z]+$/i;

const hallazgos = [];
const propuestas = [];
const nota = (clase, qué, porqué) => hallazgos.push({ clase, qué, porqué });
const propone = (qué, decision, porqué) => propuestas.push({ qué, decision, porqué });

const rel = (p) => relative(ROOT, p).split(sep).join('/') || '.';
const listar = (d) => { try { return readdirSync(d, { withFileTypes: true }); } catch { return []; } };
const git = (args, cwd) => {
  try { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim(); }
  catch { return null; }
};

// ── 1. Repositorios ─────────────────────────────────────────────────────────
const raizEsRepo = existsSync(join(ROOT, '.git'));
const anidados = [];
(function buscarRepos(dir, prof = 0) {
  if (prof > 3) return;
  for (const e of listar(dir)) {
    if (!e.isDirectory() || IGNORAR.has(e.name)) continue;
    const p = join(dir, e.name);
    if (existsSync(join(p, '.git'))) { anidados.push(p); continue; }
    buscarRepos(p, prof + 1);
  }
})(ROOT);

// ── 2. Dónde vive el código ─────────────────────────────────────────────────
const conteo = new Map();
(function contar(dir, top) {
  for (const e of listar(dir)) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!IGNORAR.has(e.name)) contar(p, top ?? e.name); continue; }
    if (CODIGO.test(e.name)) conteo.set(top ?? '.', (conteo.get(top ?? '.') ?? 0) + 1);
  }
})(ROOT, null);

// ── 3. FND-R25 · destino canónico ───────────────────────────────────────────
// El criterio no es una opinion: si la carpeta lleva package.json, docker-compose.yml o
// playwright.config.ts, esos archivos son de RAIZ DE PROYECTO — la herramienta que los usa los
// busca arriba, no dentro de src/. Y la suite espera playwright.config.ts en la raiz para QA
// (QA-R10): meterlo bajo src/ enfrentaria al marco consigo mismo.
for (const [d, n] of [...conteo.entries()].sort((a, b) => b[1] - a[1])) {
  if (d === '.' || n < 3 || CONTENEDOR_CODIGO.includes(d) || d.startsWith('docs')
      || ['qa', 'changes', 'tools', 'evidence'].includes(d)) continue;
  const dir = join(ROOT, d);
  const marcas = MARCA_RAIZ.filter((m) => existsSync(join(dir, m)));
  propone(`${d}/ · ${n} archivo(s) de código`,
    marcas.length ? 'subir su contenido a la RAÍZ' : 'mover a src/',
    marcas.length
      ? `Lleva ${marcas.slice(0, 4).join(', ')}: es una **raíz de proyecto**, no una subcarpeta de `
        + 'código. Esos archivos los busca la herramienta en la raíz, no dentro de `src/` — y la '
        + 'suite espera `playwright.config.ts` en la raíz para QA (`QA-R10`). Subirlo hace que la '
        + 'raíz del repositorio sea la raíz del proyecto, que es lo que vuelve verificable a G4. (`FND-R25`)'
      : 'No lleva marcas de raíz de proyecto: es una carpeta de código suelta y su sitio es `src/`. (`FND-R25`)');

  if (anidados.some((r) => rel(r) === d)) {
    // ── FND-R26 · la estrategia de historia sale de los hechos ──────────────
    const commits = Number(git(['rev-list', '--count', 'HEAD'], dir) ?? '0');
    const remoto = (git(['remote'], dir) ?? '').length > 0;
    const sucios = (git(['status', '--porcelain'], dir) ?? '').split(/\r?\n/).filter((l) => l.trim()).length;
    const merece = commits > 1 || remoto;
    propone(`historia git de ${d}/ · ${commits} commit(s), ${remoto ? 'con' : 'sin'} remoto, ${sucios} sin commitear`,
      merece ? 'conservarla (git subtree add · filter-repo)' : 'descartarla (git init en la raíz)',
      merece
        ? `Hay historia que proteger: ${commits} commit(s)${remoto ? ' y un remoto publicado' : ''}. `
          + 'Conservarla reescribe rutas, así que hay que rehacer las referencias a commits antiguos. (`FND-R26`)'
        : `No hay historia que proteger: ${commits} commit(s), sin remoto, y ${sucios} archivo(s) de `
          + 'trabajo real sin versionar. Lo que hay que salvar está en el árbol de trabajo, no en la '
          + 'historia. (`FND-R26`)');
  }
}

// ── 4. FND-R27 · qué se versiona ────────────────────────────────────────────
// Un repositorio que no versiona nada es tan inutil como no tenerlo: G4 no tiene que fusionar,
// PHASE 10 no tiene a que volver y la evidencia no se puede anclar. Aparecio en la primera
// instalacion real, con un .gitignore heredado que decia «*».
const giPath = join(ROOT, '.gitignore');
const gi = existsSync(giPath) ? readFileSync(giPath, 'utf8') : null;
const ignoraTodo = gi !== null && /^\s*\*\s*$/m.test(gi);
let versionados = -1;
if (raizEsRepo) {
  const out = git(['ls-files'], ROOT);
  versionados = out === null ? -1 : out.split(/\r?\n/).filter((l) => l.trim()).length;
}
const stack = existsSync(join(ROOT, 'package.json')) ? 'node'
  : existsSync(join(ROOT, 'pyproject.toml')) ? 'python' : 'genérico';
const GITIGNORE_SUGERIDO = {
  node: ['node_modules/', '.next/', 'dist/', 'build/', 'coverage/', '.turbo/', '*.log',
    '.env', '.env.*', '!.env.example', 'graphify-out/'],
  python: ['__pycache__/', '*.pyc', '.venv/', 'dist/', 'build/', '.pytest_cache/', '.coverage',
    '.env', '.env.*', '!.env.example', 'graphify-out/'],
  'genérico': ['dist/', 'build/', 'coverage/', '*.log', '.env', '.env.*', '!.env.example',
    'graphify-out/'],
}[stack];
const gitignoreRoto = ignoraTodo || (raizEsRepo && versionados === 0);
if (gitignoreRoto) {
  propone('qué se versiona', `sustituir .gitignore por uno de stack ${stack}`,
    (ignoraTodo ? '`.gitignore` contiene `*`: ignora **todo**. ' : '')
    + (raizEsRepo
      ? 'El repositorio existe y no versiona ni un archivo, así que '
      : 'En cuanto haya repositorio no versionaría ni un archivo, así que ')
    + '`G4` no tendría qué fusionar, `PHASE 10` no tendría a qué volver y la evidencia no se '
    + 'podría anclar a un commit. Qué se versiona es una decisión humana, no una tecnicidad. (`FND-R27`)');
}
// Sin repositorio en la raiz no hay nada que gobernar: es una propuesta accionable, no una
// observacion. Dejarla como nota la convertia en algo que nadie tenia que decidir.
if (!raizEsRepo) {
  propone('la raíz no es un repositorio git', 'git init en la raíz',
    'G4 es un merge real (`FDGE-R33`), `PHASE 10` es un rollback real y la evidencia se ancla a '
    + 'commits. Sin repositorio en la raíz, esas tres cosas no tienen dónde ocurrir.');
}

// ── 5. FND-R28 · alcance del grafo ──────────────────────────────────────────
// El grafo describe el SISTEMA. Las pruebas describen como se comprueba, y las dependencias de
// terceros no son del sistema: meterlas ahoga las senales propias entre miles de nodos ajenos.
const codigoPropio = [];
(function recorrer(dir) {
  for (const e of listar(dir)) {
    const p = join(dir, e.name);
    const r = rel(p);
    if (FUERA_DEL_GRAFO.test(r)) continue;
    if (e.isDirectory()) { recorrer(p); continue; }
    if (!CODIGO.test(e.name) || ES_PRUEBA.test(r)) continue;
    // PT-070 · un archivo de codigo dentro de docs/ SI cuenta; la documentacion no llega aqui
    // porque CODIGO ya la filtro. El nombre del directorio no decide: decide lo que contiene.
    // Salvo la suite instalada en un proyecto ajeno, que es marco de terceros.
    if (SUITE_AJENA(r)) continue;
    // Configuracion suelta de la raiz —eslint.config.mjs, vite.config.ts, next-env.d.ts— es
    // andamiaje, no sistema. Incluirla metia «.» en el alcance, y «.» arrastra todo lo demas.
    if (!r.includes('/') && (ES_CONFIG.test(e.name) || e.name.endsWith('.d.ts'))) continue;
    codigoPropio.push(r);
  }
})(ROOT);
// PT-070 · el alcance es el directorio COMUN de cada familia, no su primer segmento.
//
// Tomar el primer segmento daba «docs» —que arrastra toda la documentacion— cuando el codigo
// vive en docs/methodology/tools/. Se sube desde cada archivo hasta el directorio que los
// contiene a todos, y ahi se corta: bin/cauce.mjs da «bin»; los 16 de tools dan
// «docs/methodology/tools». El resultado coincide con lo que PT-020 escribio A MANO en el
// registro, que es la prueba de que la derivacion acerto.
const alcanceGrafo = (() => {
  const dirs = [...new Set(codigoPropio.map((f) => (f.includes('/') ? f.slice(0, f.lastIndexOf('/')) : '.')))];
  // Se queda con los ANCESTROS: si «a/b» y «a/b/c» estan, sobra «a/b/c».
  const raices = dirs.filter((d) => !dirs.some((o) => o !== d && d.startsWith(`${o}/`)));
  return [...new Set(raices)].sort();
})();
if (codigoPropio.length) {
  nota('grafo', `alcance: ${alcanceGrafo.join(' ')}`,
    `${codigoPropio.length} archivo(s) de código propio. Fuera: dependencias de terceros, salida de `
    + 'compilación, pruebas y fixtures — el grafo describe el sistema, no cómo se comprueba ni de '
    + 'qué depende. (`FND-R28`)');
}

// ── 6. Documentos sueltos ───────────────────────────────────────────────────
const sueltos = listar(ROOT).filter((e) => e.isFile() && e.name.endsWith('.md')
  && !DOC_RAIZ_OK.includes(e.name));
if (sueltos.length >= 3) {
  propone(`${sueltos.length} archivos .md en la raíz`, 'mover a docs/business/',
    'Investigación, planes y análisis previos: son la materia prima del `PHASE 0` de PTSA y de la '
    + 'Declaración de Valor. En la raíz compiten con los artefactos de la suite.');
  for (const e of sueltos.slice(0, 12)) nota('documento suelto', e.name, 'candidato a docs/business/');
}

// ── 7. Repositorios: observaciones ──────────────────────────────────────────
if (!raizEsRepo) {
  nota('repositorio', 'la raíz no es un repositorio git',
    'G4 es un merge real (`FDGE-R33`), PHASE 10 es un rollback real y la evidencia se ancla a '
    + 'commits. Sin repositorio en la raíz, esas tres cosas no tienen dónde ocurrir.');
}
for (const r of anidados) {
  nota('repositorio anidado', rel(r),
    'Tiene su propia historia, sus propias ramas y su propio merge. La suite gobierna UNA línea '
    + 'principal: con dos, «integrado» no significa lo mismo en cada sitio.');
}

// ── 7-bis. Vecindad: qué hay al lado de la raíz ─────────────────────────────
// Cauce es por proyecto y eso ya funciona. Lo que NO esta cercado es el agente: ninguna regla
// escrita en un .md impide que un proceso lea la carpeta de al lado. Ocurrio — en la primera
// maquina donde se uso, el historial de permisos guarda ordenes concedidas para copiar la
// metodologia a un proyecto hermano y crear directorios alli.
//
// Esto se REPORTA, no se cerca: la unica cerca que impone el nucleo es un contenedor, y cauce
// no genera contenedores para stacks que no conoce (FND-R25: detectar y proponer, nunca
// inventar). Una cerca por configuracion existe y es util, pero su alcance depende del arnes
// y no se puede comprobar desde aqui — enviarla sin probarla seria el verde por omision que
// este marco persigue.
const PADRE = resolve(ROOT, '..');
const hermanos = (() => {
  if (PADRE === ROOT) return [];
  return listar(PADRE)
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && join(PADRE, e.name) !== ROOT)
    .map((e) => e.name);
})();
if (hermanos.length) {
  nota('vecindad', `${hermanos.length} proyecto(s) hermano(s) en ${rel(PADRE) === '.' ? PADRE : '..'}`,
    `Alcanzables desde esta raíz: ${hermanos.slice(0, 6).join(', ')}${hermanos.length > 6 ? '…' : ''}. `
    + 'Cauce es por proyecto y eso ya está resuelto; lo que no cerca ninguna regla escrita es el '
    + 'agente. Dos niveles, con lo que garantiza cada uno: **configuración de permisos** '
    + '(`.claude/settings.json`) ataja el alcance accidental y depende de que el arnés la '
    + 'respete; **contenedor** con solo este proyecto montado lo impone el núcleo. Cauce no '
    + 'genera contenedores: detecta si los hay y lo dice.');
}
const contenedores = ['docker-compose.yml', 'docker-compose.yaml', 'Dockerfile', '.devcontainer']
  .filter((f) => existsSync(join(ROOT, f)));
nota('vecindad', contenedores.length ? `contenedores: ${contenedores.join(', ')}` : 'sin contenedores',
  contenedores.length
    ? 'El proyecto ya se contiene. Montar solo su raíz al trabajar con el agente convierte la frontera en algo que impone el núcleo, no una convención.'
    : 'La frontera del proyecto es hoy una convención. Si necesitas que la imponga el núcleo, el contenedor es trabajo propio del proyecto — no algo que cauce deba generar.');

// ── 8. Dependencias ─────────────────────────────────────────────────────────
const DEPS = [
  { nombre: 'node', probar: ['node', ['--version']], para: 'los verificadores de la suite', instalar: null },
  { nombre: 'git', probar: ['git', ['--version']], para: 'G4 (merge), PHASE 10 (rollback) y anclar la evidencia a commits', instalar: null },
  { nombre: 'python', probar: ['python', ['--version']], para: 'graphify', instalar: null },
  { nombre: 'graphifyy', probar: ['python', ['-c', 'import graphify']], para: 'el grafo que FDGE-R43 exige en los PT MAJOR', instalar: 'uv tool install --upgrade graphifyy   (o pip install graphifyy)' },
];
const deps = DEPS.map((d) => {
  let ok = false;
  try { execFileSync(d.probar[0], d.probar[1], { stdio: 'pipe' }); ok = true; } catch { ok = false; }
  if (!ok) nota('dependencia', `${d.nombre} no disponible`, `Necesaria para ${d.para}.` + (d.instalar ? ` → ${d.instalar}` : ''));
  return { ...d, ok };
});

// ── 9. Artefactos que faltan ────────────────────────────────────────────────
const REQUERIDOS = ['docs/enterprise-documentation', 'docs/implementation', 'changes', 'evidence', 'graphify-out'];
const faltantes = REQUERIDOS.filter((d) => !existsSync(join(ROOT, ...d.split('/'))));

// ── Informe ────────────────────────────────────────────────────────────────
const hoy = new Date().toISOString().slice(0, 10);
const bloque = (t, arr, fmt) => (arr.length ? `\n### ${t}\n\n${arr.map(fmt).join('\n')}\n` : '');

const plan = `# LAYOUT — plan de terreno de la raíz

Generado por \`tools/plan-layout.mjs\` el ${hoy}. **Propuesta, no ejecución** (\`FND-R21\`).

Raíz: \`${ROOT}\`
Repositorio git en la raíz: **${raizEsRepo ? 'sí' : 'NO'}**${raizEsRepo && versionados >= 0 ? ` · ${versionados} archivo(s) versionado(s)` : ''}

> La carpeta que recibe la suite **manda**: es la raíz, sin excepción. Los criterios de cada
> propuesta están escritos —\`FND-R25\` destino · \`FND-R26\` historia git · \`FND-R27\` qué se
> versiona · \`FND-R28\` alcance del grafo— para que dos instalaciones del mismo proyecto den el
> mismo resultado, lo opine quien lo opine.
${bloque('Propuestas', propuestas, (p) => `- **${p.qué}** → **${p.decision}**\n  ${p.porqué}`)}${bloque('Observaciones del terreno', hallazgos, (h) => `- \`${h.qué}\` — *${h.clase}*: ${h.porqué}`)}${bloque('Dependencias', deps, (d) => `- \`${d.nombre}\` — ${d.ok ? 'disponible' : '**NO disponible**'} · ${d.para}${d.ok || !d.instalar ? '' : `. Instalar con: \`${d.instalar}\``}`)}${faltantes.length ? `\n### Artefactos de la suite por crear\n\n${faltantes.map((f) => `- \`${f}/\``).join('\n')}\n` : ''}${gitignoreRoto ? `\n### \`.gitignore\` propuesto — stack ${stack}\n\n\`\`\`gitignore\n${GITIGNORE_SUGERIDO.join('\n')}\n\`\`\`\n` : ''}${codigoPropio.length ? `\n### Alcance del grafo · \`FND-R28\`\n\n\`\`\`\n/graphify ${alcanceGrafo.join(' ')}\n\`\`\`\n\n${codigoPropio.length} archivo(s) de código propio. Fuera: dependencias, compilación, pruebas y fixtures.\n` : ''}
---

## Decisión — la toma una persona (compuerta **G0**, \`FND-R22\`)

Ningún modo de ejecución automatiza esto. Para cada propuesta: **ACEPTADO**, **RECHAZADO** (con
motivo) o **MODIFICADO** (con el destino real).

| # | Propuesta | Decisión | Motivo / destino real |
|:--|:---|:---|:---|
${propuestas.map((p, i) => `| ${i + 1} | ${p.qué} → ${p.decision} | | |`).join('\n') || '| — | *sin propuestas* | ACEPTADO | el terreno ya está en orden |'}

\`\`\`
Revisado por:        ← tu nombre, tal como figura en «firmantes:» del CLAUDE.md
Fecha:
El plan de terreno refleja la estructura que quiero: SÍ | NO   ← deja solo una
\`\`\`

Mientras este bloque esté sin firmar, \`verify-fdge\` bloquea la apertura de PTs nuevos
(\`FND-R23\`): documentar y auditar una estructura que está a punto de cambiar es trabajo que
hay que rehacer.
`;

if (WRITE) {
  mkdirSync(join(ROOT, 'docs', 'implementation'), { recursive: true });
  const destino = join(ROOT, 'docs', 'implementation', 'LAYOUT.md');
  if (existsSync(destino) && /refleja la estructura que quiero:\s*S[IÍ]\s*$/im.test(readFileSync(destino, 'utf8'))) {
    console.error('docs/implementation/LAYOUT.md ya está FIRMADO. No se sobrescribe una decisión tomada.');
    console.error('Si el terreno cambió, archívalo y vuelve a generarlo (FND-R21).');
    process.exit(2);
  }
  writeFileSync(destino, plan, 'utf8');
  console.log(`Escrito docs/implementation/LAYOUT.md · ${propuestas.length} propuesta(s).`);
} else {
  console.log(plan);
}
console.log(propuestas.length
  ? `\n${propuestas.length} propuesta(s) esperan decisión humana (G0).`
  : '\nEl terreno ya está en orden.');
process.exit(propuestas.length || !raizEsRepo ? 1 : 0);
