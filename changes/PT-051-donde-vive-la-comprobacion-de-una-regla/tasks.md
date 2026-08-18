# PT-051 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir qué sabe hoy y qué calla | ejecución | 95 reglas · 213 emisiones | ejecución | — | hecha en `PHASE 2` |
| T2 | `fallosPosibles` conserva cada emisión con su línea | `regla.mjs:66` | `emisiones[]` | selftest | `tools/regla.mjs` | pendiente |
| T3 | La forma pública no cambia: se **deriva** | T2 | compatibilidad | selftest | `tools/regla.mjs` | pendiente |
| T4 | `--donde` enumera **todas** las emisiones | T2 | bandera | selftest | `tools/regla.mjs` | pendiente |
| T5 | Sin verificador lo **dice**, no devuelve vacío | T4 | mensaje | selftest | `tools/regla.mjs` | pendiente |
| T6 | La línea sale de `m.index`, con caso que lo distingue | T2 | — | selftest | `tools/selftest.sh` | pendiente |

**Archivos tocados:** `docs/methodology/tools/regla.mjs` · `docs/methodology/tools/selftest.sh`

Solapamiento (`FDGE-R40`): `selftest.sh` con `PT-049` y `PT-050`, los dos **integrados**. Sin
conflicto. `regla.mjs` no lo toca ninguna otra tarea del lote.
