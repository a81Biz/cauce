#!/usr/bin/env node
/**
 * matriz.mjs — PT-119 · deriva `docs/implementation/MATRIZ.md`.
 *
 * Lo pidio el firmante: «quiero la matriz para saber que falta por corregir, que errores se
 * repiten y como los vamos a solventar».
 *
 * TODAS LAS CIFRAS SE DERIVAN. Ninguna se transcribe:
 *
 *   clase y enunciado    LEXICON §4.4                        (LEX-R31)
 *   veces · tareas       EVENTOS.jsonl, solo INSTANCIAS      (PT-125)
 *   primera y ultima     las fechas de esos registros
 *   ordinal declarado    el numero que la propia entrada escribio
 *   regla duena          RULES.md — la regla que CITA la clase
 *   tiene verificador    los fail()/warn() REALES del codigo (regla.mjs · fallosPosibles)
 *
 * POR QUE LA REGLA DUENA SE DERIVA DE LA CITA, y no de una tabla. `AC-04` lo pide, y hay un
 * motivo: una tabla clase→regla escrita a mano es exactamente la copia que diverge. Aqui la
 * pertenencia la DECLARA la regla, en su propio texto, y se lee de ahi. Si ninguna cita una
 * clase, esa clase sale SIN DUEÑO — que es un hecho, no un fallo de la herramienta.
 *
 * Y HAY TRES DESENLACES, NO DOS (la leccion de PT-110). Un `EVENTOS.jsonl` ilegible NO produce
 * el mismo informe que uno vacio: produce `SIN EVALUAR`. Sin eso, no poder mirar y no haber nada
 * se dirian igual, que es lo que RULE-06 prohibe.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fallosPosibles } from './regla.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = process.argv.find((a) => a.startsWith('--raiz='))?.slice(7)
  ?? join(AQUI, '..', '..', '..');
const IMPL = join(RAIZ, 'docs', 'implementation');
const SUITE = join(RAIZ, 'docs', 'methodology');
const TOOLS = join(SUITE, 'tools');

const lee = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);

/** Las clases, con su enunciado, tal como LEXICON §4.4 las declara. */
export function clasesDeclaradas(lexicon) {
  if (lexicon === null || lexicon === undefined) return null;
  return [...String(lexicon).matchAll(/^\|\s*`(CE-\d{3})`\s*\|([^|]*)\|([^|]*)\|/gm)]
    .map((m) => ({ id: m[1], nombre: m[2].trim(), enunciado: m[3].trim() }));
}

/**
 * La regla DUEÑA de una clase es la que la cita en su propia fila de RULES.md.
 *
 * Se lee la fila entera —`| \`ID\` | SEVERIDAD | texto |`— y se mira si el texto nombra la clase.
 * Que una regla se declare duena de un tropiezo es una afirmacion suya, y vive donde vive la
 * regla; ninguna tabla aparte puede divergir de ella (SUITE-R38, LEX-R23).
 */
export function duenasPorClase(fuentes) {
  if (fuentes === null || fuentes === undefined) return null;
  const textos = Array.isArray(fuentes) ? fuentes : [fuentes];
  if (textos.some((x) => x === null || x === undefined)) return null;
  const por = new Map();
  // DOS FORMAS, porque las reglas se definen de dos maneras y las dos son legitimas: la fila de
  // tabla y la SUELTA, con la severidad entre parentesis. Mirar solo la fila dejaba fuera a
  // SUITE-R14 —definida suelta— y con ella a CE-008: una clase habria salido «sin dueño»
  // TENIENDO dueño, que es peor que no derivar nada.
  const FILA = /^\|\s*`([A-Z]+-R\d+)`\s*\|\s*(HARD|SOFT|CHECK)\s*\|(.*)$/;
  const SUELTA = /^`([A-Z]+-R\d+)`\s*·\s*\*\*\((HARD|SOFT|CHECK)\)\*\*(.*)$/;
  const CLASE = /\bCE-(\d{3})\b/g;
  for (const texto of textos) {
    const lineas = String(texto).split(/\r?\n/);
    lineas.forEach((linea, i) => {
      const m = FILA.exec(linea) ?? SUELTA.exec(linea);
      if (!m) return;
      // Una regla en forma suelta ocupa varias lineas: se lee hasta la primera en blanco.
      let cuerpo = m[3];
      if (!FILA.test(linea)) {
        for (let k = i + 1; k < lineas.length && lineas[k].trim() !== ""; k += 1) {
          cuerpo += " " + lineas[k];
        }
      }
      for (const c of new Set([...cuerpo.matchAll(CLASE)].map((x) => "CE-" + x[1]))) {
        if (!por.has(c)) por.set(c, []);
        if (!por.get(c).some((d) => d.id === m[1])) por.get(c).push({ id: m[1], severidad: m[2] });
      }
    });
  }
  return por;
}

