# PT-048 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | El contexto lleva si el directorio existe | `contextoCuerpo` | dato nuevo | selftest | `tools/tracker.mjs` | pendiente |
| T2 | Sin directorio, el cuerpo dice qué hay en vez de enlazar | `cuerpoDeIssue` | texto | selftest | `tools/tracker.mjs` | pendiente |
| T3 | Con directorio, idéntico a hoy | idem | sin cambios | selftest | `tools/tracker.mjs` | pendiente |
| T4 | Sin el dato, el comportamiento es el de hoy | idem | `=== false` | selftest | `tools/tracker.mjs` | pendiente |
| T5 | Los casos, incluidos los dos que **no** deben cambiar | `test-scenarios.md` | casos nuevos | `selftest.sh` verde | `tools/selftest.sh` | pendiente |
| T6 | Resincronizar los cuerpos de `PT-019` y `PT-025` | `tracker abrir --aplicar` | dos cuerpos | ejecución | — | pendiente |

**Archivos tocados:**

```
docs/methodology/tools/tracker.mjs · tools/selftest.sh
```

Solapamiento: `tracker.mjs` con `PT-015`, ya `INTEGRATED`. Sin conflicto.
