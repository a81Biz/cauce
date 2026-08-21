# PT-094 — Descubrimiento   `PHASE 2`

## Lo que la corrida dice, literal

```
✗ LEX-R26  CHECKPOINT.json de PT-092 NO corresponde al arbol (STATE_MISMATCH) —
           rama: declarado chore/alberto-martinez/EP-018-cierre, real main.
```

## Lo primero que hice fue lo que el propio mensaje propone, y estaba mal

El mensaje termina con `Si el arbol es el bueno:  tracker checkpoint PT-092`. Es un consejo
correcto para el caso que `PT-056` tenía en la cabeza, y **aquí sólo mueve el fallo de sitio**:

```
tracker checkpoint PT-092  ejecutado en main      ->  rama: "main"      ->  falla en trabajo
tracker checkpoint PT-092  ejecutado en trabajo   ->  rama: "trabajo"   ->  falla en main
```

El checkpoint anota la rama de **la sesión que lo escribió**. Después de cualquier merge, la rama
que CI comprueba nunca es ésa. **No hay valor correcto que escribir ahí para una tarea cerrada.**

## Lo segundo que probé, y era peor

Retirar `CHECKPOINT.json`: `checkCheckpoint` vuelve antes si el archivo no existe. Verifica limpio
en un minuto.

Y no arregla nada: deja verde borrando el dato en vez de corregir la lectura, y el siguiente lote
lo reproduce igual. **Es la definición de apagar el mensaje.** Por eso está en el `out-of-scope` y
por eso `AC-05` exige un caso que falle sin el arreglo — «ya no sale el mensaje» se consigue
borrando un archivo.

## Los tres huecos, medidos

```
grep ramaDeclaradaViva tools/*.mjs   ->  2 aciertos: la definicion y checkpoint()
                                          avanzar NO esta
allocations con campo «branch»       ->  31 de 111
allocations en estado terminal       ->  110 de 111
PT-092.branch                        ->  ausente
git rev-parse refs/heads/chore/alberto-martinez/EP-018-cierre  ->  fatal
```

`(a)` es el más incómodo de leer: `PT-056` **construyó** la guarda para este caso —su comentario
dice *«al integrar, la rama de tarea se borra y el checkpoint pasaba a afirmar una referencia
muerta»*— y la conectó sólo al camino manual. `avanzar` es el que escribe el checkpoint en cada
transición de fase, o sea **el que de verdad lo escribe**.

`(b)` explica por qué la guarda tampoco habría bastado: `PT-092.branch` no existe, así que
`declaradaViva` habría sido `null` y `rama` habría caído igual a la de la sesión.

`(c)` es el de fondo, y estaba escrito **dentro del archivo que fallaba**:

```json
"siguiente": "PT-092 ya es INTEGRATED. Lo cerrado es evidencia, no estado (SUITE-R36)."
```

## Por qué ningún PR lo cazó

`actions/checkout` deja **detached HEAD** en un `pull_request`. `PT-056` trata la cadena `HEAD`
como «no se puede leer la rama» —correcto, y lo encontró CI en su propio primer PR—, con un efecto
que nadie escribió: **la comprobación es ciega exactamente donde todos los PR la ejecutan**.

Sólo ve en el `push` a `main` y en `workflow_dispatch`. Es decir: **sólo donde ya no hay PR que
bloquear**. Una comprobación que no puede fallar donde se ejecuta siempre no protege la rama que
existe para proteger.
