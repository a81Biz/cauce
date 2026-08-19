# PT-055 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Cambiar `SUITE-R45` o lo que exige de una sección de cierre | — |
| Rellenar las filas de cierre de ningún lote | — |
| El alcance global de `INTAKE-R09` e `INTAKE-R08` en `checkEpics()` | — |
| Que `--gate G1..G3` acepte también `EP-NNN` | — |
| Los 43 avisos que `verify-fdge --all` emite hoy | — |

**Las tres primeras llevan `—` y no aplazan nada.** La primera y la segunda son la opción `D`
que la estrategia descartó: aflojar la regla para que no moleste. La tercera es alcance
**correcto**: un intake incompleto es un defecto lo evalúe quien lo evalúe, y acotarlo sería
introducir el defecto simétrico al que esta tarea arregla.

**La cuarta:** `G1`, `G2` y `G3` son compuertas **de tarea**, no de lote. Un `EP-NNN` como
objetivo de `--gate G2` no significa nada hoy, y darle significado sería diseñar, no arreglar.

**La quinta:** 19 de esos 43 avisos dicen «aún no toca» y son ruido medido, no defecto. Está
declarado desde `PT-049` y sigue siendo otra tarea.
