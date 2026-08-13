# PT-013 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Lo aplazado tiene identificador e issue | TS-07 | selftest.sh · «un DEFERRED sí es vivo» + ejecución real | salidas/tablero-con-aplazados.txt | — | VERIFICADO |
| AC-02 | Se deriva de los out-of-scope | TS-02 | selftest.sh · «si cita una allocation, no se ve» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-03 | Aplazar sin decir a dónde se detecta | TS-01 TS-03 | selftest.sh · «aplazar sin citar a nadie se ve» · «un guion no aplaza nada» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-04 | Cerrar el lote sin recogerlo no pasa G4 | TS-04 TS-05 | selftest.sh · «en G4 bloquea» · «fuera de G4 solo avisa» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-05 | La regla existe en RULES.md | TS-08 | selftest.sh · «SUITE-R44 existe en RULES» · «llega al núcleo» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-06 | No impide aplazar | TS-05 | selftest.sh · «y fuera de G4 solo avisa» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-07 | Un DEFERRED no se verifica como uno en curso | TS-06 | selftest.sh · «un DEFERRED no exige artefactos» | salidas/selftest-despues.txt | — | VERIFICADO |

## Los tres aplazados que la regla encontró, ya recogidos

| Venía de | Qué | Ahora |
|:---|:---|:---|
| `PT-002` | escribir verificadores para las reglas HARD sin ninguno | `PT-015` · issue #22 |
| `PT-004` | hacer `phase` obligatoria y añadirla a `TAREA.md` | `PT-016` · issue #23 |
| `PT-012` | derivar la lista de «qué llega nuevo» en `migrate` | `PT-017` · issue #24 |

## El agujero de la regla, declarado

**Citar cualquier identificador la satisface.** `PT-012` citaba `PT-013` y pasaba, aunque
`PT-013` no fuera a hacer ese trabajo. La comprobación verifica que haya **dónde volver**, no
que ese sitio sirva. No tiene arreglo mecánico y está en el self-review.
