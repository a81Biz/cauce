# PT-042 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Instalar EMPIEZA por leer, no por copiar | E2 | selftest.sh - «instalar remite al manual» | salidas/arranque.txt | - | VERIFICADO |
| AC-02 | El arranque remite al manual ademas de al tablero | E3 E7 | selftest.sh - «y el arranque lo pone antes» - «el manual va antes que el nucleo» | salidas/arranque.txt | - | VERIFICADO |
| AC-03 | El agente puede consultar su manual por tema | E1 E6 | selftest.sh - «SUITE-R54 existe en RULES» - «PHASES declara el manual» | salidas/arranque.txt | - | VERIFICADO |
| AC-04 | El marco sigue usable si el manual no esta | E4 E5 | selftest.sh - «sin manual lo DICE» - «y el marco sigue siendo usable» | salidas/selftest.txt | - | VERIFICADO |

## Lo que NO logra, y estaba dicho antes de empezar

**No obliga a leer el manual.** No es comprobable: cualquier confirmacion seria el agente
afirmando sobre si mismo, la prueba circular que `SUITE-R27` declara insuficiente. Lo que se
logra es que no se pueda arrancar sin que se ponga delante, y que se pueda consultar. Es menos, y
la regla lo dice en su propio texto en vez de dejarlo entender.
