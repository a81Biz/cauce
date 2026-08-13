# PT-022 — Fuera de alcance   `PHASE 4`

| Fuera | Por qué | Dónde va |
|:---|:---|:---|
| Detectar que a un `out-of-scope` le falta una fila | No es mecanizable sin conocer el alcance real de la tarea, y fingirlo produciría filas copiadas para pasar. Declarado en el diseño y en la regla (`RULE-06`) | — |
| Exigir que todas las tareas de un lote declaren lo mismo | Cada tarea aplaza lo suyo. `AC-04` lo excluye explícitamente | — |
| Exigir la sección a lotes ya `CLOSED` | Pasaron su `G4` con las reglas de su momento; reescribir historia | — |

> Ni la entrada de `CHANGELOG.md` ni el número de versión llevan fila aquí: son cierre de
> lote y viven en «## Cierre del lote» de `EP-005`, una sola vez (`SUITE-R45`). Escribirlos
> también aquí es la copia que esta misma tarea existe para eliminar. Lo mismo con la auditoría
> de lo que `PT-018` declaró y no hizo: está en el cierre de `EP-005`, asignada a `PT-023` (#32).
