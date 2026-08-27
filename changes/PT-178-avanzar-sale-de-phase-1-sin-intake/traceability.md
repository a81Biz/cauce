# `PT-178` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `avanzar --a 2` sobre una tarea sin intake **falla**, y el mensaje nombra la ruta que falta | TS-01 | selftest §EP-024 · 3 casos sobre fixture propio | evidence/PT-178/manifest.json | no aplica | ✓ |
| AC-02 | Con el intake presente, `avanzar --a 2` pasa — el bloqueo no es una parada permanente | TS-02 | selftest §EP-024 · 3 casos sobre fixture propio | evidence/PT-178/manifest.json | no aplica | ✓ |
| AC-03 | Avanzar **dentro** de `PHASE 1` o entre fases posteriores no se ve afectado | TS-03 | selftest §EP-024 · 3 casos sobre fixture propio | evidence/PT-178/manifest.json | no aplica | ✓ |
| AC-04 | Las nueve tareas de `EP-024` tienen intake, y `verify-fdge` no reporta `FDGE-R01` | TS-04 | selftest §EP-024 · 3 casos sobre fixture propio | evidence/PT-178/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
