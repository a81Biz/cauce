#!/usr/bin/env node
/**
 * eventos.mjs — PT-125 · clasifica las entradas cerradas contra las clases de evento.
 *
 * Lo pidio el firmante: «quiero que releas las tareas ya cerradas y realices una matriz de
 * eventos, quiero saber que ocurrio, que se mejoro, QUE SE REPITE».
 *
 * ESCRIBE  docs/implementation/EVENTOS.jsonl — un registro por evento Y por entrada RECORRIDA.
 * LEE      HISTORY.log · INCIDENTS.log · LEXICON §4.4 (las clases)
 *
 * LO QUE AQUI SE AUTOMATIZA ES EL MATERIAL, NO EL JUICIO.
 *
 * La clase es un juicio (LEX-R31 la define como tal) y por eso TODO registro sale marcado
 * `DECLARADO`. Lo que la herramienta deriva son dos cosas comprobables: la frase con que el
 * propio ledger NOMBRA su patron, y la cita LITERAL donde aparece. Quien decide si esa frase
 * describe una instancia o solo la menciona es una persona, y su decision vive en MENCIONES,
 * escrita para que se pueda contradecir.
 *
 * POR QUE NO SE CLASIFICA CON UN MATCHER AMPLIO. La primera version buscaba «a mano» y «diverg»:
 * dio 43 «actos fuera del comando» y 41 «un hecho, varios nombres» en 159 entradas. Cifras que no
 * pueden ser ciertas. Contar la palabra en lugar del hecho es CE-001, cometido dentro de la
 * herramienta que existe para contar instancias de CE-001.
 *
 * POR QUE HAY UN REGISTRO POR ENTRADA RECORRIDA. Sin el, «160 recorridas» seria una afirmacion
 * sin forma de comprobarla — el defecto que PT-128 tuvo al CONTAR las tareas de un lote en vez de
 * enumerarlas (PTSA-R79).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = process.argv.find((a) => a.startsWith('--raiz='))?.slice(7)
  ?? join(AQUI, '..', '..', '..');
const IMPL = join(RAIZ, 'docs', 'implementation');
const SUITE = join(RAIZ, 'docs', 'methodology');

/** Las senias son frases AUTODESCRIPTIVAS: las que el ledger usa para nombrar su propio patron. */
export const SENIAS = {
  'CE-001': ['proxy en lugar del hecho', 'patron del proxy', 'el proxy en vez del hecho'],
  'CE-002': ['rotura de escapad', 'se rompi[oó] el escapad', 'SUITE-R59', 'barra invertida'],
  'CE-003': ['se toma por la ra[ií]z', 'detecci[oó]n de .?ROOT', 'confunde con el ROOT',
             'tom[oó] por el ROOT'],
  'CE-004': ['probar donde trabajo', 'no donde se decide', 'verdes en local y roj'],
  'CE-005': ['verde por vac[ií]o', 'verde por no haber mirado', 'falso verde',
             'no lleg[oó] a ejecutarse', 'pasaba por el motivo equivocado'],
  'CE-006': ['fuera del comando', 'sin pasar por el comando', 'lo escrib[ií] a mano',
             'escrito a mano y no por el comando', 'el registro solo lo escribe el comando'],
  'CE-007': ['nada la echa en falta', 'nadie la invoca', 'exist[ií]a y no se us',
             'nunca se ejecut[oó]'],
  'CE-008': ['un hecho, un nombre', 'un hecho, varios nombres', 'declarad[oa] dos veces y distint',
             'no se define dos veces', 'la misma obligaci[oó]n copiada', 'una regla no se define dos'],
  'CE-009': ['estado terminal escrito a mano', 'estado terminal .{0,24}adelantad',
             'se escribe al avanzar'],
  'CE-010': ['cifra transcrita', 'se derivan, no se transcriben', 'cifras transcritas'],
  'CE-011': ['tras un .?return', 'tests? del estado anterior', 'del estado anterior'],
  'CE-012': ['filtrar antes de mirar', 'filtrar la salida antes'],
  'CE-013': ['encabezado mal formado', 'CORRIGE: el encabezado'],
  'CE-014': ['juzga hacia atr[aá]s', 'juzgar hacia atr[aá]s', 'retrofech', 'rige hacia atr[aá]s'],
  'CE-015': ['el cierre destap', 'encontrada SELLANDO', 'apareci[oó] escribiendo este intake'],
  'CE-016': ['sin allocation', 'saltarme el marco', 'por fuera del marco', 'saltarse el marco',
             'salt[oó] el marco', 'sin intake, sin PT'],
  'CE-017': ['acusa a quien', 'describe el hecho que vigila'],
};

