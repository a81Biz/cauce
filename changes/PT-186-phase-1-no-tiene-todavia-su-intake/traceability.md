# `PT-186` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una tarea en `PHASE 1` sin intake sale como **aviso**, no como error | TS-01 | selftest §EP-024 · 4 casos sobre fixture propio | evidence/PT-186/manifest.json | no aplica | ✓ |
| AC-02 | El aviso **dice por qué** aún no es exigible y cita a `PT-178` | TS-02 | selftest §EP-024 · 4 casos sobre fixture propio | evidence/PT-186/manifest.json | no aplica | ✓ |
| AC-03 | Una tarea en `PHASE 2` o más sin intake **sigue siendo error** | TS-03 · TS-04 | selftest §EP-024 · 4 casos sobre fixture propio | evidence/PT-186/manifest.json | no aplica | ✓ |
| AC-04 | `npm run verify` deja de fallar por las cuatro de `EP-026` | TS-05 | selftest §EP-024 · 4 casos sobre fixture propio | evidence/PT-186/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
