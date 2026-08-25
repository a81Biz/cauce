# Escenarios de test — `PT-139`   `PHASE 4`

| TS | Escenario | Cierra |
|:---|:---|:---|
| `TS-01` | Un aplazado sin bloque se nombra | AC-01 |
| `TS-02` | …y en `--gate G4` deja de ser un aviso | AC-01 |
| `TS-03` | Uno con la revisión vencida se nombra | AC-02 |
| `TS-04` | …y dice **cuántos días** lleva | AC-02 |
| `TS-05` | …y **de quién** es | AC-02 |
| `TS-06` | El que está al día **no** se nombra | AC-03 |
| `TS-07` | El anterior a la regla **no** se juzga | AC-04 |
| `TS-08` | …y se dice cuál es | AC-04 |
| `TS-09` | El aviso nombra el comando que lo arregla | AC-05 |
| `TS-10` | …y el del caducado nombra los tres caminos | AC-05 |
| `TS-11` | La compuerta obliga a mirar y **no decide** | AC-05 |

## La fecha del fixture es `2099`, y no es casualidad   `CE-010`

Un caso que comparase contra una fecha cercana pasaría hoy y fallaría el mes que viene por una
razón que no es la suya. La cifra transcrita que caduca es una clase con instancias contadas en
este repositorio.

## Prueba inversa

Las cuatro situaciones se cubren **entre sí**: el fixture lleva un aplazado de cada clase, y
`TS-06` es el negativo que hace válidos a los demás — sin él, una comprobación que marcase
**todos** también pasaría `TS-01` y `TS-03`.
