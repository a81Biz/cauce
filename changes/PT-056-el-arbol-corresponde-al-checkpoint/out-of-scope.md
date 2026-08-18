# PT-056 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| El coste de una tarea derivado del historial | PT-057 |
| `MEDIDO` / `ESTIMADO` / `SIN EVALUAR` | PT-058 |
| La compuerta de presupuesto y `BLOCKED_BY_CONTEXT` | PT-059 |
| `SESSION.json` y el handoff derivado | PT-060 |
| Reparar automáticamente una discrepancia | — |
| Comparar el **contenido** de los archivos | — |
| Convertir `STATE_MISMATCH` en un `status` del registro | — |
| Un ledger de checkpoints aparte de `SESSION_LOG.md` | — |

**Las cuatro primeras son el resto del lote**, y su orden lo fijó el firmante. Ninguna se adelanta.

**La quinta lleva `—` porque no se va a hacer.** Reescribir el checkpoint al detectar el desfase
borraría **la única prueba de que hubo divergencia**, y decidir si el árbol o la foto es lo bueno
es exactamente lo que `SUITE-R06` reserva a una persona. La salida **propone** el comando; no lo
ejecuta.

**La sexta también, y con su coste medido:** comparar contenido archivo a archivo diría *qué*
cambió con más detalle y obligaría a leer el árbol entero en cada arranque — el gasto que este lote
existe para reducir. Su límite está declarado en `test-scenarios.md`.

**La séptima es la separación que el firmante fijó**, aplicada aquí: `STATE_MISMATCH` es la
**condición que la comprobación reporta**, no un estado de la tarea. Durante una discrepancia la
tarea sigue `IN_PROGRESS`; lo que está mal es la correspondencia.

**Y la octava:** `SESSION_LOG.md` ya es el ledger de sesiones, y `SUITE-R09` haría permanente lo
que es mecánica transitoria.
