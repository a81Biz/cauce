# PT-056 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Al retomar se compara el árbol con lo que el checkpoint declara | E1 · E8-E9 · E14-E15 | `selftest.sh`: «sha y rama iguales ⇒ corresponde» · «sin checkpoint ⇒ null, no false» · «tracker siguiente llega a correr» · «rehacer el checkpoint lo resuelve» | `salidas/selftest-completo.txt` · `salidas/caso-peligroso.txt` | - | VERIFICADO |
| AC-02 | Un `HEAD` distinto del `sha` declarado detiene | E2-E3 · E10 · E13 | `selftest.sh`: «sha distinto ⇒ NO corresponde» · «rama distinta ⇒ NO corresponde» · «otra rama: verify-fdge FALLA» · «tracker siguiente BLOQUEA» · «…pero uno de OTRA historia si» | `salidas/caso-peligroso.txt` · `salidas/verify-fdge.txt` | - | VERIFICADO |
| AC-03 | Un árbol sucio no es discrepancia | E4-E5 | `selftest.sh`: «un arbol SUCIO no es discrepancia» · «otra lista de archivos tampoco» · «un sha ANTECESOR no es discrepancia» | `salidas/selftest-completo.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-04 | La discrepancia dice cuál es | E6-E7 | `selftest.sh`: «la discrepancia dice el campo» · «…lo declarado» · «…y lo real» · «con dos, enumera LAS DOS» · «…y dice cual es la discrepancia ENTERA» | `salidas/caso-peligroso.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-05 | Reanudar con discrepancia es decisión humana | E11-E12 | `selftest.sh`: «…dice que reanudar es HUMANO» · «…y PROPONE el comando» · «…sin ejecutarlo ni repararlo» | `salidas/caso-peligroso.txt` | - | VERIFICADO |

**La columna «Evidencia» no es decorativa.** `FDGE-R15` la exige llena porque un AC sin evidencia
es un criterio que nadie comprobó y que la tabla presenta como si sí.

**`E16-E18` no estaban en `PHASE 4`**: son los tres casos de la descendencia, que solo aparecieron
al ejecutar. Cuelgan de `AC-02` y `AC-03` porque eso es lo que dicen — que ir por detrás no es
divergir, y que no poder demostrarlo sí cuenta.
