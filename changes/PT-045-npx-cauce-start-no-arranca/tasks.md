# PT-045 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Un subcomando desconocido dice cuál, la versión y la salida | `comando` | mensaje | selftest | `bin/cauce.mjs` | pendiente |
| T2 | Sin subcomando sigue siendo ayuda, con código `0` | — | sin cambios | selftest | `bin/cauce.mjs` | pendiente |
| T3 | `npm start` arranca aquí | — | script | ejecución | `package.json` | pendiente |
| T4 | El manual declara los dos casos | `discovery.md` | dos formas | selftest | `MANUAL.md` · `CASOS-DE-USO.md` | pendiente |
| T5 | Los casos, incluidos los que **no** deben cambiar | `test-scenarios.md` | casos nuevos | `selftest.sh` verde | `tools/selftest.sh` | pendiente |

**Archivos tocados:**

```
bin/cauce.mjs · package.json
docs/methodology/MANUAL.md · CASOS-DE-USO.md · tools/selftest.sh
```

Solapamiento con `PT-046` y `PT-044`: **ninguno**. Es la única de las tres que no toca
`verify-fdge.mjs`.
