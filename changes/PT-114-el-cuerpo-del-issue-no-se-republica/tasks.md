# `PT-114` — Tareas atómicas   `PHASE 4`

| # | Qué | Archivos | Verifica |
|:--|:---|:---|:---|
| `PT-114.1` | `RE_SIN_ENLACE` y `cuerpoSinEnlaceConRef` en `patrones.mjs` | `tools/patrones.mjs` | casos nuevos |
| `PT-114.2` | El espejo lo echa de menos y **bloquea**, con el comando que lo arregla | `tools/tracker.mjs` | `tracker espejo` |
| `PT-114.3` | Los casos: el positivo, las dos inversas y el `SIN EVALUAR` | `tools/selftest.sh` | `npm run selftest` |

**Orden:** `.1 → .2 → .3`.

**Solapamiento con el lote:** `tools/tracker.mjs` lo tocan once de las veinte tareas. Ejecución
secuencial (`EXEC-R08`).
