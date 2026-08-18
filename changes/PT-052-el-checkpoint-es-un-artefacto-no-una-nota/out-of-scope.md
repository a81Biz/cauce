# PT-052 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Escribir el checkpoint en **cada transición** | PT-053 |
| Proyectarlo a `cauce/<usuario>` | PT-054 |
| Validar que el **árbol corresponda** al SHA (`STATE_MISMATCH`) | EP-015 |
| El presupuesto de sesión y `BLOCKED_BY_CONTEXT` | EP-015 |
| Campos que solo pueda rellenar la memoria: `decisions`, `blockers` | — |
| Un ledger append-only de checkpoints | — |
| Sustituir `HANDOFF.md` | — |
| La entrada de `CHANGELOG` del lote y el número de versión | EP-014 |

**La quinta fila lleva `—` y es la decisión que gobierna el diseño entero.** La especificación de
la que sale `EP-015` los pide en su §5 y los tres suenan útiles. Ninguno se deriva de nada: son
campos que solo puede rellenar la memoria del agente, y un campo así **va a mentir con la
autoridad de un dato estructurado**, que es peor que la prosa. No se aplazan porque no son trabajo
pendiente: son una forma que este marco no admite.

La sexta y la séptima llevan `—` por lo mismo que la estrategia razonó: `SUITE-R09` haría
irreversible lo que es mecánica de sesión, y `HANDOFF.md` responde por el proyecto mientras el
checkpoint responde por la tarea. **No compiten.**
