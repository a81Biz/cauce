# PT-062 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Quién es quién | PT-061 |
| El usuario en la rama de tarea | PT-063 |
| De quién es cada commit | PT-064 |
| La sesión por persona | PT-065 |
| Namespacear el identificador | — |
| Un contador por persona | — |
| Renumerar lo ya asignado | — |
| Repartir los rangos automáticamente | — |
| Un servicio central que asigne | — |
| Resolver el conflicto de merge | — |

**Las cuatro primeras son el lote.** `PT-061` está integrada y esta tarea la consume: el rango vive
dentro de `personas`.

**La quinta es la decisión 2 del firmante**, y el motivo es duro: `LEX-R04` declara los
identificadores **permanentes**, y `PT-alberto-001` rompería cada referencia escrita en 65 tareas
cerradas, en su `HISTORY`, en sus issues y en sus commits.

**La sexta:** un contador por persona sería **un segundo sitio donde vive el mismo hecho**
(`SUITE-R38`). El siguiente ID se **deriva** de lo ya asignado dentro del rango.

**La séptima:** `LEX-R04` · un identificador nunca se renumera. Los 65 `PT` existentes se quedan
donde están.

**La octava:** repartir el espacio de identificadores es una decisión de equipo. Una herramienta
que lo hiciera por su cuenta estaría decidiendo algo que no le toca; lo que hace es **enseñar los
rangos y sus huecos**.

**La novena:** el registro es un archivo del repositorio. Poder asignar **sin red** es justamente
lo que hace que `SUITE-R08` funcione, y un servicio central lo perdería.

**Y la décima:** los rangos hacen que no haya conflicto **por el identificador**, que es el daño
grave —`PHASE 2` lo reprodujo: el contador se fusiona sin conflicto y una tarea desaparece entera—.
Si dos personas tocan líneas contiguas del `JSON` seguirá habiendo un conflicto de texto, pero
entonces es uno **de verdad**, cuya resolución obvia conserva las dos entradas.
