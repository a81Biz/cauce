#!/usr/bin/env node
/**
 * regla — qué exige una regla, dónde se comprueba y qué puede fallar.
 *
 * POR QUÉ EXISTE
 *   El manual decía «de las diez ideas se deduce la regla que no has leído». Eso es una excusa:
 *   deducir no debería hacer falta. La regla tiene que aparecer **cuando importa**, y el momento
 *   en que importa es el fallo — donde hoy solo sale un identificador.
 *
 *   Y la lista de «qué puede fallar» del manual estaba escrita DE MEMORIA. Es derivable: cada
 *   `fail()` y cada `warn()` del código lleva su regla. Se deriva, no se recuerda (`RULE-01`).
 *
 * QUÉ RESPONDE
 *   regla SUITE-R44        qué exige, en qué documento vive, y qué herramientas la comprueban
 *   regla --fallos         TODO lo que puede fallar, derivado del código
 *   regla --sin-comprobar  las reglas que ningún verificador emite
 *
 * NO INVENTA. Si una regla no está en ningún documento, lo dice. Si nadie la comprueba, lo dice.
 * «No lo sé» nunca se convierte en «no hay» (`RULE-06`).
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/).
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
// PT-164 · CE-003 · «un argumento se cuela por la deteccion de ROOT». Es una clase de evento con
// nombre en LEXICON, y este comando la reprodujo en su primera ejecucion: `regla renombrar A B`
// tomaba «renombrar» como la RUTA del marco, asi que BASE apuntaba a un directorio inexistente y
// la regla salia «no definida en ningun documento». Los subcomandos se declaran y se excluyen.
const SUBCOMANDOS = new Set(['renombrar']);
const ARGS = process.argv.slice(2);
const BASE = resolve(ARGS.find((a) => !a.startsWith('--') && !SUBCOMANDOS.has(a) && !/^[A-Z]+-R\d+$/.test(a)) ?? join(AQUI, '..'));
const TOOLS = join(BASE, 'tools');

const c = { dim: '\x1b[2m', neg: '\x1b[1m', rojo: '\x1b[31m', verde: '\x1b[32m', fin: '\x1b[0m' };
const di = (s = '') => console.log(s);
const lee = (p) => { try { return readFileSync(p, 'utf8'); } catch { return null; } };

// El documento propietario se DERIVA del prefijo, con el mismo mapa que verify-suite usa. Un
// segundo mapa escrito a mano divergiría (`SUITE-R38`).
const DUENO = {
  SUITE: 'RULES.md', FDGE: 'RULES.md', INTAKE: 'RULES.md', FND: 'RULES.md',
  QA: 'RULES.md', PTSA: 'RULES.md', RULE: '../enterprise-documentation/11-Conventions.md',
  LEX: 'LEXICON.md', EXEC: 'EXECUTION-MODES.md',
};

/**
 * PT-066 · Que una linea DEFINE una regla, y no que la MENCIONA.
 *
 * Hasta aqui el criterio era «la linea contiene el ID y casa HARD|SOFT», y fallaba dos veces:
 *
 *   1. La severidad como filtro dejaba fuera las 20 reglas CHECK de RULES.md —entre ellas
 *      FDGE-R34, que CLAUDE.md nombra precondicion de G4— y las 15 EXEC-* de
 *      EXECUTION-MODES.md, que son prosa y no llevan severidad en la linea. 21 reglas
 *      EXISTENTES se declaraban inexistentes, y el mensaje que lo dice ACUSA a quien las cita:
 *      «ese mensaje apunta a una regla que no existe — y eso es un defecto, no una laguna
 *      tuya». Le paso a este agente en PHASE 0, con tres reglas correctas.
 *
 *   2. Ganaba la PRIMERA linea que mencionaba el ID, y una regla se menciona en el cuerpo de
 *      otras: 26 devolvian el texto ajeno bajo la cabecera «definida en RULES.md». Esas son
 *      peores, porque no fallan — mienten con formato de respuesta correcta. Es lo que este
 *      mismo archivo tiene escrito veinte lineas mas abajo, en un comentario de PT-051:
 *      «una linea equivocada y creible es peor que ninguna».
 *
 * Lo que distingue definir de mencionar es UNA cosa: la definicion EMPIEZA por su ID. El ancla
 * «^» es todo el arreglo, y la severidad deja de ser criterio.
 *
 * El formato de los documentos NO se toca: EXECUTION-MODES.md escribe sus reglas en prosa a
 * proposito —son compuertas y modos, no filas de una tabla de componente—. Se arregla quien
 * lee, no lo que esta bien escrito.
 */
