# PT-145 · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | No queda ningún literal de componente en los dos archivos | TS-06 | `grep` de los diez prefijos y de `'FIDE'` | `evidence/PT-145/salidas/verify-suite-despues.out` | n/a | `CUMPLIDO` |
| AC-02 | Los patrones se construyen desde el contrato, sin barras invertidas escritas | TS-01 · TS-02 · TS-03 | `verify-patrones.mjs` · bloque `PT-145` | `evidence/PT-145/salidas/verify-patrones.out` | n/a | `CUMPLIDO` |
| AC-03 | `:716` ve los diez prefijos, y una cita `FPGE-Rnn` **falla** | TS-07 | `selftest.sh` ×4 | `evidence/PT-145/salidas/selftest-exec-r08.out` | n/a | `CUMPLIDO` |
| AC-04 | Comportamiento idéntico en los siete sitios que no cambian | TS-04 · TS-05 | `verify-suite` y `comparar-marco`, antes y después | `evidence/PT-145/salidas/diff-verify-suite.out` | n/a | `CUMPLIDO` |

**`AC-03` es el único que cambia comportamiento, y es deliberado.** El intake pedía «ningún
literal»; `PT-144` destapó que uno de ellos —`:716`— además estaba **incompleto**, así que
derivarlo del contrato no es higiene: **cierra dos agujeros en el guardarraíl de `EXEC-R08`**.

Y se midió antes de cerrarlo: **la matriz de compuertas no cita hoy ninguna regla `FPGE` ni
`FIDE`**. El agujero era real y no estaba siendo explotado. Se cierra igual — una comprobación que
sólo funciona mientras nadie escriba lo que no debe no es una comprobación.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | Las cinco alternancias completas casan lo mismo | `diff` de `verify-suite` sobre el árbol: **vacío** | `CUMPLIDO` |
| RC-02 | Se construyen sin una barra invertida escrita (`SUITE-R59`) | los diez prefijos, **ejecutados** en `verify-patrones` | `CUMPLIDO` |
| RC-03 | El criterio «deliberadamente estrecho» de los opcionales se conserva | el comentario que lo documenta no se tocó | `CUMPLIDO` |
| RC-04 | `comparar-marco` da la misma salida | salidas antes/después, idénticas | `CUMPLIDO` |
| RC-05 | Lo que `:716` destape se **declara**, no se corrige | no destapó nada: medido antes de cerrarlo | `CUMPLIDO` |

## Lo que encontró equivocarse

**El fixture del caso de `EXEC-R08` copiaba sólo los `*.md`**, sin las subcarpetas de la
metodología. `verify-suite` ahogaba la salida en enlaces rotos y truncaba antes de llegar a la
comprobación: **tres casos daban rojo por el motivo equivocado**.

Tercera instancia en tres tareas de la misma clase —`PT-144` con el caso que esperaba un
`SyntaxError`, `PT-150` afirmando sobre el identificador—. Una comprobación que pasa **o falla**
por el motivo equivocado no es una comprobación.
