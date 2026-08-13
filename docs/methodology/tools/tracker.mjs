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
  'BLOCKED_DOMAIN', 'VALIDATION_PENDING', 'DONE',
  // PT-013 · un aplazado esta VIVO para el espejo: su issue permanece abierto y en el tablero.
  // Para la verificacion esta exento —no tiene intake ni fases— y esos dos signos opuestos son
  // lo que hace que aplazar algo lo ponga a la vista en vez de sacarlo de ella.
  'DEFERRED']);

/** Las allocations que el espejo cubre. Lo cerrado es evidencia, no estado (`SUITE-R36`). */
export const vivasDe = (allocations) =>
  (Array.isArray(allocations) ? allocations : []).filter((a) => VIVOS.has(a?.status));

// PT-007 · La compuerta NO se almacena: se DERIVA de la fase, con el mapa que `CORE.md` §Fases
// ya declara. Un campo `gate` en el registro seria un hecho copiado que alguien tiene que
// acordarse de actualizar (`RULE-01`), y este marco tiene cicatrices de eso.
export const COMPUERTA_DE_FASE = { 1: 'G1', 4: 'G2', 7: 'G3', 9: 'G4' };

/** Las etiquetas que el registro DERIVA para el issue de una allocation. Función pura. */
export function etiquetasDe(alloc) {
  const et = [alloc?.type === 'EP' ? 'implementación' : 'tarea'];
  const f = alloc?.phase;
  if (f !== undefined && f !== null) {
    et.push(`fase: ${f}`);
    const g = COMPUERTA_DE_FASE[Number(f)];
    if (g) et.push(g);
  }
  return et;
}
const RE_DERIVADA = /^(fase: \d+|G[1-4])$/;