// Dos formas de definir, no tres. RULES.md usa filas de tabla —un componente por fila, con su
// severidad—; LEXICON.md y EXECUTION-MODES.md usan prosa, porque lo que definen son nombres y
// compuertas, no filas de un catalogo. Lo dijo comprobarlo: la primera version trataba LEXICON
// como tabla y dejaba fuera LEX-R26 entera.
const RE_DEFINE = (doc, id) => (doc === 'RULES.md'
  ? new RegExp('^\\|\\s*`' + id + '`\\s*\\|')
  : new RegExp('^`' + id + '`\\s*·'));

/** Dónde está definida una regla y con qué texto. `null` si no aparece en ningún documento. */
export function definicionDe(id, leer = lee) {
  const pref = id.split('-')[0];
  for (const f of [DUENO[pref], 'RULES.md', 'LEXICON.md', 'EXECUTION-MODES.md'].filter(Boolean)) {
    const txt = leer(join(BASE, f));
    if (!txt) continue;
    // PT-066 · DEFINE, no MENCIONA. Ver RE_DEFINE arriba: el ancla «^» es todo el arreglo.
    const re = RE_DEFINE(f, id);
    for (const linea of txt.split(/\r?\n/)) {
      if (re.test(linea)) return { documento: f, texto: linea };
    }
  }
  return null;
}

/**
 * Todo lo que puede fallar, DERIVADO de los `fail()` y `warn()` del código.
 *
 * Se deriva y no se escribe: la tabla del manual estaba a mano y ya se había quedado corta.
 * Devuelve, por regla, en qué herramientas se emite y si bloquea o solo avisa.
 */
/**
 * PT-051 · La linea de una emision se cuenta hasta `m.index`, NUNCA hasta `indexOf(m[0])`.
 *
 * Con dos emisiones identicas en el mismo archivo —el caso real: SUITE-R35 emitida dos veces en
 * verify-fdge.mjs— `indexOf` devolveria LA MISMA LINEA para las dos, y esa linea seria plausible:
 * quien la abriera veria codigo y creeria que es el que busca. Una linea equivocada y creible es
 * peor que ninguna.
 *
 * Es el mismo defecto que PT-043 encontro leyendo las entradas CORRIGE de HISTORY.log, y su caso
 * en selftest usa DOS emisiones a proposito: con una sola, las dos formas dan lo mismo.
 *
 * Y una COMENTADA no cuenta. El primer borrado de esta funcion escribio el patron literal en este
 * mismo comentario, y `--donde` lo delato al instante: «regla.mjs:69». Antes de PT-051 el defecto
 * ya existia y era invisible, porque sin numero de linea un archivo de mas en la lista no llama
 * la atencion. La guarda es una heuristica de linea —basta para lo que hay— y su limite se
 * declara: un `fail()` en la misma linea que codigo, detras de un `/* … *​/`, se contaria.
 */
const lineaDe = (texto, indice) => String(texto).slice(0, indice).split(/\r?\n/).length;
const esComentario = (texto, indice) => {
  const desde = String(texto).lastIndexOf('\n', indice - 1) + 1;
  const inicio = String(texto).slice(desde, indice).trimStart();
  return inicio.startsWith('//') || inicio.startsWith('*') || inicio.startsWith('/*');
};

