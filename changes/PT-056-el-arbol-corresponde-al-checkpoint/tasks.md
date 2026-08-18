# PT-056 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir qué campos pueden sostener una correspondencia | ejecución | `sha` y `rama`; los demás no | ejecución | — | hecha en `PHASE 2` |
| T2 | `estadoDelArbol`, pura y exportada | `discovery` | función nueva | selftest | `tools/tracker.mjs` | pendiente |
| T3 | Los tres resultados: `true`, `false`, `null` | T2 | — | selftest | `tools/tracker.mjs` | pendiente |
| T4 | `tracker siguiente` **bloquea** al retomar | T2 | bloqueo | selftest | `tools/tracker.mjs` | pendiente |
| T5 | El mensaje dice **cuál** es y **propone** sin ejecutar | T4 | texto | selftest | `tools/tracker.mjs` | pendiente |
| T6 | `verify-fdge` **falla** con discrepancia | T2 | comprobación | selftest | `tools/verify-fdge.mjs` | pendiente |
| T7 | `LEX-R26` y `STATE_MISMATCH` en `LEXICON` | `LEX-R21` | cláusula y nombre | `verify-suite` | `LEXICON.md` | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/tracker.mjs · tools/verify-fdge.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `tracker.mjs` con `PT-057`…`PT-060`, que **no han empezado** y van
detrás por decisión del lote. `verify-fdge.mjs` con `PT-059`, también detrás.
