# `PT-199` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una corrida acotada no emite **ninguna** línea de error de andamiaje | TS-01 | selftest §EP-026 · `el esqueleto monta lo que el andamiaje toca` | evidence/PT-199/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Si el andamiaje toca una ruta que el esqueleto no monta, **se sabe** | TS-02 | selftest §EP-026 · `…y lo que no monta NO pasa en silencio` | evidence/PT-199/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | Los casos que sí corren siguen midiendo lo mismo | TS-03 | selftest §EP-026 · `una seccion ACTIVA monta el fixture completo` · y los 126 casos de la corrida acotada | evidence/PT-199/salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres del intake tienen escenario y caso ejecutable, y no hay escenario sin
`AC`.

## `AC-02` es el que sostiene a los otros dos

`AC-01` lo satisface un esqueleto con dos rutas más escritas a mano — que es el defecto de hoy con
otra cifra. `AC-03` sólo dice que no se rompió nada. **Sólo `AC-02` distingue «está limpio» de «no
puede ensuciarse sin que nadie lo vea»**, y es el que cubre el límite declarado: las rutas
construidas en variables, que ningún `grep` alcanza.
