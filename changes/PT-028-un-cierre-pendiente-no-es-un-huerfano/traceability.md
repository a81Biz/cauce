# PT-028 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un issue de allocation terminal es cierre pendiente | E1 | selftest.sh - «un issue de allocation terminal no es huerfano» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Y no bloquea | E2 | selftest.sh - «y se marca para no bloquear» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | El huerfano de verdad sigue bloqueando | E4 E5 | selftest.sh - «el huerfano de verdad sigue siendolo» - «y ese si bloquea» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | El mensaje dice que hacer y cuando | E3 | selftest.sh - «el mensaje dice cuando cerrarlo» | salidas/selftest.txt | - | VERIFICADO |
