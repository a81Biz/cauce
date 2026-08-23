# `PT-131` — Tareas atómicas   `PHASE 4`

| # | Qué | Archivos | Verifica |
|:--|:---|:---|:---|
| `PT-131.1` | `selladoEnTag` en `patrones.mjs`, pura y con las dos condiciones | `tools/patrones.mjs` | casos nuevos |
| `PT-131.2` | `verify-fdge` y `tracker sellar` la usan; se borran las dos copias de la lectura del tag | `tools/verify-fdge.mjs` · `tools/tracker.mjs` | `--gate G2` deja de bloquear |
| `PT-131.3` | Los casos: el positivo, la **inversa** que prueba que sigue bloqueando, y el `SIN EVALUAR` | `tools/selftest.sh` | `npm run selftest` |

**Orden:** `.1 → .2 → .3`. `.2` no puede ir antes que `.1` —usaría una función que no existe— y
`.3` prueba lo que las dos construyen.

**Solapamiento con el lote:** `tools/tracker.mjs` lo tocan once de las diecinueve tareas de
`EP-020`. `PT-131` va **primera**, así que no hereda conflicto de ninguna.
