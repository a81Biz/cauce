# PT-021 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Citar el propio lote vale si esta DONE o CLOSED | E1 E2 | selftest.sh - «el propio lote en DONE vale» - «y en CLOSED tambien» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Sigue fallando en DRAFT o IN_PROGRESS | E3 E4 | selftest.sh - «el lote IN_PROGRESS sigue sin valer» - «y en DRAFT tampoco» - inversa | salidas/inversa.txt | - | VERIFICADO |
| AC-03 | EP-004 pasa G4 en sus cinco tareas | E5 | ejecucion real sobre el repositorio | salidas/g4-cinco.txt | - | VERIFICADO |

## Fuera de los AC, y se dice

`RULES.md` describía la lista de palabras que `PT-018` habia quitado del codigo. Corregido aqui.
No estaba en los criterios de aceptacion de esta tarea porque no se sabia que existia hasta
`PHASE 2`.
