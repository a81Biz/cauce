# Diseño — `PT-110`

## Dónde va

En `sellar`, **antes** del bloque del grafo, con la misma forma que las otras tres mediciones:

```
  inventario         las 16 cifras coinciden con el arbol.

  inventario         5 de 16 cifras ya no describen el arbol
                     selftest.sh 5569→5808, tracker.mjs 2991→3291, …
                     Se recalculan: node tools/tracker.mjs inventario --aplicar (FND-R14)
```

## Los tres desenlaces

| Situación | Qué se publica | Por qué |
|:---|:---|:---|
| coinciden | «las N cifras coinciden con el árbol» | el verde se dice, no se calla |
| desviadas | cuántas, cuáles y **el comando** | `EXEC-R07`: lo que no se automatiza se describe |
| ilegible | **`SIN EVALUAR`** | `RULE-06`: un silencio es indistinguible de «todo coincide» |

El tercero es el que importa. Sin él, un `services.md` ilegible produciría el mismo informe que
uno perfecto.

## Lo que NO hace

**No las reescribe.** `sellar` informa; el comando que arregla ya existe y se **nombra**.

## Lo que el arreglo detectó primero

Su propia desviación: añadir la medición a `tracker.mjs` cambió el número de líneas de
`tracker.mjs`, y la primera corrida lo dijo.

```
  inventario         1 de 16 cifras ya no describen el arbol
                     tracker.mjs 3252→3291
```
