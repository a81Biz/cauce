#!/usr/bin/env node
/**
 * verify-suite — Verificador de coherencia de la propia metodología
 *
 * Existe por la causa raíz que produjo la mayoría de los defectos de la v3: la misma regla
 * estaba escrita a mano en cuatro documentos, y las cuatro copias divergieron sin que nadie
 * lo notara. Este script convierte esa divergencia en un fallo detectable.
 *
 * Comprueba:
 *   1. Vocabulario derogado (LEX-R20): Estado n / STATE n / FASE n / F-n, PLAN_ACTUAL.md,
 *      instrucctions.md, Motor-PTSA.md, 05-UIUX-Brief.md, CLOSED-WONTFIX, [Rnn]…
 *   2. IDs de regla citados que no existen en RULES.md.
 *   3. Reglas de RULES.md que ningún documento cita (candidatas a estar muertas).
 *   4. Obligaciones enunciadas en documentos Framework-*.md (LEX-R22: explican, no mandan).
 *   5. Enlaces internos rotos entre documentos de la metodología.
 *   6. Versión de suite declarada de forma inconsistente.
 *
 * Uso:  node verify-suite.mjs [ruta-a-docs/methodology]
 * Exit: 0 sin errores · 1 con errores.
 *
 * Sin dependencias externas. Node >= 18.
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/). En JS, «.» NO casa \r —es terminador de
 * linea—, de modo que un regex anclado en $ sin flag m falla en cualquier archivo guardado
 * en Windows. Ese fallo dejaba 25 reglas fuera de CORE.md sin avisar.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const BASE = resolve(process.argv[2] ?? join(process.cwd(), 'docs', 'methodology'));
if (!existsSync(BASE)) {
  console.error(`No existe: ${BASE}`);
  process.exit(1);
}

const SUITE_VERSION = '5.1.0';
const errors = [];
const warnings = [];

const fail = (rule, file, line, msg) => errors.push({ rule, file, line, msg });
const warn = (rule, file, line, msg) => warnings.push({ rule, file, line, msg });

// ── Recolectar todos los .md de la metodología ───────────────────────────────
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}
const files = walk(BASE);
const relOf = (p) => relative(BASE, p).replace(/\\/g, '/');

// ── 1. Vocabulario derogado (LEX-R20) ────────────────────────────────────────
// Cada patrón lleva su reemplazo. Se ignoran las líneas que documentan la propia
// derogación: son las tablas de migración de LEXICON.md, RULES.md y los bloques
// explicativos "en v3 …". Se detectan por marcadores.
const DEPRECATED = [
  [/\bSTATE\s+\d+/, 'PHASE n'],
  [/\bEstado\s+\d+\s*—/, 'nombre semántico, sin número (LEX-R01)'],
  [/\bFASE\s+\d+/, 'PHASE n'],
  [/(?<![\w-])F-1\b|(?<![\w-])F1[0-2]\b|(?<![\w-])F[0-9]\b(?!\s*[·)])/, 'PHASE n'],
  [/instrucctions\.md/, 'FDGE-Prompts.md'],
  [/\bPLAN_ACTUAL\.md/, 'changes/PT-XXX-slug/strategy.md'],
  [/\bPENDING_TASKS\.md/, 'changes/PT-XXX-slug/tasks.md'],
  [/\bCONTEXT_ANALYSIS\.md/, 'changes/PT-XXX-slug/context.md'],
  [/\bSESSION_SUMMARY\.md/, 'SESSION_LOG.md'],
  [/05-UIUX-Brief\.md/, '05-UI-UX-Brief.md'],
  [/\bMotor-PTSA\.md/, 'PTSA-Prompts.md'],
  [/\bCLOSED-WONTFIX\b|\bCLOSED-ACCEPTED\b/, 'REJECTED'],
  [/\[R\d+\]/, 'PTSA-Rnn'],
  [/\[R-FIDE-\d+\]/, 'FIDE-Rnn'],
  [/\bSprint\s+S-\d+/, 'EP-NNN'],
  [/\bHallazgos\/|\bEvidencias\/|\bProductos\/|\bFases\//, 'Findings/ Evidence/ Products/ Phases/'],
];

// Convención: un nombre derogado puede CITARSE entre backticks — estamos hablando *de* él.
// Lo que se prohíbe es USARLO como instrucción viva, sin comillas. Por eso se eliminan los
// tramos de código en línea antes de buscar, y se exime la prosa que explica la migración.
const stripInlineCode = (s) => s.replace(/`[^`]*`/g, '⟪⟫');
const EXEMPT = /derogad|deroga\b|Antes\s*\||anterior\b|\bv3\b|v3\.0|migraci|equivalencia|Reemplazo|nomenclatura|Valor anterior|Prefijo|inventaba|ordenaba|Por qué cambió|En la v3|La v3|antes de la v4|Fue un defecto/i;

for (const f of files) {
  const rf = relOf(f);
  const lines = readFileSync(f, 'utf8').split(/\r?\n/);
  // LEXICON, RULES y CHANGELOG contienen las tablas de derogación por definición.
  const isCatalog = rf === 'LEXICON.md' || rf === 'RULES.md' || rf === 'CHANGELOG.md';
  let inFence = false;
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;          // los prompts citan rutas y nombres a propósito
    if (isCatalog) return;
    if (EXEMPT.test(line)) return;
    const probe = stripInlineCode(line);
    for (const [re, repl] of DEPRECATED) {
      if (re.test(probe)) {
        fail('LEX-R20', rf, i + 1, `Vocabulario derogado — usar: ${repl}  ·  «${line.trim().slice(0, 90)}»`);
        break;
      }
    }
  });
}

// ── 2 y 3. IDs de regla ──────────────────────────────────────────────────────
const rulesPath = join(BASE, 'RULES.md');
if (!existsSync(rulesPath)) {
  fail('LEX-R21', 'RULES.md', 0, 'Falta RULES.md — la fuente única de reglas.');
} else {
  const rulesTxt = readFileSync(rulesPath, 'utf8');
  const RULE_RE = /\b(SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)-(R|P)\d+\b/g;
  // Definidas: las que aparecen entre backticks al inicio de fila de tabla o en `X` |
  const defined = new Set();
  for (const line of rulesTxt.split(/\r?\n/)) {
    const m = line.match(/^\|\s*`((?:SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)-R\d+)`/);
    if (m) defined.add(m[1]);
    const m2 = line.match(/^`((?:SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)-R\d+)`\s*·/);
    if (m2) defined.add(m2[1]);
  }
  // LEXICON y EXECUTION-MODES definen las suyas en su propio texto.
  for (const extra of ['LEXICON.md', 'EXECUTION-MODES.md']) {
    const p = join(BASE, extra);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^`((?:LEX|EXEC)-(?:R|P)\d+)`/);
      if (m) defined.add(m[1]);
    }
  }
  // PTSA define las suyas en su especificación.
  const ptsaSpec = join(BASE, 'PTSA', 'PTSA-V3-Especificacion-Oficial.md');
  if (existsSync(ptsaSpec)) {
    for (const m of readFileSync(ptsaSpec, 'utf8').matchAll(/`(PTSA-R\d+)`/g)) defined.add(m[1]);
  }

  // ── SUITE-R14 · un ID se define en exactamente un documento (LEX-R23) ──────
  // La 4.0.0 salió con `PTSA-R01..R12` definidos a la vez en RULES.md y en la especificación
  // de PTSA, con contenidos DISTINTOS. Sin este chequeo, el verificador daba verde encima.
  //
  // Qué cuenta como DEFINIR (y no como citar): la línea lleva la SEVERIDAD de la regla.
  //   - fila de tabla:  | `ID` | HARD | texto |
  //   - forma suelta:   `ID` · **(HARD)** texto
  // Citar es escribir el ID sin severidad, en cualquier posición. Empezar un párrafo con una
  // cita es correcto y frecuente; por eso la posición NO puede ser el discriminador.
  const OWNER = {
    SUITE: 'RULES.md', FND: 'RULES.md', FDGE: 'RULES.md', INTAKE: 'RULES.md',
    QA: 'RULES.md', FPGE: 'RULES.md', FIDE: 'RULES.md',
    LEX: 'LEXICON.md', EXEC: 'EXECUTION-MODES.md',
    PTSA: 'PTSA/PTSA-V3-Especificacion-Oficial.md',
  };
  const PFX = '(SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)';
  const RE_DEF_ROW = new RegExp(`^\\|\\s*\`${PFX}-[RP](\\d+)\`\\s*\\|\\s*(HARD|SOFT|CHECK)\\s*\\|`);
  const RE_DEF_LOOSE = new RegExp(`^\`${PFX}-[RP](\\d+)\`\\s*·\\s*\\*\\*\\((HARD|SOFT|CHECK)\\)`);
  const defsBy = new Map();
  for (const f of files) {
    const rf = relOf(f);
    readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
      const m = line.match(RE_DEF_ROW) || line.match(RE_DEF_LOOSE);
      if (!m) return;
      const pfx = m[1];
      const id = line.match(new RegExp(`${PFX}-[RP]\\d+`))[0];
      if (!defsBy.has(id)) defsBy.set(id, []);
      defsBy.get(id).push({ file: rf, line: i + 1 });
      if (OWNER[pfx] && rf !== OWNER[pfx]) {
        fail('SUITE-R14', rf, i + 1,
          `${id} se DEFINE aquí (lleva severidad) pero su propietario es ${OWNER[pfx]}. ` +
          'Cítala sin severidad o muévela a su documento propietario.');
      }
    });
  }
  for (const [id, where] of defsBy) {
    const docs = [...new Set(where.map((w) => w.file))];
    if (docs.length > 1) {
      fail('SUITE-R14', docs[0], where[0].line,
        `${id} está DEFINIDA en ${docs.length} documentos: ${docs.join(' · ')}. ` +
        'Un ID se define una sola vez; los demás citan (LEX-R23).');
    } else if (where.length > 1) {
      fail('SUITE-R14', docs[0], where[0].line,
        `${id} está definida ${where.length} veces en ${docs[0]} (líneas ${where.map((w) => w.line).join(', ')}).`);
    }
  }

  const cited = new Map(); // id -> [file:line]
  for (const f of files) {
    const rf = relOf(f);
    readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
      for (const m of line.matchAll(RULE_RE)) {
        const id = m[0];
        if (!cited.has(id)) cited.set(id, []);
        cited.get(id).push(`${rf}:${i + 1}`);
      }
    });
  }

  for (const [id, where] of cited) {
    if (!defined.has(id)) {
      fail('LEX-R21', where[0].split(':')[0], Number(where[0].split(':')[1]),
        `Se cita la regla ${id} pero no está definida en RULES.md (ni en su documento propietario).`);
    }
  }
  for (const id of defined) {
    const uses = cited.get(id) ?? [];
    const outside = uses.filter((u) => !u.startsWith('RULES.md') && !u.startsWith('LEXICON.md') && !u.startsWith('EXECUTION-MODES.md'));
    if (outside.length === 0) {
      warn('LEX-R22', 'RULES.md', 0, `${id} está definida pero ningún documento operativo la cita. ¿Regla muerta?`);
    }
  }
}

// ── 4. Los Framework-*.md explican; no mandan (LEX-R22) ──────────────────────
const IMPERATIVE = /\b(DEBE|DEBERÁ|OBLIGATORIO|SE EXIGE|PROHIBIDO|NO DEBE|es obligatorio|queda prohibido)\b/;
for (const f of files) {
  const rf = relOf(f);
  if (!/(^|\/)Framework-[A-Z]+\.md$/.test(rf)) continue;
  readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
    if (!IMPERATIVE.test(line)) return;
    // Exento si la línea cita un ID de regla: está citando, no legislando.
    if (/\b(SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)-(R|P)\d+\b/.test(line)) return;
    if (EXEMPT.test(line)) return;
    warn('LEX-R22', rf, i + 1,
      `Un Framework-*.md enuncia una obligación sin citar su regla. Debe citar el ID: «${line.trim().slice(0, 80)}»`);
  });
}

// ── 5. Enlaces internos ──────────────────────────────────────────────────────
//
// PT-032 · Un componente que el propio INSTALL manda NO copiar no puede contar como enlace
// roto. `INSTALL.md` dice literalmente «Copia docs/methodology/ al proyecto (sin FIDE/ si ya
// hay código)», porque `FIDE-R01` reserva FIDE a greenfield. El README enlaza sus documentos
// sin condición, así que TODA instalación brownfield quedaba permanentemente en rojo con 4
// errores por haber seguido la instrucción.
//
// Medido el 2026-08-08: la copia canónica (33 documentos, con FIDE/) sale «sin errores»; una
// brownfield correcta (30 documentos) sale con 4. El verificador no distinguía «falta un
// archivo» de «este componente no se instala aquí».
//
// El criterio es deliberadamente estrecho: solo se perdona cuando el DIRECTORIO ENTERO del
// componente no existe. Si FIDE/ está y le falta un archivo, eso sí es un enlace roto — que
// es el caso que esta comprobación existe para cazar.
const COMPONENTES_OPCIONALES = new Set(['FIDE']);
const componenteNoInstalado = (target) => {
  const seg = target.split('/')[0];
  return COMPONENTES_OPCIONALES.has(seg) && !existsSync(join(BASE, seg));
};

const ausentesPorDiseño = new Set();

// ── 5. Enlaces internos ──────────────────────────────────────────────────────
for (const f of files) {
  const rf = relOf(f);
  const dir = dirname(f);
  readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(/\[[^\]]*\]\(([^)#]+?\.md)(?:#[^)]*)?\)/g)) {
      const target = m[1];
      if (/^https?:/.test(target)) continue;
      if (componenteNoInstalado(target)) { ausentesPorDiseño.add(target.split('/')[0]); continue; }
      if (!existsSync(resolve(dir, target))) {
        fail('LEX-R21', rf, i + 1, `Enlace roto: ${target}`);
      }
    }
  });
}

// ── 6. Versión de suite ──────────────────────────────────────────────────────
for (const f of files) {
  const rf = relOf(f);
  const txt = readFileSync(f, 'utf8');
  for (const m of txt.matchAll(/Suite version:\s*\*\*([\d.]+)\*\*/g)) {
    if (m[1] !== SUITE_VERSION) {
      fail('SUITE-R13', rf, 0, `Declara Suite version ${m[1]}; la vigente es ${SUITE_VERSION}.`);
    }
  }
}

