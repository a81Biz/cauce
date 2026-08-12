#!/usr/bin/env node
/**
 * build-core — Compila CORE.md, el núcleo operativo que carga el agente.
 *
 * PROBLEMA QUE RESUELVE
 *   Cargar LEXICON + RULES + EXECUTION-MODES + Suite-CLAUDE-Template + FDGE-Prompts cuesta
 *   ~39 000 tokens por sesión. La mayor parte es prosa que el agente no necesita para
 *   ejecutar: justificaciones, historia de la v3, ejemplos, explicaciones de por qué una
 *   regla es como es.
 *
 * QUÉ HACE
 *   Extrae de las fuentes canónicas solo lo directivo —ID, severidad y el enunciado
 *   imperativo, cortado en la primera frase— y lo emite en formato denso.
 *   Objetivo: < 6 000 tokens con TODAS las directivas presentes.
 *
 * POR QUÉ GENERADO Y NO ESCRITO A MANO  (SUITE-R16)
 *   Un resumen mantenido a mano es una quinta copia de las reglas. La v3 tenía cuatro y las
 *   cuatro divergieron. Generarlo hace imposible esa divergencia.
 *
 * Uso:  node build-core.mjs [ruta-a-docs/methodology]      escribe CORE.md
 *       node build-core.mjs --check                        verifica que está sincronizado
 * Exit: 0 ok · 1 desincronizado (con --check)
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/). En JS, «.» NO casa \r —es terminador de
 * linea—, de modo que un regex anclado en $ sin flag m falla en cualquier archivo guardado
 * en Windows. Ese fallo dejaba 25 reglas fuera de CORE.md sin avisar.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const check = args.includes('--check');
const BASE = resolve(args.find((a) => !a.startsWith('--')) ?? join(process.cwd(), 'docs', 'methodology'));
const read = (f) => {
  const p = join(BASE, f);
  if (!existsSync(p)) {
    console.error(`Falta la fuente ${f} en ${BASE}.`);
    console.error('CORE.md se compila desde RULES.md · LEXICON.md · EXECUTION-MODES.md · PHASES.md.');
    console.error('Si es un proyecto destino, la instalación viajó incompleta (LEX-R25).');
    process.exit(2);
  }
  return readFileSync(p, 'utf8');
};

// ── Extraer reglas: ID · severidad · primera frase del enunciado ─────────────
// Se descarta todo lo que va tras el primer punto: es rationale, y el rationale no se
// ejecuta. Vive en los Framework-*.md, que nunca se cargan en runtime.
function rulesFrom(txt) {
  const out = [];
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\|\s*`([A-Z]+-[RP]\d+)`\s*\|\s*(HARD|SOFT|CHECK)\s*\|\s*(.+?)\s*\|\s*$/);
    if (!m) continue;
    let [, id, sev, body] = m;
    body = body
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    // primera frase, o 190 chars
    const cut = body.search(/\.\s/);
    if (cut > 40) body = body.slice(0, cut + 1);
    if (body.length > 210) body = body.slice(0, 207).replace(/\s\S*$/, '') + '…';
    out.push({ id, sev, body });
  }
  return out;
}

// ── Extraer bloques literales por marcador ──────────────────────────────────
function between(txt, startRe, endRe) {
  const a = txt.search(startRe);
  if (a < 0) return '';
  const rest = txt.slice(a);
  const b = rest.slice(1).search(endRe);
  return (b < 0 ? rest : rest.slice(0, b + 1)).trim();
}

const rules = read('RULES.md');
const lexicon = read('LEXICON.md');
const exec = read('EXECUTION-MODES.md');
// PHASES.md es el procedimiento canónico denso; los *-Prompts.md son su expansión legible.
// Se inserta íntegro (menos su cabecera) para que CORE.md sustituya a los prompts en runtime.
const phases = (() => {
  // El corte se hacia con indexOf('\n---\n'), que NUNCA casa en un archivo con CRLF: en
  // Windows el nucleo se llevaba la cabecera explicativa de PHASES.md y en Linux no. El agente
  // cargaba un CORE.md distinto segun la plataforma — y el CI, que corre en Linux, acusaba de
  // desincronizado un nucleo que estaba bien. Se normaliza antes de buscar.
  const t = read('PHASES.md').split(/\r?\n/).join('\n');
  const i = t.indexOf('\n---\n');           // corta la cabecera explicativa
  return (i < 0 ? t : t.slice(i + 5)).trim();
})();

// Las reglas de PTSA se CITAN en RULES.md §Parte 6 (tablas sin columna de severidad,
// porque su dueño es la especificación). Sin esto, un agente que encuentra [PTSA-R44] en el
// procedimiento no tiene dónde mirar qué dice, y CORE.md deja de ser autosuficiente.
function ptsaCited(txt) {
  const out = [];
  const seen = new Set();
  for (const line of txt.split(/\r?\n/)) {
    // | `PTSA-Rnn` | A1 | texto |   ·   | `PTSA-Rnn` | texto |
    const m = line.match(/^\|\s*`(PTSA-R\d+)`\s*\|\s*(?:A\d+\s*\|\s*)?(.+?)\s*\|\s*$/);
    if (!m || seen.has(m[1])) continue;
    seen.add(m[1]);
    let body = m[2].replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();
    const cut = body.search(/\.\s/);
    if (cut > 40) body = body.slice(0, cut + 1);
    if (body.length > 210) body = body.slice(0, 207).replace(/\s\S*$/, '') + '…';
    out.push({ id: m[1], sev: 'HARD', body });
  }
  return out;
}

// Extractor en prosa, por líneas: una regla empieza en una línea que abre con `ID` · y
// termina en la primera línea en blanco. Los regex lazy con alternancia se dejaban 3 de 23
// fuera sin avisar; un bucle explícito no tiene ese modo de fallo.
// Regex LITERAL, nunca construido con new RegExp: montar patrones desde strings ha fallado
// cinco veces en este proyecto (\d y \s se pierden según la capa de escapado). El filtrado
// por prefijo se hace en código, que no tiene ese modo de fallo.
const RE_PROSE_HEAD = /^`([A-Z]+-[RP]\d+)`\s*·\s*(.*)$/;
function proseRules(txt, prefijos) {
  const ok = new Set(prefijos);
  const out = [];
  const lines = txt.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(RE_PROSE_HEAD);
    if (!m || !ok.has(m[1].split('-')[0])) continue;
    const buf = [m[2]];
    for (let j = i + 1; j < lines.length && lines[j].trim() !== ''; j++) buf.push(lines[j]);
    let body = buf.join(' ')
      .replace(/\*\*\((?:HARD|SOFT|CHECK)\)\*\*/g, '')
      .replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();
    const cut = body.search(/\.\s/);
    if (cut > 40) body = body.slice(0, cut + 1);
    if (body.length > 210) body = body.slice(0, 207).replace(/\s\S*$/, '') + '…';
    out.push({ id: m[1], sev: 'HARD', body });
  }
  return out;
}

