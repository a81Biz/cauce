# 11-Conventions — convenciones del codebase

> Foundation `PHASE 4` · 2026-08-13 · suite 5.2.3
> Convenciones **observadas**, con ejemplo real de este repositorio. Lo que aquí se declara
> `RULE-nn` es Hard Rule del codebase (`LEX-R05`), no de la suite.

## Folder Structure

```
cauce/
├── bin/cauce.mjs                    el binario publicado · único entry point
├── .github/workflows/               verificacion.yml (bloquea) · publicar.yml (manual)
├── docs/
│   ├── methodology/                 EL PRODUCTO · 34 documentos + tools/ con 15 herramientas
│   ├── enterprise-documentation/    Foundation · este paquete
│   └── implementation/              ledgers, terreno firmado, registro de instalación
├── changes/                         un directorio por PT
├── evidence/                        un directorio por PT
├── QA/ · PTSA/                      espacios de los componentes de verificación y auditoría
├── graphify-out/                    NO se versiona · regenerable · SUITE-R37
└── package.json · .gitignore · .gitattributes · LICENSE · NOTICE
```

**No hay `src/`, y es deliberado.** Las herramientas viajan **dentro del paquete** que se
instala en el proyecto destino, donde se ejecutan como `node docs/methodology/tools/<x>.mjs`. Un
`src/` obligaría a duplicarlas o a construirlas en el empaquetado. Igualmente, `selftest.sh`
convive con las herramientas que prueba. Ambas cosas se apartan de lo que el propio marco pide a
un proyecto normal (`FND-R25`), y por eso se **declaran** aquí en vez de corregirse: la
estructura sirve a la distribución, que es el requisito que manda.

---

## Naming

| Elemento | Convención | Ejemplo real |
|:---|:---|:---|
| Herramientas | `kebab-case.mjs`, verbo o sustantivo en castellano | `revisar-secretos.mjs` · `comparar-marco.mjs` · `plan-layout.mjs` |
| Funciones y variables | Castellano, `camelCase` | `esCauce()` · `copiarCarga()` · `divergencia()` · `AUTOALOJADO` |
| Constantes de módulo | Castellano, `MAYÚSCULA` | `CARGA` · `DESTINO` · `SUITE_EN_DESTINO` · `VIGENTE` |
| Documentos de la suite | El nombre canónico de `LEXICON` §6, sin excepción | `02-PRD.md`, nunca `PRD.md` ni `01-PRD.md` |
| Reglas de la suite | `PREFIJO-Rnn`, nunca una `R` desnuda | `SUITE-R41` · `FND-R29` · `FDGE-R43` |
| Estados e identificadores | **Inglés**, `MAYÚSCULA_CON_GUION_BAJO` (`LEX-R07`) | `IN_PROGRESS` · `VALIDATION_PENDING` · `PT-001` |
| Mensajes al usuario | Castellano, sin jerga, diciendo qué hacer | `Falta ${script} en el destino. ¿Ejecutaste «cauce install»?` |

El castellano en el código y el inglés en los identificadores de la suite no es incoherencia:
los identificadores son **vocabulario canónico** que viaja a proyectos de cualquier idioma, y
`LEX-R07` los fija.

---

## Patrones arquitectónicos

### El comentario «POR QUÉ EXISTE»

Toda herramienta abre con una cabecera que explica **el defecto histórico concreto** que la
originó. No es documentación de cortesía: es lo que impide que alguien la simplifique sin saber
qué protege.

