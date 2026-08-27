# `PT-184` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una rama publicada `origin/<rama>` **no** se reporta como desviada | TS-01 | selftest §EP-024 · 5 casos | evidence/PT-184/manifest.json | no aplica | ✓ |
| AC-02 | La forma larga `remotes/<remoto>/<rama>` tampoco | TS-02 | selftest §EP-024 · 5 casos | evidence/PT-184/manifest.json | no aplica | ✓ |
| AC-03 | Una rama **local** de tres niveles conserva su primer nivel — no se le come `chore/` | TS-03 · TS-04 | selftest §EP-024 · 5 casos | evidence/PT-184/manifest.json | no aplica | ✓ |
| AC-04 | Una rama que **de verdad** se desvía del nombre derivado **sigue** reportándose | TS-06 | selftest §EP-024 · 5 casos | evidence/PT-184/manifest.json | no aplica | ✓ |
| AC-05 | `verify-fdge --gate G4` deja de fallar por este motivo con el PR abierto | TS-05 | selftest §EP-024 · 5 casos | evidence/PT-184/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
