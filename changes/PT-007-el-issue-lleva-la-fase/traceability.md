# PT-007 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El issue declara su fase | TS-01 TS-04 | selftest.sh · «la etiqueta lleva la fase» · «sin fase declarada no revienta» | salidas/tablero-github.txt | — | VERIFICADO |
| AC-02 | El issue declara qué compuerta espera | TS-02 TS-03 | selftest.sh · «y la compuerta que espera» · «PHASE 5 no espera compuerta» | salidas/tablero-github.txt | — | VERIFICADO |
| AC-03 | El estado se deriva, nunca se lee de vuelta | TS-05 | selftest.sh · «etiqueta que no cuadra ⇒ divergencia» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-04 | El espejo comprueba el estado | TS-05 TS-06 | selftest.sh · «etiquetas correctas ⇒ sin divergencia» | salidas/espejo-con-etiquetas.txt | — | VERIFICADO |
| AC-05 | Sin plataforma no cambia nada | TS-07 | selftest.sh · «estado funciona sin plataforma» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-06 | Se lee «qué va cuándo» sin abrir el repositorio | TS-08 | selftest.sh · «estado funciona sin plataforma» | salidas/tablero.txt | — | VERIFICADO |
| AC-07 | Las etiquetas se crean si faltan | TS-06 | ejecución real: `G1`, `G2` y `fase: 1` creadas al sincronizar | salidas/tablero-github.txt | — | VERIFICADO |

## Verificado también contra GitHub de verdad

`AC-01`, `AC-02` y `AC-07` no se quedan en el fixture: `tracker abrir --aplicar` creó tres
etiquetas y sincronizó nueve issues sobre el repositorio real, y `tracker espejo` cuadra.

`CasoQA` en `—`: línea de comandos (`QA-R01`). No aplicable, declarado.
