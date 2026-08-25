# Trazabilidad — `PT-142`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | La contradicción `FDGE-R19` / `LEX-R27` se resuelve, y se dice cuál cede | `TS-04` | `selftest.sh:un lote NO lleva type, y por eso da null` | `salidas/verify-suite.txt` |
| AC-02 | Una rama que no coincide con lo derivado se nombra | `TS-01` `TS-02` | `selftest.sh:el nombre se DERIVA del type del item` | `salidas/selftest-completo.txt` |
| AC-03 | No juzga hacia atrás | — `RIGE_DESDE`, declarado | — `FDGE-R19b` desde `13.1.0` | `salidas/rigedesde.txt` |
| AC-04 | Sin `type` se dice, no se adivina | `TS-03` | `selftest.sh:sin type no hay nombre esperado: null` | `salidas/selftest-completo.txt` |
| AC-05 | El mensaje enseña el nombre **derivado** | — el texto del mensaje | — `«r» → deberia ser «esperada»` | `salidas/verify-fdge.txt` |

**Cinco criterios, cinco con escenario o declaración.** Ningún Orphan Criterion.
