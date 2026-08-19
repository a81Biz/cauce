# PT-063 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La rama lleva al usuario | E1-E3 · E12 | `selftest.sh`: «la rama lleva al usuario» · «…y el tipo en minusculas» · «rama propone el nombre» | `salidas/rama-real.txt` · `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-02 | `trabajo` sigue siendo única | E8-E9 | `selftest.sh`: «no existe «trabajo/<usuario>» en RULES» · «…ni en LEXICON» | `salidas/verify-suite.txt` | - | VERIFICADO |
| AC-03 | `G4` sigue siendo una por lote | E10-E11 | `selftest.sh`: «FDGE-R19 sigue diciendo que G4 no se multiplica» · «EXEC-R03 sigue existiendo» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-04 | Una rama con el formato anterior sigue valiendo | E5-E7 · E13-E14 | `selftest.sh`: «sin usuario, dos niveles» · «una rama de dos niveles no lleva usuario» · «verify-fdge avisa, no falla» | `salidas/rama-real.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-05 | El usuario sale de la identidad declarada | E4 · E15 | `selftest.sh`: «…y el canonico, no el de git config» · «…con el MISMO normalizador que cauce/» | `salidas/rama-real.txt` | - | VERIFICADO |
| AC-06 | `FDGE-R19` dice el formato nuevo y hay guía de migración | E16-E17 | `selftest.sh`: «FDGE-R19 dice el formato nuevo» · «…y sigue exigiendo commits atomicos» · «…y los TRES niveles» | `salidas/verify-suite.txt` | - | **PARCIAL** |

**`AC-06` está a medias y se declara así.** La primera mitad —`FDGE-R19` dice el formato nuevo— está
hecha y comprobada. **La guía de migración no**: se escribe en el `CHANGELOG` al cerrar `EP-016` y
es una de sus filas de cierre. Marcarlo `VERIFICADO` aquí sería marcar una casilla que no está
hecha, que es lo que `SUITE-R45` existe para impedir.

**`AC-04` tiene la mejor evidencia posible, y es accidental**: la rama de **esta misma tarea** es
de dos niveles —se creó antes de que el formato existiera— y el aviso la señala sin bloquear. La
tarea que cambia el formato se termina como empezó.
