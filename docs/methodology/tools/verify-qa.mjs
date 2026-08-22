#!/usr/bin/env node
/**
 * verify-qa — Verificación mecánica de un ciclo QA y de un roadmap FPGE.
 *
 * POR QUÉ EXISTE
 *   La auditoría adversaria de la 5.2.0 midió la cobertura mecánica regla a regla y encontró
 *   dos componentes enteros en cero: QA 0/19 y FPGE 0/10. Todo lo que ambos prometen —«sin
 *   captura el paso no fue ejecutado», «todo FAIL genera un QD», «FPGE es read-only sobre
 *   artefactos ajenos»— dependía de que el agente se lo aplicara a sí mismo. Una regla que
 *   solo se cumple por buena voluntad no es una regla: es una recomendación.
 *
 * QUÉ COMPRUEBA
 *   QA-R03/R06/R07  captura por caso · todo FAIL con su QD · todo QD con captura
 *   QA-R04          veredictos cerrados: solo PASS o FAIL
 *   QA-R09          un HP en FAIL fuerza la clasificación QA-F
 *   QA-R11          ningún QD cerrado sin decisión humana
 *   QA-R13          QR-NNN sale de REGISTRY, no de la longitud del historial
 *   QA-R16          waitForTimeout prohibido en los specs
 *   QA-R19          todo caso cita el AC-nn que verifica
 *   FPGE-R01        todo candidato cita su evidencia de origen
 *   FPGE-R03        FPGE no escribe fuera de ROADMAP.md y ROADMAP_HISTORY.log
 *   FPGE-R05/R08    freshness de PTSA y de QA declarada en el encabezado del roadmap
 *   FPGE-R07        con QA-F vigente, todo candidato FEATURE queda BLOCKED
 *
 * Uso:  node verify-qa.mjs [ruta-proyecto]
 * Exit: 0 sin errores · 1 con errores · 2 no hay ciclo QA ni roadmap que verificar
 *
 * CRLF: todo parseo por lineas usa split(/\r?\n/). En JS, «.» NO casa \r —es terminador de
 * linea—, de modo que un regex anclado en $ sin flag m falla en archivos de Windows.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.argv[2] ?? process.cwd());

// PT-100 · TD-04 · el espacio de QA se BUSCA, no se supone.
//
// Aqui habia DOS grafias en LINEAS CONSECUTIVAS —join(ROOT,'QA') y join(ROOT,'qa','tests')—.
// Nadie eligio mal: nadie eligio. En Windows no se nota porque el sistema de archivos no
// distingue mayusculas, y por eso se escribio y se probo donde no se ve. En Linux son
// directorios DISTINTOS, y la calculadora midio la consecuencia: el verificador no encontraba
// su objeto y salia con «nada que verificar» — el ciclo entero sin verificar, EN VERDE.
//
// Se busca en las dos y se DICE cual se encontro. No se renombra el arbol de nadie (OUT del
// intake): la herramienta se adapta al proyecto, no al reves.
const GRAFIAS_QA = ['QA', 'qa'];
const dirQA = GRAFIAS_QA.map((g) => join(ROOT, g)).find((d) => existsSync(d)) ?? join(ROOT, 'QA');
const QA = dirQA;
const GRAFIA_USADA = GRAFIAS_QA.find((g) => join(ROOT, g) === dirQA) ?? 'QA';
const SPECS = join(dirQA, 'tests');
const IMPL = join(ROOT, 'docs', 'implementation');

const errors = [];
const warnings = [];
const passed = [];
const fail = (r, m) => errors.push({ r, m });
const warn = (r, m) => warnings.push({ r, m });
const ok = (r, m) => passed.push({ r, m });
const rd = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const lineas = (t) => t.split(/\r?\n/);

// Regex LITERALES, nunca construidos con new RegExp: montar patrones desde strings ha fallado
// muchas veces — la cuenta vive en patrones.mjs · ROTURAS_DE_ESCAPADO (PT-101).
// El motivo: \b se convierte en 0x08 y \s en «s» segun la capa de escapado.
const RE_VEREDICTO_G = /^\s*(?:resultado|veredicto|status)\s*:\s*(.+)$/gim;
// PT-100 · INC-012 · LEX-R28 · UN vocabulario para el tipo de un caso QA.
//
// Aqui habia otro conjunto, distinto del que dicen los TRES documentos —QA-Prompts:583,
// PHASES:595 y el CORE que se genera de el—. Un QA-PLAN escrito siguiendo la documentacion
// FALLABA la verificacion, y uno escrito para pasarla contradecia la documentacion.
//
// La causa: LEXICON no lo declaraba, asi que no habia a quien preguntar. Ahora si (LEX-R28).
//
// El conjunto ANTERIOR no se escribe en este comentario a proposito: el caso de bateria que
// comprueba que ya no esta hace «grep» sobre el archivo entero, y un comentario que lo nombre
// lo encuentra igual. Es el patron que el HANDOFF advierte para las emisiones, aqui aplicado
// a un vocabulario.
const RE_TIPO_CASO = /^\s*tipo\s*:\s*(HP|EC|EF|REG)\b/im;
const RE_AC = /\bAC-\d+\b/;
// Una REFERENCIA a un archivo de imagen, no la palabra «captura»: el patron anterior daba por
// buena la frase «no se pudo tomar captura», es decir certificaba justo lo contrario de lo que
// QA-R03 exige. Se capturan ademas la ruta para comprobar que el archivo existe de verdad.
const RE_IMAGEN = /!\[[^\]]*\]\(([^)]+)\)|(?:^|[\s("'`])([\w./-]+\.(?:png|jpe?g|webp|gif))/gim;
const RE_QD = /\bQD-\d+\b/g;
const RE_HUMANO = /(?:validad[oa]|cerrad[oa]|aprobad[oa]|decidid[oa])\s+por:\s*(\S+)/i;
const RE_ESTADO = /^\s*estado\s*:\s*(\w+)/im;
const RE_ESPERA_FIJA = /waitForTimeout|sleep\s*\(\s*\d{3,}/;
const RE_EVIDENCIA = /\b(?:H-\d+|QD-\d+|PT-\d+|INC-\d+)\b/;

// QA/ puede ser la carpeta de la especificacion y no un espacio de trabajo: un ciclo
// arranca al escribir QA-PLAN.md o el primer caso. Distinguirlo evita un veredicto
// enganoso al correr la herramienta sobre la suite misma.
// Devuelve las rutas de imagen referenciadas, y cuantas de ellas existen en disco. Una
// referencia a un archivo que no esta ahi es una captura que nadie puede mirar.
function capturas(txt, base) {
  const rutas = [];
  for (const m of txt.matchAll(RE_IMAGEN)) {
    const r = (m[1] ?? m[2] ?? '').trim();
    if (r && !/^https?:/i.test(r)) rutas.push(r);
  }
  const existen = rutas.filter((r) => existsSync(join(base, r)) || existsSync(join(ROOT, r)));
  return { rutas, existen };
}

const hayQA = existsSync(QA) && (existsSync(join(QA, 'cases')) || existsSync(join(QA, 'QA-PLAN.md')));
const roadmap = rd(join(IMPL, 'ROADMAP.md'));
if (!hayQA && roadmap === null) {
  // PT-100 · se DICE donde se busco. «Nada que verificar» era correcto para un proyecto sin QA
  // e INDISTINGUIBLE de uno que si lo tiene y escribio la otra grafia: una salida escrita para
  // un caso legitimo cubriendo uno que no lo es (la forma de PT-096).
  console.log(`No hay espacio de QA —se busco ${GRAFIAS_QA.map((g) => g + '/').join(' y ')}— `
    + 'ni docs/implementation/ROADMAP.md: nada que verificar.');
  process.exit(2);
}

// ── QA ──────────────────────────────────────────────────────────────────────
if (hayQA) {
  const casesDir = join(QA, 'cases');
  const casos = existsSync(casesDir)
    ? readdirSync(casesDir).filter((f) => /^QA-\d+.*\.md$/.test(f))
    : [];
  const defects = rd(join(QA, 'QA-DEFECTS.md')) ?? '';
  const qdDeclarados = new Set(defects.match(RE_QD) ?? []);

  let hpFail = false;
  let conCaptura = 0;
  for (const f of casos) {
    const txt = rd(join(casesDir, f)) ?? '';
    const id = f.match(/^QA-\d+/)[0];
    const todos = [...txt.matchAll(RE_VEREDICTO_G)].map((m) => m[1].trim().toUpperCase());
    const ver = todos[0];
    if (todos.length > 1 && new Set(todos).size > 1) {
      fail('QA-R04', `${id}: declara ${todos.length} resultados distintos (${[...new Set(todos)].join(', ')}). Se tomaría el primero, que puede ser el de un ejemplo y no el del caso.`);
    }

    // QA-R04 · veredictos cerrados
    if (!ver) {
      fail('QA-R04', `${id}: no declara resultado. Solo existen PASS y FAIL; la ausencia no es «pendiente», es un caso sin ejecutar dentro de un ciclo que se da por hecho.`);
    } else if (!['PASS', 'FAIL'].includes(ver)) {
      fail('QA-R04', `${id}: resultado «${ver}». Solo PASS o FAIL — no existe «parcialmente correcto», y la ambigüedad es FAIL.`);
    }

    // QA-R19 · trazabilidad al criterio de aceptación
    if (!RE_AC.test(txt)) {
      fail('QA-R19', `${id}: no cita ningún AC-nn. Un caso sin trazabilidad al criterio que verifica es una exploración, no un caso certificable.`);
    }

    // QA-R03 · evidencia es captura
    const cap = capturas(txt, casesDir);
    if (!cap.rutas.length) {
      fail('QA-R03', `${id}: no referencia ningún archivo de imagen. Sin captura, el paso no fue ejecutado.`);
    } else if (!cap.existen.length) {
      fail('QA-R03', `${id}: referencia ${cap.rutas.length} captura(s) y ninguna existe en disco (${cap.rutas.slice(0, 3).join(', ')}). Una captura que nadie puede abrir no es evidencia.`);
    } else conCaptura++;

    if (ver === 'FAIL') {
      // QA-R06 · todo FAIL genera su QD
      const qds = txt.match(RE_QD) ?? [];
      if (!qds.length) {
        fail('QA-R06', `${id}: resultado FAIL sin ningún QD-NNN. Sin QD el fallo no existe como hallazgo, e invalida el reporte entero.`);
      } else if (!qdDeclarados.size) {
        // Sin libro de defectos la comprobacion se saltaba entera y CUALQUIER numero pasaba.
        fail('QA-R06', `${id}: imputa ${qds.join(', ')} y no existe QA/QA-DEFECTS.md. Un QD que no está en ningún registro no se puede seguir ni cerrar.`);
      } else {
        for (const qd of qds) {
          if (!qdDeclarados.has(qd)) fail('QA-R06', `${id}: imputa ${qd}, que no figura en QA-DEFECTS.md.`);
        }
      }
      // QA-R09 · un HP en FAIL fuerza QA-F
      if (RE_TIPO_CASO.exec(txt)?.[1] === 'HP') hpFail = true;
    // PT-100 · LEX-R28 · el tipo de un caso sale del vocabulario que LEXICON declara. Sin esta
    // emision la regla no la hacia cumplir nadie: la regex filtraba en silencio, asi que un
    // «tipo» invalido no fallaba — simplemente no se contaba como HP y el caso pasaba.
    const declaraTipo = /^\s*tipo\s*:\s*(\S+)/im.exec(txt);
    if (declaraTipo && !RE_TIPO_CASO.test(txt)) {
      fail('LEX-R28', `${id}: declara «tipo: ${declaraTipo[1]}», que no es uno de HP · EC · EF · REG. `
        + 'El vocabulario lo declara LEXICON §8.1b y lo citan QA-Prompts y PHASES: un tipo fuera de esa lista '
        + 'no se puede clasificar, y hasta ahora se ignoraba en silencio.');
    }
    }
  }
  if (casos.length && conCaptura === casos.length) ok('QA-R03', `${casos.length} caso(s), todos con captura.`);
  if (!casos.length) warn('QA-R03', 'QA/cases/ no contiene ningún QA-NNN.md: no hay ciclo que verificar.');

  // QA-R09 · la clasificación publicada respeta el caso HP en fallo
  const log = rd(join(QA, 'QA-LOG.md')) ?? '';
  const plan = rd(join(QA, 'QA-PLAN.md')) ?? '';
  const clasif = (log + plan).match(/\bQA-([ABCF])\b/)?.[1];
  if (hpFail && clasif && clasif !== 'F') {
    fail('QA-R09', `Un caso HP resultó FAIL y la clasificación publicada es QA-${clasif}. Un HP en fallo es QA-F con independencia del porcentaje global.`);
  } else if (hpFail) ok('QA-R09', 'HP en fallo correctamente clasificado como QA-F.');

  // QA-R07 y QA-R11 · defectos
  const defDir = join(QA, 'defects');
  const ficheros = existsSync(defDir)
    ? readdirSync(defDir).filter((f) => /^QD-\d+.*\.md$/.test(f)).map((f) => [f, rd(join(defDir, f)) ?? ''])
    : [...defects.matchAll(/^#{1,3}\s*(QD-\d+)([\s\S]*?)(?=^#{1,3}\s*QD-|\Z)/gm)].map((m) => [m[1], m[2]]);
  for (const [id, txt] of ficheros) {
    const capQD = capturas(txt, defDir);
    if (!capQD.rutas.length) {
      fail('QA-R07', `${id}: no referencia ningún archivo de imagen. Sin captura del paso fallido el QD es inválido.`);
    } else if (!capQD.existen.length) {
      fail('QA-R07', `${id}: referencia captura(s) que no existen en disco (${capQD.rutas.slice(0, 3).join(', ')}).`);
    }
    const est = txt.match(RE_ESTADO)?.[1]?.toUpperCase();
    if ((est === 'CLOSED' || est === 'CERRADO' || est === 'PROMOTED') && !RE_HUMANO.test(txt)) {
      fail('QA-R11', `${id}: en ${est} sin «cerrado por: <persona>». El agente no cierra ni promueve un QD sin decisión humana.`);
    }
  }
  if (ficheros.length && !errors.some((e) => e.r === 'QA-R07' || e.r === 'QA-R11')) {
    ok('QA-R11', `${ficheros.length} defecto(s) con captura y cierre trazado.`);
  }

  // QA-R13 · el ciclo QR-NNN sale del REGISTRY, no del historial
  const reg = (() => { try { return JSON.parse(rd(join(IMPL, 'REGISTRY.json')) ?? 'null'); } catch { return null; } })();
  const hist = (() => { try { return JSON.parse(rd(join(QA, 'qa-score-history.json')) ?? '[]'); } catch { return []; } })();
  const repDir = join(QA, 'reports');
  const ciclos = existsSync(repDir) ? readdirSync(repDir).filter((d) => /^QR-\d+$/.test(d)) : [];
  const maxQR = ciclos.reduce((n, d) => Math.max(n, Number(d.slice(3))), 0);
  if (maxQR && reg && typeof reg.counters?.QR === 'number' && reg.counters.QR < maxQR) {
    fail('QA-R13', `counters.QR = ${reg.counters.QR} pero ya existe QR-${String(maxQR).padStart(3, '0')}. El próximo ciclo reutilizaría un identificador vivo.`);
  } else if (maxQR) ok('QA-R13', `QR-NNN coherente con REGISTRY (máximo ${maxQR}).`);
  if (Array.isArray(hist) && maxQR && hist.length !== maxQR) {
    warn('QA-R13', `qa-score-history.json tiene ${hist.length} entrada(s) y hay ${maxQR} ciclo(s): normal si hubo ciclos delta, sospechoso si alguien derivó el número de la longitud.`);
  }

  // QA-R16 · sin esperas fijas en los specs
  if (existsSync(SPECS)) {
    let sucios = 0;
    for (const f of readdirSync(SPECS).filter((x) => /\.spec\.(t|j)s$/.test(x))) {
      const txt = rd(join(SPECS, f)) ?? '';
      lineas(txt).forEach((l, i) => {
        if (RE_ESPERA_FIJA.test(l)) {
          sucios++;
          fail('QA-R16', `qa/tests/${f}:${i + 1}: espera fija. Se espera una condición observable, no un reloj — una espera fija es un test que falla en la máquina lenta de otro.`);
        }
      });
    }
    if (!sucios) ok('QA-R16', 'Ningún spec usa esperas fijas.');
  }
}

// ── FPGE ────────────────────────────────────────────────────────────────────
if (roadmap !== null) {
  // FPGE-R01 · todo candidato cita su evidencia
  //
  // PT-109 · INC-015 · una MENCION no es una DECLARACION. Esto casaba CUALQUIER linea que
  // nombrara un «R-NNN», asi que una frase en prosa —«como se decidio en R-007»— contaba como
  // candidato del roadmap y se le exigia evidencia de origen que no tiene por que llevar. Es la
  // misma forma que LEX-R28 tenia en este mismo archivo: un patron que reconoce el NOMBRE en vez
  // del SITIO donde el nombre significa algo.
  //
  // Un candidato se declara en una FILA de tabla, que es como el roadmap los escribe: la linea
  // empieza por «|» y el identificador va en su primera celda. Una cita en prosa no lo es, y
  // exigirle evidencia convierte el verificador en ruido — que es como se deja de mirar.
  const items = [...roadmap.matchAll(/^\s*\|\s*`?(R-\d+)`?\s*\|.*$/gm)].map((m) => [m[1], m[0]]);
  let sinEvidencia = 0;
  for (const [id, linea] of items) {
    if (!RE_EVIDENCIA.test(linea.replace(id, ''))) {
      sinEvidencia++;
      fail('FPGE-R01', `${id}: no cita evidencia de origen (H-NNN, QD-NNN, PT-NNN o INC-NNN). Un candidato sin evidencia es una opinión con número.`);
    }
  }
  if (items.length && !sinEvidencia) ok('FPGE-R01', `${items.length} candidato(s), todos con evidencia de origen.`);

  // FPGE-R05 y R08 · frescura declarada
  if (!/freshness|frescura/i.test(roadmap)) {
    fail('FPGE-R05', 'ROADMAP.md no declara la frescura de PTSA. Priorizar sobre un score STALE sin decirlo convierte una decisión caduca en una decisión nueva.');
  } else ok('FPGE-R05', 'Frescura declarada en el roadmap.');
  if (/QA[-_ ]?STALE/i.test(roadmap) && !/0\.7|confidence/i.test(roadmap)) {
    fail('FPGE-R08', 'ROADMAP.md menciona QA-STALE y no declara el factor Confidence 0.7 aplicado a los candidatos cuya única evidencia es QA.');
  }

  // FPGE-R07 · bloqueo por QA-F
  const qaF = /\bQA-F\b/.test((rd(join(QA, 'QA-LOG.md')) ?? '') + roadmap);
  if (qaF) {
    const features = items.filter(([, l]) => /\bFEATURE\b/i.test(l));
    const libres = features.filter(([, l]) => !/\bBLOCKED\b/i.test(l));
    if (libres.length) {
      fail('FPGE-R07', `Hay una clasificación QA-F vigente y ${libres.length} candidato(s) FEATURE sin BLOCKED: ${libres.map(([i]) => i).join(', ')}. Con QA-F no se construye encima.`);
    } else if (features.length) ok('FPGE-R07', `QA-F vigente y ${features.length} FEATURE correctamente bloqueadas.`);
  }

  // FPGE-R03 · read-only sobre artefactos ajenos
  // Se detecta el rastro: una firma de FPGE dentro de un artefacto que no le pertenece.
  const ajenos = [
    ['QA/QA-DEFECTS.md', rd(join(QA, 'QA-DEFECTS.md'))],
    ['PTSA/RESUMEN.md', rd(join(ROOT, 'PTSA', 'RESUMEN.md'))],
    ['PTSA/PENDIENTES.md', rd(join(ROOT, 'PTSA', 'PENDIENTES.md'))],
  ];
  let invadidos = 0;
  for (const [nombre, txt] of ajenos) {
    if (txt === null) continue;
    if (/\bFPGE\b[^\n]{0,60}(?:escrib|actualiz|marc[óo]|prioriz)/i.test(txt) || /\bR-\d+\b/.test(txt)) {
      invadidos++;
      warn('FPGE-R03', `${nombre} contiene rastro de FPGE (una referencia R-NNN o una escritura declarada). FPGE escribe únicamente ROADMAP.md y ROADMAP_HISTORY.log; el rechazo de un ítem se anota en su propio roadmap, no en el artefacto ajeno.`);
    }
  }
  if (!invadidos) ok('FPGE-R03', 'Ningún artefacto ajeno lleva rastro de escritura de FPGE.');

  // FPGE-R02 · la reproducibilidad exige que el orden sea función de la evidencia
  if (!/prioridad|score|puntaj/i.test(roadmap)) {
    warn('FPGE-R02', 'ROADMAP.md no publica el valor de prioridad de cada ítem. Sin él, dos corridas no se pueden comparar y la reproducibilidad no es verificable.');
  }
}

// ── Informe ────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
console.log('verify-qa — cumplimiento mecánico de QA y FPGE\n');
for (const [t, arr, mark] of [['PASA', passed, '✓'], ['AVISOS', warnings, '!'], ['ERRORES', errors, '✗']]) {
  if (!arr.length) continue;
  console.log(t);
  for (const x of arr) console.log(`  ${mark} ${pad(x.r, 12)} ${x.m}`);
  console.log('');
}
console.log(errors.length ? `${errors.length} error(es).` : 'Sin errores.');
process.exit(errors.length ? 1 : 0);
