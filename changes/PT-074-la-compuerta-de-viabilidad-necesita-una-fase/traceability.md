# PT-074 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La viabilidad tiene una fase que la invoca | E1 | | | - | PENDIENTE |
| AC-02 | El veredicto queda registrado y se puede auditar | E2 · E3 · E4 | | | - | PENDIENTE |
| AC-03 | `MARGINAL` y `UNSAFE` tienen consecuencia observable | E5 · E6 | | | - | PENDIENTE |
| AC-04 | `viabilidad` lee la marca de sesión correcta, y los quince se re-registran | E9 | | | - | PENDIENTE |
| AC-05 | Algo falla si la compuerta se queda sin invocación | E1 · E7 | | | - | PENDIENTE |
| AC-06 | El veredicto **se espeja** en la plataforma | E2 · E8 | | | - | PENDIENTE |

**`AC-01` y `AC-05` ya los cerró `PT-075`** y sus casos existen y pasan. Aquí se citan porque
son criterios de esta tarea y no se dan por hechos sin comprobarlos.

**`AC-04` lo cerró `PT-068`**: `sesion` y `viabilidad` ya declaran el mismo `desde`. Lo que
queda de él aquí es **rehacer los quince veredictos** que se registraron contra la base vieja.
