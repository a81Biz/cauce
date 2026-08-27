# `PT-186` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | `PHASE 1` sin intake | fixture con la tarea en `PHASE 1` | **avisa**, no falla |
| TS-02 | el aviso explica | leer el mensaje | dice que aún no es exigible y cita `PT-178` |
| TS-03 | `PHASE 2` sin intake | el mismo fixture en `PHASE 2` | **sigue siendo error** |
| TS-04 | y ahí no se excusa | leer el mensaje en `PHASE 2` | no dice «aún no es exigible» |
| TS-05 | el árbol real | `npm run verify` | deja de fallar por las cuatro de `EP-026` |

**Dónde viven**: selftest §EP-024 · 4 casos sobre fixture propio.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
