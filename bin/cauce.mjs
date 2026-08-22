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

import { readFileSync, existsSync, readdirSync, mkdirSync, copyFileSync, statSync,
         writeFileSync } from 'node:fs';
// PT-112 · el salto por codigo, no escapado (SUITE-R59).
const SALTO_CAUCE = String.fromCharCode(10);
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const AQUI = dirname(fileURLToPath(import.meta.url));
const PAQUETE = resolve(AQUI, '..');              // raíz del paquete instalado
const CARGA = join(PAQUETE, 'docs', 'methodology'); // lo que se instala en el destino
const PKG_PROPIO = JSON.parse(readFileSync(join(PAQUETE, 'package.json'), 'utf8'));
const VERSION = PKG_PROPIO.version;

const [, , comando, ...resto] = process.argv;
// PT-041 · un identificador de regla NO es una ruta. `cauce regla SUITE-R46` resolvia DESTINO
// como el directorio «SUITE-R46» y no encontraba la suite. Es EL MISMO defecto que aparecio el
// mismo dia en `tracker` con `siguiente EP-011`: un argumento con forma de identificador colandose
// como ruta. Dos sitios, misma causa — se anota aqui para que el tercero se vea antes.
const RE_ID = /^[A-Z]+-R\d+$/;
const DESTINO = resolve(resto.find((a) => !a.startsWith('--') && !RE_ID.test(a)) ?? process.cwd());
const SUITE_EN_DESTINO = join(DESTINO, 'docs', 'methodology');
const FORZAR = resto.includes('--forzar');

