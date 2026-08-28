# `PT-173` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | una sección sola | `--seccion "H · lotes"` | `OK · 8 casos`, su propia cuenta |
| TS-02 | otra distinta | `--seccion "A · casos"` | `OK · 5 casos` |
| TS-03 | patrón que no casa | `--seccion` con un nombre inventado | **rojo**, no verde por vacío |
| TS-04 | la que se daba por dependiente | `--seccion "D · migración"` | `OK · 49 casos`, sola |
| TS-05 | el barrido de las 46 | cada una aislada | 46 en verde |
| TS-06 | la suma cuadra | sumar los casos aislados | 1882 = la corrida completa |

**Dónde viven**: selftest §EP-024 · 4 casos.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
