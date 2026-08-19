# PT-060 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| La compuerta de presupuesto | PT-059 |
| Validar el árbol al reanudar | PT-056 |
| De dónde sale el coste y su naturaleza | PT-057 · PT-058 |
| Los estados de sesión como estados de **tarea** | — |
| Un ledger de sesiones aparte de `SESSION_LOG.md` | — |
| Reescribir la prosa de `HANDOFF.md` | — |
| Cerrar la sesión automáticamente | — |
| Medir el contexto restante del modelo | — |

**Las tres primeras son el lote, y las tres están hechas.** Esta tarea las **consume**.

**La cuarta lleva `—` y es la corrección a la especificación**: `CHECKPOINTING`,
`HANDOFF_REQUIRED` y `WAITING_NEW_SESSION` son de **sesión**, no de tarea. Durante un handoff la
tarea sigue `IN_PROGRESS` — no cambia nada de la tarea, termina la sesión. Meterlos en
`REGISTRY.json` los haría permanentes bajo `SUITE-R09`, que es append-only: el registro guardaría
para siempre mecánica transitoria de una tarde. Rompería `SESSION ≠ TASK`, que es el principio que
la propia especificación enuncia.

**La quinta:** `SESSION_LOG.md` ya es el ledger de sesiones. Otro sería el mismo hecho en dos
sitios (`SUITE-R38`).

**La sexta es `AC-05` y tiene una razón concreta:** el bloque `ESTADO` de `HANDOFF.md` lleva las
cinco decisiones del firmante, las autorizaciones de `G4` con su cita literal y más de treinta «no
hacer» que salieron de ejecutar. Es **lo único del estado que no se puede derivar**, y es lo más
valioso que tiene. Se le pone el sello y nada más.

**La séptima:** nadie sabe cuándo acaba una sesión salvo quien la cierra. Cerrarla por un tiempo de
inactividad sería inventar un final.

**Y la octava gobierna el lote entero:** el marco no puede medir el contexto restante. `SIN EVALUAR`
existe para poder decirlo.
