# PT-065 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Quién es quién | PT-061 |
| De quién es cada commit | PT-064 |
| Sincronizar sesiones entre máquinas | — |
| Un servidor de sesiones | — |
| Cambiar `sesionDe` o `handoffDeSesion` | — |
| Tocar `CHECKPOINT.json` o `LEX-R26` | — |
| Borrar sesiones viejas | — |

**Las dos primeras son el lote, y están integradas.** Esta tarea las consume.

**La tercera y la cuarta llevan `—`:** el estado vive en el repositorio y se comparte cuando se
comparte el repositorio. Cualquier cosa más rápida necesita algo **encendido**, y este marco
funciona sin nada encendido — que es la razón por la que `SUITE-R08` puede asignar sin red.

**La quinta:** `sesionDe` y `handoffDeSesion` son **puras** y reciben la marca; no la leen. `PT-060`
las dejó bien y esta tarea solo cambia **de qué archivo** sale.

**La sexta, y se dice porque la forma se parece:** `LEX-R26` declara que `CHECKPOINT.json` **es
uno**, y sigue siéndolo. Responde por *la tarea en curso*; `SESSION.json` responde por *una
sesión*, y puede haber varias. Son criterios distintos sobre artefactos distintos.

**Y la séptima:** los archivos son **uno por persona**, no uno por día — se sobrescriben, así que no
crecen. El de alguien que deje el proyecto se queda, y borrarlo sería decidir por él.
