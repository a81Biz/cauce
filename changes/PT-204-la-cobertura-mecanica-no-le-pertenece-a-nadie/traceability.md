# `PT-204` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | De las 91 sin verificador, cuántas son mecanizables y cuántas no, **medido y declarado** | TS-01 · TS-02 | selftest §EP-026 | evidence/PT-204/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Rankeadas **por consecuencia**, con el criterio escrito | — | *(juicio)* | evidence/PT-204/self-review.md · salida.txt | no aplica | pendiente |
| AC-03 | La cobertura **no puede bajar en silencio** | TS-03 · TS-04 · TS-05 | selftest §EP-026 | evidence/PT-204/manifest.json · salida.txt | no aplica | pendiente |
| AC-04 | Queda decidido **si hace falta un lote propio**, y con qué criterio | — | *(juicio)* | evidence/PT-204/self-review.md | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**, y dos sin caso **a propósito**.

## `AC-02` y `AC-04` no tienen caso, y eso se declara en vez de fingirlo

Son **juicios**: el ranking por frecuencia y la decisión sobre el lote son lo que la tarea **sabe**,
no lo que **impide**. Escribirles un caso sería fijar el resultado de un juicio como si fuera un
hecho mecánico — el proxy en lugar del hecho (`CE-001`), en la tarea que mide cuántas reglas no
tienen hecho que comprobar.

Su evidencia es el `self-review` y `HISTORY.log`, y ahí está el criterio **escrito**, que es lo que
el `AC` pide: *«con el criterio escrito»*, no «con el criterio verificado».

## `AC-03` es el único que cambia comportamiento

Y es a propósito: sin él, `PT-204` sería una `INVESTIGATION` que documenta que nadie hace nada, sin
hacer nada — **el defecto que denuncia, cometido al denunciarlo**.
