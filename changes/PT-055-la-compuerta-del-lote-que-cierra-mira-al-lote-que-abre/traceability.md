# PT-055 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `--gate G4 EP-A` con `EP-B` abierto y en rojo NO falla por `EP-B` | E1 | | | - | PENDIENTE |
| AC-02 | `--gate G4 EP-A` SÍ falla si `EP-A` tiene filas sin resolver | E2 | | | - | PENDIENTE |
| AC-03 | `verify-fdge` acepta `EP-NNN` como argumento posicional | E3 | | | - | PENDIENTE |
| AC-04 | `--gate G4 PT-NNN` evalúa el lote de ese PT, no todos | E4 | | | - | PENDIENTE |
| AC-05 | `--gate G4` sin objetivo conserva el alcance de hoy: todos | E5 | | | - | PENDIENTE |
| AC-06 | Un lote `DONE` exige sus filas resueltas sin `--gate` | E6 | | | - | PENDIENTE |

`TS` remite a los escenarios de [test-scenarios.md](test-scenarios.md).

Las columnas `Test` y `Evidencia` se rellenan en `PHASE 6`; `Estado`, en `PHASE 7`.

## La comprobación inversa no es un AC, y por eso se anota aquí

`E1`, `E3` y `E4` deben **caer** con el arreglo revertido; `E2`, `E5` y `E6` deben **seguir
pasando**, porque no dependen de él. Un caso que pase en las dos direcciones no prueba nada
(`PT-050`). La evidencia de las dos direcciones va en `PHASE 6`.
