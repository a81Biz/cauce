# PT-150 · `spec-changes.md` — `PHASE 4` Proposal

```
PRD / TRD / API / esquema / eventos    sin cambios
Contratos                              UNO NUEVO, interno: SEVERIDADES en patrones.mjs
LEXICON §8.3                           NO SE TOCA — es la fuente, y esta bien
INTAKE/templates/                      NO SE TOCAN — estan bien; el comando esta mal
```

## Comportamiento observable que SI cambia

Es un `BUG`, así que **el comportamiento cambia a propósito**, y conviene enumerarlo:

```
asignar --severidad S4     HOY falla    ->  ACEPTA
asignar --severidad S0     HOY acepta   ->  RECHAZA
el mensaje de error        HOY dice «LEXICON declara: S0 · S1 · S2 · S3»  ->  enumera S1..S4
verify-fdge                HOY no mira la severidad del registro  ->  caza S0 en trabajo VIVO
```

**Rompe compatibilidad de uso** en un caso estrecho: quien tuviera un guion que llamara a
`asignar --severidad S0` deja de funcionar. Es el objetivo del `BUG` —`S0` no existe en
`LEXICON`— y no hay ninguno conocido: la única allocation con `S0` se escribió antes de que
`asignar` escribiera el campo.

## Efecto en la versión

```
Bump esperado del lote:  MINOR, por la restriccion aditiva de EP-022 3.
```

Esta tarea es la que más cerca está de discutir ese `MINOR`: cambia el conjunto de valores
aceptados por un comando. Se sostiene como `MINOR` porque **acerca la herramienta al documento**
en vez de cambiar lo exigido: `LEXICON` siempre declaró `S1..S4`, y un proyecto instalado que
llame a `asignar` con una severidad de `LEXICON` **hoy falla y después funciona**.

Si el firmante lo lee al revés —que retirar `S0` es ruptura— se declara al cerrar el lote, que es
donde se fija el número (`EP-022` §Cierre).
