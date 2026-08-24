# `PT-129` — Tareas atómicas   `PHASE 4`

> Un commit por fila (`FDGE-R19`). El campo **Archivos** es lo que hace computable el solapamiento.

| # | Qué | Archivos | Verifica |
|:--|:---|:---|:---|
| `PT-129.1` | `FDGE-R19` remite a `LEXICON` para el `<type>` de rama, enumera los **cuatro** tipos y desambigua «Prohibidos» | `docs/methodology/RULES.md` | `verify-suite` · `core:check` |
| `PT-129.2` | `CORE.md` regenerado desde la regla nueva | `docs/methodology/CORE.md` | `npm run core:check` |
| `PT-129.3` | `ramaDeTarea` devuelve `null` sin `type`; `tracker rama` lo dice en vez de inventar | `docs/methodology/tools/patrones.mjs` · `tools/tracker.mjs` | casos nuevos |
| `PT-129.4` | La comprobación que **enumera** las ramas reales y las contrasta con la topología | `docs/methodology/tools/verify-fdge.mjs` | casos nuevos |
| `PT-129.5` | Los casos de la batería: los cuatro tipos, la efímera huérfana, el `SIN EVALUAR` y las dos inversas | `docs/methodology/tools/selftest.sh` | `npm run selftest` |

**Orden:** `.1 → .2 → .3 → .4 → .5`. `.2` depende de `.1` porque `CORE` se genera de `RULES`;
`.5` va al final porque prueba lo que `.3` y `.4` construyen.

**Solapamiento interno:** `.3` y `.4` tocan archivos distintos y pueden ir en cualquier orden entre
sí. `.1` y `.2` son el mismo hecho en dos representaciones y van pegadas.

**Con el resto del lote:** `tools/tracker.mjs` lo tocan once de las dieciocho tareas
(`EP-020` §7). Ejecución **secuencial** (`EXEC-R08`); esta tarea va primera por decisión del
firmante, así que no hereda conflicto de ninguna.
