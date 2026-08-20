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
// El sello vive en tools/patrones.mjs, con su contrato. Estaba copiado en tres archivos y
// normalizar dos dejo al tercero contradiciendo a los otros: cinco casos del selftest en rojo.
import { selloDe, PATRONES, NATURALEZAS, MEDIDO, ESTIMADO, SIN_EVALUAR } from './patrones.mjs';
// PT-081 · AC-08 · lo que impide la CUARTA regla nueva sin version de entrada declarada.
import { reglasDelMarco, reglasNuevasSinVersion } from './patrones.mjs';
// PT-080 · una regla no se define dos veces. Es la enfermedad que motivo la v4.
import { definidasDosVeces } from './patrones.mjs';
import { execFileSync } from 'node:child_process';

const BASE = resolve(process.argv[2] ?? join(process.cwd(), 'docs', 'methodology'));
if (!existsSync(BASE)) {
  console.error(`No existe: ${BASE}`);
  process.exit(1);
}

// La versión vigente NO se escribe aquí (SUITE-R40). Estuvo escrita a mano —`const
// SUITE_VERSION = '5.2.0'`— siendo la autoridad contra la que se comprueban todos los
// documentos, y quedó una versión por detrás de `package.json` sin que nada lo notara: el
// verificador que existe para cazar versiones desalineadas era él mismo una cuarta copia del
// número. Es el defecto de la v3 —el mismo hecho escrito a mano en varios sitios, divergiendo—
// dentro de la herramienta que lo persigue.
//
// La fuente es la primera entrada del CHANGELOG, que viaja dentro de la suite y por tanto
// también existe en un proyecto destino, donde no hay `package.json` de cauce que consultar.
const CAMBIOS = join(BASE, 'CHANGELOG.md');
if (!existsSync(CAMBIOS)) {
  console.error(`Falta ${CAMBIOS}: sin él no se puede saber qué versión rige.`);
  process.exit(1);
}
const mVer = readFileSync(CAMBIOS, 'utf8').match(PATRONES.VERSION_VIGENTE.re);
if (!mVer) {
  console.error('El CHANGELOG no abre con una versión «## X.Y.Z — AAAA-MM-DD». Es de donde se lee la vigente.');
  process.exit(1);
}
const SUITE_VERSION = mVer[1];
const errors = [];
const warnings = [];

const fail = (rule, file, line, msg) => errors.push({ rule, file, line, msg });
const warn = (rule, file, line, msg) => warnings.push({ rule, file, line, msg });

// ── 0. El paquete declara la misma versión que el CHANGELOG (SUITE-R40) ──────
// Solo aplica en el repositorio de cauce: un proyecto destino tiene su propio `package.json`,
// que nada tiene que ver con la versión de la suite. Se distingue por el nombre del paquete.
const PKG = resolve(BASE, '..', '..', 'package.json');
if (existsSync(PKG)) {
  try {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'));
    if (pkg.name === '@a81biz/cauce' && pkg.version !== SUITE_VERSION) {
      fail('SUITE-R40', 'package.json', 0,
        `Declara ${pkg.version} y el CHANGELOG abre en ${SUITE_VERSION}. Se publicaría un número que miente sobre lo que contiene.`);
    }
  } catch {
    fail('SUITE-R40', 'package.json', 0, 'No se puede leer: sin él no se comprueba que el paquete y el CHANGELOG digan lo mismo.');
  }
}

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


// ── 6b. PT-058 · la naturaleza de una cifra es vocabulario CERRADO (LEX-R21) ──
//
// Se comprueba la CONSTANTE, no la prosa. Perseguir el idioma es lo que SUITE-R44 ya decidio no
// hacer, y la constante es donde el vocabulario es cerrado de verdad: anadir un cuarto valor deja
// de ser un `if` mas y pasa a ser una decision visible que pone esto en rojo.
{
  const esperadas = [MEDIDO, ESTIMADO, SIN_EVALUAR];
  if (NATURALEZAS.length !== esperadas.length) {
    fail('LEX-R21', 'tools/patrones.mjs', 0,
      `NATURALEZAS tiene ${NATURALEZAS.length} valores y son TRES: ${esperadas.join(' · ')}. `
      + 'Una cifra poco fiable ES una estimacion; ampliar el vocabulario es perseguir el idioma.');
  } else if (esperadas.some((n, i) => NATURALEZAS[i] !== n)) {
    // El ORDEN es la regla de contagio, no una convencion: si cambia, «la peor gana» cambia con el.
    fail('LEX-R21', 'tools/patrones.mjs', 0,
      `NATURALEZAS tiene otros valores o en otro orden. Son, de mejor a peor: ${esperadas.join(' · ')}.`);
  }
  // LEX-R21 · y declaradas en LEXICON antes que en el codigo.
  const lex = existsSync(join(BASE, 'LEXICON.md')) ? readFileSync(join(BASE, 'LEXICON.md'), 'utf8') : '';
  for (const n of esperadas) {
    if (!lex.includes(n)) {
      fail('LEX-R21', 'LEXICON.md', 0,
        `«${n}» se usa en el codigo y no esta declarada en LEXICON. El nombre va aqui primero.`);
    }
  }
}

