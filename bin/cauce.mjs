#!/usr/bin/env node
/**
 * cauce — punto de entrada del paquete.
 *
 * POR QUÉ EXISTE
 *   La suite se repartía copiando `docs/methodology/` a mano. Cada proyecto acababa con la
 *   suya, nada avisaba cuando se separaban, y las correcciones que un proyecto hacía se
 *   quedaban ahí: en la primera instalación real, cuatro correcciones —una de ellas un verde
 *   falso sobre `FND-R24`, la regla contra la que audita PTSA— vivieron días en un proyecto y
 *   en ningún otro. Se descubrió por accidente.
 *
 *   Este binario existe para que eso deje de depender de la suerte: la versión queda anclada,
 *   actualizar es un comando, y sincronizar a ciegas es imposible.
 *
 * QUÉ HACE Y QUÉ NO
 *   Pone los archivos donde van y ejecuta verificadores. **No decide nada.** La instalación de
 *   verdad —terreno, movimientos, dependencias, Declaración de Valor— es conversacional y la
 *   conduce el agente leyendo `INSTALL.md` (`SUITE-R28`).
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/).
 */

import { readFileSync, existsSync, readdirSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const AQUI = dirname(fileURLToPath(import.meta.url));
const PAQUETE = resolve(AQUI, '..');              // raíz del paquete instalado
const CARGA = join(PAQUETE, 'docs', 'methodology'); // lo que se instala en el destino
const VERSION = JSON.parse(readFileSync(join(PAQUETE, 'package.json'), 'utf8')).version;

const [, , comando, ...resto] = process.argv;
const DESTINO = resolve(resto.find((a) => !a.startsWith('--')) ?? process.cwd());
const SUITE_EN_DESTINO = join(DESTINO, 'docs', 'methodology');
const FORZAR = resto.includes('--forzar');

const c = { dim: '\x1b[2m', neg: '\x1b[1m', rojo: '\x1b[31m', verde: '\x1b[32m', fin: '\x1b[0m' };
const di = (s = '') => console.log(s);
const err = (s) => console.error(`${c.rojo}${s}${c.fin}`);

// ── utilidades ──────────────────────────────────────────────────────────────
const listarRec = (base, dir = base, out = []) => {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) listarRec(base, p, out);
    else out.push(relative(base, p).split(sep).join('/'));
  }
  return out;
};
const sha = (p) => createHash('sha1').update(readFileSync(p)).digest('hex').slice(0, 12);
const corre = (script, args, cwd = DESTINO) => {
  const bin = join(SUITE_EN_DESTINO, 'tools', script);
  if (!existsSync(bin)) { err(`Falta ${script} en el destino. ¿Ejecutaste «cauce install»?`); return 1; }
  try {
    execFileSync('node', [bin, ...args], { cwd, stdio: 'inherit' });
    return 0;
  } catch (e) { return e.status ?? 1; }
};

// ── divergencia: nunca se sincroniza a ciegas (SUITE-R31) ───────────────────
function divergencia() {
  if (!existsSync(SUITE_EN_DESTINO)) return { nueva: true, difieren: [], soloDestino: [] };
  const enPaquete = listarRec(CARGA);
  const enDestino = listarRec(SUITE_EN_DESTINO);
  const difieren = enPaquete.filter((f) => {
    const d = join(SUITE_EN_DESTINO, ...f.split('/'));
    return existsSync(d) && sha(join(CARGA, ...f.split('/'))) !== sha(d);
  });
  const soloDestino = enDestino.filter((f) => !existsSync(join(CARGA, ...f.split('/'))));
  return { nueva: false, difieren, soloDestino };
}

function copiarCarga() {
  let n = 0;
  for (const f of listarRec(CARGA)) {
    const destino = join(SUITE_EN_DESTINO, ...f.split('/'));
    mkdirSync(dirname(destino), { recursive: true });
    copyFileSync(join(CARGA, ...f.split('/')), destino);
    n++;
  }
  return n;
}

