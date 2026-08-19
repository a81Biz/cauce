# PT-065 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Reproducir el conflicto con dos sesiones | ejecución | conflicto en cada merge | ejecución | — | hecha en `PHASE 2` |
| T2 | `SESSION-<usuario>.json` en `LEXICON` | `LEX-R21` | §6.2 y §6.5e | `verify-suite` | `LEXICON.md` | pendiente |
| T3 | `archivoSesion`, pura | `design` | función | selftest | `tools/patrones.mjs` | pendiente |
| T4 | …y sin persona, `SESSION.json` | T3 | — | selftest | `tools/patrones.mjs` | pendiente |
| T5 | `sesionesAjenas`, pura | `design` | función | selftest | `tools/patrones.mjs` | pendiente |
| T6 | `sesion abrir` escribe el de su persona | T3 | — | selftest | `tools/tracker.mjs` | pendiente |
| T7 | …y al leer busca el propio, con caída a `SESSION.json` | T3 | — | selftest | `tools/tracker.mjs` | pendiente |
| T8 | Las ajenas **se ven** | T5 | texto | selftest | `tools/tracker.mjs` | pendiente |
| T9 | `HANDOFF.md` sigue intacto | — | — | selftest | `tools/selftest.sh` | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/patrones.mjs · tools/tracker.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `patrones.mjs` y `tracker.mjs` los tocaron las cuatro tareas anteriores
del lote, **las cuatro integradas**. **Ninguna función de `PT-060` se modifica**: `sesionDe` y
`handoffDeSesion` son puras y reciben la marca. Es la última tarea de `EP-016`.
