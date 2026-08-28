# `PT-174` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El cierre alcanza a quien importa el archivo cambiado | TS-01 · TS-05 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-174/manifest.json | no aplica | ✓ |
| AC-02 | Y a los **indirectos** — quien importa a quien lo importa | TS-02 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-174/manifest.json | no aplica | ✓ |
| AC-03 | Lo que **no** lo importa **no entra** | TS-03 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-174/manifest.json | no aplica | ✓ |
| AC-04 | El archivo cambiado entra en su propio cierre | TS-04 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-174/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
