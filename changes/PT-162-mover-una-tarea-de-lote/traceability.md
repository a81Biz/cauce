# `PT-162` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `mover` cambia el lote de una tarea `DRAFT` o `READY`, y lo registra | TS-01 · TS-08 | selftest §EP-024 · 7 casos sobre fixture propio | evidence/PT-162/manifest.json | no aplica | ✓ |
| AC-02 | `mover` **rechaza** una tarea que ya pasó de `PHASE 1`, diciendo por qué | TS-02 | selftest §EP-024 · 7 casos sobre fixture propio | evidence/PT-162/manifest.json | no aplica | ✓ |
| AC-03 | `mover` rechaza un destino que no es un lote (`LEX-R27`) o que no existe | TS-03 · TS-04 · TS-05 | selftest §EP-024 · 7 casos sobre fixture propio | evidence/PT-162/manifest.json | no aplica | ✓ |
| AC-04 | `rechazar` lleva a `REJECTED` y **exige** motivo | TS-06 | selftest §EP-024 · 7 casos sobre fixture propio | evidence/PT-162/manifest.json | no aplica | ✓ |
| AC-05 | `rechazar` **no** toca una allocation en estado terminal | TS-07 | selftest §EP-024 · 7 casos sobre fixture propio | evidence/PT-162/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