/**
 * MENCION vs INSTANCIA — el juicio que la maquina NO puede hacer.
 *
 * Que una entrada NOMBRE una clase no la convierte en instancia. `PT-127` dice literalmente «NO
 * es el acto fuera del comando»; `PT-112` dice «PRIMERA APLICACION ESPONTANEA de SUITE-R59», que
 * es cumplimiento y no rotura; `EP-012` dice «en vez de retrofechadas», que es la clase EVITADA.
 *
 * NO SE BORRAN, SE MARCAN. Un registro borrado no se puede contradecir; uno marcado dice quien
 * decidio y por que. Es la misma razon por la que HISTORY.log es append-only.
 *
 * La clave lleva un fragmento de la cita porque una misma tarea puede tener VARIAS entradas
 * —EP-019 tiene tres— y sin el se marcaban las dos de CE-002 cuando una si es instancia.
 */
export const MENCIONES = [
  ['EP-012', 'CE-014', null, 'dice «en vez de retrofechadas»: la clase EVITADA, no ocurrida'],
  ['PT-047', 'CE-014', null, 'enuncia el criterio de no retrofechar como decision de diseño'],
  ['PT-016', 'CE-014', null, 'enuncia la frontera de lo ya terminado, no un incumplimiento'],
  ['EP-018', 'CE-010', null, 'la frase cae en la TABLA de tareas, citando el titulo de PT-091'],
  ['PT-098', 'CE-005', null, 'aforismo sobre el falso verde, no una instancia de esta entrada'],
  ['PT-099', 'CE-014', null, 'justifica por que hace falta la fila, no relata un retrofechado'],
  ['PT-105', 'CE-014', null, 'declara que NO se retrofecha: cumplimiento'],
  ['PT-112', 'CE-002', null, 'primera aplicacion espontanea de SUITE-R59: cumplimiento, no rotura'],
  ['EP-019', 'CE-002', 'PTSA-R81', 'la cita es una LISTA de IDs de regla donde figura SUITE-R59'],
  ['PT-129', 'CE-016', null, 'señala donde PODRIA esconderse, no un caso ocurrido'],
  ['PT-116', 'CE-002', null, '«el texto entra por archivo»: cumplimiento de SUITE-R59'],
  ['PT-113', 'CE-002', null, 'lo que falta es la GUIA que nombre la regla, no una rotura'],
  ['PT-127', 'CE-006', null, 'dice explicitamente «NO es el acto fuera del comando»'],
  ['PT-118', 'CE-016', null, 'declara lo que NO hizo para no incurrir en la clase'],
];

const CAR_SALTO = String.fromCharCode(10);
const B = String.fromCharCode(92) + 'b';   // SUITE-R59: el limite se COMPONE, no se escribe
const D = String.fromCharCode(92) + 'd';
const S = String.fromCharCode(92) + 's';

const RE = Object.fromEntries(
  Object.entries(SENIAS).map(([k, v]) => [k, new RegExp(v.join('|'), 'i')]));

const RE_RECURRE = new RegExp([
  B + '(?:otra|tercera|cuarta|quinta|sexta|septima|octava|novena|decima)' + S + '+vez' + B,
  B + '(?:dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)' + S + '+veces' + B,
  B + 'se' + S + '+repit', B + 'la' + S + '+instancia' + B, B + 'instancia' + S + '+',
  B + 'vuelve' + S + '+a' + B, B + 'mismo' + S + '+(?:defecto|patron|error|fallo)' + B,
  B + 'misma' + S + '+(?:averia|causa|forma)' + B,
].join('|'), 'i');

const ORDINALES = { primera: 1, segunda: 2, tercera: 3, cuarta: 4, quinta: 5, sexta: 6,
  septima: 7, 'séptima': 7, octava: 8, novena: 9, decima: 10, 'décima': 10, once: 11,
  doce: 12, trece: 13, catorce: 14, quince: 15 };
const CARDINALES = { dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8,
  nueve: 9, diez: 10, once: 11, doce: 12, diecinueve: 19, veintisiete: 27 };

