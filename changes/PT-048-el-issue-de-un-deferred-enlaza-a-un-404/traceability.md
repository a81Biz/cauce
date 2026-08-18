# PT-048 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El cuerpo de un issue sin directorio no enlaza a el | E1 | selftest.sh - «sin directorio no enlaza» - «y no deja una URL rota» | salidas/selftest.txt · salidas/cuerpos.txt | - | VERIFICADO |
| AC-02 | Dice en su lugar que hay: una allocation aplazada (SUITE-R44) | E2 | selftest.sh - «y cita la regla que lo exime» - «sin enlace, no explica el enlace» | salidas/cuerpos.txt | - | VERIFICADO |
| AC-03 | Con directorio, el enlace sigue igual que hoy | E3 E4 E5 | selftest.sh - «con directorio, el enlace sigue» - «sin el dato, se comporta como hoy» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | Comprobado sobre PT-019 y PT-025 | E5 | tracker abrir --aplicar sobre #26 y #35 | salidas/cuerpos.txt | - | VERIFICADO |

## Lo que NO cubre

Que el issue de un aplazado tenga algo que decir. Sigue sin intake ni fases porque SUITE-R44 asi
lo quiere. Lo que cambia es que no mienta.
