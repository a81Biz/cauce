# PT-095 — Descubrimiento   `PHASE 2`

## Lo primero fue distinguir «lo he roto yo» de «estaba latente»

```
$ git switch --detach 338a728     # el main de ANTES del merge
$ verify-fdge --all
✗ EXEC-R04a  SESSION_LOG.md, entrada del 2026-08-13: …  (×3)
```

**Ya estaban.** Lo que hace el merge no es crearlos: es **llegar al bloque**. Sin un merge nuevo
que contrastar, `checkG4ConConstancia` volvía antes y nadie los enumeraba.

Medirlo antes de arreglar nada evitó escribir un `PT` sobre una causa inventada. Es lo que faltó
al declarar «`cauce` está limpio en `main`» sin mirar los workflows.

## Los seis, y son de tres clases distintas

```
2026-08-13 ×3   «EP-00N cerrado · version X · A LA ESPERA DE G4»
2026-08-20 ×2   autorizaciones reales, sin el nombre en el cuerpo
2026-08-21 ×1   la mia: «Alberto Martinez», y firmantes dice «Alberto Martínez»
```

Las tres primeras son **falsos positivos**: el filtro es `/G4|VoBo|autorizad/` sobre el encabezado,
y «a la espera de `G4`» anuncia justo lo contrario de una autorización.

Las dos siguientes son **reales**, y se escribieron el 20 — antes de que `EXEC-R04a` existiera.

## Y aquí es donde la regla deja de poder cumplirse

`SESSION_LOG.md` es **append-only** (`SUITE-R09`). Las cinco no se pueden corregir editándolas, y
añadir una entrada nueva no cambia los bloques viejos: la comprobación los recorre todos.

**`main` queda rojo para siempre en cuanto haya un merge.** No es una regla exigente: es una regla
que se hace imposible con otra — exactamente lo que `PT-029` construyó un detector para encontrar,
y que no la encontró porque el choque no está entre dos textos sino entre un texto y un dato.

## La causa tiene nombre en este repositorio desde `PT-081`

`EXEC-R04a` entra en la `11.0.0`, etiquetada `v11.0.0` el **2026-08-20 21:57**. Está juzgando
entradas del **13 de agosto**.

`rigeGlobal('EXEC-R04a')` comprueba que **la suite** esté en 11.0.0 o más. **No comprueba que lo
juzgado sea posterior a la regla.**

`PT-081` construyó `RIGE_DESDE` para que «una regla nueva no rija hacia atrás» y quedó aplicado a
medias: la versión de entrada decide si la comprobación **corre**, no a qué **alcanza**. La mitad
que faltaba es la que muerde cuando lo juzgado es un ledger que no se puede reescribir.
