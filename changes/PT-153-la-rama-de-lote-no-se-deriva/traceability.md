# `PT-153` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `ramaDeLote` deriva la rama de un lote sin usar `type`, y con el slug del registro | TS-01 · TS-02 | selftest §EP-024 · 4 casos `mlib` · `verify-fdge` en la corrida | evidence/PT-153/manifest.json | no aplica | ✓ |
| AC-02 | `ramaDeLote` devuelve `null` para lo que no es un lote — no inventa nada fuera de su objeto | TS-03 · TS-04 | selftest §EP-024 · 4 casos `mlib` · `verify-fdge` en la corrida | evidence/PT-153/manifest.json | no aplica | ✓ |
| AC-03 | `verify-fdge` **barre el registro entero**, no sólo el lote que se verifique por su nombre | TS-05 | selftest §EP-024 · 4 casos `mlib` · `verify-fdge` en la corrida | evidence/PT-153/manifest.json | no aplica | ✓ |
| AC-04 | Un lote nacido desde `13.2.0` con `type` **falla**; los anteriores se cuentan y se declaran | TS-05 · TS-06 | selftest §EP-024 · 4 casos `mlib` · `verify-fdge` en la corrida | evidence/PT-153/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
