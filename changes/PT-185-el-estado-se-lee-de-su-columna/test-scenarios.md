# `PT-185` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | título que nombra un estado | fila con `DONE` en columna y `DRAFT` en título | gana la columna |
| TS-02 | la columna diverge de verdad | fila con `DRAFT` en columna | **sigue** saliendo `DRAFT` |
| TS-03 | línea que no es tabla | prosa con un estado dentro | se evalúa con el barrido anterior |
| TS-04 | línea sin ningún estado | prosa sin estados | se dice que no hay, no se inventa |
| TS-05 | el árbol real | `verify-fdge --gate G4 PT-162` | deja de fallar sin tocar su título |

**Dónde viven**: selftest §EP-024 · 4 casos.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
