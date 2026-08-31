# `PT-205` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El verde local **avisa** de lo que romperá en CI por depender de lo empujado | TS-01 · TS-02 · TS-03 · TS-07 | selftest §EP-026 | evidence/PT-205/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Existe vía **sancionada** de sellar el estado sin cambiar de fase, y el sello sigue derivado | TS-04 · TS-05 | selftest §EP-026 | evidence/PT-205/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | La prosa del `HANDOFF` **no** se toca | TS-05 · TS-06 | selftest §EP-026 | evidence/PT-205/manifest.json · salida.txt | no aplica | pendiente |
| AC-04 | Lo que quede como rodeo está **escrito donde se ejecuta** | TS-03 | selftest §EP-026 | evidence/PT-205/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los cuatro tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `TS-02` es el que sostiene toda la tarea

`AC-01` lo cumple un aviso que salga **siempre**. Y un aviso que sale siempre es ruido — el arreglo
se perdería entre los demás y el viaje de CI volvería intacto. Es la misma forma que
`bloques-sellados` ya resolvió: **el silencio significa algo**, y por eso hay un caso que lo fija.

## `TS-07` viene medido de otra tarea

`PT-187` reprodujo en vivo lo que pasa cuando la llamada a la red falla y el `catch` deja el
conjunto vacío: **veinte divergencias inventadas**. Aquí el fallo iría al revés —ocultar lo
pendiente— y el efecto sería devolver el viaje de CI que esta tarea quita.
