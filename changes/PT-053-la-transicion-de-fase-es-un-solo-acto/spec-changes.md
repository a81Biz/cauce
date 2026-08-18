# PT-053 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Cambio |
|:---|:---|
| `LEXICON.md` | **`avanzar` nuevo**: una acción más de `tracker`, junto a las que ya están (`LEX-R21`) |

Una fila, y **no** una regla. `PT-052` necesitó `LEX-R26` porque introducía un artefacto con un
contrato que había que sostener; aquí no hay contrato nuevo: `avanzar` **llama** a lo que ya
existe —`queSigue`, `checkpointDe`, el adaptador— y no cambia qué exige ninguna regla.

Lo que cambia es **cuándo se hacen los actos**, y eso es procedimiento, no norma.

**Consecuencia para el cierre:** `CORE.md` se compila desde `LEXICON.md`, así que hay que
regenerarlo. La fila condicional del `## Cierre del lote` ya se cumplió en `PT-052`; ésta la
confirma por segunda vez.
