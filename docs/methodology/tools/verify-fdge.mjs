#!/usr/bin/env node
/**
 * verify-fdge — Verificador mecánico de cumplimiento FDGE
 *
 * Comprueba las reglas marcadas CHECK en docs/methodology/RULES.md sobre los artefactos
 * reales del repositorio. Existe porque un checklist que el propio agente rellena sobre sí
 * mismo no es un control (FDGE-R25): un control es algo que puede fallar.
 *
 * Uso:
 *   node verify-fdge.mjs PT-042              verifica un PT
 *   node verify-fdge.mjs PT-042 PT-043       verifica varios
 *   node verify-fdge.mjs --all               todos los PTs no terminales
 *   node verify-fdge.mjs --gate G4 PT-042    solo las precondiciones de G4
 *
 * Exit 0 sin errores · 1 con errores. Pensado para el paso de CI que bloquea G4 (FDGE-R34).
 * Sin dependencias externas. Node >= 18.
 *
 * NOTA DE DISEÑO — el contrato con las plantillas
 *   Los patrones de §PARSERS deben aceptar el texto EXACTO que producen las plantillas de
 *   INTAKE/templates/. La 4.0.0 salió con dos regex que no coincidían con ninguna de las
 *   tres plantillas ("## Firma" vs "## 10. Firma [HUMANO]"; "DoR: PASS" vs "VEREDICTO:
 *   PASS"), de modo que el verificador rechazaba el 100 % de los Intakes correctamente
 *   firmados. Si cambias una plantilla, cambia aquí y añade un caso a tools/fixtures/.
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/). En JS, «.» NO casa \r —es terminador de
 * linea—, de modo que un regex anclado en $ sin flag m falla en cualquier archivo guardado
 * en Windows. Ese fallo dejaba 25 reglas fuera de CORE.md sin avisar.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
// El sello vive en tools/patrones.mjs, con su contrato. Estaba copiado en tres archivos y
// normalizar dos dejo al tercero contradiciendo a los otros: cinco casos del selftest en rojo.
import { selloDe, PATRONES } from './patrones.mjs';

const ROOT = process.cwd();
const IMPL = join(ROOT, 'docs', 'implementation');
const CHANGES = join(ROOT, 'changes');
const EVIDENCE = join(IMPL, 'evidence');
const ED = join(ROOT, 'docs', 'enterprise-documentation');

const errors = [];
const warnings = [];
const passed = [];
let GRAPH = { state: 'UNKNOWN', reason: 'sin evaluar' };

// La versión vigente NO se escribe aquí (`SUITE-R40`). Estuvo escrita a mano —`const
// SUITE_VERSION = '5.2.0'`— siendo la autoridad de la compuerta de migración, y quedó tres
// parches por detrás del CHANGELOG: un proyecto que declaraba la versión correcta entraba en
// modo restringido por una migración que no existía, y el único modo de «arreglarlo» era
// escribir en el registro un número falso. `verify-suite` ya tenía este mismo defecto y se
// corrigió; esta copia sobrevivió, que es exactamente cómo se comporta el defecto que la v4
// nació para eliminar.
//
// La fuente es la primera entrada del CHANGELOG que viaja con esta misma copia de la suite:
// se resuelve desde la ubicación del script, no desde el cwd, para que dé lo mismo desde dónde
// se invoque. Si no está, no se inventa un número: la compuerta se declara no evaluable.
const CAMBIOS = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'CHANGELOG.md');
const SUITE_VERSION = existsSync(CAMBIOS)
  ? (readFileSync(CAMBIOS, 'utf8').match(PATRONES.VERSION_VIGENTE.re)?.[1] ?? null)
  : null;

const fail = (rule, msg) => errors.push({ rule, msg });
const warn = (rule, msg) => warnings.push({ rule, msg });
const ok = (rule, msg) => passed.push({ rule, msg });

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const readJSON = (p) => {
  const raw = read(p);
  if (raw === null) return null;
  try { return JSON.parse(raw); } catch { return undefined; }
};

// ─── PARSERS · contrato con INTAKE/templates/ ────────────────────────────────
// Tolerantes a la numeración de sección y a los marcadores [HUMANO] / [AGENTE].
const RE_SIGN_BLOCK = /^##\s*(?:\d+[.)]\s*)?Firma\b/im;
// PT-028 · `[ \t]*` y no `\s*`. En JS, `\s` incluye el salto de línea: con `\s*` un campo
// VACÍO capturaba la etiqueta «Fecha:» de la línea siguiente y reportaba el intake como
// «firmado por Fecha:». El error no era el falso positivo en sí —INTAKE-R06 seguía diciendo la
// verdad— sino que SUITE-R27 acusaba de firma inválida a un intake honestamente sin firmar.
const RE_SIGNED_BY = /\b(?:Reportado|Solicitado|Validado)\s+por:[ \t]*(?!\[)(\S.*)$/im;
// OJO: sin \b final. En JS, \b es ASCII: tras «Í» no hay frontera de palabra, de modo que
// /S[ÍI]\b/ NO casa con «SÍ» — que es exactamente lo que escriben las tres plantillas.
const RE_SIGN_CONFIRM = /reflejan?\s+mi\s+intención:\s*S[ÍI]/i;
const RE_CIERRE = /^\s*>?\s*Termina cuando\s*:\s*\S/im;
const RE_NOTA_BITACORA = /^\d{4}-\d{2}-\d{2}\s*·\s*PHASE/gim;
const RE_SUITE_YAML = /^\s*suite_version\s*:\s*['\"]?([0-9.]+)/im;
const RE_PHASE_YAML = /^\s*phase\s*:\s*(\d+)/im;
const RE_SIGN_BATCH = /Firmado\s+por\s+lote:\s*(EP-\d+)/i;
const RE_DOR = /(?:^|\n)\s*(?:VEREDICTO|DoR)\s*:\s*(PASS|FAIL|CHALLENGE)\b/i;
const RE_DOR_OVERRIDE = /CHALLENGE\s+aceptado\s+por:\s*(?!\[)(\S.*)$/im;
const RE_SEVERITY = /^\s*severity:\s*(S[1-4])\s*$/im;
const RE_TYPE = /^\s*type:\s*(BUG|FEATURE|REFACTOR|INVESTIGATION|CHORE)\b/im;
const RE_TRACK = /^\s*track:\s*(STANDARD|EXPRESS|HOTFIX)\b/im;
const RE_COMPLEXITY = /^\s*complexity:\s*(TRIVIAL|STANDARD|MAJOR)/im;

const LIFECYCLE = ['DRAFT', 'READY', 'REOPENED', 'IN_PROGRESS', 'BLOCKED', 'BLOCKED_DOMAIN',
  'IN_REVIEW', 'VALIDATION_PENDING', 'DONE', 'INTEGRATED', 'CLOSED', 'REJECTED',
  'DEFERRED', 'REVERTED'];
const LEGACY_STATES = ['PENDING', 'OPEN', 'DISCOVERY_PENDING', 'ENRICHMENT_PENDING',
  'SCOPE_PENDING', 'REFACTOR_PENDING', 'ABIERTA', 'CERRADA', 'IN_REMEDIATION', 'VERIFIED',
  'CLOSED-WONTFIX', 'CLOSED-ACCEPTED'];

// ─── SUITE-R08 / LEX-R06 — el registro es el único asignador ─────────────────
let REGISTRO = null;   // lo rellena checkRegistry(); checkPT lo consulta para la fase
function checkRegistry() {
  const p = join(IMPL, 'REGISTRY.json');
  if (!existsSync(p)) {
    fail('SUITE-R08', 'Falta docs/implementation/REGISTRY.json — no hay asignador de IDs.');
    return null;
  }
  const reg = readJSON(p);
  if (reg === undefined) {
    fail('SUITE-R08', 'REGISTRY.json no es JSON válido.');
    return null;
  }
  if (reg === null || typeof reg !== 'object' || Array.isArray(reg)) {
    fail('SUITE-R08', 'REGISTRY.json existe pero no contiene un objeto JSON.');
    return null;
  }
  // Normalizar antes de usar: un tipo inesperado aquí hacía caer el proceso entero.
  if (reg.allocations !== undefined && !Array.isArray(reg.allocations)) {
    fail('SUITE-R08', '"allocations" existe pero no es un array. Se ignora para poder continuar.');
    reg.allocations = [];
  }
  if (reg.counters !== undefined && (typeof reg.counters !== 'object' || reg.counters === null || Array.isArray(reg.counters))) {
    fail('SUITE-R08', '"counters" existe pero no es un objeto. Se ignora para poder continuar.');
    reg.counters = {};
  }
  let bad = false;
  if (!reg.counters) { fail('SUITE-R08', 'REGISTRY.json no declara "counters".'); bad = true; }
  if (!Array.isArray(reg.allocations)) { fail('SUITE-R08', 'REGISTRY.json no declara "allocations" como array.'); bad = true; }
  if (!reg.suite_version) { fail('SUITE-R13', 'REGISTRY.json no declara "suite_version".'); bad = true; }
  if (!reg.execution_mode) { warn('EXEC-R02', 'REGISTRY.json no declara "execution_mode"; se asume SUPERVISED.'); }

  // Una migracion a medias con la version ya sellada dejaba el proyecto abierto: el desajuste
  // de version era la unica llave del modo restringido, y migrate la retira al sellar.
  if (Array.isArray(reg.migration_pending) && reg.migration_pending.length) {
    fail('SUITE-R17', `Migración incompleta: ${reg.migration_pending.length} decisión(es) humana(s) sin tomar. `
      + 'El proyecto sigue en modo restringido —solo [START MIGRATE], los status * y terminar los PTs en vuelo— '
      + 'hasta que se resuelvan y se borre "migration_pending" del REGISTRY. Pendientes: '
      + reg.migration_pending.map((x) => `«${String(x).slice(0, 70)}»`).join(' · '));
  }

  // SUITE-R17 · compuerta de migración
  if (!SUITE_VERSION) {
    warn('SUITE-R40', `No se pudo leer la versión vigente de ${relative(ROOT, CAMBIOS) || CAMBIOS}: `
      + 'la compuerta de migración queda sin evaluar. Antes esto no se notaba porque el número '
      + 'estaba escrito en el propio verificador, que es el defecto que la regla persigue.');
  } else if (reg.suite_version && reg.suite_version !== SUITE_VERSION) {
    fail('SUITE-R17',
      `El proyecto declara suite_version ${reg.suite_version} y la vigente es ${SUITE_VERSION}. ` +
      'Modo restringido: solo migrate, status y terminar los PTs en vuelo. → node tools/migrate.mjs');
  }
  // SUITE-R18 · los PTs en vuelo conservan su versión
  const unstamped = (reg.allocations ?? []).filter((a) => !a.suite_version);
  if (unstamped.length) {
    warn('SUITE-R18', `${unstamped.length} allocation(s) sin suite_version. Sin ese sello, una migración no puede respetar el trabajo en vuelo: ${unstamped.map((a) => a.id).slice(0, 5).join(', ')}`);
  }

  const seen = new Set();
  for (const a of reg.allocations ?? []) {
    if (seen.has(a.id)) { fail('SUITE-R08', `Identificador duplicado en REGISTRY.json: ${a.id} (Counter Drift).`); bad = true; }
    seen.add(a.id);
    if (a.status && !LIFECYCLE.includes(a.status)) {
      fail('LEX-R07', `${a.id}: status "${a.status}" no pertenece a la enumeración Lifecycle (LEXICON §5.1).`);
      bad = true;
    }
  }
  // El contador nunca puede quedar por debajo del ID más alto ya asignado (LEX-R04).
  for (const [pfx, n] of Object.entries(reg.counters ?? {})) {
    const max = (reg.allocations ?? [])
      .filter((a) => new RegExp(`^${pfx}-\\d+$`).test(a.id ?? ''))
      .reduce((m, a) => Math.max(m, Number(a.id.split('-')[1])), 0);
    if (max > n) {
      fail('LEX-R04', `counters.${pfx} = ${n} pero ya existe ${pfx}-${String(max).padStart(3, '0')}. El próximo ID se reutilizaría.`);
      bad = true;
    }
  }
  if (!bad) ok('SUITE-R08', 'REGISTRY.json presente y coherente.');
  return reg;
}

// ─── FND-R08 — Foundation se verifica por ARCHIVOS, no por carpeta ───────────
const FOUNDATION_CORE = ['02-PRD.md', '03-TRD.md', '06-Backend-Architecture.md', '11-Conventions.md'];

function checkFoundation() {
  const dir = ED;
  if (!existsSync(dir)) {
    fail('SUITE-R07', 'No existe docs/enterprise-documentation/. Ejecuta [START FOUNDATION].');
    return;
  }
  const missing = FOUNDATION_CORE.filter((f) => !existsSync(join(dir, f)));
  if (missing.length) {
    fail('FND-R08',
      `Foundation cuenta como AUSENTE: faltan ${missing.join(', ')}. ` +
      'La carpeta existe pero no los archivos del núcleo — el falso positivo que dejaba pasar a los proyectos de FIDE.');
    return;
  }
  // FND-R03 · nombres canónicos completos (LEX-R10 §6.1), no solo el UI/UX Brief
  const NO_CANON = {
    '05-UIUX-Brief.md': '05-UI-UX-Brief.md',
    '00-BUSINESS_CASE.md': '00-Business-Case.md',
    '01-PRD.md': '02-PRD.md',
    '02-ARCHITECTURE.md': '06-Backend-Architecture.md',
    '03-CONVENTIONS.md': '11-Conventions.md',
  };
  for (const [malo, bueno] of Object.entries(NO_CANON)) {
    if (existsSync(join(dir, malo))) {
      fail('FND-R03', `Nombre no canónico: ${malo}. Debe ser ${bueno} (LEX-R10). Numeración de FIDE v3: ejecuta [START FOUNDATION].`);
    }
  }
  const conv = read(join(dir, '11-Conventions.md')) ?? '';
  const unique = new Set([...conv.matchAll(/\bRULE-\d+\b/g)].map((m) => m[0]));
  if (unique.size < 3) fail('FND-R05', `11-Conventions.md declara ${unique.size} Hard Rules RULE-nn; el mínimo es 3.`);
  else ok('FND-R05', `11-Conventions.md declara ${unique.size} Hard Rules.`);
  ok('FND-R08', 'Foundation presente (archivos del núcleo verificados).');
}

// ─── FDGE-R43 · frescura del grafo ───────────────────────────────────────────
// Hasta 4.0.x, FDGE-R07 era HARD y exigía consultar el grafo mientras FDGE-R08 permitía
// cumplirla declarando que el grafo no existía. Una regla dura que se satisface diciendo
// que no se puede cumplir no es una regla. Aquí se vuelve computable.
function graphState(reg) {
  if (!existsSync(join(ROOT, 'graphify-out'))) return { state: 'MISSING', reason: 'no existe graphify-out/' };
  const g = reg?.graph;
  if (g?.pt_at_generation == null) {
    warn('FND-R14', 'REGISTRY.graph no declara pt_at_generation: el grafo no forma parte del paquete.');
    return { state: 'UNKNOWN', reason: 'REGISTRY.graph incompleto' };
  }
  const after = (reg.allocations ?? []).filter((a) =>
    a.structural === true &&
    ['INTEGRATED', 'CLOSED'].includes(a.status) &&
    Number(String(a.id).split('-')[1]) > Number(g.pt_at_generation));
  if (after.length) {
    return { state: 'STALE', reason: `PT estructural(es) integrados desde su generación: ${after.map((a) => a.id).join(', ')}` };
  }
  if (!g.generated) return { state: 'UNKNOWN', reason: 'REGISTRY.graph sin fecha de generación (FND-R14)' };
  return { state: 'FRESH', reason: `generado ${g.generated} sobre ${g.scope ?? 'src/'}` };
}

// ─── FDGE-R45 · higiene de la evidencia ──────────────────────────────────────
// FDGE-R24 ordena capturar request/response y logs REALES en el repositorio, y HISTORY.log
// es append-only: un secreto que entra aquí no se puede retirar. Sin este chequeo, el marco
// causa activamente la filtración que dice prevenir.
const SECRETOS = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'clave privada'],
  [/Bearer\s+eyJ[A-Za-z0-9._-]{20,}/, 'JWT en cabecera Authorization'],
  [/AKIA[0-9A-Z]{16}/, 'clave de acceso AWS'],
  [/gh[pousr]_[A-Za-z0-9]{30,}/, 'token de GitHub'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'token de Slack'],
  [/sk-[A-Za-z0-9]{32,}/, 'clave de API tipo sk-'],
  [/"(password|passwd|secret|api_?key|access_?token|refresh_?token)"\s*:\s*"(?!REDACTADO)[^"]{4,}"/i, 'campo de credencial con valor'],
  [/(?:password|contraseña)\s*[=:]\s*(?!REDACTADO)\S{6,}/i, 'contraseña en texto plano'],
];
const rel2 = (f) => relative(ROOT, f).split(sep).join('/');
const BIN = /\.(png|jpe?g|gif|webp|pdf|zip|mp4|webm|ico|woff2?)$/i;

// Escanea la evidencia Y el directorio de trabajo del PT. Mirar solo evidence/ dejaba fuera
// el sitio MAS probable de una credencial: el intake, donde una persona pega el reporte de un
// bug tal cual lo recibio, con su token dentro. Todo el directorio se commitea igual.
function scanEvidence(pt, dirPT) {
  const dirs = [join(EVIDENCE, pt), dirPT].filter((d) => d && existsSync(d));
  if (!dirs.length) return;
  const walkDir = (d, out = []) => {
    for (const n of readdirSync(d)) {
      const f = join(d, n);
      if (statSync(f).isDirectory()) walkDir(f, out);
      else if (!BIN.test(n)) out.push(f);
    }
    return out;
  };
  let hits = 0;
  for (const f of dirs.flatMap((d) => walkDir(d))) {
    let txt;
    try { txt = readFileSync(f, 'utf8'); } catch { continue; }
    if (txt.length > 2_000_000) continue;
    txt.split(/\r?\n/).forEach((line, i) => {
      for (const [re, qué] of SECRETOS) {
        if (re.test(line)) {
          hits++;
          fail('FDGE-R45',
            `${pt}: posible ${qué} en ${rel2(f)}:${i + 1}. ` +
            'Redacta el valor por «REDACTADO» y anota qué redactaste. La evidencia es append-only.');
          break;
        }
      }
    });
  }
  if (!hits) ok('FDGE-R45', `${pt}: evidencia e intake sin patrones de secreto conocidos.`);
}

// ─── SUITE-R06 · la lista cerrada de acciones que nadie automatiza ──────────
// Es la regla de mayor consecuencia del marco y no tenia una sola comprobacion mecanica: un
// grep sobre las herramientas devolvia cero. No se puede impedir que ocurra una accion
// irreversible desde aqui, pero SI se puede exigir que quede su rastro humano. Sin esto,
// AUTONOMOUS —el modo de mayor riesgo— era ademas el menos verificado.
const RE_LINEA = /\r?\n/;
const RE_INTEGRADO = /^\|?\s*(PT-\d+).*INTEGRATED/im;
const RE_QUIEN = /(?:integrado|resuelto|autorizado|validado|aprobado)\s+por:\s*(\S+)/i;
// SUITE-R27 · una firma no se puede probar, pero SI se puede contrastar. El CLAUDE.md del
// proyecto declara quien esta autorizado a firmar; un nombre fuera de esa lista falla. No
// impide que el agente escriba «Ada Lovelace», pero convierte la firma en una afirmacion
// contrastable y deja a una persona concreta asociada a cada decision irreversible.
// La propia plantilla escribe «firmantes:  # quien puede firmar...»: exigir fin de linea
// limpio hacia que el verificador no reconociera el archivo que la suite reparte.
const RE_FIRMANTES = /^\s*firmantes\s*:\s*(?:#.*)?$/im;
const RE_ITEM_LISTA = /^\s*-\s+(.+?)\s*$/;
// PT-030 · `[ \t]*` y no `\s*`, por la misma razón que en RE_SIGNED_BY. PT-028 corrigió aquella
// regex pero no ésta, y es ÉSTA la que usa checkFirmas(): el arreglo se quedó a medias sobre su
// propia regla. Con `\s*`, un campo vacío seguido de «Fecha:» capturaba esa etiqueta como nombre
// del firmante. El daño no era el mensaje raro: SUITE-R27 se evalúa una vez por ejecución sobre
// TODOS los intakes, así que un solo intake honestamente sin firmar bloqueaba G4 para el
// proyecto entero, acusándolo además de firma inválida. INTAKE-R06 ya decía la verdad al lado.
const RE_FIRMA_NOMBRE = /(?:solicitad[oa]|integrad[oa]|resuelt[oa]|autorizad[oa]|validad[oa]|aprobad[oa]|cerrad[oa]|revisad[oa])[ \t]+por:[ \t]*(\S.*?)[ \t]*$/gim;
function firmantesDeclarados() {
  const cm = read(join(ROOT, 'CLAUDE.md'));
  if (cm === null) return null;
  const ls = cm.split(RE_LINEA);
  const i = ls.findIndex((l) => RE_FIRMANTES.test(l));
  if (i < 0) return null;
  const out = [];
  for (let j = i + 1; j < ls.length; j++) {
    const m = ls[j].match(RE_ITEM_LISTA);
    if (!m) break;
    out.push(m[1].replace(/[`*]/g, '').replace(/#.*$/, '').trim());
  }
  return out.length ? out : null;
}
// FND-R19..R23 · el terreno. La primera instalacion real dejo la suite en una carpeta de
// investigacion, con el repositorio git y todo el codigo un nivel mas abajo: la raiz quedo
// FUERA del repositorio y nada lo dijo. G4 no tenia merge que verificar, PHASE 10 no tenia
// donde revertir y la evidencia no se podia anclar a un commit — pero el verificador solo se
// quejaba de dos artefactos que faltaban.
const IGNORA_DIR = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.turbo', 'coverage', 'vendor']);
// La plantilla imprime «SÍ | NO» para que una persona borre una de las dos. Buscar solo «SÍ»
// daba por firmado el documento recien generado: el mismo defecto de firma prerrellenada que
// ya costo un ciclo entero con las plantillas de Intake.
const RE_LAYOUT_FIRMA = /refleja la estructura que quiero:\s*(.+)/gi;
const RE_LAYOUT_QUIEN = /^\s*Revisado por:\s*(\S.*?)\s*$/im;
const RE_SIN_RESOLVER = /^\|\s*\d+\s*\|[^|]+\|\s*\|/m;
// FND-R24 · la Declaracion de Valor la produce Foundation, no la instalacion. Antes de que
// Foundation corra, el marcador PENDIENTE es lo correcto; despues, es un hueco: PTSA audita
// contra esa declaracion y sin ella audita contra nada.
const RE_VALOR_PENDIENTE = /PENDIENTE\s*—\s*Foundation/i;
// PT-028 · Mismo defecto que en RE_SIGNED_BY, y aquí sí era un verde falso peligroso: con
// `\s*`, una Declaración de Valor con el campo en blanco se reportaba como FIRMADA por
// «Fecha:». FND-R24 es la regla que sostiene toda la auditoría PTSA, y pasaba sobre nada.
const RE_VALOR_FIRMADA = /^[ \t]*Firmada por:[ \t]*(\S.*)$/im;
// SUITE-R30 · LAYOUT.md guarda las decisiones; INSTALL.log guarda los hechos. La primera
// instalacion real movio 15 documentos y sustituyo un .gitignore sin dejar rastro de ninguna
// de las dos cosas: el unico testimonio era el arbol de archivos resultante.
const RE_FILA_DECISION = /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*\*{0,2}(ACEPTADO|RECHAZADO|MODIFICADO)\*{0,2}\s*\|/gim;
const RE_ENTRADA_LOG = /^\s*(I\d)\s+([A-ZÁÉÍÓÚÑ]+)\s+(.+?)\s{2,}(OK|FALLÓ|FALLO)\s*$/gim;
function checkInstallLog() {
  const lay = read(join(IMPL, 'LAYOUT.md'));
  if (lay === null) return;                       // sin plan no hubo instalacion que registrar
  const log = read(join(IMPL, 'INSTALL.log'));
  if (log === null) {
    fail('SUITE-R30', 'Falta docs/implementation/INSTALL.log. LAYOUT.md guarda lo que se decidió; sin INSTALL.log no queda rastro de lo que se EJECUTÓ: revertir exigiría reconstruirlo a mano, y una auditoría no puede distinguir lo que hizo la instalación de lo que hizo alguien después.');
    return;
  }
  const entradas = [...log.matchAll(RE_ENTRADA_LOG)];
  if (!entradas.length) {
    fail('SUITE-R30', 'INSTALL.log existe y no contiene ninguna entrada con formato «I<n> ACCIÓN … OK|FALLÓ». Una cabecera sola no es un registro.');
    return;
  }
  // Toda propuesta ACEPTADA o MODIFICADA tuvo que ejecutarse. La correspondencia se DECLARA
  // con una etiqueta [L<n>] en la entrada, no se deduce por palabras: la primera version
  // cruzaba vocabulario y acusaba de no ejecutada una accion que si estaba registrada, solo
  // que descrita con otras palabras. Es el mismo error que castiga NO_EVALUADA sin motivo.
  const ejecutadas = new Set([...log.matchAll(/\[L(\d+)\]/g)].map((m) => m[1]));
  const aceptadas = [...lay.matchAll(RE_FILA_DECISION)].filter((m) => m[3].toUpperCase() !== 'RECHAZADO');
  let sinRastro = 0;
  for (const a of aceptadas) {
    if (ejecutadas.has(a[1])) continue;
    sinRastro++;
    fail('SUITE-R30', `LAYOUT.md decidió la propuesta ${a[1]} («${a[2].replace(/\*|`/g, '').slice(0, 60)}») y ninguna entrada de INSTALL.log la reclama con «[L${a[1]}]». Una decisión sin ejecución registrada es una decisión que nadie sabe si se cumplió.`);
  }
  for (const n of ejecutadas) {
    if (!aceptadas.some((a) => a[1] === n)) {
      fail('SUITE-R30', `INSTALL.log reclama ejecutar la propuesta [L${n}], que no existe en LAYOUT.md o fue RECHAZADA. Se ejecutó algo que nadie aprobó.`);
    }
  }
  if (!sinRastro) ok('SUITE-R30', `INSTALL.log con ${entradas.length} acción(es) registrada(s), todas las decisiones con rastro.`);
}

function checkValor(foundationLista) {
  const cm = read(join(ROOT, 'CLAUDE.md'));
  if (cm === null) return;
  if (!/Declaración de Valor/i.test(cm)) {
    warn('FND-R24', 'CLAUDE.md no lleva el bloque de Declaración de Valor. Cópialo de Suite-CLAUDE-Template.md.');
    return;
  }
  const pendiente = RE_VALOR_PENDIENTE.test(cm);
  const firmada = (cm.match(RE_VALOR_FIRMADA)?.[1] ?? '').replace(/←.*$/, '').trim();
  if (!foundationLista) {
    if (pendiente) ok('FND-R24', 'Declaración de Valor pendiente de Foundation PHASE 0, que es donde se produce.');
    return;
  }
  if (pendiente) {
    fail('FND-R24', 'Foundation ya se ejecutó y la Declaración de Valor sigue en PENDIENTE. PTSA audita contra ella: sin ella audita contra nada.');
  } else if (!firmada) {
    fail('FND-R24', 'La Declaración de Valor está redactada y sin firmar. Lo que el agente no puede decidir es si lo que el sistema entrega sirve: eso lo firma quien conoce el negocio.');
  } else ok('FND-R24', `Declaración de Valor firmada por ${firmada}.`);
}

// FDGE-R48/R49 · la implementacion como unidad abierta.
//
// El sintoma que la motiva no es de disciplina, es mecanico: sin una unidad abierta hay que
// declarar CADA VEZ que algo es nuevo, y eso es justo lo que se olvida a mitad de sesion. Con
// el default invertido lo raro es abrir y cerrar; y lo que esta abierto lo dice el registro,
// no la memoria del agente — asi sobrevive a que la sesion termine.
const VIVOS = new Set(['DRAFT', 'READY', 'REOPENED', 'IN_PROGRESS', 'BLOCKED', 'BLOCKED_DOMAIN']);
// SUITE-R33/R34 · el estado, y su frescura contra git.
//
// SUITE-R03 dice desde la 4.0.0 que ninguna sesion depende de la memoria del agente. Nada lo
// comprobaba: verify-fdge ni siquiera abria HANDOFF.md. Una regla que solo se cumple por buena
// voluntad es una recomendacion — y esta es la que decide si manana hay que explicarlo todo
// otra vez. Git es el reloj: si hubo trabajo despues del ultimo estado, el estado esta viejo.
const CAMPOS_ESTADO = ['implementación', 'tarea', 'compuerta', 'siguiente', 'decisiones', 'no hacer', 'actualizado'];
const RE_ESTADO = /<!--\s*ESTADO\s*-->([\s\S]*?)<!--\s*\/ESTADO\s*-->/;
function checkEstado() {
  const h = read(join(IMPL, 'HANDOFF.md'));
  if (h === null) { warn('SUITE-R33', 'Sin docs/implementation/HANDOFF.md: no hay estado que retomar.'); return; }
  const m = h.match(RE_ESTADO);
  if (!m) {
    fail('SUITE-R33', 'HANDOFF.md no abre con el bloque ESTADO. Un HANDOFF de prosa cuenta lo que se hizo; retomar necesita qué está abierto, qué compuerta espera y cuál es la siguiente acción — y eso tiene que caber en una pantalla.');
    return;
  }
  const cuerpo = m[1];
  const faltan = CAMPOS_ESTADO.filter((c) => !new RegExp('^\s*' + c + '\s*:', 'im').test(cuerpo));
  if (faltan.length) {
    fail('SUITE-R33', `El bloque ESTADO no declara: ${faltan.join(', ')}. El orden es fijo a propósito: se lee siempre igual y por eso se lee entero.`);
  }
  const vacios = CAMPOS_ESTADO.filter((c) => {
    const v = cuerpo.match(new RegExp('^\s*' + c + '\s*:[ \t]*(.*)$', 'im'))?.[1]?.trim();
    return v !== undefined && v === '';
  });
  if (vacios.length) fail('SUITE-R33', `Campos del bloque ESTADO en blanco: ${vacios.join(', ')}. «ninguna» es una respuesta; el blanco no dice si no hay o si nadie lo escribió.`);
  if (!faltan.length && !vacios.length) ok('SUITE-R33', 'Bloque ESTADO completo.');

  // Frescura contra git. Sin repositorio no hay reloj y no se puede exigir.
  const fecha = (ruta) => {
    try {
      const o = execFileSync('git', ['log', '-1', '--format=%ct', '--', ruta], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
      return o ? Number(o) : 0;
    } catch { return -1; }
  };
  const tEstado = fecha('docs/implementation/HANDOFF.md');
  const tTrabajo = fecha('changes');
  if (tEstado < 0 || tTrabajo < 0) return;               // sin git, nada que comparar
  if (tTrabajo && tEstado && tTrabajo > tEstado) {
    const dias = Math.round((tTrabajo - tEstado) / 86400);
    fail('SUITE-R34', `Hubo trabajo en changes/ después del último estado${dias ? ` (${dias} día(s) de diferencia)` : ''}. La sesión terminó sin dejar el estado retomable: mañana hay que reconstruirlo leyendo el repositorio, que es justo lo que SUITE-R03 dice que no debe hacer falta.`);
  } else if (tEstado) ok('SUITE-R34', 'El estado es más reciente que el último trabajo.');
}

function checkImplementacion(reg) {
  const all = Array.isArray(reg?.allocations) ? reg.allocations : [];
  const abiertas = all.filter((a) => a?.type === 'EP' && a?.status === 'IN_PROGRESS');
  if (abiertas.length > 1) {
    fail('FDGE-R48', `${abiertas.length} implementaciones abiertas a la vez (${abiertas.map((a) => a.id).join(', ')}). Con dos, «esto es lo mismo» deja de tener respuesta y el default de FDGE-R49 no significa nada. Cierra una antes de abrir otra.`);
    return;
  }
  if (!abiertas.length) { ok('FDGE-R48', 'Sin implementación abierta.'); return; }
  const abierta = abiertas[0];
  ok('FDGE-R48', `${abierta.id} es la única implementación abierta.`);
  // Default invertido: con una abierta, todo PT vivo le pertenece. La excepcion es HOTFIX,
  // porque produccion caida no espera a que se cierre nada.
  const huerfanos = all.filter((a) => a?.type && a.type !== 'EP' && VIVOS.has(a?.status)
    && !a?.epic && String(a?.track ?? '').toUpperCase() !== 'HOTFIX');
  if (huerfanos.length) {
    fail('FDGE-R49', `${abierta.id} está abierta y ${huerfanos.length} PT vivo(s) no declaran su epic: ${huerfanos.map((a) => a.id).join(', ')}. Mientras haya una implementación abierta todo le pertenece; trabajar fuera exige cerrarla o abrir otra, y ambas cosas se dicen. La única excepción es track HOTFIX.`);
  } else ok('FDGE-R49', `${abierta.id} abierta · todo el trabajo vivo le pertenece.`);
}

function checkTerreno() {
  if (!existsSync(join(ROOT, '.git'))) {
    warn('FND-R19', 'La raíz no es un repositorio git. G4 es un merge real (FDGE-R33), PHASE 10 es un rollback real y la evidencia se ancla a commits: sin repositorio en la raíz, esas tres cosas no tienen dónde ocurrir. → git init, o instalar la suite en el repositorio.');
  }
  // Un repositorio que existe y no versiona NADA es tan inutil como no tenerlo: G4 no tiene
  // que fusionar, PHASE 10 no tiene a que volver y la evidencia no se puede anclar. Aparecio
  // en la primera instalacion real: el .gitignore heredado decia «*».
  if (existsSync(join(ROOT, '.git'))) {
    let versionados = 0;
    try {
      const out = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      versionados = out.split(RE_LINEA).filter((l) => l.trim()).length;
    } catch { versionados = -1; }
    if (versionados === 0) {
      const gi = read(join(ROOT, '.gitignore'));
      const todo = gi !== null && /^\s*\*\s*$/m.test(gi);
      fail('FND-R19', `El repositorio de la raíz no versiona ningún archivo${todo ? ' porque .gitignore contiene «*»' : ''}. Un repositorio vacío no sostiene G4 (no hay qué fusionar), ni PHASE 10 (no hay a qué volver), ni la evidencia anclada a commits. Decide qué se versiona antes de abrir trabajo.`);
    }
  }

  // Un repositorio DENTRO de la raiz significa dos lineas principales, y «integrado» deja de
  // significar lo mismo en cada una.
  const anidados = [];
  const buscar = (dir, prof) => {
    if (prof > 2) return;
    let ents = [];
    try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (!e.isDirectory() || IGNORA_DIR.has(e.name)) continue;
      const q = join(dir, e.name);
      if (existsSync(join(q, '.git'))) { anidados.push(rel2(q)); continue; }
      buscar(q, prof + 1);
    }
  };
  buscar(ROOT, 0);
  for (const a of anidados) {
    fail('FND-R19', `${a} es un repositorio git DENTRO de la raíz. La suite gobierna una sola línea principal: con dos, «integrado» no significa lo mismo en cada sitio. Resuélvelo en LAYOUT.md (G0) antes de abrir trabajo.`);
  }
  const lay = read(join(IMPL, 'LAYOUT.md'));
  if (lay === null) {
    warn('FND-R20', 'Sin docs/implementation/LAYOUT.md: el terreno nunca se enumeró. → node docs/methodology/tools/plan-layout.mjs --write');
    return;
  }
  // La linea se edita EN SU SITIO. Dos veredictos en el archivo es la misma ambiguedad que
  // QA-R04 castiga en un caso de prueba: se tomaria uno de los dos y nadie sabe cual.
  const vers = [...lay.matchAll(RE_LAYOUT_FIRMA)].map((m) => m[1].replace(/[`]/g, '').trim());
  if (vers.length > 1) {
    fail('FND-R22', `LAYOUT.md declara ${vers.length} veredictos de firma (${vers.join(' / ')}). La línea se edita en su sitio: con dos, se tomaría uno y nadie sabe cuál.`);
    return;
  }
  const veredicto = (vers[0] ?? '').replace(/[|]/g, ' ').trim();
  const quien = lay.match(RE_LAYOUT_QUIEN)?.[1]?.replace(/←.*$/, '').trim();
  if (!/^S[IÍ]$/i.test(veredicto) || !quien) {
    fail('FND-R23', 'LAYOUT.md existe y no está firmado (falta «Revisado por: <nombre>» o el veredicto no es un SÍ limpio). Mientras el terreno esté sin resolver no se abre trabajo nuevo: documentar y auditar una estructura que va a cambiar es trabajo que hay que rehacer.');
  } else if (RE_SIN_RESOLVER.test(lay)) {
    fail('FND-R22', 'LAYOUT.md está firmado pero deja movimientos sin decisión. Cada uno es ACEPTADO, RECHAZADO con motivo o MODIFICADO con el destino real: una celda vacía es indistinguible de una que nadie miró.');
  } else ok('FND-R22', 'Plan de terreno resuelto y firmado.');
}

function checkFirmas() {
  const lista = firmantesDeclarados();
  if (!lista) {
    warn('SUITE-R27', 'CLAUDE.md no declara «firmantes:». Sin esa lista, cualquier nombre en una firma es válido y la firma no aporta trazabilidad — solo apariencia de ella.');
    return;
  }
  if (lista.some((n) => /^Nombre Apellido$/i.test(n))) {
    fail('SUITE-R27', 'CLAUDE.md conserva «Nombre Apellido» en firmantes: la plantilla se copió y no se personalizó.');
  }
  let malos = 0;
  const revisar = (txt, dónde) => {
    if (!txt) return;
    for (const m of txt.matchAll(RE_FIRMA_NOMBRE)) {
      const quien = m[1].replace(/[`*|]/g, '').trim();
      if (!quien || /^(?:—|-|n\/a|tbd|pendiente)$/i.test(quien)) continue;
      if (!lista.some((n) => quien.toLowerCase().startsWith(n.toLowerCase()) || n.toLowerCase().startsWith(quien.toLowerCase()))) {
        malos++;
        fail('SUITE-R27', `${dónde}: firma «${quien}», que no figura en firmantes: de CLAUDE.md (${lista.join(', ')}). O falta en la lista, o nadie la escribió.`);
      }
    }
  };
  revisar(read(join(IMPL, 'HISTORY.log')), 'HISTORY.log');
  revisar(read(join(IMPL, 'LAYOUT.md')), 'LAYOUT.md');
  if (existsSync(CHANGES)) {
    for (const d of readdirSync(CHANGES)) revisar(read(join(CHANGES, d, 'intake.md')), `${d}/intake.md`);
  }
  if (!malos) ok('SUITE-R27', `Toda firma corresponde a un firmante declarado (${lista.join(', ')}).`);
}

function checkIrreversibles(modo) {
  const hist = read(join(IMPL, 'HISTORY.log'));
  if (hist === null) return;
  const lineas = hist.split(RE_LINEA);
  let sinFirma = 0;
  for (const l of lineas) {
    const m = l.match(RE_INTEGRADO);
    if (!m) continue;
    if (!RE_QUIEN.test(l)) {
      sinFirma++;
      fail('SUITE-R06', `${m[1]}: figura INTEGRATED en HISTORY.log sin «integrado por: <persona>». El merge a la principal es siempre humano (SUITE-R06a, FDGE-R33), y sin nombre no hay decisión humana registrada.`);
    }
  }
  if (!sinFirma) ok('SUITE-R06', 'Toda integración registrada lleva nombre humano.');
  // AUTONOMOUS exige ademas que el humano haya declarado el limite del lote (EXEC-R03).
  if (modo === 'AUTONOMOUS') {
    const eps = existsSync(CHANGES) ? readdirSync(CHANGES).filter((d) => /^EP-\d+/.test(d)) : [];
    if (!eps.length) {
      fail('SUITE-R06', 'execution_mode AUTONOMOUS sin ningún lote EP-NNN. En AUTONOMOUS el humano decide el alcance UNA vez, por lote: sin lote no hay alcance declarado y el modo queda sin límite (EXEC-R03).');
    } else ok('SUITE-R06', `AUTONOMOUS con ${eps.length} lote(s) de alcance declarado.`);
  }
}
// ─── SUITE-R15 · el proyecto debe tener el núcleo que el agente carga ────────
// Un proyecto sin CORE.md no puede cumplir SUITE-R15: no tiene qué cargar. Hasta la 4.3.1,
// los instaladores de FIDE enumeraban archivos uno a uno y omitían CORE.md — el proyecto
// nacía sin núcleo y nada lo detectaba.
function checkCore() {
  const core = join(ROOT, 'docs', 'methodology', 'CORE.md');
  if (!existsSync(core)) {
    fail('SUITE-R15', 'Falta docs/methodology/CORE.md — el núcleo que el agente carga. → node docs/methodology/tools/build-core.mjs docs/methodology');
    return;
  }
  const txt = readFileSync(core, 'utf8');
  if (!/GENERADO por tools\/build-core\.mjs/.test(txt)) {
    fail('SUITE-R16', 'CORE.md perdió su marca de generado: se editó a mano.');
    return;
  }
  const decl = txt.match(/<!-- fuentes: (.+?) -->/)?.[1];
  const dir = join(ROOT, 'docs', 'methodology');
  const fuentes = ['RULES.md', 'LEXICON.md', 'EXECUTION-MODES.md', 'PHASES.md'];
  const falta = fuentes.filter((f) => !existsSync(join(dir, f)));
  if (falta.length) {
    fail('SUITE-R16', `CORE.md existe pero faltan sus fuentes: ${falta.join(', ')}. La instalación viajó incompleta.`);
    return;
  }
  const real = fuentes
    .map((f) => `${f}:${selloDe(readFileSync(join(dir, f), 'utf8'))}`)
    .join(' ');
  if (decl !== real) fail('SUITE-R16', 'CORE.md desincronizado con sus fuentes. → node docs/methodology/tools/build-core.mjs docs/methodology');
  else ok('SUITE-R15', 'CORE.md presente y sincronizado.');
}

// ─── INTAKE-R09 · el Intake del lote ─────────────────────────────────────────
// INTAKE-R08 exigía changes/EP-NNN-slug/intake.md sin decir qué contiene. Ahora hay
// plantilla (EPIC-INTAKE.md) y esto comprueba que el lote la respeta.
function checkEpics() {
  if (!existsSync(CHANGES)) return;
  const eps = readdirSync(CHANGES).filter((d) => /^EP-\d+/.test(d) && statSync(join(CHANGES, d)).isDirectory());
  for (const dir of eps) {
    const ep = dir.match(/^EP-\d+/)[0];
    const f = join(CHANGES, dir, 'intake.md');
    const txt = read(f);
    if (txt === null) { fail('INTAKE-R09', `${ep}: falta changes/${dir}/intake.md.`); continue; }
    // SUITE-R45 va ANTES del control de completitud: que al intake le falte el analisis de
    // solapamiento no dice nada sobre si el lote declara su cierre, y el `continue` de abajo
    // dejaba la comprobacion sin ejecutar. Lo dijeron tres casos en rojo, no la lectura.
    checkCierreDeLote(ep, txt, dir);
    const falta = [];
    if (!/Objetivo com[úu]n/i.test(txt)) falta.push('objetivo común');
    if (!/Criterio de [ée]xito del lote/i.test(txt)) falta.push('criterio de éxito del lote');
    if (!/OUT:|Qu[ée] NO entra/i.test(txt)) falta.push('out-of-scope');
    if (!/solapamiento/i.test(txt)) falta.push('análisis de solapamiento');
    if (!RE_SIGN_BLOCK.test(txt) && !/Firma [úu]nica/i.test(txt)) falta.push('bloque de firma');
    if (falta.length) { fail('INTAKE-R09', `${ep}: intake del lote incompleto — falta: ${falta.join(' · ')}.`); continue; }
    // Todo PT del lote debe llevar «Firmado por lote: EP-NNN» (INTAKE-R08)
    //
    // PT-011 · Los miembros se leen de las FILAS DE TABLA, no de todo el texto. Con
    // `matchAll` sobre el intake entero, citar un PT anterior como precedente —«el método que
    // ya funcionó en PT-006»— lo convertía en miembro del lote y disparaba un INTAKE-R08 falso
    // sobre un PT cerrado. El coste no era el error: era que obligaba a escribir los intakes de
    // lote SIN referencias cruzadas, que es justo lo que da trazabilidad.
    //
    // La corrección venía del proyecto que la sufrió (su commit 760f790) y el CHANGELOG de la
    // 4.13.0 la declaró TRAÍDA sin que el código la llevara: de las cuatro de aquella tanda
    // llegaron tres. Un CHANGELOG que afirma una corrección cierra la pregunta, y nadie
    // vuelve a mirar.
    //
    // Se conserva el barrido completo como respaldo cuando no hay ninguna fila reconocible,
    // para no dejar de comprobar EN SILENCIO los intakes de lote escritos antes de que la
    // plantilla tuviera tabla — cambiar un fallo ruidoso por uno mudo es peor.
    //
    // PT-022 · la seccion «## Cierre del lote» TAMBIEN es una tabla, y sus filas citan
    // identificadores que no son miembros del lote sino destinos de lo que aplaza. Sin
    // excluirla, citar PT-023 en el cierre lo convertia en miembro y pedia su carpeta: la
    // regla nueva se rompio contra la anterior el mismo dia. Se recorta antes de leer.
    const sinCierre = RE_CIERRE_LOTE.test(txt) ? txt.slice(0, txt.search(RE_CIERRE_LOTE)) : txt;
    const enFilas = sinCierre
      .split(/\r?\n/)
      .filter((l) => /^\s*\|/.test(l))
      .flatMap((l) => [...l.matchAll(/\bPT-\d+\b/g)].map((m) => m[0]));
    const pts = enFilas.length ? enFilas : [...sinCierre.matchAll(/PT-\d+/g)].map((m) => m[0]);
    for (const pt of [...new Set(pts)]) {
      const d = readdirSync(CHANGES).find((x) => x.startsWith(pt + '-'));
      if (!d) { fail('INTAKE-R09', `${ep}: lista ${pt} y no existe changes/${pt}-slug/.`); continue; }
      const it = read(join(CHANGES, d, 'intake.md')) ?? '';
      if (!RE_SIGN_BATCH.test(it)) {
        fail('INTAKE-R08', `${pt}: pertenece a ${ep} pero su intake no lleva «Firmado por lote: ${ep}». Sin esa línea es indistinguible de uno sin firmar.`);
      }
    }
    ok('INTAKE-R09', `${ep}: intake del lote completo.`);
  }
}

/**
 * `SUITE-R45` · PT-022 · Un lote declara qué se hace al cerrarlo.
 *
 * La entrada de `CHANGELOG` de EP-004 estaba escrita como fila del out-of-scope de DOS tareas y
 * ausente en las otras TRES. La misma obligación copiada cinco veces —lo que SUITE-R38 prohíbe—
 * divergiendo a los dos días. Y las dos que la escribieron fueron las que la compuerta bloqueó:
 * declarar lo que aplazas salía más caro que callártelo.
 *
 * El lote es quien aplaza el cierre del lote. Ahí solo hay UN sitio donde escribirlo.
 *
 * Esto NO comprueba que un out-of-scope esté completo: lo que no está escrito no es detectable
 * sin conocer el alcance real de la tarea, y fingir que se detecta sería peor que la omisión
 * (RULE-06). Lo que cambia es que omitir una fila deje de PERDER algo.
 */