const allRules = rulesFrom(rules)
  .concat(ptsaCited(rules))
  .concat(proseRules(rules, ['SUITE', 'FND', 'FDGE', 'INTAKE', 'QA', 'FPGE', 'FIDE']))
  .concat(proseRules(lexicon, ['LEX']))
  .concat(proseRules(exec, ['EXEC']));

const byPrefix = {};
const vistos = new Set();
for (const r of allRules) {
  if (vistos.has(r.id)) continue;
  vistos.add(r.id);
  const p = r.id.split('-')[0];
  (byPrefix[p] ??= []).push(r);
}
const order = ['SUITE', 'LEX', 'EXEC', 'FND', 'FDGE', 'INTAKE', 'QA', 'PTSA', 'FPGE', 'FIDE'];
const label = {
  SUITE: 'Transversales', LEX: 'Nombres', EXEC: 'Compuertas y modos', FND: 'Foundation',
  PTSA: 'Auditoría — definidas en la especificación oficial',
  FDGE: 'Desarrollo', INTAKE: 'Admisión', QA: 'Verificación de UX', FPGE: 'Priorización', FIDE: 'Incubación',
};

const SPEC = read('PTSA/PTSA-V3-Especificacion-Oficial.md');

// ── Overlay de PTSA ─────────────────────────────────────────────────────────
// De las 80 reglas de la especificacion, CORE.md solo llevaba las 23 que RULES.md cita: al
// correr [START PTSA] el agente auditaba con el 29 % de su propio ruleset. Cargar la
// especificacion entera cuesta ~27 500 tk; sus reglas recortadas a la primera frase
// imperativa cuestan ~2 000. Este overlay se carga SOLO en sesiones de PTSA.
// Recorte identico al de rulesFrom: primera frase, o 210 chars.
function primeraFrase(t) {
  let b = t.replace(/`/g, '').replace(/\s+/g, ' ').trim();
  const cut = b.search(/\.\s/);
  if (cut > 40) b = b.slice(0, cut + 1);
  if (b.length > 210) b = b.slice(0, 207).replace(/\s\S*$/, '') + '…';
  return b;
}
const RE_SPEC_INICIO = /^`(PTSA-R\d+)`\s*(.*)$/;
const RE_SPEC_TITULO = /^#{2,4}\s+(.+?)\s*`(PTSA-R\d+)`\s*$/;
const RE_SPEC_TABLA = /^\|\s*`(PTSA-R\d+)`\s*\|\s*(.+?)\s*\|/;
const RE_SPEC_VINYETA = /^[-*]\s+(.+?)\s*\(`(PTSA-R\d+)`\)/;
function corePtsa() {
  const lineas = SPEC.split(/\r?\n/);
  const regs = new Map();
  // Un mismo id aparece como titulo de axioma («A7 — Certificacion Continua») y como
  // parrafo con el enunciado. Quedarse con el primero dejaba reglas sin contenido ejecutable:
  // se conserva el candidato mas largo, que es siempre el enunciado.
  // El recorte a primera frase se aplica al CUERPO, nunca al titulo: «A4 - Supremacia del
  // Dominio (Regla del Agua Potable).» tiene un punto propio y cortaba ahi, dejando la regla
  // sin enunciado.
  const guarda = (id, body, titulo) => {
    const t = primeraFrase(String(body).replace(/\*\*/g, '').trim());
    if (!t) return;
    const full = titulo ? `${titulo.replace(/\*\*/g, '').trim()} — ${t}` : t;
    if (full.length > (regs.get(id)?.length ?? 0)) regs.set(id, full);
  };
  // Un encabezado de axioma («### A1 - Evidencia sobre Opinion `PTSA-R14`») es un TITULO, no
  // una directiva: el enunciado esta en el parrafo siguiente. Emitir el titulo dejaba 8 reglas
  // sin nada que ejecutar. Igual con las que terminan en «:» y continuan en una tabla: se
  // arrastran las filas para que la regla llegue completa.
  for (let i = 0; i < lineas.length; i++) {
    const l = lineas[i];
    let m = l.match(RE_SPEC_TITULO);
    if (m) {
      let cuerpo = '';
      for (let j = i + 1; j < lineas.length && j < i + 4 && !cuerpo.trim(); j++) cuerpo = lineas[j];
      guarda(m[2], cuerpo.trim() || m[1], cuerpo.trim() ? m[1] : null);
      continue;
    }
    m = l.match(RE_SPEC_TABLA);
    if (m) { guarda(m[1], m[2]); continue; }
    // Forma de vinyeta: «* **Titulo:** enunciado (`PTSA-Rnn`).» — es como se define R29.
    m = l.match(RE_SPEC_VINYETA);
    if (m) { guarda(m[2], m[1]); continue; }
    m = l.match(RE_SPEC_INICIO);
    if (!m) continue;
    // Una definicion puede arrancar en la linea siguiente al identificador.
    let body = m[2];
    for (let j = i + 1; !body.trim() && j < lineas.length && j < i + 3; j++) body = lineas[j];
    // Enunciado que introduce una tabla: sin sus filas, «determina la via y autoridad de
    // cierre:» no dice cual es la via ni cual la autoridad.
    if (/:\s*\**\s*$/.test(body.trim())) {
      const filas = [];
      for (let j = i + 1; j < lineas.length && filas.length < 10; j++) {
        const t = lineas[j].trim();
        if (!t) { if (filas.length) break; continue; }
        if (t.startsWith('|')) {
          if (/^\|[\s:|-]+\|$/.test(t)) continue;
          filas.push(t.replace(/^\||\|$/g, '').split('|').map((x) => x.trim()).join(' → '));
          continue;
        }
        // Bloque de codigo: las formulas de score viven ahi. Sin ellas, «calcular y
        // documentar:» no dice que calcular.
        if (t.startsWith('```')) {
          if (filas.length) break;
          for (let k = j + 1; k < lineas.length && filas.length < 10; k++) {
            if (lineas[k].trim().startsWith('```')) break;
            if (lineas[k].trim()) filas.push(lineas[k].trim());
          }
          break;
        }
        // Listas: «1. …», «- …», «* …». Sin ellas, «es completa SOLO cuando:» no dice cuando.
        const li = t.match(/^(?:\d+[.)]|[-*])\s+(.*)$/);
        // Prosa que continua el enunciado en la linea siguiente («comprueba que: todo
        // producto tiene…»): se arrastra hasta la linea en blanco.
        if (!li && !filas.length && !/^[#`|]/.test(t)) { filas.push(t); continue; }
        if (!li) break;
        filas.push(li[1]);
      }
      if (filas.length) body = `${body.trim()} ${filas.join(' · ')}`;
    }
    guarda(m[1], body);
  }
  const ids = [...regs.keys()].sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  const h = selloDe(SPEC);   // normalizado: el overlay tambien tiene que ser portable
  return `# CORE-PTSA — overlay de auditoría

<!-- GENERADO por tools/build-core.mjs · NO EDITAR A MANO (SUITE-R16) -->
<!-- fuentes: PTSA/PTSA-V3-Especificacion-Oficial.md:${h} -->

Se carga **solo** en sesiones de PTSA, junto a \`CORE.md\` (\`SUITE-R25\`). \`CORE.md\` lleva las
reglas de PTSA que el resto de la suite necesita; aquí están **todas** las de la
especificación, recortadas a su frase imperativa. El porqué y los ejemplos siguen en
[PTSA/PTSA-V3-Especificacion-Oficial.md](PTSA/PTSA-V3-Especificacion-Oficial.md), que solo se
abre si una línea de aquí lo remite.

## Reglas (${ids.length})

${ids.map((id) => `\`${id}\` ${regs.get(id)}`).join('\n')}

