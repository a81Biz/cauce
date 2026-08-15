# PT-029 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Los pares conocidos están enumerados con su evidencia | E1-E5 | `selftest.sh` · 9 casos | `evidence/PT-029/salidas/compuertas.txt` | - | ✓ |
| AC-02 | Se busca de forma repetible, no por memoria | E6-E7 | `selftest.sh:EXIGIBLE_DESDE se DERIVA de la fase` | `evidence/PT-029/salidas/busqueda.txt` | - | ✓ |
| AC-03 | Lo que no se puede detectar mecánicamente se declara (`RULE-06`) | E8-E9 | `selftest.sh` · el caso de forma | `evidence/PT-029/salidas/inversa.txt` | - | ✓ |
| AC-04 | Lo que aparezca y no quepa se aplaza con su issue (`SUITE-R44`) | E1-E5 | `selftest.sh:G4 exige la entrada de HISTORY` | `evidence/PT-029/salidas/compuertas.txt` | - | ✓ |

## Declarado NO verificado   `RULE-06`

| Afirmación | Por qué no se verifica | Dónde queda |
|:---|:---|:---|
| Que se detecten los choques entre reglas **en general** | Este método cruza fases con compuertas y encuentra **una** familia. De los **seis** casos conocidos, **cinco** son de otra: dos reglas que se contradicen sin fases de por medio | [`self-review.md`](self-review.md) |
| Que `E8` cace toda forma de la misma intención | Caza la forma **literal**. `if (gate !== undefined)` expresa lo mismo y no cae. Ampliar la lista es perseguir el idioma | [`test-scenarios.md`](test-scenarios.md) |
