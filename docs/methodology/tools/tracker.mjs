#!/usr/bin/env node
/**
 * tracker — el espejo entre el registro del proyecto y la plataforma de trabajo.
 *
 * POR QUÉ EXISTE
 *   El estado vivía en el contexto del agente. Cuando la sesión se comprime o termina se
 *   pierde, y la siguiente empieza explicando otra vez qué se estaba haciendo. Sacarlo a una
 *   plataforma —GitHub, Azure— lo vuelve consultable en un comando y deja de depender de la
 *   memoria de nadie.
 *
 * EL RIESGO QUE RESUELVE, Y NO CREA
 *   `SUITE-R08` exige que todo identificador salga de `REGISTRY.json`. Si la plataforma
 *   también asignara, habría dos fuentes divergiendo — la causa raíz que la v4 nació para
 *   eliminar, reintroducida por la puerta nueva. Aquí el registro **asigna** y la plataforma
 *   **espeja**: cada allocation guarda su número de issue, y el espejo se comprueba por
 *   enumeración en las dos direcciones (`SUITE-R35`).
 *
 * QUÉ RESPONDE CADA UNO
 *   La plataforma:  qué está abierto y qué sigue.
 *   El repositorio: qué se decidió y qué se probó.
 *
 * POR QUÉ CLI Y NO MCP
 *   La verificación tiene que correr en integración continua, donde no hay nadie delante para
 *   autorizar un servidor MCP por OAuth. `gh` y `az` funcionan sin cabeza, con un token.
 *
 * Uso:  node tracker.mjs <espejo|abrir|cerrar> [ruta-proyecto] [--aplicar]
 * Exit: 0 en orden · 1 divergencia o error · 2 sin plataforma configurada
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/).
 */

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const ARGS = process.argv.slice(2);
const ACCION = ARGS[0] ?? 'espejo';
const APLICAR = ARGS.includes('--aplicar');
const ROOT = resolve(ARGS.slice(1).find((a) => !a.startsWith('--')) ?? process.cwd());
const IMPL = join(ROOT, 'docs', 'implementation');

const errores = [];
const notas = [];
const fail = (r, m) => errores.push({ r, m });
const di = (s = '') => console.log(s);

const leerJSON = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };
const reg = leerJSON(join(IMPL, 'REGISTRY.json'));
if (!reg) { console.error('No hay docs/implementation/REGISTRY.json legible.'); process.exit(2); }