// El sello hashea el contenido NORMALIZADO, no los bytes crudos. Git entrega LF en Linux y
// CRLF en Windows con autocrlf, asi que un sello sobre bytes daba «CORE.md desincronizado» en
// el CI aunque nadie hubiera tocado nada: el marco no se podia certificar a si mismo fuera de
// la maquina donde se genero. Es el mismo CRLF que ya dejo 25 reglas fuera de CORE.md.
const selloDe = (txt) => createHash('sha1').update(txt.split(/\r?\n/).join('\n')).digest('hex').slice(0, 12);

// ── 7. SUITE-R16 · CORE.md sincronizado con sus fuentes ──────────────────────
{
  const corePath = join(BASE, 'CORE.md');
  if (!existsSync(corePath)) {
    fail('SUITE-R16', 'CORE.md', 0, 'Falta CORE.md — el núcleo que carga el agente. Ejecuta tools/build-core.mjs.');
  } else {
    const cur = readFileSync(corePath, 'utf8');
    const declared = cur.match(/<!-- fuentes: (.+?) -->/)?.[1];
    // MISMA lista que build-core.mjs; si divergen, el chequeo da falsos positivos.
    const actual = ['RULES.md', 'LEXICON.md', 'EXECUTION-MODES.md', 'PHASES.md']
      .map((f) => f + ':' + selloDe(readFileSync(join(BASE, f), 'utf8')))
      .join(' ');
    if (declared !== actual) {
      fail('SUITE-R16', 'CORE.md', 0,
        'CORE.md desincronizado con sus fuentes (RULES · LEXICON · EXECUTION-MODES · PHASES). → node tools/build-core.mjs');
    }
    if (cur.indexOf('GENERADO por tools/build-core.mjs') < 0) {
      fail('SUITE-R16', 'CORE.md', 0, 'CORE.md perdió su marca de generado. No se edita a mano.');
    }
  }
}