export function fallosPosibles(fuentes) {
  const RE = /\b(fail|warn)\(\s*'([A-Z]+-R\d+)'/g;
  const por = new Map();
  for (const { archivo, texto } of fuentes ?? []) {
    for (const m of String(texto).matchAll(RE)) {
      const [, tipo, id] = m;
      if (esComentario(texto, m.index)) continue;
      if (!por.has(id)) por.set(id, { id, emisiones: [] });
      por.get(id).emisiones.push({ archivo, linea: lineaDe(texto, m.index), tipo });
    }
  }
  // La forma publica se DERIVA de las emisiones: `herramientas`, `bloquea` y `avisa` existian
  // antes de PT-051 y siguen significando lo mismo. Guardarlas aparte habria creado dos fuentes
  // del mismo hecho, que es lo que SUITE-R38 prohibe.
  return [...por.values()]
    .map((e) => ({
      id: e.id,
      emisiones: e.emisiones.sort((a, b) => a.archivo.localeCompare(b.archivo) || a.linea - b.linea),
      herramientas: [...new Set(e.emisiones.map((x) => x.archivo))].sort(),
      bloquea: e.emisiones.some((x) => x.tipo === 'fail'),
      avisa: e.emisiones.some((x) => x.tipo === 'warn'),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

const fuentes = () => (existsSync(TOOLS) ? readdirSync(TOOLS) : [])
  .filter((f) => f.endsWith('.mjs'))
  .map((f) => ({ archivo: f, texto: lee(join(TOOLS, f)) ?? '' }));

// ─── CLI ────────────────────────────────────────────────────────────────────
const EJECUTADO_DIRECTO = !!process.argv[1]
  && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (EJECUTADO_DIRECTO) {
  const id = ARGS.find((a) => /^[A-Z]+-R\d+$/.test(a));

  // PT-164 · RENUMERAR UNA REGLA ES UN COMANDO, NO UNA BUSQUEDA Y REEMPLAZO A OJO.
  //
  // Se hizo a mano DOS VECES EN DOS DIAS. PT-148 renumero LEX-R33/R34 al descubrir que los IDs
  // estaban ocupados, y el reemplazo alcanzo tambien a RULES.md:94: SUITE-R44 quedo citando
  // «retomada» como LEX-R35 en un sitio y como LEX-R33 en otro, DENTRO DE LA MISMA REGLA. PT-163
  // renumero EXEC-R08 y hubo que comprobar a mano quien lo citaba.
  //
  // Y lo que NINGUNA herramienta caza: verify-suite comprueba que una regla citada EXISTA.
  // LEX-R35 existe — solo que es otra. UNA CITA AL ID EQUIVOCADO-PERO-REAL PASA EN VERDE, y
  // CORE.md la publica al agente como si fuera cierta. Eso NO se arregla aqui: no es mecanizable
  // sin saber que quiso decir quien la escribio (SUITE-R26). Lo que si se arregla es que mover
  // una regla deje de ser una operacion manual que se olvida a medias.
  const iRen = ARGS.indexOf('renombrar');
  if (iRen >= 0) {
    const de = ARGS[iRen + 1];
    const a = ARGS[iRen + 2];
    const APLICA = ARGS.includes('--aplicar');
    const RE_ID = /^[A-Z]+-R\d+[a-z]?$/;
    if (!RE_ID.test(de ?? '') || !RE_ID.test(a ?? '')) {
      di('regla renombrar <DE> <A> [--aplicar]   mueve una regla y TODAS sus citas');
      process.exit(2);
    }
    if (de.split('-')[0] !== a.split('-')[0]) {
      di(`  ${c.rojo}«${de}» y «${a}» son de familias distintas.${c.fin}`);
      di(`  ${c.dim}Cambiar de familia no es renumerar: es cambiar de duenno, y eso lo decide`);
      di(`  quien conoce el reparto (LEX-R22). Este comando mueve el NUMERO, no la casa.${c.fin}`);
      process.exit(2);
    }
    // AC-02 · negarse si el destino EXISTE. Renumerar sobre un ID ocupado es exactamente lo que
    // hizo PT-148, y un comando que lo permitiera lo haria mas rapido y en mas sitios.
    if (definicionDe(a)) {
      di(`  ${c.rojo}«${a}» YA ESTA DEFINIDA${c.fin} en ${definicionDe(a).documento}.`);
      di(`  ${c.dim}Es el defecto que este comando existe para no repetir: PT-148 escribio dos`);
      di(`  reglas sobre IDs ocupados y las dos anteriores desaparecieron de CORE.md.${c.fin}`);
      process.exit(1);
    }
    if (!definicionDe(de)) {
      di(`  ${c.rojo}«${de}» no esta definida en ningun documento del marco.${c.fin}`);
      process.exit(1);
    }
    // Se recorren TODOS los .md del marco y sus subdirectorios, mas las herramientas: una cita
    // vive tanto en prosa como dentro de un fail() o un warn().
    const archivos = [];
    const anda = (dir) => {
      for (const f of readdirSync(dir, { withFileTypes: true })) {
        const ruta = join(dir, f.name);
        // La recursion se perdio al insertar el comentario de abajo: quedaban 8 archivos de 21 y
        // ninguno de tools/. Lo dijo el caso «no queda ninguna cita atras», no la lectura.
        if (f.isDirectory()) { if (f.name !== 'node_modules') anda(ruta); continue; }
        // .sh TAMBIEN: el arnes CITA reglas —«chk … SUITE-R61 …»— y dejarlo fuera hacia que
        // renombrar dejara 23 citas atras. Lo encontro el caso, no la lectura: la primera version
        // recorria solo .md y .mjs porque son donde «viven» las reglas, y las citas viven donde
        // alguien las escribe.
        if (f.name.endsWith('.md') || f.name.endsWith('.mjs') || f.name.endsWith('.sh')) archivos.push(ruta);
      }
    };
    anda(BASE);
    const RE_CITA = new RegExp(de + '(?![0-9A-Za-z])', 'g');
    const tocados = [];
    for (const ruta of archivos) {
      const txt = lee(ruta);
      if (txt === null) continue;
      const cuantas = (txt.match(RE_CITA) ?? []).length;
      if (!cuantas) continue;
      tocados.push({ ruta, cuantas });
      if (APLICA) writeFileSync(ruta, txt.replace(RE_CITA, a), 'utf8');
    }
    const total = tocados.reduce((s, t) => s + t.cuantas, 0);
    di();
    di(`  ${c.neg}${de}${c.fin} → ${c.neg}${a}${c.fin}   ${total} cita(s) en ${tocados.length} archivo(s)`);
    di();
    for (const t of tocados) di(`  ${String(t.cuantas).padStart(4)}  ${t.ruta.replace(BASE, '.')}`);
    di();
    if (!APLICA) {
      di(`  ${c.dim}Nada se ha escrito. SUITE-R06e cubre docs/methodology: un comando que reescribe`);
      di(`  reglas en ${tocados.length} archivos tiene que poder mirarse antes de correr.${c.fin}`);
      di(`  ${c.neg}regla renombrar ${de} ${a} --aplicar${c.fin}`);
    } else {
      di(`  ${c.dim}Escrito. Regenera el nucleo: node tools/build-core.mjs${c.fin}`);
    }
    process.exit(0);
  }


  // PT-051 · `--donde` publica lo que `fallosPosibles` ya recorria y tiraba: el m.index de cada
  // emision. verify-fdge.mjs tiene 1490 lineas, asi que saber que la comprobacion esta «en
  // verify-fdge.mjs» deja el mismo trabajo que no saber nada.
  //
  // Se enumeran TODAS: hay 213 emisiones para 95 reglas, 2,2 de media. Dar solo la primera seria
  // elegir por quien pregunta y callar las otras 1,2.
  if (ARGS.includes('--donde')) {
    if (!id) {
      di(`  ${c.rojo}--donde necesita una regla:  regla SUITE-R34 --donde${c.fin}`);
      process.exit(2);
    }
    const e = fallosPosibles(fuentes()).find((t) => t.id === id);
    di();
    if (!e) {
      // RULE-06 · «no tiene verificador» y «no encontre nada» son DOS respuestas, y una lista
      // vacia las confunde. La cifra de TD-08 se CITA, no se recalcula: audit es quien la mide.
      di(`  ${c.neg}${id}${c.fin}   ${c.rojo}ningún verificador la emite con su nombre.${c.fin}`);
      di(`  ${c.dim}No es un fallo de esta consulta: 62 reglas están así, contadas en`);
      di(`  10-Technical-Debt.md (TD-08). Es deuda MEDIDA.${c.fin}`);
      di();
      process.exit(0);
    }
    for (const x of e.emisiones) {
      const t = x.tipo === 'fail' ? `${c.rojo}fail${c.fin}` : `${c.dim}warn${c.fin}`;
      di(`  ${c.neg}${id.padEnd(12)}${c.fin} ${`${x.archivo}:${x.linea}`.padEnd(26)} ${t}`);
    }
    di();
    di(`  ${c.dim}${e.emisiones.length} emisión(es). «fail» bloquea; «warn» solo lo dice.${c.fin}`);
    di();
    process.exit(0);
  }

  if (ARGS.includes('--fallos') || ARGS.includes('--sin-comprobar')) {
    const todos = fallosPosibles(fuentes());
    if (ARGS.includes('--sin-comprobar')) {
      const rules = lee(join(BASE, 'RULES.md')) ?? '';
      const declaradas = [...rules.matchAll(/\|\s*`([A-Z]+-R\d+)`\s*\|\s*(HARD|SOFT)/g)].map((m) => m[1]);
      const emiten = new Set(todos.map((t) => t.id));
      const faltan = declaradas.filter((r) => !emiten.has(r));
      di(`${c.neg}Reglas declaradas que ningún verificador emite${c.fin} — ${faltan.length} de ${declaradas.length}`);
      di(`${c.dim}No significa que no se comprueben: pueden verificarse sin citar su ID. Significa`);
      di(`que si fallan, no lo dirán con su nombre (RULE-06).${c.fin}`);
      di();
      for (const r of faltan) di(`  ${r}`);
      process.exit(0);
    }
    di(`${c.neg}Qué puede fallar${c.fin} — ${todos.length} reglas, derivadas del código`);
    di(`${c.dim}Esta lista NO está escrita: sale de los fail() y warn() de tools/. Si alguien añade`);
    di(`una comprobación, aparece sola.${c.fin}`);
    di();
    for (const t of todos) {
      const sev = t.bloquea && t.avisa ? 'bloquea/avisa' : t.bloquea ? 'bloquea' : 'avisa';
      di(`  ${t.id.padEnd(12)} ${sev.padEnd(14)} ${t.herramientas.join(' · ')}`);
    }
    di();
    di(`${c.dim}Para saber qué exige una:  node tools/regla.mjs ${todos[0]?.id ?? 'SUITE-R01'}${c.fin}`);
    process.exit(0);
  }

  if (!id) {
    di(`${c.neg}regla${c.fin} — qué exige una regla, dónde vive y qué la comprueba`);
    di();
    di(`  ${c.neg}regla SUITE-R44${c.fin}       qué exige y quién la comprueba`);
    di(`  ${c.neg}regla --fallos${c.fin}        todo lo que puede fallar, derivado del código`);
    di(`  ${c.neg}regla --sin-comprobar${c.fin} reglas que ningún verificador emite con su nombre`);
    process.exit(ARGS.length ? 2 : 0);
  }

  const def = definicionDe(id);
  const emisores = fallosPosibles(fuentes()).find((t) => t.id === id);

  di();
  di(`  ${c.neg}${id}${c.fin}`);
  di();
  if (!def) {
    di(`  ${c.rojo}No está definida en ningún documento del marco.${c.fin}`);
    di(`  ${c.dim}Si un mensaje la cita, ese mensaje apunta a una regla que no existe — y eso`);
    di(`  es un defecto, no una laguna tuya.${c.fin}`);
  } else {
    di(`  ${c.dim}definida en${c.fin}  ${def.documento}`);
    di();
    // El texto de la fila, sin la sintaxis de tabla, envuelto para poder leerse.
    const cuerpo = def.texto.replace(/^\|/, '').replace(/\|$/, '').split('|').slice(2).join('|')
      .replace(/\*\*/g, '').trim();
    let linea = '  ';
    for (const p of cuerpo.split(/\s+/)) {
      if ((linea + p).length > 94) { di(linea); linea = '  '; }
      linea += p + ' ';
    }
    if (linea.trim()) di(linea);
  }
  di();
  if (emisores) {
    const sev = emisores.bloquea && emisores.avisa ? 'bloquea y avisa según el caso'
      : emisores.bloquea ? 'BLOQUEA' : 'solo avisa';
    di(`  ${c.dim}la comprueba${c.fin}  ${emisores.herramientas.join(' · ')}   (${sev})`);
  } else {
    di(`  ${c.dim}la comprueba${c.fin}  ${c.rojo}ningún verificador la emite con su nombre.${c.fin}`);
    di(`  ${c.dim}No significa que no se cumpla: significa que si falla, no lo dirá con su ID.${c.fin}`);
  }
  di();
  process.exit(0);
}