/** Compara registro y plataforma EN LAS DOS DIRECCIONES. Sin efectos y sin red. */
export function compararEspejo(vivas, issues) {
  const div = [];
  const porNumero = new Map((issues ?? []).map((i) => [i.number, i]));
  for (const a of vivas ?? []) {
    if (!a.issue) {
      div.push({ regla: 'SUITE-R35', mensaje: `${a.id} está vivo (${a.status}) y no tiene issue. Lo que está abierto tiene que poder consultarse sin leer el repositorio entero.` });
    } else if (!porNumero.has(a.issue)) {
      div.push({ regla: 'SUITE-R35', mensaje: `${a.id} está vivo (${a.status}) y su issue #${a.issue} no está abierto. O el trabajo terminó y el registro no se enteró, o alguien cerró el issue a mano.` });
    } else {
      // El estado publicado tiene que ser el que el registro deriva. Publicarlo sin comprobarlo
      // es escribir en dos sitios y esperar que no se separen — la avería que SUITE-R35 impide.
      const i = porNumero.get(a.issue);
      if (Array.isArray(i.labels)) {
        const tiene = i.labels.map((l) => l.name ?? l).filter((n) => RE_DERIVADA.test(n)).sort();
        const debe = etiquetasDe(a).filter((n) => RE_DERIVADA.test(n)).sort();
        if (tiene.join('|') !== debe.join('|')) {
          div.push({ regla: 'SUITE-R35', mensaje: `${a.id}: su issue #${a.issue} declara «${tiene.join(', ') || '—'}» y el registro dice «${debe.join(', ') || '—'}». El estado de la plataforma se DERIVA del registro: sincronízalo con  tracker abrir --aplicar` });
        }
      }
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
/** Todas las que el registro puede llegar a publicar, incluidas las derivadas (PT-007). */
export const etiquetasNecesarias = (allocs) => [...new Set([...ETIQUETAS,
  ...(allocs ?? []).flatMap((a) => etiquetasDe(a))])];
export const etiquetasQueFaltan = (existentes, necesarias = ETIQUETAS) =>
  necesarias.filter((e) => !(existentes ?? []).includes(e));

// PT-008 · La MARCA de procedencia. No se distingue por autor porque NO SE PUEDE: el agente
// comenta con la credencial de la persona, asi que los dos comentarios llevan el mismo login.
// Se midio antes de decidirlo. La marca es un comentario HTML, invisible al renderizar.
//
// Es falsificable —cualquiera puede pegarla— y eso se declara, como SUITE-R27 declara que
// prueba una firma: lo mecanizable es que la afirmacion sea contrastable, no que sea sincera.
export const MARCA_AGENTE = '<!-- cauce:agente -->';

/**
 * ¿Hay un comentario humano posterior a la ultima nota del agente?
 * `true` pendiente · `false` limpio · `null` NO SE PUEDE SABER — ningun comentario lleva marca,
 * y eso no se aprueba ni se bloquea: se declara (RULE-06). Se cura solo en cuanto el agente
 * escribe uno marcado, sin migracion y sin tocar la historia del issue.
 */
export function comentarioSinResponder(cuerpos) {
  const lista = cuerpos ?? [];
  if (!lista.length) return false;
  const ultimoMarcado = lista.map((c) => String(c).includes(MARCA_AGENTE)).lastIndexOf(true);
  if (ultimoMarcado === -1) return null;
  return lista.slice(ultimoMarcado + 1).some((c) => !String(c).includes(MARCA_AGENTE));
}

/**
 * PT-009 · El mensaje que `tracker` publica al cerrar un issue. Lleva la marca porque lo
 * escribe la herramienta, y sin ella `SUITE-R43` lo contaba como humano: la regla que PT-008
 * creó se cazó a sí misma en la primera ejecución posterior, sobre el propio tracker.
 *
 * Es una función y no una plantilla en línea para que un caso pueda comprobarlo sin hablar
 * con la plataforma — el defecto existía justo porque nadie comprobaba lo que se escribía.
 */
export const mensajeDeCierre = (a) =>
  `${a?.id} pasó a ${a?.status}. La evidencia está en el repositorio.

${MARCA_AGENTE}`;

/**
 * PT-010 · El cuerpo de un issue. Puro y exportado.
 *
 * El anterior componia un solo texto para tarea y para lote, y como un EP no tiene campo
 * `epic` caia en el else y escribia «sin implementacion» SOBRE LA IMPLEMENTACION. Y enlazaba
 * en relativo: en el cuerpo de un issue eso resuelve contra la raiz del sitio, no contra el
 * repositorio, asi que era un 404. Nadie lo detecto con una comprobacion — lo vio una persona
 * mirando el tablero, y por eso «no habia nada» en el issue de EP-002.
 *
 * El enlace apunta a la RAMA POR DEFECTO, no a la de trabajo: un issue es un artefacto largo y
 * una rama es corta. Antes del merge da 404, y el cuerpo lo dice para que no parezca un error.
 *
 * Sin `url` no se inventa ninguna: se escribe la ruta sin enlace y se dice por que (RULE-06).
 */
export function cuerpoDeIssue(a, opciones = {}) {
  const { url, rama, tareas } = opciones;
  const esLote = a?.type === 'EP';
  const dir = a?.slug ? `changes/${a.id}-${a.slug}` : `changes/${a?.id}`;
  const enlace = url
    ? `[\`${dir}/\`](${url}/tree/${rama ?? 'main'}/${dir})`
    : `\`${dir}/\` — en el repositorio`;

  const l = [];
  l.push(esLote
    ? `**Implementación abierta** · ${a.title ?? a.slug ?? ''}`
    : `**${a?.type ?? 'PT'}** · severidad ${a?.severity ?? '—'} · ${a?.epic ? `de la implementación \`${a.epic}\`` : 'sin implementación asignada'}`);
  l.push('');
  if (esLote && (tareas ?? []).length) {
    l.push('Tareas de este lote:');
    l.push('');
    for (const t of tareas) l.push(`- \`${t.id}\`${t.issue ? ` · #${t.issue}` : ''} — ${t.title ?? t.slug ?? ''}`);
    l.push('');
  }
  l.push(`Intake, criterios de aceptación y evidencia: ${enlace}`);
  if (!url) {
    l.push('');
    l.push('> No se pudo derivar la URL del repositorio, así que la ruta va sin enlace:');
    l.push('> inventar una sería peor que no ponerla.');
  } else {
    l.push('');
    l.push(`> El enlace apunta a \`${rama ?? 'main'}\`. Hasta que el trabajo se integre, el`);
    l.push('> contenido vive en la rama de trabajo y este enlace puede no resolver todavía.');
  }
  l.push('');
  l.push('> Este issue dice **qué está abierto**. Lo que se decidió y lo que se probó vive en el');
  l.push('> repositorio, versionado junto al código. **No se copia aquí**: dos copias del mismo');
  l.push('> texto divergen (`SUITE-R35`).');
  return l.join(String.fromCharCode(10));
}

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
        '--json', 'number,title,state,labels'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
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
    // SUITE-R42 · ¿hay pull request abierto para esta rama? Solo lectura: el agente NO abre el
    // PR ni lo fusiona. Comprobar que exista es lo que hace verificable dónde se propuso G4;
    // abrirlo se describe (EXEC-R07) y fusionarlo es humano sin excepción (EXEC-R04).
    prDeLaRama(rama) {
      const out = execFileSync('gh', ['pr', 'list', '--state', 'open', '--head', rama,
        '--json', 'number'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return JSON.parse(out).map((p) => p.number);
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
    // PT-010 · de donde sale el enlace absoluto. Si no se puede derivar, se devuelve null y el
    // cuerpo escribe la ruta SIN enlace: inventar una URL seria peor que no ponerla (RULE-06).
    repo() {
      try {
        const out = execFileSync('gh', ['repo', 'view', '--json', 'url,defaultBranchRef'],
          { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
        const j = JSON.parse(out);
        return { url: j.url ?? null, rama: j.defaultBranchRef?.name ?? null };
      } catch { return { url: null, rama: null }; }
    },
    editarCuerpo(numero, cuerpo) {
      execFileSync('gh', ['issue', 'edit', String(numero), '--body', cuerpo],
        { cwd: ROOT, stdio: 'pipe' });
    },
    etiquetasDeIssue(numero) {
      const out = execFileSync('gh', ['issue', 'view', String(numero), '--json', 'labels'],
        { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      return (JSON.parse(out).labels ?? []).map((l) => l.name);
    },
    etiquetar(numero, poner, quitar) {
      const args = ['issue', 'edit', String(numero)];
      for (const e of poner ?? []) args.push('--add-label', e);
      for (const e of quitar ?? []) args.push('--remove-label', e);
      execFileSync('gh', args, { cwd: ROOT, stdio: 'pipe' });
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


// PT-007 · `estado` lee SOLO el registro y no toca la plataforma — por eso responde «qué va
// cuándo» sin credencial y sin plataforma declarada. Exigirle la compuerta de acceso lo dejaba
// inútil justo donde más falta hace: en un proyecto que aún no espeja.
const D = ACCION === 'estado' ? { codigo: 0 } : decidirSalida(reg, null);
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
// PT-010 · lo que `cuerpoDeIssue` necesita del entorno: la URL del repositorio, su rama por
// defecto y —si es un lote— las tareas que lo componen, para que el issue diga de que va sin
// salir de GitHub.
// `estado` corre SIN plataforma, así que aquí no hay adaptador. Sin el `?.` esto reventaba
// justo en la acción que existe para funcionar sin credencial — lo dijo su caso, no yo.
const REPO = adaptador?.repo ? adaptador.repo() : { url: null, rama: null };
const contextoCuerpo = (a) => ({
  ...REPO,
  tareas: a?.type === 'EP' ? all.filter((t) => t.epic === a.id) : undefined,
});

// PT-010 · sincronizar el CUERPO de los issues abiertos, no solo sus etiquetas. Sin esto el
// arreglo no alcanzaria a los que ya existen — incluidos los de este mismo lote, que nacieron
// con el cuerpo defectuoso.
function sincronizarCuerpos() {
  if (!adaptador.editarCuerpo) return;
  for (const a of vivas.filter((x) => x.issue)) {
    if (!APLICAR) { notas.push(`${a.id} #${a.issue}: se regeneraria el cuerpo`); continue; }
    try { adaptador.editarCuerpo(a.issue, cuerpoDeIssue(a, contextoCuerpo(a))); notas.push(`${a.id} #${a.issue}: cuerpo sincronizado`); }
    catch { fail('SUITE-R35', `${a.id}: no se pudo sincronizar el cuerpo de #${a.issue}.`); }
  }
}

// PT-007 · sincronizar las etiquetas derivadas de los issues que YA existen. Sin esto, el
// estado se publicaba al abrir y nunca se actualizaba: el tablero diría «fase 1» para siempre.
function sincronizarEtiquetas() {
  const conIssue = vivas.filter((a) => a.issue);
  if (!conIssue.length || !adaptador.etiquetasDeIssue) return;
  for (const a of conIssue) {
    const debe = etiquetasDe(a);
    const tiene = adaptador.etiquetasDeIssue(a.issue);
    const quitar = tiene.filter((n) => RE_DERIVADA.test(n) && !debe.includes(n));
    const poner = debe.filter((n) => !tiene.includes(n));
    if (!quitar.length && !poner.length) continue;
    if (!APLICAR) { notas.push(`${a.id} #${a.issue}: faltaría [${poner.join(', ')}] y sobraría [${quitar.join(', ')}]`); continue; }
    try { adaptador.etiquetar(a.issue, poner, quitar); notas.push(`${a.id} #${a.issue} → ${debe.join(', ')}`); }
    catch { fail('SUITE-R35', `${a.id}: no se pudieron sincronizar las etiquetas de #${a.issue}.`); }
  }
}

function abrir() {
  const pendientes = vivas.filter((a) => !a.issue);
  if (!pendientes.length) {
    notas.push('Nada que abrir: toda allocation viva tiene su issue.');
    if (adaptador.etiquetas) {
      const faltan = etiquetasQueFaltan(adaptador.etiquetas(), etiquetasNecesarias(vivas));
      for (const e of faltan) {
        if (!APLICAR) { notas.push(`faltaría crear la etiqueta «${e}»`); continue; }
        try { adaptador.crearEtiqueta(e); notas.push(`etiqueta «${e}» creada`); }
        catch { fail('FND-R30', `falta la etiqueta «${e}» y no se pudo crear:  gh label create "${e}"`); }
      }
    }
    sincronizarEtiquetas();
    sincronizarCuerpos();
    return;
  }
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
    const faltan = etiquetasQueFaltan(adaptador.etiquetas(), etiquetasNecesarias(vivas));
    for (const e of faltan) {
      try { adaptador.crearEtiqueta(e); notas.push(`etiqueta «${e}» creada`); }
      catch { fail('FND-R30', `falta la etiqueta «${e}» y no se pudo crear. Créala y repite:  gh label create "${e}"`); }
    }
    if (errores.length) return;
  }
  for (const a of pendientes) {
    // El issue REFERENCIA el intake; no lo copia. Dos copias del mismo texto divergen — es la
    // causa raiz que la v4 nacio para eliminar, reintroducida por la puerta nueva.
    const cuerpo = cuerpoDeIssue(a, contextoCuerpo(a));
    const etiquetas = etiquetasDe(a);   // PT-007 · incluye fase y compuerta, derivadas
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
    adaptador.cerrar(a.issue, mensajeDeCierre(a));
    notas.push(`#${a.issue} cerrado · ${a.id} ${a.status}`);
  }
}

// ── pr · ¿hay pull request abierto para la rama? (SUITE-R42) ────────────────
// Sale 0 si lo hay y 1 si no, con los mismos códigos que `espejo` para 2 y 3: quien llama ya
// sabe leerlos. No abre nada.
function prAbierto() {
  let rama = '';
  try {
    rama = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'],
      { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch { console.error('No se pudo leer la rama actual: ¿es un repositorio git?'); process.exit(2); }
  const nums = adaptador.prDeLaRama(rama);
  if (nums.length) { notas.push(`rama «${rama}» → pull request #${nums[0]} abierto.`); return; }
  fail('SUITE-R42', `no hay pull request abierto para la rama «${rama}». G4 se resuelve sobre un PR `
    + 'para que el merge se proponga donde se pueda revisar. Ábrelo tú:  '
    + `gh pr create --base main --head ${rama}`);
}

// ── estado · el tablero, leyendo SOLO el registro (PT-007) ──────────────────
// No toca la plataforma: por eso responde «qué va cuándo» sin credencial y sin plataforma
// declarada. Las etiquetas responden lo mismo en GitHub; esto lo responde aquí.
function estado() {
  const eps = all.filter((a) => a?.type === 'EP');
  const pts = all.filter((a) => a?.type !== 'EP');
  const linea = (a) => {
    const g = COMPUERTA_DE_FASE[Number(a.phase)];
    return `  ${String(a.id).padEnd(8)}${String(a.type ?? '').padEnd(15)}${String(a.severity ?? '—').padEnd(4)}`
      + `${String(a.status ?? '').padEnd(20)}${(a.phase !== undefined && a.phase !== null ? `fase ${a.phase}` : 'sin fase').padEnd(10)}`
      + `${(g ? `${g} pendiente` : '—').padEnd(15)}${a.issue ? `#${a.issue}` : ''}`;
  };
  for (const ep of eps) {
    di(`${ep.id} · ${ep.slug ?? ''}   ${ep.status}${ep.issue ? `   #${ep.issue}` : ''}`);
    for (const pt of pts.filter((p) => p.epic === ep.id)) di(linea(pt));
    di('');
  }
  const sueltos = pts.filter((p) => !p.epic);
  if (sueltos.length) { di('Sin implementación'); for (const p of sueltos) di(linea(p)); di(''); }
  notas.push(`${eps.length} implementación(es) · ${pts.length} tarea(s) · leído del registro, sin tocar la plataforma.`);
}

// ── pendiente · ¿queda un comentario humano sin responder? (SUITE-R43) ──────
function pendienteDe() {
  const pt = ARGS.slice(1).find((a) => /^PT-\d+$/.test(a));
  if (!pt) { console.error('Uso: tracker.mjs pendiente PT-NNN [ruta]'); process.exit(2); }
  const a = all.find((x) => x?.id === pt);
  if (!a?.issue) { console.log('0'); return; }
  const r = comentarioSinResponder(adaptador.comentarios(a.issue));
  if (r === null) { console.log('4'); return; }   // no evaluable: ninguna marca
  console.log(r ? '1' : '0');
}

const acciones = { espejo, abrir, cerrar, notas: notasDe, pr: prAbierto, estado, pendiente: pendienteDe };
if (!acciones[ACCION]) {
  console.error(`Acción desconocida: ${ACCION}. Conocidas: ${Object.keys(acciones).join(' · ')}`);
  process.exit(2);
}
if (ACCION === 'notas' || ACCION === 'pendiente') {
  try { acciones[ACCION](); process.exit(0); } catch (e) { console.error(String(e.message ?? e)); process.exit(1); }
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

} // fin de EJECUTADO_DIRECTO
