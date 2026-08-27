# `PT-165` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `build-core` no contiene rangos de fase escritos a mano | TS-01 | selftest §EP-024 · 2 casos · `audit` y `verify-suite` en la corrida | evidence/PT-165/manifest.json | no aplica | ✓ |
| AC-02 | El mapa publicado en `CORE.md` coincide con `fasesDe()` para los seis componentes | TS-02 | selftest §EP-024 · 2 casos · `audit` y `verify-suite` en la corrida | evidence/PT-165/manifest.json | no aplica | ✓ |
| AC-03 | `audit` falla —de forma distinguible— si el mapa publicado deja de coincidir | TS-03 | selftest §EP-024 · 2 casos · `audit` y `verify-suite` en la corrida | evidence/PT-165/manifest.json | no aplica | ✓ |
| AC-04 | `verify-suite` y `verify-patrones` en verde tras regenerar | TS-04 | selftest §EP-024 · 2 casos · `audit` y `verify-suite` en la corrida | evidence/PT-165/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
