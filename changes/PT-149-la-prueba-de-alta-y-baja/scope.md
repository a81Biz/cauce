# `PT-149` · `scope.md` — `PHASE 2-R`

## Lo que se midió antes de tocar nada

Se dio de alta un componente de prueba —`Zeta` · `ZT` · `ZTA`, fases `1-3`— sobre una **copia**
del árbol, siguiendo `E5` al pie de la letra. El resultado decidió el alcance:

| Herramienta | ¿Lo veía sin tocarla? | |
|:---|:---|:---|
| `verify-suite` | **sí** | deriva la alternancia de prefijos. Es lo que `PT-145` construyó |
| `audit` | **aparentemente** | falso positivo → `PT-168`, fuera de alcance |
| `build-core` | **no** | `Zeta`, `ZTA` y `[START ZETA]` aparecían **cero** veces en `CORE.md` |
| `verify-patrones` | **no** | fijaba `comps.length !== 6` y `opcionales() === ['FIDE']` |

## Qué se toca, y por qué ese y no otro

| Archivo | Qué cambia | Por qué |
|:---|:---|:---|
| `tools/verify-patrones.mjs` | «exactamente seis» → «ninguno de los seis falta» | `AC-05`: sin esto, el alta pone `npm run verify` en rojo |
| `tools/verify-patrones.mjs` | `opcionales()` exacto → contiene `FIDE` | Igual, para un componente opcional |
| `tools/build-core.mjs` | los bloques de fases y triggers se **completan** | `AC-02`: sin esto el componente no llega a `CORE.md` |
| `CASOS-DE-USO.md` `E5` | la Entrada pasa de un paso a los **cinco** medidos | `E5` era falso, y lo dijo ejecutarlo |
| `tools/selftest.sh` | nueve casos permanentes | `AC-01`..`AC-06` |

## Qué NO se toca

**El falso positivo de `audit`** (`PT-168`). Hacer `cubre` consciente del componente pondrá en
rojo items hoy en verde, y eso es trabajo con su propia medición — no un paso de la tarea que lo
encontró. Las aserciones de aquí se apoyan en lo que **sí** discrimina.

**Los bloques de `build-core` no se reescriben: se completan.** Llevan la sintaxis de cada
comando —`delta QA PT-XXX`, `promote FPGE R-NNN`— que no sale de ningún contrato. Derivarlos
enteros perdería eso. Lo redactado manda; lo que falte se añade.
