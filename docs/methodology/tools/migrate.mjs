#!/usr/bin/env node
/**
 * migrate — Migra un proyecto a la versión vigente de la Methodology Suite.
 *
 * Detecta la versión instalada y ejecuta la parte mecánica. Lo que exige criterio humano
 * —firmas retroactivas, decisiones de reconciliación, comportamiento esperado de un bug
 * abierto— se lista como acción pendiente y NUNCA se inventa (SUITE-R19).
 *
 * Garantía central (SUITE-R18): los PTs en vuelo conservan la versión con la que se
 * abrieron. Migrar nunca invalida trabajo en curso.
 *
 * Uso:  node migrate.mjs [--apply] [ruta-proyecto]
 *       sin --apply es un informe: no toca nada.
 * Exit: 0 nada pendiente · 1 acciones humanas pendientes · 2 error
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, renameSync, statSync, appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PATRONES } from './patrones.mjs';

// El destino de la migración es la versión vigente, y esa no se escribe aquí (`SUITE-R40`).
// Estuvo fijada —`const TARGET = '5.2.0'`— y quedó tres parches por detrás del CHANGELOG: la
// herramienta que existe para alinear versiones alineaba contra un número muerto, y habría
// dejado el registro declarando una versión que ya no regía. Se lee del CHANGELOG que viaja
// con esta copia de la suite, resuelto desde la ubicación del script.
const CAMBIOS = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'CHANGELOG.md');
if (!existsSync(CAMBIOS)) {
  console.error(`Falta ${CAMBIOS}: sin él no se puede saber a qué versión migrar.`);
  process.exit(2);
}
const mVer = readFileSync(CAMBIOS, 'utf8').match(PATRONES.VERSION_VIGENTE.re);
if (!mVer) {
  console.error('El CHANGELOG no abre con «## X.Y.Z — AAAA-MM-DD». Es de donde se lee la vigente.');
  process.exit(2);
}
const TARGET = mVer[1];
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const ROOT = resolve(args.find((a) => !a.startsWith('--')) ?? process.cwd());
const IMPL = join(ROOT, 'docs', 'implementation');
const ED = join(ROOT, 'docs', 'enterprise-documentation');

const auto = [];   // hecho (o que se haría) automáticamente
const manual = []; // requiere una persona
const skip = [];

const has = (p) => existsSync(join(ROOT, p));
const rd = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : null);
const act = (msg, fn) => { auto.push(msg); if (APPLY && fn) fn(); };
const need = (msg) => manual.push(msg);

function jsonAt(p) {
  const raw = rd(p);
  if (raw == null) return null;
  try { return JSON.parse(raw); } catch { return undefined; }
}

// ── Detección de versión instalada ──────────────────────────────────────────
function detect() {
  const reg = jsonAt('docs/implementation/REGISTRY.json');
  if (reg && reg.suite_version) return { v: reg.suite_version, reg };
  // Sin REGISTRY: es v3 o anterior. Se distingue por sus artefactos característicos.
  if (has('docs/implementation/PLAN_ACTUAL.md') || has('docs/implementation/PENDING_TASKS.md')
      || has('docs/implementation/instrucctions.md') || has('PTSA/Hallazgos') || has('PTSA/Fases')) {
    return { v: '3.x', reg: null };
  }
  if (has('docs/implementation')) return { v: '3.x?', reg: null };
  return { v: null, reg: null };
}

const { v: FROM, reg } = detect();

console.log(`migrate — Methodology Suite → ${TARGET}`);
console.log(`Proyecto: ${ROOT}`);
console.log(`Versión detectada: ${FROM ?? '(ninguna — no parece un proyecto con la suite)'}`);
console.log(APPLY ? 'Modo: APPLY — se modificarán archivos\n' : 'Modo: informe (añade --apply para ejecutar)\n');

if (!FROM) {
  console.log('No hay nada que migrar. Para instalar la suite, ver README §4.');
  process.exit(0);
}
if (FROM === TARGET) {
  console.log(`Ya está en ${TARGET}.`);
  // aun así, comprobaciones de integridad
}

const cmp = (a, b) => {
  const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0); }
  return 0;
};
const isV3 = FROM.startsWith('3');
const lt = (x) => isV3 || cmp(FROM, x) < 0;

// ── Utilidades de migración ─────────────────────────────────────────────────
function moveIfExists(from, to, why) {
  if (!has(from)) return;
  act(`mover  ${from} → ${to}   (${why})`, () => {
    mkdirSync(join(ROOT, to, '..'), { recursive: true });
    renameSync(join(ROOT, from), join(ROOT, to));
  });
}
function ensureFile(p, content, why) {
  if (has(p)) return;
  act(`crear  ${p}   (${why})`, () => {
    mkdirSync(join(ROOT, p, '..'), { recursive: true });
    writeFileSync(join(ROOT, p), content, 'utf8');
  });
}

// ── 3.x → 4.x ───────────────────────────────────────────────────────────────
if (isV3) {
  // REGISTRY con contadores sembrados al MÁXIMO ID YA USADO, nunca a 0 (LEX-R04)
  const maxOf = (pfx, txt) => (txt ?? '').match(new RegExp(`${pfx}-(\\d+)`, 'g'))
    ?.reduce((m, s) => Math.max(m, Number(s.split('-')[1])), 0) ?? 0;
  const hist = rd('docs/implementation/HISTORY.log') ?? '';
  const qah = rd('QA/QA-DEFECTS.md') ?? '';
  const ptsah = (has('PTSA/Hallazgos') ? readdirSync(join(ROOT, 'PTSA/Hallazgos')).join(' ') : '')
    + (has('PTSA/Findings') ? readdirSync(join(ROOT, 'PTSA/Findings')).join(' ') : '');
  const road = rd('docs/implementation/ROADMAP.md') ?? '';
  const counters = {
    PT: maxOf('PT', hist), EP: 0,
    QA: maxOf('QA', qah), QR: maxOf('QR', rd('QA/QA-LOG.md') ?? ''), QD: maxOf('QD', qah),
    H: maxOf('H', ptsah), E: 0, P: 0, R: maxOf('R', road), INC: 0,
  };
  ensureFile('docs/implementation/REGISTRY.json',
    JSON.stringify({ suite_version: TARGET, execution_mode: 'MANUAL', counters, allocations: [] }, null, 2) + '\n',
    `contadores sembrados al máximo ID ya usado (PT=${counters.PT}) — LEX-R04: los IDs no se reutilizan`);

  moveIfExists('docs/implementation/SESSION_SUMMARY.md', 'docs/implementation/SESSION_LOG.md', 'LEX-R20');
  for (const [a, b] of [['PTSA/Fases', 'PTSA/Phases'], ['PTSA/Hallazgos', 'PTSA/Findings'],
                        ['PTSA/Evidencias', 'PTSA/Evidence'], ['PTSA/Productos', 'PTSA/Products']]) {
    moveIfExists(a, b, 'LEX-R14');
  }
  for (const f of ['docs/implementation/instrucctions.md', 'PTSA/Motor-PTSA.md', 'PTSA/PTSA.md']) {
    if (has(f)) act(`archivar ${f} → docs/_archive/migracion-${TARGET}/   (derogado, LEX-R20)`, () => {
      const to = join(ROOT, 'docs', '_archive', `migracion-${TARGET}`, f);
      mkdirSync(join(to, '..'), { recursive: true }); renameSync(join(ROOT, f), to);
    });
  }

  // Los archivos globales por-PT son el bloqueo estructural (FDGE-R39)
  for (const f of ['PLAN_ACTUAL.md', 'PENDING_TASKS.md', 'CONTEXT_ANALYSIS.md']) {
    if (has(`docs/implementation/${f}`)) {
      need(`mover el contenido de docs/implementation/${f} al directorio del PT al que pertenece ` +
           `(changes/PT-XXX-slug/${{ 'PLAN_ACTUAL.md': 'strategy.md', 'PENDING_TASKS.md': 'tasks.md', 'CONTEXT_ANALYSIS.md': 'context.md' }[f]}). ` +
           'Es contenido de un PT concreto: la máquina no sabe de cuál. FDGE-R39.');
    }
  }
  need('convertir DISCOVERY.md, ENRICHMENT.md y REFACTOR_SCOPE.md en ÍNDICES (una línea por PT) ' +
       'y mover el cuerpo del análisis a changes/PT-XXX-slug/. LEX-R12.');
  need('migrar los valores de estado con la tabla de LEXICON §5.4. Atención a SCOPE_PENDING: ' +
       'esos refactors llevan abiertos desde que se escribieron.');
  need('crear un intake.md retroactivo por cada PT vivo y FIRMARLO. Un PT sin Intake no puede ' +
       'avanzar (FDGE-R01). Alternativa: marcarlo «heredado de v3, sin firma» y cerrarlo bajo las ' +
       'reglas de su versión (SUITE-R18).');
  need('ejecutar [START RECONCILE]: la fase de reconciliación no existía en v3 y el repositorio ' +
       'arrastra documentación sin decisión (FND-R15).');
  if (has('docs/enterprise-documentation/01-PRD.md') && !has('docs/enterprise-documentation/02-PRD.md')) {
    need('el paquete tiene numeración de FIDE v3 (01-PRD, 02-ARCHITECTURE…). Ejecutar ' +
         '[START FOUNDATION] para regenerarlo con los nombres canónicos. FIDE-R04.');
  }
}

// ── 4.0.x → 4.1+ · grafo y reconciliación ───────────────────────────────────
if (lt('4.1.0')) {
  if (reg && !reg.graph) {
    act('REGISTRY.graph ausente → se añadirá vacío; regenerar el grafo sobre src/ (FND-R14)', () => {
      const r = jsonAt('docs/implementation/REGISTRY.json');
      r.graph = { generated: null, scope: 'src/', pt_at_generation: null };
      writeFileSync(join(IMPL, 'REGISTRY.json'), JSON.stringify(r, null, 2) + '\n');
    });
    need('regenerar el grafo de dependencias sobre src/ y rellenar REGISTRY.graph. ' +
         'Hasta entonces, FDGE-R43 bloquea los PT MAJOR.');
  }
  const hist = rd('docs/implementation/HISTORY.log');
  if (hist && /^## PT-\d+/m.test(hist) && !/^Estructural:/m.test(hist)) {
    need('añadir «Estructural: sí | no» a las entradas de HISTORY.log. Solo tú sabes qué PT movió ' +
         'archivos; sin ese dato la frescura del grafo no es computable (FDGE-R44).');
  }
  if (!has('docs/implementation/RECONCILIATION.log')) {
    need('ejecutar [START RECONCILE]: la fase de reconciliación no existía en 4.0.x (FND-R15).');
  }
}

// ── → 4.2.0 · suite_version por allocation y CORE ───────────────────────────
if (lt('4.2.0') && reg) {
  const pend = (reg.allocations ?? []).filter((a) => !a.suite_version);
  if (pend.length) {
    act(`sellar suite_version en ${pend.length} allocation(s) con la versión de origen «${FROM}» (SUITE-R18)`, () => {
      const r = jsonAt('docs/implementation/REGISTRY.json');
      for (const a of r.allocations ?? []) if (!a.suite_version) a.suite_version = FROM;
      writeFileSync(join(IMPL, 'REGISTRY.json'), JSON.stringify(r, null, 2) + '\n');
    });
  }
}

// ── → 5.0.0 · el estado sale de la memoria del agente ───────────────────────
// PT-012 · Este tramo NO EXISTÍA. Un proyecto en 4.12 recibía un informe de dos líneas —sella
// la versión, actualiza el CLAUDE.md— y todo lo demás vivía en PROSA dentro del CHANGELOG de
// dos versiones atrás. `SUITE-R19` pide listar como acción pendiente lo que no se automatiza,
// y eso no se estaba haciendo para el salto que más cosas pide.
//
// Se DETECTA, no se recita: un tramo que imprima siempre los nueve pasos de los que te aplican
// dos ensena a no leerlo. Es el patrón que ya usan los tramos de 3.x y 4.1.
if (lt('5.0.0')) {
  const handoff = rd('docs/implementation/HANDOFF.md');
  if (handoff !== null && !/<!--\s*ESTADO\s*-->/.test(handoff)) {
    need('escribir el bloque ESTADO al principio de HANDOFF.md (SUITE-R33). Campos fijos: '
      + 'implementación · tarea · compuerta · siguiente · decisiones · no hacer · actualizado. '
      + 'El formato está en INSTALL.md y en FDGE-Prompts.md. NO lo escribe esta herramienta: '
      + 'declara qué compuerta espera y a quién, y cuál es la siguiente acción — eso no lo sabe '
      + 'una máquina, y rellenarlo con plantilla produce un estado que miente. '
      + 'Sin él, verify-fdge falla.');
    need('escribirlo AL CERRAR CADA FASE, no al terminar la sesión: una sesión no siempre avisa '
      + 'de que va a terminar, y SUITE-R34 lo comprueba contra git.');
  }
  const vivos = (reg?.allocations ?? []).filter(
    (a) => ['DRAFT', 'READY', 'REOPENED', 'IN_PROGRESS', 'BLOCKED', 'BLOCKED_DOMAIN',
      'VALIDATION_PENDING', 'DONE'].includes(a?.status));
  const sinFase = vivos.filter((a) => a?.phase === undefined || a?.phase === null);
  if (sinFase.length) {
    need(`declarar «phase» en ${sinFase.length} allocation(s) viva(s) de REGISTRY.json `
      + `(${sinFase.map((a) => a.id).slice(0, 5).join(', ')}). Desde 6.0.0, los artefactos se `
      + 'exigen DESDE la fase que los produce; sin fase declarada esas comprobaciones salen '
      + 'SIN EVALUAR — ni aprueban ni bloquean.');
  }
  if (!reg?.tracker?.plataforma) {
    need('OPCIONAL — declarar plataforma de trabajo: "tracker": { "plataforma": "github" }. '
      + 'Con ella, el estado deja de vivir en la memoria del agente: cada tarea tiene su issue '
      + 'con su fase y su compuerta, y el espejo se comprueba en las compuertas (SUITE-R35). '
      + 'Sin ella no cambia nada. Declararla es una decisión humana, y activa además SUITE-R42 '
      + '—G4 sobre un pull request— y SUITE-R43 —los comentarios se leen—.');
  } else {
    need(`plataforma «${reg.tracker.plataforma}» declarada: sincroniza el espejo antes de operar. `
      + 'node docs/methodology/tools/tracker.mjs abrir --aplicar   (crea issues y etiquetas, '
      + 'y sincroniza fase y compuerta) · luego «cerrar --aplicar» para lo ya terminado. '
      + 'SUITE-R36: solo lo vivo — lo cerrado es evidencia y se queda en el repositorio.');
  }
  need('lo que llega nuevo en tools/: tracker (espejo con la plataforma) · revisar-secretos '
    + '(árbol e historia, FND-R29) · comparar-marco · verify-patrones · version · patrones. '
    + 'Y los documentos de FIDE/ más INTAKE/templates/TAREA.md.');
  need('si el escáner de secretos encuentra un falso positivo, se firma en '
    + 'docs/implementation/SECRETOS-EXCEPCIONES.md — una fila por huella, con nombre y motivo. '
    + 'Firmar no silencia: la excepción sigue apareciendo en cada revisión (FND-R29).');
}

// ── → 6.0.0 · dos reglas vinculantes nuevas, ambas condicionales ────────────
if (lt('6.0.0') && reg?.tracker?.plataforma) {
  need('G4 pasa a resolverse sobre un pull request abierto para la rama (SUITE-R42). No es una '
    + 'práctica nueva; ahora se comprueba. El agente no lo abre ni lo fusiona: '
    + 'gh pr create --base main --head <tu-rama>');
  need('un comentario humano sin responder en el issue de un PT bloquea su avance de fase '
    + '(SUITE-R43). Se distingue por marca de procedencia, no por autor. Si ningún comentario '
    + 'lleva marca, la comprobación sale SIN EVALUAR y se cura sola.');
}

// ── Estructura mínima común ─────────────────────────────────────────────────
for (const [f, c] of [
  ['docs/implementation/INCIDENTS.log', '# INCIDENTS — un registro por INC-NNN (append-only)\n'],
  ['docs/implementation/BACKLOG.md', '# BACKLOG — PTs vivos y su fase (regenerable)\n'],
  ['docs/implementation/SESSION_LOG.md', '# SESSION LOG (append-only)\n'],
  ['docs/implementation/MIGRATION.log', '# MIGRATION — una entrada por migración de versión (append-only)\n'],
]) ensureFile(f, c, 'artefacto requerido por 4.x');

if (!has('docs/methodology/CORE.md')) {
  need('generar el núcleo: node docs/methodology/tools/build-core.mjs docs/methodology (SUITE-R15).');
}
// El overlay de PTSA lo genera el mismo comando. Un proyecto de 4.5.x o anterior no lo tiene
// y, sin el, [START PTSA] auditaria con 23 de sus 80 reglas sin que nada avisara.
if (!has('docs/methodology/CORE-PTSA.md')) {
  need('generar el overlay de PTSA: node docs/methodology/tools/build-core.mjs docs/methodology (SUITE-R25).');
}

// ── Sello de versión ────────────────────────────────────────────────────────
if (FROM !== TARGET) {
  act(`REGISTRY.suite_version: ${FROM} → ${TARGET}`, () => {
    const r = jsonAt('docs/implementation/REGISTRY.json') ?? {};
    r.suite_version = TARGET;
    // El modo restringido de SUITE-R17 se apoyaba SOLO en el desajuste de version. Al sellar
    // la version aqui, se levantaba solo —con las decisiones humanas todavia sin tomar— y el
    // aviso que este script imprime dejaba de ser cierto en la linea siguiente. La lista de
    // pendientes queda en el REGISTRY para que verify-fdge la haga cumplir.
    if (manual.length) r.migration_pending = manual.slice();
    else delete r.migration_pending;
    mkdirSync(IMPL, { recursive: true });
    writeFileSync(join(IMPL, 'REGISTRY.json'), JSON.stringify(r, null, 2) + '\n');
    appendFileSync(join(IMPL, 'MIGRATION.log'),
      `\n## ${new Date().toISOString().slice(0, 10)} — ${FROM} → ${TARGET}\n` +
      `Automático: ${auto.length} acción(es)\nPendiente humano: ${manual.length} acción(es)\n`, 'utf8');
  });
  need(`actualizar suite_version a ${TARGET} en el CLAUDE.md del proyecto.`);
}

// ── Informe ─────────────────────────────────────────────────────────────────
// PT-043 . por que cada decision es humana. No se adivina del texto: se reconoce por lo que la
// accion NOMBRA, y si no se reconoce se DICE - no se inventa un motivo (RULE-06).
// PT-043 . el resumen corta por «. » (punto y espacio), no por «.»: cortar por punto partia
// «7.5.0» y «SECRETOS-EXCEPCIONES.md». Lo dijo la salida real, no un caso.
const resumen = (m) => { const t = String(m).trim(); const j = t.search(/\.\s/); return (j > 0 ? t.slice(0, j) : t).slice(0, 96); };

const PORQUE = (m) => {
  const t = String(m);
  if (/llega nuevo/.test(t)) return 'Herramientas que tu proyecto no tenia. Miralas antes de que aparezcan en una compuerta.';
  if (/ESTADO/.test(t)) return 'Declara que compuerta esperas y a quien. Rellenarlo con plantilla produce un estado que miente.';
  if (/phase/.test(t)) return 'En que fase esta cada trabajo vivo. La maquina ve los archivos, no la intencion.';
  if (/secreto|SECRETOS/i.test(t)) return 'Si una huella es falso positivo lo sabe quien conoce el dato. Firmar no silencia.';
  if (/plataforma de trabajo/.test(t)) return 'Sacar el estado a un tablero es decision de equipo, no tecnica. Sin ella no cambia nada.';
  if (/CLAUDE|suite_version/.test(t)) return 'El archivo que parametriza tu proyecto. Solo tu sabes que mas hay ahi.';
  return 'No se reconoce el motivo de esta accion: se dice en vez de inventarlo (RULE-06).';
};

const P = (t, arr, mark) => {
  if (!arr.length) return;
  console.log(t);
  for (const x of arr) console.log(`  ${mark} ${x}`);
  console.log('');
};
P(APPLY ? 'HECHO' : 'SE HARÍA AUTOMÁTICAMENTE', auto, '·');
P('REQUIERE UNA PERSONA', manual, '!');
P('OMITIDO', skip, '-');

if (!APPLY && (auto.length || manual.length)) console.log('Nada se ha modificado. Ejecuta con --apply.\n');
console.log(`${auto.length} automática(s) · ${manual.length} pendiente(s) de decisión humana.`);

// ── SUITE-R19 · una migración se verifica, no solo se ejecuta ────────────────
// Dejar el proyecto en estado inválido es peor que no haber migrado: parece terminado.
let verifyFailed = false;
if (APPLY) {
  const tool = join(ROOT, 'docs', 'methodology', 'tools', 'verify-fdge.mjs');
  if (!existsSync(tool)) {
    console.log('\n! No se encontró verify-fdge.mjs en el proyecto: no se pudo verificar el resultado.');
    verifyFailed = true;
  } else {
    console.log('\n── verificación posterior (verify-fdge --all) ──');
    const r = spawnSync(process.execPath, [tool, '--all'], { cwd: ROOT, encoding: 'utf8' });
    process.stdout.write(r.stdout ?? '');
    if (r.stderr) process.stderr.write(r.stderr);
    verifyFailed = r.status !== 0;
    console.log(verifyFailed
      ? '\n! El proyecto NO queda en estado válido. Resuelve lo anterior antes de operar.'
      : '\nProyecto verificado tras la migración.');
  }
}
// PT-043 . SUITE-R55 . las decisiones humanas se CONDUCEN, no se enumeran. Instalar SI acompana
// -nueve fases conversacionales, SUITE-R28- y migrar tenia una lista. Sobre un proyecto real con
// 127 allocations, eso es una sesion entera a ciegas. Aqui no se decide nada por nadie: se dice,
// por cada una, QUE decide y POR QUE no puede decidirlo una maquina.
if (manual.length) {
  console.log('');
  console.log('-- que te toca decidir, y por que es tuyo --');
  console.log('');
  console.log(`Son ${manual.length}. No es burocracia: cada una es algo que una maquina no puede`);
  console.log('saber sin inventarselo, y un estado inventado es peor que un estado ausente.');
  console.log('');
  let _i = 0;
  for (const m of manual) {
    _i += 1;
    console.log(`  ${_i}/${manual.length} · ${resumen(m)}`);
    console.log(`        ${PORQUE(m)}`);
    console.log('');
  }
  console.log('Ninguna depende de otra: resuelvelas en el orden que quieras. Cuando esten,');
  console.log('vuelve a ejecutar esto y te dira cuales quedan.');
  console.log('');
  console.log('Mientras queden pendientes, el proyecto sigue en modo restringido (SUITE-R17):');
  console.log('solo migrate, status * y terminar los PTs ya en vuelo. No se abre trabajo nuevo.');
  console.log('No es un castigo: abrir trabajo sobre una migracion a medias produce artefactos');
  console.log('que luego hay que rehacer, y nadie sabria cuales.');
}
process.exit(manual.length || verifyFailed ? 1 : 0);
