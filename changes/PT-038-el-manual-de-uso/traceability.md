# PT-038 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Se lee de principio a fin | E1 | selftest.sh - «el manual existe» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Empieza mandando preguntar al tablero | E2 | selftest.sh - «el manual manda empezar preguntando» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Dice que G4 es de la persona | E3 | selftest.sh - «y dice que G4 es tuya» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | Enlaza al catalogo | E4 | selftest.sh - «el manual enlaza al catalogo» | salidas/selftest.txt | - | VERIFICADO |
| AC-05 | Cita reglas y no define ninguna | E5 | selftest.sh - «el manual no define severidades» | salidas/selftest.txt | - | VERIFICADO |
| AC-06 | Se encuentra desde donde se busca | E6 | ejecucion real sobre los cuatro archivos | salidas/donde-se-encuentra.txt | - | VERIFICADO |

## Lo que estos casos NO prueban

Que el manual **sirva**. Comprueban que existe, que empieza por donde debe y que no duplica
reglas; ninguno puede probar que alguien que llega de cero llegue al final. Eso solo lo dira
alguien que no haya estado aqui mientras se escribia — y no lo hay todavia.
