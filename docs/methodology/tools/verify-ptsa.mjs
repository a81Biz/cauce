#!/usr/bin/env node
/**
 * verify-ptsa — Verificación mecánica de una auditoría PTSA.
 *
 * POR QUÉ EXISTE
 *   PTSA declaraba QUÉ había cubierto, pero nada enumeraba el universo contra el que se
 *   medía esa cobertura. Un producto que nadie miró simplemente no aparecía — el mismo modo
 *   de fallo que hace que una auditoría por descubrimiento encuentre cosas distintas en cada
 *   pasada. Este script comprueba que la matriz de PTSA/COVERAGE.md está completa y que el
 *   score publicado es coherente con ella (PTSA-R76..R80).
 *
 * Uso:  node verify-ptsa.mjs [ruta-proyecto]
 * Exit: 0 sin errores · 1 con errores · 2 no hay auditoría que verificar
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/). En JS, «.» NO casa \r —es terminador de
 * linea—, de modo que un regex anclado en $ sin flag m falla en archivos de Windows.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.argv[2] ?? process.cwd());
const P = join(ROOT, 'PTSA');
const errors = [];
const warnings = [];
const passed = [];
const fail = (r, m) => errors.push({ r, m });
const warn = (r, m) => warnings.push({ r, m });
const ok = (r, m) => passed.push({ r, m });
const rd = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);

if (!existsSync(P)) {
  console.log('No existe PTSA/ en este proyecto: no hay auditoría que verificar.');
  process.exit(2);
}
// Una auditoria arranca al escribir RESUMEN.md o el primer producto. Sin ninguno de los dos
// no hay nada que verificar: PTSA/ puede ser la carpeta de la especificacion, no un espacio
// de trabajo. Distinguirlo evita un fallo enganoso al correr la herramienta en la suite misma.
if (!existsSync(join(P, 'RESUMEN.md')) && !existsSync(join(P, 'Products'))) {
  console.log('PTSA/ existe pero no contiene una auditoria (sin RESUMEN.md ni Products/).');
  process.exit(2);
}

const VERDICTOS = ['PASS', 'FAIL', 'NO_APLICA', 'NO_EVALUADA'];
const DIMS = ['D1', 'D2', 'D3', 'D4'];
const findDirPre = join(P, 'Findings');
// Regex LITERALES: montarlos desde strings ha fallado cinco veces en este proyecto.
const RE_SEC_NO_EVALUADA = /^#{1,4}.*NO_EVALUADA/im;
const RE_SEC_NO_APLICA = /^#{1,4}.*NO_APLICA/im;
const RE_ENCABEZADO = /^#{1,4}\s/m;

// ── PTSA-R47 · un archivo por producto ──────────────────────────────────────
const prodDir = join(P, 'Products');
const productos = existsSync(prodDir)
  ? readdirSync(prodDir).filter((f) => /^P-\d+.*\.md$/.test(f)).map((f) => f.match(/^P-\d+/)[0])
  : [];
if (!productos.length) fail('PTSA-R47', 'PTSA/Products/ no contiene ningún P-NNN.md. PHASE 4 no puede cerrar sin ellos.');
else ok('PTSA-R47', `${productos.length} producto(s) con archivo propio.`);

// ── PTSA-R37 · ningún producto queda en DRAFT al cerrar ─────────────────────
const resumen = rd(join(P, 'RESUMEN.md')) ?? '';
const cerrada = /auditoria_estado:\s*COMPLETE/i.test(resumen);
for (const p of productos) {
  const f = readdirSync(prodDir).find((x) => x.startsWith(p));
  const txt = rd(join(prodDir, f)) ?? '';
  const est = txt.match(/^\s*estado:\s*(\w+)/im)?.[1];
  if (!est) fail('PTSA-R37', `${p}: su archivo no declara estado.`);
  else if (cerrada && est === 'DRAFT') fail('PTSA-R37', `${p}: sigue en DRAFT con la auditoría marcada COMPLETE.`);
}

// ── PTSA-R77 · matriz de cobertura sin celdas en blanco ─────────────────────
const cov = rd(join(P, 'COVERAGE.md'));
if (cov === null) {
  fail('PTSA-R77', 'Falta PTSA/COVERAGE.md — sin matriz, la cobertura declarada no es verificable.');
} else if (/YYYY-MM-DD/.test(cov)) {
  // La plantilla se copio y no se completo. Sin esto, sus filas de ejemplo cuadran solas y
  // la matriz «pasa» describiendo un sistema que no es el auditado.
  fail('PTSA-R77', 'COVERAGE.md conserva los marcadores de la plantilla (YYYY-MM-DD): se copió y no se completó.');
} else {
  const filas = [];
  // Lo que va dentro de una valla ``` es un EJEMPLO, no la matriz: un documento podia mostrar
  // una tabla de muestra y verificarse como si fuera la real.
  let enValla = false;
  for (const line of cov.split(/\r?\n/)) {
    const t = line.trim();
    if (t.startsWith('```')) { enValla = !enValla; continue; }
    if (enValla) continue;
    if (!t.startsWith('|')) continue;
    const c = t.split('|').slice(1, -1).map((x) => x.trim());
    if (c.length < 5) continue;
    if (/^:?-+:?$/.test(c[1]) || /^D1/i.test(c[1])) continue;   // separador o cabecera
    if (!VERDICTOS.some((v) => c.slice(1, 5).join(' ').includes(v))) continue;
    filas.push({ elem: c[0], celdas: c.slice(1, 5) });
  }
  if (!filas.length) {
    fail('PTSA-R77', 'COVERAGE.md no contiene ninguna fila de matriz reconocible.');
  } else {
    let vacias = 0; let evaluadas = 0; let total = 0; let fuera = 0;
    for (const f of filas) {
      f.celdas.forEach((c, i) => {
        total++;
        const v = VERDICTOS.find((x) => c.includes(x));
        if (!v) { vacias++; fail('PTSA-R77', `${f.elem} · ${DIMS[i]}: celda sin veredicto. Una celda en blanco es indistinguible de una que nadie miró.`); return; }
        if (v === 'NO_APLICA') { fuera++; return; }
        if (v === 'PASS' || v === 'FAIL') evaluadas++;
      });
    }
    if (!vacias) ok('PTSA-R77', `Matriz completa: ${filas.length} elemento(s) × ${DIMS.length} dimensiones.`);

    // PTSA-R76 · el universo declarado debe cubrir lo que existe. Sin esto una matriz de UNA
    // fila con todo en PASS se certificaba: el universo se lo inventa el propio auditado.
    // Cada producto necesita su PROPIA fila. Con includes(), una fila «P-001 y P-002» valia
    // por los dos y colapsaba ocho celdas en cuatro: media auditoria desaparecia sin rastro.
    const elems = filas.map((f) => f.elem.replace(/`|\*/g, '').trim());
    const propia = (q) => elems.filter((e) => e === q || e.startsWith(q + ' ') || e.startsWith(q + ':')).length;
    const faltantes = productos.filter((q) => propia(q) === 0);
    for (const q of productos) {
      if (propia(q) > 1) fail('PTSA-R77', `${q}: aparece en ${propia(q)} filas de la matriz. Un elemento, una fila: si no, sus celdas se contradicen entre sí.`);
    }
    for (const e of elems) {
      const cuantos = productos.filter((q) => e.includes(q)).length;
      if (cuantos > 1) fail('PTSA-R77', `La fila «${e}» agrupa ${cuantos} productos. Cada uno necesita su propia fila: agrupados, sus veredictos son indistinguibles.`);
    }
    if (faltantes.length) {
      fail('PTSA-R76', `El universo no incluye ${faltantes.length} producto(s) que sí existen en Products/: ${faltantes.join(', ')}. Un universo que se declara a sí mismo no mide nada.`);
    } else if (productos.length) ok('PTSA-R76', `Universo cubre los ${productos.length} producto(s) de Products/.`);
    // Las fuentes mecanicas de inventario, si Foundation esta instalada
    const invDir = join(ROOT, 'docs', 'enterprise-documentation', 'inventory');
    if (existsSync(invDir)) {
      const inv = readdirSync(invDir).filter((f) => f.endsWith('.md'));
      const citada = inv.filter((f) => cov.includes(f));
      if (!citada.length && inv.length) {
        fail('PTSA-R76', `COVERAGE.md no cita ninguna de las ${inv.length} fuentes de inventory/. El universo debe enumerarse desde fuentes mecánicas, no desde lo que el auditor recuerde.`);
      } else if (citada.length) ok('PTSA-R76', `Universo trazado a ${citada.length} fuente(s) de inventory/.`);
    }
    // PTSA-R77 · toda celda FAIL imputa su hallazgo, y ese hallazgo existe
    const hallazgos = existsSync(findDirPre) ? readdirSync(findDirPre).map((f) => (f.match(/^H-\d+/) ?? [''])[0]) : [];
    for (const f of filas) {
      f.celdas.forEach((c, i) => {
        if (!c.includes('FAIL')) return;
        const h = c.match(/H-\d+/)?.[0];
        if (!h) fail('PTSA-R77', `${f.elem} · ${DIMS[i]}: celda FAIL sin hallazgo imputado. Un FAIL sin H-NNN no se puede corregir ni cerrar.`);
        else if (hallazgos.length && !hallazgos.includes(h)) fail('PTSA-R77', `${f.elem} · ${DIMS[i]}: imputa ${h}, que no existe en Findings/.`);
      });
    }

    // PTSA-R78 · el coverage publicado debe salir de la matriz
    // NO_APLICA sale del universo (no es evaluable ni pendiente): cuenta en el denominador
    // daba un coverage que jamas llegaba a 1.00 y un aviso R79 permanente, es decir ruido.
    // NO_APLICA sale del universo: contarlo en el denominador daba un coverage que
    // jamas llegaba a 1.00 y un aviso R79 permanente, es decir ruido.
    const universo = total - fuera;
    const real = universo ? evaluadas / universo : 0;
    const decl = Number(cov.match(/coverage\s*=\s*([\d.]+)/i)?.[1] ?? NaN);
    if (Number.isNaN(decl)) {
      fail('PTSA-R78', 'COVERAGE.md no publica «coverage = M/N».');
    } else {
      const pub = decl > 1 ? decl / 100 : decl;
      // Margen de REDONDEO, no de holgura: 0.02 permitia declarar dos puntos de mas.
      if (Math.abs(pub - real) > 0.005) {
        fail('PTSA-R78', `coverage publicado ${pub.toFixed(2)} vs el que se deduce de la matriz ${real.toFixed(2)}.`);
      } else ok('PTSA-R78', `coverage ${real.toFixed(2)} coherente con la matriz.`);
    }
    // Antes se buscaba el literal «NO_EVALUADA - motivo», que la plantilla escribe entre
    // comillas invertidas: indexOf devolvia -1, el corte se quedaba en el ultimo caracter y
    // TODA celda correctamente justificada se rechazaba. Ahora la seccion se localiza por su
    // encabezado, sea cual sea su redaccion exacta.
    // Se corta en el encabezado SIGUIENTE: partir desde el propio encabezado devolvia cadena
    // vacia —el split casaba en la posicion 0— y volvia a rechazar toda celda justificada.
    const seccion = (re) => {
      const k = cov.search(re);
      if (k < 0) return '';
      const resto = cov.slice(k);
      const salto = resto.indexOf('\n');
      return salto < 0 ? resto : resto.slice(salto).split(RE_ENCABEZADO)[0];
    };
    const motivos = seccion(RE_SEC_NO_EVALUADA);
    const justif = seccion(RE_SEC_NO_APLICA);
    for (const f of filas) {
      const clave = f.elem.replace(/`|\*/g, '').trim();
      if (f.celdas.some((c) => c.includes('NO_EVALUADA')) && !motivos.includes(clave)) {
        fail('PTSA-R78', `${f.elem}: tiene celdas NO_EVALUADA y no aparece en la sección de motivos. Sin motivo, «no evaluada» es «no me acordé».`);
      }
      if (f.celdas.some((c) => c.includes('NO_APLICA')) && !justif.includes(clave)) {
        fail('PTSA-R78', `${f.elem}: marca NO_APLICA sin justificación. NO_APLICA sale del universo, así que sin justificar infla el coverage.`);
      }
    }
    if (real < 1) {
      warn('PTSA-R79', `Matriz incompleta: ${evaluadas}/${universo} evaluadas (${(real * 100).toFixed(0)} %). La auditoría cierra cuando la matriz está completa, no cuando dejan de aparecer hallazgos.`);
    }
  }
}

// ── PTSA-R44 · hallazgos BUG/DOMAIN no se cierran sin humano ────────────────
const findDir = findDirPre;
if (existsSync(findDir)) {
  for (const f of readdirSync(findDir).filter((x) => /^H-\d+.*\.md$/.test(x))) {
    const txt = rd(join(findDir, f)) ?? '';
    const tipo = txt.match(/^\s*tipo:\s*(\w+)/im)?.[1];
    const est = txt.match(/^\s*estado:\s*(\w+)/im)?.[1];
    if (['BUG', 'DOMAIN'].includes(tipo) && est === 'CLOSED' && !/validad[oa]\s+por:\s*\S/i.test(txt)) {
      fail('PTSA-R44', `${f}: hallazgo ${tipo} en CLOSED sin «validado por:». Solo un humano puede cerrarlo.`);
    }
  }
}

// ── PTSA-R21 · el score se publica con cobertura y frescura ─────────────────
if (resumen) {
  if (!/coverage/i.test(resumen)) fail('PTSA-R21', 'RESUMEN.md publica score sin cobertura declarada. Un score sin cobertura es nulo.');
  if (!/freshness|frescura/i.test(resumen)) fail('PTSA-R21', 'RESUMEN.md no declara freshness.');
  if (!errors.some((e) => e.r === 'PTSA-R21')) ok('PTSA-R21', 'Score publicado con cobertura y frescura.');
}

// ── Informe ────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
console.log('verify-ptsa — auditoría por enumeración (PTSA-R76..R80)\n');
for (const [t, arr, mark] of [['PASA', passed, '✓'], ['AVISOS', warnings, '!'], ['ERRORES', errors, '✗']]) {
  if (!arr.length) continue;
  console.log(t);
  for (const x of arr) console.log(`  ${mark} ${pad(x.r, 12)} ${x.m}`);
  console.log('');
}
console.log(errors.length ? `${errors.length} error(es). La auditoría no se certifica.` : 'Auditoría verificable: sin errores.');
process.exit(errors.length ? 1 : 0);
