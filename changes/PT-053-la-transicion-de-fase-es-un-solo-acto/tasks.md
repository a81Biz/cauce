# PT-053 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Contar las transiciones y por qué falla siempre igual | ejecución | 107 · ~535 actos | ejecución | — | hecha en `PHASE 2` |
| T2 | Las cinco validaciones, **antes** de tocar nada | `queSigue` | guardas | selftest | `tools/tracker.mjs` | pendiente |
| T3 | Los cinco actos, en orden de reversibilidad | T2 | acción nueva | selftest | `tools/tracker.mjs` | pendiente |
| T4 | El respaldo y la **restauración** si algo falla | T3 | atomicidad | selftest | `tools/tracker.mjs` | pendiente |
| T5 | Restaurar un archivo que **no existía** lo borra | T4 | — | selftest | `tools/tracker.mjs` | pendiente |
| T6 | `avanzar` en `LEXICON`, con las demás acciones | `LEX-R21` | entrada | `verify-suite` | `LEXICON.md` | pendiente |
| T7 | `--ver` valida y no escribe | T2 | bandera | selftest | `tools/tracker.mjs` | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/tracker.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `tracker.mjs` con `PT-052`, **integrado**, y con `PT-054`, que va
**detrás** por decisión del lote. `LEXICON.md` con `PT-052`, también integrado. Sin conflicto.
