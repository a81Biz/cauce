# PT-033 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | CORE.md abre con el estado del tablero, antes que las reglas | E2 E8 | selftest.sh - «el nucleo abre con la consulta» - «la consulta va antes que las fases» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | «Consultado» esta definido: comando, salida, caducidad | E3 E4 E5 | selftest.sh - «y dice el comando exacto» - «consultado esta definido» - «caduca en un turno» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Sin poder consultar, SIN EVALUAR | E6 | selftest.sh - «sin poder consultar, SIN EVALUAR» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | La definicion vive en un solo sitio y se cita | E1 E7 | selftest.sh - «SUITE-R49 existe en RULES» - «PHASES manda citar, no copiar» | salidas/selftest.txt | - | VERIFICADO |

## Un criterio se RETIRO, y la compuerta tuvo razon

El intake pedia «ninguna fase avanza sin que la consulta conste». **No hay forma de que conste**:
el agente ejecuta el comando en su proceso y nada queda escrito. Registrarlo en el repositorio
seria un artefacto que el agente escribe sobre si mismo — la prueba circular que `SUITE-R27`
declara insuficiente para las firmas, y que yo mismo cite contra el merge.

`FDGE-R15` lo rechazo por no tener escenario ni evidencia, exactamente como rechazo el `AC-05` de
`PT-026`. **No es criterio de esta tarea**: es lo que `PT-034` cierra por otra via — si el
tablero es el punto de ENTRADA, no hace falta que la consulta conste porque no hay entrada sin
ella. Retirado del intake en vez de quedarse como un rojo permanente o como un verde falso.
