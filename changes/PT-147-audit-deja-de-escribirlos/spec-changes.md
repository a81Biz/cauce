# PT-147 · `spec-changes.md`

```
PRD / TRD / API / esquema / eventos    sin cambios
Contratos                              ninguno nuevo: se CONSUME el de PT-144
LEXICON                                NO SE TOCA
```

## Comportamiento observable que **sí** cambia

```
FIDE   no aparecia en la auditoria de fases  ->  aparece, con rango 1-5
FPGE   no aparecia                            ->  aparece como SIN_EVALUAR
```

**Y el total de `audit` sube**: la línea base es `fase: 40`, de cuatro componentes. Con seis será
mayor, y eso **no es una regresión**: es que se está midiendo lo que no se medía.

**Puede poner el informe en rojo** si `FIDE` no cubre alguna de sus cinco fases. Sería un
hallazgo del lote, no un fallo de la tarea.

## Efecto en la versión

`MINOR` por la restricción aditiva de `EP-022` §3. Endurece una comprobación existente —hace
visible lo que no se miraba— sin cambiar lo exigido: **`FIDE` y `FPGE` ya debían declarar sus
fases; lo que cambia es que ahora se comprueba.**
