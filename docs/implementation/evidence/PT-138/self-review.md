# Autorrevisión — `PT-138`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

`tracker aplazar`: la puerta de **ida**, con los tres datos que `SUITE-R44` nunca pidió —condición
de reentrada, fecha de revisión y dueño— exigidos **al escribir**, no en la compuerta.

## La carencia era simétrica, y no se vio hasta construir la otra mitad

`PT-137` encontró que `DEFERRED` no tenía **salida**. Midiendo esta tarea resulta que **tampoco
tenía entrada**: ningún comando escribía el estado. Las únicas apariciones del literal en
`tracker.mjs` eran la lista de estados, el filtro de `integrar` y el `retomar` recién escrito.

Los dos aplazados que existían se teclearon a mano, y por eso ninguno declaraba nada. Un estado
que ninguna herramienta escribe ni retira **sólo existe porque alguien lo teclea**.

## Por qué al escribir y no en la compuerta

Un dato que sólo se pide al final se rellena al final, y entonces es una fecha inventada. Al no
haber otra forma de escribir `DEFERRED`, la obligación **no se puede rodear**: no hay que
comprobar que se cumplió, porque no hay camino en que no se cumpla.

## El defecto que apareció construyéndolo, y lo cazó un caso

**La caducidad no se comprobaba sin git.** `hoy` salía de `gitDe(['log','-1','--format=%cs'])`, y
en un repositorio sin git eso es `null`; la condición era `hoy && revision <= hoy`, así que **la
comprobación se saltaba en silencio**.

Es `CE-005` —verde por no haber mirado— **dentro del comando que existe para impedir exactamente
eso**, y en la mitad del código que declara «un aplazado que nace caducado no se distingue del que
no declara nada». Lo cazó el caso sobre fixture, que no tiene git.

El arreglo lee el reloj del sistema cuando git no está. Se prefiere la fecha de git cuando la hay,
porque es la que usa el resto del marco.

## La inversa que declaraba un escenario y tumbaba otro

«Sin exigir los tres, se aplaza sin ellos» **no era cierto**: cada campo ausente lo caza otra
comprobación más abajo, así que la supresión producía un error distinto, no una escritura. La
inversa salía en rojo **por el motivo equivocado**.

Es el defecto que `PT-122` y `PT-130` encontraron en las suyas. Rehecha para medir lo que la
comprobación realmente aporta: que el fallo **nombre los tres de una vez** en vez de obligar a
ejecutar tres veces para descubrir que hacían falta tres.

## `AC-07` — los aplazados existentes, y por qué uno no se completa

| | |
|:---|:---|
| `PT-134` | No aplica: `PT-137` la retomó |
| `PT-025` | **No se completa**, y se dice por qué |

La **condición de reentrada** de `PT-025` sí se sabe: está en su propio `origin` —«no hay proyecto
que lo use»—. La **fecha de revisión** no. Elegirla sería inventar un dato que decide su dueño, y
es literalmente lo que `RULE-06` prohíbe.

La ruta existe y está probada —`aplazar` sobre algo ya `DEFERRED` **actualiza** sus términos, que
es como se migran los escritos a mano— y la salida en seco está en `salidas/pt-025.txt`. **El acto
es del firmante.**

`PT-139` no lo juzgará hacia atrás: su `suite_version` es anterior y `RIGE_DESDE` lo excluye
(`CE-014`).

## Lo que esta tarea NO establece

- **Que una condición de reentrada sea buena.** Se exige que **diga** algo; que diga algo **útil**
  no es mecanizable y se declara (`SUITE-R26`).
- **Que la fecha elegida sea la correcta.** Se exige futura. Que sea el momento adecuado, no.
- **Que un aplazado caducado bloquee.** Es `PT-139`.

## Estado

| | |
|:---|:---|
| Escenarios | 15 de 15 |
| Prueba inversa | 4 supresiones, 4 escenarios distintos |
| Orphan Criterion | ninguno |
