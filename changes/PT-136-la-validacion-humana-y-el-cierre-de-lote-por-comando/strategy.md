# Estrategia — `PT-136`   `PHASE 3`

> `FDGE-R54`: viabilidad **`SAFE`**, registrada.

---

## El comando no decide: registra

`FDGE-R26` reserva la validación de un `BUG` a una persona, y eso **no cambia**. Lo que cambia es
que la decisión, una vez tomada, se pueda **escribir** sin rodear el registro.

Es la distinción entera del lote: un acto humano sin comando obliga a escribir el estado a mano, y
entonces no deja el rastro que el comando habría dejado. La defensa no es prohibir el acto — es que
exista la vía.

## Todas o ninguna

`validar` acepta varias allocations y **no escribe ninguna si una falla**. Cinco validaciones a
medias serían peores que ninguna: dejarían el registro en un estado que nadie decidió.

## La fecha se dice

Es la lección que `PT-121` aprendió usando `firmar` sobre una `G1` de **dos días antes**: una
compuerta se resuelve cuando se resuelve, y el comando puede correr después. Grabar «cuándo lo
escribí» donde pone «cuándo se validó» es una cifra plausible y falsa.

Por defecto sigue siendo hoy, que es el caso normal.

## Un lote cierra distinto que una tarea, y por eso tiene su propia rama

```
tarea    DONE   → INTEGRATED
lote     READY  → CLOSED, y sólo si ninguna tarea sigue viva
```

La condición se **deriva** de las tareas. Cerrar un lote con trabajo dentro sería declarar
terminado lo que no lo está — y el comando lo rechazó cuando lo intenté, nombrando las 22 tareas
que seguían en `DONE`.

**Nombrar, no contar**: un recuento correcto convive con cualquier hueco porque no dice cuál.

## Lo que NO se hace

- **No se decide por nadie.**
- **No se reescriben** las tres validaciones históricas hechas a mano (`SUITE-R09`).
- **No hay bandera** que permita cerrar un lote con tareas vivas. Una compuerta que se puede
  saltar con una bandera no es una compuerta.
