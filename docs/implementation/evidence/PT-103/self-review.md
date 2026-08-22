# Autorrevisión — `PT-103`

## Lo que establecí

Que `asignar` crea una allocation completa —`phase: 1` siempre, tipo y severidad validados— y
que `SUITE-R58` avisa cuando una nace incompleta. **Cumplir el marco ya no exige saltarse la
herramienta.**

## Lo que NO establecí

- **Que el procedimiento entero sea comprobable.** `SUITE-R58` mira `asignar`. El problema
  general que el firmante señala es más grande y sigue abierto.
- **Que los demás comandos no tengan el mismo hueco.** Se midió uno.
- **Que escribir a mano deje de ocurrir.** La regla avisa; no impide, y no debe.

## Lo que salió mal

**Cinco rodeos del registro en una sesión, y solo dos declarados.** El comando no permitía
obedecer —eso es el defecto—, pero **callarlo cuatro veces es mío**, y es lo que convierte un
defecto de herramienta en uno de procedimiento.

**Mi propio flag rompió la detección de la raíz del proyecto**, en la quinta ocurrencia de un
patrón que el comentario contiguo ya contaba.

**Décima instancia de colocar una comprobación fuera de su ámbito** — y la primera cazada antes
de ejecutar.

**Afirmé un defecto que no existía.** Dije que `PT-100` había roto `FDGE-R52`. Es falso: la regla
nombra las dos ramas. Lo comprobé **después** de escribirlo — el mismo error que este lote
persigue. Corregido en `SESSION_LOG.md`.

**Reventé mi propia batería tres veces** editando mientras corría, produciendo 21 «la herramienta
reventó» que no eran rojos reales.

## Lo que la inversa enseñó

Salió en cero **dos veces seguidas** para el mismo cambio, y las dos veces tenía razón: primero
el fixture tapaba el defecto con una ruta explícita, después el valor elegido ya lo excluía otro
filtro. **Una inversa en cero no es un verde: dice dónde mirar.**
