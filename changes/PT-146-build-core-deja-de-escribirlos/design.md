# PT-146 · `design.md` — `PHASE 4` Proposal

## 1. El campo `etiqueta`, y dónde va

Va en `FAMILIAS` y no en `COMPONENTES`, porque `label` tiene **diez** entradas: incluye `SUITE`,
`LEX`, `EXEC` e `INTAKE`, que son familia de reglas y **no** componente.

```
{ prefijo: 'SUITE', documento: 'RULES.md', orden: 1, etiqueta: 'Transversales' }
```

Es la primera vez que una tarea **amplía** el contrato de `PT-144` en vez de sólo consumirlo, y
el motivo conviene decirlo: el contrato se diseñó sobre los sitios que la enumeración conocía, y
`label` no estaba entre ellos porque **el barrido se hizo con `grep` sobre patrones de prefijo** y
`label` es un objeto — sus claves no casan ninguna alternancia.

## 2. Las cuatro llamadas se mantienen, y sólo cambia de dónde sale el prefijo

```js
// hoy
.concat(proseRules(rules,   ['SUITE','FND','FDGE','INTAKE','QA','FPGE','FIDE']))
.concat(proseRules(lexicon, ['LEX']))
.concat(proseRules(exec,    ['EXEC']))
.concat(ptsaCited(rules))
```

Cada una **lee un archivo distinto**, así que no se colapsan en un bucle: colapsarlas sería
reescribir el mecanismo, y la barra de esta tarea mide **identidad byte a byte**, no elegancia.

Lo que cambia es que el prefijo sale del campo `documento` que `PT-144` ya puso en `FAMILIAS`:

```
familiasEnProsa()              -> las 7 de RULES.md
familiasDe('LEXICON.md')       -> ['LEX']
familiasDe('EXECUTION-MODES.md') -> ['EXEC']
```

`ptsaCited()` no cambia: no recibe una lista, tiene su propio mecanismo.

## 3. `--check` es la barra, y se ejecuta en **cada** paso

`build-core` produce `CORE.md` y `CORE-PTSA.md` — lo único que el agente carga (`SUITE-R15`). La
herramienta que mide la identidad ya existe:

```
node docs/methodology/tools/build-core.mjs --check docs/methodology
```

El precio de que esto se descuadre está escrito en el propio archivo (`:194`): hubo un momento en
que `[START PTSA]` **auditaba con el 29 % de su propio ruleset**. Un `CORE.md` degradado no falla
—deja al agente operando con menos reglas de las que cree tener—, así que aquí «sin errores» no
es suficiente: tiene que ser **byte a byte**.

Por eso los cuatro pasos se validan uno a uno. Si la identidad se rompe, se sabe con **un** sitio
tocado.

## 4. Los triggers

`:433-437` es un bloque de texto dentro de una plantilla, no una estructura:

```
[START FIDE] [START FOUNDATION] [FOUNDATION VALIDATED]
[START PT] <tipo>: <título> · [START EP] <título> · resume PT-XXX · status FDGE
…
```

Mezcla **triggers de arranque** —que el contrato tiene en `COMPONENTES[].triggers`— con
**operaciones sobre un componente ya activo** (`resume PT-XXX`, `status FDGE`, `delta QA PT-XXX`),
que el contrato **no** tiene y que `LEX-R16` distingue explícitamente: *«`[VERB COMPONENT]` para
triggers de arranque en corchetes; `verbo componente [argumento]` en minúscula para operaciones
sobre un componente ya activo»*.

**Sólo se deriva la mitad que el contrato conoce.** Las operaciones se quedan como texto, y se
dice por qué: derivarlas exigiría meter en `COMPONENTES` un campo `operaciones` que **ningún otro
sitio necesita**, y `scope.md` §8 declara que no entra ningún campo que no salga de un sitio
medido.

Es una decisión de alcance, no un olvido: el bloque queda **mitad derivado, mitad literal**, y eso
se declara en `HISTORY` como lo que la tarea no establece.

## 5. Rama propuesta — **no se crea aquí** (`FDGE-R13`)

```
refactor/alberto-martinez/PT-146-build-core-deja-de-escribirlos
```
