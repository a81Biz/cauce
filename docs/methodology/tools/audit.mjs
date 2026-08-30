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

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reglasDelMarco, verificadoresDe } from './patrones.mjs';
// PT-147 · los componentes, sus fases, su archivo de prompts y su sigla — del contrato.
import { COMPONENTES, fasesDe, promptsDe, siglaDe, SIN_EVALUAR } from './patrones.mjs';
// PT-167 · los casos invertidos: los que solo pasan mientras existe el defecto que vigilan.
import { identificadoresDeHueco, casosInvertidos } from './patrones.mjs';
// PT-161 · los puntos de entrada del catalogo, derivados del contrato.
import { triggers } from './patrones.mjs';

// PT-156 · QUE UN COMPONENTE ENTRE EN LA AUDITORIA SOLO SE VEIA CUANDO FALLABA. Las lineas
// «<comp> PHASE <n>» solo se emiten como HUECO, asi que los tres casos de PT-147 que afirmaban
// «FIDE entra en la auditoria de fases» pasaban PORQUE FIDE FALLABA, y se pusieron en rojo el dia
// que dejo de fallar. Un caso que solo puede pasar mientras hay un defecto no comprueba nada
// (RULE-02). Esto publica la ANCHURA de la auditoria, que es lo que aquellos casos querian decir.
const fasesAuditadas = [];

// ── PT-101 · la construccion FRAGIL, antes de que se rompa ────────────────────
//
// `audit` ya caza el byte de control CUANDO YA ESTA ESCRITO: util, y POSTERIOR al daño. Esto
// mira lo ANTERIOR — una construccion que va a romperse en cuanto pase por una capa de escapado.
//
// LA FIRMA es precisa y no admite dos lecturas: un `new RegExp` sobre una cadena que lleva UNA
// sola barra invertida delante de una letra de clase. En una cadena de JavaScript esa barra no
// sobrevive: la letra queda sola. `new RegExp` de una cadena con la barra simple ante «s» no
// busca un espacio — busca la LETRA, y no falla: no casa nada. Un regex que no casa nada es el
// fallo mas caro que hay, porque parece que todo esta bien.
//
// Con DOS barras es correcto y no se marca: la cadena guarda una barra y el regex la lee.
//
// Cuenta y motivo: `patrones.mjs` · ROTURAS_DE_ESCAPADO.
const LETRAS_DE_CLASE = 'bsdwSDWB';
const BARRA = String.fromCharCode(92);

