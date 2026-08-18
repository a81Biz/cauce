# PT-050 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `--solo <patrón>` ejecuta únicamente los casos cuyo nombre casa | E1-E2 · E10 | `selftest.sh` · 5 casos | `evidence/PT-050/salidas/solo.txt` | - | ✓ |
| AC-02 | Dice cuántos ejecutó de cuántos hay | E3-E5 | `selftest.sh` · 3 casos | `evidence/PT-050/salidas/solo.txt` | - | ✓ |
| AC-03 | Un patrón que no casa nada falla, no pasa por vacío | E6-E7 | `selftest.sh` · 3 casos | `evidence/PT-050/salidas/solo.txt` | - | ✓ |
| AC-04 | El fixture se construye igual: comprueba menos casos, no menos por caso | E8-E9 | `selftest.sh` · 3 casos | `evidence/PT-050/salidas/completa.txt` | - | ✓ |

## Declarado NO verificado   `RULE-06`

| Afirmación | Por qué no se verifica | Dónde queda |
|:---|:---|:---|
| Que el ahorro **baste** para iterar cómodo | Medido: 209 → 138 s, **34 %**. El suelo son las 181 reconstrucciones del fixture. Y la cifra falló **tres veces**: 99 % → 55 % → 34 % | [`self-review.md`](self-review.md) |
| El **comportamiento** de `--solo`, por la propia batería | Catorce casos comprueban la **forma**. Los cuatro caminos reales, con sus `exit`, están en la evidencia. Mismo límite que `PT-049` | [`test-scenarios.md`](test-scenarios.md) |
