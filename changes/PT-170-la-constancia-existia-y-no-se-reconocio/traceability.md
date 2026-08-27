# `PT-170` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una constancia con `Autoriza: <nombre>` se reconoce, sea cual sea su encabezado | TS-01 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-170/manifest.json | no aplica | ✓ |
| AC-02 | Un encabezado que anuncia autorización sigue reconociéndose sin campo — no hay regresión | TS-02 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-170/manifest.json | no aplica | ✓ |
| AC-03 | `Autoriza:` vacío **no** cuenta | TS-03 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-170/manifest.json | no aplica | ✓ |
| AC-04 | `Autoriza:` con marcador entre corchetes **no** cuenta | TS-04 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-170/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
