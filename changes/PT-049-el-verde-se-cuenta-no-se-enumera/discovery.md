# PT-049 — Descubrimiento   `PHASE 2` · `2-B`

## Lo medido, no lo supuesto

Las dos salidas, clasificadas línea a línea sobre un árbol sano:

```
selftest.sh                              verify-fdge --all
  total                    541             total                    507
  OK (verde)               520   96 %      OK (verde)               454   89 %
  avisos                     0             avisos                    43
  fallos                     0             fallos                     1
  encabezados y blancos     21             encabezados y blancos      9
```

## El hallazgo que cambia el diseño

**Las dos herramientas no tienen el mismo problema, y tratarlas igual habría sido un error.**

| | `selftest` | `verify-fdge` |
|:---|:---|:---|
| Con `-q` quedan | **2 líneas** | **46 líneas** |
| Reducción | 99,6 % | 90,9 % |
| Lo que queda | el recuento | **43 avisos** + fallos + recuento |

En `selftest` el verde **es** la salida: sin él no queda nada, y `-q` la reduce casi a cero.
En `verify-fdge` el volumen que sobrevive a `-q` **no es el verde: son los avisos.**

Los 43, agrupados:

```
14  SUITE-R44   filas de out-of-scope de PTs ya integrados, con citas que su lote ya cerró
 7  FDGE-R23    «aún sin manifest.json (normal antes de PHASE 6)»
 6  SUITE-R43   comentarios del issue pendientes de leer
 6  FDGE-R29    «aún sin entrada en HISTORY.log (se escribe en PHASE 8)»
 6  FDGE-R15    «aún sin traceability.md — se escribe en PHASE 4»
 3  SUITE-R35   divergencias de índice
 1  SUITE-R45   filas de cierre del lote abierto
```

**Diecinueve de los 43 dicen literalmente «aún no toca».** `FDGE-R23`, `FDGE-R29` y `FDGE-R15`
avisan de artefactos que el procedimiento escribe **más adelante**: son correctos, son el diseño,
y no informan de nada que quien trabaja no sepa.

## Lo que esto significa para el alcance

`AC-01` dice «reduce la salida a los fallos **y el recuento**». Medido, eso deja `verify-fdge` en
46 líneas — mejor que 507, pero lejos de lo que la tarea perseguía. Y **la causa no es el verde.**

Hay una frontera que conviene ver antes de escribir código: un aviso que dice «aún no toca» es
distinto de uno que dice «esto está divergiendo». Los primeros se derivan de la fase; los segundos
son hallazgos.

Pero **acallar avisos no es lo que esta tarea firmó**, y decidirlo aquí sería ampliar el alcance
por el camino. Se mide, se dice, y se deja: si merece tarea, será suya y con su intake.

## Dónde está, con archivo y línea

```js
// tools/verify-fdge.mjs:~95   las tres funciones que imprimen
const ok   = (r, m) => { … console.log(`  ${c.verde}✓${c.fin} ${r.padEnd(14)} ${m}`) };
const warn = (r, m) => { … };
const fail = (r, m) => { … };

// tools/selftest.sh:28-30
pass() { TOTAL=$((TOTAL + 1)); printf "  \033[32m✓\033[0m %s\n" "$1"; }
bad()  { TOTAL=$((TOTAL + 1)); printf "  \033[31m✗\033[0m %s\n" "$1"; FAILED=1; }
```

**Las dos herramientas ya cuentan.** `selftest` lleva `TOTAL` —derivado, no escrito a mano, desde
que dos cifras copiadas divergieron— y `verify-fdge` cierra con «PTs verificados: N». El recuento
que `AC-02` exige **no hay que inventarlo: hay que no perderlo.**

Eso es lo que hace esta tarea barata: no es añadir una capacidad, es **no imprimir** una que ya
está contada.

## Lo que NO es el defecto

No es que el verde sobre. La primera vez que alguien lee la salida, el verde enumerado es lo que
hace **creíble** el rojo — y `PT-002` corrigió exactamente el caso contrario: una cobertura que
decía «sin huecos» sin denominador. Lo que sobra es repetirlo quince veces en una sesión.

Por eso `-q` **no** será el modo por defecto, y por eso el recuento no puede callarse ni en `-q`:
sin denominador, «sin errores» vuelve a ser la afirmación que este marco existe para impedir.
