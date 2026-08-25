# Trazabilidad — `PT-139`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Sin bloque: avisa y falla en `G4` | `TS-01` `TS-02` | `selftest.sh:un aplazado sin bloque se nombra` · `…y en G4 deja de ser un aviso` | `salidas/selftest-completo.txt` |
| AC-02 | Vencida: se nombra, con días y dueño | `TS-03` `TS-04` `TS-05` | `selftest.sh:un aplazado con la revision vencida se nombra` · `…y dice cuantos dias lleva` | `salidas/selftest-completo.txt` |
| AC-03 | La fecha de hoy se **deriva** | `TS-06` | `selftest.sh:el que esta al dia NO se nombra` | `salidas/selftest-completo.txt` |
| AC-04 | No juzga hacia atrás | `TS-07` `TS-08` | `selftest.sh:el anterior a la regla NO se juzga` · `…y se dice cual es` | `salidas/selftest-completo.txt` |
| AC-05 | El aviso dice **qué hacer** | `TS-09` `TS-10` `TS-11` | `selftest.sh:el aviso nombra el comando que lo arregla` · `la compuerta obliga a mirar, no decide` | `salidas/selftest-completo.txt` |

**Cinco criterios, cinco con escenario, cinco con evidencia.** Ningún Orphan Criterion.
