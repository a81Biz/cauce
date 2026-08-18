# PT-051 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `--donde` da archivo y línea de cada `fail()` que emite el ID | E1 · E3 · E4 | `selftest.sh` · 4 casos | `evidence/PT-051/salidas/inversa.txt` | - | ✓ |
| AC-02 | Sale de leer el código, no de una tabla escrita a mano | E7-E9 | `selftest.sh` · 4 casos | `evidence/PT-051/salidas/completa.txt` | - | ✓ |
| AC-03 | Una regla sin verificador lo dice, no devuelve vacío | E5-E6 | `selftest.sh` · 4 casos | `evidence/PT-051/salidas/donde.txt` | - | ✓ |
| AC-04 | Una regla con verificador en varias herramientas las enumera todas | E2 | `selftest.sh` · 2 casos | `evidence/PT-051/salidas/donde.txt` | - | ✓ |

## Declarado NO verificado   `RULE-06`

| Afirmación | Por qué no se verifica | Dónde queda |
|:---|:---|:---|
| Que la línea informada sea la **útil** | `--donde` responde **dónde se emite**, no **por qué se llega ahí**. Analizar el flujo no es derivable de una expresión regular | [`test-scenarios.md`](test-scenarios.md) · `out-of-scope` |
| Que la guarda de comentarios cubra **toda** forma | Es una heurística de línea. Un `fail()` tras un bloque `/* */` en la misma línea se contaría. Basta para lo que hay —**1 de 214**— y su límite se declara | [`self-review.md`](self-review.md) |
