# PT-022 — Descubrimiento   `PHASE 2` · `FDGE-R42`

## El dato

`EP-004`, cinco tareas, la misma obligación pendiente para todas —la entrada de `CHANGELOG` y el
número de versión son cierre de lote, no de tarea—:

```
PT-011  no escribió la fila     PT-012  no escribió la fila     PT-013  no escribió la fila
PT-014  la escribió             PT-018  la escribió
```

Las dos que la escribieron fueron las bloqueadas. `PT-021` quitó el bloqueo, pero **la asimetría
sigue**: escribir lo que aplazas te expone a una comprobación; callártelo, no.

## Lo que no es mecanizable, y se dice

**No se puede detectar lo que no está escrito.** Ningún verificador sabe qué filas «debería»
tener un `out-of-scope`: eso exige conocer el alcance real de la tarea, que es justo lo que el
documento sirve para declarar. Cualquier intento —exigir que todas las tareas de un lote
escriban lo mismo, comparar unas con otras— produciría filas copiadas para pasar, que es peor
que la omisión: ruido con aspecto de rigor.

## Dónde está entonces el defecto real

En haber puesto la obligación en el sitio equivocado. La entrada de `CHANGELOG` **no es de
`PT-014`**: es de `EP-004`. Escribirla como fila en cinco `out-of-scope` distintos es la misma
regla copiada cinco veces — y `SUITE-R38` dice qué pasa entonces: **las copias divergen**. Aquí
divergieron a los dos días: tres copias no existían.

El lote es quien aplaza el cierre del lote. Ahí no se puede omitir por descuido en tres de cinco
sitios, porque solo hay un sitio.

## Lo que hoy no comprueba nadie

Que `EP-004` **haga** lo que sus tareas le aplazaron. `PT-014` cita `EP-004` y nada verifica que
`EP-004` responda. La reciprocidad que `PT-018` exigió a los `DEFERRED` —el destino reconoce su
origen— **no se le exige al lote**, que es el destino más citado de todos.
