# `PT-176` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | agrupar por MAYOR | cinco secciones de tres versiones | los bloques salen por su MAYOR |
| TS-02 | lo anterior cierra | versión vigente `13.3.0` | `8` y `9` cerrados |
| TS-03 | el vigente no cierra | el bloque `13` | abierto |
| TS-04 | lo no clasificable | una sección sin versión | sale en `sinBloque` |
| TS-05 | y no entra en ninguno | la misma | ningún bloque la incluye |
| TS-06 | sobre el árbol real | derivar de los commits | 46 de 46 · 95 % sellable |

**Dónde viven**: selftest §EP-024 · 5 casos `mlib`.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
