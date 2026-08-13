# PT-013 — Cambios de especificación   `PHASE 4`

## Regla nueva   `SUITE-R44`

Cerrar un lote no borra lo que aplazó. Toda fila de `out-of-scope.md` que apunte a trabajo
futuro cita el identificador que lo sostiene, y ese identificador es una allocation del
registro —normalmente en estado `DEFERRED`— con su issue si el proyecto declara plataforma.

## `DEFERRED`, de estado muerto a estado usable

Existía en `LEXICON` §5.1 y no lo usaba nadie. Ahora: **exento** de las exigencias de artefactos
de un PT en curso, y **vivo** para el espejo.

## `CORE.md`

Se regenera: entra `SUITE-R44`.
