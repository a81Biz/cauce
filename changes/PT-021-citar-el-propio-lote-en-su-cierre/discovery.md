# PT-021 — Descubrimiento   `PHASE 2` · `FDGE-R42`

Una línea, en `checkAplazado()` de `verify-fdge.mjs`:

```js
if (dest.id === yo?.epic && dest.status === 'CLOSED') continue;
```

## El ciclo que la hace imposible

```
G4 exige que la fila cite un destino válido
el destino es el propio lote
el propio lote solo vale si está CLOSED
un lote llega a CLOSED tras el merge
el merge ES G4
```

No hay orden de operaciones que lo satisfaga. La regla no es estricta: es **inalcanzable** para
ese caso.

## Y un segundo hallazgo, que no es de esta tarea

`RULES.md` seguía describiendo `SUITE-R44` con la lista de palabras que `PT-018` **eliminó** del
código. `PT-018` declaró ese cambio en su `spec-changes.md` y no lo hizo: la regla escrita y la
regla ejecutada llevaban un día divergiendo, que es exactamente el defecto que la v4 nació para
eliminar. `verify-suite` no lo vio porque comprueba que la regla exista y esté citada, no que
diga lo que el código hace.

Corregido aquí junto al cambio de esta tarea —dejar la regla mintiendo un día más para respetar
el alcance sería peor—, y **anotado** como lo que es: un defecto de `PT-018`, encontrado por
`PT-021`.
