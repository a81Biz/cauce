# `PT-188` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | un `cd` que falla | subshell con `$WORK` inexistente | corta: nada posterior se ejecuta |
| TS-02 | y no llega a la orden siguiente | el mismo caso, por el reverso | no aparece lo de después |
| TS-03 | la forma prohibida | buscar `( cd "$VAR"` suelto en el arnés | **cero** |
| TS-04 | los cinco protegidos | contar la forma que corta | **cinco** |
| TS-05 | `$WORK` dentro del repositorio | arrancar con la raíz como `$WORK` | se niega a arrancar |
| TS-06 | y cita la regla | leer el mensaje | nombra `SUITE-R06` |
| TS-07 | sin regresión | la batería completa | sigue en verde |
| TS-08 | la raíz se deriva de `git` | buscar `rev-parse --show-toplevel` | no se cuenta por profundidad |
| TS-09 | las dos rutas normalizadas | comparar `git` y `pwd` | iguales, en Windows también |

**Dónde viven**: selftest §EP-024 · 8 casos.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