## Verificación

\`\`\`
node docs/methodology/tools/verify-ptsa.mjs      # antes de certificar un score
node docs/methodology/tools/build-core.mjs --check
\`\`\`
`;
}

// El sello hashea el contenido NORMALIZADO, no los bytes crudos. Git entrega LF en Linux y
// CRLF en Windows con autocrlf, asi que un sello sobre bytes daba «CORE.md desincronizado» en
// el CI aunque nadie hubiera tocado nada: el marco no se podia certificar a si mismo fuera de
// la maquina donde se genero. Es el mismo CRLF que ya dejo 25 reglas fuera de CORE.md.
const selloDe = (txt) => createHash('sha1').update(txt.split(/\r?\n/).join('\n')).digest('hex').slice(0, 12);
const src = ['RULES.md', 'LEXICON.md', 'EXECUTION-MODES.md', 'PHASES.md']
  .map((f) => `${f}:${selloDe(read(f))}`)
  .join(' ');

const core = `# CORE — Núcleo operativo

<!-- GENERADO por tools/build-core.mjs · NO EDITAR A MANO (SUITE-R16) -->
<!-- fuentes: ${src} -->

Esto es **lo único** que carga el agente (\`SUITE-R15\`): reglas **y** procedimiento. Los
documentos completos solo se abren cuando una línea de aquí lo remite.

Detalle y porqué: \`RULES.md\` · \`LEXICON.md\` · \`EXECUTION-MODES.md\` · \`PHASES.md\`.
Los \`*-Prompts.md\` son la expansión legible de \`PHASES.md\` para copiar y pegar en modo
\`MANUAL\`; en runtime no se cargan.

## Fases

\`\`\`
FDGE  0 Context · 1 Intake◆G1 · 2 Analysis(2-B bug|2-E feature|2-R refactor) · 3 Strategy
      4 Proposal◆G2 · 5 Implementation · 6 Evidence · 7 Validation◆G3 · 8 Persistence
      9 Integration◆G4 · 10 Rollback
      tracks: STANDARD | EXPRESS(TRIVIAL) | HOTFIX(S1)
FND   0 Reconnaissance · 1 Reconciliation◆G0 · 2 Context · 3 Technical · 4 Conventions
      5 Inventory+Graph · 6 Validation
QA    1 Recon · 2 Plan◆ · 3 Specs◆ · 4 Exec · 5 Analysis · 6 Report◆ · 7 Promotion
PTSA  0 Value · 1-5 Inventory→Criticality · 6 Traceability(BLOQUEA 7-10) · 7 D2 · 8 D1
      9 D4 · 10 D3 · 11-12 Consolidation+Score · 13-14 Certification
FPGE  freshness → evidencia → candidatos → priority → ROADMAP◆ → promote
\`\`\`

## Compuertas × modo

\`\`\`
             MANUAL      SUPERVISED              AUTONOMOUS
G1 DoR       humano      humano                  humano (firma por lote)
G2 Proposal  humano      humano                  auto si 5 cond. §5.1 EXEC
G3 Valid.    humano      humano si BUG; auto     idem
G4 Merge     HUMANO      HUMANO                  HUMANO — sin excepción
otras        humano      checkpoint              checkpoint
\`\`\`

Nunca automatizado: merge/push a main · cerrar BUG · migrar o borrar datos · producción ·
editar docs/methodology · push --force · credenciales.

## Clasificaciones

\`\`\`
tipo        BUG · FEATURE · REFACTOR · INVESTIGATION · CHORE
complejidad TRIVIAL · STANDARD · MAJOR      ← esfuerzo y riesgo técnico; la propone el agente
severidad   S1 · S2 · S3 · S4               ← urgencia de negocio; la declara el HUMANO
            EJES INDEPENDIENTES: un bug crítico puede ser TRIVIAL/S1
            S1 sistema caído · pérdida de datos · brecha · bloqueo total → habilita HOTFIX
            S2 flujo crítico degradado con workaround                    → prioridad alta
            S3 flujo no crítico, o feature esperada                      → cadencia normal
            S4 cosmético · mejora · deuda sin impacto observable         → se agrupa en lote
track       STANDARD · EXPRESS (solo TRIVIAL) · HOTFIX (solo S1)
modo        MANUAL · SUPERVISED (por defecto) · AUTONOMOUS
\`\`\`

## Estados

\`\`\`
Lifecycle  DRAFT READY REOPENED IN_PROGRESS BLOCKED BLOCKED_DOMAIN IN_REVIEW
           VALIDATION_PENDING DONE INTEGRATED CLOSED REJECTED DEFERRED REVERTED
           CLOSED es POSTERIOR a INTEGRATED. G4 exige DONE.
Execution  PASS FAIL SKIP ERROR
Phase      NOT_STARTED IN_PROGRESS BLOCKED COMPLETE NEEDS_REVIEW
\`\`\`

## IDs — todos desde REGISTRY.json, nunca contando archivos

\`\`\`
PT EP QA QR QD H E P R INC · AC-nn TS-nn RC-nn por PT · RULE-nn en 11-Conventions
\`\`\`

## Triggers

\`\`\`
[START FIDE] [START FOUNDATION] [FOUNDATION VALIDATED]
[START PT] <tipo>: <título> · [START EP] <título> · resume PT-XXX · status FDGE
[START QA] · delta QA PT-XXX · status QA · promote QD-NNN to FDGE|PTSA · close QD-NNN
[START PTSA] · resume PTSA · delta PTSA · status PTSA · audit PTSA close H-XXX
[START FPGE] · promote FPGE R-NNN[..R-MMM as EP-XXX] · status FPGE
\`\`\`

## Rutas

\`\`\`
docs/enterprise-documentation/  00-Baseline 01-Platform-Overview 02-PRD 03-TRD 04-App-Flow
                                05-UI-UX-Brief 06-Backend-Architecture 07-Database-Architecture
                                08-API-Catalog 09-Security-Architecture 10-Technical-Debt
                                11-Conventions inventory/
docs/implementation/            REGISTRY.json HISTORY.log INCIDENTS.log SESSION_LOG.md
                                HANDOFF.md BACKLOG.md RECONCILIATION.log
                                DISCOVERY.md ENRICHMENT.md REFACTOR_SCOPE.md (índices)
                                ROADMAP.md ROADMAP_HISTORY.log evidence/PT-XXX/
changes/PT-XXX-slug/            intake context discovery|enrichment|scope strategy design
                                tasks spec-changes test-scenarios out-of-scope traceability
QA/ qa/ PTSA/ graphify-out/ docs/_archive/
\`\`\`

## Reglas

Severidad: **H**=HARD detiene · **S**=SOFT exige justificación registrada · **C**=CHECK lo
verifica un script y bloquea la integración.

${order.filter((p) => byPrefix[p]).map((p) => {
  const rs = byPrefix[p].sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
  return `### ${p} — ${label[p]}\n\n${rs.map((r) => `\`${r.id}\` **${r.sev[0]}** ${r.body}`).join('\n')}`;
}).join('\n\n')}

