# PT-061 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Las personas se declaran en `REGISTRY.json` | E9 · E12-E13 · E20 | `selftest.sh`: «sin tabla, null y no revienta» · «personas ensena a los declarados» · «el registro declara personas» · «…con las tres identidades» | `salidas/personas-real.txt` · `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-02 | Un commit se atribuye a una persona declarada | E1-E3 | `selftest.sh`: «un par declarado da su persona» · «…y la segunda identidad, la MISMA» | `salidas/personas-real.txt` | - | VERIFICADO |
| AC-03 | Un autor no declarado se reporta | E4-E8 · E14-E15 | `selftest.sh`: «mismo correo, OTRO nombre ⇒ null» · «mismo dominio NO es la misma persona» · «el motivo nombra al autor» · «…y dice que no se adivina» | `salidas/inversa.txt` · `salidas/personas-real.txt` | - | VERIFICADO |
| AC-04 | `firmantes:` y `personas` no divergen en silencio | E18-E19 | `selftest.sh`: «verify-suite exige firmante ⇒ persona» · «…y NO exige persona ⇒ firmante» · «sin personas no se comprueba» | `salidas/verify-suite.txt` | - | VERIFICADO |
| AC-05 | El nombre canónico es uno, y de él sale la rama | E10-E11 · E16-E17 | `selftest.sh`: «personaLocal da el CANONICO» · «…y no el nombre de git config» · «…y desde la otra identidad seria OTRA rama» | `salidas/personas-real.txt` | - | VERIFICADO |

**`AC-03` se verifica con la inversa, no con la batería.** Que los casos pasen dice que la
implementación hace lo que dicen. Que **`Otro <alberto@a81.biz>` pase a ser Alberto Martínez** al
relajar el criterio dice que los casos distinguen — y eso es lo que protege a las cuatro tareas
siguientes de heredar una identidad falsa sin notarlo.

**`E19` es el caso que impide crear dos listas del mismo hecho.** Comprueba lo que la herramienta
**no** hace: no exige que toda persona firme. La asimetría es deliberada y está en el comentario
del código, no solo aquí.
