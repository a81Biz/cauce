# PT-052 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir dónde vive hoy el estado en curso | ejecución | tres huecos | ejecución | — | hecha en `PHASE 2` |
| T2 | El nombre y el contrato, en `LEXICON` **antes** que en el código | `LEX-R21` | entrada nueva | `verify-suite` | `LEXICON.md` | pendiente |
| T3 | `tracker checkpoint PT-NNN` lo escribe, todo derivado | T2 | acción nueva | selftest | `tools/tracker.mjs` | pendiente |
| T4 | Se **sobrescribe**: uno, no N | T3 | — | selftest | `tools/tracker.mjs` | pendiente |
| T5 | `verify-fdge` exige que el SHA sea **alcanzable** | T3 | comprobación | selftest | `tools/verify-fdge.mjs` | pendiente |
| T6 | Ningún campo se rellena de memoria | T3 | — | selftest | — | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/tracker.mjs · tools/verify-fdge.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `tracker.mjs` con `PT-053` y `PT-054`, que **no han empezado** y van
detrás por decisión del lote. `LEXICON.md` no lo toca ninguna otra tarea de `EP-014`.