## Procedimiento por fase

${phases}

## Verificación

\`\`\`
node docs/methodology/tools/verify-fdge.mjs PT-XXX | --all | --gate G4 PT-XXX
node docs/methodology/tools/verify-suite.mjs docs/methodology
node docs/methodology/tools/build-core.mjs --check
\`\`\`
`;

// El sello «fuentes:» solo hashea las FUENTES. Editar el CUERPO de CORE.md dejando la
// cabecera intacta pasaba los tres verificadores — y CORE.md es lo UNICO que el agente carga:
// se podia degradar SUITE-R06 de HARD a SOFT sin que nada avisara. El sello «cuerpo:» hashea
// lo generado, de modo que cualquier retoque a mano se detecta.
// Regex LITERALES y una sola definicion de «cuerpo»: la linea del sello se elimina y las
// lineas se normalizan, de modo que el hash no depende de si el archivo se guardo en
// Windows o en Unix. Montar estos patrones desde strings ha fallado cinco veces aqui.
const RE_SOLO_SELLO = /^<!-- cuerpo: [0-9a-f]{12} -->$/;
const RE_LINEAS = /\r?\n/;
const RE_SELLO_CUERPO = /^<!-- cuerpo: ([0-9a-f]{12}) -->$/m;
const cuerpoDe = (txt) => txt.split(/\r?\n/).filter((l) => !/^<!-- cuerpo: [0-9a-f]{12} -->$/.test(l)).join('|');
const hashCuerpo = (txt) => createHash('sha1').update(cuerpoDe(txt)).digest('hex').slice(0, 12);
const sellar = (txt) => txt.replace('<!-- fuentes:', '<!-- cuerpo: ' + hashCuerpo(txt) + ' -->' + String.fromCharCode(10) + '<!-- fuentes:');
const selloOk = (txt) => txt.match(RE_SELLO_CUERPO)?.[1] === hashCuerpo(txt);

