# `PT-153` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | la rama de un lote con usuario | `ramaDeLote('EP-022', slug, 'Alberto Martinez')` | `chore/alberto-martinez/EP-022-los-componentes-se-declaran` |
| TS-02 | la rama de un lote sin usuario | `ramaDeLote` sin el tercer argumento | dos niveles, sin inventar usuario |
| TS-03 | lo que no es un lote | `ramaDeLote('PT-153', …)` | `null` — fuera de su objeto no inventa nada |
| TS-04 | un lote sin slug | `ramaDeLote('EP-022', null, …)` | `null`, no una rama a medias |
| TS-05 | el barrido de `LEX-R27` sobre el registro | `verify-fdge` sobre cualquier PT | cuenta los 17 históricos y los declara |
| TS-06 | la puerta hacia adelante | `rigeDesde('LEX-R27', v)` | falso antes de `13.2.0`, cierto desde ella |

**Dónde viven**: selftest §EP-024 · 4 casos `mlib` · `verify-fdge` en la corrida.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
