# `PT-175` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El mismo contenido da el **mismo** sello | TS-01 | selftest §EP-024 · 9 casos `mlib` | evidence/PT-175/manifest.json | no aplica | ✓ |
| AC-02 | Cambiar una **sección** lo rompe | TS-02 | selftest §EP-024 · 9 casos `mlib` | evidence/PT-175/manifest.json | no aplica | ✓ |
| AC-03 | Cambiar una **herramienta** lo rompe | TS-03 | selftest §EP-024 · 9 casos `mlib` | evidence/PT-175/manifest.json | no aplica | ✓ |
| AC-04 | `CRLF` y `LF` dan el **mismo** sello | TS-04 | selftest §EP-024 · 9 casos `mlib` | evidence/PT-175/manifest.json | no aplica | ✓ |
| AC-05 | Sin sello, `SIN_SELLAR`; sello que no casa, `REABIERTO`, y dice que vuelve a la batería entera | TS-05 · TS-06 | selftest §EP-024 · 9 casos `mlib` | evidence/PT-175/manifest.json | no aplica | ✓ |
| AC-06 | Un sello que casa pero cuya corrida **falló** no certifica: `SELLADO_EN_ROJO` | TS-07 · TS-08 | selftest §EP-024 · 9 casos `mlib` | evidence/PT-175/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