```js
/**
 * patrones — los patrones críticos del marco, en un solo sitio y con su contrato.
 *
 * POR QUÉ EXISTE
 *   Un patrón puede estar mal y compilar. Esa es la frase entera del problema.
 *
 *   Ocho veces en este proyecto una secuencia de escape se perdió al editar: `\b` quedó como
 *   el byte 0x08 y `\s` como la letra «s». El regex resultante es sintácticamente válido y no
 *   casa nada — y **el fallo es indistinguible del éxito**.
 */
```
[tools/patrones.mjs:1-20](../methodology/tools/patrones.mjs#L1-L20)

### Acumular y reportar, nunca lanzar

Un verificador no aborta en el primer fallo: acumula en tres listas y las imprime clasificadas.
Quien lo lee necesita **todos** los fallos, no el primero.

```js
const errors = [];  const warnings = [];  const passed = [];
const fail = (rule, msg) => errors.push({ rule, msg });
const warn = (rule, msg) => warnings.push({ rule, msg });
const ok   = (rule, msg) => passed.push({ rule, msg });
```
[tools/verify-fdge.mjs:44-52](../methodology/tools/verify-fdge.mjs#L44-L52)

### Cada mensaje de error lleva su regla y su porqué

```js
fail('SUITE-R30', `LAYOUT.md decidió la propuesta ${a[1]} («${...}») y ninguna entrada de ` +
  `INSTALL.log la reclama con «[L${a[1]}]». Una decisión sin ejecución registrada es una ` +
  `decisión que nadie sabe si se cumplió.`);
```
[tools/verify-fdge.mjs:361](../methodology/tools/verify-fdge.mjs#L361)

---

## Hard Rules

### `RULE-01` · Un hecho se escribe en un sitio; los demás lo derivan

**Qué NO hacer:** copiar a mano un dato que ya existe en otro archivo — la versión, el número de
casos, el nombre de un artefacto.

```js
const SUITE_VERSION = '5.2.0';   // ✗ quedó tres parches por detrás sin que nada lo notara
```
```js
const CAMBIOS = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'CHANGELOG.md');
const SUITE_VERSION = readFileSync(CAMBIOS, 'utf8').match(PATRONES.VERSION_VIGENTE.re)?.[1] ?? null;   // ✓
```

**Por qué:** es la causa raíz que la v4 nació para eliminar, y reaparece sola. Ha ocurrido con la
versión en `verify-suite`, en `verify-fdge`, en `migrate` y en el fixture del selftest; con el
sello, copiado en tres archivos; y con el número de casos, escrito en cuatro sitios y erróneo en
los cuatro. `SUITE-R40` es la forma normativa de esta regla.

### `RULE-02` · Un fallo tiene que ser distinguible del éxito

**Qué NO hacer:** una comprobación que, cuando se rompe, informa «sin errores».

```js
if (!contenido.match(/AC-d+/)) { /* ✗ el escape degradado no casa nada — y calla */ }
```
```js
AC_ID: { re: /AC-\d+/, casa: ['AC-01'], noCasa: ['AC-', 'ACC-1'] }   // ✓ el ejemplo lo tumba
```

**Por qué:** ocho veces un escape se degradó en este repositorio y el verificador siguió diciendo
que todo estaba bien. El selftest aplica la misma exigencia a sí mismo: `revento()` invalida un
caso si la herramienta lanza una excepción, porque una herramienta rota tampoco imprime el
patrón buscado y el arnés certificaba verificadores muertos.

### `RULE-03` · Todo parseo por líneas usa `split(/\r?\n/)`

**Qué NO hacer:** `split('\n')`, o un regex anclado en `$` sin flag `m`.

```js
const lineas = txt.split('\n');        // ✗ deja un \r al final de cada línea en Windows
const lineas = txt.split(/\r?\n/);     // ✓
```

**Por qué:** en JavaScript `.` **no** casa `\r` —es terminador de línea—, así que un regex
anclado en `$` sin `m` falla en cualquier archivo guardado en Windows. Ese fallo dejó **25 reglas
fuera de `CORE.md` sin avisar**. Cada herramienta lo declara en su cabecera, y
[.gitattributes](../../.gitattributes) normaliza el repositorio con `* text=auto eol=lf`.

### `RULE-04` · Cero dependencias

**Qué NO hacer:** añadir cualquier `import` que no sea de `node:` o de `./`.

**Por qué:** las herramientas se ejecutan desde el `docs/methodology/tools/` del proyecto
destino, donde no hay `node_modules` propio. El día que una dependencia entre, dejan de arrancar
allí — y el fallo aparece en el proyecto ajeno, no aquí.

### `RULE-05` · Un verificador no escribe

**Qué NO hacer:** corregir el artefacto que se está verificando.

**Por qué:** quien decide corregir es quien lee la salida. Un verificador que arregla lo que
encuentra deja de ser una compuerta y pasa a ser un participante. Las únicas herramientas que
escriben son las que lo declaran en su nombre y en su modo: `build-core`, `version --aplicar`,
`migrate --apply`, `plan-layout --write`, `tracker abrir --aplicar`.

### `RULE-06` · Lo que no se puede comprobar se declara no evaluable

**Qué NO hacer:** inventar un valor por defecto para poder seguir comprobando.

```js
const SUITE_VERSION = leerDelChangelog() ?? '5.2.0';        // ✗ compara contra una invención
```
```js
if (!SUITE_VERSION) warn('SUITE-R40', 'la compuerta queda sin evaluar…');   // ✓
```

**Por qué:** una compuerta que se satisface sobre un valor inventado dice «todo bien» sobre
nada. Es el mismo error que `FDGE-R08` corrigió en la 4.0.x, donde una regla HARD se cumplía
declarando que no se podía cumplir.

### `RULE-07` · La salida se escribe para quien tiene que decidir

**Qué NO hacer:** `Error: invalid state`.

```js
err(`Falta ${script} en el destino. ¿Ejecutaste «cauce install»?`);   // ✓ dice qué hacer
```

**Por qué:** el destinatario de un mensaje del marco es alguien que está decidiendo si bloquea
un merge. Un mensaje que no dice qué regla se violó, por qué existe y qué hacer, obliga a esa
persona a leer el código — y entonces la compuerta cuesta más que saltársela.

---

## Archivos que exigen cuidado

| Archivo | Por qué |
|:---|:---|
| `CORE.md` · `CORE-PTSA.md` | **Generados.** Editarlos a mano reintroduce la divergencia entre copias (`SUITE-R16`). Se regeneran con `build-core` |
| `tools/patrones.mjs` | Un cambio aquí afecta a cinco herramientas. Todo patrón nuevo entra con sus listas `casa` y `noCasa` |
| `tools/selftest.sh` | El arnés. Un caso mal escrito certifica un verificador roto; `revento()` es lo que lo impide |
| `RULES.md` · `LEXICON.md` · `EXECUTION-MODES.md` | Fuentes de autoridad. Tocarlas obliga a regenerar el núcleo y es `SUITE-R06e`: no se automatiza |
| `CHANGELOG.md` | Fuente de la versión vigente. Su primera entrada la escribe una persona |
| `.github/workflows/publicar.yml` | Publicar es irreversible. Cada barrera que tiene se puso después de un incidente |

---

## Delta Log

| Fecha | Cambio |
|:---|:---|
| 2026-08-13 | Creación. Foundation `PHASE 4` sobre suite 5.2.3, tras la instalación autoalojada (`SUITE-R41`). Siete Hard Rules derivadas de defectos reales documentados en las cabeceras de las herramientas y en el `CHANGELOG` |