/** Los eventos de EVENTOS.jsonl. `null` si no se puede leer: no saber no es cero (RULE-06). */
export function eventosDe(jsonl) {
  if (jsonl === null || jsonl === undefined) return null;
  const filas = [];
  let cabecera = null;
  for (const linea of String(jsonl).split(/\r?\n/)) {
    if (!linea.trim()) continue;
    let r;
    try { r = JSON.parse(linea); } catch { return null; }   // una linea rota invalida el archivo
    if (r && r._ !== undefined) { cabecera = r; continue; }
    if (r) filas.push(r);
  }
  filas.cabecera = cabecera;
  return filas;
}

/**
 * Una fila por clase. `veces` cuenta INSTANCIAS: las menciones se llevan aparte porque contarlas
 * inflaria la matriz con recurrencias que no ocurrieron (PT-125).
 */
export function filasDe(clases, eventos, duenas, verificadores) {
  return clases.map((c) => {
    const suyos = eventos.filter((e) => e.clase === c.id && e.polaridad !== 'MENCION');
    const menciones = eventos.filter((e) => e.clase === c.id && e.polaridad === 'MENCION').length;
    const fechas = suyos.map((e) => e.fecha).filter(Boolean).sort();
    const ordinales = suyos.map((e) => e.ordinal_declarado?.valor).filter((n) => Number.isFinite(n));
    const duenasDe = duenas.get(c.id) ?? [];
    // «Tiene verificador» NO es «la regla existe»: es que alguna herramienta EMITA por ella.
    // Una regla sin emision es una obligacion que no puede fallar, y eso es lo que la matriz
    // tiene que hacer visible (P-003 de la Declaracion de Valor).
    const conVerificador = duenasDe.filter((d) => verificadores.has(d.id));
    return {
      ...c,
      veces: suyos.length,
      menciones,
      primera: fechas[0] ?? null,
      ultima: fechas[fechas.length - 1] ?? null,
      tareas: [...new Set(suyos.map((e) => e.tarea).filter(Boolean))],
      ordinalMaximo: ordinales.length ? Math.max(...ordinales) : null,
      duenas: duenasDe,
      verificadores: conVerificador.map((d) => ({
        id: d.id, ...verificadores.get(d.id),
      })),
    };
  });
}

function render(filas, meta) {
  const L = [];
  L.push('# `MATRIZ.md` — qué se repite, y qué no tiene dueño');
  L.push('');
  L.push('> **GENERADO.** No se edita a mano: `node docs/methodology/tools/matriz.mjs`.');
  L.push('> Toda cifra se deriva de `EVENTOS.jsonl` (`PT-125`), `LEXICON` §4.4, `RULES.md` y los');
  L.push('> `fail()` reales del código. Una cifra transcrita caduca — es `CE-010`, medida quince');
  L.push('> veces en este repositorio.');
  L.push('');
  // NO se estampa la fecha de generacion: haria el archivo irreproducible y «--check» fallaria
  // siempre, que es la forma de que una comprobacion de frescura se apague sola. Se declara el
  // RANGO DE LOS DATOS, que se deriva y ademas dice mas: de cuando a cuando va lo medido.
  L.push(`${meta.entradas ?? 'SIN EVALUAR'} entradas recorridas · `
    + `${meta.identificadores} identificadores · ${meta.instancias} instancias · `
    + `${meta.clases} clases declaradas · datos de ${meta.desde ?? '—'} a ${meta.hasta ?? '—'}`);
  L.push('');
  L.push('| Clase | Qué es | Veces | Ordinal declarado | Primera | Última | Regla dueña | ¿Puede fallar? |');
  L.push('|:---|:---|--:|--:|:---|:---|:---|:---|');
  for (const f of filas) {
    const duenas = f.duenas.length ? f.duenas.map((d) => `\`${d.id}\``).join(' · ') : '**—**';
    const vf = f.duenas.length === 0
      ? '**sin dueño**'
      : (f.verificadores.length
        ? f.verificadores.map((v) => `\`${v.id}\` ${v.bloquea ? 'falla' : 'avisa'}`).join(' · ')
        : '**NO**: la regla existe y nada emite por ella');
    L.push(`| \`${f.id}\` | ${f.nombre} | ${f.veces} | ${f.ordinalMaximo ?? '—'} | `
      + `${f.primera ?? '—'} | ${f.ultima ?? '—'} | ${duenas} | ${vf} |`);
  }
  L.push('');
  L.push('## Qué falta por corregir');
  L.push('');
  const huerfanas = filas.filter((f) => f.duenas.length === 0).sort((a, b) => b.veces - a.veces);
  if (!huerfanas.length) {
    L.push('Ninguna clase sin dueño.');
  } else {
    L.push(`**${huerfanas.length} de ${filas.length} clases no tienen regla que las reclame.**`);
    L.push('Ordenadas por cuántas veces han ocurrido:');
    L.push('');
    for (const f of huerfanas) {
      const orden = f.ordinalMaximo ? ` · la propia entrada llegó a declarar **${f.ordinalMaximo}**` : '';
      L.push(`- \`${f.id}\` **${f.nombre}** — ${f.veces} instancia(s)${orden}`);
      if (f.tareas.length) L.push(`  ${f.tareas.slice(0, 8).join(' · ')}`);
    }
  }
  L.push('');
  L.push('**Esta matriz no prioriza ni abre nada.** Enumera. Puntuar es `FPGE` y tiene su propia');
  L.push('fórmula; abrir una tarea lo decide una persona (`FPGE-R04`).');
  L.push('');
  return L.join('\n') + '\n';
}

