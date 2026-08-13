#!/usr/bin/env node
/**
 * audit — Auditoría de COBERTURA de la propia metodología.
 *
 * POR QUÉ EXISTE
 *   `verify-suite` comprueba lo que se le enseñó a comprobar. Todo lo demás dependía de que
 *   una persona mirara — y cada pasada miraba cosas distintas, así que cada auditoría
 *   encontraba defectos nuevos que la anterior no había buscado. El problema no era la falta
 *   de rigor: era la falta de ENUMERACIÓN.
 *
 *   Este script no busca defectos concretos. Enumera **todos los elementos** del sistema y
 *   comprueba, para cada uno, que tenga lo que un elemento de su clase debe tener. Lo que
 *   falle aquí es un hueco de cobertura, no un hallazgo suelto.
 *
 * QUÉ ENUMERA
 *   1. Reglas      → definida · citada en algo operativo · si es CHECK, verificada por un script
 *   2. Fases       → en PHASES.md · en su archivo de prompts · en CORE.md · en un diagrama
 *   3. Triggers    → en LEXICON · en PHASES · en CORE · en los prompts de su componente
 *   4. Artefactos  → declarados en LEXICON §6 · creados por el instalador · verificados
 *   5. Plantillas  → existen · referenciadas por el protocolo · verificadas
 *   6. Estados     → definidos en LEXICON · usados en algún sitio
 *   7. Herramientas→ existen · sintaxis válida · ejercitadas por selftest
 *   8. Enumeraciones cruzadas: tipos, tracks, severidades, compuertas
 *
 * Uso:  node audit.mjs [ruta-a-docs/methodology]
 * Exit: 0 cobertura completa · 1 huecos
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/). En JS, «.» NO casa \r —es terminador de
 * linea—, de modo que un regex anclado en $ sin flag m falla en cualquier archivo guardado
 * en Windows. Ese fallo dejaba 25 reglas fuera de CORE.md sin avisar.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative, resolve, sep } from 'node:path';

const BASE = resolve(process.argv[2] ?? join(process.cwd(), 'docs', 'methodology'));
if (!existsSync(BASE)) { console.error(`No existe: ${BASE}`); process.exit(2); }

const ROOT = resolve(BASE, '..', '..');
const gaps = [];
const okCount = { total: 0 };
const gap = (clase, elem, falta) => gaps.push({ clase, elem, falta });
const tick = (clase) => { okCount[clase] = (okCount[clase] ?? 0) + 1; okCount.total++; };

const rd = (f) => (existsSync(join(BASE, f)) ? readFileSync(join(BASE, f), 'utf8') : null);
const walk = (dir, out = []) => {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};
const rel = (p) => relative(BASE, p).split(sep).join('/');
const allFiles = walk(BASE);
const mds = allFiles.filter((f) => f.endsWith('.md')).map((f) => [rel(f), readFileSync(f, 'utf8')]);
const tools = allFiles.filter((f) => /\.(mjs|sh)$/.test(f)).map((f) => [rel(f), readFileSync(f, 'utf8')]);
const toolsTxt = tools.map(([, t]) => t).join('\n');

const RULES = rd('RULES.md') ?? '';
const LEXICON = rd('LEXICON.md') ?? '';
const EXEC = rd('EXECUTION-MODES.md') ?? '';
const PHASES = rd('PHASES.md') ?? '';
const CORE = rd('CORE.md') ?? '';
const README = rd('README.md') ?? '';
const SPEC = rd('PTSA/PTSA-V3-Especificacion-Oficial.md') ?? '';
const CORE_PTSA = rd('CORE-PTSA.md') ?? '';

// Documentos que NO cuentan como «uso operativo» de una regla: son catálogos o historia.
const NO_OPERATIVO = new Set(['RULES.md', 'LEXICON.md', 'EXECUTION-MODES.md', 'CHANGELOG.md', 'CORE.md', 'CORE-PTSA.md']);
const operativos = mds.filter(([f]) => !NO_OPERATIVO.has(f));
const opTxt = operativos.map(([, t]) => t).join('\n');

// ── 1. REGLAS ───────────────────────────────────────────────────────────────
{
  const defs = new Map(); // id → severidad
  for (const line of RULES.split(/\r?\n/)) {
    const m = line.match(/^\|\s*`([A-Z]+-R\d+)`\s*\|\s*(HARD|SOFT|CHECK)\s*\|/);
    if (m) defs.set(m[1], m[2]);
    const m2 = line.match(/^`([A-Z]+-R\d+)`\s*·\s*\*\*\((HARD|SOFT|CHECK)\)/);
    if (m2) defs.set(m2[1], m2[2]);
  }
  for (const [src, txt] of [['LEXICON.md', LEXICON], ['EXECUTION-MODES.md', EXEC]]) {
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^`((?:LEX|EXEC)-[RP]\d+)`\s*·/);
      if (m) defs.set(m[1], 'HARD');
    }
  }
  for (const [id, sev] of defs) {
    const falta = [];
    if (!opTxt.includes(id)) falta.push('no la cita ningún documento operativo');
    if (sev === 'CHECK' && !toolsTxt.includes(id)) falta.push('declarada CHECK y ningún script la verifica');
    if (!CORE.includes(id)) falta.push('no llega a CORE.md');
    if (falta.length) gap('regla', `${id} (${sev})`, falta.join(' · ')); else tick('regla');
  }
  // Reglas definidas en la especificacion de PTSA. Nunca se enumeraban: 57 de las 80 no
  // llegaban a runtime y [START PTSA] auditaba con el 29 % de su propio ruleset.
  // Comprobar solo que el ID aparezca seria vacio: el overlay se GENERA de la misma fuente
  // que se enumera, asi que pasaria siempre. Lo que se exige es que llegue con ENUNCIADO
  // ejecutable — 15 reglas llegaban como su titulo («A1 — Evidencia sobre Opinion») o
  // cortadas en los dos puntos que introducian su tabla, y el agente no podia aplicarlas.
  const specDefs = [...new Set([...SPEC.matchAll(/`(PTSA-R\d+)`/g)].map((m) => m[1]))];
  const cuerpos = new Map([...CORE_PTSA.matchAll(/^`(PTSA-R\d+)` (.+)$/gm)].map((m) => [m[1], m[2]]));
  for (const id of specDefs) {
    const falta = [];
    const cuerpo = cuerpos.get(id) ?? (CORE.includes(id) ? null : undefined);
    if (cuerpo === undefined) falta.push('no llega a runtime: ni CORE.md ni CORE-PTSA.md');
    else if (cuerpo !== null) {
      if (cuerpo.length < 40) falta.push(`llega truncada (${cuerpo.length} chars): "${cuerpo}"`);
      if (/:\s*$/.test(cuerpo)) falta.push('llega cortada en dos puntos: falta lo que enumera');
      if (!/[a-záéíóúñ]{4}/.test(cuerpo)) falta.push('llega sin enunciado');
    }
    if (falta.length) gap('regla-ptsa', id, falta.join(' · ')); else tick('regla-ptsa');
  }

  // Reglas citadas que no existen
  const citadas = new Set([...opTxt.matchAll(/\b([A-Z]+-[RP]\d+)\b/g)].map((m) => m[1]));
  const specIds = new Set([...SPEC.matchAll(/`(PTSA-R\d+)`/g)].map((m) => m[1]));
  const ruleIds = new Set([...RULES.matchAll(/`(PTSA-R\d+)`/g)].map((m) => m[1]));
  for (const id of citadas) {
    if (defs.has(id) || specIds.has(id) || ruleIds.has(id)) continue;
    if (/^RULE-/.test(id)) continue;
    gap('regla', id, 'citada y no definida en ningún sitio');
  }
}

// ── 2. FASES ────────────────────────────────────────────────────────────────
{
  const PROMPTS = {
    FDGE: 'FDGE-Prompts.md', Foundation: 'Foundation-Prompts.md',
    QA: 'QA/QA-Prompts.md', PTSA: 'PTSA/PTSA-Prompts.md', FPGE: 'FPGE-Prompts.md',
  };
  const esperadas = {
    FDGE: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    Foundation: [0, 1, 2, 3, 4, 5, 6],
    QA: [1, 2, 3, 4, 5, 6, 7],
    PTSA: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  };
  for (const [comp, nums] of Object.entries(esperadas)) {
    const prompt = rd(PROMPTS[comp]) ?? '';
    for (const n of nums) {
      const falta = [];
      // Un documento puede declarar un rango («PHASE 2-4», «PHASE 11-12») o una línea
      // compacta de componente («FND 0 Recon · 1 Reconciliation · …»). Ambas cuentan.
      const cubre = (txt) => {
        if (txt.includes(`PHASE ${n} `) || txt.includes(`PHASE ${n}·`) || txt.includes(`PHASE ${n}\n`)) return true;
        for (const m of txt.matchAll(/PHASE\s+(\d+)\s*[-–]\s*(\d+)/g)) {
          if (n >= Number(m[1]) && n <= Number(m[2])) return true;
        }
        const sigla = comp === 'Foundation' ? 'FND' : comp;
        for (const m of txt.matchAll(new RegExp(`^${sigla}\\s+([^\\n]*(?:\\n\\s{6,}[^\\n]*)*)`, 'gm'))) {
          const nums = [...m[1].matchAll(/(?:^|[^\d])(\d{1,2})(?:-(\d{1,2}))?\s/g)];
          for (const x of nums) {
            const a = Number(x[1]); const b = x[2] ? Number(x[2]) : a;
            if (n >= a && n <= b) return true;
          }
        }
        return false;
      };
      const enPhases = cubre(PHASES);
      const enCore = cubre(CORE);
      const enPrompt = cubre(prompt);
      if (!enPhases) falta.push('PHASES.md');
      if (!enPrompt) falta.push(PROMPTS[comp]);
      if (!enCore) falta.push('CORE.md');
      if (falta.length) gap('fase', `${comp} PHASE ${n}`, `ausente en: ${falta.join(', ')}`); else tick('fase');
    }
  }
  // Las 11 fases de FDGE y las 5 compuertas deben estar en los diagramas del README
  for (let n = 0; n <= 10; n++) {
    if (!README.includes(`PHASE ${n}`)) gap('fase', `FDGE PHASE ${n}`, 'no aparece en los diagramas del README');
    else tick('fase-diagrama');
  }
  for (const g of ['G0', 'G1', 'G2', 'G3', 'G4']) {
    if (!README.includes(g)) gap('compuerta', g, 'no aparece en los diagramas del README');
    else tick('compuerta');
  }
}

// ── 3. TRIGGERS ─────────────────────────────────────────────────────────────
{
  const trg = [...LEXICON.matchAll(/^\|\s*`(\[?[A-Za-z][^`]*?)`\s*\|\s*(\w+)/gm)]
    .map((m) => m[1])
    // El filtro enumeraba solo los prefijos que ya existian: un trigger NUEVO con otro verbo
    // —[INSTALL SUITE]— no entraba en el universo y su ausencia de los documentos operativos
    // no se veia. Es el mismo modo de fallo que PTSA-R76 arregla para las auditorias.
    .filter((t) => /^\[[A-Z]|^resume |^delta |^status |^promote |^audit |^close /.test(t));
  for (const t of [...new Set(trg)]) {
    const base = (t.match(/^\[[^\]]+\]/) ?? [t.split(/\s+/).slice(0, 2).join(' ')])[0].trim();
    const falta = [];
    if (!CORE.includes(base)) falta.push('CORE.md');
    if (!PHASES.includes(base) && !CORE.includes(base)) falta.push('PHASES.md');
    if (!opTxt.includes(base)) falta.push('ningún documento operativo');
    if (falta.length) gap('trigger', t, `ausente en: ${falta.join(', ')}`); else tick('trigger');
  }
}

// ── 4. ARTEFACTOS ───────────────────────────────────────────────────────────
{
  // Ledgers e indices de §6.2 MAS los espacios de trabajo de §6.3 a §6.5. Enumerar solo §6.2
  // dejaba fuera todo artefacto de PT, de QA y de PTSA: un archivo que ningun instalador crea
  // y ningun documento operativo usa pasaba la auditoria sin que nadie lo mirara.
  const tramo = (a, b) => LEXICON.slice(LEXICON.indexOf(a), LEXICON.indexOf(b));
  const sec = tramo('### 6.2', '### 6.3');
  const wsp = tramo('### 6.3', '### 6.6');
  const arts = [...sec.matchAll(/^([A-Z][A-Z_]+\.(?:log|md|json))\s/gm)].map((m) => m[1]);
  // En los espacios de trabajo los nombres van indentados dentro del bloque de codigo, y
  // conviven con plantillas de nombre variable (P-NNN.md, QA-NNN.md) que no se enumeran.
  // Criterio distinto: NO los crea el instalador, los ESCRIBE el agente en una fase. Lo que
  // hay que comprobar es que alguna fase del procedimiento canonico los produzca.
  const wArts = [...new Set(
    [...wsp.matchAll(/^\s{2,}([A-Za-z][A-Za-z0-9_.-]*\.(?:md|json|yaml|ts))\s/gm)].map((m) => m[1])
      .filter((f) => !/^[A-Z]+-N{2,}|N{3}/.test(f)),
  )];
  for (const a of wArts) {
    const falta = [];
    if (!PHASES.includes(a) && !CORE.includes(a)) falta.push('ninguna fase del procedimiento lo produce');
    if (!opTxt.includes(a)) falta.push('ningún documento operativo lo usa');
    if (falta.length) gap('artefacto', a, falta.join(' · ')); else tick('artefacto');
  }
  const instalador = (existsSync(join(ROOT, 'README.md')) ? readFileSync(join(ROOT, 'README.md'), 'utf8') : '')
    + (rd('FIDE/FIDE-Implementation.md') ?? '') + (rd('FIDE/FIDE-CLAUDE-Launcher.md') ?? '');
  for (const a of [...new Set(arts)]) {
    const falta = [];
    if (!instalador.includes(a)) falta.push('ningún instalador lo crea');
    if (!opTxt.includes(a)) falta.push('ningún documento operativo lo usa');
    if (falta.length) gap('artefacto', a, falta.join(' · ')); else tick('artefacto');
  }
  // Archivos de la metodología declarados en §6.6 vs los que existen
  // Acotar al PRIMER bloque ``` de §6.6: el resto del documento son notas de derogación,
  // y contarlas daba 15 falsos positivos.
  const desde = LEXICON.indexOf('### 6.6');
  const ini = LEXICON.indexOf('```', desde);
  const fin = LEXICON.indexOf('```', ini + 3);
  const sec6 = ini > 0 && fin > ini ? LEXICON.slice(ini + 3, fin) : '';
  const declarados = new Set([...sec6.matchAll(/([A-Za-z][A-Za-z0-9_.-]*\.(?:md|mjs|sh))/g)].map((m) => m[1]));
  for (const [f] of [...mds, ...tools]) {
    const nombre = f.split('/').pop();
    if (!declarados.has(nombre)) gap('archivo', f, 'existe y no está declarado en LEXICON §6.6');
    else tick('archivo');
  }
  for (const d of declarados) {
    if (![...mds, ...tools].some(([f]) => f.endsWith(d))) gap('archivo', d, 'declarado en LEXICON §6.6 y no existe');
  }
}

// ── 5. PLANTILLAS ───────────────────────────────────────────────────────────
// Enumerar TODOS los directorios templates/ de la suite, no solo el de INTAKE: una plantilla
// en una familia no enumerada pasaba la auditoría como simple «archivo» y nadie comprobaba
// que estuviera referenciada ni que tuviera sus bloques obligatorios.
{
  const FAMILIAS = [
    {
      dir: 'INTAKE/templates',
      // Quien debe referenciar cada plantilla de esta familia
      refs: ['INTAKE/Intake-Protocol.md'],
      // La familia tiene dos clases desde FDGE-R51: la completa, que se firma, y la LIGERA de
      // una tarea dentro de una implementacion ya firmada, que hereda firma y veredicto del
      // lote. Exigirle a la ligera lo que define a la pesada la volveria pesada otra vez.
      exigeSi: (txt) => (/Firmado por lote/.test(txt) && !/Solicitado por/.test(txt)
        ? [[/Firmado por lote/, 'una plantilla ligera tiene que declarar de qué lote hereda']]
        : [
          [/##\s*(?:\d+[.)]\s*)?Firma/i, 'sin bloque de Firma'],
          [/VEREDICTO/, 'sin bloque de veredicto G1'],
        ]),
    },
    {
      dir: 'PTSA/templates',
      refs: ['PTSA/PTSA-V3-Especificacion-Oficial.md', 'PTSA/PTSA-Prompts.md'],
      exige: [
        [/PASS/, 'sin veredicto PASS'],
        [/FAIL/, 'sin veredicto FAIL'],
        [/NO_APLICA/, 'sin veredicto NO_APLICA'],
        [/NO_EVALUADA/, 'sin veredicto NO_EVALUADA'],
        [/coverage\s*=/, 'sin línea «coverage =»'],
      ],
    },
  ];
  for (const fam of FAMILIAS) {
    const dir = join(BASE, ...fam.dir.split('/'));
    if (!existsSync(dir)) { gap('plantilla', fam.dir + '/', 'no existe'); continue; }
    const refTxt = fam.refs.map((r) => rd(r) ?? '').join('\n');
    for (const t of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const falta = [];
      if (!refTxt.includes(t)) falta.push(`${fam.refs.join(' ni ')} no la referencian`);
      const txt = readFileSync(join(dir, t), 'utf8');
      const exige = fam.exigeSi ? fam.exigeSi(txt) : fam.exige;
      for (const [re, msg] of exige) if (!re.test(txt)) falta.push(msg);
      if (falta.length) gap('plantilla', `${fam.dir}/${t}`, falta.join(' · ')); else tick('plantilla');
    }
  }
}

// ── 6. ESTADOS Y ENUMERACIONES ──────────────────────────────────────────────
{
  const lifecycle = ['DRAFT', 'READY', 'REOPENED', 'IN_PROGRESS', 'BLOCKED', 'BLOCKED_DOMAIN',
    'IN_REVIEW', 'VALIDATION_PENDING', 'DONE', 'INTEGRATED', 'CLOSED', 'REJECTED', 'DEFERRED', 'REVERTED'];
  for (const s of lifecycle) {
    if (!opTxt.includes(s)) gap('estado', s, 'definido en LEXICON y no usado en ningún documento operativo');
    else tick('estado');
  }
  const enums = {
    tipo: ['BUG', 'FEATURE', 'REFACTOR', 'INVESTIGATION', 'CHORE'],
    track: ['STANDARD', 'EXPRESS', 'HOTFIX'],
    severidad: ['S1', 'S2', 'S3', 'S4'],
    modo: ['MANUAL', 'SUPERVISED', 'AUTONOMOUS'],
  };
  for (const [clase, vals] of Object.entries(enums)) {
    for (const v of vals) {
      // El criterio es CORE.md: es lo único que el agente carga. PHASES es procedimiento y
      // no tiene por qué enumerar clasificaciones — esas vienen de LEXICON vía CORE.
      if (!CORE.includes(v)) gap(clase, v, 'ausente en CORE.md, que es lo único que el agente carga');
      else tick(clase);
    }
  }
}

// ── 7. HERRAMIENTAS ─────────────────────────────────────────────────────────
{
  const selftest = rd('tools/selftest.sh') ?? '';
  for (const [f] of tools) {
    if (f.endsWith('selftest.sh')) { tick('herramienta'); continue; }
    const nombre = f.split('/').pop();
    const falta = [];
    if (!selftest.includes(nombre.replace('.mjs', ''))) falta.push('selftest no la ejercita');
    if (!opTxt.includes(nombre)) falta.push('ningún documento la menciona');
    if (falta.length) gap('herramienta', nombre, falta.join(' · ')); else tick('herramienta');
  }
  // La cabecera de este script prometia «sintaxis valida» y nunca lo comprobaba: una
  // herramienta rota pasaba la auditoria entera. Una promesa sin implementar es peor que una
  // ausencia, porque nadie va a buscar lo que cree que ya esta cubierto.
  for (const [f] of tools) {
    const abs = join(BASE, ...f.split('/'));
    const cmd = f.endsWith('.mjs') ? ['node', ['--check', abs]] : ['bash', ['-n', abs]];
    try {
      execFileSync(cmd[0], cmd[1], { stdio: 'pipe' });
      tick('herramienta');
    } catch (e) {
      const detalle = String(e.stderr ?? e.message).split(/\r?\n/).find((l) => l.trim()) ?? 'error de sintaxis';
      gap('herramienta', f, `no compila: ${detalle.slice(0, 140)}`);
    }
  }

  // Bytes de control dentro del codigo fuente. Ha ocurrido SEIS veces en este proyecto: una
  // capa de escapado convierte \b en 0x08 y \s en «s», y el regex resultante es sintacticamente
  // valido pero no casa NADA. El fallo es silencioso —el verificador dice «sin errores» porque
  // no encuentra nada que reprochar— y por eso ninguna revision por lectura lo veia.
  for (const [f, txt] of tools) {
    const malos = [...txt].filter((c) => {
      const n = c.charCodeAt(0);
      return n < 32 && n !== 9 && n !== 10 && n !== 13;
    });
    if (!malos.length) { tick('herramienta'); continue; }
    const cods = [...new Set(malos.map((c) => `0x${c.charCodeAt(0).toString(16).padStart(2, '0')}`))];
    gap('herramienta', f, `${malos.length} byte(s) de control ${cods.join(' ')} en el código: una secuencia de escape se perdió al editar. El regex compila y no casa nada — el fallo es silencioso. → perl -i -pe 's/\\x08//g' ${f}`);
  }
}

// ── 8. SUITE-R26 · cobertura mecanica por componente ────────────────────────
// La auditoria adversaria de la 5.2.0 midio esto por primera vez y encontro QA 0/19 y FPGE
// 0/10: dos componentes enteros cuyas reglas solo se cumplian por buena voluntad. No se exige
// el 100 % —hay reglas que ningun script puede comprobar— pero el hueco se declara.
const coberturaMecanica = (() => {
  const porComp = {};
  for (const m of RULES.matchAll(/^\|\s*`([A-Z]+)-R(\d+)`\s*\|\s*(HARD|SOFT|CHECK)\s*\|/gm)) {
    const [, comp, num, sev] = m;
    if (sev === 'SOFT') continue;
    const c = (porComp[comp] ??= { total: 0, verificadas: 0 });
    c.total++;
    if (toolsTxt.includes(`${comp}-R${num}`)) c.verificadas++;
  }
  return porComp;
})();
for (const [comp, c] of Object.entries(coberturaMecanica)) {
  if (c.verificadas === 0 && c.total > 0) {
    gap('cobertura-mecanica', comp, `${c.total} regla(s) HARD/CHECK y NINGUNA con verificación mecánica. Una regla que solo se cumple por buena voluntad es una recomendación (SUITE-R26).`);
  } else tick('cobertura-mecanica');
}

// ── Informe ─────────────────────────────────────────────────────────────────
console.log(`audit — cobertura de la Methodology Suite\nBase: ${BASE}\n`);
if (gaps.length) {
  const porClase = {};
  for (const g of gaps) (porClase[g.clase] ??= []).push(g);
  for (const [clase, lista] of Object.entries(porClase)) {
    console.log(`HUECOS · ${clase} (${lista.length})`);
    for (const g of lista) console.log(`  ✗ ${g.elem}\n      ${g.falta}`);
    console.log('');
  }
}
const resumen = Object.entries(okCount).filter(([k]) => k !== 'total')
  .map(([k, v]) => `${k}:${v}`).join(' · ');
console.log(`Cubiertos: ${okCount.total}  (${resumen})`);
console.log(gaps.length ? `\n${gaps.length} hueco(s) de cobertura.` : '\nCobertura completa: sin huecos.');
process.exit(gaps.length ? 1 : 0);
