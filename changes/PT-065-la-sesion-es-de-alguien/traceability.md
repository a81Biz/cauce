# PT-065 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La sesión declara de quién es | E1 · E3 · E8 | `selftest.sh`: «el archivo lleva a la persona» · «…normalizado igual que las ramas» | `salidas/sesion-real.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-02 | Abrir sesión no borra la de otra persona | E4 · E9-E10 | `selftest.sh`: «dos personas, DOS archivos distintos» · «sesion abrir escribe la marca» | `salidas/sesion-real.txt` · `salidas/conflicto-evitado.txt` | - | VERIFICADO |
| AC-03 | Lo que deriva sale del trabajo de su persona | E9 | `selftest.sh`: «…y sesion la lee» · «…con las cifras de PT-058» | `salidas/sesion-real.txt` | - | VERIFICADO |
| AC-04 | El handoff sigue derivado y sin tocar `HANDOFF.md` | E13-E14 | `selftest.sh`: «sesion cerrar sigue dando el handoff» · «…y dice que HANDOFF.md queda intacto» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-05 | Con una sola persona, nada cambia | E2 · E11 · E15 | `selftest.sh`: «…sin persona, el de siempre» · «cae a SESSION.json si no hay propio» | `salidas/sesion-real.txt` · `salidas/verify-suite.txt` | - | VERIFICADO |
| AC-06 | Una sesión de otra persona se ve | E5-E7 · E12 | `selftest.sh`: «las ajenas se enumeran» · «…y la propia NO» · «…y una marca sin persona no es ajena» | `salidas/sesion-real.txt` · `salidas/inversa.txt` | - | VERIFICADO |

**`AC-02` se verifica con la inversa y con la reproducción.** El caso «dos personas, DOS archivos
distintos» sale `false` al neutralizar `archivoSesion` — y `PHASE 2` reprodujo lo que eso significa:
conflicto en cada merge, y la resolución obvia borra la sesión del otro.

**`AC-06` tiene un caso que parece menor y no lo es:** «una marca sin persona **no** es ajena». Una
marca sin persona es la de un proyecto de una sola persona; contarla como ajena haría ver una
**sesión fantasma**.

**`AC-03` se apoya en `PT-064`**, que ya filtró por persona lo que la sesión deriva. Aquí solo se
comprueba que la sesión sigue derivando, y se declara así en el manifiesto.
