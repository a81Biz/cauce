# PT-017 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Restar los dos directorios | los dos caminos ya resueltos | lista derivada | selftest | `tools/migrate.mjs` | pendiente |
| T2 | Sin `tools/` en el destino, se dice la suite entera | idem | mensaje | selftest | `tools/migrate.mjs` | pendiente |
| T3 | Sin poder leer el paquete, se **dice** | idem | mensaje | selftest | `tools/migrate.mjs` | pendiente |
| T4 | Destino al día ⇒ no se emite fila | idem | silencio | selftest | `tools/migrate.mjs` | pendiente |
| T5 | La frase `lo que llega nuevo` se conserva | `PT-043` | acoplamiento vivo | selftest | `tools/migrate.mjs` | pendiente |
| T6 | Los casos | `test-scenarios.md` | casos nuevos | `selftest.sh` verde | `tools/selftest.sh` | pendiente |

**Archivos tocados:** `docs/methodology/tools/migrate.mjs` · `tools/selftest.sh`

Solapamiento: `migrate.mjs` con `PT-016`, ya `INTEGRATED`. Sin conflicto.