// ── ¿el destino ES cauce? Por IDENTIDAD, no por ruta ────────────────────────
// Comparar rutas (`CARGA === SUITE_EN_DESTINO`) solo acierta cuando la carga y el destino son
// literalmente el mismo directorio. En el repositorio de cauce con el paquete instalado como
// dependencia de sí mismo hay DOS binarios con el mismo nombre y se comportan distinto:
//
//   npx cauce                        → el bin del propio repo   → las rutas coinciden → detecta
//   node_modules/.bin/cauce          → el bin del paquete       → rutas distintas     → NO detecta
//
// El segundo es el que usa cualquier `npm run`, porque npm pone `node_modules/.bin` en el PATH.
// Ese anunció «49 archivos en docs/methodology/» sobre el repositorio que ES cauce. No hizo daño
// porque los contenidos coincidían y porque `SUITE-R31` para el caso divergente — pero el
// mensaje mentía, y depender de qué binario resolvió el shell no es una garantía.
//
// La identidad no depende de rutas: si el `package.json` del destino declara este mismo nombre,
// el destino es cauce.
const esCauce = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).name === PKG_PROPIO.name;
  } catch { return false; }
};
const AUTOALOJADO = CARGA === SUITE_EN_DESTINO || esCauce(DESTINO);

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
    if (AUTOALOJADO) {
      di(`${c.verde}cauce ${VERSION}${c.fin} · este repositorio ES cauce. No se instala sobre sí mismo.`);
      di(`${c.dim}No hay nada que copiar. Se regenera el núcleo y lo demás sigue igual.${c.fin}`);
      // Instalarlo como dependencia de sí mismo deja DOS copias completas del marco en el mismo
      // repositorio: la de trabajo y la publicada. Solo pueden divergir, y es exactamente la
      // divergencia que cauce existe para eliminar — dentro de cauce.
      if (existsSync(join(DESTINO, 'node_modules', ...PKG_PROPIO.name.split('/')))) {
        di();
        di(`${c.rojo}Y está instalado como dependencia de sí mismo.${c.fin}`);
        di('Eso deja dos copias completas del marco en este repositorio: la de trabajo y la');
        di('publicada. Solo pueden divergir — la avería que cauce existe para eliminar, dentro');
        di('de cauce. Además el nombre «cauce» pasa a resolver a dos binarios distintos según');
        di(`quién lo invoque. Quítalo:  ${c.neg}npm uninstall ${PKG_PROPIO.name}${c.fin}`);
      }
      di();
      const r = corre('build-core.mjs', [SUITE_EN_DESTINO]);
      di();
      di(`Lo que falta para que se gobierne a sí mismo lo dice ${c.neg}cauce verify${c.fin}:`);
      di(`${c.dim}registro, terreno, estado y la documentación de Foundation. Es la misma${c.fin}`);
      di(`${c.dim}instalación conversacional que cualquier proyecto — sin excepción por ser este.${c.fin}`);
      return r;
    }
    const d = divergencia();
    // PT-112 · SUITE-R06e · «--forzar» NO ES UNA COMPUERTA.
    //
    // Sobrescribir `docs/methodology/` es de lo que SUITE-R06 dice que no se automatiza, y
    // SUITE-R31 dice que decidir quien tiene razon es HUMANO. El flag saltaba las dos SIN DEJAR
    // NADA: ni quien lo decidio, ni que se sobrescribio, ni cuando. Una compuerta que se pasa sin
    // rastro no es una compuerta — es una puerta.
    //
    // No se prohibe: un proyecto que ya decidio necesita poder aplicarlo. Lo que se exige es lo
    // mismo que EXEC-R04a exige de G4: CONSTANCIA, y con forma fija. El flag pide quien decide, y
    // sin nombre no sobrescribe.
    if (!d.nueva && (d.difieren.length || d.soloDestino.length) && FORZAR) {
      const i = resto.indexOf('--forzar');
      const quien = (resto[i + 1] && !resto[i + 1].startsWith('--')) ? resto[i + 1] : null;
      if (!quien) {
        err('«--forzar» sobrescribe docs/methodology/, y eso es SUITE-R06e: no se automatiza.');
        di();
        di('No se prohibe: un proyecto que ya decidio puede aplicarlo. Lo que no puede es');
        di('hacerlo SIN RASTRO — quien lo decidio, que se sobrescribio y cuando. Una compuerta');
        di('que se pasa sin constancia no es una compuerta (EXEC-R04a, SUITE-R31).');
        di();
        di(`  cauce install --forzar "Nombre Apellido"   ${c.dim}# y queda registrado${c.fin}`);
        return 2;
      }
      const cuando = new Date().toISOString().slice(0, 10);
      const linea = [
        '',
        `## ${cuando} · marco sobrescrito con --forzar`,
        `Decidido por: ${quien}`,
        `Version de cauce: ${VERSION}`,
        `Archivos con contenido distinto: ${d.difieren.length}`,
        `Archivos solo en el destino: ${d.soloDestino.length}`,
        ...d.difieren.slice(0, 20).map((f) => `  difiere  ${f}`),
        ...d.soloDestino.slice(0, 20).map((f) => `  solo destino  ${f}`),
        'SUITE-R31 · quien tiene razon lo decide una persona, y aqui consta quien lo decidio.',
        '',
      ].join(SALTO_CAUCE);
      try {
        const reg = join(process.cwd(), 'docs', 'implementation', 'INSTALL.log');
        const previo = existsSync(reg) ? readFileSync(reg, 'utf8') : '';
        writeFileSync(reg, previo + linea);
        di(`${c.dim}Constancia en docs/implementation/INSTALL.log${c.fin}`);
      } catch {
        // RULE-06 · si no se puede registrar, NO se sobrescribe: la constancia es la condicion.
        err('No se pudo escribir la constancia en docs/implementation/INSTALL.log.');
        di('Sobrescribir sin poder registrarlo es exactamente lo que esto impide.');
        return 2;
      }
    }
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
    // PT-042 · SUITE-R54 · la instalacion EMPIEZA por leer, no por copiar. Copiar archivos que
    // nadie lee es como llegamos a tener 179 reglas y ningun manual: el agente se instalaba sin
    // saber que le gobierna.
    di();
    di(`${c.neg}Antes de nada, lee esto${c.fin} — en este orden:`);
    di(`  1 · ${c.neg}docs/methodology/MANUAL.md${c.fin}        ${c.dim}como se usa. Entero, una vez.${c.fin}`);
    di(`  2 · ${c.neg}docs/methodology/CASOS-DE-USO.md${c.fin}  ${c.dim}tu caso concreto.${c.fin}`);
    di(`${c.dim}Instalar copia archivos; leerlos es lo que hace que sirvan (SUITE-R54).${c.fin}`);
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
      ['tracker.mjs', ['espejo']],
    ]) {
      di(`${c.dim}── ${script}${c.fin}`);
      const r = corre(script, args);
      // 2 = «nada que verificar aqui» · 3 = plataforma declarada y sin acceso desde ESTA
      // maquina. Ninguno es un fallo del proyecto: `cauce verify` corre donde sea, incluida la
      // de quien acaba de instalar y aun no ha hecho `gh auth login`. Donde la credencial SI es
      // exigible —npm run verify del repositorio, CI y G4— si bloquea (FND-R30).
      if (r === 3) di(`${c.dim}   ↑ sin acceso a la plataforma: el espejo queda SIN EVALUAR${c.fin}`);
      peor = Math.max(peor, r === 2 || r === 3 ? 0 : r);
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

  // PT-034 · `SUITE-R50` · el punto de ENTRADA es el tablero.
  //
  // `SUITE-R48` dejo la respuesta consultable y `SUITE-R49` la puso lo primero en CORE.md, pero
  // las dos siguen dependiendo de que el agente pregunte: un comando no puede exigir haber sido
  // llamado, y una convencion se puede ignorar — que es lo que ya pasaba.
  //
  // `cauce start` no es un recordatorio: es el arranque. Imprime el estado del tablero y DESPUES
  // el nucleo, en ese orden, y no hay forma de obtener lo segundo sin lo primero. Quien arranca
  // asi no puede llegar a su primera decision sin el estado delante.
  //
  // No automatiza nada ni resuelve ninguna compuerta: solo cambia que es lo primero que se ve.
  start() {
    di(`${c.neg}cauce${c.fin} ${VERSION} — arranque`);
    di();
    di(`${c.dim}El estado sale del tablero, no de la memoria del agente (SUITE-R49, SUITE-R50).${c.fin}`);
    di();
    // `tracker siguiente` sale 2 sin plataforma y 3 sin acceso. Ninguno de los dos es un fallo
    // del arranque: es el SIN EVALUAR que SUITE-R49 obliga a declarar en vez de sustituir por
    // lo que parezca. Se dice y se sigue — callarlo lo convertiria en «no hay nada abierto».
    const cod = corre('tracker.mjs', ['siguiente', DESTINO]);
    if (cod === 2) di(`${c.dim}Sin plataforma declarada: el estado del tablero queda SIN EVALUAR (SUITE-R49).${c.fin}`);
    else if (cod === 3) di(`${c.dim}Plataforma declarada sin acceso: SIN EVALUAR. No se sustituye por una suposicion.${c.fin}`);
    di();
    // PT-042 · SUITE-R54 · el manual antes que el nucleo. Un agente que arranca sin haber leido
    // lo que le gobierna es el problema que este marco existe para eliminar, dentro del marco.
    const man = join(SUITE_EN_DESTINO, 'MANUAL.md');
    di(`${c.neg}Y ahora, en este orden${c.fin}:`);
    di();
    if (existsSync(man)) {
      di(`  1 · ${c.neg}MANUAL.md${c.fin}        ${c.dim}como se usa esto. Se lee ENTERO una vez (SUITE-R54).${c.fin}`);
      di(`      ${man}`);
      di(`  2 · ${c.neg}CASOS-DE-USO.md${c.fin}  ${c.dim}el caso que tengas delante, con su ruta.${c.fin}`);
      di(`  3 · ${c.neg}CORE.md${c.fin}          ${c.dim}las reglas. Lo unico que se carga en runtime (SUITE-R15).${c.fin}`);
    } else {
      // No se finge que este: sin manual se dice, y el marco sigue siendo usable (RULE-06).
      di(`  ${c.rojo}No hay MANUAL.md en el destino.${c.fin} El marco funciona igual —CORE.md es lo unico`);
      di(`  obligatorio— pero nadie te va a explicar como se usa. Instalalo o traelo de la version.`);
      di(`  ${c.neg}CORE.md${c.fin}  ${SUITE_EN_DESTINO}/CORE.md`);
    }
    di();
    di();
    di(`${c.dim}Ese orden no es de cortesia. El estado va primero porque leer las reglas sin el${c.fin}`);
    di(`${c.dim}estado es como se saltan las fases. Y el manual va antes que las reglas porque${c.fin}`);
    di(`${c.dim}conocer 179 reglas no es lo mismo que saber usarlas — y nadie te obliga a leerlo,${c.fin}`);
    di(`${c.dim}asi que si te lo saltas, el unico perjudicado eres tu.${c.fin}`);
    di();
    di(`${c.dim}Y cuando algo falle:  ${c.fin}${c.neg}cauce regla <ID>${c.fin}${c.dim}  — no lo deduzcas (SUITE-R53).${c.fin}`);
    return 0;
  },

  // PT-041 · la regla, en el momento en que importa. El manual decia «de las diez ideas se
  // deduce la regla que no has leido»: eso era una excusa. Deducir no deberia hacer falta.
  regla() { return corre('regla.mjs', [...resto.filter((a) => resolve(a) !== DESTINO), SUITE_EN_DESTINO]); },

  version() { di(`cauce ${VERSION}`); return 0; },
};

