# PT-045 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `cauce arrancar` (subcomando que no existe) | nombra el subcomando |
| E2 | AC-01 | …y dice la versión que corre | la versión vigente |
| E3 | AC-01 | …y da la salida | `@latest` |
| E4 | AC-01 | El código de salida sigue siendo `2` | `2` |
| E5 | AC-03 | Sin subcomando **no** aparece el mensaje de error | no aparece «no es un subcomando» |
| E6 | AC-03 | …y su código sigue siendo `0` | `0` |
| E7 | AC-02 | `npm start` existe y apunta al arranque | `bin/cauce.mjs start` |
| E8 | AC-03 | `MANUAL.md` declara el caso de estar dentro de cauce | `npm start` |
| E9 | AC-03 | `CASOS-DE-USO.md` también | `npm start` |
| E10 | AC-04 | El orden tablero → núcleo no cambia | el manual sigue antes que el núcleo |

## Los que NO deben cambiar

`E5` y `E6`. Pedir ayuda no es un error, y confundir las dos cosas es el defecto que esta tarea
corrige — cometerlo en la dirección contraria sería el mismo fallo con otro signo.
