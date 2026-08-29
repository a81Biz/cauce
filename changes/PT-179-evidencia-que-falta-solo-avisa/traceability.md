# `PT-179` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Falta el manifest y la tarea pasó `PHASE 6` ⇒ **error** | TS-01 | selftest §EP-026 · `evidencia que falta en PHASE 7 BLOQUEA` | evidence/PT-179/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Falta el manifest y la tarea está antes de `PHASE 6` ⇒ **aviso** | TS-02 | selftest §EP-026 · `…y en PHASE 4 solo avisa, diciendo la fase` | evidence/PT-179/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | El mensaje no afirma «normal antes de `PHASE 6`» cuando la tarea ya pasó de ahí | TS-02 · TS-03 | selftest §EP-026 · `…y en PHASE 4 solo avisa, diciendo la fase` · `…y sin fase declarada NO se convierte en error` | evidence/PT-179/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `TS-02` sostiene a los otros dos

`AC-01` lo satisface convertir el aviso en error **siempre** — y eso pondría en rojo a todo `PT`
recién abierto, que es el defecto contrario y peor. Sólo `TS-02` distingue «exige cuando toca» de
«exige y punto», y de paso comprueba que el mensaje **nombra la fase real** en vez de afirmar una
que no miró.

## Lo declarado sin cubrir

`FDGE-R25` y `FDGE-R29` se arreglan igual y **no tienen caso propio**: comparten helper, fixture y
salidas con `FDGE-R23`. Comprobados a mano sobre el mismo fixture, y consta en la evidencia
(`test-scenarios.md`).
