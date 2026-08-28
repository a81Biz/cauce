# `PT-189` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | `UNSAFE` en `PHASE 8` | fixture con la tarea hecha | **avisa**, no falla |
| TS-02 | el aviso explica | leer el mensaje | dice que el trabajo ya está hecho |
| TS-03 | `UNSAFE` en `PHASE 6` | el mismo fixture en `PHASE 6` | **sigue siendo error** |
| TS-04 | y ahí no se excusa | leer el mensaje en `PHASE 6` | no dice «ya está hecho» |

**Dónde viven**: selftest §EP-024 · 4 casos sobre fixture propio.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
