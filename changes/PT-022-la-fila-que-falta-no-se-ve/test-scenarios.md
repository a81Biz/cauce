# PT-022 — Escenarios de prueba   `PHASE 4` · `FDGE-R23`

| # | Escenario | Esperado |
|:---|:---|:---|
| E1 | Lote en `DONE` sin sección de cierre, en `G4` | **falla** |
| E2 | Sección presente pero vacía | **falla** |
| E3 | Una fila sin resolver, en `G4` | **falla** |
| E4 | La misma, con el lote abierto | solo avisa |
| E5 | Filas resueltas con `HECHO` y con un identificador | pasa |
| E6 | Lote `CLOSED` sin sección | **exento** — no se le exige |
| E7 | Una fila cita su lote y el lote no declara cierre | **falla** (`SUITE-R44`) |
| E8 | La misma, con el lote declarándolo | pasa |

Inversa: desactivada `checkCierreDeLote()`, caen E1, E2, E3 y E4 — y solo esos.
