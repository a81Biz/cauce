# `PT-165` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | no quedan rangos a mano | buscar literales de fase en `build-core` | el mapa se compone con `fasesDe()` |
| TS-02 | el mapa publicado coincide | contrastar `CORE.md` con el contrato | los seis componentes cuadran |
| TS-03 | `audit` lo vigila | `audit.mjs` | dice «6 de 6» y falla si deja de cuadrar |
| TS-04 | la suite sigue coherente | `verify-suite` tras regenerar | sin errores de coherencia |

**Dónde viven**: selftest §EP-024 · 2 casos · `audit` y `verify-suite` en la corrida.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
