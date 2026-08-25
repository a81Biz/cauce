# Descubrimiento — `PT-142`   `PHASE 2`

## Dónde está, con archivo y línea

`ramaDeTarea` vive en `patrones.mjs` y se usa **una sola vez**: `tracker.mjs:2821`, dentro de
`tracker rama`, como **propuesta**. Ninguna comprobación la usa para **juzgar**.

`topologiaDeRamas` sólo comprueba que la rama **contenga** un identificador que exista:

```js
const id = r.match(/\/((?:PT|EP)-\d+)-/)?.[1] ?? r.match(/\/((?:PT|EP)-\d+)$/)?.[1];
```

El `type` y el slug **no se miran**.

## Lo que pasó con eso

```
                deriva la herramienta                              existia
PT-113 (BUG)    bug/alberto-martinez/PT-113-la-guia-…-incompleta   chore/…/PT-113-apertura
PT-081 (BUG)    bug/alberto-martinez/PT-081-una-regla-…            fix/…/PT-081-…
EP-020          null                                               chore/…/EP-020-viaje-de-vuelta
```

Tres ramas, y ninguna comprobación lo dijo. Es `CE-007`: existe la herramienta y nada la echa en
falta.

## Y la contradicción de reglas detrás de la tercera fila

`FDGE-R19` manda nombrar la rama de lote «con el `type` del propio lote». `LEX-R27` dice que **un
lote NO lleva `type`** — `tracker tipo` lo rechaza citando esa regla, y `ramaDeTarea` devuelve
`null` para un `EP`.

`LEXICON` manda sobre `RULES` (`LEX-R21`), así que **la rama de lote no tiene forma derivable**.
La regla pedía un dato que otra regla prohíbe que exista, y eso **produjo** el nombre inventado.

## Qué NO se midió

- **Cuántas ramas del histórico se desvían.** No se juzga hacia atrás: una rama ya creada se
  termina como empezó, porque renombrarla rompe su pull request.
