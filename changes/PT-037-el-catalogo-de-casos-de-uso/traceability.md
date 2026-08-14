# PT-037 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Cada caso da entrada, recorrido, fin y que es humano | E1 | selftest.sh - «el catalogo existe» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Cubre las tres formas de empezar | E3 | selftest.sh - «y cubre el proyecto legado» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Cubre el arranque y los tres modos | E4 E5 | selftest.sh - «y el arranque de sesion» - «y los tres modos» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | Los huecos estan declarados | E2 | selftest.sh - «el catalogo declara sus huecos» | salidas/selftest.txt | - | VERIFICADO |
| AC-05 | Cita reglas y no define ninguna | E6 | selftest.sh - «el catalogo tampoco» (define severidades) | salidas/selftest.txt | - | VERIFICADO |

## Lo que estos casos NO prueban

Que el catalogo este **completo**. Comprueban que cubre los casos que sabemos que existen y que
declara los huecos que conocemos; ninguno puede probar que no falte uno que nadie ha pensado. Por
eso el catalogo tiene seccion de huecos y por eso dice que un caso nuevo entra como `PT`.
