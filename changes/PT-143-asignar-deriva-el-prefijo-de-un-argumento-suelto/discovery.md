# Descubrimiento — `PT-143`   `PHASE 2`

## La línea

`tracker.mjs:2559`:

```js
const prefijo = ARGS.slice(1).find((a) => /^[A-Z]+$/.test(a)) ?? 'PT';
```

El valor de `--tipo` es también un argumento en mayúsculas.

## Medido con `--ver`, antes de escribir nada

```
tracker asignar --tipo BUG --severidad S2 --titulo "…"      ->  BUG-001
tracker asignar PT --tipo BUG --severidad S2 --titulo "…"   ->  PT-137
```

`BUG-001` **no es un espacio de nombres declarado**: `LEXICON` §4.3 enumera los contadores y `BUG`
no está entre ellos. Un identificador así no tiene contador que lo reconozca.

## La información para no cometerlo estaba a diez líneas

`CON_VALOR` es un conjunto que declara **qué banderas llevan valor**. La lectura del prefijo no lo
consultaba: adivinaba qué era un argumento en vez de leer su posición o su bandera.

Es `CE-003`, argumento por detección — una de las clases **sin regla que la reclame**, con siete
instancias contadas.

## Cómo se vio

Ejecutando `--ver` **antes** de escribir, que es exactamente para lo que esa bandera existe.

## Qué NO se midió

- **Si otras acciones leen argumentos posicionales con el mismo patrón.** Se enumera lo que se ve
  y no se promete un barrido que no se ha hecho.