// ── 6c. PT-061 · todo firmante existe como persona (SUITE-R27) ───────────────
//
// EN ESA DIRECCION Y NO EN LA CONTRARIA. Tener identidad no es poder firmar: un becario puede
// estar en «personas» y no en «firmantes:». Si la comprobacion fuera simetrica, las dos listas
// serian copias del mismo hecho y divergirian — que es lo que le paso a las reglas en la v3 y lo
// que este marco existe para no repetir.
{
  // BASE es docs/methodology; la raiz del proyecto esta dos niveles arriba.
  const RAIZ = resolve(BASE, '..', '..');
  const claude = existsSync(join(RAIZ, 'CLAUDE.md')) ? readFileSync(join(RAIZ, 'CLAUDE.md'), 'utf8') : '';
  const registro = (() => {
    try { return JSON.parse(readFileSync(join(RAIZ, 'docs', 'implementation', 'REGISTRY.json'), 'utf8')); }
    catch { return null; }
  })();
  const personas = registro?.personas ?? [];
  // Sin «personas» declaradas no se comprueba nada: un proyecto de una sola persona no tiene que
  // declarar la tabla, y exigirla seria imponer trabajo sin ganancia.
  if (personas.length && claude) {
    const ls = claude.split(String.fromCharCode(10)).map((x) => x.replace(String.fromCharCode(13), ''));
    const i = ls.findIndex((l) => /^\s*firmantes\s*:/i.test(l));
    if (i >= 0) {
      const firmantes = [];
      for (let j = i + 1; j < ls.length; j += 1) {
        const m = ls[j].match(/^\s*-\s+(.+?)\s*$/);
        if (!m) break;
        firmantes.push(m[1]);
      }
      const nombres = new Set(personas.map((x) => x?.nombre));
      for (const f of firmantes) {
        if (!nombres.has(f)) {
          fail('SUITE-R27', 'CLAUDE.md', i + 1,
            `«${f}» puede firmar y no esta declarado en «personas» del registro: el marco no sabe `
            + 'quien es. Anadelo, o quitalo de «firmantes:».');
        }
      }
    }
  }
}

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


