# `PT-126` — Cambios de especificación   `PHASE 4`

> `SUITE-R06e`: modificar `docs/methodology/` **no se automatiza** — se propone aquí y se resuelve
> en `G2`.

---

## `FPGE-Implementation.md` §2 — una fuente de evidencia más

| | |
|:---|:---|
| **Antes** | La recolección lee `PTSA`, `QA`, `HANDOFF`, `HISTORY`, `INCIDENTS`, `DISCOVERY`, `BACKLOG`. Ninguna dice **qué se repite** |
| **Después** | `MATRIZ.md` entra como fuente: toda clase con recuento ≥ el umbral declarado y **sin regla que la reclame** es candidato, citada por su `CE-nnn`. Y también el caso peor: una clase con regla dueña cuya columna dice que **nada emite por ella** |

**El umbral no se escribe ahí.** Vive en `REGISTRY.tracker.umbral_clase_sin_dueno`, y el documento
lo cita por su nombre. Dos números que puedan divergir es `CE-008`, la clase que la matriz cuenta:
repetirlo aquí sería cometerla en el documento que la publica.

`FPGE-R04` **no cambia**: el marco propone, la persona dispone.

## Ninguna regla nueva

`LEX-R31` ya existe desde `PT-118` y ya dice que las clases se citan. Lo que faltaba era **algo
que lo comprobara**, y eso es código, no norma. `PHASES.md` y `FDGE-Prompts.md` ya piden el campo
`Clase de evento` desde `PT-118`.

## Autoridad

`LEX-R21` · la obligación vive en `LEXICON`; `FPGE-Implementation` describe procedimiento y
**cita**. `LEX-R23` · el umbral se define en un solo sitio.
