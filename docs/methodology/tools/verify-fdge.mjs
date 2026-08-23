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
 *   node verify-fdge.mjs --all -q            silencia la ENUMERACIÓN del verde, no el recuento
 *   node verify-fdge.mjs --gate G4 EP-017    las precondiciones de G4 de UN LOTE
 *   node verify-fdge.mjs --gate G1 PT-042    solo las precondiciones de G1
 *   node verify-fdge.mjs --gate G2 PT-042    ídem G2 · --gate G3 · --gate G4
 *
 * Cada compuerta exige lo que existe cuando ella cierra, no lo de la siguiente: `manifest.json`
 * y `self-review.md` se escriben en PHASE 6, así que los pide `G3` en adelante; la entrada de
 * `HISTORY.log` se escribe en PHASE 8 y solo la pide `G4`. La tabla está en `patrones.mjs`
 * (`EXIGIBLE_DESDE`), con la fase al lado del valor para que sea derivable.
 *
 * Hasta PT-029 esta cabecera solo enseñaba `--gate G4`, y las tres comprobaciones de arriba
 * decían `if (gate)` sin distinguir cuál: `G1`, `G2` y `G3` heredaban las exigencias de `G4` y
 * NO SE PODÍAN EVALUAR. La ruta indocumentada y la ruta rota eran la misma, que es por lo que
 * llevaba así desde que existe el parámetro.
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
import { selloDe, PATRONES, ESTADOS_TERMINALES, exigibleEn,
         lineasPerdidas, mergesSinConstancia } from './patrones.mjs';
// PT-095 · el criterio de «esto anuncia una autorizacion» y la frontera desde la que una regla
// alcanza. Los dos viven en patrones.mjs porque los usan dos bucles de este archivo, y un
// criterio escrito dos veces diverge (SUITE-R38).
import { anunciaAutorizacion, alcanzadaPor, corregidaDespues, RIGE_DESDE, MOTIVOS_DE_PARADA } from './patrones.mjs';
// PT-098 · la decision de si el arbol sostiene un INTEGRATED es pura y vive en tracker.mjs,
// junto al mecanismo que la calcula. Aqui solo se consume: una fuente, no dos (SUITE-R38).
import { estadoContrastado, FASES } from './tracker.mjs';
// PT-100 · LEX-R27 · un lote se reconoce por su ID. El helper vive en patrones.mjs desde PT-096
// y aqui quedaban SEIS sitios preguntando por «type», que el registro escribe de tres formas.
import { CLASE, CAR, esLote } from './patrones.mjs';
// PT-056 · la correspondencia se define UNA vez y aqui se USA (SUITE-R38): dos copias del
// criterio divergirian, y la que divergiera seria la que decide si el estado es de fiar.
import { estadoDelArbol } from './tracker.mjs';
// PT-062 · los rangos reservados
import { solapes, seSolapan, ramaLlevaUsuario } from './patrones.mjs';
// PT-081 · cada regla sabe desde que VERSION rige. Habia UNA constante para tres reglas
// nacidas en versiones distintas, y la mas nueva heredaba una fecha de dos meses antes.
import { rigeDesde } from './patrones.mjs';
// PT-085 · el estado retomable se contrasta con el registro, y la deuda de sellado se acota.
import { contradiceElRegistro, sinSellar, selladoEnTag, topologiaDeRamas, selloSinResolver, derivaDelGrafo, DOCUMENTOS_DE_ENTRADA,
         rutaRelativaDelManifiesto } from './patrones.mjs';
// PT-091 · las cifras del inventario se derivan, no se transcriben.
import { cifrasTranscritas, cifrasQueMienten, recuentosDeClaude } from './patrones.mjs';

