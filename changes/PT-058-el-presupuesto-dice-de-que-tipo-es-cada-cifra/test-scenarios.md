# PT-058 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `cifra(1974, MEDIDO)` | `{valor: 1974, naturaleza: 'MEDIDO'}` |
| E2 | AC-01 | `cifra(1974, ESTIMADO)` | la naturaleza va **con** el valor |
| E3 | AC-01 | La cifra es **inmutable** | no se le puede cambiar la naturaleza después |
| E4 | AC-04 | `cifra(1974)` sin naturaleza | **lanza** |
| E5 | AC-04 | `cifra(1974, 'PROBABLE')` | **lanza** — no se acepta una cuarta |
| E6 | AC-04 | …y el error **dice cuáles valen** | las tres, enumeradas |
| E7 | AC-03 | `cifra(0, SIN_EVALUAR)` | `valor: null` — ni siquiera un cero explícito |
| E8 | AC-03 | `restar(MEDIDO 100, SIN_EVALUAR)` | `SIN EVALUAR` con `valor: null` |
| E9 | AC-03 | …y **no** `100` | el valor no sobrevive |
| E10 | AC-03 | `sumar` con `SIN EVALUAR` | igual: contagia |
| E11 | AC-01 | `restar(MEDIDO, MEDIDO)` | `MEDIDO` |
| E12 | AC-01 | `restar(MEDIDO, ESTIMADO)` | **`ESTIMADO`** — la peor gana |
| E13 | AC-01 | `restar(ESTIMADO, MEDIDO)` | `ESTIMADO` — el orden de los operandos da igual |
| E14 | AC-02 | `NATURALEZAS` tiene exactamente **tres** | 3 |
| E15 | AC-02 | …y está **ordenado** de mejor a peor | `MEDIDO`, `ESTIMADO`, `SIN EVALUAR` |
| E16 | AC-02 | `verify-suite` falla si aparece una cuarta | rojo |
| E17 | AC-01 | `textoCifra` pega la naturaleza al número | `1974 (ESTIMADO)` |
| E18 | AC-03 | …y `SIN EVALUAR` no enseña número | solo `SIN EVALUAR` |
| E19 | AC-05 | Las tres están en `LEXICON` con su contrato | las tres |
| E20 | AC-05 | …y `LEXICON` dice que `SIN EVALUAR` no es cero | el texto |

**`E9` es el caso que da nombre a la tarea.** Si restar una cifra `SIN EVALUAR` de una medida de
`100` devolviera `100`, el presupuesto de `PT-059` diría que queda todo justo cuando no sabe nada.
No basta con que la naturaleza cambie: **el valor tiene que desaparecer**.

**`E4` y `E5` son `AC-04` y son lo que hace comprobable el resto.** Sobre prosa —los 50 usos
actuales— no hay forma de que «una cifra sin naturaleza» falle.

**`E12` y `E13` juntos**: el contagio no puede depender de qué operando va primero, o sería una
regla que se cumple la mitad de las veces.

## Lo que ningún caso puede comprobar

**Que alguien use `cifra()` en vez de un número pelado.** Nada obliga a envolver. Lo que queda
garantizado es que **lo envuelto no puede mentir**: no hay forma de construir una cifra sin
naturaleza, ni de que `SIN EVALUAR` traiga un valor.

**Que las tres naturalezas sean las correctas.** Son las que fijó el firmante en la decisión 4. Si
hiciera falta una cuarta, la comprobación de `E16` se pondría roja — que es lo que se quiere: que
ampliar el vocabulario sea una decisión visible y no un `if` más.

**Que los 50 usos en prosa digan la verdad.** Siguen siendo texto, y esta tarea no los toca. Está
declarado en el `out-of-scope`.
