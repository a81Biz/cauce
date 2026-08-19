# PT-059 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir si el presupuesto disponible existe | ejecución | no existe: `SIN EVALUAR` siempre | ejecución | — | hecha en `PHASE 2` |
| T2 | Los veredictos y `BLOCKED_BY_CONTEXT` en `LEXICON` | `LEX-R21` | §4 y §6.5d | `verify-suite` | `LEXICON.md` | pendiente |
| T3 | `VEREDICTOS`, `HOLGURA`, `BLOCKED_BY_CONTEXT` | `design` | constantes | selftest | `tools/patrones.mjs` | pendiente |
| T4 | `viabilidadDe`, pura, con motivo siempre | T3 | función | selftest | `tools/patrones.mjs` | pendiente |
| T5 | `SIN EVALUAR` ⇒ `MARGINAL`, nunca `SAFE` ni `UNSAFE` | T4 | — | selftest | `tools/patrones.mjs` | pendiente |
| T6 | `AC-06`: «nunca cabría» se decide **antes** que todo | T4 | — | selftest | `tools/patrones.mjs` | pendiente |
| T7 | `tracker viabilidad PT-NNN` | T4 | acción | selftest | `tools/tracker.mjs` | pendiente |
| T8 | El precedente y el techo, derivados de git | T7 | — | selftest | `tools/tracker.mjs` | pendiente |
| T9 | `BLOCKED_BY_CONTEXT` es **vivo**, no terminal | T3 | — | selftest | `tools/tracker.mjs` · `tools/verify-fdge.mjs` | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/patrones.mjs · tools/tracker.mjs ·
tools/verify-fdge.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `patrones.mjs` y `tracker.mjs` los tocó `PT-058` y `PT-057`, **ya
integradas**. `viabilidadDe` **consume** `cifra()` y `costeDe` sin modificarlos. `PT-060` no ha
empezado.
