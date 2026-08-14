# PT-039 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Define peticion por su condicion de terminado | E1 E3 | selftest.sh - «SUITE-R52 existe en RULES» - «define peticion por su cierre» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | El nucleo abre preguntando, ANTES del tablero | E2 E7 | selftest.sh - «el nucleo abre preguntando que es» - «y va antes de consultar el tablero» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Se DECLARA y se puede corregir | E4 | selftest.sh - «y dice que se DECLARA» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | Una conversacion no abre allocation | E5 E6 | selftest.sh - «una conversacion no abre allocation» - «PHASES lo declara» | salidas/selftest.txt | - | VERIFICADO |
| AC-05 | siguiente EP-NNN deja de tomar el ID como ruta | E8 | selftest.sh - «un EP-NNN no es una ruta» + ejecucion real | salidas/defecto-real.txt | - | VERIFICADO |

## AC-05 no estaba en el plan

Aparecio EJECUTANDO `tracker siguiente EP-011` para escribir este intake — lo primero que
`SUITE-R49` obliga a hacer y que no se habia hecho en toda la sesion. Se corrige aqui porque
bloqueaba el trabajo, y queda anotado como lo que es: la prueba de que el diagnostico del lote
era correcto.
