# `PT-206` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `LEX-R31` ve **las 76**, no 22 | TS-01 | selftest §EP-026 | evidence/PT-206/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Una entrada que **no** declara clase sigue avisando | TS-02 | selftest §EP-026 | evidence/PT-206/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | La lectura vive en **un** sitio, con contrato | TS-03 | selftest §EP-026 | evidence/PT-206/manifest.json · salida.txt | no aplica | pendiente |
| AC-04 | Se **barre la familia** y se declara la cifra | TS-04 | selftest §EP-026 | evidence/PT-206/self-review.md · evidence/PT-206/salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los cuatro tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `AC-04` se verifica con un **cero**, y su cifra vive en la evidencia

El `AC` pide dos cosas: barrer la familia y **declarar la cifra**. Lo mecanizable es el **cero** —
que la expresión vieja ya no se **use**—; la cifra es un **hecho declarado**, y fijarla en un caso
sería fijar el número de lo correcto (`HANDOFF -18`) y caducaría (`CE-010`).

Por eso su evidencia es `self-review.md` y `salida.txt`, no un caso: **es lo que la tarea sabe, no
lo que la tarea impide.** (La cifra queda también en `HISTORY.log`, pero la trazabilidad apunta a
la evidencia de la tarea: `FDGE-R23` la busca **en `evidence/`**, y citar un ledger del repositorio
como si viviera ahí es afirmar una ruta que no existe — me lo dijo en rojo.)

## `AC-01` cambió de cifra al medirlo

El intake decía **71 declaradas y 17 vistas**. Al implementarlo, el árbol había crecido: **76 y
22**. La proporción no cambia —tres de cada cuatro invisibles— y la cifra se corrige aquí en vez de
dejarse, que es lo que `CE-010` castiga.