// ── Qué plataforma, y hay acceso ────────────────────────────────────────────
// La plataforma se DECLARA en el registro. Deducirla de la URL del remoto adivinaría, y
// adivinar es como se acaba escribiendo en el sitio equivocado.
const PLATAFORMA = reg.tracker?.plataforma ?? null;
const ADAPTADORES = {
  github: {
    disponible: () => { try { execFileSync('gh', ['auth', 'status'], { stdio: 'pipe' }); return true; } catch { return false; } },
    comoAutenticarse: 'gh auth login',
    abiertos() {
      const out = execFileSync('gh', ['issue', 'list', '--state', 'open', '--limit', '500',
        '--json', 'number,title,state'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return JSON.parse(out);
    },
    crear(titulo, cuerpo, etiquetas) {
      const args = ['issue', 'create', '--title', titulo, '--body', cuerpo];
      for (const e of etiquetas ?? []) args.push('--label', e);
      const out = execFileSync('gh', args, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
      return Number(out.split('/').pop());
    },
    cerrar(numero, motivo) {
      execFileSync('gh', ['issue', 'close', String(numero), '--comment', motivo],
        { cwd: ROOT, stdio: 'pipe' });
    },
  },
  azure: {
    disponible: () => { try { execFileSync('az', ['--version'], { stdio: 'pipe' }); return true; } catch { return false; } },
    comoAutenticarse: 'az login && az extension add --name azure-devops',
    abiertos() {
      throw new Error('El adaptador de Azure DevOps declara el contrato y no lo implementa todavía. '
        + 'Se escribe contra un caso real, no contra ninguno: es lo que evitó que el de GitHub '
        + 'naciera con suposiciones. El contrato está en LEXICON §tracker.');
    },
    crear() { return ADAPTADORES.azure.abiertos(); },
    cerrar() { return ADAPTADORES.azure.abiertos(); },
  },
};

if (!PLATAFORMA) {
  di('El proyecto no declara plataforma de trabajo en REGISTRY.tracker.plataforma.');
  di('');
  di('  "tracker": { "plataforma": "github" }     o  "azure"');
  di('');
  di('Sin ella el estado vive solo en el repositorio, que sigue siendo válido: la plataforma');
  di('responde «qué está abierto», no «qué se decidió». Declararla es opcional y humano.');
  process.exit(2);
}
const adaptador = ADAPTADORES[PLATAFORMA];
if (!adaptador) { console.error(`Plataforma desconocida: ${PLATAFORMA}. Conocidas: ${Object.keys(ADAPTADORES).join(', ')}`); process.exit(2); }
if (!adaptador.disponible()) {
  console.error(`Plataforma ${PLATAFORMA} declarada y sin acceso desde aquí.`);
  console.error(`  → ${adaptador.comoAutenticarse}`);
  process.exit(2);
}

// ── Qué está vivo según el registro ─────────────────────────────────────────
const VIVOS = new Set(['DRAFT', 'READY', 'REOPENED', 'IN_PROGRESS', 'BLOCKED', 'BLOCKED_DOMAIN']);
const all = Array.isArray(reg.allocations) ? reg.allocations : [];
const vivas = all.filter((a) => VIVOS.has(a?.status));

// ── espejo ──────────────────────────────────────────────────────────────────
function espejo() {
  const issues = adaptador.abiertos();
  const porNumero = new Map(issues.map((i) => [i.number, i]));

  // Toda allocation viva necesita issue abierto.
  const sinIssue = vivas.filter((a) => !a.issue);
  const conIssueMuerto = vivas.filter((a) => a.issue && !porNumero.has(a.issue));
  for (const a of sinIssue) {
    fail('SUITE-R35', `${a.id} está vivo (${a.status}) y no tiene issue. Lo que está abierto tiene que poder consultarse sin leer el repositorio entero.`);
  }
  for (const a of conIssueMuerto) {
    fail('SUITE-R35', `${a.id} está vivo (${a.status}) y su issue #${a.issue} no está abierto. O el trabajo terminó y el registro no se enteró, o alguien cerró el issue a mano.`);
  }

  // Todo issue abierto tiene que corresponder a una allocation viva.
  const reclamados = new Set(vivas.map((a) => a.issue).filter(Boolean));
  const huerfanos = issues.filter((i) => !reclamados.has(i.number));
  for (const i of huerfanos) {
    fail('SUITE-R35', `El issue #${i.number} «${i.title.slice(0, 50)}» está abierto y ninguna allocation viva lo reclama. Se está trabajando en algo que el registro no conoce.`);
  }

  if (!errores.length) {
    notas.push(`${vivas.length} allocation(s) viva(s) y ${issues.length} issue(s) abierto(s): el espejo cuadra.`);
  }
}

// ── abrir · crea los issues que faltan, con permiso ─────────────────────────
function abrir() {
  const pendientes = vivas.filter((a) => !a.issue);
  if (!pendientes.length) { notas.push('Nada que abrir: toda allocation viva tiene su issue.'); return; }
  if (!APLICAR) {
    di(`${pendientes.length} allocation(s) viva(s) sin issue:`);
    for (const a of pendientes) di(`  ${a.id}  ${a.type}  ${a.slug ?? ''}`);
    di('');
    di('  --aplicar   los crea. Sin la marca, esto solo enumera.');
    return;
  }
  for (const a of pendientes) {
    // El issue REFERENCIA el intake; no lo copia. Dos copias del mismo texto divergen — es la
    // causa raiz que la v4 nacio para eliminar, reintroducida por la puerta nueva.
    const dir = a.slug ? `changes/${a.id}-${a.slug}` : `changes/${a.id}`;
    const cuerpo = [
      `**${a.type}** · severidad ${a.severity ?? '—'} · ${a.epic ? `implementación ${a.epic}` : 'sin implementación'}`,
      '',
      `Intake, criterios de aceptación y evidencia: [\`${dir}/\`](${dir}/)`,
      '',
      '> Este issue dice **qué está abierto**. Lo que se decidió y lo que se probó vive en el',
      '> repositorio, versionado junto al código. No se copia aquí: dos copias del mismo texto',
      '> divergen.',
    ].join('\n');
    const etiquetas = [a.type === 'EP' ? 'implementación' : 'tarea'];
    const n = adaptador.crear(`${a.id} · ${a.slug ?? a.type}`, cuerpo, etiquetas);
    a.issue = n;
    notas.push(`${a.id} → issue #${n}`);
  }
  writeFileSync(join(IMPL, 'REGISTRY.json'), JSON.stringify(reg, null, 2) + '\n');
}

// ── cerrar · los issues cuyo trabajo ya no está vivo ────────────────────────
function cerrar() {
  const muertas = all.filter((a) => a.issue && !VIVOS.has(a?.status));
  const issues = adaptador.abiertos();
  const abiertos = new Set(issues.map((i) => i.number));
  const porCerrar = muertas.filter((a) => abiertos.has(a.issue));
  if (!porCerrar.length) { notas.push('Nada que cerrar.'); return; }
  if (!APLICAR) {
    di(`${porCerrar.length} issue(s) de trabajo ya terminado:`);
    for (const a of porCerrar) di(`  #${a.issue}  ${a.id}  ${a.status}`);
    di('');
    di('  --aplicar   los cierra.');
    return;
  }
  for (const a of porCerrar) {
    adaptador.cerrar(a.issue, `${a.id} pasó a ${a.status}. La evidencia está en el repositorio.`);
    notas.push(`#${a.issue} cerrado · ${a.id} ${a.status}`);
  }
}

const acciones = { espejo, abrir, cerrar };
if (!acciones[ACCION]) {
  console.error(`Acción desconocida: ${ACCION}. Conocidas: ${Object.keys(acciones).join(' · ')}`);
  process.exit(2);
}
try { acciones[ACCION](); } catch (e) { console.error(String(e.message ?? e)); process.exit(1); }

console.log(`tracker · ${PLATAFORMA} · acción ${ACCION}\n`);
for (const n of notas) console.log(`  · ${n}`);
if (errores.length) {
  console.log('');
  for (const e of errores) console.log(`  ✗ ${e.r.padEnd(12)} ${e.m}`);
  console.log(`\n${errores.length} divergencia(s) entre el registro y la plataforma.`);
  process.exit(1);
}
console.log(errores.length ? '' : '\nSin divergencias.');
process.exit(0);