export function construye({ lexicon, rules, jsonl, verificadores }) {
  const clases = clasesDeclaradas(lexicon);
  const eventos = eventosDe(jsonl);
  const duenas = duenasPorClase(rules);
  // TRES desenlaces, no dos: sin fuente NO se escribe una matriz vacia, que diria «ningun
  // evento» donde lo cierto es «no se pudo mirar» (RULE-06, y la leccion de PT-110).
  if (clases === null || eventos === null || duenas === null) {
    const cuales = [
      clases === null ? 'LEXICON.md' : null,
      eventos === null ? 'EVENTOS.jsonl' : null,
      duenas === null ? 'RULES.md o LEXICON.md' : null,
    ].filter(Boolean);
    return { sinEvaluar: cuales };
  }
  const filas = filasDe(clases, eventos, duenas, verificadores);
  return {
    filas,
    texto: render(filas, {
      desde: filas.map((f) => f.primera).filter(Boolean).sort()[0] ?? null,
      hasta: filas.map((f) => f.ultima).filter(Boolean).sort().pop() ?? null,
      clases: clases.length,
      // «entradas» lo declara el generador que las recorrio; aqui NO se recuenta (SUITE-R38).
      // Si no viene, se dice SIN EVALUAR: recontarlo daria 142 identificadores donde hay 164
      // entradas —PT-094 tiene tres— y esa cifra saldria publicada bajo la etiqueta equivocada.
      entradas: eventos.cabecera?.entradas_recorridas ?? null,
      identificadores: new Set(eventos.map((e) => `${e.origen}:${e.tarea}`)).size,
      instancias: filas.reduce((n, f) => n + f.veces, 0),
    }),
  };
}

const EJECUTADO_DIRECTO = process.argv[1]
  && fileURLToPath(import.meta.url) === process.argv[1];

if (EJECUTADO_DIRECTO) {
  const fuentes = (existsSync(TOOLS) ? readdirSync(TOOLS) : [])
    .filter((f) => f.endsWith('.mjs'))
    .map((f) => ({ archivo: f, texto: lee(join(TOOLS, f)) ?? '' }));
  const verificadores = new Map(fallosPosibles(fuentes).map((e) => [e.id, e]));

  const r = construye({
    lexicon: lee(join(SUITE, 'LEXICON.md')),
    // Las dos fuentes PROPIETARIAS de reglas (LEX-R23): las SUITE/FDGE/FND/... viven en
    // RULES.md y las LEX-R en LEXICON.md. Mirar solo una dejaria a LEX-R22 sin poder reclamar
    // ninguna clase.
    rules: [lee(join(SUITE, 'RULES.md')), lee(join(SUITE, 'LEXICON.md'))],
    jsonl: lee(join(IMPL, 'EVENTOS.jsonl')),
    verificadores,
  });

  if (r.sinEvaluar) {
    console.error(`SIN EVALUAR: no se pudo leer ${r.sinEvaluar.join(', ')}. `
      + 'NO se escribe MATRIZ.md: una matriz vacia diria «ningun evento», que no es lo mismo '
      + 'que «no se pudo mirar» (RULE-06).');
    process.exit(2);
  }

  const P = join(IMPL, 'MATRIZ.md');
  const actual = lee(P);
  if (process.argv.includes('--check')) {
    if (actual === r.texto) { console.log('MATRIZ.md al dia con sus fuentes.'); process.exit(0); }
    console.error('MATRIZ.md desincronizado con sus fuentes (EVENTOS.jsonl · LEXICON · RULES · '
      + 'los fail() del codigo). → node docs/methodology/tools/matriz.mjs');
    process.exit(1);
  }
  writeFileSync(P, r.texto, 'utf8');
  const huerfanas = r.filas.filter((f) => f.duenas.length === 0);
  const sinVerificador = r.filas.filter((f) => f.duenas.length && !f.verificadores.length);
  console.log(`MATRIZ.md escrito · ${r.filas.length} clases`);
  console.log(`  sin regla duena            ${huerfanas.length}`);
  console.log(`  con regla y sin verificador ${sinVerificador.length}`);
}