/**
 * El numero que la PROPIA entrada declara EN LA LINEA de su señal: «SEPTIMA ROTURA»,
 * «instancia doce», «tres veces». Recibe el texto ORIGINAL, no la cita: fraseDe aplana los
 * saltos de linea y sobre una cita aplanada «la misma linea» seria todo el texto.
 *
 * Se DERIVA de la cita; no se cuenta. Contar entradas y contar ocurrencias son denominadores
 * distintos —EP-020 §2.1 midio 27 roturas de escapado y aqui hay 6 ENTRADAS que las nombran— y
 * mezclarlos daria una matriz que dice una cosa y significa otra.
 */
export function ordinalDe(cita, senial) {
  if (!cita) return null;   // `cita` = texto donde buscar; con `senial`, debe ser el original
  // EL ORDINAL TIENE QUE ESTAR EN LA MISMA LINEA QUE SU SEÑAL.
  //
  // Sin esto, una entrada que lleva una TABLA —como la de PT-125, que lista cada clase con su
  // recuento— hace que «instancia doce», escrito en la fila de CE-001, se le atribuya tambien a
  // CE-003, CE-004, CE-007 y CE-015: el bloque entero pasa por «frase» porque no tiene puntos.
  // Cuatro cifras plausibles y FALSAS, que es lo que RULE-06 prohibe y lo que CE-001 nombra.
  //
  // Una ventana de 140 caracteres tampoco basta: en una tabla densa alcanza la fila de arriba.
  // La LINEA es la unidad correcta —una fila es una linea, y la prosa del ledger va plegada a
  // ~98 columnas—. Un ordinal partido por el salto se PIERDE, y perderlo es seguro: devuelve
  // null, que es «no lo declara», en vez de un numero de otra clase.
  const texto = String(cita);
  let c = texto.toLowerCase();
  if (senial) {
    const m = senial.exec(texto);
    if (!m) return null;
    const ini = texto.lastIndexOf(CAR_SALTO, m.index) + 1;
    const fin = texto.indexOf(CAR_SALTO, m.index);
    c = texto.slice(ini, fin === -1 ? texto.length : fin).toLowerCase();
  }
  for (const [pal, n] of Object.entries(ORDINALES)) {
    if (new RegExp(B + pal + S + '+(?:vez|instancia|aparici|rotura|aplicaci)').test(c)) {
      return { valor: n, forma: 'ordinal', literal: pal };
    }
    if (new RegExp(B + 'instancia' + S + '+' + pal + B).test(c)) {
      return { valor: n, forma: 'ordinal', literal: `instancia ${pal}` };
    }
  }
  for (const [pal, n] of Object.entries(CARDINALES)) {
    if (new RegExp(B + pal + S + '+veces' + B).test(c)) {
      return { valor: n, forma: 'cardinal', literal: `${pal} veces` };
    }
  }
  const m = new RegExp(B + '(' + D + '+)' + S + '+veces' + B).exec(c);
  return m ? { valor: Number(m[1]), forma: 'cardinal', literal: m[0] } : null;
}

/** La frase LITERAL donde cae la señal. Parafrasearla convertiria el registro en interpretacion. */
export function fraseDe(texto, re) {
  for (const bruto of String(texto).split(/(?<=[.:])\s+/)) {
    const f = bruto.split(/\s+/).join(' ').trim();
    if (f.length >= 20 && f.length <= 400 && re.test(f)) return f;
  }
  const m = re.exec(String(texto));
  if (!m) return null;
  return String(texto).slice(Math.max(0, m.index - 90), m.index + m[0].length + 90)
    .split(/\s+/).join(' ').trim();
}

/** Clasifica UN texto de entrada. Pura: recibe el texto, devuelve los registros. */
export function clasifica(ident, fecha, texto, origen) {
  const hits = Object.keys(RE).filter((k) => RE[k].test(texto));
  if (!hits.length) {
    const recurre = RE_RECURRE.test(texto);
    return [{
      tarea: ident, fecha, clase: null,
      cita: recurre ? fraseDe(texto, RE_RECURRE) : null,
      ordinal_declarado: null, naturaleza: 'DECLARADO', origen,
      como: recurre
        ? 'afirma recurrencia pero NO nombra la forma: clasificarla exigiria reinterpretarla, '
          + 'y eso inventaria la recurrencia que la matriz cuenta (RULE-06)'
        : 'recorrida y sin afirmacion de recurrencia: describe un hecho unico',
    }];
  }
  return hits.map((k) => {
    const cita = fraseDe(texto, RE[k]);
    const men = MENCIONES.find(([t, c, frag]) =>
      t === ident && c === k && (frag === null || String(cita ?? '').includes(frag)));
    return {
      tarea: ident, fecha, clase: k,
      polaridad: men ? 'MENCION' : 'INSTANCIA',
      cita, ordinal_declarado: ordinalDe(texto, RE[k]),
      naturaleza: 'DECLARADO', origen,
      como: men ? men[3] : 'la entrada nombra su propio patron',
    };
  });
}

