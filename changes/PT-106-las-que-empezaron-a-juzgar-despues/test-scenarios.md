# Escenarios de prueba — `PT-106`

## En la batería — ocho casos

| Caso | Qué establece |
|:---|:---|
| una regla que llegó con la 7.0.0 lo declara | la fila existe y es la real |
| …y una de la 4.14.0 | idem, otra versión |
| …y una de la 8.0.0 | idem |
| una regla del **primer commit** NO lleva fila | **el negativo**: no se inventa una restricción |
| …ni una que no emite nada | **el negativo**: sin emisión no hay juicio |
| la que discrepa conserva su valor real | `EXEC-R04` sigue en 11.0.0, no en 8.1.0 |
| …y la otra también | `SUITE-R09` sigue en 11.0.0, no en 4.13.0 |
| ninguna fila mira más allá de la versión que entra | coherencia |

## La inversa — tres retiradas, tres con efecto

```
S-1  las veinte filas          caen 3
S-2  una fila concreta         caen 1
S-3  el valor decidido a mano  caen 1   <- devuelve el valor que el CHANGELOG sugeriria
```

**`S-3` es la que importa.** Devolver `EXEC-R04` a `8.1.0` —lo que el `CHANGELOG` diría— hace
caer el caso. Es la prueba de que la batería distingue «cuándo se escribió» de «desde cuándo
juzga».

## Lo que NO se prueba

- Si las reglas de `PTSA` necesitan lo mismo.
- Que las 87 que no emiten deban emitir. Es otra pregunta, y `audit` ya la mide.
