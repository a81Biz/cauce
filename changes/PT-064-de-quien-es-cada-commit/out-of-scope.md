# PT-064 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Quién es quién | PT-061 |
| Los rangos de ID | PT-062 |
| El usuario en la rama | PT-063 |
| La sesión por persona | PT-065 |
| Cambiar la lógica de `costeDe` o `viabilidadDe` | — |
| Comparar el rendimiento de dos personas | — |
| Adjudicar un commit por parecido | — |
| Un `MINIMO_REFERENCIA` distinto por persona | — |

**Las cuatro primeras son el lote.** Las tres primeras están integradas y esta tarea las consume.

**La quinta lleva `—` y es deliberada:** `PT-057` y `PT-059` decidieron **cómo** se calcula. Esta
tarea cambia **de dónde salen las entradas**, igual que `PT-060` hizo con el `desde`. Tocar la
lógica sería rehacer dos tareas cerradas por la puerta de atrás.

**La sexta es la más importante del lote, y se dice aquí porque es donde podría colarse:** esto
sirve para que el marco **no decida mal**, no para medir a nadie. El marco puede dar la cifra de
cada persona porque la necesita para decidir si empezar una tarea; presentarla como comparación
entre personas es otra herramienta, con otras consecuencias, y no es ésta.

**La séptima:** `PT-061` lo decidió — adjudicar por mismo apellido o mismo dominio convierte una
duda en un dato. Aquí se **aplica**: un autor no declarado no cuenta para el precedente de nadie, y
se dice cuántos son.

**Y la octava:** `MINIMO_REFERENCIA` ya hace lo correcto cuando un grupo se queda pequeño —devuelve
`SIN REFERENCIA` con su motivo— y `viabilidadDe` con una cifra `SIN EVALUAR` devuelve `MARGINAL`.
Bajar el mínimo «porque ahora los grupos son más pequeños» sería relajar `AC-03` de `PT-057` desde
fuera.
