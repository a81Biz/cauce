# `PT-183` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una bandera desconocida hace **fallar** al comando, y el mensaje enumera las conocidas | TS-01 | selftest §EP-024 · 9 casos, 4 sobre fixture propio | evidence/PT-183/manifest.json | no aplica | ✓ |
| AC-02 | Las banderas legítimas de cada acción siguen funcionando — no hay regresión | TS-02 · TS-03 | selftest §EP-024 · 9 casos, 4 sobre fixture propio | evidence/PT-183/manifest.json | no aplica | ✓ |
| AC-03 | `mover` asigna el lote a un `PT` que no tiene ninguno, sea cual sea su fase | TS-04 | selftest §EP-024 · 9 casos, 4 sobre fixture propio | evidence/PT-183/manifest.json | no aplica | ✓ |
| AC-04 | `mover` **sigue negándose** a cambiar de lote a una tarea empezada que **sí** tiene uno | TS-05 | selftest §EP-024 · 9 casos, 4 sobre fixture propio | evidence/PT-183/manifest.json | no aplica | ✓ |
| AC-05 | `verify-fdge` **falla** sobre un `PT` sin lote nacido desde `13.2.0`, y **cuenta y declara** los anteriores | TS-06 · TS-07 · TS-08 | selftest §EP-024 · 9 casos, 4 sobre fixture propio | evidence/PT-183/manifest.json | no aplica | ✓ |
| AC-06 | Los cinco recientes citan su lote en registro, intake e `HISTORY`, y `EP-026` deja de estar vacío | TS-09 | selftest §EP-024 · 9 casos, 4 sobre fixture propio | evidence/PT-183/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
