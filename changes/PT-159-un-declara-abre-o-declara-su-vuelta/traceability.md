# `PT-159` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una parada con desenlace `declara` **o cita un identificador del registro, o declara `revision` y `dueno`** | vocabulario cerrado, como `SUITE-R44`: una frase **falla, no se interpreta** | TS-01 · TS-05 | selftest §EP-024 · 5 casos sobre fixture propio | evidence/PT-159/manifest.json | no aplica | ✓ |
| AC-02 | Un `declara` sin ninguna de las dos **se nombra** | caso con una parada huérfana | TS-01 | selftest §EP-024 · 5 casos sobre fixture propio | evidence/PT-159/manifest.json | no aplica | ✓ |
| AC-03 | Un `declara` con la revisión **vencida** se nombra, y **dice cuántos días** | caso con fecha pasada · el precedente de `PT-139` | TS-06 | selftest §EP-024 · 5 casos sobre fixture propio | evidence/PT-159/manifest.json | no aplica | ✓ |
| AC-04 | Fuera de `G4` **avisa**; en `G4` **bloquea** | los dos casos | TS-02 · TS-04 · TS-06 | selftest §EP-024 · 5 casos sobre fixture propio | evidence/PT-159/manifest.json | no aplica | ✓ |
| AC-05 | **Lo anterior no se retrofecha** (`RIGE_DESDE`): las paradas ya publicadas con `declara` no ponen nada en rojo | caso con `suite_version` previa | TS-07 | selftest §EP-024 · 5 casos sobre fixture propio | evidence/PT-159/manifest.json | no aplica | ✓ |
| AC-06 | La regla nueva tiene **ID, severidad y propietario único**, y `regla.mjs` la resuelve | `verify-suite` sin duplicados | TS-08 | selftest §EP-024 · 5 casos sobre fixture propio | evidence/PT-159/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
