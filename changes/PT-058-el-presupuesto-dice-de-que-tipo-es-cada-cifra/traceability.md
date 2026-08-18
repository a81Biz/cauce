# PT-058 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Toda cifra declara su naturaleza | E1-E3 · E11-E13 · E17 | `selftest.sh`: «una cifra lleva su valor» · «…y su naturaleza» · «la cifra es INMUTABLE» · «medido con estimado da ESTIMADO» · «…y al reves TAMBIEN» · «el texto pega la naturaleza» | `salidas/selftest-completo.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-02 | Las tres son vocabulario cerrado | E14-E16 | `selftest.sh`: «NATURALEZAS son TRES» · «…de mejor a peor» · «verify-suite exige que sean tres» · «…y que esten en LEXICON» | `salidas/verify-suite.txt` | - | VERIFICADO |
| AC-03 | `SIN EVALUAR` no vale cero | E7-E10 · E18 | `selftest.sh`: «SIN EVALUAR no tiene valor» · «…ni siquiera un cero explicito» · «restar con SIN EVALUAR contagia» · «…y el valor NO sobrevive» · «sumar contagia igual» | `salidas/inversa.txt` · `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-04 | Una cifra sin naturaleza falla | E4-E6 | `selftest.sh`: «sin naturaleza LANZA» · «una cuarta naturaleza LANZA» · «…y el error dice cuales valen» · «…y NO asume una por su cuenta» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-05 | El vocabulario está en `LEXICON` | E19-E20 | `selftest.sh`: «MEDIDO esta en LEXICON» · «ESTIMADO esta en LEXICON» · «SIN EVALUAR esta en LEXICON» · «…y dice que NO es cero» | `salidas/vocabulario-existente.txt` · `salidas/verify-suite.txt` | - | VERIFICADO |

**`AC-05` no es una formalidad aquí.** `SIN EVALUAR` llevaba **50 usos en trece archivos** y cero
en `LEXICON`: el criterio no era «declararlo por si acaso», era que el marco llevaba ocho lotes
incumpliendo `LEX-R21` sin que nada lo detectara.

**La evidencia de `AC-03` es la inversa, no la batería.** Que los casos pasen en verde dice que la
implementación hace lo que dicen; que **siete caigan** al poner `SIN EVALUAR` a cero dice que los
casos distinguen. Sin lo segundo, lo primero no prueba nada.
