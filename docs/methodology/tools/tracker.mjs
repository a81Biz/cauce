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
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

// ─── Lógica pura · exportada para poder probarla sin plataforma ──────────────
// PT-001 · El adaptador habla con `gh`; la comparación no habla con nadie.
//
// Separarlos no es un adorno: es lo que hace la diferencia entre poder probar el espejo y no
// poder. Sombrear un ejecutable en el PATH no es portable entre Windows y Ubuntu —se probó, y
// node siguió resolviendo el `gh` real— y ningún caso del arnés puede exigir `gh` AUTENTICADO,
// porque el arnés corre en CI y un PR desde un fork no recibe credenciales. Un caso así sería
// el rojo permanente que `SUITE-R35` existe para evitar.

// PT-001 · `VALIDATION_PENDING` y `DONE` FALTABAN, y se vio ejecutando el espejo de verdad:
// PT-004 pasó a DONE esperando su G4 y su issue quedó denunciado como huérfano. Un PT que
// espera el merge no es trabajo cerrado — es lo más abierto que hay, porque lo que le queda es
// una compuerta humana. `SUITE-R36` dice «solo lo vivo» y lo cerrado empieza en INTEGRATED.
export const VIVOS = new Set(['DRAFT', 'READY', 'REOPENED', 'IN_PROGRESS', 'BLOCKED',
  'BLOCKED_DOMAIN', 'VALIDATION_PENDING', 'DONE']);

/** Las allocations que el espejo cubre. Lo cerrado es evidencia, no estado (`SUITE-R36`). */
export const vivasDe = (allocations) =>
  (Array.isArray(allocations) ? allocations : []).filter((a) => VIVOS.has(a?.status));

/** Compara registro y plataforma EN LAS DOS DIRECCIONES. Sin efectos y sin red. */
export function compararEspejo(vivas, issues) {
  const div = [];
  const porNumero = new Map((issues ?? []).map((i) => [i.number, i]));
  for (const a of vivas ?? []) {
    if (!a.issue) {
      div.push({ regla: 'SUITE-R35', mensaje: `${a.id} está vivo (${a.status}) y no tiene issue. Lo que está abierto tiene que poder consultarse sin leer el repositorio entero.` });
    } else if (!porNumero.has(a.issue)) {
      div.push({ regla: 'SUITE-R35', mensaje: `${a.id} está vivo (${a.status}) y su issue #${a.issue} no está abierto. O el trabajo terminó y el registro no se enteró, o alguien cerró el issue a mano.` });
    }
  }
  const reclamados = new Set((vivas ?? []).map((a) => a.issue).filter(Boolean));
  for (const i of issues ?? []) {
    if (!reclamados.has(i.number)) {
      div.push({ regla: 'SUITE-R35', mensaje: `El issue #${i.number} «${String(i.title ?? '').slice(0, 50)}» está abierto y ninguna allocation viva lo reclama. Se está trabajando en algo que el registro no conoce.` });
    }
  }
  return div;
}

/** Las etiquetas que `abrir` necesita y que la plataforma todavía no tiene (`FND-R30`). */
export const ETIQUETAS = ['implementación', 'tarea'];
export const etiquetasQueFaltan = (existentes) =>
  ETIQUETAS.filter((e) => !(existentes ?? []).includes(e));

/** Una nota de reanclaje declara una transición de fase (`FDGE-R52`), no es un comentario suelto. */
export const RE_NOTA = /PHASE\s*\d+\s*(?:→|->|a)\s*\d+|PHASE\s*\d+\s*→/i;
export const contarNotas = (textos) => (textos ?? []).filter((t) => RE_NOTA.test(String(t))).length;

const ARGS = process.argv.slice(2);
const ACCION = ARGS[0] ?? 'espejo';
const APLICAR = ARGS.includes('--aplicar');
// El identificador de `notas PT-NNN` no es una ruta: sin excluirlo, `tracker notas PT-004 .`
// resolvia ROOT como el directorio «PT-004» y no encontraba el registro.
const ROOT = resolve(ARGS.slice(1).find((a) => !a.startsWith('--') && !/^PT-\d+$/.test(a)) ?? process.cwd());
const IMPL = join(ROOT, 'docs', 'implementation');

const errores = [];
const notas = [];
const fail = (r, m) => errores.push({ r, m });
const di = (s = '') => console.log(s);

const leerJSON = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };

