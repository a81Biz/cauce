# PT-049 — Diseño   `PHASE 4`

## Dónde se toca, y por qué ahí

Las dos herramientas **ya separan acumular de imprimir**. Ninguna imprime mientras verifica: las
dos llenan una estructura y vuelcan al final. Eso hace que `-q` sea un cambio en el volcado y en
ningún sitio más.

```js
// tools/verify-fdge.mjs:77-79   acumulan, no imprimen
const fail = (rule, msg) => errors.push({ rule, msg });
const warn = (rule, msg) => warnings.push({ rule, msg });
const ok   = (rule, msg) => passed.push({ rule, msg });

// tools/verify-fdge.mjs:1471-1489   el UNICO sitio que imprime
if (passed.length)   { console.log('PASA');    for (…) … }
if (warnings.length) { console.log('AVISOS');  for (…) … }
if (errors.length)   { console.log('ERRORES'); for (…) …; process.exit(1); }
console.log(`Sin errores. PTs verificados: ${pts.length}.`);
```

```sh
# tools/selftest.sh:28-30   pass() cuenta Y imprime en el mismo acto
pass() { TOTAL=$((TOTAL + 1)); printf "  \033[32m✓\033[0m %s\n" "$1"; }
bad()  { TOTAL=$((TOTAL + 1)); printf "  \033[31m✗\033[0m %s\n" "$1"; FAILED=1; }
```

**La diferencia importa.** En `verify-fdge` basta con no recorrer `passed`. En `selftest`, `pass()`
cuenta e imprime a la vez, así que hay que separar las dos cosas — y separarlas **sin tocar
`TOTAL`**, que es la cifra derivada que `AC-02` protege.

## El cambio

```js
// verify-fdge.mjs
const quiet = argv.includes('-q') || argv.includes('--quiet');
if (passed.length && !quiet) { … }        // los AVISOS y los ERRORES no se tocan
```

```sh
# selftest.sh
QUIET=""; for a in "$@"; do [ "$a" = "-q" ] && QUIET=1; done
pass() { TOTAL=$((TOTAL + 1)); [ -n "$QUIET" ] || printf …; }
```

`bad()` **no lleva guarda**: un fallo se imprime siempre, en cualquier modo. Es `AC-03` escrito en
el código en vez de en un caso.

## Lo que no se toca, y es deliberado

| Qué | Por qué |
|:---|:---|
| El recuento final | `AC-02`. Está fuera de las guardas en las dos herramientas |
| `process.exit(1)` y `FAILED` | `AC-04`. El modo imprime; **no decide** |
| Los avisos | No es lo que la tarea firmó. Los 43 medidos, y los 19 que dicen «aún no toca», quedan en el `discovery` |
| `revento()` | Lee la salida de la herramienta **bajo prueba**, no la del arnés. `-q` no entra ahí |
| El primer argumento de `selftest.sh` | Hoy es el directorio temporal. `-q` no puede confundirse con él |

Ese último punto tiene trampa: `selftest.sh [dir-temporal]` toma `$1` como ruta. Si alguien
escribe `selftest.sh -q`, `WORK` se convertiría en `-q/mth-selftest`. **Por eso `-q` se filtra de
los posicionales antes de calcular `WORK`**, y tiene su caso.

## Por qué una bandera y no una variable de entorno

`MTH_QUIET=1` habría sido más corto y no deja rastro en la línea que se lee. Una bandera aparece
en el comando, en el historial y en la evidencia: quien lea `selftest.sh -q` en una salida
capturada **sabe por qué solo hay dos líneas**. Con una variable, la misma salida parecería una
batería vacía.

## Lo que este diseño **no** hace

No cambia ninguna regla, no toca `LEXICON` ni `PHASES`, y no altera la salida sin `-q` — que es la
que corre la CI. Es la propiedad que `AC-04` y su caso protegen: sin la bandera, byte por byte, lo
de siempre.
