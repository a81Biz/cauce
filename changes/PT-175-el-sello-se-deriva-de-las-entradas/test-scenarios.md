# `PT-175` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | mismo contenido | dos sellos del mismo bloque | idénticos |
| TS-02 | cambia una sección | un carácter distinto | el sello **rompe** |
| TS-03 | cambia una herramienta | el texto de la herramienta | el sello **rompe** |
| TS-04 | `CRLF` vs `LF` | el mismo texto con los dos finales | el **mismo** sello |
| TS-05 | sin sello | `estadoDeBloque(null, …)` | `SIN_SELLAR`, corre entero |
| TS-06 | sello que no casa | sellos distintos | `REABIERTO`, y dice «batería ENTERA» |
| TS-07 | casa pero falló | veredicto `HAY FALLOS` | `SELLADO_EN_ROJO` |
| TS-08 | casa y pasó | veredicto `OK` | `SELLADO` |

**Dónde viven**: selftest §EP-024 · 9 casos `mlib`.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
