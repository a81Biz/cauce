# PT-022 — Fuera de alcance   `PHASE 4`

| Fuera | Por qué | Dónde va |
|:---|:---|:---|
| Detectar que a un `out-of-scope` le falta una fila | No es mecanizable sin conocer el alcance real de la tarea, y fingirlo produciría filas copiadas para pasar. Declarado en el diseño y en la regla (`RULE-06`) | — |
| Exigir que todas las tareas de un lote declaren lo mismo | Cada tarea aplaza lo suyo. `AC-04` lo excluye explícitamente | — |
| Exigir la sección a lotes ya `CLOSED` | Pasaron su `G4` con las reglas de su momento; reescribir historia | — |
| Auditar si `PT-018` declaró más cambios de especificación que no hizo | Apareció en `PT-021` y no se ha mirado | `EP-005` |
| Entrada de `CHANGELOG.md` y número de versión | Cierre de lote, no de tarea | `EP-005` |
