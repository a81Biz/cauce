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

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ARGS = process.argv.slice(2);
const BASE = resolve(ARGS.find((a) => !a.startsWith('--') && !/^[A-Z]+-R\d+$/.test(a)) ?? join(AQUI, '..'));
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

/** Dónde está definida una regla y con qué texto. `null` si no aparece en ningún documento. */
export function definicionDe(id, leer = lee) {
  const pref = id.split('-')[0];
  for (const f of [DUENO[pref], 'RULES.md', 'LEXICON.md', 'EXECUTION-MODES.md'].filter(Boolean)) {
    const txt = leer(join(BASE, f));
    if (!txt) continue;
    for (const linea of txt.split(/\r?\n/)) {
      if (linea.includes(`\`${id}\``) && /HARD|SOFT/.test(linea)) {
        return { documento: f, texto: linea };
      }
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
export function fallosPosibles(fuentes) {
  const RE = /\b(fail|warn)\(\s*'([A-Z]+-R\d+)'/g;
  const por = new Map();
  for (const { archivo, texto } of fuentes ?? []) {
    for (const m of String(texto).matchAll(RE)) {
      const [, tipo, id] = m;
      if (!por.has(id)) por.set(id, { id, bloquea: false, avisa: false, herramientas: new Set() });
      const e = por.get(id);
      if (tipo === 'fail') e.bloquea = true; else e.avisa = true;
      e.herramientas.add(archivo);
    }
  }
  return [...por.values()]
    .map((e) => ({ ...e, herramientas: [...e.herramientas].sort() }))
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
