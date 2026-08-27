# `PT-166` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | `[n]` está en la lista de prohibidas | buscar la grafía en `LEXICON` §2 | aparece entre los prohibidos |
| TS-02 | la lista se declara incompleta | buscar la declaración | dice que crece por hallazgo |
| TS-03 | ningún documento vigente la usa | `verify-suite` | en verde tras la prohibición |

**Dónde viven**: selftest §EP-024 · 2 casos · `verify-suite` en la corrida.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
