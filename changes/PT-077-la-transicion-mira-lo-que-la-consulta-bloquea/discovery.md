# PT-077 — Descubrimiento   `PHASE 2`

## La guarda existía una sola vez

`STATE_MISMATCH` vivía en `queSigue` —la función que responde `tracker siguiente`— y **no** en
`avanzar`, que es quien cambia el estado.

```
$ tracker siguiente
  ✗ BLOQUEA:  STATE_MISMATCH · el arbol no corresponde al checkpoint de PT-075 (LEX-R26)

$ tracker avanzar PT-075 --a 6
  · PT-075: PHASE 5 -> 6 Evidencia          <- avanzo igual
```

**Una compuerta que sólo vigila el camino que nadie usa no vigila.** `siguiente` es una consulta;
`avanzar` es el acto. La guarda estaba en la consulta.

## Conclusión

Es la misma familia que `PT-075` —una regla sin verificador no ocurre— con una vuelta más: **aquí
el verificador existía y estaba en el sitio equivocado.**

Y el arreglo no puede ser reparar el checkpoint automáticamente: reescribirlo borra la única
prueba de que hubo divergencia, y decidir si manda el árbol o la foto es de `SUITE-R06`. Se
detiene y se propone el comando, que es lo que `siguiente` ya hacía.
