# PT-012 — Discovery   `PHASE 2` · análisis `2-B`

## Qué falla

`migrate.mjs` tiene tramos para `3.x → 4.x`, `< 4.1.0` y `< 4.2.0`. **Nada más.** Su informe
íntegro sobre un proyecto en 4.12.0, medido el 2026-08-13:

```
SE HARÍA AUTOMÁTICAMENTE    · REGISTRY.suite_version: 4.12.0 → 6.0.1
REQUIERE UNA PERSONA        ! actualizar suite_version en el CLAUDE.md
```

## Lo que no dice, y sí hace falta

Comprobado ejecutando `verify-fdge` de 6.0.1 contra ese proyecto tras arreglar `PT-011`:

```
✗ SUITE-R33   HANDOFF.md no abre con el bloque ESTADO
✗ SUITE-R16   CORE.md desincronizado
✗ SUITE-R17   versión desalineada
```

Los tres son resolubles y **ninguno aparece en el informe de `migrate`**. El primero exige
escribir algo que nadie sabe que existe si no lee el `CHANGELOG` de la 5.0.0.

## Dónde vive hoy esa información

En **prosa dentro del CHANGELOG**, en dos entradas distintas: la guía de la 5.0.0 lista cuatro
pasos y la de la 6.0.0 otros cinco. Quien migre desde 4.12 tiene que leer las dos, deducir qué
le aplica y acordarse.

`SUITE-R19` dice que una migración se **verifica**, no solo se ejecuta, y que lo que no puede
automatizarse se **lista como acción pendiente**. La herramienta cumple la primera mitad
—encadena `verify-fdge` al terminar— y no la segunda.

## Por qué enumerar no basta: hay que DETECTAR

Un tramo que imprima siempre los nueve pasos sería una lista que la mayoría no necesita. Lo que
falta no es texto: es que `migrate` **mire el proyecto** y diga qué le falta a **ese**
proyecto. Ya lo hace en los tramos de 3.x y 4.1 —comprueba si existe `REGISTRY.graph`, si
`HISTORY.log` declara `Estructural:`— y ese es el patrón a seguir.

## Conclusión

Defecto confirmado: el tramo no existe. La corrección es detectar, no recitar.

Confianzas: RootCause 100 % · Architecture 90 % · Solution 85 %.
