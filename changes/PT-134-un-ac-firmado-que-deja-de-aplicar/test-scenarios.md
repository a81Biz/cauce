# Escenarios de test — `PT-134`   `PHASE 4`

| TS | Escenario | Cierra |
|:---|:---|:---|
| `TS-01` | `CAÍDO` con motivo no es Orphan Criterion | AC-01 |
| `TS-02` | …y no se le exige escenario de test | AC-01 |
| `TS-03` | `CAÍDO` sin motivo falla | AC-03 |
| `TS-04` | …y un motivo de dos palabras tampoco vale | AC-03 |
| `TS-05` | `CAÍDO` y `verified: true` a la vez falla | AC-02 |
| `TS-06` | **Sin** la palabra, sigue siendo Orphan Criterion | AC-01 |

## `TS-06` es el que hace válidos a los demás

Sin el negativo, una comprobación que aceptase **todo** también pasaría `TS-01`. Es el mismo
criterio con que `PT-127` justificó su caso negativo.
