# PT-031 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Cambio |
|:---|:---|
| `EXECUTION-MODES.md` | **`EXEC-R08` nueva**, `HARD`. Y la fila de `G1` deja de declarar la firma por lote como algo de `AUTONOMOUS` |
| `CORE.md` | Regenerado |

`RULES.md` **no** cambia: `verify-suite` rechaza definir una regla `EXEC-*` ahí con severidad, y
tiene razón — cada prefijo tiene su documento propietario (`LEX-R22`).

**`MINOR`**: la corrección de la matriz no quita nada a nadie; `INTAKE-R08` ya valía en los tres.
