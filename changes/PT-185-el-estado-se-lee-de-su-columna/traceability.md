# `PT-185` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una fila cuyo **título** nombra un estado se lee por su **columna** | TS-01 | selftest §EP-024 · 4 casos | evidence/PT-185/manifest.json | no aplica | ✓ |
| AC-02 | Una fila cuya columna **sí** diverge del registro **sigue** saliendo | TS-02 | selftest §EP-024 · 4 casos | evidence/PT-185/manifest.json | no aplica | ✓ |
| AC-03 | Una línea que no es fila de tabla se sigue evaluando con el barrido anterior | TS-03 · TS-04 | selftest §EP-024 · 4 casos | evidence/PT-185/manifest.json | no aplica | ✓ |
| AC-04 | `verify-fdge --gate G4 PT-162` deja de fallar por este motivo | TS-05 | selftest §EP-024 · 4 casos | evidence/PT-185/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
