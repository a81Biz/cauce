# PT-046 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Existe una forma declarada de corregir una entrada sin editarla | E1 E2 E3 E4 E5 | selftest.sh - «y una CORRIGE la desbloquea» - «la CORRIGE no cuenta como segunda» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | SUITE-R09 no se relaja: la original sigue intacta y auditable | E10 E11 | selftest.sh - «sin CORRIGE nada cambia» + git diff --numstat | salidas/git-intactas.txt | - | VERIFICADO |
| AC-03 | G4 lee la correccion cuando existe y la original cuando no | E6 E7 E9 | selftest.sh - «tambien aporta Estructural» - «con dos correcciones manda la ultima» | salidas/cuatro-compuertas.txt · salidas/inversa.txt | - | VERIFICADO |
| AC-04 | Una CORRIGE sin original falla, y lo dice | E8 | selftest.sh - «una CORRIGE huerfana falla» | salidas/selftest.txt | - | VERIFICADO |

> `Test` y `Evidencia` se completan en `PHASE 6` (`FDGE-R15`). Aqui van ya `AC` y `TS`.
