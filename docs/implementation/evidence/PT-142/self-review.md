# Autorrevisión — `PT-142`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

El nombre de cada rama de tarea se **contrasta** con el que `ramaDeTarea` deriva del registro. Y
la contradicción que había detrás queda resuelta.

## `CE-007` en su forma más limpia

`ramaDeTarea` lleva versiones derivando el nombre correcto y se usaba **una sola vez** —en
`tracker rama`, como **propuesta**—. `topologiaDeRamas` sólo comprobaba que la rama **contuviera**
un identificador que existe. Con eso pasaron tres:

```
PT-113 (BUG)   deriva bug/…/PT-113-la-guia-…    existia chore/…/PT-113-apertura
PT-081 (BUG)   deriva bug/…/PT-081-…            existia fix/…/PT-081-…
EP-020         deriva null                      existia chore/…/EP-020-viaje-de-vuelta
```

**Existe la herramienta y nada la echa en falta.**

## La tercera fila no era descuido: era una contradicción de reglas

`FDGE-R19` mandaba nombrar la rama de lote «con el `type` del propio lote». `LEX-R27` dice que
**un lote no lleva `type`** — `tracker tipo` lo rechaza citando esa regla, y `ramaDeTarea` devuelve
`null` para un `EP`.

**La regla pedía un dato que otra regla prohíbe que exista.** Eso no excusa haber inventado el
nombre teniendo delante un `null` que decía «no lo sé», pero sí **produce** ese error, y arreglar
sólo la conducta lo dejaría volver.

Manda `LEXICON` (`LEX-R21`). **`LEX-R27` no se toca**: cede la regla que contradecía al léxico, y
se escribe que el trabajo de lote viaja en la rama de una de sus tareas, declarado en
`SESSION_LOG.md`.

## Por qué el arreglo es la rama **siguiente**

`FDGE-R19` ya declara que una rama creada **se termina como empezó**: renombrarla rompe el pull
request abierto sobre ella. La comprobación **nombra** lo desviado y enseña el nombre derivado —
decir «mal» sin decir «así» obliga a ir a buscarlo.

Y `RIGE_DESDE` la acota a la `13.1.0`: juzgar las ramas anteriores sería `CE-014`.

## Lo que esta tarea NO establece

- **Cuántas ramas del histórico se desvían.** No se juzga hacia atrás.
- **Que renombrar sea posible.** No lo es sin romper pull requests.
- **Que un lote deba tener `type`.** Se decidió que **no**, y se dice por qué.

## Estado

| | |
|:---|:---|
| Escenarios | 4 de 4 |
| Contradicción de reglas | resuelta, y en la dirección que `LEX-R21` marca |
| Orphan Criterion | ninguno |
