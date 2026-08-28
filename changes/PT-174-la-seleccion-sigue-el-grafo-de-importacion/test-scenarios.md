# `PT-174` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | quien importa directamente | cierre de `patrones.mjs` | aparece `audit.mjs` |
| TS-02 | los indirectos | el mismo cierre | aparece `verify-fdge.mjs` |
| TS-03 | lo que no lo importa | fixture con dos módulos sin relación | **no entra** |
| TS-04 | el objetivo mismo | cierre de `b.mjs` | `b.mjs` está dentro |
| TS-05 | sobre el árbol real | `seccionesAfectadas` con el cierre | 16 → 44 de 46 |

**Dónde viven**: selftest §EP-024 · 4 casos `mlib`.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
