# `PT-152` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `patrones.mjs` declara `TRIGGERS_DE_SUITE`, y cada entrada nombra su regla y para qué sirve | TS-02 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-152/manifest.json | no aplica | ✓ |
| AC-02 | `triggers()` devuelve los de `COMPONENTES` **y** los de suite, sin duplicar | TS-01 · TS-03 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-152/manifest.json | no aplica | ✓ |
| AC-03 | `[START MIGRATE]` aparece en el bloque de triggers de `CORE.md` | TS-04 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-152/manifest.json | no aplica | ✓ |
| AC-04 | `verify-suite`, `verify-patrones` y `audit` en verde tras regenerar `CORE` | TS-04 | selftest §EP-024 · 4 casos `mlib` | evidence/PT-152/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
