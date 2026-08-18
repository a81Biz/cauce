# PT-016 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `RULES.md` · `SUITE-R08` | **Ampliada**: toda allocation de tipo `PT` **viva** declara `phase`. Falta ⇒ error. Un `EP` está exento |
| `PHASES.md` · `FDGE-Prompts.md` | La citan (`SUITE-R20`) |
| `CORE.md` | Regenerado |
| `INTAKE/templates/` | Las cuatro plantillas de tarea traen `phase`; `EPIC-INTAKE.md` **no** |
| `tools/patrones.mjs` | `ESTADOS_TERMINALES` exportada con su contrato (`SUITE-R38`) |
| `tools/verify-fdge.mjs` | La exigencia, y las dos copias de la lista sustituidas |
| `tools/migrate.mjs` | El texto dice que desde esta versión falla |
| `CHANGELOG.md` | **`MAJOR`** con guía de migración — lo resuelve el cierre del lote (`SUITE-R45`) |

**Rompe compatibilidad**: un proyecto instalado con PTs vivos sin `phase` pasa de verde a rojo.
Es el objetivo de la tarea, y por eso el lote sube `MAJOR` y la guía es obligatoria (`SUITE-R19`).

**No cambia:** la precedencia de `PT-004`, `RULE-06` —no se adivina nada— ni el trato de los `EP`.
