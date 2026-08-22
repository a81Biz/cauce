# PT-099 — Autorrevisión `PHASE 6`

## Este defecto me obligó a saltarme el marco tres veces

`PT-096`, `PT-097` y `PT-098` llegaron a `DONE` porque escribí `VALIDATION_PENDING` y luego `DONE`
**a mano**, declarando la excepción cada vez en `SESSION_LOG.md`.

No es un hallazgo traído de otro proyecto: es el que hizo falta rodear tres veces para cerrar las
tres tareas anteriores de este mismo lote. Eso lo convierte en el mejor caso de prueba posible, y
también en el más incómodo de escribir.

## La regla vigilaba la salida y nadie la entrada

`FDGE-R26` comprueba que un `BUG` **en `DONE`** lleve su firma de `G3`. Un `BUG` que llega a
`PHASE 9` con `READY` o `IN_REVIEW` **no está en `DONE`**, así que la comprobación no lo mira.

Es la forma exacta de `PT-096`: *una comprobación escrita para un fallo no ve su **ausencia***. Allí
era el enlace muerto contra el enlace que falta; aquí es el `BUG` mal cerrado contra el `BUG` que
nunca se detuvo.

Y la regla que se saltaba es la de **severidad más alta** del `LEXICON`: `grep -rn LEX-R08 tools/`
no devolvía nada.

## Extiende, no duplica

`PT-098` acaba de crear `estadoTerminalDe`, el único sitio que decide el estado. Añadir un segundo
habría sido la avería que `SUITE-R38` persigue **una tarea después de arreglarla**.

`estadoDeFase` lo envuelve. Y la inversa lo confirma: retirar la delegación en `estadoTerminalDe`
hace caer los dos casos de la última fase, no los de la parada — están conectados, no copiados.

## La fase avanza; el estado se detiene

`FDGE-R26` dice que el `BUG` «se detiene». Mi primer impulso fue detener **la fase**, y es el mismo
error que rechacé en `PT-098` (`A-1`): la fase sube porque el trabajo avanzó; lo que se detiene es
el `status`.

Confundirlos habría roto el flujo de todas las tareas para arreglar el de los `BUG`.

## Puse la comprobación en la función equivocada

`checkHistory` en vez de `checkPT`. `rige` no existe en ese ámbito, así que `verify-fdge`
**reventaba** — y 21 casos salieron como *«la herramienta reventó: no verifica nada»*.

**Eso no es un rojo**, y la distinción existe desde `PT-050` precisamente para esto. Sin ella
habría visto 21 fallos y buscado 21 causas.

Y aquí funcionaba: `verify-fdge PT-096` pasaba limpio porque no recorre el camino de `--gate G4`.
**Novena instancia del patrón «probar donde trabajo, no donde se decide»**, que el `HANDOFF` lleva
contando desde `PT-001`.

## Una aserción atada a una cifra que crece, y no era mía

Al asignar `PT-099`, el siguiente ID pasó a ser `PT-100` y el caso `asignar da un ID` —que
esperaba `PT-0`— cayó. **No se rompió nada: creció el contador.**

El bloque `no hacer` lo advierte: *«atar una aserción del arnés a una cifra que CRECE fallará algún
día sin que eso signifique nada. Pasó al llegar a 20»*. Pasó al llegar a 20 y acaba de pasar al
llegar a **100**.

Corregido atándolo a la **forma**. Y queda declarado que **no he auditado si quedan más**: el
patrón ya salió dos veces y la tercera será igual de silenciosa.

## `RIGE_DESDE` no es un trámite

51 `BUG` existentes nunca pasaron por `VALIDATION_PENDING` porque el comando no los llevaba. Sin la
fila, la comprobación los pondría a los **51 en rojo sin salida**: un estado por el que no se pasó
no se puede retrofechar.

Es `EXEC-R04a` de `PT-095`, otra vez, y la razón entera de que `L-5` exista.

## Lo que no hice

**La escalera completa.** `avanzar` tampoco escribe `IN_PROGRESS` ni `IN_REVIEW`. Arreglarla toca
el estado de **todas** las tareas y no sólo de los `BUG`. Va al `## Cierre del lote`.

Lo que esta tarea sí cierra es la transición que `LEXICON` marca **«siempre»** y que una regla
`HARD` de severidad `H` exige.
