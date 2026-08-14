# PT-044 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Comparar `phase` y `status` del YAML con el registro, y reportar | `RE_PHASE_YAML` · `alloc` | aviso, error en `G4` | selftest | `tools/verify-fdge.mjs` | pendiente |
| T2 | Comparar el estado del índice con el registro | `checkIndex` | aviso, error en `G4` | selftest | `tools/verify-fdge.mjs` | pendiente |
| T3 | Falta un lado ⇒ no se compara ni se inventa | idem | silencio | selftest | `tools/verify-fdge.mjs` | pendiente |
| T4 | La regla lo dice: `SUITE-R35` cubre también los artefactos internos | `SUITE-R35` | regla ampliada | `verify-suite` | `RULES.md` | pendiente |
| T5 | Su cita | — | dos citas | `verify-suite` | `PHASES.md` · `FDGE-Prompts.md` | pendiente |
| T6 | Los casos, incluidos los que **no** deben avisar | `test-scenarios.md` | casos nuevos | `selftest.sh` verde | `tools/selftest.sh` | pendiente |
| T7 | Sincronizar los cuatro YAML y las cuatro líneas de índice | `REGISTRY.json` | 8 sincronizaciones | `verify-fdge --all` | `changes/PT-039..042/intake.md` · `REFACTOR_SCOPE.md` | pendiente |
| T8 | Declarar la deuda que aparezca, sin fabricar rastro | `FDGE-R52` | entrada `CORRIGE` | `verify-fdge --all` | `HISTORY.log` | pendiente |
| T9 | Regenerar el núcleo | `RULES` · `PHASES` | `CORE.md` | `build-core --check` | `CORE.md` | pendiente |

**Archivos tocados** (`FDGE-R20`, y es lo que hace computable el solapamiento del lote):

```
docs/methodology/RULES.md · PHASES.md · FDGE-Prompts.md · CORE.md
docs/methodology/tools/verify-fdge.mjs · tools/selftest.sh
changes/PT-039..PT-042/intake.md · docs/implementation/REFACTOR_SCOPE.md · HISTORY.log
```

Solapamiento con `PT-046`: `tools/verify-fdge.mjs`, `tools/selftest.sh` y `HISTORY.log`.
**Serializados**, y `PT-046` ya está en `DONE`.
