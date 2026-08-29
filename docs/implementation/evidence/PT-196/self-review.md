# `PT-196` · self-review

## Lo que se sostiene

- **`AC` verificados: 3, ninguno huérfano.** Seis casos ejecutables sobre cuatro escenarios.
- **`AC-02` lleva tres casos y los tres hacen falta.** Que una fila `TRAS EL MERGE` no bloquee lo
  cumple un `SUITE-R45` que no exija **nada**; que una `PENDIENTE` sí bloquee prueba que la puerta
  no quedó abierta; y que una `HECHO` siga resolviendo prueba que la conducta anterior sigue en pie.
- **`AC-01` se **deriva**, no se enumera.** `cierreDeLote` mira el reparto de las tareas del lote y
  contesta lo que toca. No añade estado: si mañana el reparto cambia, la respuesta cambia sola.
- **La contradicción era real y está medida.** Al cerrar `EP-025`, `SUITE-R45` exigía resolver
  «el tag y la publicación» **en** `G4`, y `SUITE-R06a` prohíbe el tag **antes** del merge. `G4`
  **es** el merge: no existía respuesta correcta, y la única salida fue mover la fila a otra tarea.

## Lo que NO se arregla, y consta   `SUITE-R26`

- **El doble viaje no se elimina: se declara.** Lo causa `SUITE-R46`, que exige el estado terminal
  en la rama por defecto antes de cerrar issues —y nació de una avería real: la principal
  declarando un estado vivo con el issue ya cerrado. Quitarla para ahorrar un merge cambiaría una
  molestia por un defecto. Lo que cambia es que **esté escrito donde se ejecuta** en vez de
  descubrirse chocando.
- **Ni el merge a `main` ni el tag se automatizan** (`SUITE-R06a`, `EXEC-R07`). El cierre los
  **enumera** con su orden; ejecutarlos sigue siendo humano.
- **`PHASE 9` sigue terminando en el merge.** No se crea una `PHASE 10` para el lote: las fases son
  del `PT` y añadir una para el lote mezclaría dos ciclos. El cierre del lote es procedimiento
  **del lote**, con su comando propio.

## El error que da nombre a la tarea

Cerrar un lote falló **siete** veces, siempre después de `G4`, y ninguna de las siete fue el mismo
síntoma. Esa es la señal: no eran siete descuidos, era un tramo sin dueño. Seis actos escritos como
**prosa** dentro de una fase que ya había terminado, ejecutados de memoria —y lo que se ejecuta de
memoria falla donde la memoria falla, que es en un sitio distinto cada vez.

## Un caso que se corrigió al ejecutar

`PHASES declara el doble viaje` esperaba el literal en minúsculas y el documento lo escribe en
mayúsculas. Falló en la corrida acotada, no en la revisión. Es exactamente lo que `PT-181` compró
al pasar las expectativas de regex a literal: la expectativa se equivoca **en voz alta**.

## Sin bloqueadores
