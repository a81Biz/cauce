# PT-021 — Escenarios de prueba   `PHASE 4` · `FDGE-R23`

| # | Escenario | Esperado |
|:---|:---|:---|
| E1 | La fila cita su propio lote, en `DONE`, en `G4` | pasa |
| E2 | Igual, en `CLOSED` | pasa |
| E3 | Igual, en `IN_PROGRESS` | **falla** — intención original intacta |
| E4 | Igual, en `DRAFT` | **falla** |
| E5 | `EP-004` completo | sus **cinco** tareas pasan `G4` |

E1 va rojo con el código anterior. Verificado revirtiendo `LOTE_COMPLETO` a `['CLOSED']`: E1
cae y E3 sigue verde, que es la prueba de que el caso mide lo que dice.