// ── Qué plataforma, y hay acceso ────────────────────────────────────────────
// La plataforma se DECLARA en el registro. Deducirla de la URL del remoto adivinaría, y
// adivinar es como se acaba escribiendo en el sitio equivocado.
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
    comentarios(numero) {
      const out = execFileSync('gh', ['issue', 'view', String(numero), '--json', 'comments'],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return (JSON.parse(out).comments ?? []).map((c) => c.body ?? '');
    },
    // FND-R30 · `abrir` necesita estas etiquetas y `gh issue create` falla sin ellas. Se
    // descubrió abriendo los issues de EP-001: no existían y hubo que crearlas a mano.
    etiquetas() {
      try {
        const out = execFileSync('gh', ['label', 'list', '--json', 'name'],
          { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
        return JSON.parse(out).map((l) => l.name);
      } catch { return []; }
    },
    crearEtiqueta(nombre) {
      execFileSync('gh', ['label', 'create', nombre, '--description',
        `Espejo de REGISTRY.json (SUITE-R35) · ${nombre}`], { cwd: ROOT, stdio: 'pipe' });
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

/**
 * Qué hacer antes de tocar nada, según lo que el proyecto declara y el acceso que hay.
 * `sonda` responde si la plataforma es alcanzable; se inyecta para poder probar la decisión
 * sin depender de qué binarios estén instalados en la máquina que ejecuta el arnés.
 *
 *   0  declarada y con acceso        2  sin plataforma declarada — elección legítima
 *   3  declarada y SIN acceso        ← FND-R30
 *
 * `2` y `3` estaban fundidos en `2` y son decisiones OPUESTAS: una es una elección del
 * proyecto, la otra una precondición incumplida. El código de salida es el contrato que
 * consumen las compuertas, así que tiene que distinguirlas.
 */
export function decidirSalida(reg, sonda, adaptadores = ADAPTADORES) {
  const p = reg?.tracker?.plataforma ?? null;
  if (!p) {
    return { codigo: 2, plataforma: null, mensaje: [
      'El proyecto no declara plataforma de trabajo en REGISTRY.tracker.plataforma.', '',
      '  "tracker": { "plataforma": "github" }     o  "azure"', '',
      'Sin ella el estado vive solo en el repositorio, que sigue siendo válido: la plataforma',
      'responde «qué está abierto», no «qué se decidió». Declararla es opcional y humano.',
    ].join('\n') };
  }
  const ad = adaptadores[p];
  if (!ad) {
    return { codigo: 2, plataforma: p,
      mensaje: `Plataforma desconocida: ${p}. Conocidas: ${Object.keys(adaptadores).join(', ')}` };
  }
  if (!(sonda ?? ad.disponible)()) {
    return { codigo: 3, plataforma: p, mensaje: [
      `Plataforma ${p} declarada y sin acceso desde aquí.`,
      `  → ${ad.comoAutenticarse}`, '',
      'La credencial se comprueba ANTES de necesitarla (FND-R30): descubrirlo a mitad de sesión',
      'es perder la sesión. Esto no es «el espejo no cuadra» — es que nadie pudo mirar.',
    ].join('\n') };
  }
  return { codigo: 0, plataforma: p, mensaje: null };
}

// ─── El programa. Solo corre si me ejecutan directamente ────────────────────
// Importarme para probar la lógica de arriba no debe leer un registro, abrir un proceso ni
// exigir credenciales. Sin este guard, importar el módulo ejecutaba la herramienta entera.
const EJECUTADO_DIRECTO = !!process.argv[1]
  && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (EJECUTADO_DIRECTO) {
const reg = leerJSON(join(IMPL, 'REGISTRY.json'));
if (!reg) { console.error('No hay docs/implementation/REGISTRY.json legible.'); process.exit(2); }
const PLATAFORMA = reg.tracker?.plataforma ?? null;


const D = decidirSalida(reg, null);
if (D.codigo !== 0) {
  (D.codigo === 2 ? di : console.error)(D.mensaje);
  process.exit(D.codigo);
}
const adaptador = ADAPTADORES[PLATAFORMA];

// ── Qué está vivo según el registro ─────────────────────────────────────────
const all = Array.isArray(reg.allocations) ? reg.allocations : [];
const vivas = vivasDe(all);

// ── espejo ──────────────────────────────────────────────────────────────────
// El adaptador trae los issues; la comparación es la función pura de arriba, que es la que
// el arnés puede probar sin credenciales.
function espejo() {
  const issues = adaptador.abiertos();
  for (const d of compararEspejo(vivas, issues)) fail(d.regla, d.mensaje);
  if (!errores.length) {
    notas.push(`${vivas.length} allocation(s) viva(s) y ${issues.length} issue(s) abierto(s): el espejo cuadra.`);
  }
}

// ── notas · cuántas notas de reanclaje lleva el issue de un PT (FDGE-R52) ────
// Solo lectura. Existe para que `verify-fdge` no necesite su propio cliente de plataforma:
// la regla la hace cumplir el verificador, el acceso lo encapsula quien ya lo tiene.
function notasDe() {
  const pt = ARGS.slice(1).find((a) => /^PT-\d+$/.test(a));
  if (!pt) { console.error('Uso: tracker.mjs notas PT-NNN [ruta]'); process.exit(2); }
  const a = all.find((x) => x?.id === pt);
  if (!a?.issue) { console.log('0'); return; }
  console.log(String(contarNotas(adaptador.comentarios(a.issue))));
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
  // FND-R30 · el terreno se prepara antes de necesitarlo. `gh issue create` falla si la
  // etiqueta no existe, y hasta ahora eso se descubria a mitad de la creacion del primer issue.
  if (adaptador.etiquetas) {
    const faltan = etiquetasQueFaltan(adaptador.etiquetas());
    for (const e of faltan) {
      try { adaptador.crearEtiqueta(e); notas.push(`etiqueta «${e}» creada`); }
      catch { fail('FND-R30', `falta la etiqueta «${e}» y no se pudo crear. Créala y repite:  gh label create "${e}"`); }
    }
    if (errores.length) return;
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

const acciones = { espejo, abrir, cerrar, notas: notasDe };
if (!acciones[ACCION]) {
  console.error(`Acción desconocida: ${ACCION}. Conocidas: ${Object.keys(acciones).join(' · ')}`);
  process.exit(2);
}
if (ACCION === 'notas') { try { notasDe(); process.exit(0); } catch (e) { console.error(String(e.message ?? e)); process.exit(1); } }
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

} // fin de EJECUTADO_DIRECTO
