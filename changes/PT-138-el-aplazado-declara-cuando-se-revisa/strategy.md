# Estrategia — `PT-138`   `PHASE 3`

## El camino elegido

`tracker aplazar`, que escribe `DEFERRED` **y** los tres campos en el mismo acto. La obligación
no se comprueba después: **no hay forma de escribir el estado sin ellos**.

## Los caminos descartados, con su por qué

**1 · Exigir los campos sólo en `G4`, sin comando.** Descartado. Un dato que sólo se pide al
final se rellena al final, y entonces es una fecha inventada.

**2 · Un campo único de texto libre.** Descartado. «Cuándo se revisa» y «qué tiene que pasar»
son preguntas distintas: la primera es una fecha con la que se puede caducar (`PT-139`), la
segunda no es mecanizable y **debe** ser prosa. Fundirlas haría la fecha inauditable.

**3 · Derivar la fecha automáticamente —«tres meses»—.** Descartado, y es el más peligroso:
produciría una fecha para **todos** los aplazados sin que nadie hubiera pensado en ninguno. Un
dato plausible y no decidido es lo que `RULE-06` prohíbe.

**4 · Exigir dueño a `PT-025` retroactivamente.** Descartado: `FDGE-R52` fijó el criterio de no
retrofechar. Se le escribe lo que se sabe y se declara lo que no.

## Cómo se verifica

Casos sobre fixture, y prueba inversa con supresiones sobre copia del módulo. `AC-07` se verifica
**sobre el registro real**.
