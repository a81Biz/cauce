# PT-031 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Ningun modo exime de un artefacto, una regla o una evidencia | E4 E5 E6 | selftest.sh - «la matriz ya no da ventajas por modo» - «verify-suite lo comprueba» - «y con vocabulario cerrado, no prosa» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | La unica diferencia declarada es quien resuelve | E1 E2 | selftest.sh - «EXEC-R08 existe en su documento» - «y llega al nucleo» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | G4 sigue siendo humana en los tres | E3 | selftest.sh - «G4 humana en los tres modos» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | Si un modo declarara una exencion, falla y dice cual | E4 | ejecucion real: la comprobacion fallo sobre el documento tal como estaba, sin fixture | salidas/hallazgo-real.txt | - | VERIFICADO |

## AC-04 se verifico sobre el caso de verdad

No hizo falta fabricar un fixture: la comprobacion fallo en su PRIMERA ejecucion, senalando la
fila de `G1`. Es la mejor evidencia posible de que el aserto mide algo.
