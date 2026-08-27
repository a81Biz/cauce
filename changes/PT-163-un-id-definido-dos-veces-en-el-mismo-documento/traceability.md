# `PT-163` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un ID definido **dos veces en el mismo documento** se caza | TS-01 | `selftest` · fixture | `evidence/PT-163/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | El mensaje **separa** los dos hechos | TS-02 | `selftest` ×2 | `evidence/PT-163/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-03 | El árbol real no tiene ninguno | TS-03 | `verify-suite` | `evidence/PT-163/salidas/verify-suite.out` | n/a | `CUMPLIDO` |

**`AC-01` cazó uno vivo en su primera corrida.** `EXEC-R08` estaba definida **dos veces** en
`EXECUTION-MODES.md`, con **dos obligaciones distintas**: *«los tres modos exigen lo mismo»* (`HARD`,
§5) y *«la ejecución de un lote es secuencial»* (§7.4). Las citas de `CASOS-DE-USO`, `MANUAL` y
`CHANGELOG` apuntaban **todas a la primera**, así que la segunda no la citaba nadie y renumerarla a
`EXEC-R15` no rompió ninguna referencia.

**`AC-02` es el que hace útil el fallo.** «En dos documentos» se arregla eligiendo propietario;
«dos veces en el mismo» se arregla renumerando. Son arreglos distintos.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | El caso de **dos documentos** sigue cazándose | mensaje original intacto | `CUMPLIDO` |
| RC-02 | Los tres patrones nuevos viajan con su contrato | `verify-patrones` | `CUMPLIDO` |

**`RC-02`**: los regex de esta tarea —`RE_DEF_TABLA`, `RE_DEF_PROSA`, `RE_LINEAS`— nacieron sueltos
y `PT-155` los llevó al contrato en el mismo lote. Sin eso, un escape degradado en ellos no lo
cazaría nadie.

## Lo que esta tarea destapó, y **tiene tarea**

`EXEC-R15` **no la citaba ningún documento operativo** tras renumerarla. Salió en `PT-161`, y se
cerró ahí: citada en `PHASES` y en `FDGE-Prompts`.