// Se EXPORTA para que un caso pueda comprobarla sin montar un arbol de metodologia entero —
// misma forma que PT-097 uso con letraDeCertificacion. Una comprobacion que solo se puede
// ejercer ejecutando la herramienta completa acaba sin ejercerse.
export function fragilesEn(txt) {
  const malas = [];
  // Los COMENTARIOS fuera. Los tres primeros aciertos de esta comprobacion estaban dentro de
  // comentarios que advertian de ESTE MISMO defecto — tercera vez en la sesion que un comentario
  // rompe la comprobacion que lo acompaña. Un aviso con ruido se ignora, y entonces deja de
  // servir para lo que se escribio.
  //
  // Regex LITERALES, como manda la regla que esto comprueba: escribir este mismo filtro con
  // barras escapadas dentro de una cadena fue la NOVENA rotura de escapado de la sesion.
  const SIN_COMENTARIO = String(txt ?? '')
    .split(/\r?\n/)
    .map((l) => (/^\s*(?:\/\/|\*)/.test(l) ? '' : l))
    .join(String.fromCharCode(10));
  for (const m of SIN_COMENTARIO.matchAll(/new RegExp\(\s*(['"`])((?:[^\\]|\\.)*?)\1/g)) {
    const cuerpo = m[2];
    for (let i = 0; i < cuerpo.length - 1; i += 1) {
      if (cuerpo[i] !== BARRA) continue;
      let barras = 0;
      let j = i;
      while (j >= 0 && cuerpo[j] === BARRA) { barras += 1; j -= 1; }
      if (barras % 2 === 1 && LETRAS_DE_CLASE.includes(cuerpo[i + 1])) {
        malas.push(BARRA + cuerpo[i + 1]);
      }
      i += barras - 1;
    }
  }
  return [...new Set(malas)];
}

// PT-078 · ninguna regla queda sin clasificar, y estar sin clasificar es un FALLO.
import { clasificarReglas, noVerificablesDeclaradas, juzgadasMecanizables } from './patrones.mjs';

// PT-101 · importable para probarla. `fragilesEn` se exporta, y sin esta guarda importar el
// modulo EJECUTA la auditoria entera y sale con `process.exit` — un caso no puede llamarla.
// Misma forma que PT-097 aplico a verify-ptsa, por el mismo motivo.
const EJECUTADO_DIRECTO = !!process.argv[1]
  && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (!EJECUTADO_DIRECTO) { /* importado para probar: no se ejecuta nada */ } else {

const BASE = resolve(process.argv[2] ?? join(process.cwd(), 'docs', 'methodology'));
if (!existsSync(BASE)) { console.error(`No existe: ${BASE}`); process.exit(2); }

const ROOT = resolve(BASE, '..', '..');
const gaps = [];
const okCount = { total: 0 };
const gap = (clase, elem, falta) => gaps.push({ clase, elem, falta });
const tick = (clase) => { okCount[clase] = (okCount[clase] ?? 0) + 1; okCount.total++; };
// PT-169 · audit solo sabia decir «hueco» o «cubierto». Una ADOPCION EN CURSO no es ninguna de las
// dos: no es un hueco —hay mecanismo y funciona— ni esta cubierta —faltan sitios por convertir—.
// Sin este tercer estado, la unica salida era mentir en alguna direccion: bloquear por algo que
// crece a proposito, o callarlo y que nadie lo mire. Es RULE-06 con otra ropa.
const avisos = [];
// El nombre NO es libre: `regla.mjs` deriva quien comprueba una regla buscando `fail(` y
// `warn(` con su ID. Llamarlo `avisa` dejaba la regla como «ningun verificador la emite» —cierto
// para la derivacion y falso para el lector—, que es CE-008 por el lado del vocabulario.
const warn = (regla, texto) => avisos.push({ regla, texto });

const SALTO = String.fromCharCode(10);
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
  // PT-147 · UN mapa, y sale del contrato.
  //
  // Habia DOS escritos a mano —PROMPTS con cinco componentes y «esperadas» con cuatro— y el bucle
  // recorria «esperadas», asi que lo que no estuviera ahi NO APARECIA: ni en rojo ni en amarillo.
  // Medido: FPGE tenia prompts declarados y NADIE auditaba sus fases; FIDE no estaba en ninguno
  // de los dos. DOS DE LOS SEIS COMPONENTES sin auditar sus fases, y nunca lo dijeron.
  //
  // Es el mismo patron que verify-qa.mjs:7 registra para las reglas —«QA 0/19 y FPGE 0/10»—
  // repetido sobre las FASES. Recorrer COMPONENTES hace el hueco estructuralmente imposible: si
  // esta en la suite, esta en el bucle.
  for (const c of COMPONENTES) {
    const comp = c.nombre;
    const rango = fasesDe(comp);

    // RULE-06 · un componente sin rango declarado se DICE, no se salta. LEXICON §3 tiene cinco
    // apartados para SEIS componentes: no hay ninguno para FPGE. Omitirlo lo haria
    // indistinguible de uno que pasa; declararlo SIN EVALUAR dice lo que se sabe y lo que no.
    if (rango === SIN_EVALUAR) {
      fasesAuditadas.push(`${comp} SIN EVALUAR`);
      gap('fase', `${comp} fases`, 'LEXICON §3 no declara su rango — SIN EVALUAR, no se inventa (RULE-06)');
      continue;
    }
    fasesAuditadas.push(`${comp} ${rango[0]}-${rango[1]}`);

    // PT-147 · FIDE no tiene archivo de prompts, y no es un olvido: LEXICON §6.6 declara sus
    // tres archivos y ninguno lo es. Es el unico componente que opera ANTES de que la suite
    // exista, asi que su texto de activacion es un CLAUDE.md anfitrion.
    //
    // La dimension «prompts» no se evalua para el — y se DICE, no se da por buena. Un componente
    // al que no se le puede exigir un archivo no es un componente que lo cumpla.
    const rutaPrompt = promptsDe(comp);
    const sinPrompts = rutaPrompt === SIN_EVALUAR;
    const prompt = sinPrompts ? '' : (rd(rutaPrompt) ?? '');
    for (let n = rango[0]; n <= rango[1]; n++) {
      const falta = [];
      // Un documento puede declarar un rango («PHASE 2-4», «PHASE 11-12») o una línea
      // compacta de componente («FND 0 Recon · 1 Reconciliation · …»). Ambas cuentan.
      // PT-168 · LA BUSQUEDA GENERICA SE ACOTA A LA SECCION DEL COMPONENTE.
      //
      // Antes miraba el documento ENTERO: si contenia «PHASE 3 » daba cierto, y PHASES.md y
      // CORE.md documentan las once fases de FDGE — asi que CUALQUIER fase de CUALQUIER
      // componente entre 0 y 10 estaba «cubierta» en los dos, SIEMPRE.
      //
      // Lo grave no era que se equivocara: es que NO PODIA equivocarse. Acertaba para los seis
      // componentes reales POR CASUALIDAD —PHASES.md tiene seccion para todos— y fallo la
      // septima vez: PT-149 dio de alta un componente cuyo nombre y sigla aparecen CERO veces en
      // esos documentos, y audit declaro sus tres fases cubiertas. La septima es justo el caso
      // para el que sirve una comprobacion.
      //
      // No hay que inventar el dato: hay que DEJAR DE MIRAR DONDE NO TOCA. PHASES.md tiene
      // encabezado por componente y CORE.md linea compacta por sigla.
      const seccionDe = (txt) => {
        const L = String(txt).split(SALTO);
        const marcas = [comp, siglaDe(comp)];
        let ini = -1;
        for (let i = 0; i < L.length; i++) {
          if (!L[i].startsWith('## ')) continue;
          const t = L[i].slice(3).trim();
          if (marcas.some((x) => t === x || t.startsWith(x + ' ') || t.startsWith(x + ' '))) { ini = i + 1; break; }
        }
        if (ini < 0) return null;
        let fin = L.length;
        for (let j = ini; j < L.length; j++) if (L[j].startsWith('## ')) { fin = j; break; }
        return L.slice(ini, fin).join(SALTO);
      };
      const cubre = (txt, propio) => {
        // RULE-06 · si el documento NO tiene seccion para este componente, la busqueda generica
        // NO SE HACE: no saber donde mirar no es permiso para mirar en todas partes. La linea
        // compacta por sigla, que si discrimina, se sigue intentando abajo sobre el texto entero.
        // Y el archivo PROPIO del componente NO se acota: FDGE-Prompts.md es entero de FDGE, no
        // tiene un «## FDGE» dentro. Acotarlo puso 46 huecos falsos en la primera corrida — el
        // mismo error que se esta arreglando, cometido al arreglarlo: mirar donde no toca y
        // mirar de menos son el mismo defecto con el signo cambiado.
        const ambito = propio ? String(txt) : (seccionDe(txt) ?? '');
        // Y dentro de la seccion, el formato COMPACTO cuenta: PHASES.md escribe PHASE 0 en PTSA
        // y «1 FRESHNESS» en FPGE — las dos son la misma cosa, una fase con su nombre, y la
        // segunda es la convencion de estos bloques densos; CORE hace igual con su linea por
        // sigla. Leer solo una de las dos formas dejaba SEIS fases de FPGE como huecos falsos.
        for (const l of ambito.split(SALTO)) {
          const t = l.trim();
          const m = /^(\d{1,2})(?:-(\d{1,2}))?[ \t]+[A-Za-z]/.exec(t);
          if (!m) continue;
          const a = Number(m[1]); const b = m[2] ? Number(m[2]) : a;
          if (n >= a && n <= b) return true;
        }
        if (ambito.includes(`PHASE ${n} `) || ambito.includes(`PHASE ${n}·`) || ambito.includes(`PHASE ${n}\n`)) return true;
        for (const m of ambito.matchAll(/PHASE\s+(\d+)\s*[-–]\s*(\d+)/g)) {
          if (n >= Number(m[1]) && n <= Number(m[2])) return true;
        }
        // PT-147 · era «comp === 'Foundation' ? 'FND' : comp» — no una lista repetida, sino UNA
        // EXCEPCION CODIFICADA COMO CONDICIONAL. PT-144 la uso como caso de prueba del contrato.
        // Y cubre un caso que el ternario no tenia: FQAGE se llama QA en rutas (LEX-R03).
        const sigla = siglaDe(comp);
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
      const enPrompt = cubre(prompt, true);
      if (!enPhases) falta.push('PHASES.md');
      if (!enPrompt && !sinPrompts) falta.push(rutaPrompt);
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
  // Quién es «el instalador» cambió, y esta lista se quedó atrás. Era el README de la raíz,
  // porque ahí vivía el procedimiento paso a paso — duplicado del de `INSTALL.md`, divergiendo
  // de él, y ordenando en su versión borrar documentación contra `FND-R11`. Foundation lo
  // recortó (`N1`), y con él desaparecieron las únicas menciones de tres ledgers: la auditoría
  // pasó a reportar huecos que no lo eran. El instalador de verdad es `INSTALL.md`, y quien
  // crea los artefactos de reconciliación es Foundation.
  const instalador = (existsSync(join(ROOT, 'README.md')) ? readFileSync(join(ROOT, 'README.md'), 'utf8') : '')
    + (rd('INSTALL.md') ?? '')
    + (rd('Foundation-Implementation.md') ?? '') + (rd('Foundation-Prompts.md') ?? '')
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

  // PT-169 · SUITE-R61 · CUANTOS SITIOS QUE MUTAN UN FIXTURE COMPRUEBAN QUE LA MUTACION OCURRIO.
  //
  // Un caso cuya mutacion no muta nada SIGUE DICIENDO OK: de los tres patrones de caso muerto es
  // el unico que no se delata solo. `muta` lo caza EN EJECUCION; esto publica LA ADOPCION, que es
  // lo que una herramienta puede decir sin ejecutar la bateria.
  //
  // Se emite como AVISO y no como hueco, y no por indulgencia: hay 61 sitios y convertirlos de
  // golpe seria un cambio grande y ciego. Lo que la regla impide es que el PROXIMO se escriba sin
  // ella. Es la misma forma que la tabla de sujetos de SUITE-R09 —«crece por adopcion declarada»—
  // y por eso la cifra se publica CON SU DENOMINADOR: un porcentaje esconde si el total crecio.
  // PT-165 · EL MAPA DE FASES DE CORE ESTA TECLEADO, Y NO PUEDE CONTRADECIR AL CONTRATO.
  //
  // PT-149 le puso un COLADOR: un componente que falte se anade derivado, asi que el mapa ya no
  // puede OMITIR a nadie —FIDE llevaba fases declaradas y no aparecia—. Lo que el colador no
  // impide es que una linea REDACTADA diga un rango distinto del que el contrato declara.
  //
  // Las cinco lineas siguen escritas a mano A PROPOSITO: llevan la sintaxis de cada comando
  // —«delta QA PT-XXX», «promote FPGE R-NNN»— que no sale de ningun contrato, y derivarlas
  // enteras la perderia. Lo que se comprueba es que el RANGO coincida: lo redactado manda en la
  // prosa, el contrato manda en los numeros.
  {
    const lineasCore = (CORE ?? '').split(SALTO);
    for (const c of COMPONENTES) {
      const r = fasesDe(c.nombre);
      if (r === SIN_EVALUAR) continue;
      const s = siglaDe(c.nombre);
      const i = lineasCore.findIndex((l) => l.startsWith(s + ' '));
      if (i < 0) continue;   // el colador lo anade; la ausencia la caza el bloque de fases
      let bloque = lineasCore[i];
      for (let j = i + 1; j < lineasCore.length && lineasCore[j].startsWith('      '); j++) bloque += ' ' + lineasCore[j];
      const nums = [...bloque.matchAll(/(?:^|[^0-9])([0-9]{1,2})(?:-([0-9]{1,2}))?/g)]
        .flatMap((x) => [Number(x[1]), x[2] ? Number(x[2]) : Number(x[1])])
        .filter((n) => !Number.isNaN(n));
      if (!nums.length) continue;
      const min = Math.min(...nums); const max = Math.max(...nums);
      if (min !== r[0] || max !== r[1]) {
        gap('fase', `${c.nombre} en el mapa de CORE`, `la linea dice ${min}-${max} y el contrato declara ${r[0]}-${r[1]}. `
          + 'El mapa esta redactado a mano para conservar la sintaxis de cada comando, pero sus NUMEROS '
          + 'salen del contrato: lo redactado manda en la prosa, el contrato manda en el rango.');
      } else tick('fase');
    }
  }

  // PT-161 · CASOS-DE-USO SE DECLARA «CONTRATO DE COBERTURA» Y NADA LO COMPROBABA.
  //
  // Su encabezado dice: «un caso que no este aqui es un hueco DECLARADO, no un silencio». Una
  // promesa asi no se puede comprobar entera —nadie sabe que casos EXISTEN— pero si su parte
  // derivable: el catalogo dice DONDE ENTRAR, y los puntos de entrada son los TRIGGERS, que el
  // contrato ya declara. Un trigger sin caso es una puerta que el catalogo no menciona.
  //
  // Fallo DOS VECES en EP-022 sin que nada dijera nada: con DICTAMEN y con el alta/baja de un
  // componente, que no tenian caso hasta que alguien los echo en falta leyendo.
  //
  // QUE NO ESTABLECE (SUITE-R26): que el catalogo este COMPLETO. Un caso que no entre por un
  // trigger —una operacion de mantenimiento, una decision— no es detectable, y eso se dice.
  {
    const cat = rd('CASOS-DE-USO.md');
    if (cat === null) {
      warn('SUITE-R21', 'no hay CASOS-DE-USO.md: su contrato de cobertura NO SE EVALUA.');
    } else {
      const sinCaso = triggers().filter((t) => !cat.includes(t));
      if (sinCaso.length) {
        gap('caso', 'CASOS-DE-USO.md', `${sinCaso.length} trigger(s) sin caso en el catalogo: ${sinCaso.join(' · ')}. `
          + 'El catalogo dice DONDE ENTRAR y se declara contrato de cobertura: una puerta que no menciona '
          + 'es un hueco que nadie declaro.');
      } else tick('caso');
    }
  }

  // PT-167 · SUITE-R61 · CASOS QUE AFIRMAN COBERTURA BUSCANDO LA LINEA DEL HUECO.
  //
  // PT-147 escribio tres que buscaban «FIDE PHASE» en la salida de audit — una linea que SOLO se
  // emite como HUECO. Pasaban PORQUE el componente FALLABA, y se pusieron en rojo el dia en que
  // dejo de fallar: estuvieron en verde todo EP-022 afirmando lo contrario de lo que ocurria.
  //
  // Sale como CANDIDATO y no como hueco, y no por indulgencia: un caso que prueba que una regla
  // PUEDE FALLAR asierta exactamente eso y es lo CONTRARIO de un defecto —PT-149 tiene tres—. La
  // diferencia es de INTENCION y la intencion no esta en el texto (SUITE-R26). Un barrido que los
  // matara se desactivaria en la primera corrida, y un verificador desactivado es peor que ninguno.
  {
    const fuentes = tools.filter(([f]) => f.endsWith('.mjs'))
      .map(([f]) => rd(f) ?? '').filter(Boolean);
    const valores = COMPONENTES.flatMap((c) => [c.nombre, siglaDe(c.nombre)]);
    const ids = identificadoresDeHueco(fuentes, valores);
    const inv = casosInvertidos(selftest, ids);
    if (inv.length) {
      warn('SUITE-R61', `${inv.length} caso(s) asertan sobre el IDENTIFICADOR de un hueco: `
        + inv.map((x) => `:${x.linea} «${x.caso}» → «${x.hueco}»`).join(' · ')
        + '. Un caso asi pasa MIENTRAS el hueco existe y se pone en rojo cuando se arregla. '
        + 'Es CANDIDATO, no defecto: un caso que prueba que una regla puede fallar asierta lo mismo.');
    }
  }

  {
    const lineas = selftest.split(String.fromCharCode(10));
    const mutan = lineas.filter((l) => !l.trimStart().startsWith('#')
      && (l.includes('sed -i') || l.includes('perl -0pi')));
    const conMuta = lineas.filter((l) => l.includes('muta ')).length;
    if (mutan.length) {
      warn('SUITE-R61', `${conMuta} de ${mutan.length} sitio(s) que mutan un fixture comprueban que la mutacion ocurrio. `
        + 'Un fixture cuya mutacion no cambia nada corre sobre un arbol INTACTO y el caso pasa sin probar nada. '
        + 'La tabla crece por adopcion declarada: lo que la regla impide es que el proximo se escriba sin «muta».');
    }
  }

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
  //
  // Y NO SOLO EN EL CODIGO. Este detector solo miraba herramientas, y por eso no vio que el
  // texto de `SUITE-R38` —la regla que existe para cazar esto— tenia su propio `\b` degradado a
  // 0x08. Una regla se cita, se copia y acaba en un patron: un byte de control ahi es la misma
  // averia una capa mas arriba, y era invisible porque 0x08 no se ve al leer.
  // PT-101 · la construccion fragil, ANTES del byte. Solo herramientas: un documento no
  // ejecuta un regex, y marcarlo seria ruido.
  for (const [f, txt] of tools) {
    const fr = fragilesEn(txt ?? '');
    if (!fr.length) { tick('herramienta'); continue; }
    gap('herramienta', f, `${fr.length} construccion(es) fragiles: new RegExp sobre una cadena `
      + `con barra simple ante ${fr.join(' ')}. En una cadena esa barra NO sobrevive y la letra `
      + `queda sola: el regex compila y NO CASA NADA — el fallo mas caro, porque parece que todo `
      + `esta bien. Usa un regex LITERAL, o duplica la barra. Cuenta y motivo en patrones.mjs `
      + `ROTURAS_DE_ESCAPADO.`);
  }

  for (const [f, txt] of [...tools, ...mds]) {
    const esDoc = f.endsWith('.md');
    const malos = [...txt].filter((c) => {
      const n = c.charCodeAt(0);
      return n < 32 && n !== 9 && n !== 10 && n !== 13;
    });
    const dim = esDoc ? 'documento' : 'herramienta';
    if (!malos.length) { tick(dim); continue; }
    const cods = [...new Set(malos.map((c) => `0x${c.charCodeAt(0).toString(16).padStart(2, '0')}`))];
    gap(dim, f, `${malos.length} byte(s) de control ${cods.join(' ')} en ${esDoc ? 'el texto' : 'el código'}: una secuencia de escape se perdió al editar. ${esDoc ? 'No se ve al leer, y si ese texto acaba en un patrón el patrón no casará nada.' : 'El regex compila y no casa nada — el fallo es silencioso.'} → perl -i -pe 's/\\x08//g' ${f}`);
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

// ── 8-bis. PT-002 · cobertura POR REGLA, no por componente ──────────────────
// Lo de arriba solo declara hueco si un componente tiene CERO reglas verificadas: con 1 de 20,
// pasa. Y el informe decia «Cobertura completa: sin huecos» con 63 reglas HARD sin ningun
// script. No mentia sobre lo que medía — mentia sobre lo que el lector entiende que ha medido,
// y no vio que SUITE-R35 llevaba tres versiones con herramienta y sin compuerta.
//
// SUITE-R11 y PTSA-R78 exigen publicar la cobertura junto al numero. Se le pedia a las
// auditorias de PTSA y no a esta.

/**
 * Qué herramientas ejecuta alguna compuerta. Se DERIVA de quien las invoca —package.json, los
 * workflows y el binario— y no se escribe: una lista a mano se queda atras el dia que se anada
 * un paso a CI, que es la averia que este repositorio arrastra alli donde se copio un hecho
 * (RULE-01, SUITE-R40). Devuelve null si no hay de donde derivarlo: eso es RULE-06, no cero.
 */
const herramientasConCompuerta = (() => {
  const fuentes = [];
  const leerSi = (p) => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
  const pkg = leerSi(join(ROOT, 'package.json'));
  if (pkg !== null) fuentes.push(pkg);
  const bin = leerSi(join(ROOT, 'bin', 'cauce.mjs'));
  if (bin !== null) fuentes.push(bin);
  const wfDir = join(ROOT, '.github', 'workflows');
  if (existsSync(wfDir)) {
    for (const f of readdirSync(wfDir)) {
      const t = leerSi(join(wfDir, f));
      if (t !== null) fuentes.push(t);
    }
  }
  if (!fuentes.length) return null;               // nadie a quien preguntar → no evaluable
  const texto = fuentes.join('\n');
  const invocadas = new Set();
  for (const [ruta] of tools) {
    const nombre = ruta.split('/').pop();
    if (texto.includes(nombre)) invocadas.add(nombre);
  }
  return invocadas;
})();

// PT-067 · el universo sale de patrones.mjs, no de un regex propio. Leia SOLO filas de
// RULES.md: 183 de las 223 que el marco define, fuera las 26 LEX-* y las 14 EXEC-*. Tener aqui
// una tercera derivacion del mismo hecho es como PT-066 arreglo regla.mjs y esta se quedo igual.
const REGLAS_TODAS = reglasDelMarco(rd);
const POR_DOCUMENTO = REGLAS_TODAS.reduce((a, r) => ({ ...a, [r.doc]: (a[r.doc] ?? 0) + 1 }), {});

// PT-067 · `t.includes(id)` daba por verificada una regla cuyo ID aparecia en un COMENTARIO.
// 20 asi, incluida FDGE-R17 — que PT-079 acababa de declarar NO comprobable en TD-16.
const clasificar = (id) => {
  const citadaPor = verificadoresDe(id, tools.map(([r, t]) => [r.split('/').pop(), t]));
  if (!citadaPor.length) return 'sin-verificador';
  if (herramientasConCompuerta === null) return 'sin-evaluar';
  return citadaPor.some((n) => herramientasConCompuerta.has(n)) ? 'ejecutada' : 'sin-compuerta';
};

const COBERTURA = { ejecutada: [], 'sin-compuerta': [], 'sin-verificador': [], 'sin-evaluar': [] };
for (const r of REGLAS_TODAS) COBERTURA[clasificar(r.id)].push(r);
const soloHard = (a) => a.filter((r) => r.sev === 'HARD').length;
const TOTAL_REGLAS = REGLAS_TODAS.length;
const TOTAL_HARD = soloHard(REGLAS_TODAS);

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
for (const a of avisos) console.log(`  · ${a.regla}  ${a.texto}`);
console.log(`Fases auditadas: ${fasesAuditadas.join(' · ')}  (${fasesAuditadas.length} de ${COMPONENTES.length})`);

// ── Cobertura mecánica de las reglas ────────────────────────────────────────
// Se publica el NUMERO con su denominador, no un adjetivo. Y no es un umbral: SUITE-R26 dice
// que una regla HARD «aspira» a comprobacion mecanica, y hay reglas que ninguna maquina puede
// comprobar —INTAKE-R01, FDGE-R17, QA-R01—. Publicar si; bloquear no.
console.log('\nCobertura mecánica de las reglas   (SUITE-R26 · aspira, no exige)');
// PT-067 · el universo, con sus tres orígenes. Sin esta línea el denominador es un número sin
// procedencia — y era justo eso lo que permitía que le faltaran 40 reglas sin que nadie lo viera.
console.log(`  universo                       ${TOTAL_REGLAS}     (${Object.entries(POR_DOCUMENTO).map(([d, n]) => `${d} ${n}`).join(' · ')})`);
if (herramientasConCompuerta === null) {
  console.log('  ejecutadas por una compuerta   SIN EVALUAR — no se pudo leer quién invoca las');
  console.log('                                 herramientas (package.json · workflows · bin/).');
  console.log('                                 No se asume 0 ni el total: sería inventarlo (RULE-06).');
  console.log(`  con verificador                ${COBERTURA['sin-evaluar'].length} / ${TOTAL_REGLAS}`);
  console.log(`  sin verificador                ${COBERTURA['sin-verificador'].length}`);
} else {
  const e = COBERTURA.ejecutada, sc = COBERTURA['sin-compuerta'], sv = COBERTURA['sin-verificador'];
  console.log(`  ejecutadas por una compuerta   ${e.length} / ${TOTAL_REGLAS}     · HARD ${soloHard(e)} / ${TOTAL_HARD}`);
  console.log(`  citadas sin compuerta que las corra   ${sc.length}${sc.length ? '        → --sin-compuerta las enumera' : ''}`);
  console.log(`  sin verificador                ${sv.length}${sv.length ? `        → --sin-verificar las enumera  (HARD ${soloHard(sv)})` : ''}`);

  // PT-067 · el desglose. La cifra BAJA —114/183 a 108/223— y sin decir por qué parece una
  // regresión: no se escribió menos verificador, se dejó de contar lo que no lo era. Los dos
  // números se DERIVAN; un texto a mano envejece en el primer cambio de RULES.md.
  const conNombre = tools.map(([f, t]) => [f.split('/').pop(), t]);
  // El arnes prueba las herramientas; no lo ejecuta ninguna compuerta (PT-067).
  const toolsSinArnes = tools.filter(([f]) => !f.endsWith('selftest.sh')).map(([, t]) => t).join(SALTO);
  const ampliado = REGLAS_TODAS.filter((r) => r.doc !== 'RULES.md').length;
  const soloMencion = REGLAS_TODAS.filter((r) => !verificadoresDe(r.id, conNombre).length
    && tools.some(([, t]) => t.includes(r.id))).length;
  const soloArnes = REGLAS_TODAS.filter((r) => {
    const cit = tools.filter(([, t]) => t.includes(r.id)).map(([f]) => f.split('/').pop());
    return cit.length === 1 && cit[0] === 'selftest.sh';
  }).length;
  // PT-078 · las TRES casillas, exhaustivas y excluyentes. PT-075 arreglo dos reglas
  // concretas; esto es el mecanismo: que NINGUNA pueda quedarse fuera en silencio.
  const decl = (() => {
    try { return noVerificablesDeclaradas(readFileSync(join(BASE, '..', 'implementation', 'NO-VERIFICABLES.md'), 'utf8')); }
    catch { return null; }
  })();
  // PT-204 · el juicio vive donde vive la declaracion: una regla juzgada MECANIZABLE y sin
  // verificador es DEUDA; una que nadie ha mirado es SIN_JUZGAR. El archivo declara las dos.
  const juzg = (() => {
    try { return juzgadasMecanizables(readFileSync(join(BASE, '..', 'implementation', 'NO-VERIFICABLES.md'), 'utf8')); }
    catch { return {}; }
  })();
  const clas = clasificarReglas(REGLAS_TODAS, toolsSinArnes, decl ?? {}, juzg);
  const suma = clas.VERIFICADA.length + clas.NO_VERIFICABLE.length + clas.PENDIENTE.length;
  console.log('');
  console.log('  Clasificación exhaustiva (PT-078) — ninguna queda fuera:');
  console.log(`    VERIFICADA       ${clas.VERIFICADA.length}   una herramienta la EMITE`);
  console.log(`    NO_VERIFICABLE   ${clas.NO_VERIFICABLE.length}   declarada con motivo y firma`);
  // PT-204 · PENDIENTE se abre en dos: decia «deuda, no limite» y mezclaba «lo decidimos y falta»
  // con «nadie ha mirado». Se resuelven distinto, y por eso se cuentan aparte.
  console.log(`    PENDIENTE        ${clas.PENDIENTE.length}   = DEUDA ${clas.DEUDA.length} + SIN_JUZGAR ${clas.SIN_JUZGAR.length}`);
  console.log(`      DEUDA          ${clas.DEUDA.length}   juzgada mecanizable y sin verificador — falta escribirlo`);
  console.log(`      SIN_JUZGAR     ${clas.SIN_JUZGAR.length}   NADIE HA MIRADO si se puede verificar o no`);
  if (clas.SIN_JUZGAR.length) {
    console.log('      Juzgar NO es verificar: decidir que una regla no es mecanizable cuesta un');
    console.log('      parrafo con motivo y firma en NO-VERIFICABLES.md; escribir su verificador');
    console.log('      cuesta una tarea. Lo que falta en estas es LO PRIMERO.');
  }
  console.log(`    suma             ${suma} de ${TOTAL_REGLAS}${suma === TOTAL_REGLAS ? '' : '   ✗ NO CUADRA'}`);
  if (decl === null) {
    console.log('    (sin NO-VERIFICABLES.md: todo lo no emitido cuenta como PENDIENTE)');
  }
  if (clas.sobran.length) {
    console.log(`    ✗ ${clas.sobran.length} declaración(es) SOBRAN — esas reglas sí se emiten: ${clas.sobran.join(' ')}`);
    console.log('      Declarar no verificable algo que ya se verifica esconde una verdad tras una firma.');
  }
  console.log('');
  console.log('  Qué cambió respecto de la medida anterior:');
  console.log(`    +${ampliado}  reglas que el denominador no miraba: LEXICON.md y EXECUTION-MODES.md`);
  console.log(`    -${soloMencion}  dejaron de contar por una MENCIÓN: su ID sólo aparecía en comentarios`);
  console.log(`         de ellas ${soloArnes} sólo en selftest.sh — el arnés no lo ejecuta ninguna compuerta`);

// PT-204 · LA COBERTURA NO PUEDE BAJAR EN SILENCIO.
//
// `audit` publica la cifra en CADA «npm run verify» desde hace lotes, y nadie la compara con la
// anterior: anadir una regla HARD sin verificador publicaba un numero un poco peor y nadie lo
// notaba. Una deuda que no se compara consigo misma no es una deuda: es una TENDENCIA que nadie
// mira — y esa es la puerta que «SUITE-R26 aspira, no exige» dejaba abierta.
//
// AVISA, NO BLOQUEA, y no es tibieza: bloquear obligaria a escribir el verificador ANTES de poder
// anadir la regla, y eso es exactamente la regresion que el firmante descarto. Lo que hace falta
// no es impedirlo: es que no pase inadvertido.
//
// SE GUARDA LA CIFRA, NO EL JUICIO. El ultimo valor conocido vive junto al resto del estado
// derivado; compararlo es mecanico y no exige que nadie se acuerde de nada.
const HITO = join(BASE, '..', 'implementation', 'COBERTURA.json');
if (herramientasConCompuerta !== null) {
  const hoy = { ejecutada: COBERTURA.ejecutada.length, universo: TOTAL_REGLAS,
    sin_juzgar: clas.SIN_JUZGAR.length, deuda: clas.DEUDA.length, no_verificable: clas.NO_VERIFICABLE.length };
  let antes = null;
  try { antes = JSON.parse(readFileSync(HITO, 'utf8')); } catch { antes = null; }
  if (antes && Number.isFinite(antes.ejecutada)) {
    if (hoy.ejecutada < antes.ejecutada) {
      console.log('');
      console.log(`  ⚠ LA COBERTURA BAJO: ${antes.ejecutada}/${antes.universo} → ${hoy.ejecutada}/${hoy.universo}.`);
      console.log('    Alguien anadio una regla sin verificador, o retiro uno. NO bloquea — bloquear');
      console.log('    obligaria a verificar antes de poder anadir, que es la regresion descartada —');
      console.log('    pero deja de pasar inadvertido, que era todo el problema (PT-204).');
    } else if (hoy.ejecutada > antes.ejecutada) {
      console.log('');
      console.log(`  La cobertura SUBIO: ${antes.ejecutada} → ${hoy.ejecutada} de ${hoy.universo}.`);
    }
  }
  // Se escribe SIEMPRE que se pudo medir: el hito es un HECHO observado, no un objetivo. Si no se
  // pudo medir no se toca — sobrescribirlo con «SIN EVALUAR» borraria la unica referencia que hay.
  try { writeFileSync(HITO, `${JSON.stringify(hoy, null, 2)}${String.fromCharCode(10)}`); } catch { /* sin permiso de escritura: la comparacion sigue valiendo */ }
}
}
if (process.argv.includes('--sin-verificar')) {
  console.log(`\nReglas sin ningún verificador (${COBERTURA['sin-verificador'].length}):`);
  console.log(`  ${COBERTURA['sin-verificador'].map((r) => r.id).join(' ')}`);
}
if (process.argv.includes('--sin-compuerta')) {
  console.log(`\nReglas cuyo verificador no lo ejecuta ninguna compuerta (${COBERTURA['sin-compuerta'].length}):`);
  console.log(`  ${COBERTURA['sin-compuerta'].map((r) => r.id).join(' ')}`);
}

// El adjetivo se queda SOLO sobre lo que esta comprobacion mide de verdad.
const cifra = herramientasConCompuerta === null
  ? 'SIN EVALUAR' : `${COBERTURA.ejecutada.length}/${TOTAL_REGLAS}`;
// La frase conserva el literal «sin huecos» a proposito: dos casos del arnes lo comprueban
// desde antes, y cambiarlo obligaria a reescribir sus asertos — un hecho copiado moviendose
// (RULE-01). Lo que se retira es el adjetivo ABSOLUTO: «completa» afirmaba sobre reglas que
// esta comprobacion nunca miro.
console.log(gaps.length
  ? `\n${gaps.length} hueco(s) de cobertura.`
  : `\nAuditoría sin huecos en los elementos auditados. Cobertura mecánica de reglas: ${cifra}.`);
process.exit(gaps.length ? 1 : 0);

}