const target = join(BASE, 'CORE.md');

if (check) {
  if (!existsSync(target)) { console.error('CORE.md no existe. Ejecuta build-core.mjs.'); process.exit(1); }
  const cur = readFileSync(target, 'utf8');
  const curSrc = cur.match(/<!-- fuentes: (.+?) -->/)?.[1];
  if (curSrc !== src) {
    console.error('CORE.md está DESINCRONIZADO con sus fuentes (SUITE-R16).');
    console.error(`  esperado: ${src}`);
    console.error(`  en CORE:  ${curSrc ?? '(sin marca)'}`);
    console.error('  → node tools/build-core.mjs');
    process.exit(1);
  }
  // El overlay tiene su propia fuente y su propio hash: sin comprobarlo, editar la
  // especificacion de PTSA dejaba CORE-PTSA.md obsoleto sin que nada avisara.
  const tgtP = join(BASE, 'CORE-PTSA.md');
  const espP = corePtsa().match(/<!-- fuentes: (.+?) -->/)?.[1];
  if (!existsSync(tgtP)) { console.error('CORE-PTSA.md no existe. Ejecuta build-core.mjs.'); process.exit(1); }
  const curP = readFileSync(tgtP, 'utf8').match(/<!-- fuentes: (.+?) -->/)?.[1];
  if (curP !== espP) {
    console.error('CORE-PTSA.md está DESINCRONIZADO con su fuente (SUITE-R16, SUITE-R25).');
    console.error(`  esperado: ${espP}`);
    console.error(`  en CORE-PTSA: ${curP ?? '(sin marca)'}`);
    console.error('  → node tools/build-core.mjs');
    process.exit(1);
  }
  // Dos comprobaciones, y hacen falta las dos:
  //   1. El sello de cuerpo detecta un retoque a mano AUNQUE las fuentes no esten (un
  //      proyecto destino puede llevar CORE.md sin RULES.md al lado).
  //   2. La REGENERACION detecta el caso que el sello no puede: quien reescribe el cuerpo y
  //      recalcula el hash. Todo esta en el repositorio, asi que un hash sin secreto solo
  //      protege del descuido; comparar contra lo que el generador produce, no.
  for (const [f, txt] of [['CORE.md', cur], ['CORE-PTSA.md', readFileSync(tgtP, 'utf8')]]) {
    if (!selloOk(txt)) {
      console.error(`${f} fue EDITADO A MANO: su sello de cuerpo no cuadra (SUITE-R16).`);
      console.error('  Es lo que el agente carga: una regla retocada aquí no la ve nadie.');
      console.error('  → node tools/build-core.mjs');
      process.exit(1);
    }
  }
  for (const [f, txt, esperado] of [['CORE.md', cur, sellar(core)], ['CORE-PTSA.md', readFileSync(tgtP, 'utf8'), sellar(corePtsa())]]) {
    // Se descarta la linea del sello: si no, el diff apunta siempre al hash y no a la linea que
    // de verdad cambio, que es la que el humano necesita ver.
    const sinSello = (t) => t.split(RE_LINEAS).filter((l) => !RE_SOLO_SELLO.test(l));
    const a = sinSello(txt);
    const b = sinSello(esperado);
    const i = a.findIndex((l, k) => l !== b[k]);
    if (i >= 0 || a.length !== b.length) {
      const n = i < 0 ? Math.min(a.length, b.length) : i;
      console.error(`${f} NO coincide con lo que generan sus fuentes (SUITE-R16).`);
      console.error(`  línea ${n + 1}`);
      console.error(`  en el archivo: ${(a[n] ?? '(no existe)').slice(0, 110)}`);
      console.error(`  debería decir: ${(b[n] ?? '(no existe)').slice(0, 110)}`);
      console.error('  → node tools/build-core.mjs');
      process.exit(1);
    }
  }
  console.log('CORE.md sincronizado.');
  console.log('CORE-PTSA.md sincronizado.');
  process.exit(0);
}

writeFileSync(target, sellar(core), 'utf8');
writeFileSync(join(BASE, 'CORE-PTSA.md'), sellar(corePtsa()), 'utf8');
const full = ['LEXICON.md', 'RULES.md', 'EXECUTION-MODES.md', 'Suite-CLAUDE-Template.md',
  'FDGE-Prompts.md', 'QA/QA-Prompts.md', 'PTSA/PTSA-Prompts.md', 'FPGE-Prompts.md', 'Foundation-Prompts.md']
  .reduce((n, f) => n + read(f).length, 0);
const tk = (c) => Math.round(c / 3.6);
console.log(`CORE.md escrito · ${allRules.length} reglas · ${core.length} chars ~${tk(core.length)} tok`);
console.log(`Antes: ${full} chars ~${tk(full)} tok  →  reducción ${Math.round(100 - core.length / full * 100)} %`);
