# `PT-149` · `test-scenarios.md` — `PHASE 4`

| TS | Qué prueba | Cómo puede fallar | Mecanismo |
|:---|:---|:---|:---|
| `TS-01` | De `tools/` **sólo cambia el contrato** | alguien vuelve a meter el componente en otra herramienta | `diff -rq tools/` → 1 |
| `TS-02` | `build-core` lo cuela en `CORE.md` con sus fases | se revierte el colador | `^ZT ` |
| `TS-03` | …y con su trigger | idem | `[START ZETA]` |
| `TS-04` | `verify-suite` recoge el prefijo nuevo | la alternancia vuelve a ser literal | `ZTA` ∈ `prefijos()` |
| `TS-05` | `audit` lo audita | `audit` deja de recorrer `COMPONENTES` | `Zeta 1-3` |
| `TS-06` | …contando, no de pasada | la anchura deja de publicarse | `(7 de 7)` |
| `TS-07` | `verify-patrones` admite un séptimo | vuelve una fijación | `Todos los patrones cumplen` |
| `TS-08` | **Perder un componente sigue siendo rojo** | la corrección se vuelve un apagado | `«no puede perder ninguno»` |
| `TS-09` | **Perder una familia sigue siendo rojo** | idem, por el otro lado | `«ninguna puede desaparecer»` |
| `TS-10` | **Alterar el orden de las familias sigue siendo rojo** | «contiene» sustituye a «igual» y deja de mirar el orden | `«EN SU ORDEN»` |
| `TS-11` | La baja deja el árbol **byte a byte** | la baja deja residuo | `diff -rq` → 0 |
| `TS-12` | El árbol **real** no se ha tocado: ni `patrones.mjs` ni `CORE.md` nombran el fixture | el caso deja de trabajar sobre copias | `chkno` ×2 |

## `TS-08`, `TS-09` y `TS-10` son los que impiden que esto sea una desactivación disfrazada

Fueron **seis** fijaciones, no una, y las seis podrían haberse «corregido» borrándolas. La
propiedad que se quería preservar tiene **dirección**: el contrato debe poder **crecer** y no puede
**encoger**. Sin estos tres casos, la corrección sería indistinguible de haber apagado la
comprobación — que es el defecto que este lote entero persigue.

**`TS-10` es el que más fácil habría sido perder.** Cambiar «igual a la lista» por «contiene la
lista» habría dejado de comprobar **el orden**, y `CORE.md` se emite con él. Se comprueba la
**subsecuencia** de las diez conocidas: admite una familia nueva, no admite un reordenamiento.

## `TS-11` es el que convierte la demostración en prueba

«Restable» sin comparar el árbol significaría sólo que el componente **deja de funcionar**, no que
se **pueda quitar**. Se compara la copia con una copia prístina de partida, y la cuenta de
diferencias tiene que ser **cero**, no «pocas».

## `TS-05` y `TS-06` no asertan sobre lo natural, y es a propósito

Lo natural sería buscar `Zeta PHASE 1` en la salida de `audit`. **No vale**: esa línea sólo se
emite cuando hay un **hueco**, y `audit` da por cubierta una fase si el número aparece en
cualquier sitio del documento (`PT-168`). Un caso apoyado ahí pasaría **por el falso positivo**.
Se aserta sobre la anchura, que sí deriva de `COMPONENTES`.

Es la misma lección que `PT-156` sacó de los tres casos invertidos de `PT-147`, aplicada **antes**
de escribir el caso en vez de después de verlo en rojo.

## `TS-12` existe porque «estructural» no es un escenario

`AC-06` se declaró cumplido *por construcción* —todo ocurre sobre copias, así que el árbol real no
puede ensuciarse— y `verify-fdge` lo rechazó como **Orphan Criterion** (`FDGE-R15`). Tenía razón:
un criterio sin escenario es un criterio que **nadie comprueba**, y «es imposible por diseño» es
justo la clase de afirmación que este lote existe para no aceptar sin medir.

Se comprueba **en el sitio y el momento en que una fuga existiría**: inmediatamente después de que
los once casos anteriores hayan dado de alta y de baja el componente once veces.

## Lo que estos casos NO establecen

Que el componente de prueba **funcione**. No tiene fases reales, ni prompts, ni especificación. Se
prueba el **alta y la baja**, no el componente — y se dice en vez de dejarlo implícito
(`SUITE-R26`).