const RE_CIERRE_LOTE = /^##+\s*Cierre del lote/im;
/** `SUITE-R45` · ¿el intake de este lote declara su sección de cierre? Lo usan las dos mitades
 *  de PT-022: la que comprueba el lote y la que impide citarlo cuando no hay nada escrito. */
function loteDeclaraCierre(ep) {
  if (!existsSync(CHANGES)) return false;
  const dir = readdirSync(CHANGES).find((d) => d.startsWith(ep + '-'));
  return !!dir && RE_CIERRE_LOTE.test(read(join(CHANGES, dir, 'intake.md')) ?? '');
}
const RE_RESUELTA = /\bHECHO\b|\b(?:PT|EP)-\d+\b/;
function checkCierreDeLote(ep, txt, dir) {
  const alloc = (REGISTRO?.allocations ?? []).find((a) => a?.id === ep);
  // Un lote CLOSED ya paso su G4 con las reglas de su momento. Exigirle una seccion que no
  // existia entonces es reescribir historia — y este marco lo prohibe en todas partes menos,
  // hasta aqui, en si mismo. La regla aplica a lo que todavia puede cerrarse.
  if (alloc?.status === 'CLOSED') return;
  const enG4 = gate === 'G4' || alloc?.status === 'DONE';
  if (!RE_CIERRE_LOTE.test(txt)) {
    const m = `${ep}: su intake no declara «## Cierre del lote». Lo que se resuelve al cerrar `
      + `—la entrada de CHANGELOG.md, el número de versión, lo que sus tareas le hayan aplazado— `
      + `vive ahí y en ningún otro sitio: escrito como fila en cada tarea, es la misma regla `
      + `copiada N veces, y las copias divergen (SUITE-R38).`;
    if (enG4) fail('SUITE-R45', m); else warn('SUITE-R45', m);
    return;
  }
  // Las filas de la sección: tabla markdown, primera celda con el asunto y la última su estado.
  // Se corta DESPUES del titulo: partir desde el propio «##» devuelve la cadena vacia y la
  // seccion parecia sin filas aunque las tuviera. Lo dijo la ejecucion real, no un caso.
  const desde = txt.slice(txt.search(RE_CIERRE_LOTE));
  const cuerpo = desde.slice(desde.search(/\r?\n/) + 1).split(/^##+\s/m)[0];
  const filas = cuerpo.split(/\r?\n/)
    .filter((l) => /^\s*\|/.test(l) && !/^\s*\|[\s:|-]*\|?\s*$/.test(l))
    .slice(1);                      // la primera es la cabecera
  if (!filas.length) {
    const m = `${ep}: «## Cierre del lote» está vacía. Una sección sin filas dice que no queda `
      + `nada por hacer al cerrar, y eso es una afirmación, no un hueco que se rellena luego.`;
    if (enG4) fail('SUITE-R45', m); else warn('SUITE-R45', m);
    return;
  }
  const sinResolver = filas.filter((l) => !RE_RESUELTA.test(l.split('|').slice(-2)[0] ?? ''));
  if (sinResolver.length && enG4) {
    const cual = sinResolver.map((l) => `«${(l.split('|')[1] ?? '').trim().slice(0, 40)}»`).join(', ');
    fail('SUITE-R45', `${ep}: ${sinResolver.length} fila(s) de «## Cierre del lote» sin resolver `
      + `en G4: ${cual}. Cada una declara HECHO o el identificador al que se movió — un lote no `
      + `cierra dejando sin responder lo que él mismo se asignó.`);
    return;
  }
  if (sinResolver.length) {
    warn('SUITE-R45', `${ep}: ${sinResolver.length} fila(s) de cierre aún sin resolver. En G4 bloquean.`);
    return;
  }
  ok('SUITE-R45', `${ep}: cierre del lote declarado y resuelto (${filas.length} fila(s)).`);
}

// ─── FND-R13 · línea base de reconciliación ──────────────────────────────────
function checkReconciliation() {
  const base = read(join(ED, '00-Baseline.md'));
  const log = read(join(IMPL, 'RECONCILIATION.log'));
  if (base === null && log === null) {
    warn('FND-R15', 'Sin 00-Baseline.md ni RECONCILIATION.log: la reconciliación nunca se ejecutó. → [START RECONCILE]');
    return;
  }
  if (base === null) {
    fail('FND-R13', 'Hay RECONCILIATION.log pero falta 00-Baseline.md: hay decisiones registradas sin línea base que las justifique.');
    return;
  }
  const falta = [];
  if (!/Totales:|## Inventario documental/i.test(base)) falta.push('inventario con totales');
  if (!/## Divergencias/i.test(base)) falta.push('sección de divergencias');
  if (!/## Confianza de partida/i.test(base)) falta.push('confianza de partida');
  if (falta.length) fail('FND-R13', `00-Baseline.md incompleto — falta: ${falta.join(' · ')}.`);
  else ok('FND-R13', 'Línea base de reconciliación completa.');
}

// ─── Utilidades por PT ───────────────────────────────────────────────────────
function ptDir(pt) {
  if (!existsSync(CHANGES)) return null;
  const hit = readdirSync(CHANGES).find((d) => d.startsWith(`${pt}-`) || d === pt);
  return hit ? join(CHANGES, hit) : null;
}

const isEmptyCell = (v) => {
  const t = (v ?? '').trim();
  return t === '' || t === '—' || t === '-' || t === '–' || /^t?bd$/i.test(t) || /^pendiente$/i.test(t);
};

// ─── SUITE-R35 · el espejo, preguntado a quien tiene el adaptador ────────────
// PT-001 · verify-fdge NO habla con GitHub. Un segundo cliente de plataforma dentro de este
// archivo obligaria a implementar Azure dos veces y a mantener dos clientes en sincronia: la
// duplicacion que este repositorio existe para eliminar. Contrato de `tracker`:
//   0 el espejo cuadra · 1 divergencia · 2 sin plataforma declarada · 3 declarada sin acceso
function correTracker(args) {
  const bin = join(dirname(fileURLToPath(import.meta.url)), 'tracker.mjs');
  if (!existsSync(bin)) return { codigo: 2, salida: '' };
  const r = spawnSync(process.execPath, [bin, ...args, ROOT], { encoding: 'utf8' });
  // Si el proceso ni arranca, no se asume verde: eso es «nadie pudo mirar».
  if (r.error || r.status === null) return { codigo: 3, salida: String(r.error?.message ?? '') };
  return { codigo: r.status, salida: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

/** Notas de reanclaje del issue de un PT: número · `SIN_ACCESO` · `null` si no aplica. */
function notasDelIssue(pt) {
  const r = correTracker(['notas', pt]);
  if (r.codigo === 3) return 'SIN_ACCESO';
  if (r.codigo !== 0) return null;
  const n = Number(String(r.salida).trim().split(/\r?\n/).pop());
  return Number.isFinite(n) ? n : null;
}

function parseTraceability(md) {
  const rows = [];
  for (const line of md.split(/\r?\n/)) {
    const t = line.trim();
    if (!t.startsWith('|')) continue;
    const cells = t.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 5 || !/^AC-\d+$/.test(cells[0])) continue;
    rows.push({ ac: cells[0], criterio: cells[1], ts: cells[2], test: cells[3], evidencia: cells[4], qa: cells[5] ?? '' });
  }
  return rows;
}

// ─── Verificación de un PT ───────────────────────────────────────────────────
function checkPT(pt, { gate } = {}) {
  const dir = ptDir(pt);
  if (!dir) {
    fail('FDGE-R01', `${pt}: no existe changes/${pt}-slug/. Todo trabajo entra por un Intake.`);
    return;
  }
  const rel = relative(ROOT, dir).replace(/\\/g, '/');
  const errAt = errors.length;

  // ── PHASE 1 · Intake ──────────────────────────────────────────────────────
  const intake = read(join(dir, 'intake.md'));
  let type = null;
  let track = 'STANDARD';
  if (intake === null) {
    fail('FDGE-R01', `${pt}: falta ${rel}/intake.md.`);
    return;
  }
  type = intake.match(RE_TYPE)?.[1] ?? null;
  track = intake.match(RE_TRACK)?.[1] ?? 'STANDARD';

  if (RE_SIGN_BATCH.test(intake) && !/AC-\d+/.test(intake)) {
    fail('FDGE-R51', `${pt}: intake ligero sin ningún AC-nn. La firma se hereda del lote; los criterios de aceptación NO — son lo único que cambia de una tarea a otra, y son contra lo que valida G3.`);
  }
  if (!RE_SIGN_BLOCK.test(intake)) {
    fail('INTAKE-R06', `${pt}: intake.md no tiene bloque "## Firma".`);
  } else {
    const batch = intake.match(RE_SIGN_BATCH);
    const signed = RE_SIGNED_BY.test(intake) && RE_SIGN_CONFIRM.test(intake);
    if (batch) ok('INTAKE-R08', `${pt}: firmado por lote ${batch[1]}.`);
    else if (!signed) fail('INTAKE-R06', `${pt}: el bloque "## Firma" está sin rellenar. Un Intake sin firmar no supera G1.`);
    else ok('INTAKE-R06', `${pt}: Intake firmado.`);
  }

  // FDGE-R51 · un PT de una implementacion ya firmada hereda del lote la firma, el veredicto
  // de G1 y la severidad. Cobrarle el ritual completo a cada arreglo de una construccion tiene
  // una sola salida practicable: saltarselo, y perder el rastro. Lo que NO hereda: sus criterios
  // de aceptacion, G3 y la evidencia — la ligereza esta en la entrada, no en la salida.
  const heredaDelLote = RE_SIGN_BATCH.test(intake);
  if (heredaDelLote) ok('FDGE-R51', `${pt}: intake ligero · firma, veredicto y severidad heredados del lote.`);

  const enRegistroPT = (REGISTRO?.allocations ?? []).find((a) => a?.id === pt);
  // FDGE-R52/R53 solo rigen para trabajo abierto BAJO la version que las introdujo. SUITE-R18
  // existe justo para esto: cada allocation lleva su suite_version y la conserva hasta cerrar.
  // Sin esta puerta, adoptar la regla exigiria una bitacora retroactiva a cada PT ya integrado
  // — obligar a rehacer trabajo valido es la forma mas rapida de que se abandone el marco.
  const DESDE = [5, 1, 0];
  const suiteDelPT = (intake.match(RE_SUITE_YAML)?.[1] ?? enRegistroPT?.suite_version ?? '0.0.0')
    .split('.').map((n) => Number(n) || 0);
  const rigeAqui = suiteDelPT[0] > DESDE[0]
    || (suiteDelPT[0] === DESDE[0] && (suiteDelPT[1] > DESDE[1]
      || (suiteDelPT[1] === DESDE[1] && suiteDelPT[2] >= DESDE[2])));

  // FDGE-R53 · la deriva ocurre en tareas SIN FORMA. Una que declara como termina lo tiene.
  if (rigeAqui && !RE_CIERRE.test(intake)) {
    fail('FDGE-R53', `${pt}: el intake no declara cómo termina. Una tarea sin condición de cierre observable no tiene final: se estira hasta que nadie recuerda dónde empezó. Una línea basta — «Termina cuando: …».`);
  }

  // PT-004 · La fase se DECLARA o no existe. No es lo mismo «PHASE 0» que «nadie lo escribio»:
  // con `?? 0` los dos casos daban el mismo numero, y sobre un valor inventado la compuerta
  // dice «todo bien» sobre nada — que es justo lo que RULE-06 prohibe. Fuentes, por precedencia:
  // el YAML del intake manda sobre el registro, porque es lo que el PT dice de si mismo.
  const faseDeclarada = (() => {
    const yaml = intake.match(RE_PHASE_YAML)?.[1];
    if (yaml !== undefined) return Number(yaml);
    if (enRegistroPT?.phase !== undefined && enRegistroPT?.phase !== null) return Number(enRegistroPT.phase);
    return null;              // nadie la declara: no evaluable, y se dice
  })();
  const fase = faseDeclarada ?? 0;

  // Un artefacto se exige DESDE la fase que lo produce (CORE.md §Procedimiento por fase).
  // Exigirlo antes ponia en rojo a todo PT recien abierto, y CI corre `verify-fdge --all`:
  // un repositorio no podia tener trabajo en curso y la compuerta en verde a la vez. Una
  // compuerta que se pone roja sobre comportamiento correcto ensena a saltarsela.
  //
  // Tres salidas, no dos (RULE-02): falta y toca -> error · falta y aun no toca -> aviso ·
  // no se sabe en que fase esta -> SIN EVALUAR, que no es un aprobado.
  const exigible = (regla, desde, artefacto) => {
    if (faseDeclarada === null) {
      warn(regla, `${pt}: no declara fase — la exigencia de ${artefacto} queda SIN EVALUAR. `
        + 'Declara «phase: N» en el YAML de su intake.md o «phase» en su allocation de '
        + 'REGISTRY.json. Sin fase no se puede afirmar que falte ni que sobre (RULE-06).');
      return false;
    }
    if (faseDeclarada < desde) {
      warn(regla, `${pt}: aún sin ${artefacto} — se escribe en PHASE ${desde} y el PT está en PHASE ${faseDeclarada}.`);
      return false;
    }
    return true;
  };

  // FDGE-R52 · el reanclaje se ESCRIBE. Una nota por transicion alcanzada, con fecha.
  // Releer no deja rastro y por eso no se podia exigir; escribir si, y ademas obliga a releer.
  //
  // PT-001 · CORE.md manda escribirlo «issue si hay plataforma · bitacora.md si no», y esto
  // solo miraba bitacora.md. Cumplir el procedimiento al pie de la letra dejaba la compuerta en
  // rojo, y ponerla verde exigia escribir el reanclaje DOS VECES — lo que SUITE-R35 prohibe.
  // El verificador no habla con la plataforma: se lo pregunta a `tracker`, que es quien tiene
  // el adaptador. La regla la hace cumplir quien verifica; el acceso lo encapsula quien lo tiene.
  if (rigeAqui && fase >= 2) {
    const plataforma = REGISTRO?.tracker?.plataforma ?? null;
    const notasPlataforma = plataforma && enRegistroPT?.issue ? notasDelIssue(pt) : null;
    if (notasPlataforma === 'SIN_ACCESO') {
      const m = `${pt}: hay plataforma declarada y no hay acceso desde aquí, así que el reanclaje del issue #${enRegistroPT.issue} queda SIN EVALUAR. La credencial se comprueba antes de necesitarla (FND-R30) — «gh auth login».`;
      if (gate === 'G4') fail('FDGE-R52', m); else warn('FDGE-R52', m);
    } else if (typeof notasPlataforma === 'number') {
      if (notasPlataforma < fase - 1) {
        fail('FDGE-R52', `${pt}: está en PHASE ${fase} y su issue #${enRegistroPT.issue} tiene ${notasPlataforma} nota(s) de reanclaje; faltan ${fase - 1 - notasPlataforma}. Cada transición de fase deja tres líneas —qué cierras, dónde estás, qué sigue— y con plataforma declarada van en el issue (CORE.md §El bloque ESTADO).`);
      } else ok('FDGE-R52', `${pt}: ${notasPlataforma} nota(s) de reanclaje en el issue #${enRegistroPT.issue} para PHASE ${fase}.`);
    } else {
    const bit = read(join(dir, 'bitacora.md'));
    const notas = bit === null ? 0 : (bit.match(RE_NOTA_BITACORA) ?? []).length;
    if (notas < fase - 1) {
      fail('FDGE-R52', `${pt}: está en PHASE ${fase} y su bitácora tiene ${notas} nota(s); faltan ${fase - 1 - notas}. Cada transición de fase deja tres líneas —qué cierras, dónde estás, qué sigue—: escribir obliga a releer, y releer no obliga a nada.`);
    } else ok('FDGE-R52', `${pt}: bitácora con ${notas} nota(s) para PHASE ${fase}.`);
    }
  }

  // SUITE-R43 · lo que una persona escribe en la plataforma se lee. Existe porque durante la
  // sesion que la motivo el agente escribio en nueve issues y no releyo ninguno.
  if (REGISTRO?.tracker?.plataforma && enRegistroPT?.issue) {
    const r = correTracker(['pendiente', pt]);
    const cod = Number(String(r.salida).trim().split(/\r?\n/).pop());
    if (r.codigo === 3) {
      warn('SUITE-R43', `${pt}: sin acceso a la plataforma, los comentarios del issue #${enRegistroPT.issue} quedan SIN EVALUAR.`);
    } else if (cod === 4) {
      warn('SUITE-R43', `${pt}: ningún comentario del issue #${enRegistroPT.issue} lleva marca de procedencia, así que no se puede distinguir quién escribió qué: SIN EVALUAR. Se resuelve solo en cuanto el agente escriba una nota (RULE-06).`);
    } else if (cod === 1) {
      fail('SUITE-R43', `${pt}: hay un comentario sin responder en el issue #${enRegistroPT.issue}, posterior a la última nota del agente. Lo que una persona se molestó en escribir se lee antes de avanzar de fase.`);
    } else if (cod === 0) {
      ok('SUITE-R43', `${pt}: sin comentarios pendientes en el issue #${enRegistroPT.issue}.`);
    }
  }

  const dor = intake.match(RE_DOR)?.[1]?.toUpperCase();
  if (!dor && !heredaDelLote) {
    fail('FDGE-R03', `${pt}: intake.md no registra el veredicto de G1 (VEREDICTO: PASS | FAIL | CHALLENGE).`);
  } else if (dor === 'FAIL') {
    fail('FDGE-R03', `${pt}: G1 dio FAIL. El PT no puede avanzar más allá de PHASE 1.`);
  } else if (dor === 'CHALLENGE' && !RE_DOR_OVERRIDE.test(intake)) {
    fail('FDGE-R03', `${pt}: G1 dio CHALLENGE sin resolución humana. Añade "CHALLENGE aceptado por: [nombre]" al intake.`);
  }

  if (!RE_SEVERITY.test(intake) && !heredaDelLote) {
    fail('FDGE-R04', `${pt}: intake.md no declara severity: S1..S4 (la declara el humano, INTAKE-R04).`);
  }
  if (track === 'HOTFIX' && intake.match(RE_SEVERITY)?.[1] !== 'S1') {
    fail('FDGE-R22', `${pt}: track HOTFIX solo es válido con severity S1.`);
  }

  // FDGE-R43 · un PT MAJOR no resuelve G2 con el grafo ausente o STALE
  const complexity = intake.match(RE_COMPLEXITY)?.[1];
  if (complexity === 'MAJOR' && GRAPH.state !== 'FRESH') {
    fail('FDGE-R43', `${pt}: es MAJOR y el grafo está ${GRAPH.state} (${GRAPH.reason}). Regenera el grafo sobre src/ antes de resolver G2.`);
  } else if (complexity === 'STANDARD' && GRAPH.state !== 'FRESH') {
    warn('FDGE-R43', `${pt}: STANDARD con grafo ${GRAPH.state}. Declara la limitación en context.md (FDGE-R08).`);
  }

  // ── INVESTIGATION: exenta de trazabilidad y manifiesto (FDGE-R10) ──────────
  if (type === 'INVESTIGATION') {
    const disc = read(join(dir, 'discovery.md'));
    // discovery.md lo produce PHASE 2 (2-B). Antes de eso su ausencia no es un defecto.
    if (disc === null && exigible('FDGE-R42', 2, 'discovery.md')) {
      fail('FDGE-R42', `${pt}: está en PHASE ${fase} y falta ${rel}/discovery.md, que produce PHASE 2.`);
    } else if (disc === null) {
      /* aviso ya emitido por exigible() */
    } else if (!/^##\s*Conclusi[óo]n/im.test(disc)) {
      fail('FDGE-R42', `${pt}: discovery.md no tiene sección "## Conclusión". Una investigación no cierra sin ella.`);
    } else ok('FDGE-R42', `${pt}: investigación con conclusión documentada.`);
    checkHistory(pt, rel, type, { gate });
    checkIndex(pt);
    checkAplazado(pt, rel, { gate });
    if (errors.length === errAt) ok('FDGE-R10', `${pt}: INVESTIGATION verificada (exenta de FDGE-R15 y FDGE-R23).`);
    return;
  }

  // ── FDGE-R15 · trazabilidad ───────────────────────────────────────────────
  const evDir = join(EVIDENCE, pt);
  const manifest = readJSON(join(evDir, 'manifest.json'));
  const afterPhase6 = manifest !== null && manifest !== undefined;

  const trace = read(join(dir, 'traceability.md'));
  let acs = [];
  // traceability.md lo produce PHASE 4. Sus COLUMNAS ya distinguian fase (Test y Evidencia
  // desde PHASE 6); lo que faltaba era distinguirla para la EXISTENCIA del archivo.
  if (trace === null && exigible('FDGE-R15', 4, 'traceability.md')) {
    fail('FDGE-R15', `${pt}: está en PHASE ${fase} y falta ${rel}/traceability.md, que produce PHASE 4. Sin matriz no hay trazabilidad AC → TS → test → evidencia.`);
  } else if (trace === null) {
    /* aviso ya emitido por exigible() */
  } else {
    const rows = parseTraceability(trace);
    if (!rows.length) fail('FDGE-R15', `${pt}: traceability.md no contiene ninguna fila AC-nn reconocible.`);
    acs = rows.map((r) => r.ac);
    const testExempt = type === 'CHORE' || track === 'EXPRESS';
    for (const r of rows) {
      // AC y TS se exigen desde PHASE 4.
      if (isEmptyCell(r.ts)) fail('FDGE-R15', `${pt}: ${r.ac} sin escenario de test (Orphan Criterion).`);
      // Test y Evidencia solo desde PHASE 6 — antes están legítimamente vacías.
      if (!afterPhase6) continue;
      if (isEmptyCell(r.test)) {
        if (testExempt) warn('FDGE-R18', `${pt}: ${r.ac} sin archivo de test — excepción FDGE-R18 (${type ?? track}). Debe estar declarada en strategy.md.`);
        else fail('FDGE-R15', `${pt}: ${r.ac} sin archivo de test (Orphan Criterion).`);
      }
      if (isEmptyCell(r.evidencia)) fail('FDGE-R15', `${pt}: ${r.ac} sin evidencia (Orphan Criterion).`);
    }
    if (rows.length && !afterPhase6) {
      ok('FDGE-R15', `${pt}: ${rows.length} criterios con TS asignado (Test/Evidencia se exigen desde PHASE 6).`);
    }
  }

  // ── FDGE-R23 · manifiesto de evidencia ────────────────────────────────────
  if (manifest === null) {
    if (gate) fail('FDGE-R23', `${pt}: falta evidence/${pt}/manifest.json. Sin manifiesto no hay PHASE 7.`);
    else warn('FDGE-R23', `${pt}: aún sin evidence/${pt}/manifest.json (normal antes de PHASE 6).`);
  } else if (manifest === undefined) {
    fail('FDGE-R23', `${pt}: manifest.json no es JSON válido.`);
  } else {
    const crit = manifest.criteria ?? [];
    if (!crit.length) fail('FDGE-R23', `${pt}: manifest.json no declara "criteria".`);
    for (const c of crit) {
      if (!c.evidence?.length) { fail('FDGE-R23', `${pt}: ${c.ac} no declara evidencia en el manifiesto.`); continue; }
      for (const e of c.evidence) {
        if (!existsSync(join(evDir, e))) {
          fail('FDGE-R23', `${pt}: ${c.ac} apunta a evidencia inexistente en disco: evidence/${pt}/${e}.`);
        }
      }
      if (c.verified === false) warn('FDGE-R23', `${pt}: ${c.ac} marcado verified:false.`);
    }
    const mAcs = crit.map((c) => c.ac);
    const onlyTrace = acs.filter((a) => !mAcs.includes(a));
    const onlyMan = mAcs.filter((a) => !acs.includes(a));
    if (onlyTrace.length) fail('FDGE-R15', `${pt}: en traceability.md pero no en manifest.json: ${onlyTrace.join(', ')}.`);
    if (onlyMan.length) fail('FDGE-R15', `${pt}: en manifest.json pero no en traceability.md: ${onlyMan.join(', ')}.`);
    if (manifest.suite?.failed > 0) fail('FDGE-R27', `${pt}: el manifiesto declara ${manifest.suite.failed} tests en fallo.`);
    if (manifest.suite?.baseline != null && manifest.suite.coverage < manifest.suite.baseline) {
      fail('FDGE-R27', `${pt}: la cobertura (${manifest.suite.coverage}) desciende respecto a la línea base (${manifest.suite.baseline}).`);
    }
  }

  scanEvidence(pt, dir);

  // ── FDGE-R25 · self-review ────────────────────────────────────────────────
  const sr = read(join(evDir, 'self-review.md'));
  if (sr === null) {
    if (gate || afterPhase6) fail('FDGE-R25', `${pt}: falta evidence/${pt}/self-review.md.`);
  } else if (/SELF_REVIEW_BLOCKERS_FOUND/.test(sr)) {
    fail('FDGE-R25', `${pt}: el self-review está en SELF_REVIEW_BLOCKERS_FOUND.`);
  } else ok('FDGE-R25', `${pt}: self-review completo.`);

  checkHistory(pt, rel, type, { gate });
  checkIndex(pt);
  checkAplazado(pt, rel, { gate });

  if (errors.length === errAt) ok('FDGE-R34', `${pt}: sin errores de cumplimiento.`);
}

// ─── FDGE-R29 · HISTORY.log ──────────────────────────────────────────────────
function checkHistory(pt, rel, type, { gate }) {
  const hist = read(join(IMPL, 'HISTORY.log')) ?? '';
  const entries = [...hist.matchAll(new RegExp(`^##\\s+${pt}\\s+—`, 'gm'))];
  const reverted = [...hist.matchAll(new RegExp(`^##\\s+${pt}\\s+—\\s+REVERTIDO`, 'gm'))];
  // PT-046 · FDGE-R29 · una entrada mal escrita se CORRIGE, no se edita.
  //
  // SUITE-R09 ya prescribia el mecanismo —«una entrada nueva que lo referencia»— y esta regla
  // lo cerraba: exactamente una entrada por PT, y esta comprobacion leia SIEMPRE la primera.
  // Tres reglas correctas por separado dejaban una entrada mal formada bloqueando G4 PARA
  // SIEMPRE, sin salida escrita. No es una excepcion nueva: es la segunda instancia del patron
  // que `reverted` ya usa —descontar por encabezado— y que FDGE-R36 ya obliga a aplicar.
  const corrige = [...hist.matchAll(new RegExp(`^##\\s+${pt}\\s+—\\s+CORRIGE`, 'gm'))];
  if (entries.length === 0) {
    if (gate) fail('FDGE-R29', `${pt}: sin entrada en HISTORY.log.`);
    else warn('FDGE-R29', `${pt}: aún sin entrada en HISTORY.log (se escribe en PHASE 8).`);
    return;
  }
  // Sin entrada original, una CORRIGE seria una via para declarar trabajo que nunca ocurrio.
  // Es el caso que hace que esta puerta no sea un agujero.
  if (corrige.length && entries.length - corrige.length - reverted.length === 0) {
    fail('FDGE-R29', `${pt}: hay ${corrige.length} entrada(s) «CORRIGE» y ninguna entrada original a la que se refieran. Una corrección completa a la entrada que corrige; sin ella declararía un trabajo del que no hay registro.`);
    return;
  }
  if (entries.length - reverted.length - corrige.length > 1) {
    fail('FDGE-R29', `${pt}: ${entries.length} entradas en HISTORY.log; se espera 1 más las de revert y las de corrección.`);
    return;
  }
  ok('FDGE-R29', `${pt}: registrado en HISTORY.log${corrige.length ? ` (con ${corrige.length} corrección(es))` : ''}.`);

  // El cuerpo de una entrada, desde su encabezado hasta el siguiente.
  //
  // Por `m.index` y NO por `hist.indexOf(m[0])`: dos correcciones del mismo PT pueden llevar el
  // mismo encabezado, y buscar por texto devuelve siempre la PRIMERA. Con eso, la segunda
  // corrección no tenía efecto y nadie sabría por qué. Lo dijo el caso de las dos correcciones;
  // leyendo el código no se ve, porque con una sola entrada las dos formas coinciden.
  const cuerpoDe = (m) => {
    const i = m.index;
    const n = hist.indexOf('\n## ', i + 1);
    return hist.slice(i, n === -1 ? undefined : n);
  };
  const original = entries.find((m) => !/\s+(?:CORRIGE|REVERTIDO)/.test(m[0])) ?? entries[0];
  const cuerpoOriginal = cuerpoDe(original);
  // La ULTIMA correccion, no la primera: corregir una correccion es legitimo y append-only.
  const cuerpoCorrige = corrige.length ? cuerpoDe(corrige[corrige.length - 1]) : null;
  // Un campo se lee de la correccion si lo declara, y de la original si no. Asi una CORRIGE que
  // solo arregla el «Estado:» no hace desaparecer el «Estructural:» de la original — corregir la
  // mitad y dejar la otra leyendose de la entrada vieja seria peor que no corregir.
  const campo = (re) => (cuerpoCorrige?.match(re)?.[1]) ?? cuerpoOriginal.match(re)?.[1];

  // FDGE-R44 · marcado estructural — es lo que hace computable FDGE-R43
  const estructural = campo(/^Estructural:\s*(sí|si|no)\s*$/im);
  if (estructural === undefined) {
    fail('FDGE-R44', `${pt}: HISTORY.log no declara «Estructural: sí | no». Sin ella la frescura del grafo no es computable.`);
  } else {
    // Decir DE DONDE sale no es adorno: si el campo viene de una correccion, quien lea la
    // salida tiene que poder saberlo sin abrir el ledger.
    const deLaCorreccion = /^Estructural:\s*(sí|si|no)\s*$/im.test(cuerpoCorrige ?? '');
    ok('FDGE-R44', `${pt}: declara «Estructural: ${estructural}»${deLaCorreccion ? ' en su corrección' : ''}.`);
  }

  if (gate !== 'G4') return;

  // SUITE-R35 · el espejo es precondicion de G4. La regla es HARD desde la 5.0.0, tenia
  // herramienta y NINGUNA compuerta la ejecutaba: se podia llegar hasta aqui sin que el trabajo
  // existiera en la plataforma. En G4 la credencial SI es exigible (FND-R30).
  if (REGISTRO?.tracker?.plataforma) {
    const r = correTracker(['espejo']);
    if (r.codigo === 1) {
      fail('SUITE-R35', `${pt}: el espejo con ${REGISTRO.tracker.plataforma} no cuadra. Lo que está abierto tiene que poder consultarse sin leer el repositorio entero.\n${r.salida.trim().split(/\r?\n/).filter((l) => l.includes('SUITE-R35')).map((l) => `        ${l.trim()}`).join('\n')}`);
    } else if (r.codigo === 3) {
      fail('SUITE-R35', `${pt}: hay plataforma declarada y no hay acceso desde aquí, así que el espejo no se pudo comprobar. En G4 la credencial es exigible — «gh auth login» (FND-R30).`);
    } else if (r.codigo === 0) {
      ok('SUITE-R35', `${pt}: el espejo con ${REGISTRO.tracker.plataforma} cuadra.`);
    }

    // SUITE-R42 · el merge se propone donde se pueda revisar. Se comprueba que el PR EXISTA;
    // ni se abre ni se fusiona. Sin plataforma declarada esta rama no se pisa.
    const p = correTracker(['pr']);
    if (p.codigo === 1) {
      fail('SUITE-R42', `${pt}: no hay pull request abierto para esta rama. G4 se resuelve sobre un PR.\n${p.salida.trim().split(/\r?\n/).filter((l) => l.includes('SUITE-R42')).map((l) => `        ${l.trim()}`).join('\n')}`);
    } else if (p.codigo === 3) {
      fail('SUITE-R42', `${pt}: hay plataforma declarada y no hay acceso, así que no se pudo comprobar el pull request. En G4 la credencial es exigible (FND-R30).`);
    } else if (p.codigo === 0) {
      ok('SUITE-R42', `${pt}: el merge se propone sobre un pull request abierto.`);
    }
  }

  // ── FDGE-R34 · precondiciones de la compuerta G4 ──────────────────────────
  const status = campo(/^Estado:\s*(\w+)/m);
  // El TIPO sale siempre de la entrada original: el encabezado de una correccion dice «CORRIGE»,
  // y tomarlo de ahi convertiria todo PT corregido en un tipo que no existe.
  const declaredType = type ?? cuerpoOriginal.match(/^##\s+\S+\s+—\s+(\w+):/m)?.[1];

  if (!status) {
    fail('FDGE-R34', `${pt}: la entrada de HISTORY.log no declara "Estado:". `
      + 'Si la entrada ya está escrita y es errónea, NO se edita (SUITE-R09): se añade una '
      + '«## ' + pt + ' — CORRIGE: …» con el campo bien puesto, y esta comprobación la prefiere.');
    return;
  }

  if (declaredType === 'INVESTIGATION') {
    if (status !== 'CLOSED') fail('FDGE-R27', `${pt}: una INVESTIGATION cierra en CLOSED, no en "${status}".`);
    return;
  }
  if (status !== 'DONE') {
    fail('FDGE-R34',
      `${pt}: estado "${status}". G4 exige DONE. ` +
      'CLOSED es POSTERIOR a INTEGRATED (LEXICON §5.1): exigirlo aquí sería un bloqueo circular.');
    return;
  }
  // Un BUG en DONE debe llevar la firma humana de G3 (FDGE-R26).
  if (declaredType === 'BUG') {
    const gates = (cuerpoCorrige?.match(/^Compuertas:.*$/m)?.[0]) ?? cuerpoOriginal.match(/^Compuertas:.*$/m)?.[0] ?? '';
    if (!/G3\s+\d{4}-\d{2}-\d{2}\s+\S+/.test(gates)) {
      fail('FDGE-R26',
        `${pt}: es un BUG en DONE sin firma humana de G3 en la línea "Compuertas:". ` +
        'Formato esperado: "G3 YYYY-MM-DD [nombre]". Sin ella es indistinguible de un auto-cierre.');
      return;
    }
    ok('FDGE-R26', `${pt}: BUG validado por un humano en G3.`);
  }
  ok('FDGE-R34', `${pt}: precondiciones de G4 satisfechas.`);
}

// ─── SUITE-R44 · cerrar un lote no borra lo que aplazó ───────────────────────
// Un lote de esta suite aplazó la corrección que lo había motivado y nadie la recogió en cuatro
// versiones: estaba escrita en tres documentos y en ninguna lista que una compuerta tocara.
//
// PT-018 · La primera versión ADIVINABA sobre prosa libre —una lista de palabras: «posterior»,
// «siguiente»— y tenía dos agujeros que salían de lo mismo: se le escapaba cualquier redacción
// nueva, y citar un identificador cualquiera la satisfacía aunque ese PT no cubriera nada.
//
// No se mejora el detector: se quita. El destino es VOCABULARIO CERRADO, como `PTSA-R77` exige
// en la matriz de auditoría — «no existe la celda en blanco: es indistinguible de una que nadie
// miró». Sin prosa no hay nada que adivinar.
const RE_SOLO_GUION = /^[-–—\s]*$/;
// PT-021 · los estados en los que el trabajo de un lote esta HECHO. DONE espera al humano en
// G4; CLOSED ya paso por el. Ninguno de los dos es una promesa. Esta aqui y no en linea porque
// SUITE-R38: un criterio que se repite escrito a mano diverge.
const LOTE_COMPLETO = new Set(['DONE', 'CLOSED']);
const RE_CITA_ID = /\b((?:PT|EP)-\d+)\b/;

function checkAplazado(pt, rel, { gate }) {
  const dir = ptDir(pt);
  const oos = dir ? read(join(dir, 'out-of-scope.md')) : null;
  if (oos === null) return;
  const yo = (REGISTRO?.allocations ?? []).find((a) => a?.id === pt);
  const problemas = [];

  for (const linea of oos.split(/\r?\n/)) {
    const t = linea.trim();
    if (!t.startsWith('|')) continue;
    const celdas = t.split('|').slice(1, -1).map((c) => c.trim());
    if (celdas.length < 3) continue;
    const destino = celdas[celdas.length - 1];
    if (/^[:\- ]+$/.test(destino) || /^Dónde va$/i.test(destino)) continue;   // separador o cabecera
    if (RE_SOLO_GUION.test(destino)) continue;                                 // no aplaza: declara

    const cita = destino.match(RE_CITA_ID)?.[1];
    if (!cita) {
      problemas.push(`«${celdas[0].slice(0, 44)}» → «${destino.slice(0, 34)}» no cita a nadie`);
      continue;
    }
    const dest = (REGISTRO?.allocations ?? []).find((a) => a?.id === cita);
    if (!dest) { problemas.push(`«${celdas[0].slice(0, 44)}» cita ${cita}, que no existe en el registro`); continue; }

    // Un hermano del mismo lote lo cubre ahí, cerrado o no: no está aplazado.
    if (dest.epic && yo?.epic && dest.epic === yo.epic) continue;
    // Citar el PROPIO lote vale cuando su trabajo esta COMPLETO. «Lo hara este lote» es la
    // promesa que fallo con la migracion del proyecto legado: mientras el lote sigue abierto no
    // es una asignacion, es una intencion.
    //
    // PT-021 · exigir CLOSED era un bloqueo por construccion. Un lote llega a CLOSED DESPUES
    // del merge, y el merge ES G4 — asi que el patron legitimo «esto se hace al cerrar el lote»
    // (la entrada de CHANGELOG, el numero de version) no podia satisfacer la regla NUNCA. Lo
    // encontro G4 de EP-004 bloqueando dos tareas por escribir lo que las otras tres callaron.
    //
    // DONE es el estado en el que el trabajo del lote esta hecho y solo espera al humano. Ahi
    // ya no es una promesa. DRAFT e IN_PROGRESS siguen bloqueando, que era la intencion.
    //
    // PT-022 · y ademas el lote tiene que DECLARARLO. Citarlo era gratis: apuntar al lote no
    // obligaba a nada, y por eso la misma obligacion acabo escrita en dos out-of-scope y
    // ausente en tres. Ahora apuntar al lote cuesta escribirlo EN el lote, una sola vez.
    if (dest.id === yo?.epic && LOTE_COMPLETO.has(dest.status)) {
      if (!loteDeclaraCierre(dest.id)) {
        problemas.push(`«${celdas[0].slice(0, 44)}» cita ${cita}, que no declara «## Cierre del lote» `
          + `en su intake: la cita apunta a un sitio donde no hay nada escrito (SUITE-R45)`);
      }
      continue;
    }

    // Si no, tiene que ser un aplazado que RECONOZCA de dónde viene. Citar no basta: sin
    // reciprocidad, apuntar a cualquier PT satisface la regla sin que nadie recoja nada.
    if (dest.status !== 'DEFERRED') {
      problemas.push(`«${celdas[0].slice(0, 44)}» cita ${cita}, que no está DEFERRED ni es hermano de este lote`);
    } else if (!String(dest.origin ?? '').includes(pt)) {
      problemas.push(`«${celdas[0].slice(0, 44)}» cita ${cita}, que está DEFERRED pero su «origin» no menciona ${pt}: la cita no es recíproca`);
    }
  }

  if (!problemas.length) return;
  const m = `${pt}: ${problemas.length} fila(s) de ${rel}/out-of-scope.md no declaran su destino con el vocabulario cerrado. `
    + 'O es «—» —no aplaza— o cita un identificador que lo sostiene: un hermano del lote, o una '
    + `allocation DEFERRED cuyo «origin» mencione ${pt}. Sin eso, aplazar es narrar. `
    + problemas.join(' · ');
  if (gate === 'G4') fail('SUITE-R44', m); else warn('SUITE-R44', m);
}

// ─── FDGE-R31 / LEX-R07 · índice de origen ───────────────────────────────────
function checkIndex(pt) {
  const idxFiles = ['DISCOVERY.md', 'ENRICHMENT.md', 'REFACTOR_SCOPE.md'];
  const idxHit = idxFiles.find((f) => (read(join(IMPL, f)) ?? '').includes(pt));
  if (!idxHit) {
    fail('FDGE-R31', `${pt}: no aparece en ningún índice (DISCOVERY / ENRICHMENT / REFACTOR_SCOPE). FPGE no podrá verlo.`);
    return;
  }
  const line = (read(join(IMPL, idxHit)) ?? '').split(/\r?\n/).find((l) => l.includes(pt)) ?? '';
  const legacy = LEGACY_STATES.find((st) => new RegExp(`\\b${st}\\b`).test(line));
  if (legacy) {
    fail('LEX-R07', `${pt}: estado derogado "${legacy}" en ${idxHit}. Ver la tabla de migración de LEXICON §5.4.`);
  } else if (!LIFECYCLE.some((st) => new RegExp(`\\b${st}\\b`).test(line))) {
    fail('LEX-R07', `${pt}: la línea de índice en ${idxHit} no usa un estado canónico: "${line.trim()}"`);
  } else {
    ok('FDGE-R31', `${pt}: presente en ${idxHit} con estado canónico.`);
  }
}

// ─── Descubrimiento de PTs ───────────────────────────────────────────────────
function allOpenPTs(reg) {
  // PT-013 · DEFERRED se une a los terminales AQUI: un aplazado no tiene intake ni ha recorrido
  // fases, y exigirselo seria un rojo permanente. Sigue siendo VIVO para el espejo (tracker),
  // que es lo que mantiene su issue abierto.
  const terminal = new Set(['CLOSED', 'REJECTED', 'REVERTED', 'DEFERRED']);
  const fromReg = (reg?.allocations ?? [])
    .filter((a) => /^PT-\d+$/.test(a.id ?? '') && !terminal.has(a.status))
    .map((a) => a.id);
  if (fromReg.length) return fromReg;
  if (!existsSync(CHANGES)) return [];
  return readdirSync(CHANGES)
    .filter((d) => /^PT-\d+/.test(d) && statSync(join(CHANGES, d)).isDirectory())
    .map((d) => d.match(/^PT-\d+/)[0]);
}

// ─── Main ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const gateIdx = argv.indexOf('--gate');
const gate = gateIdx >= 0 ? argv[gateIdx + 1] : null;
if (gateIdx >= 0 && !/^G[1-4]$/.test(gate ?? '')) {
  console.error('--gate espera G1, G2, G3 o G4.');
  process.exit(2);
}
const all = argv.includes('--all');
// Los PT son los argumentos posicionales, excluyendo el valor de --gate.
// Sin --gate, gateIdx es -1 y gateIdx+1 es 0: hay que excluir la comparación, no el índice 0.
const targets = argv.filter((a, i) => /^PT-\d+$/.test(a) && !(gateIdx >= 0 && i === gateIdx + 1));

console.log(`verify-fdge — cumplimiento mecánico de la Methodology Suite ${SUITE_VERSION ?? '(versión no determinada)'}\n`);

const reg = checkRegistry();
REGISTRO = reg;
checkFoundation();
checkCore();
checkIrreversibles(reg?.execution_mode ?? 'SUPERVISED');
checkImplementacion(reg);
checkEstado();
checkFirmas();
checkTerreno();
checkValor(existsSync(join(ROOT, 'docs', 'enterprise-documentation', '02-PRD.md')));
checkInstallLog();
checkReconciliation();
checkEpics();
GRAPH = graphState(reg);
if (GRAPH.state === 'FRESH') ok('FDGE-R43', `Grafo FRESH — ${GRAPH.reason}.`);
else warn('FDGE-R43', `Grafo ${GRAPH.state} — ${GRAPH.reason}. Bloquea G2 en PTs MAJOR.`);

const pts = all ? allOpenPTs(reg) : [...new Set(targets)];
if (!pts.length && !all) {
  console.log('Uso: node verify-fdge.mjs PT-042 | --all | --gate G4 PT-042\n');
}
for (const pt of pts) checkPT(pt, { gate });

// ─── Informe ─────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
if (passed.length) {
  console.log('PASA');
  for (const p of passed) console.log(`  ✓ ${pad(p.rule, 14)} ${p.msg}`);
  console.log('');
}
if (warnings.length) {
  console.log('AVISOS');
  for (const w of warnings) console.log(`  ! ${pad(w.rule, 14)} ${w.msg}`);
  console.log('');
}
if (errors.length) {
  console.log('ERRORES');
  for (const e of errors) console.log(`  ✗ ${pad(e.rule, 14)} ${e.msg}`);
  console.log('');
  console.log(`${errors.length} error(es).${gate ? ` La compuerta ${gate} queda bloqueada.` : ''}`);
  process.exit(1);
}
console.log(`Sin errores. PTs verificados: ${pts.length}.`);
process.exit(0);
