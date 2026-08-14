# PT-036 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Lo vivo enlaza la rama de trabajo | E1 | selftest.sh - «lo vivo enlaza la rama de trabajo» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Lo INTEGRATED enlaza la principal | E2 | selftest.sh - «lo integrado enlaza la principal» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Sin saber la rama, cae en la principal | E3 | selftest.sh - «sin saber la rama, cae en la principal» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | El cuerpo dice donde apunta | E4 | selftest.sh - «y el cuerpo dice donde esta» | salidas/selftest.txt | - | VERIFICADO |
| AC-05 | La transicion es automatica | E5 | ejecucion real: el issue #53 paso de tree/main a tree/trabajo en una pasada | salidas/enlace-real.txt | - | VERIFICADO |
