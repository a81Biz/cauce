# PT-066 — Cambios de especificación   `PHASE 4`

`FDGE-R22`.

| Qué | Antes | Después |
|:---|:---|:---|
| Cómo se reconoce una definición | primera línea que **menciona** el ID y casa `HARD\|SOFT` | la línea que **empieza** por el ID, con el patrón de su documento |
| Severidad como criterio | sí — dejaba fuera `CHECK` y las `EXEC-*` en prosa | **no** |
| Cobertura de `regla.mjs` | 150 de 197 correctas | 197 |

**Ninguna regla cambia de texto.** Ningún documento normativo se toca: se arregla quien lee.

`CHANGELOG`: `PATCH`. La versión la fija `EP-017`.