const ROOT = process.cwd();
const IMPL = join(ROOT, 'docs', 'implementation');
const CHANGES = join(ROOT, 'changes');
let TOPOLOGIA_REPORTADA = false;   // PT-129 · la topologia es del REPOSITORIO, no de cada PT
let BACKLOG_REPORTADO = false;     // PT-123 · el indice es del REPOSITORIO, no de cada PT
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
// PT-109 · INC-010 · UNA COMPUERTA NO ES UNA REVISION SORPRESA.
//
// CINCO reglas cambian de severidad segun la compuerta: avisan en una corrida normal y FALLAN en
// «--gate G4» o «--gate G2». Eso esta BIEN —una precondicion de merge es mas estricta que una
// revision de paso— y a la vez producia el defecto que la calculadora registro: quien corre
// verify-fdge sin compuerta ve AVISOS, cree que va bien, y al llegar a la compuerta se encuentra
// rojos que llevaban ahi desde el principio.
//
// El arreglo NO es igualar las severidades —seria endurecer cada revision de paso hasta hacerla
// inutil, o ablandar G4—. Es DECIRLO: que el aviso nombre la compuerta en la que se convierte en
// error. Un aviso que no dice en que se va a convertir es una sorpresa aplazada.
const AVISA_AHORA_FALLA_EN = {
  'SUITE-R35': 'G4', 'FDGE-R19': 'G4', 'FDGE-R52': 'G4', 'FDGE-R54': 'G2',
};
const warn = (rule, msg) => warnings.push({
  rule,
  msg: AVISA_AHORA_FALLA_EN[rule] ? `${msg} · AVISO AHORA, ERROR EN ${AVISA_AHORA_FALLA_EN[rule]}.` : msg,
});
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
// PT-044 · el estado que el intake dice de sí mismo, para poder compararlo con el registro.
const RE_STATUS_YAML = /^\s*status\s*:\s*([A-Z_]+)/im;
const RE_SIGN_BATCH = /Firmado\s+por\s+lote:\s*(EP-\d+)/i;
const RE_DOR = /(?:^|\n)\s*(?:VEREDICTO|DoR)\s*:\s*(PASS|FAIL|CHALLENGE)\b/i;
const RE_DOR_OVERRIDE = /CHALLENGE\s+aceptado\s+por:\s*(?!\[)(\S.*)$/im;
// PT-083 · el `$` exigia fin de linea inmediatamente despues de S2, y las plantillas que EL
// PAQUETE DISTRIBUYE traen «severity: S2               # [HUMANO] S1 | S2 | S3 | S4». Quien
// instala el paquete, copia su plantilla y la rellena, fallaba FDGE-R04 — y es el camino que el
// MANUAL describe, no un caso raro.
//
// Los otros cinco campos del YAML ya toleraban el comentario: type y track cierran con ,
// phase y status con nada. Severity era el UNICO incoherente con sus vecinos, asi que no habia
// forma de que quien rellena lo adivinara. Se arregla quien lee, no las plantillas: los
// comentarios en linea son utiles —dicen quien rellena que— y quitarlos empeoraria la plantilla
// para acallar al verificador.
//
// Sigue rechazando lo invalido: `severity: S9` y `severity:` vacio no casan.
const RE_SEVERITY = /^\s*severity:\s*(S[1-4])\s*(?:#.*)?$/im;
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
// PT-055 · los lotes que esta ejecucion evalua. Vacio = todos. Ver el calculo en Main.
let LOTES_EVALUADOS = new Set();
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
  // PT-090 · MISSING era un BLOQUEO MUDO: en un clon limpio —CI incluida— el directorio nunca
  // existe, porque «.gitignore» lo excluye. La comprobacion no bloqueaba «a veces»: no llegaba
  // a evaluarse NUNCA fuera de la maquina que genero el grafo, y decia «Bloquea G2» como si si.
  //
  // Ahora dice lo que pasa: NO EVALUABLE AQUI. Es honesto, y no es lo mismo que comprobarlo —
  // eso solo lo cerraria versionar el grafo o generarlo en CI, y las dos son decisiones de
  // alcance que PT-090 no toma.
  if (!existsSync(join(ROOT, 'graphify-out'))) {
    return { state: 'MISSING', reason: 'no existe graphify-out/ en este clon — el directorio está en .gitignore, así que la frescura NO ES EVALUABLE aquí. No es lo mismo que estar desactualizado' };
  }
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

  // PT-085 · E · lo estructural ya se miró arriba; ahora la DERIVA DE CONTENIDO.
  //
  // «structural: true» sólo marca crear, mover, renombrar o eliminar. En todo el registro UNA
  // allocation lo tenía, así que ocho funciones nuevas y tres herramientas cambiadas dejaban el
  // grafo FRESH — con 12 de sus 16 archivos ya distintos, y respondiendo que patrones.mjs tiene
  // 2 importadores cuando tiene 8. Un proxy en vez del hecho, igual que SUITE-R34.
  //
  // El dato ya estaba en graphify-out/manifest.json. Nadie lo consultaba.
  //
  // SUSPECT AVISA Y NO BLOQUEA, y es deliberado: como casi toda tarea toca un archivo, bloquear
  // aquí dejaría G2 cerrada en todos los MAJOR de forma permanente — y una comprobación que
  // siempre bloquea se desactiva. STALE bloqueante sigue reservado a lo estructural.
  const man = (() => { try { return JSON.parse(readFileSync(join(ROOT, 'graphify-out', 'manifest.json'), 'utf8')); } catch { return null; } })();
  // PT-090 · el manifiesto guarda «ast_hash» junto al «mtime», y esta llamada usaba el mtime.
  // «git clone» los reescribe con la fecha del clon, asi que los 17 archivos salian cambiados
  // aunque el contenido fuera identico — y dos commit seguidos tambien. Paso DOS VECES en este
  // lote, la ultima con 6 de 17 por una normalizacion de CRLF.
  //
  // Y las rutas del manifiesto son ABSOLUTAS, asi que se relativizan a la raiz: sin eso, el
  // manifiesto solo sirve en un disco donde el proyecto este exactamente en esa ruta.
  const deriva = derivaDelGrafo(man, (ruta, usaMtime) => {
    const rel = rutaRelativaDelManifiesto(ruta, ROOT);
    const f = join(ROOT, rel);
    if (!existsSync(f)) return null;
    if (usaMtime) { try { return statSync(f).mtimeMs / 1000; } catch { return null; } }
    // La huella se calcula sobre BYTES CRUDOS, porque es lo que graphify guarda en «ast_hash».
    //
    // La primera version normalizaba el retorno de carro para que un checkout con CRLF y otro
    // con LF dieran el mismo hash. Sonaba bien y estaba MAL: el hash normalizado no casa con el
    // asi que los archivos con CRLF salian cambiados SIEMPRE — 6 de 17, tambien recien
    // regenerado el grafo. Y parecia correcto porque esos 6 eran justo los que yo habia editado:
    // tienen CRLF porque git los deja asi al escribirlos en Windows.
    //
    // Medido: 11 de 17 casaban con el hash normalizado y los 6 restantes casaban con el CRUDO.
    //
    // El caso CRLF-vs-LF que la normalizacion pretendia cubrir NO EXISTE hoy: «graphify-out/»
    // esta en .gitignore, asi que el manifiesto nunca viaja entre maquinas — se regenera en cada
    // una junto a los archivos que describe. Si algun dia se versiona, vuelve a importar, y eso
    // es lo que TD-17 sigue rastreando.
    try { return createHash('md5').update(readFileSync(f)).digest('hex'); } catch { return null; }
  });
  if (deriva && deriva.length) {
    // La muestra en ruta RELATIVA: el manifiesto guarda absolutas y un mensaje con
    // «C:\DevOps\…» cuatro veces no se lee, ademas de decir donde vive el disco de quien lo
    // genero. Es el mismo material que H-001 saco del tarball.
    const muestra = deriva.slice(0, 6)
      .map((r) => rutaRelativaDelManifiesto(r.replace(' (no existe)', ''), ROOT))
      .join(', ');
    return {
      state: 'SUSPECT',
      reason: `${deriva.length} de ${Object.keys(man).length} archivos que describe han cambiado desde ${g.generated}`
        + ` — ${muestra}${deriva.length > 6 ? ' …' : ''}`,
    };
  }
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
// PT-059 · BLOCKED_BY_CONTEXT es VIVO, no terminal: la tarea esta lista y el momento no.
const VIVOS = new Set(['DRAFT', 'READY', 'REOPENED', 'IN_PROGRESS', 'BLOCKED', 'BLOCKED_BY_CONTEXT', 'BLOCKED_DOMAIN']);
// LEX-R26 · el checkpoint declara un SHA, y ese SHA tiene que EXISTIR.
//
// PT-052 · Un checkpoint que apunta a un commit inexistente miente CON LA AUTORIDAD DE UN DATO
// ESTRUCTURADO: el que no existe se nota, el que miente no. Se comprueba que sea ALCANZABLE, no
// que tenga forma de SHA — la forma la cumple cualquier cadena de cuarenta hexadecimales.
//
// PT-056 · Y ademas el arbol tiene que CORRESPONDER: STATE_MISMATCH.
//
// Alcanzable impide la averia obvia —apuntar a nada— y NO impide la peligrosa: un SHA real que
// describe un arbol que ya no existe. Ese pasa la comprobacion anterior entera. Solo `sha` y
// `rama` se contrastan: la lista de archivos cambia mientras se trabaja (medido: de 3 a 5 con el
// sha intacto), y un criterio que salta siempre no se lee el dia que es cierto.
// PT-062 · SUITE-R08 · los rangos reservados.
//
// Las dos comprobaciones solo corren SI HAY RANGOS declarados: sin ellos no hay nada que
// comprobar, y exigirlos seria imponer trabajo a un proyecto de una persona.
function checkRangos() {
  const personas = REGISTRO?.personas ?? [];
  const conRango = personas.filter((p) => p?.rango && Object.keys(p.rango).length);
  if (!conRango.length) return;

  const prefijos = [...new Set(conRango.flatMap((p) => Object.keys(p.rango)))];
  for (const pre of prefijos) {
    // Solapados son PEORES que ninguno: dan confianza sin darla, y la colision aparece cuando ya
    // hay trabajo hecho. Se comprueba AQUI y no solo al asignar, para que se vea aunque nadie
    // asigne ese dia.
    for (const s of solapes(personas, pre)) {
      fail('SUITE-R08', `rangos ${pre} SOLAPADOS: «${s.a}» [${s.rangoA.join('-')}] y «${s.b}» `
        + `[${s.rangoB.join('-')}] comparten numeros. Tocarse por un extremo ya es solaparse: `
        + 'ese numero es el que las dos personas pediran a la vez.');
    }
    // Y esto cubre lo que la accion NO puede impedir: alguien asigna a mano —como se hizo hasta
    // PT-062— y se salta su rango. La accion no lo ve; esto si, y antes de cualquier compuerta.
    const rangos = conRango.filter((p) => Array.isArray(p.rango[pre])).map((p) => p.rango[pre]);
    for (const a of REGISTRO?.allocations ?? []) {
      const m = String(a?.id ?? '').match(new RegExp(`^${pre}-(\\d+)$`));
      if (!m) continue;
      const n = Number(m[1]);
      if (!rangos.some((r) => n >= r[0] && n <= r[1])) {
        fail('SUITE-R08', `${a.id} esta fuera de todos los rangos ${pre} declarados `
          + `(${rangos.map((r) => `[${r.join('-')}]`).join(' ')}). O se asigno a mano saltandose `
          + 'un rango, o falta ampliar el de alguien: el registro asigna, y tiene que poder decir '
          + 'de quien es cada numero.');
      }
    }
  }
}

function checkCheckpoint() {
  const f = join(IMPL, 'CHECKPOINT.json');
  if (!existsSync(f)) return;                       // no tenerlo no es un defecto: aun no toca
  let cp;
  try { cp = JSON.parse(read(f) ?? ''); }
  catch { fail('LEX-R26', 'CHECKPOINT.json no es JSON valido: un estado ilegible es peor que ninguno.'); return; }
  const falta = ['pt', 'phase', 'sha'].filter((k) => cp?.[k] === undefined);
  if (falta.length) {
    fail('LEX-R26', `CHECKPOINT.json no declara: ${falta.join(', ')}. Sin eso no dice de que tarea es ni sobre que codigo.`);
    return;
  }
  if (cp.sha === null) { warn('LEX-R26', 'CHECKPOINT.json declara «sha: null»: se genero sin git y lo DICE (RULE-06).'); return; }
  try {
    execFileSync('git', ['cat-file', '-e', `${cp.sha}^{commit}`], { cwd: ROOT, stdio: 'pipe' });
  } catch {
    fail('LEX-R26', `CHECKPOINT.json declara el commit ${String(cp.sha).slice(0, 8)}, que NO existe en este repositorio. `
      + 'Un checkpoint que apunta a nada miente con la autoridad de un dato estructurado.');
    return;
  }
  // PT-056 · STATE_MISMATCH. Se deriva del mismo git, no del checkpoint: contrastar un archivo
  // consigo mismo no comprueba nada.
  const real = (args) => {
    try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim(); }
    catch { return null; }
  };
  // Un checkpoint cuyo commit es ANTECESOR del actual va por detras, no miente: entre dos
  // transiciones de fase hay varios commits, y exigir igualdad haria fallar CI despues de cada uno.
  let desc = null;
  try { execFileSync('git', ['merge-base', '--is-ancestor', cp.sha, 'HEAD'], { cwd: ROOT, stdio: 'pipe' }); desc = true; }
  catch (err) { desc = err?.status === 1 ? false : null; }
  const e = estadoDelArbol(cp, {
    sha: real(['rev-parse', 'HEAD']),
    rama: real(['rev-parse', '--abbrev-ref', 'HEAD']),
    descendiente: desc,
  });
  // PT-094 · TRES resultados, no dos. `corresponde: null` es «no hay nada que contrastar», y
  // decirlo como si fuera «corresponde» seria afirmar mas de lo que se sabe — lo mismo que
  // PT-089 corrigio para MISSING.
  if (e.corresponde === null) {
    ok('LEX-R26', `CHECKPOINT.json: ${e.motivo ?? 'no hay nada que contrastar'} NO ESTABLECE que el arbol sea el bueno.`);
    return;
  }
  if (e.corresponde === false) {
    // Acortar SOLO lo que parece un SHA. `slice(0, 7)` a secas dejaba «chore/O» donde decia
    // «chore/OTRA-RAMA»: un mensaje que trunca el dato por el que se detiene no sirve de nada.
    const corto = (s) => (/^[0-9a-f]{40}$/.test(String(s)) ? String(s).slice(0, 7) : String(s));
    const d = e.discrepancias.map((x) => `${x.campo}: declarado ${corto(x.declarado)}, real ${corto(x.real)}`);
    fail('LEX-R26', `CHECKPOINT.json de ${cp.pt} NO corresponde al arbol (STATE_MISMATCH) — ${d.join(' · ')}. `
      + 'El commit existe, pero el trabajo va por otro sitio: decidir cual manda es humano (SUITE-R06). '
      + `Si el arbol es el bueno:  tracker checkpoint ${cp.pt}`);
    return;
  }
  // PT-094 · AC-06 · el limite viaja en el mensaje. `actions/checkout` deja detached HEAD en cada
  // `pull_request`, y ahi la rama no se puede leer: la comprobacion es CIEGA justo donde todos los
  // PR la ejecutan, y solo abre los ojos en el push a la principal — donde ya no hay PR que
  // bloquear. Vivia en un comentario, que es donde solo lo ve quien no lo necesita.
  const ciego = real(['rev-parse', '--abbrev-ref', 'HEAD']) === 'HEAD'
    ? ' En detached HEAD —lo que deja actions/checkout en un pull_request— la rama NO se pudo leer: esta corrida NO establece que la rama corresponda.'
    : '';
  ok('LEX-R26', `CHECKPOINT.json: ${cp.pt} en PHASE ${cp.phase}, sobre un commit alcanzable y con el arbol correspondiente.${ciego}`);
}

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
  const faltan = CAMPOS_ESTADO.filter((c) => !new RegExp('^' + CLASE.espacio + '*' + c + CLASE.espacio + '*:', 'im').test(cuerpo));
  if (faltan.length) {
    fail('SUITE-R33', `El bloque ESTADO no declara: ${faltan.join(', ')}. El orden es fijo a propósito: se lee siempre igual y por eso se lee entero.`);
  }
  const vacios = CAMPOS_ESTADO.filter((c) => {
    const v = cuerpo.match(new RegExp('^' + CLASE.espacio + '*' + c + CLASE.espacio + '*:[ ' + CAR.TAB + ']*(.*)$', 'im'))?.[1]?.trim();
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

  // PT-085 · A · y ahora lo que la fecha no puede decir: que el bloque sea VERDAD.
  //
  // Comparar marcas de commit verifica la frescura del ARCHIVO, no la de su contenido: un
  // handoff obsoleto pero recién tocado pasaba. Durante EP-017 el bloque declaró «EP-016
  // CERRADA · lo siguiente es EP-017, PROPUESTA y no abierta» con nueve tareas ya integradas.
  //
  // El criterio es la CONTRADICCIÓN, no la omisión: se falla cuando el texto afirma algo que el
  // registro desmiente. Exigir exhaustividad convertiría el bloque en un volcado del registro
  // —dos fuentes del mismo hecho— y el handoff existe para lo que el registro NO puede decir.
  const contra = contradiceElRegistro(cuerpo, REGISTRO?.allocations ?? []);
  for (const c of contra) {
    fail('SUITE-R34', `El bloque ESTADO contradice al registro: ${c}. El estado retomable que miente es peor que el que falta — se actúa sobre él.`);
  }
  if (!contra.length && tEstado) {
    ok('SUITE-R34', 'El bloque ESTADO no contradice al registro.');
  }
  // Lo NO derivable se declara, no se finge verificado (AC-03).
  if (!/^\s*decisiones:/im.test(cuerpo) || !/^\s*no hacer:/im.test(cuerpo)) {
    warn('SUITE-R33', 'El bloque ESTADO no trae «decisiones» o «no hacer». Son lo ÚNICO del estado que no se deriva de nada, y por eso nadie las verifica: lo que digan es responsabilidad de quien las escribe.');
  }
}

function checkImplementacion(reg) {
  const all = Array.isArray(reg?.allocations) ? reg.allocations : [];
  const abiertas = all.filter((a) => esLote(a) && a?.status === 'IN_PROGRESS');
  if (abiertas.length > 1) {
    fail('FDGE-R48', `${abiertas.length} implementaciones abiertas a la vez (${abiertas.map((a) => a.id).join(', ')}). Con dos, «esto es lo mismo» deja de tener respuesta y el default de FDGE-R49 no significa nada. Cierra una antes de abrir otra.`);
    return;
  }
  if (!abiertas.length) { ok('FDGE-R48', 'Sin implementación abierta.'); return; }
  const abierta = abiertas[0];
  ok('FDGE-R48', `${abierta.id} es la única implementación abierta.`);
  // Default invertido: con una abierta, todo PT vivo le pertenece. La excepcion es HOTFIX,
  // porque produccion caida no espera a que se cierre nada.
  const huerfanos = all.filter((a) => a?.type && !esLote(a) && VIVOS.has(a?.status)
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
// PT-088 · `rige` GLOBAL. El de checkPT usa la version DEL PT —es lo correcto para una
// comprobacion por tarea—, pero SUITE-R09 y EXEC-R04 son del REPOSITORIO: no hay tarea de la
// que sacar la version. Se toma del registro, que es quien la declara (SUITE-R13).
//
// Escribir estas dos con el `rige` de checkPT reventaba —ese identificador no existe a nivel
// de modulo— y mi propio grep sobre la salida lo escondio: filtrar antes de mirar es la
// version de consola del patron que PT-087 cierra.
const rigeGlobal = (id) => rigeDesde(id, reg?.suite_version ?? '0.0.0');

// ─── FND-R14 · las cifras del inventario describen el arbol ─────────────────
//
// PT-091 · H-007. services.md se genero el 2026-08-19 y OCHO de sus dieciseis cifras ya no
// describian el arbol un dia despues. Durante EP-018 las distancias habian CRECIDO: 3541
// documentado contra 4919 reales.
//
// PTSA-R76 obliga a construir el universo auditable DESDE el inventario. Un inventario que
// envejece en un dia convierte la fuente mecanica de la auditoria en una fuente de memoria — y
// en PTSA-2026-08-20 no llego a estropear nada solo porque el auditor enumero contra «ls», que
// fue una decision suya y no una propiedad del marco.
//
// QUE ESTABLECE: que cada cifra transcrita coincide con la derivada del arbol.
// QUE NO ESTABLECE: que la DESCRIPCION en prosa sea cierta. Que services.md diga bien cuantas
//   lineas tiene tracker.mjs no dice nada sobre si describe bien lo que hace.
//
// AVISA y no bloquea: el inventario lo escribe Foundation y una cifra desviada no apaga
// ninguna comprobacion — al reves que SUITE-R35, donde SI las apagaba (PT-089). Y hay un
// comando que lo arregla: «tracker inventario --aplicar».
const F_SERV = join(ED, 'inventory', 'services.md');
const DIR_T = join(ROOT, 'docs', 'methodology', 'tools');
function checkInventario() {
  if (!existsSync(F_SERV) || !existsSync(DIR_T)) return;
  const transcritas = cifrasTranscritas(read(F_SERV) ?? '');
  if (!transcritas.length) return;
  const mal = cifrasQueMienten(transcritas, (h) => {
    const f = join(DIR_T, h);
    if (!existsSync(f)) return null;
    try { return readFileSync(f, 'utf8').split(RE_LINEA).length - 1; } catch { return null; }
  });
  if (mal.length) {
    const muestra = mal.slice(0, 4)
      .map((m) => `${m.herramienta} ${m.lineas}→${m.real ?? 'no existe'}`).join(', ');
    warn('FND-R14', `${mal.length} de ${transcritas.length} cifras de inventory/services.md ya no describen el árbol — ${muestra}${mal.length > 4 ? ' …' : ''}. Se recalculan: node docs/methodology/tools/tracker.mjs inventario --aplicar. NO establece que la descripción en prosa sea cierta: sólo las cifras.`);
  } else {
    ok('FND-R14', `las ${transcritas.length} cifras de inventory/services.md coinciden con el árbol.`);
  }

  // H-006 · el recuento de CLAUDE.md, que se corrigio A MANO en la auditoria — el arreglo que
  // vuelve a caducar en cuanto entre una herramienta.
  const rec = recuentosDeClaude(read(join(ROOT, 'CLAUDE.md')) ?? '');
  const nT = readdirSync(DIR_T).filter((f) => /\.(mjs|sh)$/.test(f)).length;
  if (rec.herramientas != null && rec.herramientas !== nT) {
    warn('FND-R14', `CLAUDE.md declara ${rec.herramientas} herramientas y hay ${nT}. Es una cifra escrita a mano que nadie recalcula, y por eso vuelve a caducar cada vez que se corrige.`);
  }
}

// ─── SUITE-R09 · el ledger append-only no pierde lineas ─────────────────────
//
// PT-088 · H-002 de PTSA-2026-08-20. SUITE-R09 declara que los ledgers son append-only y
// NINGUN verificador la emitia: la base de evidencia del marco entero no tenia guarda.
//
// QUE ESTABLECE: que ninguna linea anterior desaparecio NI CAMBIO desde el tag. Cuenta las
//   lineas «-» del diff, y git representa una modificacion como borrado mas alta.
// QUE NO ESTABLECE: cual de los dos fue. No distingue una correccion legitima de una
//   falsificacion — en un append-only las dos estan prohibidas, y lo que se corrige se
//   corrige ANADIENDO.
//
// Declare al escribirla que una alteracion de igual recuento pasaba, y era FALSO: lo midio
// el arnes, no yo. Declarar un limite sin medirlo es la misma forma que PT-087 cierra.
//
// La ventana es el TAG, no origin/main: PT-081 eligio origin/main y la comprobacion se apago
// justo el dia que lo que buscaba aterrizo alli.
const LEDGERS = ['HISTORY.log', 'SESSION_LOG.md', 'INCIDENTS.log',
                 'RECONCILIATION.log', 'MIGRATION.log', 'INSTALL.log'];
function checkLedgers() {
  if (!rigeGlobal('SUITE-R09')) return;
  const git = (args) => {
    try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }); }
    catch { return null; }
  };
  const tag = (git(['tag', '--list', 'v*', '--sort=-v:refname']) ?? '')
    .trim().split(/\s+/).filter(Boolean)[0];
  if (!tag) {
    // Sin tag no hay reloj y NO SE INVENTA UNO: se omite la comprobacion y se dice, que es
    // lo que integrations.md declara para git en todo el marco.
    warn('SUITE-R09', 'sin ningún tag v*: no hay línea base contra la que medir el ledger. No se comprueba, y se dice.');
    return;
  }
  const presentes = LEDGERS
    .map((f) => join('docs', 'implementation', f).split(sep).join('/'))
    .filter((f) => existsSync(join(ROOT, f)));
  const fuera = lineasPerdidas(presentes, (f) => git(['diff', tag, 'HEAD', '--', f]));
  const sinBase = fuera.filter((x) => x.borradas === null);
  const perdidas = fuera.filter((x) => x.borradas !== null);
  for (const x of sinBase) {
    warn('SUITE-R09', `${x.archivo}: no se pudo obtener el diff contra ${tag}. SIN EVALUAR — que no es lo mismo que «ninguna línea borrada».`);
  }
  for (const x of perdidas) {
    fail('SUITE-R09', `${x.archivo}: ${x.borradas} línea(s) desaparecida(s) o alterada(s) desde ${tag}. Un ledger append-only no reescribe lo ya escrito: se corrige añadiendo. Cuenta las líneas «-» del diff, así que una modificación cuenta —git la representa como borrado más alta—. Lo que NO distingue es una corrección legítima de una falsificación: en un append-only las dos están prohibidas.`);
  }
  if (!perdidas.length && !sinBase.length) {
    ok('SUITE-R09', `${presentes.length} ledger(s) sin líneas perdidas desde ${tag}.`);
  }
}

// ─── EXEC-R04 · la G4 deja constancia con nombre ────────────────────────────
//
// PT-088 · H-002. EXEC-R04 dice que G4 es humana en los tres modos y ningun verificador la
// emitia. Lo que existia era SUITE-R06 por TAREA; esto es por MERGE.
//
// QUE ESTABLECE: que hay una entrada de autorizacion, con nombre en «firmantes», el mismo dia
//   de cada merge a la rama por defecto posterior a la version de entrada.
// QUE NO ESTABLECE: que la autorizacion fuera real — el agente escribe la constancia. Es el
//   limite que SUITE-R27 declara para las firmas, y H-009 pide declararlo tambien aqui.
//
// La ventana no es cosmetica: medido, hay 18 merges a main y UNO desde el ultimo tag. Sin
// ventana la regla nace con 17 fallos sobre trabajo de agosto y se apaga (PT-023).
const RE_CONSTANCIA = /^##\s+(\d{4}-\d{2}-\d{2})\s+·\s+.*(?:G4|VoBo|autorizad)/gim;
function checkG4ConConstancia() {
  if (!rigeGlobal('EXEC-R04')) return;
  const git = (args) => {
    try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }); }
    catch { return null; }
  };
  const tag = (git(['tag', '--list', 'v*', '--sort=-v:refname']) ?? '')
    .trim().split(/\s+/).filter(Boolean)[0];
  const principal = (git(['symbolic-ref', '--quiet', 'refs/remotes/origin/HEAD']) ?? '')
    .trim().split('/').pop() || 'main';
  const ref = `origin/${principal}`;
  if (git(['rev-parse', '--verify', '--quiet', ref]) === null) {
    warn('EXEC-R04', `no existe ${ref}: sin rama por defecto publicada no hay merges que contrastar. SIN EVALUAR.`);
    return;
  }
  const rango = tag ? `${tag}..${ref}` : ref;
  const crudo = git(['log', '--merges', '--first-parent', rango, '--format=%h|%cs']) ?? '';
  const merges = crudo.trim().split(/\r?\n/).filter(Boolean)
    .map((l) => { const [sha, fecha] = l.split('|'); return { sha, fecha }; });
  if (!merges.length) {
    ok('EXEC-R04', `sin merges a ${principal}${tag ? ` desde ${tag}` : ''}: nada que autorizar.`);
    return;
  }
  const sesion = read(join(IMPL, 'SESSION_LOG.md')) ?? '';
  // firmantesDeclarados() devuelve NULL —no lista vacia— si no hay CLAUDE.md o no declara
  // «firmantes:». Sin lista no hay contra que contrastar un nombre, asi que la comprobacion
  // NO SE HACE y se dice, en vez de reventar o de dar por buena cualquier constancia.
  // Reventaba en 13 casos del arnes, y SUITE-R27 ya avisa de la lista ausente.
  // NOTA: no se nombra aqui la clase de error de node. «revento()» del arnes la busca EN TODA
  // LA SALIDA, y trece casos hacen «cat» de este archivo: escribirla convierte el comentario
  // en un falso positivo. Es el mismo aviso que el HANDOFF ya da sobre escribir el patron de
  // una emision dentro de un comentario.
  const lista = firmantesDeclarados();
  if (!lista) {
    warn('EXEC-R04', 'CLAUDE.md no declara «firmantes:»: sin esa lista, una constancia con cualquier nombre valdría. SIN EVALUAR, y SUITE-R27 ya lo señala.');
    return;
  }
  // El nombre se EXTRAE del cuerpo de la entrada, no se sintetiza desde «firmantes». Lo
  // escribi al reves —generaba una constancia por cada firmante declarado— y entonces el
  // filtro por nombre no podia fallar NUNCA: AC-05 quedaba vacuo. Es un verificador que
  // comprueba su propia entrada, la forma mas silenciosa del patron que PT-087 cierra.
  const bloques = sesion.split(/^##\s+/m);
  const constancias = [];
  for (const b of bloques) {
    const m = /^(\d{4}-\d{2}-\d{2})\s+·\s+(.*)/.exec(b);
    // PT-095 · «a la espera de G4» NO es una autorizacion: anuncia lo contrario. El criterio
    // vive en patrones.mjs porque lo usan los DOS bucles de aqui, y escrito dos veces divergiria.
    if (!m || !anunciaAutorizacion(m[2])) continue;
    const quien = lista.find((n) => b.includes(n));
    if (quien) constancias.push({ nombre: quien, fecha: m[1] });
  }
  // PT-093 · EXEC-R04a · una constancia MALFORMADA es un hecho distinto de una AUSENTE, y el
  // arreglo tambien: la primera se corrige anadiendo el nombre, la segunda escribiendo la
  // entrada. Fundirlas en un solo mensaje mandaba a quien lo lee a buscar cual de las dos era.
  //
  // QUE ESTABLECE: que un encabezado que anuncia una autorizacion lleve un nombre de firmantes.
  // QUE NO ESTABLECE: que ese encabezado sea el de la autorizacion que cubre este merge — eso
  //   lo empareja la fecha, y el limite ya esta declarado en EXEC-R04.
  // PT-095 · la regla nacio con la 11.0.0 y estaba juzgando entradas del 13 de agosto, en un
  // ledger donde SUITE-R09 PROHIBE corregirlas. Una regla que no se puede cumplir esta rota, no
  // es exigente. La frontera se DERIVA del tag de la version que la trajo — no se escribe a mano,
  // que es lo que SUITE-R40 lleva persiguiendo desde que un verificador guardaba su propia copia
  // del numero de version y se quedaba atras.
  const fronteraR04a = (() => {
    const v = RIGE_DESDE['EXEC-R04a'];
    if (!v) return null;
    try {
      return execFileSync('git', ['log', '-1', '--format=%cs', `v${v.join('.')}`],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim() || null;
    } catch { return null; }
  })();
  if (rigeGlobal('EXEC-R04a') && !fronteraR04a) {
    warn('EXEC-R04a', `sin tag v${(RIGE_DESDE['EXEC-R04a'] ?? []).join('.')}: no hay frontera desde la que la regla alcance, `
      + 'y sin ella juzgaría lo escrito antes de existir. NO SE EVALÚA, y se dice.');
  } else if (rigeGlobal('EXEC-R04a')) {
    for (const b of bloques) {
      const m = /^(\d{4}-\d{2}-\d{2})\s+·\s+(.*)/.exec(b);
      if (!m || !anunciaAutorizacion(m[2])) continue;
      if (!alcanzadaPor(m[1], fronteraR04a)) continue;
      if (lista.some((n) => b.includes(n))) continue;
      // PT-095 · en un ledger append-only lo malformado se corrige ANADIENDO. Sin esto la
      // unica salida seria editar SESSION_LOG.md, que SUITE-R09 prohibe: dos reglas
      // haciendose imposibles entre si. HISTORY.log ya lo resuelve asi desde PT-046.
      if (corregidaDespues(m[1], bloques, lista)) continue;
      fail('EXEC-R04a', `SESSION_LOG.md, entrada del ${m[1]}: anuncia una autorización y no lleva ningún nombre de «firmantes» en su cuerpo. La forma es fija —encabezado con fecha y un nombre de la lista— porque lo que hace contrastable a una autorización es saber dónde mirar y qué tiene que decir. NO establece que sea la autorización de un merge concreto: eso lo empareja la fecha. Alcanza a lo escrito DESPUÉS de ${fronteraR04a}, el día en que se selló la versión que la trajo: NO establece nada sobre lo escrito ese mismo día ni antes.`);
    }
  }

  const huerfanos = mergesSinConstancia(merges, constancias, lista);
  if (huerfanos.length) {
    for (const h of huerfanos) {
      fail('EXEC-R04', `${h.sha} (${h.fecha}): merge a «${principal}» sin constancia de autorización en SESSION_LOG.md. G4 es humana en los tres modos; sin registro con un nombre de «firmantes» no hay decisión humana que contrastar. NO prueba que la autorización fuera real (SUITE-R27, H-009).`);
    }
  } else {
    ok('EXEC-R04', `${merges.length} merge(s) a «${principal}»${tag ? ` desde ${tag}` : ''}, todos con constancia.`);
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
  // PT-055 · «bajo evaluacion», y no «hay una bandera --gate G4 en algun sitio».
  //
  // El 2026-08-15, cerrando EP-013 con EP-014 recien abierto, esta condicion bloqueo por las
  // cuatro filas de EP-014 —trabajo aun no hecho— mientras EP-013 estaba en verde. Un lote
  // abierto tiene sus filas de cierre sin resolver POR DEFINICION: es lo que significa estar
  // abierto. Se integro con el rojo declarado como excepcion, no arreglado.
  //
  // La otra mitad, «status === DONE», NO se toca: un lote terminado exige sus filas resueltas
  // aunque nadie pase --gate.
  const evaluado = !LOTES_EVALUADOS.size || LOTES_EVALUADOS.has(ep);
  const enG4 = (gate === 'G4' && evaluado) || alloc?.status === 'DONE';
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
  // PT-081 · la version de entrada la declara CADA REGLA en patrones.mjs (RIGE_DESDE). Aqui
  // habia una sola constante `DESDE = [5,1,0]` gobernando tres comprobaciones: FDGE-R52 nace en
  // 5.0.0, FDGE-R53 en 5.1.0 y FDGE-R54 nace AHORA — la ultima heredaba una fecha del 12 de
  // agosto y regia sobre tareas escritas meses antes de existir. Un proyecto instalado en 8.2.0
  // que actualizara veia fallar --gate G2 en toda tarea en vuelo sin viabilidad.
  const suiteDelPT = intake.match(RE_SUITE_YAML)?.[1] ?? enRegistroPT?.suite_version ?? '0.0.0';
  const rige = (id) => rigeDesde(id, suiteDelPT);

  // ── FDGE-R55 · toda allocation nueva cita la parada que la produjo ───────
  //
  // PT-116 construyo «tracker parada» y la dejo SIN EXIGIR. Un comando que existe y nadie
  // invoca no cambia nada: las ocho tareas cerradas de EP-020 lo demuestran, porque LA
  // HERRAMIENTA EXISTIA EN LAS OCHO. SUITE-R26 llama a eso «una recomendacion».
  //
  // ALCANCE: solo la parte que FDGE-R55 declara mecanizable. La regla lleva su propio limite
  // escrito — una parada de desenlace «continua» no deja rastro contra el que contrastar, y
  // ningun script puede probar la ausencia de algo que no se escribe. Eso va como HUECO MEDIDO
  // (SUITE-R26), no como comprobacion verde.
  //
  // CONTRA EL REGISTRO, no contra los comentarios del issue: un verificador que necesitara red
  // para decidir si una tarea cumple no podria correr en un repositorio sin plataforma, y
  // SUITE-R22 declara ese caso soportado.
  //
  // NO SE RETROFECHA: rige() lo decide con la suite_version del PT, y RIGE_DESDE la fija en
  // 13.0.0. Las 20 allocations de EP-020 declaran 12.0.0 y ni se miran — criterio de FDGE-R19
  // y FDGE-R52. Obligar a rehacer trabajo valido es la forma mas rapida de que se abandone el
  // marco.
  if (enRegistroPT && rige('FDGE-R55')) {
    // Un lote SIN PADRE esta exento: no hay tarea anterior desde la que parar. Sin esta puerta,
    // instalar cauce y abrir el primer EP empezaria en rojo — y una compuerta que falla sobre
    // el caso inicial no se cumple: se rodea.
    const esRaiz = !enRegistroPT.epic && String(enRegistroPT.id ?? '').startsWith('EP-');
    const o = enRegistroPT.origen_parada;
    if (esRaiz) {
      ok('FDGE-R55', `${pt}: lote raiz — exento: no hay tarea anterior desde la que parar.`);
    } else if (!o?.de) {
      fail('FDGE-R55', `${pt}: sin «origen_parada». Abrir trabajo cita la parada que lo produjo — `
        + `y la escribe el comando en el mismo acto que la publica: `
        + `tracker parada <PT que paro> --motivo <clase> --texto <ruta> --desenlace abre --abre ${pt}`);
    } else if (!MOTIVOS_DE_PARADA.includes(String(o.motivo ?? ''))) {
      fail('FDGE-R55', `${pt}: «origen_parada.motivo» dice «${o.motivo}», que no es una clase de `
        + `LEXICON §8.5. Un valor libre convierte la clase en prosa y la matriz no puede contar nada.`);
    } else {
      ok('FDGE-R55', `${pt}: nace de la parada de ${o.de} · motivo ${o.motivo}.`);
    }
  }

  // ── SUITE-R58 · el registro solo lo escribe el comando ────────────────────
  //
  // PT-103 · esto no existia, y es lo que el firmante señalo: las compuertas miran los
  // PRODUCTOS —que el intake tenga firma, que exista trazabilidad— y NADIE miraba el
  // PROCEDIMIENTO. `CLAUDE.md`, `CORE.md`, la sesion y el agente no son compuertas: no pueden
  // fallar. Una allocation escrita a mano queda escrita, y nada la distinguia de una nacida del
  // comando — salvo que le falten los campos que el comando ahora si escribe.
  //
  // Va AQUI y no al principio de checkPT: `rige` se define en esta linea, y una comprobacion
  // puesta antes revienta la herramienta entera. Es la decima vez en este lote que una
  // comprobacion se coloca donde su ambito no llega, y la primera que se caza antes de correr.
  //
  // AVISA y no falla, y no es indulgencia: durante 41 tareas `asignar` escribio CUATRO campos
  // de nueve, asi que lo anterior a la regla se escribio cuando el comando NO PERMITIA otra
  // cosa. Juzgarlo seria retrofechar (SUITE-R09, RIGE_DESDE).
  if (enRegistroPT && rige('SUITE-R58')) {
    const exigidos = ['phase', 'status'];
    if (String(enRegistroPT.type ?? '') === 'BUG') exigidos.push('severity');
    const faltan = exigidos.filter((c) => enRegistroPT[c] === undefined || enRegistroPT[c] === null);
    if (faltan.length) {
      warn('SUITE-R58', `${pt}: la allocation no declara ${faltan.join(', ')} — se escribio sin `
        + '«tracker asignar», que ahora los escribe. Sin «phase» no se puede avanzar nunca.');
    }
  }

  // FDGE-R53 · la deriva ocurre en tareas SIN FORMA. Una que declara como termina lo tiene.
  if (rige('FDGE-R53') && !RE_CIERRE.test(intake)) {
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

  // PT-016 · SUITE-R08 · «phase» deja de ser opcional para un PT VIVO.
  //
  // Hasta 8.0.0 su ausencia salia SIN EVALUAR, que no aprueba ni bloquea — correcto por RULE-06,
  // pero GRATIS: apagaba de una vez traceability, manifest, self-review, FDGE-R52 y la rama de
  // FDGE-R19 sin que nada fallara nunca. PT-044 cerro el caso de un «phase» que MIENTE; este es
  // el de un «phase» que FALTA.
  //
  // Va AQUI y no dentro de exigible(): alli solo se llega si algun artefacto se comprueba, y un
  // PT con todos sus artefactos presentes no lo alcanzaba nunca. Lo dijo el caso, no la lectura.
  //
  // Exentos: un EP —su ciclo no tiene fases de tarea, y exigirsela seria inventar un dato— y lo
  // ya terminado, que es la misma frontera que FDGE-R52 y FDGE-R19, ahora compartida.
  // PT-099 · LEX-R08 (H) · la ENTRADA a VALIDATION_PENDING, que nadie vigilaba.
  //
  // FDGE-R26 comprueba la SALIDA: un BUG que YA esta en DONE necesita su firma de G3. Un BUG que
  // llega a la fase de validacion o mas alla SIN haber pasado por VALIDATION_PENDING no esta en
  // DONE, asi que esa comprobacion no lo mira y «--all» lo verifica limpio.
  //
  // Es la forma de PT-096: una comprobacion escrita para un fallo no ve su AUSENCIA. Y la regla
  // que se saltaba es la de severidad mas alta del LEXICON — «grep -rn LEX-R08 tools/» no
  // devolvia NADA antes de esto.
  //
  // RIGE_DESDE: 51 BUG existentes nunca pasaron por ahi porque el comando no los llevaba. Sin la
  // fila saldrian los 51 en rojo sin salida, que es lo que PT-095 corrigio para EXEC-R04a.
  // La fase se deriva de FASES por su NOMBRE, no de un literal: renumerar las fases apagaria un
  // 7 suelto en silencio (el riesgo que PT-096 documento con su marcador).
  const FASE_VALIDACION = Number(Object.keys(FASES).find((n) => FASES[n].nombre === 'Validación'));
  if (rige('LEX-R08') && type === 'BUG' && fase !== null && FASE_VALIDACION && fase >= FASE_VALIDACION) {
    const st = String(enRegistroPT?.status ?? '');
    const paso = st === 'VALIDATION_PENDING' || st === 'DONE' || ESTADOS_TERMINALES.has(st);
    if (!paso) {
      fail('LEX-R08', `${pt}: es un BUG en PHASE ${fase} y su estado es «${st || '—'}», que no ha pasado por VALIDATION_PENDING. `
        + 'LEXICON §5.1 declara «IN_REVIEW → VALIDATION_PENDING: tipo BUG · siempre» y FDGE-R26 dice que ahi SE DETIENE: '
        + 'solo un humano lo lleva a DONE. Un BUG que llega aqui sin pasar por ese estado se salto la unica validacion '
        + 'humana obligatoria del marco, y hasta ahora nada lo decia.');
    } else {
      ok('LEX-R08', `${pt}: BUG que paso por la validacion humana obligatoria.`);
    }
  }

  // PT-100 · LEX-R27 · un lote se reconoce por su ID, y el campo «type» no decide nada.
  //
  // El registro acumulo TRES respuestas —EP en dieciseis lotes, ausente en dos, EPIC en uno—
  // porque la pregunta no tenia respuesta declarada, y con eso «tracker estado» perdia una tarea
  // SIN DECIRLO. LEX-R27 cierra la pregunta declarando la AUSENCIA: un lote no lleva «type».
  //
  // Se AVISA y no se falla: los diecinueve lotes historicos lo llevan escrito de tres formas y
  // SUITE-R09 es append-only — no se retrofecha. Lo que importa es que nadie DEPENDA de el, y de
  // eso se ocupan los ocho sitios de tracker.mjs (PT-096) y los seis de aqui.
  if (esLote(enRegistroPT) && enRegistroPT?.type !== undefined) {
    warn('LEX-R27', `${pt}: es un lote y declara «type: ${enRegistroPT.type}». LEX-R27 declara que un lote NO lleva «type»: se reconoce por su identificador, que el registro asigna y siempre esta. El campo no decide nada desde PT-096 y PT-100, y no se retrofecha (SUITE-R09).`);
  }

  // PT-098 · SUITE-R08 · un INTEGRATED que el arbol no sostiene.
  //
  // LEXICON §5.1 define INTEGRATED como «mergeado a la linea principal», y ese estado exime a
  // SEIS comprobaciones de este archivo. La exencion es CORRECTA —no exigir bitacora retroactiva
  // a lo integrado antes de la 5.1.0— y lo que fallaba era el dato: «avanzar» lo escribia sin
  // mirar nada. INC-011 lo midio en otro repositorio: al corregir dos estados a DONE se
  // encendieron cinco reglas y CUATRO salieron en rojo sobre trabajo dado por bueno un dia antes.
  //
  // Un falso rojo se investiga; un falso VERDE se archiva.
  if (enRegistroPT?.status === 'INTEGRATED') {
    const v = estadoContrastado(enRegistroPT, (al) => {
      // La ruta se compone con «/» siempre: git no entiende separadores de Windows en una
      // referencia «rama:ruta». Es la cuarta rotura de escapado de esta sesion, y por eso va
      // como constante y no como replace sobre una ruta del sistema.
      const dir = `changes/${al?.slug ? `${al.id}-${al.slug}` : String(al?.id)}`;
      const enRef = (ref) => {
        try { execFileSync('git', ['cat-file', '-e', `${ref}:${dir}`], { cwd: ROOT, stdio: 'pipe' }); return true; }
        catch { return false; }
      };
      // La rama por defecto se DERIVA de origin/HEAD, como el resto del archivo. Si no se
      // puede derivar no se inventa: se devuelve null y sale SIN EVALUAR (RULE-06).
      const gitq = (args) => {
        try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
        catch { return null; }
      };
      const principal = (gitq(['symbolic-ref', '--quiet', 'refs/remotes/origin/HEAD']) ?? '').trim().split('/').pop();
      if (!principal) return null;
      const integracion = REGISTRO?.tracker?.rama_integracion ?? 'trabajo';
      if (enRef(principal) || enRef(`origin/${principal}`)) return true;
      if (enRef(integracion) || enRef(`origin/${integracion}`)) return false;
      return null;
    });
    if (v) (v.nivel === 'error' ? fail : warn)(v.regla, v.mensaje);
  }

  if (faseDeclarada === null) {
    if (esLote(enRegistroPT) || ESTADOS_TERMINALES.has(enRegistroPT?.status)) {
      warn('SUITE-R08', `${pt}: sin fase declarada — exento (${esLote(enRegistroPT) ? 'es un lote: su ciclo no tiene fases de tarea' : 'ya terminado: no se retrofecha'}).`);
    } else {
      fail('SUITE-R08', `${pt}: no declara «phase», y desde 8.0.0 eso ya no es SIN EVALUAR. `
        + 'Declárala en el YAML de su intake.md o en su allocation de REGISTRY.json. Sin fase '
        + 'ninguna exigencia por fase se evalúa, y no evaluarlas salía gratis.');
    }
  }

  // ── PT-075 · las dos reglas que nada ejecutaba ────────────────────────────
  //
  // FDGE-R54 · no se empieza lo que no se puede terminar, Y CONSTA.
  //
  // PT-059 diseño la compuerta, LEXICON 6.5d le dio vocabulario y «tracker viabilidad» la
  // calcula. Durante cuatro lotes no la exigio ninguna regla, no la abrio ninguna fase y no la
  // echo en falta ningun verificador: no se cumplio ni se incumplio, no ocurrio.
  //
  // Se exige en G2 —o desde PHASE 5, que es donde empieza el trabajo— y no en G1: antes de
  // PHASE 2 la tarea no tiene complejidad propuesta, y sin complejidad no hay coste tipico con
  // el que comparar. Antes de eso AVISA. Lo ya terminado no se retrofecha (FDGE-R19, FDGE-R52).
  if (rige('FDGE-R54') && !esLote(enRegistroPT) && !ESTADOS_TERMINALES.has(enRegistroPT?.status)) {
    const viab = enRegistroPT?.viabilidad;
    if (!viab) {
      const m = `${pt}: no consta el veredicto de viabilidad. Consultarla no basta: una compuerta `
        + `cuyo resultado no se escribe no se puede auditar.  node tools/tracker.mjs viabilidad ${pt} --registrar`;
      if (gate === 'G2' || fase >= 5) fail('FDGE-R54', m); else warn('FDGE-R54', m);
    } else if (viab.veredicto === 'UNSAFE' && fase >= 5) {
      fail('FDGE-R54', `${pt}: viabilidad UNSAFE y la tarea esta en PHASE ${fase}. PT-059 es explicita: `
        + `checkpoint, handoff y parada. UNSAFE exige evidencia EN CONTRA, asi que no es una duda.`);
    } else {
      ok('FDGE-R54', `${pt}: viabilidad ${viab.veredicto}${viab.medido_en ? ` · medida contra ${String(viab.medido_en).slice(0, 7)}` : ''}.`);
    }
  }

  // FDGE-R19 · la rama de integracion RECIBE el pull request de cada tarea; no se escribe en
  // ella. Esta comprobacion nacio buscando la mitad de SUITE-R42 que no tenia verificador —«el
  // agente no abre el PR ni lo fusiona»— y se emite bajo FDGE-R19 por dos motivos, y el caso
  // «sin plataforma ⇒ G4 libre de R42» obligo a los dos:
  //
  //   1. SUITE-R42 es CONDICIONAL a que el proyecto declare plataforma —declararla es opcional
  //      y humano, asi que quien no la declara no gana ninguna exigencia—. La topologia de
  //      ramas no depende de la plataforma: rige siempre.
  //   2. Es literalmente lo que FDGE-R19 enuncia. Citar la regla equivocada es el defecto que
  //      SUITE-R53 prohibe, y el mismo que regla.mjs tiene abierto en PT-066.
  //
  // De SUITE-R42 queda comprobado lo comprobable: que el PR exista (checkHistory). QUIEN lo
  // abrio no es determinable desde el repositorio y se declara en TD-14.
  //
  // La regla dice dos cosas y solo se comprobaba la primera —que el PR EXISTA, en checkHistory—.
  // La segunda, «el agente no abre el PR ni lo fusiona», no la miraba nadie.
  //
  // QUIEN abrio un PR no es determinable desde el repositorio: el agente actua con la identidad
  // git de la persona, asi que «gh pr view --json author» devuelve el mismo login en los dos
  // casos. Comprobarlo daria «correcto» siempre, que es peor que no tenerlo (PT-023: 75 % de
  // falsos positivos). Queda declarado como TD-14, no fingido.
  //
  // Lo que SI es comprobable es la CONSECUENCIA: trabajo de un PT escrito directamente sobre la
  // rama de integracion en vez de llegar por su pull request.
  //   --first-parent  un PR fusionado es UN commit de merge: lo integrado bien no cuenta
  //   --no-merges     deja solo las escrituras DIRECTAS
  //
  // Solo mira PTs que DECLARAN rama. Las anteriores a 8.3.0 no la declaran y quedan fuera, con
  // el criterio de FDGE-R19: pedir rama a lo ya integrado es pedir que se invente. Sin esa
  // guarda el verificador acusaria a trabajo correcto, que es el fallo que no puede cometer.
  if (enRegistroPT?.branch && !ESTADOS_TERMINALES.has(enRegistroPT?.status)) {
    const gitPT = (args) => {
      try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim(); }
      catch { return null; }
    };
    const integracion = REGISTRO?.tracker?.rama_integracion ?? 'trabajo';
    if (gitPT(['rev-parse', '--verify', '--quiet', integracion]) === null) {
      warn('FDGE-R19', `${pt}: no existe la rama de integracion «${integracion}», asi que no se puede `
        + `comprobar si el trabajo se escribio en ella. Declarala en REGISTRY.tracker.rama_integracion.`);
    } else {
      // El rango es «desde la rama del PT hasta la de integracion», NO la rama entera. La rama
      // efimera nace en PHASE 5 (FDGE-R19), asi que todo lo anterior —intake, estrategia,
      // diseño de PHASE 1 a 4— esta legitimamente en la rama de integracion y es ANTECESOR de
      // la rama del PT. Mirar la rama entera acusaba a ese trabajo correcto: lo dijo la PRIMERA
      // ejecucion de esta comprobacion, que señalo los dos commits de PHASE 2-4 de la propia
      // PT-075. Lo que queda en el rango es lo escrito DESPUES de ramificar, que es el acto
      // que la regla prohibe.
      const rango = `${enRegistroPT.branch}..${integracion}`;
      const asuntos = (gitPT(['log', rango, '--first-parent', '--no-merges', '--format=%s']) ?? '')
        .split(/\r?\n/).filter(Boolean);
      const suyos = asuntos.filter((a) => (a.match(/PT-\d{3}/) ?? [null])[0] === pt);
      if (suyos.length) {
        fail('FDGE-R19', `${pt}: ${suyos.length} commit(s) suyos estan DIRECTAMENTE en «${integracion}» y `
          + `declara la rama «${enRegistroPT.branch}». La rama de integracion RECIBE el pull request de `
          + `cada tarea (FDGE-R19); no se escribe en ella. El primero: «${suyos[0].slice(0, 60)}».`);
      } else {
        ok('FDGE-R19', `${pt}: su trabajo no esta escrito directamente en «${integracion}».`);
      }
    }
  }

  // EXEC-R07 · lo que no se automatiza se DESCRIBE. Si el agente ejecuto en vez de describir, la
  // descripcion falta y la omision se ve. No prueba que no lo ejecutara —igual que SUITE-R27 no
  // prueba que firmara una persona—: convierte la afirmacion en contrastable.
  if (fase >= 9 && !ESTADOS_TERMINALES.has(enRegistroPT?.status)) {
    if (!existsSync(join(ptDir(pt), 'acciones-humanas.md'))) {
      fail('EXEC-R07', `${pt}: en PHASE 9 y sin «acciones-humanas.md». Lo que ningun modo automatiza `
        + `se DESCRIBE con su comando exacto (EXEC-R07), y esa descripcion es el unico rastro de que `
        + `el agente se detuvo donde debia en vez de ejecutar.`);
    } else {
      ok('EXEC-R07', `${pt}: las acciones reservadas al humano estan descritas.`);
    }
  }

  // PT-044 · SUITE-R35 hacia DENTRO. La regla dice que el registro asigna y todo lo demas
  // ESPEJA, y su comprobacion solo miraba hacia la plataforma. El YAML del intake y la linea de
  // indice son las otras dos copias del mismo hecho, y nada las comparaba: cuatro tareas de
  // EP-011 declararon «phase: 1» con el registro en 9, y con eso `fase >= 2` nunca se cumplia y
  // FDGE-R52 no llegaba a ejecutarse. Un verificador que da verde POR NO HABER MIRADO es lo que
  // RULE-06 prohibe, ocurriendo dentro del verificador que lo hace cumplir.
  //
  // La precedencia de PT-004 NO cambia —manda el YAML, es lo que el PT dice de si mismo—: lo
  // que cambia es que ya no puede ganar en silencio.
  const divergencia = (campo, aqui, alla, cual) => {
    if (aqui === undefined || aqui === null || alla === undefined || alla === null) return;
    if (String(aqui) === String(alla)) return;
    const m = `${pt}: «${campo}» divergente — el registro dice «${alla}» y ${cual} «${aqui}». `
      + 'Se usa el del intake (PT-004: es lo que el PT dice de sí mismo), y por eso se dice: un '
      + 'YAML que se queda atrás apaga comprobaciones sin que nada avise.';
    if (gate === 'G4') fail('SUITE-R35', m); else warn('SUITE-R35', m);
  };
  // PT-089 · H-004. Una divergencia con estado TERMINAL en el registro y NO terminal en el
  // YAML no es una diferencia de opinion entre dos fuentes: es un archivo que se quedo atras,
  // y su consecuencia es que «fase >= N» no se cumple y las comprobaciones de las fases
  // posteriores NO SE EJECUTAN. Es el defecto que PT-044 documento y al que se le puso un
  // aviso — y un aviso no impide que una comprobacion se apague.
  //
  // Medido antes de escribir esto: de las 6 divergencias de «status» del repositorio, las 6
  // son de esta clase. CERO benignas. El aviso estaba calibrado para una mezcla que no existe.
  //
  // QUE ESTABLECE: que ninguna tarea terminal en el registro se presenta como viva en su YAML.
  // QUE NO ESTABLECE: cual de las dos fuentes tiene razon. La precedencia de PT-004 no cambia
  //   —manda el YAML— y por eso el arreglo es SINCRONIZAR, no elegir.
  //
  // «phase» sigue siendo aviso: 22 divergencias en tareas ya terminales, y una terminal con
  // «phase» viejo no apaga nada. Convertirlas en error nace con 22 fallos sobre trabajo
  // cerrado, que es el error que PT-088 evito con RIGE_DESDE.
  const divergenciaTerminal = (enYaml, enRegistro) => {
    if (!enYaml || !enRegistro) return;
    if (!ESTADOS_TERMINALES.has(String(enRegistro))) return;
    if (ESTADOS_TERMINALES.has(String(enYaml))) return;
    fail('SUITE-R35', `${pt}: el registro dice «${enRegistro}» —terminal— y su intake dice `
      + `«${enYaml}», que no lo es. No es una diferencia de opinión: es un archivo que se quedó `
      + 'atrás, y con él las comprobaciones de las fases posteriores no llegan a ejecutarse. '
      + 'Se arregla SINCRONIZANDO, no eligiendo: la precedencia de PT-004 no cambia. '
      + 'NO establece cuál de las dos fuentes tiene razón.');
  };
  divergencia('phase', intake.match(RE_PHASE_YAML)?.[1], enRegistroPT?.phase, 'su intake dice');
  divergencia('status', intake.match(RE_STATUS_YAML)?.[1], enRegistroPT?.status, 'su intake dice');
  divergenciaTerminal(intake.match(RE_STATUS_YAML)?.[1], enRegistroPT?.status);

  // Un artefacto se exige DESDE la fase que lo produce (CORE.md §Procedimiento por fase).
  // Exigirlo antes ponia en rojo a todo PT recien abierto, y CI corre `verify-fdge --all`:
  // un repositorio no podia tener trabajo en curso y la compuerta en verde a la vez. Una
  // compuerta que se pone roja sobre comportamiento correcto ensena a saltarsela.
  //
  // Tres salidas, no dos (RULE-02): falta y toca -> error · falta y aun no toca -> aviso ·
  // no se sabe en que fase esta -> SIN EVALUAR, que no es un aprobado.
  const exigible = (regla, desde, artefacto) => {
    // PT-016 · sin fase no se puede exigir nada, y SUITE-R08 ya lo dijo arriba UNA vez.
    // Repetirlo por artefacto llenaba la salida de cinco «SIN EVALUAR» que decian lo mismo, y
    // enterraban el unico mensaje que hay que leer.
    if (faseDeclarada === null) return false;
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
  // PT-047 · FDGE-R19 · la rama por PT. PHASE 5 la manda crear desde la primera version del
  // marco, PHASE 4 obliga a proponerla, y NINGUN verificador la miraba: `grep "Rama:"` sobre
  // este archivo no devolvia una sola linea. 46 tareas seguidas se implementaron sobre la rama
  // de integracion sin que nada lo dijera, con el CLAUDE.md del repositorio declarando dos
  // ramas y ninguna por tarea — en el documento que SUITE-R00 dice que no puede derogar nada.
  //
  // Se lee del REGISTRO y no de HISTORY.log, que ya declara «Rama:» sin que nadie lo compruebe:
  // HISTORY se escribe en PHASE 8 y la rama nace en PHASE 5, asi que comprobarlo alli llega
  // tres fases tarde. La rama ES estado, y el estado vive en el registro (SUITE-R35).
  if (fase >= 5 && !ESTADOS_TERMINALES.has(enRegistroPT?.status) && !enRegistroPT?.branch) {
    const m = `${pt}: está en PHASE ${fase} y no declara rama. PHASE 5 crea `
      + `«<type>/PT-NNN-slug» desde la rama de integración y la declara en `
      + `REGISTRY.allocations[].branch (FDGE-R19). El PR de la tarea es revisión, no G4.`;
    if (gate === 'G4') fail('FDGE-R19', m); else warn('FDGE-R19', m);
  } else if (fase >= 5 && enRegistroPT?.branch) {
    ok('FDGE-R19', `${pt}: rama «${enRegistroPT.branch}» declarada.`);
    // PT-063 · AVISA, no falla. Las 22 ramas declaradas cuando esto se escribio son de DOS
    // niveles y fallarian todas (AC-04), y renombrarlas rompe los PR abiertos sobre ellas.
    //
    // El aviso DICE DESDE CUANDO aplica: una rama de antes de la 8.3.0 no es un incumplimiento,
    // es una rama de antes. Lo que NO se hace es fallar «a partir de la proxima version»: una
    // comprobacion que cambia de severidad con el tiempo es una que nadie puede razonar.
    //
    // Y solo si hay «personas» declaradas: sin ellas no hay usuario que poner, y el aviso seria
    // una exigencia imposible de cumplir.
    if ((REGISTRO?.personas ?? []).length && !ramaLlevaUsuario(enRegistroPT.branch)) {
      warn('FDGE-R19', `${pt}: la rama «${enRegistroPT.branch}» no lleva usuario. Desde 8.3.0 el `
        + 'formato es «<type>/<usuario>/PT-NNN-slug». Las ramas anteriores siguen valiendo: una '
        + 'rama abierta se termina como empezo.');
    }
  }

  // PT-123 · BACKLOG.md declara una implementacion que el registro no tiene abierta.
  //
  // El generador existe desde esta tarea. Sin algo que lo eche de menos, el archivo vuelve a
  // quedarse atras — llevaba CUATRO lotes declarando EP-015, y su cabecera registra que la vez
  // anterior fueron OCHO. Es la clase entera de este lote: no faltaba la herramienta, faltaba
  // que algo la echara de menos.
  //
  // AVISA fuera de G4 y FALLA dentro, con el mismo criterio que el resto de FDGE-R19: un fail
  // inmediato pondria en rojo un repositorio cuyo unico defecto es no haber corrido un comando.
  if (!BACKLOG_REPORTADO) {
    BACKLOG_REPORTADO = true;
    const rutaB = join(IMPL, 'BACKLOG.md');
    const texto = read(rutaB);
    if (texto === null) {
      warn('FDGE-R31', 'BACKLOG.md no se puede leer: la implementacion abierta que declara queda SIN EVALUAR (RULE-06).');
    } else if (!texto.includes('<!-- BACKLOG:DERIVADO -->')) {
      warn('FDGE-R31', 'BACKLOG.md no lleva las marcas del bloque derivado, asi que nadie lo regenera: '
        + 'node tools/tracker.mjs indices --aplicar  (PT-123).');
    } else {
      const declarados = [...texto.matchAll(/^## Implementación abierta — `(EP-\d+)`/gm)].map((m) => m[1]);
      const abiertos = (REGISTRO?.allocations ?? [])
        .filter((a) => /^EP-/.test(String(a?.id)) && !ESTADOS_TERMINALES.has(String(a?.status)))
        .map((a) => a.id);
      const sobran = declarados.filter((x) => !abiertos.includes(x));
      const faltan = abiertos.filter((x) => !declarados.includes(x));
      if (!sobran.length && !faltan.length) {
        ok('FDGE-R31', `BACKLOG.md declara la misma implementacion abierta que el registro${abiertos.length ? `: ${abiertos.join(', ')}` : ' (ninguna)'}.`);
      } else {
        const m = 'BACKLOG.md y el registro no dicen lo mismo sobre que hay abierto'
          + (sobran.length ? ` · declara ${sobran.join(', ')} y el registro no lo tiene abierto` : '')
          + (faltan.length ? ` · el registro abre ${faltan.join(', ')} y el archivo no lo declara` : '')
          + '. Se regenera:  node tools/tracker.mjs indices --aplicar';
        if (gate === 'G4') fail('FDGE-R31', m); else warn('FDGE-R31', m);
      }
    }
  }

  // PT-129 · FDGE-R19 · las ramas que EXISTEN, contra la topologia declarada. Se comprobaba el
  // CAMPO «branch» de la allocation y nunca el arbol: una efimera podia sobrevivir a su tarea
  // integrada —o existir sin tarea— sin que nada lo dijera.
  //
  // AVISA fuera de G4 y FALLA dentro, con el mismo criterio que esta regla ya usa para el usuario
  // en la rama: un fail inmediato pondria en rojo un repositorio sano por dos ramas historicas.
  //
  // NUNCA BORRA (SUITE-R06f): describe el comando.
  if (!TOPOLOGIA_REPORTADA) {
    TOPOLOGIA_REPORTADA = true;
    // `git` vive dentro del bloque de G2: aqui hace falta el suyo. verify-fdge llama a
    // execFileSync directo en todo el archivo, y esto lo hace igual en vez de inventar otra forma.
    const gitTopo = (args) => {
      try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }); }
      catch { return null; }
    };
    const ramas = (() => {
      const l = gitTopo(['for-each-ref', '--format=%(refname:short)', 'refs/heads']);
      const r = gitTopo(['for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin']);
      if (l == null && r == null) return null;
      return [...new Set([...(l ?? '').trim().split(/\r?\n/), ...(r ?? '').trim().split(/\r?\n/)]
        .filter(Boolean).map((x) => x.replace(/^origin\//, ''))
        // «refs/remotes/origin/HEAD» se abrevia a «origin» a secas: es el PUNTERO a la rama por
        // defecto, no una rama. Salio como sobrante en la primera corrida, y es la clase de
        // falso positivo que solo aparece EJECUTANDO.
        .filter((x) => x !== 'HEAD' && x !== 'origin'))];
    })();
    // La rama por defecto se DERIVA de origin/HEAD, como el resto del archivo (:1482).
    const principal = (gitTopo(['symbolic-ref', '--quiet', 'refs/remotes/origin/HEAD']) ?? '')
      .trim().split('/').pop() || 'main';
    const topo = topologiaDeRamas(ramas, REGISTRO?.allocations ?? [], principal);
    if (topo === null) {
      warn('FDGE-R19', 'topologia de ramas SIN EVALUAR: no se pudo enumerar las ramas. No se '
        + 'aprueba por omision (RULE-06).');
    } else if (!topo.sobrantes.length && !topo.huerfanas.length) {
      ok('FDGE-R19', `topologia: ${(ramas ?? []).length} rama(s), todas encajan en los cuatro tipos.`);
    } else {
      const partes = [];
      for (const r of topo.sobrantes) partes.push(`«${r}» no encaja en ninguno de los cuatro tipos`);
      for (const h of topo.huerfanas) partes.push(`«${h.rama}» sigue viva y ${h.id} esta ${h.estado}: FDGE-R19 dice que la efimera se borra al fusionarse`);
      const m = `topologia de ramas: ${partes.length} · ${partes.join(' · ')}. Borrarlas es SUITE-R06f y no se automatiza:  git push origin --delete <rama>`;
      if (gate === 'G4') fail('FDGE-R19', m); else warn('FDGE-R19', m);
    }
  }

  // PT-044 · y deja de exigirse a lo YA TERMINADO. El reanclaje se escribe MIENTRAS se trabaja;
  // pedirselo a un PT que ya paso G4 es pedir que se FABRIQUE, y un rastro fabricado es peor que
  // ninguno. Donde muerde sigue siendo G4, que corre con estado DONE — antes de integrar, no
  // despues: la comprobacion no pierde ni un caso de los que decide algo.
  //
  // Sin este limite, sincronizar el YAML de 32 PT cerrados —que es lo que esta tarea hace—
  // ponia la CI en rojo, y la unica salida practicable era dejar el YAML mintiendo: la regla
  // empujaba exactamente al defecto que PT-044 persigue. Desde PT-081 cada regla declara su version en RIGE_DESDE,
  // que ya existia para no exigir bitacora retroactiva a lo abierto antes de la 5.1.0.
  if (rige('FDGE-R52') && fase >= 2 && !ESTADOS_TERMINALES.has(enRegistroPT?.status)) {
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
  //
  // PT-085 · SUSPECT —deriva de contenido— NO bloquea, y es deliberado: como casi toda tarea
  // toca un archivo del grafo, bloquear ahí dejaría G2 cerrada en todos los MAJOR de forma
  // permanente, y una comprobación que siempre bloquea se termina desactivando. Avisa, enumera,
  // y sellar sí la exige resuelta (SUITE-R57).
  const complexity = intake.match(RE_COMPLEXITY)?.[1];
  const bloquea = GRAPH.state !== 'FRESH' && GRAPH.state !== 'SUSPECT';
  if (complexity === 'MAJOR' && bloquea) {
    fail('FDGE-R43', `${pt}: es MAJOR y el grafo está ${GRAPH.state} (${GRAPH.reason}). Regenera el grafo sobre src/ antes de resolver G2.`);
  } else if (GRAPH.state === 'SUSPECT') {
    warn('FDGE-R43', `${pt}: grafo SUSPECT — ${GRAPH.reason}. No bloquea; sellar sí lo exige al día (SUITE-R57).`);
  } else if (complexity === 'STANDARD' && GRAPH.state !== 'FRESH') {
    warn('FDGE-R43', `${pt}: STANDARD con grafo ${GRAPH.state}. Declara la limitación en context.md (FDGE-R08).`);
  }

  // PT-085 · C · SUITE-R57 · lo integrado no se acumula sin sellar.
  //
  // Se cuenta contra un TAG, no contra una rama: PT-081 aprendió que una rama se mueve con cada
  // integración y deja de detectar justo lo que acabas de integrar. Y las tareas de un lote
  // ABIERTO no cuentan (EXEC-R03: el lote es la unidad de sellado) — con la definición ingenua
  // salían 13 contra un umbral de 3, y el sello de la versión ES el lote abierto: un candado con
  // la llave dentro.
  if (gate === 'G2') {
    // verify-fdge no tiene un `gitDe`: llama a execFileSync directo, como el resto del archivo.
    const git = (args) => {
      try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }); }
      catch { return null; }
    };
    const tag = (git(['tag', '--list', 'v*', '--sort=-v:refname']) ?? '')
      // PT-087 · «el tag anterior» era un PROXY de «lo ya sellado». Se escribio cuando la
      // version en curso todavia NO estaba etiquetada, asi que saltarse su propio tag era
      // inofensivo. En cuanto se sella de verdad deja de serlo: recien creado v10.0.0, las 21
      // tareas de EP-017 —que ESTAN dentro de el— aparecian como deuda sin sellar, y con
      // umbral 3 eso bloquea G2 justo despues de haber sellado.
      //
      // El hecho es «lo que ya viajo en algun tag», y su observable es el TAG MAS ALTO que
      // exista, sea o no el de la version en curso.
      .trim().split(/\s+/).filter(Boolean)[0];
    // PT-131 · el observable es el ARBOL del tag, no lo que su registro declaraba. La lectura
    // vive UNA vez, en patrones.mjs: estaba duplicada aqui y en tracker.mjs con este mismo
    // comentario copiado, y esa duplicacion es como el defecto sobrevivio a PT-087 (SUITE-R38).
    const idsTag = selladoEnTag(
      () => {
        if (!tag) return null;
        const s = git(['ls-tree', '--name-only', tag, 'changes/']);
        if (s == null) return null;
        return s.trim().split(/\r?\n/).filter(Boolean)
          .map((x) => x.replace(/^changes\//, '').replace(/\/$/, ''));
      },
      (a) => existsSync(join(CHANGES, `${a?.id}-${a?.slug}`)),
      REGISTRO?.allocations ?? [],
    );
    const debe = sinSellar(REGISTRO?.allocations ?? [], idsTag);
    const umbral = Number(REGISTRO?.tracker?.umbral_sellado ?? 3);
    if (debe === null) {
      warn('SUITE-R57', `${pt}: deuda de sellado SIN EVALUAR — no se pudo leer el registro del tag anterior. No se aprueba por omisión ni se bloquea sin evidencia (RULE-06).`);
    } else if (debe.length > umbral) {
      fail('SUITE-R57', `${pt}: hay ${debe.length} tarea(s) integradas de lotes CERRADOS sin sellar y el umbral es ${umbral} — ${debe.join(', ')}. `
        + 'G2 se bloquea hasta que una versión cierre:  node tools/tracker.mjs sellar');
    } else {
      ok('SUITE-R57', `${pt}: ${debe.length} integrada(s) sin sellar de lotes cerrados, umbral ${umbral}.`);
    }
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
    checkIndex(pt, enRegistroPT, { gate });
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
    if (exigibleEn(gate, 'manifest.json')) fail('FDGE-R23', `${pt}: falta evidence/${pt}/manifest.json. Sin manifiesto no hay PHASE 7.`);
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
    if (exigibleEn(gate, 'self-review.md') || afterPhase6) fail('FDGE-R25', `${pt}: falta evidence/${pt}/self-review.md.`);
  } else if (/SELF_REVIEW_BLOCKERS_FOUND/.test(sr)) {
    fail('FDGE-R25', `${pt}: el self-review está en SELF_REVIEW_BLOCKERS_FOUND.`);
  } else ok('FDGE-R25', `${pt}: self-review completo.`);

  checkHistory(pt, rel, type, { gate });
  checkIndex(pt, enRegistroPT, { gate });
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
    if (exigibleEn(gate, 'HISTORY.log')) fail('FDGE-R29', `${pt}: sin entrada en HISTORY.log.`);
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

// ─── FDGE-R39 · aislamiento de estado ────────────────────────────────────────
// PT-015 · «Todo archivo de trabajo de un PT vive bajo changes/PT-XXX-slug/. Ninguna ruta global
// es sobrescribible por un PT. Sin esta regla, dos PTs en vuelo se destruyen mutuamente.»
//
// Era HARD y no la comprobaba nadie. Es donde v3 los tenia —PLAN_ACTUAL.md, PENDING_TASKS.md,
// CONTEXT_ANALYSIS.md en docs/implementation/— y de donde `migrate` los saca; sin comprobacion,
// volver a ponerlos ahi no lo detecta nadie hasta que dos tareas se pisan.
//
// Corre UNA VEZ por ejecucion y no por PT: es una propiedad del repositorio.
// OJO con las mayusculas: en Windows y macOS el sistema de archivos NO distingue, y
// `discovery.md` colisiona con el INDICE legitimo `DISCOVERY.md` —igual `enrichment.md` con
// `ENRICHMENT.md` y `scope.md` con `REFACTOR_SCOPE.md`—. Los tres artefactos de PHASE 2 quedan
// fuera de esta lista por eso, y se dice: incluirlos ponia en rojo cualquier repositorio sano.
// Es la misma trampa que TD-04 anota para `QA/` y `qa/`, y la encontro ejecutar, no leer.
const ARTEFACTOS_DE_PT = [
  'strategy.md', 'tasks.md', 'context.md', 'design.md', 'test-scenarios.md',
  'traceability.md', 'out-of-scope.md', 'spec-changes.md', 'intake.md',
  'PLAN_ACTUAL.md', 'PENDING_TASKS.md', 'CONTEXT_ANALYSIS.md',
];
function checkAislamiento() {
  const intrusos = ARTEFACTOS_DE_PT.filter((f) => existsSync(join(IMPL, f)));
  if (!intrusos.length) { ok('FDGE-R39', 'ningún artefacto de PT vive en una ruta global.'); return; }
  fail('FDGE-R39', `${intrusos.length} artefacto(s) de PT en docs/implementation/: ${intrusos.join(', ')}. `
    + 'Todo archivo de trabajo de un PT vive bajo changes/PT-XXX-slug/. En una ruta global, dos '
    + 'PTs en vuelo se sobrescriben — es el bloqueo estructural que la migración desde v3 deshace.');
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
function checkIndex(pt, alloc, { gate } = {}) {
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
    // PT-044 · canónico no es lo mismo que CIERTO. Esto daba verde sobre una línea que decía
    // «READY» con el registro en «INTEGRATED»: comprobaba la FORMA del estado, no su verdad, y
    // el índice es lo que FPGE lee para decidir qué construir a continuación.
    const declarado = LIFECYCLE.find((st) => new RegExp(`\\b${st}\\b`).test(line));
    if (alloc?.status && declarado && declarado !== alloc.status) {
      const m = `${pt}: «estado» divergente — el registro dice «${alloc.status}» y su línea de índice en ${idxHit} dice «${declarado}». El índice ESPEJA el registro (SUITE-R35); el registro asigna.`;
      if (gate === 'G4') fail('SUITE-R35', m); else warn('SUITE-R35', m);
    }
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
// PT-049 · `-q` calla la ENUMERACION del verde y nada mas. No toca los avisos, no toca los
// errores, y NO toca el recuento final: un «sin errores» sin denominador es exactamente lo que
// PT-002 corrigio, y PT-023 lo volvio a encontrar en otra forma —el silencio parece exito—.
// Tampoco toca `process.exit`: el modo IMPRIME, no decide. Si pudiera cambiar el veredicto
// habria dos verdades sobre el mismo arbol, y esa es la averia que este marco persigue.
//
// Medido antes de escribirlo: de 507 lineas, 454 son el bloque PASA. Lo que sobrevive a `-q`
// no es el verde, son 43 AVISOS —19 de ellos diciendo «aun no toca»—, y eso es otra tarea.
const quiet = argv.includes('-q') || argv.includes('--quiet');
// Los PT son los argumentos posicionales, excluyendo el valor de --gate.
// Sin --gate, gateIdx es -1 y gateIdx+1 es 0: hay que excluir la comparación, no el índice 0.
// PT-055 · tambien EP-NNN. Antes el filtro casaba solo /^PT-\d+$/, asi que «--gate G4 EP-013»
// dejaba targets VACIO: el lote nombrado en la orden se descartaba EN SILENCIO y la herramienta
// nunca supo que lote evaluaba. De ahi que enG4 fuera global y EP-013 bloqueara por EP-014.
const posicionales = argv.filter((a, i) => /^(?:PT|EP)-\d+$/.test(a)
  && !(gateIdx >= 0 && i === gateIdx + 1));
const targets = posicionales.filter((a) => a.startsWith('PT-'));
const targetsEP = posicionales.filter((a) => a.startsWith('EP-'));

console.log(`verify-fdge — cumplimiento mecánico de la Methodology Suite ${SUITE_VERSION ?? '(versión no determinada)'}\n`);

const reg = checkRegistry();
REGISTRO = reg;

/**
 * PT-055 · Que lote esta EVALUANDO esta ejecucion. Vacio = TODOS.
 *
 * Sale de los EP-NNN nombrados y del «epic» de los PT-NNN nombrados. Vacio significa TODOS y
 * no NINGUNO: una orden sin objetivo es la que mas se parece a «compruebalo todo», y acotar
 * ahi convertiria el arreglo en un agujero en G4.
 */
LOTES_EVALUADOS = new Set(targetsEP);
for (const pt of targets) {
  const ep = (reg?.allocations ?? []).find((a) => a?.id === pt)?.epic;
  if (ep) LOTES_EVALUADOS.add(ep);
}
if (gate === 'G4' && LOTES_EVALUADOS.size) {
  console.log(`  lote(s) bajo evaluacion: ${[...LOTES_EVALUADOS].join(' · ')}\n`);
}
checkFoundation();
checkCore();
checkIrreversibles(reg?.execution_mode ?? 'SUPERVISED');
checkLedgers();
checkG4ConConstancia();
checkInventario();
checkImplementacion(reg);
checkEstado();
checkCheckpoint();
checkRangos();
checkFirmas();
checkTerreno();
checkValor(existsSync(join(ROOT, 'docs', 'enterprise-documentation', '02-PRD.md')));
checkInstallLog();
checkReconciliation();
checkAislamiento();
checkEpics();
GRAPH = graphState(reg);
if (GRAPH.state === 'FRESH') ok('FDGE-R43', `Grafo FRESH — ${GRAPH.reason}.`);
else if (GRAPH.state === 'SUSPECT') warn('FDGE-R43', `Grafo SUSPECT — ${GRAPH.reason}. No bloquea; sellar sí lo exige al día (SUITE-R57).`);
else warn('FDGE-R43', `Grafo ${GRAPH.state} — ${GRAPH.reason}.${GRAPH.state === 'MISSING' ? '' : ' Bloquea G2 en PTs MAJOR.'}`);

const pts = all ? allOpenPTs(reg) : [...new Set(targets)];
if (!pts.length && !all) {
  console.log('Uso: node verify-fdge.mjs PT-042 | --all | --gate G4 PT-042\n');
}
for (const pt of pts) checkPT(pt, { gate });

// ─── Informe ─────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
if (passed.length && !quiet) {
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
