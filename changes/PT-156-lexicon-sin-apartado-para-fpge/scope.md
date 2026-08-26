# `PT-156` · `scope.md` — `PHASE 2-R`

## Qué se toca, y por qué ese y no otro

| Archivo | Qué cambia | Por qué |
|:---|:---|:---|
| `FPGE-Implementation.md:52-114` | `[1]`..`[7]` → `PHASE n — Nombre` | Es el recorrido operativo (`LEX-R01`): lleva números de `PHASE` |
| `FPGE-Prompts.md:47-110` | idem, en los siete encabezados `##` | Mismo motivo. Si sólo cambia uno, quedan dos numeraciones |
| `LEXICON.md` §3 | apartado `3.6` nuevo; el contrato pasa a `3.7`/`3.8` | `LEXICON` es el dueño del mapa de fases (`LEX-R21`) |
| `tools/patrones.mjs` | `FPGE.fases: SIN_EVALUAR` → `[1, 7]` | Ya hay de dónde derivarlo |
| `tools/verify-patrones.mjs` | la aserción de `FPGE` se voltea | Nació exigiendo `SIN_EVALUAR`; ahora exige el rango |
| `tools/build-core.mjs:379` | la línea de `FPGE` del mapa de fases | Entró por hallazgo: contradecía `FPGE-R04` (`PT-165`) |
| `CORE.md` | regenerado | `SUITE-R16` |

## Qué NO se toca

**El proceso de `FPGE`.** Los siete pasos hacen exactamente lo mismo que antes y conservan sus
nombres. Esta tarea cambia **cómo se llaman los pasos**, no qué hacen. Ni una sola línea del
cuerpo de `FPGE-Implementation` cambia.

Y no se traducen los nombres al inglés para igualar el registro de `§3.1`–`§3.5`. Los nombres
existen ya en castellano en los dos documentos operativos; inventar traducciones sería añadir
una tercera versión de cada nombre para arreglar una asimetría de estilo.
