# `PT-162` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | mover lo que no ha empezado | `mover PT-801 --epica EP-702` | cambia de lote y sincroniza el intake |
| TS-02 | mover lo ya empezado | `mover PT-800` en `PHASE 5` | se niega: su evidencia cita otro lote |
| TS-03 | destino que no es un lote | `--epica PT-800` | se niega por `LEX-R27` |
| TS-04 | destino inexistente | `--epica EP-999` | se niega por `SUITE-R08` |
| TS-05 | destino cerrado | `--epica EP-701` (CLOSED) | se niega: lo reabriría |
| TS-06 | rechazar sin motivo | `rechazar PT-801` | se niega: exige que diga algo |
| TS-07 | rechazar lo terminal | `rechazar EP-701` | se niega: lo integrado se revierte |
| TS-08 | `DEFERRED` sí se mueve | `mover PT-172 --epica EP-025` | un aplazado está vivo (`SUITE-R44`) |

**Dónde viven**: selftest §EP-024 · 7 casos sobre fixture propio.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
