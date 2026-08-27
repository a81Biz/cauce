# `PT-177` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `reanclar` publica la nota que falta y la cuenta pasa a cumplir `FDGE-R52` | TS-01 | selftest §EP-024 · 4 casos sobre fixture propio | evidence/PT-177/manifest.json | no aplica | ✓ |
| AC-02 | Reanclar una fase **que no ha ocurrido** se niega (`LEX-R30`) | TS-02 | selftest §EP-024 · 4 casos sobre fixture propio | evidence/PT-177/manifest.json | no aplica | ✓ |
| AC-03 | Reanclar donde **no hay déficit** no publica nada | TS-03 · TS-04 | selftest §EP-024 · 4 casos sobre fixture propio | evidence/PT-177/manifest.json | no aplica | ✓ |
| AC-04 | La nota publicada **declara** que repara una pérdida, y lleva la fecha de hoy | TS-05 | selftest §EP-024 · 4 casos sobre fixture propio | evidence/PT-177/manifest.json | no aplica | ✓ |
| AC-05 | La fase **no se mueve**: el registro dice lo mismo antes y después | TS-06 | selftest §EP-024 · 4 casos sobre fixture propio | evidence/PT-177/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
