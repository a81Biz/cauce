# PT-145 · `design.md` — `PHASE 4` Proposal

## 1. Una función, no una constante

`verify-patrones.mjs:33` ya documenta por qué: *«un regex con `/g` conserva `lastIndex` entre
llamadas: reutilizarlo entre ejemplos daría resultados que dependen del orden»*.

Los cinco sitios de `verify-suite` usan el patrón de formas distintas —dos con `/g`, tres sin—,
así que el contrato expone **funciones que devuelven un patrón nuevo**:

```
reglaRE(banderas)     \b(PREFIJOS)-(R|P)\d+\b        -> :250 y :403
reglaEnTabla()        ^\|\s*`((?:PREFIJOS)-R\d+)`     -> :254
reglaEnLinea()        ^`((?:PREFIJOS)-R\d+)`\s*·      -> :256
PFX()                 (PREFIJOS)  como TEXTO           -> :289, que lo compone
```

`:289` es el único que necesita el prefijo **como cadena**, porque construye su propio patrón
alrededor. Se le da eso y no un `RegExp`, para no obligarle a deshacerlo.

## 2. Sin una barra invertida escrita — `SUITE-R59`

```
CLASE.limite          en vez de  '\b'
CLASE.digito          en vez de  '\d'
comoLiteral(p)        para cada prefijo
```

**Lo que no se escribe no se pierde.** Es la regla que ocho veces convirtió un verificador en
decoración en este repositorio: `\b` quedó como el byte `0x08`, `\s` como la letra `s`, y el
regex resultante era válido y no casaba nada.

## 3. `:708` deja de tener agujeros, y va solo

```js
// hoy
const RE_REGLA = /\b(?:SUITE|FDGE|INTAKE|LEX|FND|QA|PTSA|EXEC)-R\d+\b/;   // OCHO
```

Pasa a `reglaRE()`, que trae **diez**. `FPGE` y `FIDE` entran por primera vez en la comprobación
que guarda `EXEC-R08`.

**Es el único cambio de comportamiento de la tarea**, y por eso es el cuarto paso y va aislado: si
destapa una cita de regla en la matriz de compuertas, tiene que ser inequívoco que viene de ahí y
no de los tres pasos anteriores.

## 4. `comparar-marco` gana su primera arista

Tres imports, los tres de `node:`. Se le añade uno:

```js
import { opcionales } from './patrones.mjs';
```

No es acoplamiento nuevo: las otras ocho herramientas del lote ya dependen de `patrones.mjs`.
Era la única que tenía su propia copia **con otro nombre** —`OPCIONALES` frente a
`COMPONENTES_OPCIONALES`—, que es la forma en que dos nombres del mismo hecho divergen.

## 5. Rama propuesta — **no se crea aquí** (`FDGE-R13`)

```
refactor/alberto-martinez/PT-145-verify-suite-deja-de-escribirlos
```
