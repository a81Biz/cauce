# `PT-123` — Tareas atómicas   `PHASE 4`

| # | Qué | Archivos | Verifica |
|:--|:---|:---|:---|
| `PT-123.1` | `bloqueDeBacklog` en `patrones.mjs`, pura y derivada del registro | `tools/patrones.mjs` | casos nuevos |
| `PT-123.2` | `tracker indices` reescribe **sólo** lo de dentro de las marcas | `tools/tracker.mjs` | `tracker indices --aplicar` |
| `PT-123.3` | `BACKLOG.md` recibe las marcas, conservando la prosa | `docs/implementation/BACKLOG.md` | el archivo |
| `PT-123.4` | `verify-fdge` lo echa de menos, bajo `FDGE-R31` | `tools/verify-fdge.mjs` · `RULES.md` · `CORE.md` | la inversa |
| `PT-123.5` | Los casos: el bloque, las inversas y el `SIN EVALUAR` | `tools/selftest.sh` | `npm run selftest` |

**Orden:** `.1 → .2 → .3 → .4 → .5`.
