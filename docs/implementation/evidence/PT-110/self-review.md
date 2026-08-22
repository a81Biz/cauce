# Autorrevisión — `PT-110`

## Lo que establecí

Que la deuda del inventario aparece **donde se decide sellar**, y no después.

## Lo que NO establecí

- **Qué más debería mirar `sellar`.** Se añadió el que cayó siete veces.
- **Que la descripción en prosa del inventario sea cierta.** Se miden las cifras.

## Lo importante, y es incómodo

**Parcheé `FND-R14` a mano siete veces teniendo el comando delante.** `tracker inventario
--aplicar` existía desde antes del lote. Las siete veces escribí un script de Python que
recalculaba las cifras — reimplementando una herramienta del propio marco, dentro del lote que
existe para que el marco se use.

Es la forma exacta que el firmante lleva señalando toda la sesión: **el marco tenía la respuesta
y yo no le preguntaba.**

**Y la causa de fondo no era que faltara la herramienta: era dónde se llama.** Una deuda que solo
aparece en la batería se descubre **después** de decidir sellar. Moverla al informe no la hace más
grave — la pone antes de la decisión.

## Lo que el arreglo detectó primero

**Su propia desviación.** Añadir la medición a `tracker.mjs` cambió el número de líneas de
`tracker.mjs`, y la primera corrida lo dijo:

```
  inventario         1 de 16 cifras ya no describen el arbol
                     tracker.mjs 3252→3291
```

## Lo que casi hago mal

Iba a escribir un recálculo **nuevo** dentro de `sellar`. Comprobar si ya existía uno es lo que
evitó duplicar una herramienta — la avería de `SUITE-R38` cometida dentro de la tarea que la
persigue.
