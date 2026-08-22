# Spec changes — `PT-100`

## Dos reglas **nuevas**, y las dos declaran un nombre que faltaba

```
LEX-R27   un lote NO lleva «type»: se reconoce por su identificador
LEX-R28   el tipo de un caso QA es HP · EC · EF · REG
```

**Ninguna crea una obligación nueva.** `LEX-R21` ya dice que los nombres van a `LEXICON`; estas
dos ponen ahí dos que no estaban. Lo que cambia es que ahora **hay a quién preguntar**.

## Una regla **modificada**, y sólo en el nombre que cita

```
FDGE-R52   «bitacora.md del PT»  ->  «docs/implementation/TRANSICIONES.log»
```

**Su obligación no cambia**: la nota de reanclaje sigue siendo obligatoria en cada transición. Lo
que cambia es el destino que nombra, para que coincida con el que la herramienta usa desde que
`tracker.mjs:2509` lo movió deliberadamente (`SUITE-R09`, append-only).

## `RIGE_DESDE` — no aplica, y se dice

`LEX-R27` y `LEX-R28` **declaran** nombres; no juzgan trabajo pasado. Y `FDGE-R52` ya tiene su fila
(`[5,0,0]`) — no cambia porque la obligación es la misma.

**Y una consecuencia que conviene declarar:** ningún `QA-PLAN` existente se invalida. Este
repositorio no tiene ninguno, y el único proyecto que corrió `QA` escribió el suyo siguiendo la
documentación — que es la que gana.

## Documentos generados

```
CORE.md   se REGENERA: lleva FDGE-R52 y ahora LEX-R27 y LEX-R28. 249 -> 251 reglas.
```

## Compatibilidad con proyectos destino

- Un proyecto con `qa/` en minúsculas **pasa a verificarse**, donde antes se saltaba en silencio.
  Eso puede poner en rojo un ciclo que hoy «pasa» — **es el objetivo**, y se dirá en la guía.
- Un `QA-PLAN` con `EDGE`/`NEG` dejaría de validar. No se conoce ninguno: los tres documentos
  dicen `EC|EF` desde siempre.
