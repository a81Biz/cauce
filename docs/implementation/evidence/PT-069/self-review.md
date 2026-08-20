# PT-069 — Autorrevisión   `PHASE 6`
## Qué se arregló

**Los indices se derivan del registro.**

89 filas para 86 tareas, y 27 MAL ARCHIVADAS: 16 bugs y 11 features viviendo en el indice de refactors. El reparto lo dice LEX-R12 y nadie lo aplicaba porque nadie lo derivaba.

## La decisión que lo define

Cuatro instrucciones que no se podian cumplir a la vez: PHASE 8 ordena regenerar, SUITE-R35 exige espejar, verify-fdge lo comprueba y el HANDOFF prohibe editarlos a mano — sin generador, la unica forma de cumplir tres era romper la cuarta.

## Lo que aprendí escribiéndolo

Mi propia cabecera citaba «PT-069» y verify-fdge la tomo por la linea de indice de esa tarea. Es la familia de PT-067: una mencion contada como dato, cometida al arreglar precisamente eso.
