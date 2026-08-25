# PT-145 · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | No queda ningún literal de componente en los dos archivos | TS-06 | — | — | n/a | `PENDIENTE` |
| AC-02 | Los patrones se construyen desde el contrato, sin barras invertidas escritas | TS-01 · TS-02 · TS-03 | — | — | n/a | `PENDIENTE` |
| AC-03 | `:708` ve los diez prefijos, y una cita `FPGE-Rnn` **falla** | TS-07 | — | — | n/a | `PENDIENTE` |
| AC-04 | Comportamiento idéntico en los seis sitios que no cambian | TS-04 · TS-05 | — | — | n/a | `PENDIENTE` |

**`AC-03` es el único que cambia comportamiento, y es deliberado.** El intake pedía «ningún
literal»; `PT-144` destapó que uno de ellos —`:708`— además está **incompleto**, así que
derivarlo del contrato no es solo higiene: **cierra dos agujeros en el guardarraíl de `EXEC-R08`**.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | Las cinco alternancias completas casan lo mismo | TS-05 | `PENDIENTE` |
| RC-02 | Se construyen sin una barra invertida escrita (`SUITE-R59`) | TS-01 · TS-02 | `PENDIENTE` |
| RC-03 | El criterio «deliberadamente estrecho» de `:425` se conserva | TS-08 | `PENDIENTE` |
| RC-04 | `comparar-marco` da la misma salida | TS-04 | `PENDIENTE` |
| RC-05 | Lo que `:708` destape se **declara**, no se corrige | TS-07 | `PENDIENTE` |
