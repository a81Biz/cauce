# `PT-157` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La lista se deriva de `ESTADOS_TERMINALES`, no se escribe a mano | TS-02 | selftest §EP-024 · 6 casos `mlib` | evidence/PT-157/manifest.json | no aplica | ✓ |
| AC-02 | Los **cinco** estados terminales, escritos por su nombre canónico, no producen contradicción | TS-01 | selftest §EP-024 · 6 casos `mlib` | evidence/PT-157/manifest.json | no aplica | ✓ |
| AC-03 | Un bloque que **sí** contradice al registro sigue produciéndola — el arreglo no apaga la comprobación | TS-03 | selftest §EP-024 · 6 casos `mlib` | evidence/PT-157/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
