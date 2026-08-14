# PT-028 — Descubrimiento   `PHASE 2` · `FDGE-R42`

`compararEspejo()` reclamaba los issues **solo desde las allocations vivas**:

```js
const reclamados = new Set((vivas ?? []).map((a) => a.issue));
```

Una allocation `INTEGRATED` no está viva, así que su issue quedaba sin reclamar y salía como
«trabajo que el registro no conoce». Falso: el registro lo conoce, lo tiene terminal, y su issue
sigue abierto **porque `SUITE-R46` obliga a que lo esté** hasta después del merge.

Es un choque entre dos reglas que escribí con horas de diferencia, y solo aparece **ejecutando**
el orden nuevo. Leerlas por separado no lo muestra: cada una es correcta.
