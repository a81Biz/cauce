# Estrategia — `PT-134`   `PHASE 3`

## El camino elegido

Un valor reconocido en la celda del escenario —`CAÍDO`— **más** un motivo en `manifest.json`. Las
dos cosas, y ninguna basta sola.

## Los caminos descartados, con su por qué

**1 · Sólo la palabra en la matriz.** Descartado: sería una palabra que **apaga una
comprobación** sin que nadie responda de ello. Escribirla costaría cinco letras.

**2 · Sólo el motivo en el manifiesto.** Descartado: no se vería al leer la matriz, que es el
documento donde se mira si un criterio está cubierto.

**3 · Un estado en el registro.** Descartado: un `AC` no es una allocation; no tiene identidad
fuera de su tarea y meterlo en `REGISTRY.json` inventaría un espacio de nombres.

**4 · Permitir `verified: true` con motivo.** Descartado, y es la tentación entera de esta tarea.
Un criterio que ya no se comprueba **no está verificado**. Decir las dos cosas es exactamente el
verde fingido que declararlo caído existe para evitar.

## Cómo se verifica

Casos sobre fixture con las cuatro combinaciones —con motivo, sin motivo, motivo trivial, y
`verified: true`—, más el negativo: sin la palabra, un `AC` sin escenario **sigue** siendo Orphan.
Ese último es el que hace válidos a los demás: sin él, una comprobación que aceptase todo también
pasaría.

`AC-04` se verifica sobre el **repositorio real**: el `AC-06` de `PT-113`.
