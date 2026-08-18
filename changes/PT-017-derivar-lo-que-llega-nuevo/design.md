# PT-017 — Diseño   `PHASE 4`

## La resta

```js
const TOOLS_PAQUETE = resolve(dirname(fileURLToPath(import.meta.url)));   // de donde sale este script
const TOOLS_DESTINO = join(ROOT, 'docs', 'methodology', 'tools');

const lista = (d) => { try { return readdirSync(d).filter((f) => /\.(mjs|sh)$/.test(f)); } catch { return null; } };
const enPaquete = lista(TOOLS_PAQUETE);
const enDestino = lista(TOOLS_DESTINO);
```

Tres salidas, no dos (`RULE-06`):

```
enPaquete === null   → no se puede saber. Se DICE, y NO se cae en la lista escrita a mano
enDestino === null   → «la suite entera llega nueva: N herramientas»
resta vacia          → no se emite fila: nadie decide sobre una lista vacia
resta con N          → «llegan N que tu proyecto no tenia: a · b · c»
```

## La frase que no se puede tocar

El texto conserva **`lo que llega nuevo`** literal. El `PORQUE` de `PT-043` reconoce esta acción
por esa frase y le da su motivo; si se pierde, la fila cae en el `RULE-06` por defecto y el
conductor deja de explicarla. Está anotado en el código, junto al texto, y tiene su caso.

Es un acoplamiento real entre dos tareas del mismo lote, y prefiero declararlo a que lo descubra
quien reescriba el mensaje.

## Lo que este diseño **no** hace

No instala nada, no compara contenidos —solo presencia—, y no dice **qué hace** cada herramienta
nueva: para eso está `cauce regla` y el manual. Dice **cuáles** llegan, que es lo que la lista
prometía y ya no cumplía.
