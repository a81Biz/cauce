# PT-094 — Estrategia   `PHASE 3`

## Los cuatro caminos, y por qué tres se caen

| | Por qué se descarta |
|:---|:---|
| `tracker checkpoint PT-092` | Mueve el fallo de rama. No existe valor correcto para una tarea cerrada |
| Borrar `CHECKPOINT.json` | Deja verde borrando el dato. El siguiente lote lo reproduce |
| Que `LEX-R26` no compare `rama` nunca | Quita la mitad útil: una tarea VIVA en otra rama sí es una divergencia real |
| **No contrastar el checkpoint de una tarea TERMINAL** ✅ | Es lo que el propio artefacto declara (`SUITE-R36`) |

## Por qué `terminal` y no «rama que ya no existe»

Comprobar si la rama declarada sigue viva parece más preciso y es más frágil: en un clon superficial
o sin `fetch` de ramas remotas, **una rama viva puede no estar presente**, y la comprobación pasaría
a depender de cómo se clonó el repositorio.

El estado de la tarea sale del **registro**, que es la autoridad (`SUITE-R08`) y viaja con el
repositorio. `INTEGRATED` no significa «probablemente ya no hay rama»: significa que el trabajo se
fusionó, y entonces el árbol vivo es otro por definición.

## `DONE` es el caso que decide si está bien trazado

`ESTADOS_TERMINALES` **excluye `DONE` a propósito** desde `PT-085`: un `PT` en `DONE` espera `G4`
con su rama viva, y ahí un `sha` que describe otro árbol **sí** miente.

Heredar esa constante en vez de escribir una lista nueva es lo que hace que el arreglo no pueda
apagar de más — y su caso en la batería existe para que añadir `DONE` cueste un rojo, ahora en dos
reglas en vez de una.

## Tres resultados, no dos

`corresponde: null` ya existía para «no hay checkpoint». Se extiende a «no hay nada que
contrastar», y `verify-fdge` tiene que **decirlo como lo que es**:

```
✓ LEX-R26  ... NO ESTABLECE que el arbol sea el bueno.
```

Decir «corresponde» sobre algo que no se contrastó sería afirmar más de lo que se sabe — el mismo
arreglo que `PT-089` hizo con `MISSING`.

## Y el límite, al mensaje

`AC-06`. El de `detached HEAD` vivía en un comentario desde `PT-056`, **donde sólo lo ve quien ya
está leyendo el código**. Ahora `LEX-R26` declara su sujeto en `SUJETOS` y la corrida en detached
HEAD lo dice en voz alta.

## Orden

```
1  el caso que reproduce el fallo, y verlo en ROJO
2  el arreglo en las tres herramientas
3  la prueba inversa: deshacer el arreglo y ver caer los casos previstos
```
