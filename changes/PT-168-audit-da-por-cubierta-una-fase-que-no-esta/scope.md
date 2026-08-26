# `PT-168` · `scope.md` — `PHASE 2-R`

## Qué se toca

| Archivo | Qué cambia |
|:---|:---|
| `audit.mjs` · `seccionDe()` | recorta el documento a la sección del componente |
| `audit.mjs` · `cubre(txt, propio)` | la búsqueda genérica mira ese ámbito, no el documento entero |
| `audit.mjs` | reconoce el formato **compacto** —`1 FRESHNESS`— además de `PHASE n` |
| `selftest.sh` | cinco casos |

## Qué NO se toca

**Los documentos.** El instrumento se corrige; lo que mida es otra decisión (`AC-04`). Y no hizo
falta: el árbol real sigue **sin huecos**.

**Las otras dimensiones de `audit`** —reglas, triggers, artefactos— por el mismo patrón. **No está
medido**, y suponerlo sería el mismo error que esta tarea arregla.
