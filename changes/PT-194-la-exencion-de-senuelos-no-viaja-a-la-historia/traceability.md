# `PT-194` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El comportamiento en historia queda **declarado**, valga o no la exención | TS-01 · TS-04 | selftest §EP-026 | evidence/PT-194/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Un secreto **real** en la historia sigue bloqueando, haya declaración o no | TS-02 | selftest §EP-026 | evidence/PT-194/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | El mensaje dice **qué ocurre de verdad**, no «hay una contraseña» a secas | TS-03 | selftest §EP-026 | evidence/PT-194/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `AC-02` es el que gobierna la tarea, y su caso es el que no se puede quitar

El intake ya lo declaraba: *«`AC-02` es el que impide arreglarlo en la dirección peligrosa»*. Aquí
se hace explícito qué significa: **`TS-01`, `TS-03` y `TS-04` los cumple un escáner que haya
ampliado la exención**. Sólo `TS-02` —el secreto que bloquea **con** la declaración puesta— prueba
que no se hizo.

## `TS-04` no es simetría: es lo que `PT-190` compró

La exención en el **árbol** funciona y no cambia. Sin un caso que lo fije, «arreglar» la historia
podría romperla sin que nada lo dijera — y ése es el ahorro que `PT-190` ya pagó.

## Lo que la tarea NO cambia

El escáner **sigue bloqueando** exactamente donde bloqueaba. Lo que cambia es que su
comportamiento en historia pase de ser un **efecto de la implementación** —`false` pasado en duro
en `revisar-secretos.mjs:164`— a una **decisión declarada con su motivo**, dicha en la salida y no
sólo en un documento.
