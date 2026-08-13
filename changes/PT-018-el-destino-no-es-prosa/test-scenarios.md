# PT-018 — Escenarios de prueba   `PHASE 4` · `FDGE-R23`

| # | Escenario | Esperado |
|:---|:---|:---|
| E1 | Destino `—` | no aplaza · sin aviso |
| E2 | Destino en prosa («queda para más adelante») | **falla**: antes pasaba por la lista de palabras |
| E3 | Otra prosa cualquiera, sin palabra reconocible | **falla**: antes pasaba por no reconocerse |
| E4 | Cita un hermano del mismo epic | sin aviso |
| E5 | Cita el propio epic, abierto | **falla**: es la promesa que falló |
| E6 | Cita el propio epic, `CLOSED` | sin aviso |
| E7 | Cita una allocation cualquiera que no reconoce el origen | **falla** |
| E8 | Cita un `DEFERRED` cuyo `origin` menciona este PT | sin aviso |
| E9 | Celda vacía | **falla** |

E2, E3, E5 y E7 son los que **no existían** antes de este PT: los cuatro pasaban.