// ── 8. SUITE-R20 · PHASES.md ↔ *-Prompts.md no divergen ──────────────────────
// PHASES.md es canónico y es lo que acaba en CORE.md, que es lo que se ejecuta. Los
// *-Prompts.md son su expansión legible para modo MANUAL. Si se separan, el humano lee una
// cosa y el agente ejecuta otra: la misma divergencia entre copias que produjo los ocho
// defectos críticos de la v3, reintroducida por la puerta de atrás.
{
  const phasesPath = join(BASE, 'PHASES.md');
  if (!existsSync(phasesPath)) {
    fail('SUITE-R20', 'PHASES.md', 0, 'Falta PHASES.md — la fuente canónica del procedimiento.');
  } else {
    const txt = readFileSync(phasesPath, 'utf8');
    // Componente = encabezado `## X`; bloque de fase = `### ...` dentro de él.
    const PROMPTS = {
      // La instalacion no es un componente, pero tiene procedimiento y su propio texto
      // copiable. Sin mapearla, sus reglas se le imputaban a Foundation — y al separarla en su
      // propia seccion dejaban de comprobarse en absoluto: verde por omision.
      'Instalación': 'INSTALL.md',
      FDGE: 'FDGE-Prompts.md',
      Foundation: 'Foundation-Prompts.md',
      QA: 'QA/QA-Prompts.md',
      PTSA: 'PTSA/PTSA-Prompts.md',
      FPGE: 'FPGE-Prompts.md',
    };
    // Primero se agrupa el texto por componente; después se decide si ese componente
    // declara subfases (`###`) o es un bloque único. Mezclar ambas cosas en una sola
    // pasada creaba un bloque fantasma con el nombre del componente.
    const porComp = {};
    let comp = null;
    for (const line of txt.split(/\r?\n/)) {
      const mc = line.match(/^##\s+(\S.*)$/);
      if (mc && !line.startsWith('###')) { comp = mc[1].trim(); porComp[comp] ??= []; continue; }
      if (comp) porComp[comp].push(line);
    }
    const byComp = {};
    for (const [c, lines] of Object.entries(porComp)) {
      if (!PROMPTS[c]) continue;
      const data = (byComp[c] = { phases: [], rules: new Set() });
      const txtC = lines.join('\n');
      for (const m of txtC.matchAll(/\b([A-Z]+-[RP]\d+)\b/g)) data.rules.add(m[1]);
      const subs = lines.filter((l) => /^###\s+\S/.test(l)).map((l) => l.replace(/^###\s+/, '').trim());
      data.phases = subs.length ? subs : [c];   // sin subfases, el componente es un bloque
    }
    for (const [c, data] of Object.entries(byComp)) {
      const pf = PROMPTS[c];
      if (!existsSync(join(BASE, pf))) {
        fail('SUITE-R20', 'PHASES.md', 0, `${c}: PHASES.md declara fases pero falta ${pf}.`);
        continue;
      }
      const ptxt = readFileSync(join(BASE, pf), 'utf8');
      // (a) cada fase de PHASES existe en los prompts
      //
      // Sin regex dinámicos: construir un patrón con `new RegExp(\`...\\s...\`)` ha fallado
      // tres veces en este proyecto, porque en un template literal `\s` es "s" y `\b` es un
      // byte de retroceso. Aquí se normaliza a una clave plana y se comparan conjuntos.
      const claves = (t) => {
        const out = new Set();
        for (const m of t.matchAll(/\bPHASE\s+([0-9]+(?:[.-][0-9A-Za-z]+)?)/gi)) out.add(`phase-${m[1].toLowerCase()}`);
        for (const m of t.matchAll(/\bTRACK\s+([A-Za-z]+)/gi)) out.add(`track-${m[1].toLowerCase()}`);
        if (/\bLOTES\b|\bEP-NNN\b/i.test(t)) out.add('lotes');
        // Sin esto, un bloque cuyo titulo no lleva «PHASE n» caia en el comodin 'lotes' y se
        // comparaba contra el criterio equivocado: fallaba diciendo que faltaba algo que no era.
        if (/\[INSTALL SUITE\]|\bINSTALL\b/.test(t)) out.add('install');
        return out;
      };
      const enPrompt = claves(ptxt);
      // Un componente sin subfases en PHASES.md (QA, PTSA, FPGE) se declara como bloque
      // único: no hay nada que comparar fase a fase, solo las reglas citadas.
      const bloqueUnico = data.phases.length === 1 && data.phases[0] === c;
      for (const title of bloqueUnico ? [] : data.phases) {
        const k = [...claves(title)][0] ?? 'lotes';
        if (!enPrompt.has(k)) {
          fail('SUITE-R20', pf, 0,
            `«${title}» está en PHASES.md y no aparece en ${pf}. La expansión legible se ha quedado atrás.`);
        }
      }
      // (b) cada regla citada en PHASES está citada en los prompts
      const cited = new Set([...ptxt.matchAll(/\b([A-Z]+-[RP]\d+)\b/g)].map((m) => m[1]));
      const missing = [...data.rules].filter((r) => !cited.has(r)).sort();
      if (missing.length) {
        fail('SUITE-R20', pf, 0,
          `${c}: PHASES.md cita ${missing.length} regla(s) que ${pf} no menciona: ${missing.join(', ')}. ` +
          'El humano en modo MANUAL no las vería.');
      }
    }
  }
}

// ── 9. Residuos de la renumeración PTSA (LEX-R05) ────────────────────────────
// La 4.0.1 corrigió una colisión renumerando los axiomas de PTSA a sus IDs reales
// (PTSA-R14..R21), pero el arreglo se aplicó a RULES.md y sobrevivió en otros SEIS
// documentos hasta la 4.3.1. El verificador no podía verlo: los IDs viejos EXISTEN en la
// especificación — solo que significan otra cosa. Aquí se marcan como sospechosos para que
// una persona confirme cuál se quiere decir.
{
  const SOSPECHOSOS = {
    'PTSA-R01': 'PTSA-R14 (evidencia sobre opinión)',
    'PTSA-R02': 'PTSA-R15 (producto sobre implementación)',
    'PTSA-R03': 'PTSA-R16 (trazabilidad inversa)',
    'PTSA-R04': 'PTSA-R17 (supremacía del dominio · Agua Potable)',
    'PTSA-R05': 'PTSA-R18 (auditoría autónoma)',
    'PTSA-R06': 'PTSA-R19 (inmutabilidad auditable)',
    'PTSA-R07': 'PTSA-R44 (no cerrar BUG/DOMAIN sin humano)',
    'PTSA-R08': 'PTSA-R39 (CLOSED solo con evidencia post-fix)',
    'PTSA-R09': 'PTSA-R45 (PHASE 6 es el hito central)',
    'PTSA-R10': 'PTSA-R70 (esquema real vía shell · logs en vivo)',
    'PTSA-R11': 'PTSA-R73 (condiciones de halt)',
    'PTSA-R12': 'PTSA-R62 (materializar la conclusión)',
  };
  for (const f of files) {
    const rf = relOf(f);
    // CORE-PTSA.md es una proyeccion generada de la especificacion: lleva los 80 IDs por
    // construccion, no por confusion. Escanearlo producia 12 avisos que nadie puede corregir.
    if (rf.startsWith('PTSA/PTSA-V3') || rf === 'CHANGELOG.md' || rf === 'LEXICON.md'
        || rf === 'RULES.md' || rf === 'CORE-PTSA.md') continue;
    readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
      if (/renumera|colision|colisión|residuo|sospechos/i.test(line)) return;
      for (const [viejo, real] of Object.entries(SOSPECHOSOS)) {
        // Sin regex dinámico. `new RegExp(`\b...`)` ha fallado CUATRO veces en este
        // proyecto: dentro de un template literal, \b es un byte de retroceso y \s es "s".
        // Aquí basta comprobar el texto y que no siga un dígito (PTSA-R01 ≠ PTSA-R012).
        const at = line.indexOf(viejo);
        if (at >= 0 && !/[0-9]/.test(line[at + viejo.length] ?? '')) {
          warn('LEX-R05', rf, i + 1,
            `Cita ${viejo} fuera de la especificación. Si querías el axioma, el ID real es ${real}. ` +
            'Confírmalo: los IDs viejos existen pero significan otra cosa.');
        }
      }
    });
  }
}

// ── Informe ──────────────────────────────────────────────────────────────────
console.log(`verify-suite — coherencia de la metodología (${SUITE_VERSION})`);
console.log(`Documentos analizados: ${files.length}\n`);

const fmt = (x) => `  ${x.rule.padEnd(12)} ${x.file}${x.line ? ':' + x.line : ''}\n      ${x.msg}`;

if (warnings.length) {
  console.log(`AVISOS (${warnings.length})`);
  for (const w of warnings.slice(0, 60)) console.log(fmt(w));
  if (warnings.length > 60) console.log(`  … y ${warnings.length - 60} más`);
  console.log('');
}
if (errors.length) {
  console.log(`ERRORES (${errors.length})`);
  for (const e of errors.slice(0, 80)) console.log(fmt(e));
  if (errors.length > 80) console.log(`  … y ${errors.length - 80} más`);
  console.log('');
  process.exit(1);
}
console.log('Sin errores de coherencia.');
process.exit(0);
