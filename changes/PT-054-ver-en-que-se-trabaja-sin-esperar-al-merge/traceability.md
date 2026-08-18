# PT-054 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `avanzar` proyecta a `cauce/<usuario>` el estado de lo vivo | E1-E2 · E11 | `selftest.sh` · 4 casos | `evidence/PT-054/salidas/proyectar.txt` | - | ✓ |
| AC-02 | La rama de tarea conserva artefactos y código juntos | E3 | `selftest.sh:NO hace checkout ni worktree` | `evidence/PT-054/salidas/proyectar.txt` | - | ✓ |
| AC-03 | Todo lo proyectado se deriva; un commit humano se detecta y se dice | E6-E7 | `selftest.sh` · 3 casos | `evidence/PT-054/salidas/proyectar.txt` | - | ✓ |
| AC-04 | Cada entrada lleva el SHA de la rama de la que sale | E4-E5 | `selftest.sh` · 2 casos | `evidence/PT-054/salidas/proyectar.txt` | - | ✓ |
| AC-05 | Sin usuario no se proyecta, y se dice (`RULE-06`) | E8-E9 | `selftest.sh` · 3 casos | `evidence/PT-054/salidas/selftest.txt` | - | ✓ |
| AC-06 | No crea, mueve ni borra ramas remotas sin decirlo (`SUITE-R06f`) | E10 · E12 | `selftest.sh` · 2 casos | `evidence/PT-054/salidas/proyectar.txt` | - | ✓ |

## Declarado NO verificado   `RULE-06`

| Afirmación | Por qué no se verifica | Dónde queda |
|:---|:---|:---|
| Que alguien **mire** la proyección | Se comprueba que exista, agregue y diga la verdad. Que sirva solo lo dirá usarla | [`test-scenarios.md`](test-scenarios.md) |
| Que dos proyecciones **no se pisen** | El usuario es **uno**, el de `git config`. La convivencia es `EP-016` | [`out-of-scope.md`](out-of-scope.md) |
| Que la marca **no se pueda falsificar** | Un humano puede escribirla. Es falsificable, como una firma — mismo límite que `SUITE-R43` | `tools/tracker.mjs` |