// PT-045 · pedir ayuda no es un error, y un subcomando que no existe SI lo es. Los dos casos
// imprimian exactamente lo mismo y la unica diferencia era el codigo de salida, que nadie ve:
// quien pedia `start` desde una version anterior a la que lo trae recibia una ayuda muda donde
// `start` no aparecia, y concluia que el manual mentia. Es lo que SUITE-R53 corrigio para las
// reglas —el fallo lleva a lo que hay que consultar— sin corregirse aqui, que es lo PRIMERO que
// alguien ejecuta.
const desconocido = Boolean(comando) && comando !== '--help' && comando !== '-h' && !comandos[comando];
if (!comando || comando === '--help' || comando === '-h' || desconocido) {
  if (desconocido) {
    di(`«${comando}» no es un subcomando de cauce ${VERSION}.`);
    di('Si lo esperabas, tu copia puede ser anterior a la que lo trae:');
    di(`  npx @a81biz/cauce@latest ${comando}`);
    di();
  }
  di(`${c.neg}cauce${c.fin} ${VERSION} — marco de gobernanza para desarrollo asistido por IA`);
  di();
  di(`  ${c.neg}cauce start${c.fin}   [ruta]   EMPIEZA AQUÍ · el estado del tablero, y después el núcleo`);
  di(`  ${c.neg}cauce install${c.fin} [ruta]   instala el marco en un proyecto y genera su núcleo`);
  di(`  ${c.neg}cauce verify${c.fin}  [ruta]   coherencia del marco, núcleo sincronizado y cumplimiento de los PT`);
  di(`  ${c.neg}cauce compare${c.fin} [ruta]   qué difiere entre la copia del proyecto y esta versión`);
  di(`  ${c.neg}cauce core${c.fin}    [ruta]   regenera CORE.md y CORE-PTSA.md`);
  di(`  ${c.neg}cauce regla${c.fin}  SUITE-RNN  qué exige una regla, dónde vive y qué la comprueba`);
  di(`  ${c.neg}cauce regla${c.fin}  --fallos   todo lo que puede fallar, derivado del código`);
  di();
  di(`${c.dim}La instalación de verdad es conversacional: tras «cauce install», dile a Claude${c.fin}`);
  di(`${c.dim}«instala el framework» y conducirá el terreno, los movimientos y las dependencias.${c.fin}`);
  process.exit(comando && !comandos[comando] ? 2 : 0);
}

process.exit(comandos[comando]());
