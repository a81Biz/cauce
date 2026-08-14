# PT-041 — Diseño   `PHASE 4` · `FDGE-R21`

```js
export function definicionDe(id, leer)      → { documento, texto } | null
export function fallosPosibles(fuentes)     → [{ id, bloquea, avisa, herramientas[] }]
```

Puras las dos: quien llama les pasa lo que ya leyó. El CLI es quien toca el disco.

`fallosPosibles` recorre `(fail|warn)\('ID'` y distingue **bloquea** de **avisa**, que no es lo
mismo y el manual los mezclaba.

Enganchado al binario: `cauce regla <ID>` y `cauce regla --fallos`.
