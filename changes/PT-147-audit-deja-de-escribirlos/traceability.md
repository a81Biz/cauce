# PT-147 · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | No queda ningún literal de componente en `audit.mjs`, ni el ternario | TS-04 | — | — | n/a | `PENDIENTE` |
| AC-02 | Las cifras de los **cuatro ya auditados** no cambian | TS-01 | — | — | n/a | `PENDIENTE` |
| AC-03 | `FIDE` entra con su rango; `FPGE` entra como `SIN_EVALUAR` | TS-02 · TS-03 | — | — | n/a | `PENDIENTE` |
| AC-04 | Un componente con rango al que `audit` no mire **se nombra** | TS-05 | — | — | n/a | `PENDIENTE` |

**`AC-03` es el único que cambia comportamiento, y es el objetivo.** Dos de los seis componentes
no tenían auditadas sus fases y **nunca lo dijeron**: el bucle recorría un mapa escrito a mano, y
lo que no estaba en él no aparecía — ni en rojo ni en amarillo.

**`AC-04` es el que separa la tarea de un parche.** Meter a `FIDE` y `FPGE` los arregla a ellos;
la comprobación arregla la clase, y evita que el séptimo componente —`DICTAMEN`, `EP-023`— se
quede fuera por el mismo mecanismo.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | Las cifras de los cuatro ya auditados | TS-01 | `PENDIENTE` |
| RC-02 | `cubre` reconoce las tres formas de declarar una fase | TS-06 | `PENDIENTE` |
| RC-03 | `FIDE` y `FPGE` aparecen, **de forma distinta** | TS-02 · TS-03 | `PENDIENTE` |
| RC-04 | El hueco no puede volver | TS-05 | `PENDIENTE` |

## Lo que esta tarea **no** establece

**Que `FIDE` salga limpio.** Entra en la auditoría por primera vez y puede salir en rojo: sería un
**hallazgo**, no un fallo de la tarea. Está declarado `OUT` en `scope.md` §8 — un `REFACTOR` que
empieza a corregir lo que destapa deja de ser un `REFACTOR`.
