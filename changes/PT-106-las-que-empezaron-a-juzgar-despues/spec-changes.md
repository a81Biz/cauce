# Cambios de especificación — `PT-106`

**Ninguna regla cambia.**

| | |
|:---|:---|
| Reglas nuevas | ninguna |
| Reglas modificadas | ninguna |
| Reglas derogadas | ninguna |
| `RIGE_DESDE` | **veinte filas nuevas**, derivadas del árbol |
| Vocabulario nuevo | ninguno |

Lo que cambia es **el alcance** de veinte reglas que ya existían: dejan de juzgar trabajo escrito
antes de que ellas pudieran fallar.

## Sobre el número de versión

El reparto declaraba `L-5` como **candidata a `MAJOR`** porque «cambia a qué alcanza cada regla».

**La medición lo matiza:** ninguna regla gana alcance — veinte lo **pierden** hacia atrás. Un
proyecto destino no puede empezar a fallar por esto; solo puede dejar de fallar. La decisión del
número la toma el sello (`SUITE-R57`) mirando el lote entero, y esta tarea **no la fuerza**.
