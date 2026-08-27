# `PT-180` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `integrar` encuentra la carpeta de `PT-155` y lo lleva a `INTEGRATED` | TS-01 · TS-05 | selftest §EP-024 · 3 casos sobre fixture propio | evidence/PT-180/manifest.json | no aplica | ✓ |
| AC-02 | La divergencia se **nombra** en la salida, citando los dos nombres | TS-02 · TS-03 | selftest §EP-024 · 3 casos sobre fixture propio | evidence/PT-180/manifest.json | no aplica | ✓ |
| AC-03 | Un `PT` cuya carpeta **no existe** sigue dando la ruta esperada, no una inventada | TS-04 | selftest §EP-024 · 3 casos sobre fixture propio | evidence/PT-180/manifest.json | no aplica | ✓ |
| AC-04 | Ningún sitio de `tracker.mjs` compone la ruta a mano | TS-06 | selftest §EP-024 · 3 casos sobre fixture propio | evidence/PT-180/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
