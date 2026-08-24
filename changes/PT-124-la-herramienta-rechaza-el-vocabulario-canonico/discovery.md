# `PT-124` — Descubrimiento   `PHASE 2-B`

## D-1 · El punto exacto, y son cuatro sitios

`tracker.mjs:2328`

```js
const TIPOS_DE_ITEM = ['BUG', 'FEATURE', 'CHANGE', 'TAREA'];
```

Y su mensaje de error **atribuye esa lista a `LEXICON`**:

```
«INVESTIGATION» no es un tipo de item. LEXICON declara: BUG · FEATURE · CHANGE · TAREA
```

Lo que `LEXICON` §8.1 declara de verdad, línea 943:

```
`BUG` · `FEATURE` · `REFACTOR` · `INVESTIGATION` · `CHORE`
```

Y lo mismo `Intake-Protocol` · `DoR-01`: *«el tipo está declarado y es uno de: `BUG` · `FEATURE` ·
`REFACTOR` · `INVESTIGATION` · `CHORE`»*.

## D-2 · El registro le da la razón a la documentación, no a la herramienta

```
BUG            76
CHORE          30      <- la herramienta lo rechaza
FEATURE        22
INVESTIGATION   2      <- la herramienta lo rechaza
CHANGE          0      <- solo existe en la herramienta
TAREA           0      <- solo existe en la herramienta
```

**Treinta y dos allocations usan tipos que el comando rechaza. Cero usan los que acepta de más.**

## D-3 · La consecuencia, medida hoy

`PT-125` y `PT-126` están en el registro **sin `type`**, porque el suyo —`INVESTIGATION` y
`CHORE`— fue rechazado y **no se escribió uno inventado** (`RULE-06`).

Y encadena: `tracker indices` reparte por `type` —`BUG`/`INVESTIGATION` a `DISCOVERY`, `FEATURE` a
`ENRICHMENT`, `REFACTOR` a `REFACTOR_SCOPE`—, así que las dos **no caen en ningún índice** y
`FDGE-R31` las pone en rojo: *«no aparece en ningún índice. FPGE no podrá verlo»*.

Fueron los **dos únicos errores** del árbol tras firmar el lote.

## D-4 · Es `LEX-R28` otra vez, en otro campo

`LEX-R28` nació exactamente de esto:

> *«La herramienta esperaba un conjunto y **tres documentos decían otro**: un plan escrito
> siguiendo la documentación fallaba la verificación.»*

Aquello fueron los tipos de caso `QA` (`EDGE`/`NEG` contra `EC`/`EF`). Esto son los tipos de
ítem. **La regla se escribió para un campo y el defecto vivía en otros.**

## D-5 · Y la lista está escrita a mano, no derivada

`TIPOS_DE_ITEM` es un array literal en `tracker.mjs`. No sale de `LEXICON` ni de `patrones.mjs`:
es una **cuarta representación** del mismo hecho, y la única que diverge.

`verify-qa.mjs:175` tiene su propio `declaraTipo` — para los tipos de **caso QA**, que es otro
vocabulario y está bien separado.

---

## Qué establece, y qué no

**ESTABLECE:** que la herramienta rechaza tres de los cinco tipos canónicos, que atribuye su lista
a `LEXICON` sin serlo, que 32 allocations usan los rechazados y ninguna los inventados, y que la
consecuencia encadena hasta `FDGE-R31`.

**NO ESTABLECE:** qué hacer con `CHANGE` y `TAREA`. O entran en `LEXICON` o salen de la
herramienta, y elegir es `PHASE 3`.

---

## D-6 · La causa, encontrada: es la lista de **plantillas**, no la de tipos

`CHANGE` y `TAREA` **no existen en ningún otro sitio del código**:

```
$ grep -rn "'CHANGE'|'TAREA'" tools/*.mjs   (excluyendo TIPOS_DE_ITEM)   ->  nada
```

Existen como **nombres de plantilla de intake**, y el `Intake-Protocol` lo dice:

```
BUG · INVESTIGATION   ->  templates/BUG-REPORT.md
FEATURE               ->  templates/FEATURE-REQUEST.md
REFACTOR · CHORE      ->  templates/CHANGE-REQUEST.md
una tarea de un lote  ->  templates/TAREA.md
```

**`TIPOS_DE_ITEM` es la lista de las cuatro plantillas, etiquetada como si fueran los cinco
tipos.** `BUG-REPORT` → `BUG`, `FEATURE-REQUEST` → `FEATURE`, `CHANGE-REQUEST` → `CHANGE`,
`TAREA` → `TAREA`.

Por eso se solapa en `BUG` y `FEATURE` —donde plantilla y tipo se llaman igual— y falla justo en
los tres donde no: `REFACTOR` y `CHORE` comparten plantilla, e `INVESTIGATION` comparte la de
`BUG`.

**No es una lista desactualizada: es una lista de otra cosa.** Y el mensaje de error la atribuye a
`LEXICON`, que nunca la declaró.
