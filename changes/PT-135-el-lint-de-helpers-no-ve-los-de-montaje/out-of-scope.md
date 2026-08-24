# Fuera de alcance — `PT-135`

> `SUITE-R44` · La última columna es el destino, y es vocabulario cerrado.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Reordenar la batería entera por criterio estético | Se mueve **lo que el lint señala**, y son dos | — |
| Convertir el lint en error duro en esta misma tarea | Primero se enumera lo que hay (`SUITE-R09`). Hoy sale limpio, así que el caso puede exigir «ninguno» sin bloquear a nadie | — |
| `set -e` en la batería | Cambiaría el comportamiento de 1551 casos de golpe | — |
| Arreglar las once lecturas de alcance amplio que `PT-130` enumeró | Otra tarea, otra causa. Esta arregla **la del lint**, que es una de esa familia | `FPGE` · candidatos |
| Dar regla a `CE-004` | Esta tarea **le quita una instancia** y deja el mecanismo que impide la siguiente. Darle regla es una decisión de diseño propia | `FPGE` · candidato publicado por `sellar` |
| Detectar helpers usados antes de definirse en **otros** archivos | La batería es el único con este patrón; extenderlo sin medirlo sería prometer lo no medido (`RULE-06`) | — |

---

## Lo que esta tarea **produce** y no resuelve

`CE-004` —«probar donde trabajo, no donde se decide»— es la clase **más repetida** del ledger:
ordinal declarado **9**, ocho instancias, y **sin regla que la reclame**. `sellar` la publica como
candidata en cada corrida.

Esta tarea no le da regla. Le quita una instancia y deja el mecanismo que impide la siguiente:
un lint que **deriva** lo que vigila, reconoce las dos formas en que se falla, y cuyo caso puede
fallar.
