# `PT-182` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El mapa declara el artefacto de cada fase, en un solo sitio | TS-01 | selftest §EP-024 · 7 casos | evidence/PT-182/manifest.json | no aplica | ✓ |
| AC-02 | `PHASE 6` pide **dos**: `manifest.json` y `self-review.md` | TS-02 | selftest §EP-024 · 7 casos | evidence/PT-182/manifest.json | no aplica | ✓ |
| AC-03 | Una fase completa no reporta nada; una fase sin artefacto declarado devuelve `null` | TS-03 · TS-04 | selftest §EP-024 · 7 casos | evidence/PT-182/manifest.json | no aplica | ✓ |
| AC-04 | `avanzar` **se niega** a salir de `PHASE 4` sin `traceability.md` | TS-05 · TS-06 | selftest §EP-024 · 7 casos | evidence/PT-182/manifest.json | no aplica | ✓ |
| AC-05 | Una fase que **no** declara artefacto **no** bloquea | TS-07 | selftest §EP-024 · 7 casos | evidence/PT-182/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
