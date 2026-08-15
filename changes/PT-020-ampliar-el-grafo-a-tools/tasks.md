# PT-020 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | `scope` incluye las herramientas | `CLAUDE.md` §Estructura | `REGISTRY.graph` | ejecución | `REGISTRY.json` | hecha |
| T2 | Regenerar el grafo con ese alcance | T1 | `graphify-out/` | ejecución | — | hecha |
| T3 | `pt_at_generation` al último integrado | `HISTORY` | `REGISTRY.graph` | `verify-fdge` | `REGISTRY.json` | hecha |
| T4 | Contrastar las tres expectativas | `strategy.md` | contraste escrito | lectura | `self-review.md` | hecha |
| T5 | El caso que impide volver al alcance viejo | — | caso nuevo | `selftest.sh` verde | `tools/selftest.sh` | hecha |

**Resultado de `PHASE 5`.** 18 nodos (todos de `cauce.mjs`) → **500 nodos · 635 aristas · 14
comunidades** sobre los 16 archivos del código propio. `FDGE-R43`: `STALE` → `FRESH`.
`selftest.sh`: 495 → **501 casos**, todos verdes; la comprobación inversa —revertir el registro al
alcance de ayer— pone en rojo los dos casos que deben caer y deja en verde los cuatro que no.

Dos de las tres expectativas de `strategy.md` **no se cumplieron como estaban escritas**. Va en
[`self-review.md`](self-review.md) con la medida, no ajustando el alcance hasta que salga bonito.

**Encontrado de paso, y arreglado:** `REFACTOR_SCOPE.md` tenía catorce filas pegadas en una sola
línea con estados obsoletos —entró en `7d4cf1e`, la apertura de este mismo lote—. Los tres índices
se reconstruyen ahora **derivando del registro** (`SUITE-R35`), no editando a mano: 33 + 3 + 2
filas resincronizadas, 0 divergencias.

**Archivos tocados:** `docs/implementation/REGISTRY.json` · `docs/methodology/tools/selftest.sh`

`graphify-out/` **no se versiona** (`SUITE-R37`).
