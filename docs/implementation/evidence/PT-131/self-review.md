# `PT-131` — Autorrevisión   `PHASE 6`

> Lo que salió mal, lo que casi sale mal, y lo que esta tarea **no** establece.

---

## Delta real contra lo planificado

| | Planificado en `PHASE 4` | Real |
|:---|:---|:---|
| Artefactos tocados | 3 | **4** — entró `inventory/services.md`, que no estaba |
| Casos | «los casos» | **5** |
| Defectos propios | — | **2**, los dos cazados **ejecutando** |

## Los dos defectos míos, y son de clases distintas

### 1 · Rompí `selftest.sh` con `$'` en un reemplazo

```js
t.replace(ancla, bloque)      //  bloque contenía   '^\["PT-010"\]$'
```

En `String.prototype.replace`, **`$'` significa «todo el texto que va después del match»**. Se
comió el bloque entero y dejó el archivo sin sintaxis válida — lo dijo `bash` al ejecutarlo, no yo
al leerlo.

**Es la familia de `SUITE-R59` en un sitio que la regla no cubre.** `SUITE-R59` habla de patrones y
de la línea de comandos. El **texto de reemplazo** es un tercer sitio donde el lenguaje interpreta
una secuencia y el autor no mira. Va a la matriz como instancia nueva, no como violación de una
regla existente.

**Cómo se arregló, y por qué así**: `git checkout` del archivo y rehacerlo con un **replacer de
función**, que desactiva los patrones `$`. Parchear encima de un archivo roto habría dejado el
daño a medias — el mismo criterio con el que `PT-107` decidió no reparar un checkpoint divergente.

### 2 · `FND-R14` se desvió, y **no lo arreglé a mano**

Cambiar líneas en cuatro herramientas desvió 4 de las 16 cifras de `inventory/services.md`.

```
node docs/methodology/tools/tracker.mjs inventario --aplicar
```

**Es exactamente lo que `PT-110` construyó** después de reimplementar el recálculo **siete veces a
mano dentro del lote que existe para usar el marco**. El comando existía; esta vez se le preguntó.

Que `FND-R14` lo cazara **en la batería, el mismo día, con el comando en el mensaje** es la clase
`CERRADA` comportándose como cerrada. Se registra como dato a favor, no como incidente.

## Lo que casi hago mal

**El primer diseño ponía `selladoEnTag` en `verify-fdge.mjs`**, donde estaba el síntoma. La habría
escrito allí y `tracker sellar` habría seguido con su copia — **que es literalmente cómo el defecto
de `PT-087` sobrevivió a su propio arreglo**: se corrigió un lado y el otro siguió midiendo con el
proxy viejo.

Lo que lo evitó fue **consultar el grafo**: `sinSellar` aparece con dos llamadores, y con eso el
sitio correcto era obvio. No lo evitó leer el código.

## Lo que esta tarea **no** establece

- **Que el tag esté publicado, ni que su contenido sea correcto.** Sólo que el directorio de la
  tarea existe dentro de él. Está escrito en el contrato de la función.
- **Que el estado terminal deje de llegar tarde.** Es `PT-121`. `PT-131` hace que esa demora deje
  de **bloquear**; no que deje de **ocurrir**.
- **Que el umbral 3 sea el correcto.** No se tocó y no se juzga.
- **Que no queden más proxies en `sellar`.** Se arregló **una** de sus comprobaciones. Las otras
  cuatro siguen igual, y eso se dice en `out-of-scope.md`.

## La cifra que importa

```
antes   ✗ SUITE-R57   17 tarea(s) sin sellar, umbral 3    G2 bloqueada en TODO el repositorio
ahora   ✓ SUITE-R57    0 integrada(s) sin sellar, umbral 3
        tracker sellar --ver   deuda de sellado  0 · umbral 3    <- la misma cuenta, dos fuentes
batería 1377 casos                                               <- 1372 + los 5 nuevos
```
