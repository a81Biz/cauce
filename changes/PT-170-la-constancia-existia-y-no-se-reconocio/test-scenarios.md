# `PT-170` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | campo con nombre | `Autoriza: Alberto Martinez` | se reconoce, sea cual sea el encabezado |
| TS-02 | sin campo, por encabezado | encabezado que anuncia autorización | sigue reconociéndose — no hay regresión |
| TS-03 | campo vacío | `Autoriza:` | no cuenta |
| TS-04 | campo con marcador | `Autoriza: [nombre]` | no cuenta |

**Dónde viven**: selftest §EP-024 · 4 casos `mlib`.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
