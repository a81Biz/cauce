# `PT-188` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un fixture cuyo `cd` falla **no ejecuta** ninguna orden posterior | TS-01 · TS-02 | selftest §EP-024 · 6 casos | evidence/PT-188/manifest.json | no aplica | ✓ |
| AC-02 | Los cinco sitios quedan protegidos, y no queda ninguno con el patrón | TS-04 | selftest §EP-024 · 6 casos | evidence/PT-188/manifest.json | no aplica | ✓ |
| AC-03 | Una guarda del propio arnés **falla** si aparece un `( cd "$VAR"` sin `&&` ni salida | TS-03 | selftest §EP-024 · 6 casos | evidence/PT-188/manifest.json | no aplica | ✓ |
| AC-04 | El arnés se **niega a arrancar** si `$WORK` no existe o es la raíz del repositorio | TS-05 · TS-06 | selftest §EP-024 · 6 casos | evidence/PT-188/manifest.json | no aplica | ✓ |
| AC-05 | Con `$WORK` correcto, todo sigue pasando — no hay regresión | TS-07 | selftest §EP-024 · 6 casos | evidence/PT-188/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos: `FDGE-R15a` contrasta
las dos listas en los dos sentidos, y dos mapas escritos a mano del mismo hecho es la avería
que da nombre a `EP-022`.
