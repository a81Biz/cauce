# `PT-183` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | una bandera desconocida | `tracker siguiente --epic EP-700` | se rechaza, y sugiere `--epica` |
| TS-02 | una bandera legítima | `tracker cursor` | no se rechaza — sin regresión |
| TS-03 | una legítima con valor | `mover PT-801 --epica EP-702` | tampoco se rechaza |
| TS-04 | asignar el lote que falta | `mover` sobre un `PT` sin lote en `PHASE 8` | se permite, y dice que no es un cambio |
| TS-05 | cambiar de lote una empezada | `mover PT-800 --epica EP-702` | sigue negándose |
| TS-06 | el barrido del registro | `verify-fdge` sobre cualquier `PT` | cuenta los que no declaran lote |
| TS-07 | no se juzga hacia atrás | los cuatro históricos | se cuentan y se declaran, no fallan |
| TS-08 | un `PT` nuevo sin lote | quitarle el `epic` a uno de `13.2.0` | **falla**, y nombra cuál |
| TS-09 | los cinco reparados | leer registro, intake e `HISTORY` | los tres citan su lote |

**Dónde viven**: selftest §EP-024 · 9 casos, 4 sobre fixture propio.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