// ─── EXEC-R08 · PT-031 · los tres modos exigen LO MISMO ─────────────────────
//
// Un modo de ejecucion cambia QUIEN resuelve una compuerta y cuando se pide confirmacion.
// Nunca QUE se exige: ni un artefacto menos, ni una regla que no se comprueba, ni evidencia
// mas floja. Si un modo eximiera de algo, el marco tendria dos varas de medir y la mas floja
// seria la tentacion permanente — y quien la eligiera lo haria sin decirlo.
//
// Se comprueba con VOCABULARIO CERRADO, no adivinando sobre prosa: PT-018 ya demostro que una
// lista de palabras persigue el idioma y siempre se le escapa el siguiente sinonimo. Cada celda
// de la matriz de compuertas dice quien resuelve; si cita un ARTEFACTO o una REGLA, esa celda
// esta cambiando lo exigido y no quien lo resuelve.
{
  const f = join(BASE, 'EXECUTION-MODES.md');
  if (existsSync(f)) {
    const txt = readFileSync(f, 'utf8');
    const i = txt.search(/^#+\s*\d*\.?\s*Matriz de compuertas/im);
    if (i < 0) {
      fail('EXEC-R08', 'EXECUTION-MODES.md', 0, 'no declara «Matriz de compuertas». Sin ella no se puede comprobar que los tres modos exijan lo mismo.');
    } else {
      const cuerpo = txt.slice(i).split(/^#+\s/m)[1] ?? txt.slice(i);
      const lineas = cuerpo.split(/\r?\n/);
      const RE_ARTEFACTO = /\b[a-z0-9-]+\.(?:md|json|mjs|sh)\b/i;
      const RE_REGLA = /\b(?:SUITE|FDGE|INTAKE|LEX|FND|QA|PTSA|EXEC)-R\d+\b/;
      lineas.forEach((l, n) => {
        if (!/^\s*\|/.test(l)) return;
        if (/^\s*\|[\s:|-]*\|?\s*$/.test(l)) return;
        const celdas = l.split('|').slice(2, -1);      // fuera la etiqueta de fila
        for (const c of celdas) {
          if (RE_ARTEFACTO.test(c)) {
            fail('EXEC-R08', 'EXECUTION-MODES.md', n + 1, `la matriz de compuertas cita un artefacto («${c.trim().slice(0, 40)}»). Un modo decide QUIEN resuelve, no QUE se exige: si un modo pide o exime un artefacto, hay dos varas de medir.`);
          } else if (RE_REGLA.test(c)) {
            fail('EXEC-R08', 'EXECUTION-MODES.md', n + 1, `la matriz de compuertas cita una regla («${c.trim().slice(0, 40)}»). Las reglas se comprueban igual en los tres modos; citarlas aqui sugiere que uno las trata distinto.`);
          }
        }
      });
      if (!/G4[^|]*\|[^|]*humano[^|]*\|[^|]*humano[^|]*\|[^|]*humano/i.test(cuerpo)) {
        fail('EXEC-R08', 'EXECUTION-MODES.md', 0, 'la fila de G4 no declara ACK humano en los TRES modos. G4 es humana sin excepcion (EXEC-R04, SUITE-R06a).');
      }
    }
  }
}

// PT-081 · AC-08 · una regla HARD NUEVA sin fila en RIGE_DESDE heredaria el criterio de otra.
// Paso con FDGE-R54: nacio en esta version y una constante compartida la hacia regir sobre
// trabajo de dos meses antes. Arreglar los tres casos y dejar el mecanismo intacto para el
// cuarto es lo que PT-075 documento.
//
// «Nueva» es NO EXISTIA EN LA VERSION ANTERIOR. Probe «no aparece en el CHANGELOG» y devolvio
// 69 —casi todas fundacionales—: una lista con 69 falsos positivos es una lista que nadie mira.
//
// AVISA, no falla. Sin poder leer la version anterior devuelve null y NO se inventa nada
// (RULE-06): sin saber que habia antes no se sabe que es nuevo.
// PT-080 · SUITE-R38 · LEX-R22 · un ID definido en DOS documentos propietarios.
//
// Tres lo estaban en la v9 —FDGE-R22, R40 y R41— y las tres copias YA divergian, siempre en la
// misma direccion: la de EXECUTION-MODES soltaba una obligacion. La de FDGE-R22 dejaba el carril
// HOTFIX abierto a un S3, y ese carril difiere G2 y G3.
//
// FALLA, no avisa: LEX-R22 dice que ningun documento salvo RULES.md enuncia obligaciones, y
// SUITE-R38 prohibe dos fuentes del mismo hecho. Las dos son HARD.
(() => {
  const leerDoc = (f) => { try { return readFileSync(join(BASE, f), 'utf8'); } catch { return ''; } };
  const propietarios = {};
  for (const f of ['RULES.md', 'LEXICON.md', 'EXECUTION-MODES.md']) propietarios[f] = leerDoc(f);
  for (const d of definidasDosVeces(propietarios)) {
    fail('SUITE-R38', d.docs[0], 0, `${d.id} está DEFINIDA en ${d.docs.join(' y en ')}. `
      + 'Una regla tiene un solo documento propietario (LEX-R22): los demás la CITAN por ID. '
      + 'Dos textos divergen — es lo que le pasó a la v3, y en la v9 las tres copias que había '
      + 'ya habían perdido una obligación cada una.');
  }
})();

(() => {
  const leerAhora = (f) => { try { return readFileSync(join(BASE, f), 'utf8'); } catch { return ''; } };
  // La linea base es el TAG de la version anterior, no «origin/main». Elegi main primero y la
  // inversa lo desmonto: en cuanto se ejecuta una G4, lo integrado deja de ser «nuevo» y el
  // detector calla justo cuando la regla acaba de entrar. Un tag no se mueve.
  const tagPrevio = () => {
    try {
      const salida = execFileSync('git', ['tag', '--list', 'v*', '--sort=-v:refname'],
        { cwd: dirname(dirname(BASE)), encoding: 'utf8', stdio: 'pipe' });
      // Se parte por espacio en blanco a proposito: un literal con salto de linea dentro se
      // rompe al pasar por un script, y van siete veces en este lote. Los tags no llevan espacios.
      const tags = salida.trim().split(/\s+/).filter(Boolean);
      const vigente = `v${SUITE_VERSION}`;
      return tags.find((t) => t !== vigente) ?? null;   // el mas reciente que NO sea el actual
    } catch { return null; }
  };
  const REF = tagPrevio();
  const leerAntes = (f) => {
    if (!REF) return '';
    try {
      return execFileSync('git', ['show', `${REF}:docs/methodology/${f}`],
        { cwd: dirname(dirname(BASE)), encoding: 'utf8', stdio: 'pipe' });
    } catch { return ''; }
  };
  const antes = reglasDelMarco(leerAntes).map((r) => r.id);
  const nuevas = reglasNuevasSinVersion(reglasDelMarco(leerAhora), antes.length ? antes : null);
  if (nuevas === null) return;                       // no se pudo leer la version anterior
  for (const id of nuevas) {
    warn('SUITE-R19', 'RULES.md', 0, `${id} es una regla HARD nueva y no declara desde qué versión rige. `
      + 'Sin fila en RIGE_DESDE (tools/patrones.mjs) regirá sobre tareas escritas antes de existir, '
      + 'y la guía de migración no podrá enumerarla.');
  }
})();

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
