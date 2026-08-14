# PT-043 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | El bloque conductor: numerar, dar el porqué, explicar el modo restringido | `manual[]` | salida de consola | ejecución sobre el legado real | `tools/migrate.mjs` | DONE |
| T2 | `D1` — fundir el rider del bloque `ESTADO` en su decisión | `need()` `:211` y `:217` | un solo `need()` | la salida dice `6`, no `7` | `tools/migrate.mjs` | DONE |
| T3 | `D2` — `resumen()` corta por palabra y lo marca con `…` | texto de la acción | titular sin partir | ninguna de las seis parte una palabra | `tools/migrate.mjs` | DONE |
| T4 | `SUITE-R55` en `RULES.md`, HARD | — | la regla | `verify-suite` sin errores | `RULES.md` | DONE |
| T5 | Sus citas, sin repetir la obligación (`SUITE-R20`, `LEX-R22`) | `SUITE-R55` | dos citas | `verify-suite` sin errores | `PHASES.md` · `FDGE-Prompts.md` | DONE |
| T6 | Los casos que la ejecutan | `migrate.mjs` | casos nuevos en la batería | `selftest.sh` en verde | `tools/selftest.sh` | DONE |
| T7 | Regenerar el núcleo | `RULES` · `PHASES` | `CORE.md` | `build-core --check` | `CORE.md` | DONE |

**Archivos tocados** (`FDGE-R20` · para el solapamiento del lote, `FDGE-R40`):

```
docs/methodology/tools/migrate.mjs
docs/methodology/tools/selftest.sh
docs/methodology/RULES.md · PHASES.md · FDGE-Prompts.md · CORE.md
```

Solapamiento con `PT-039`…`PT-042`: los cuatro tocaron `RULES.md`, `PHASES.md`,
`FDGE-Prompts.md`, `CORE.md` y `selftest.sh`. Los cinco se ejecutan **en serie** y esta es la
última, así que no hay dos escrituras vivas sobre el mismo archivo (`FDGE-R40`).
