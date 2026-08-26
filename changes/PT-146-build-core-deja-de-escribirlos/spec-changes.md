# PT-146 · `spec-changes.md`

```
PRD / TRD / API / esquema / eventos    sin cambios
Contratos                              FAMILIAS gana el campo «etiqueta»
CORE.md · CORE-PTSA.md                 IDENTICOS. Es la barra, no un efecto colateral.
```

## El contrato se **amplía** por primera vez

`PT-150` y `PT-145` consumieron el contrato de `PT-144` sin tocarlo. Ésta le añade un campo:

```
FAMILIAS[].etiqueta    el nombre humano de la seccion en CORE.md
```

Es **aditivo**: ningún campo existente cambia de nombre, tipo ni valor, y los tres consumidores
anteriores no se enteran.

Y dice algo del diseño de `PT-144` que conviene registrar: **el contrato admitió un campo nuevo
sin reescribir nada**. Era lo que aquella tarea no podía establecer por sí misma —«que el contrato
sirva»— y es la cuarta vez que se cobra.

## Comportamiento observable

**Ninguno.** `CORE.md` y `CORE-PTSA.md` salen byte a byte iguales, y eso es lo que `AC-02` mide.

Es la tarea del lote con la barra más alta, y con el precio mejor documentado: `build-core.mjs`
`:194` recuerda que hubo un momento en que `[START PTSA]` **auditaba con el 29 % de su propio
ruleset** porque las reglas no llegaban a runtime. Un `CORE.md` degradado no falla — deja al
agente operando con menos reglas de las que cree tener.

## Efecto en la versión

`MINOR` por la restricción aditiva de `EP-022` §3. Esta tarea no la tensa: no cambia
comportamiento observable ni el contenido de lo generado.