// ── comandos ────────────────────────────────────────────────────────────────
const comandos = {
  install() {
    // Autoalojamiento: cauce gobernándose con sus propias reglas. Aquí la carga y el destino
    // son el mismo directorio, y copiar seria copiar cada archivo sobre si mismo — inofensivo
    // pero mentiroso: diria «48 archivos instalados» sin haber instalado nada. Se dice.
    if (CARGA === SUITE_EN_DESTINO) {
      di(`${c.verde}cauce ${VERSION}${c.fin} · este repositorio ES cauce: la carga y el destino son el mismo sitio.`);
      di(`${c.dim}No hay nada que copiar. Se regenera el núcleo y lo demás sigue igual.${c.fin}`);
      di();
      const r = corre('build-core.mjs', [SUITE_EN_DESTINO]);
      di();
      di(`Lo que falta para que se gobierne a sí mismo lo dice ${c.neg}cauce verify${c.fin}:`);
      di(`${c.dim}registro, terreno, estado y la documentación de Foundation. Es la misma${c.fin}`);
      di(`${c.dim}instalación conversacional que cualquier proyecto — sin excepción por ser este.${c.fin}`);
      return r;
    }
    const d = divergencia();
    if (!d.nueva && (d.difieren.length || d.soloDestino.length) && !FORZAR) {
      err(`El destino ya tiene una copia del marco y NO es idéntica a la de cauce ${VERSION}.`);
      di();
      if (d.difieren.length) {
        di(`  ${d.difieren.length} archivo(s) con contenido distinto:`);
        for (const f of d.difieren.slice(0, 10)) di(`    ${f}`);
      }
      if (d.soloDestino.length) di(`  ${d.soloDestino.length} archivo(s) que solo existen en el destino.`);
      di();
      di('Sobrescribir puede revertir correcciones que ese proyecto hizo bajo sus propios PT:');
      di('ha estado a punto de pasar. Un archivo que difiere no dice por sí solo quién tiene');
      di('razón — si la corrección se hizo allí, falta propagarla; si cauce avanzó, falta');
      di(`migrar. Decidirlo es humano (${c.neg}SUITE-R31${c.fin}).`);
      di();
      di(`  node docs/methodology/tools/comparar-marco.mjs   ${c.dim}# qué difiere y en qué dirección${c.fin}`);
      di(`  cauce install --forzar                           ${c.dim}# sobrescribe, con la decisión tomada${c.fin}`);
      return 2;
    }
    const n = copiarCarga();
    di(`${c.verde}cauce ${VERSION}${c.fin} · ${n} archivos en docs/methodology/`);
    const r = corre('build-core.mjs', [SUITE_EN_DESTINO]);
    di();
    di(`Ahora abre Claude Code aquí y escribe:  ${c.neg}instala el framework${c.fin}`);
    di(`${c.dim}El terreno, los movimientos, las dependencias y la Declaración de Valor se${c.fin}`);
    di(`${c.dim}deciden en conversación, no aquí (SUITE-R28). El procedimiento está en INSTALL.md.${c.fin}`);
    return r;
  },

  verify() {
    let peor = 0;
    // Las herramientas nuevas viajaban en el paquete y no las invocaba nadie: un verificador
    // que no se ejecuta es documentacion. verify-qa y verify-ptsa salen con 2 cuando no hay
    // nada que verificar, y eso no cuenta como fallo.
    for (const [script, args] of [
      ['verify-suite.mjs', [SUITE_EN_DESTINO]],
      ['build-core.mjs', ['--check', SUITE_EN_DESTINO]],
      ['verify-fdge.mjs', ['--all']],
      ['verify-qa.mjs', [DESTINO]],
      ['verify-ptsa.mjs', [DESTINO]],
      ['revisar-secretos.mjs', [DESTINO]],
    ]) {
      di(`${c.dim}── ${script}${c.fin}`);
      const r = corre(script, args);
      peor = Math.max(peor, r === 2 ? 0 : r);   // 2 = «nada que verificar aquí», no es fallo
    }
    return peor;
  },

  compare() {
    const d = divergencia();
    if (d.nueva) { err('El destino no tiene el marco instalado.'); return 2; }
    if (!d.difieren.length && !d.soloDestino.length) {
      di(`${c.verde}Idénticas${c.fin} · el destino coincide con cauce ${VERSION}.`);
      return 0;
    }
    di(`Frente a cauce ${VERSION}:`);
    for (const f of d.difieren) di(`  difiere        ${f}`);
    for (const f of d.soloDestino) di(`  solo destino   ${f}`);
    di();
    di('Un archivo que difiere no dice quién tiene razón. Si la corrección se hizo en el');
    di('proyecto, falta propagarla; si cauce avanzó, falta migrar. Decidirlo es humano.');
    return 1;
  },

  core() { return corre('build-core.mjs', [SUITE_EN_DESTINO]); },

  version() { di(`cauce ${VERSION}`); return 0; },
};

if (!comando || comando === '--help' || comando === '-h' || !comandos[comando]) {
  di(`${c.neg}cauce${c.fin} ${VERSION} — marco de gobernanza para desarrollo asistido por IA`);
  di();
  di(`  ${c.neg}cauce install${c.fin} [ruta]   instala el marco en un proyecto y genera su núcleo`);
  di(`  ${c.neg}cauce verify${c.fin}  [ruta]   coherencia del marco, núcleo sincronizado y cumplimiento de los PT`);
  di(`  ${c.neg}cauce compare${c.fin} [ruta]   qué difiere entre la copia del proyecto y esta versión`);
  di(`  ${c.neg}cauce core${c.fin}    [ruta]   regenera CORE.md y CORE-PTSA.md`);
  di();
  di(`${c.dim}La instalación de verdad es conversacional: tras «cauce install», dile a Claude${c.fin}`);
  di(`${c.dim}«instala el framework» y conducirá el terreno, los movimientos y las dependencias.${c.fin}`);
  process.exit(comando && !comandos[comando] ? 2 : 0);
}

process.exit(comandos[comando]());
