# `PT-190` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La heurística sigue eximiendo igual que antes | TS-01 | selftest §EP-024 · `la palabra cerca del principio sigue eximiendo` | evidence/PT-190/manifest.json | no aplica | ✓ |
| AC-02 | El defecto queda visible: la misma palabra más abajo deja de eximir | TS-02 | selftest §EP-024 · `…y lejos deja de eximir: es un desplazamiento` | evidence/PT-190/manifest.json | no aplica | ✓ |
| AC-03 | Una declaración explícita exime a cualquier altura | TS-03 | selftest §EP-024 · `la declaracion explicita exime a cualquier altura` | evidence/PT-190/manifest.json | no aplica | ✓ |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

`AC-02` no afirma que el comportamiento sea correcto: afirma que **es el que hay**. Un caso que
documenta un límite conocido es lo contrario de uno que lo tapa (`RULE-06`).
