#!/usr/bin/env node
/**
 * PT-033 · Divergencia entre la copia local del marco y la canónica.
 *
 *   npm run verify:marco
 *   npm run verify:marco -- C:/otra/ruta/docs/methodology
 *
 * `SUITE-R21` existe porque una copia que puede divergir es una copia que diverge. La suite
 * se instala copiando `docs/methodology/` al proyecto, así que cada proyecto tiene la suya y
 * nada avisa cuando se separan.
 *
 * Y se separan: el 2026-08-08 esta copia llevaba cuatro correcciones de `verify-fdge.mjs`
 * —`PT-028` (tres) y `PT-031` (una)— que la canónica no tenía. Una de ellas, `RE_SIGNED_BY`,
 * hacía que una Declaración de Valor SIN firmar se reportara como firmada: la regla `FND-R24`
 * que sostiene la auditoría PTSA daba verde sobre nada. Todos los demás proyectos seguían así.
 *
 * Esto no sincroniza nada. Solo dice qué difiere y en qué dirección, para que la decisión de
 * propagar sea humana y esté informada (`SUITE-R06e`).
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { opcionales } from './patrones.mjs';

// Nacio en un proyecto, apuntando a una ruta absoluta de una maquina concreta. Dentro de la
// suite eso no vale: la referencia es la version instalada, y solo se cae a una ruta local
// cuando alguien la pasa a mano. Sin referencia, el script lo dice en vez de comparar contra
// nada — que es como se producen los verdes por omision.
const LOCAL = process.env.SUITE_LOCAL ?? 'docs/methodology';
const CANONICA = process.argv[2] ?? process.env.SUITE_CANONICA ?? null;
if (!CANONICA) {
  console.error('No hay referencia con la que comparar.');
  console.error('  node tools/comparar-marco.mjs <ruta-a-la-copia-canónica>');
  console.error('  o define SUITE_CANONICA. Con la suite publicada como paquete, la referencia');
  console.error('  es la versión instalada y esto lo resuelve el propio instalador.');
  process.exit(2);
}

/** Componentes que el INSTALL manda no copiar en brownfield (`FIDE-R01`). */
// PT-145 · los componentes opcionales se DERIVAN del contrato, no se escriben.
//
// Esta era la unica de las nueve herramientas del lote sin una sola arista a patrones.mjs: tres
// imports, los tres de node:. Y tenia su propia copia del mismo hecho que verify-suite.mjs:425
// CON OTRO NOMBRE —«OPCIONALES» frente a «COMPONENTES_OPCIONALES»—, que es exactamente la forma
// en que dos nombres del mismo hecho divergen (CE-008, SUITE-R14).
const OPCIONALES = opcionales();

function archivos(base, dir = base) {
  if (!existsSync(dir)) return [];
  const fuera = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) fuera.push(...archivos(base, p));
    else fuera.push(relative(base, p).replace(/\\/g, '/'));
  }
  return fuera;
}

const huella = (p) => createHash('sha1').update(readFileSync(p)).digest('hex').slice(0, 12);

if (!existsSync(CANONICA)) {
  console.error(`No existe la copia canónica: ${CANONICA}`);
  console.error('Pásala como argumento si vive en otro sitio.');
  process.exit(2);
}

const enLocal = new Set(archivos(LOCAL));
const enCanon = new Set(archivos(CANONICA));

const soloLocal = [...enLocal].filter((f) => !enCanon.has(f)).sort();
const soloCanon = [...enCanon].filter((f) => !enLocal.has(f)).sort();
const distintos = [...enLocal]
  .filter((f) => enCanon.has(f) && huella(join(LOCAL, f)) !== huella(join(CANONICA, f)))
  .sort();

// Un componente entero ausente no es divergencia: es la instalación brownfield correcta.
const porDiseño = soloCanon.filter((f) => OPCIONALES.has(f.split('/')[0]));
const faltanDeVerdad = soloCanon.filter((f) => !OPCIONALES.has(f.split('/')[0]));

console.log(`local:    ${LOCAL} (${enLocal.size} archivos)`);
console.log(`canónica: ${CANONICA} (${enCanon.size} archivos)\n`);

if (porDiseño.length) {
  console.log(`Ausentes POR DISEÑO (${porDiseño.length}): componentes que el INSTALL no copia aquí.`);
  console.log(`  ${[...new Set(porDiseño.map((f) => f.split('/')[0] + '/'))].join(', ')}\n`);
}
if (faltanDeVerdad.length) {
  console.log(`FALTAN en la copia local (${faltanDeVerdad.length}):`);
  for (const f of faltanDeVerdad) console.log(`  ${f}`);
  console.log();
}
if (soloLocal.length) {
  console.log(`SOLO en la copia local (${soloLocal.length}) — añadidos aquí:`);
  for (const f of soloLocal) console.log(`  ${f}`);
  console.log();
}
if (distintos.length) {
  console.log(`DIFIEREN en contenido (${distintos.length}):`);
  for (const f of distintos) console.log(`  ${f}`);
  console.log(
    '\nUn archivo que difiere no dice por sí solo quién tiene razón. Si la corrección se hizo\n' +
    'aquí bajo un PT, lo que falta es propagarla; si vino de una versión más nueva de la suite,\n' +
    'lo que falta es migrar. Decidirlo es humano.',
  );
}

const divergen = faltanDeVerdad.length + soloLocal.length + distintos.length;
if (!divergen) console.log('Las dos copias coinciden.');
process.exit(divergen ? 1 : 0);
