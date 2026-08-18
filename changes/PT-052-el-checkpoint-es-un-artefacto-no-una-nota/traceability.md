# PT-052 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Declara tarea, fase, rama, SHA, archivos tocados y siguiente acción | E1-E3 | `selftest.sh` · 5 casos | `evidence/PT-052/salidas/checkpoint.txt` | - | ✓ |
| AC-02 | Se sobrescribe, no se apila: es el estado actual | E4 | `selftest.sh` · 2 casos | `evidence/PT-052/salidas/selftest.txt` | - | ✓ |
| AC-03 | Todo campo sale de git o del registro; ninguno de la memoria | E5-E6 | `selftest.sh` · 2 casos | `evidence/PT-052/salidas/checkpoint.txt` | - | ✓ |
| AC-04 | El SHA que declara existe y es alcanzable | E7-E8 | `selftest.sh` · 4 casos | `evidence/PT-052/salidas/checkpoint.txt` | - | ✓ |
| AC-05 | El nombre y la forma están en `LEXICON` antes que en el código | E9-E10 | `selftest.sh` · 3 casos | `evidence/PT-052/salidas/selftest.txt` | - | ✓ |

## Declarado NO verificado   `RULE-06`

| Afirmación | Por qué no se verifica | Dónde queda |
|:---|:---|:---|
| Que el **árbol corresponda** al SHA declarado | Se comprueba que el commit **exista**, no que el directorio sea el suyo. Es `STATE_MISMATCH`, de `EP-015` | [`test-scenarios.md`](test-scenarios.md) |
| Que los campos **basten** para retomar | Cada campo se deriva; que el conjunto alcance solo lo dirá `EP-015` intentándolo. Es un juicio | [`test-scenarios.md`](test-scenarios.md) |