function entradasDe(texto, origen) {
  const out = [];
  for (const p of String(texto).split(/(?=^## )/m)) {
    const m = /^##\s+(\S+)/.exec(p);
    if (!m) continue;
    const f = /^Fecha:\s*(\S+)/m.exec(p);
    out.push({ id: m[1], fecha: f ? f[1] : null, texto: p, origen });
  }
  return out;
}

const EJECUTADO_DIRECTO = process.argv[1]
  && fileURLToPath(import.meta.url) === process.argv[1];

if (EJECUTADO_DIRECTO) {
  const leer = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
  const hist = leer(join(IMPL, 'HISTORY.log'));
  const inc = leer(join(IMPL, 'INCIDENTS.log'));

  if (hist === null) {
    // No saber no es permiso (RULE-06): no se escribe un archivo vacio que parezca «no hay nada».
    console.error('No se pudo leer HISTORY.log. No se escribe EVENTOS.jsonl: un archivo vacio '
      + 'diria «ningun evento», que no es lo mismo que «no se pudo mirar».');
    process.exit(1);
  }

  const entradas = [
    ...entradasDe(hist, 'HISTORY.log'),
    ...(inc === null ? [] : entradasDe(inc, 'INCIDENTS.log')),
  ];
  const registros = entradas.flatMap((e) => clasifica(e.id, e.fecha, e.texto, e.origen));
  if (inc === null) {
    registros.push({ tarea: null, fecha: null, clase: null, cita: null,
      ordinal_declarado: null, naturaleza: 'SIN EVALUAR', origen: 'INCIDENTS.log',
      como: 'no se pudo leer: no se sabe que contiene (RULE-06)' });
  }

  const lex = leer(join(SUITE, 'LEXICON.md')) ?? '';
  const declaradas = [...lex.matchAll(/^\|\s*`(CE-\d{3})`\s*\|/gm)].map((m) => m[1]);

  const cab = {
    _: 'EVENTOS.jsonl · PT-125 · un registro por evento Y por entrada recorrida',
    append_only: true,
    regla: 'SUITE-R09 · no se reescribe ni se reclasifica lo ya escrito',
    clases: `LEXICON §4.4 · ${declaradas.length} declaradas (LEX-R31, LEX-R32)`,
    naturaleza: 'DECLARADO en todos: la clase es un JUICIO, no una derivacion',
    polaridad: 'INSTANCIA = ocurrio · MENCION = la entrada nombra la clase sin incurrir en ella',
    denominador: 'cada registro es una ENTRADA que nombra la clase, no una OCURRENCIA. '
      + 'EP-020 §2.1 conto ocurrencias; aqui se cuentan entradas. Son denominadores distintos y '
      + 'sumarlos daria una matriz que dice una cosa y significa otra.',
    ordinal_declarado: 'el numero que la PROPIA cita declara, cuando lo declara. null si no.',
    entradas_recorridas: entradas.length,
    generador: 'docs/methodology/tools/eventos.mjs',
  };

  const P = join(IMPL, 'EVENTOS.jsonl');
  writeFileSync(P, [cab, ...registros].map((r) => JSON.stringify(r)).join('\n') + '\n', 'utf8');

  const inst = registros.filter((r) => r.clase && r.polaridad !== 'MENCION').length;
  const men = registros.filter((r) => r.polaridad === 'MENCION').length;
  const mudas = registros.filter((r) => !r.clase && r.cita).length;
  console.log(`entradas recorridas       ${entradas.length}`);
  console.log(`INSTANCIAS clasificadas   ${inst}`);
  console.log(`MENCIONES                 ${men}`);
  console.log(`afirman recurrencia y no nombran la forma   ${mudas}`);
  console.log(`registros                 ${registros.length}  →  ${P}`);
}
