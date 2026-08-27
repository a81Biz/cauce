# `PT-178` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | salir de `PHASE 1` sin intake | `avanzar PT-900 --a 2` sobre fixture | se niega, y nombra la ruta que falta |
| TS-02 | con el intake presente | el mismo comando tras escribirlo | pasa — el bloqueo no es permanente |
| TS-03 | fases posteriores | `avanzar` de `PHASE 2` en adelante | no se ve afectado |
| TS-04 | el lote entero | `verify-fdge` sobre las once tareas | ninguna reporta `FDGE-R01` |

**Dónde viven**: selftest §EP-024 · 3 casos sobre fixture propio.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
