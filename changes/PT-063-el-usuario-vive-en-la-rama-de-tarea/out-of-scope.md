# PT-063 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Quién es quién | PT-061 |
| Los rangos de ID | PT-062 |
| De quién es cada commit | PT-064 |
| La sesión por persona | PT-065 |
| `trabajo/<usuario>` | — |
| Una compuerta `G4` por persona | — |
| Renombrar ramas ya abiertas | — |
| Crear la rama | — |
| Fallar si la rama no lleva usuario | — |

**Las cuatro primeras son el lote.** `PT-061` y `PT-062` están integradas; esta tarea consume el
nombre canónico de la primera.

**La quinta y la sexta son la decisión 3 del firmante**, y el motivo está razonado: un cuarto nivel
de rama obliga a decidir quién integra el trabajo de quién **antes** de `trabajo`, y `G4` por
persona la convertiría en ocho compuertas en un lote de ocho tareas — que es exactamente lo que
`EXEC-R03` existe para impedir.

**La séptima:** renombrar una rama viva rompe el PR abierto sobre ella. `AC-04` la deja terminar
como empezó.

**La octava:** crear una rama toca el árbol de trabajo. `PT-054` ya decidió que la herramienta no lo
hace —si falla a mitad, deja a quien la usa en otro sitio— y `EXEC-R07` dice que lo que no se
automatiza **se describe**. `tracker rama` lo describe.

**Y la novena es la decisión de `PHASE 3`:** fallar rompería `AC-04` —las 22 ramas declaradas hoy
son de dos niveles—. Avisa, y el aviso **dice desde cuándo** aplica. Tampoco se falla «a partir de
la próxima versión»: una comprobación que cambia de severidad con el tiempo es una que nadie puede
razonar.
