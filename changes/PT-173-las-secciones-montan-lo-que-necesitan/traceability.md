# `PT-173` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `--seccion` corre una sola sección, con su terreno recién montado | TS-01 · TS-02 | selftest §EP-024 · 4 casos | evidence/PT-173/manifest.json | no aplica | ✓ |
| AC-02 | Un patrón que no casa ninguna sección **falla** — el silencio no es éxito | TS-03 | selftest §EP-024 · 4 casos | evidence/PT-173/manifest.json | no aplica | ✓ |
| AC-03 | Las 46 pasan aisladas, y la suma de sus casos **iguala** la corrida completa | TS-04 · TS-05 · TS-06 | selftest §EP-024 · 4 casos | evidence/PT-173/manifest.json | no aplica | ✓ |
| AC-04 | La cifra falsa del intake del lote queda **corregida y explicada** | TS-05 · TS-06 | selftest §EP-024 · 4 casos | evidence/PT-173/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
