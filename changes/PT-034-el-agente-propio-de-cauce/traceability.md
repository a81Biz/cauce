# PT-034 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Arrancar ES consultar el tablero | E2 E3 E4 | selftest.sh - «cauce start existe» - «y sale en la ayuda como primero» - «el arranque llama al tablero» | salidas/arranque-real.txt | - | VERIFICADO |
| AC-02 | Sin plataforma degrada de forma DECLARADA | E6 | selftest.sh - «sin plataforma lo DECLARA» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Usa la definicion de PT-033, no escribe la suya | E5 | selftest.sh - «y cita la definicion, no la copia» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | El marco sigue siendo usable sin el agente | E9 | selftest.sh - «y el nucleo sigue siendo obligatorio» | salidas/selftest.txt | - | VERIFICADO |
| AC-05 | No automatiza ninguna compuerta | E8 | selftest.sh - «el arranque no resuelve compuertas» | salidas/selftest.txt | - | VERIFICADO |

## Lo que sigue sin cerrarse, y se dice

Quien no ejecute `cauce start` no ve nada. Esto **no impide arrancar de otra forma**: hace que la
forma correcta sea la que el paquete ofrece, documenta y pone primera. La diferencia con
`SUITE-R48` y `SUITE-R49` es que aqui el orden esta EN EL CODIGO, no en un texto que alguien
tiene que respetar — pero no es un candado, y llamarlo candado seria mentir.
