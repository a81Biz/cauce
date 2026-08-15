# PT-015 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | `verify-patrones` emite `SUITE-R38` | su `fail()` | ID en el mensaje | selftest | `tools/verify-patrones.mjs` | pendiente |
| T2 | `revisar-secretos` emite `FND-R29` | idem | ID en el mensaje | selftest | `tools/revisar-secretos.mjs` | pendiente |
| T3 | `tracker espejo` emite `SUITE-R47` donde decide | idem | ID en el mensaje | selftest | `tools/tracker.mjs` | pendiente |
| T4 | `FDGE-R39`: ningún artefacto de PT en ruta global | rutas | comprobación nueva | selftest | `tools/verify-fdge.mjs` | pendiente |
| T5 | El alcance reducido, escrito en la regla | `SUITE-R26` | nota de alcance | `verify-suite` | `RULES.md` | pendiente |
| T6 | Los casos, incluido el que **no** debe fallar | `test-scenarios.md` | casos nuevos | `selftest.sh` verde | `tools/selftest.sh` | pendiente |
| T7 | Regenerar el núcleo | `RULES` | `CORE.md` | `build-core --check` | `CORE.md` | pendiente |

**Archivos tocados:**

```
docs/methodology/tools/verify-patrones.mjs · revisar-secretos.mjs · tracker.mjs
docs/methodology/tools/verify-fdge.mjs · selftest.sh
docs/methodology/RULES.md · CORE.md
```

Solapamiento con `PT-048` (`tracker.mjs`) y `PT-017` (ninguno): **serializados**.
