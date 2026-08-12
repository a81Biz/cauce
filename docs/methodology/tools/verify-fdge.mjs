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
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
// TERCER sitio donde se sella, y el que se quedo atras: build-core y verify-suite pasaron a
// hashear contenido NORMALIZADO —git entrega LF en Linux y CRLF en Windows— y este siguio con
// bytes crudos. Resultado: el nucleo estaba bien y verify-fdge lo declaraba desincronizado.
// Tres copias de la misma formula es una copia de mas; queda anotado para cuando haya una sola.
const selloDe = (txt) => createHash('sha1').update(txt.split(/\r?\n/).join('\n')).digest('hex').slice(0, 12);
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const IMPL = join(ROOT, 'docs', 'implementation');
const CHANGES = join(ROOT, 'changes');
const EVIDENCE = join(IMPL, 'evidence');
const ED = join(ROOT, 'docs', 'enterprise-documentation');

const errors = [];
const warnings = [];
const passed = [];
let GRAPH = { state: 'UNKNOWN', reason: 'sin evaluar' };
const SUITE_VERSION = '4.14.0';

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
  if (reg.suite_version && reg.suite_version !== SUITE_VERSION) {
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
    const falta = [];
    if (!/Objetivo com[úu]n/i.test(txt)) falta.push('objetivo común');
    if (!/Criterio de [ée]xito del lote/i.test(txt)) falta.push('criterio de éxito del lote');
    if (!/OUT:|Qu[ée] NO entra/i.test(txt)) falta.push('out-of-scope');
    if (!/solapamiento/i.test(txt)) falta.push('análisis de solapamiento');
    if (!RE_SIGN_BLOCK.test(txt) && !/Firma [úu]nica/i.test(txt)) falta.push('bloque de firma');
    if (falta.length) { fail('INTAKE-R09', `${ep}: intake del lote incompleto — falta: ${falta.join(' · ')}.`); continue; }
    // Todo PT del lote debe llevar «Firmado por lote: EP-NNN» (INTAKE-R08)
    const pts = [...txt.matchAll(/PT-\d+/g)].map((m) => m[0]);
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
    if (disc === null) fail('FDGE-R42', `${pt}: falta ${rel}/discovery.md.`);
    else if (!/^##\s*Conclusi[óo]n/im.test(disc)) {
      fail('FDGE-R42', `${pt}: discovery.md no tiene sección "## Conclusión". Una investigación no cierra sin ella.`);
    } else ok('FDGE-R42', `${pt}: investigación con conclusión documentada.`);
    checkHistory(pt, rel, type, { gate });
    checkIndex(pt);
    if (errors.length === errAt) ok('FDGE-R10', `${pt}: INVESTIGATION verificada (exenta de FDGE-R15 y FDGE-R23).`);
    return;
  }

  // ── FDGE-R15 · trazabilidad ───────────────────────────────────────────────
  const evDir = join(EVIDENCE, pt);
  const manifest = readJSON(join(evDir, 'manifest.json'));
  const afterPhase6 = manifest !== null && manifest !== undefined;

  const trace = read(join(dir, 'traceability.md'));
  let acs = [];
  if (trace === null) {
    fail('FDGE-R15', `${pt}: falta ${rel}/traceability.md. Sin matriz no hay trazabilidad AC → TS → test → evidencia.`);
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

  if (errors.length === errAt) ok('FDGE-R34', `${pt}: sin errores de cumplimiento.`);
}

// ─── FDGE-R29 · HISTORY.log ──────────────────────────────────────────────────
function checkHistory(pt, rel, type, { gate }) {
  const hist = read(join(IMPL, 'HISTORY.log')) ?? '';
  const entries = [...hist.matchAll(new RegExp(`^##\\s+${pt}\\s+—`, 'gm'))];
  const reverted = [...hist.matchAll(new RegExp(`^##\\s+${pt}\\s+—\\s+REVERTIDO`, 'gm'))];
  if (entries.length === 0) {
    if (gate) fail('FDGE-R29', `${pt}: sin entrada en HISTORY.log.`);
    else warn('FDGE-R29', `${pt}: aún sin entrada en HISTORY.log (se escribe en PHASE 8).`);
    return;
  }
  if (entries.length - reverted.length > 1) {
    fail('FDGE-R29', `${pt}: ${entries.length} entradas en HISTORY.log; se espera 1 más las de revert.`);
    return;
  }
  ok('FDGE-R29', `${pt}: registrado en HISTORY.log.`);

  // FDGE-R44 · marcado estructural — es lo que hace computable FDGE-R43
  const i0 = hist.indexOf(entries[0][0]);
  const nx = hist.indexOf('\n## ', i0 + 1);
  const body = hist.slice(i0, nx === -1 ? undefined : nx);
  if (!/^Estructural:\s*(sí|si|no)\s*$/im.test(body)) {
    fail('FDGE-R44', `${pt}: HISTORY.log no declara «Estructural: sí | no». Sin ella la frescura del grafo no es computable.`);
  }

  if (gate !== 'G4') return;

  // ── FDGE-R34 · precondiciones de la compuerta G4 ──────────────────────────
  const idx = hist.indexOf(entries[0][0]);
  const next = hist.indexOf('\n## ', idx + 1);
  const entry = hist.slice(idx, next === -1 ? undefined : next);
  const status = entry.match(/^Estado:\s*(\w+)/m)?.[1];
  const declaredType = type ?? entry.match(/^##\s+\S+\s+—\s+(\w+):/m)?.[1];

  if (!status) { fail('FDGE-R34', `${pt}: la entrada de HISTORY.log no declara "Estado:".`); return; }

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
    const gates = entry.match(/^Compuertas:.*$/m)?.[0] ?? '';
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
  const terminal = new Set(['CLOSED', 'REJECTED', 'REVERTED']);
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

console.log('verify-fdge — cumplimiento mecánico de la Methodology Suite 4.14.0\n');

const reg = checkRegistry();
checkFoundation();
checkCore();
checkIrreversibles(reg?.execution_mode ?? 'SUPERVISED');
checkImplementacion(reg);
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
