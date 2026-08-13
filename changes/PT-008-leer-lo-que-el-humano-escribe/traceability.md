# PT-008 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un comentario humano sin responder bloquea | TS-01 | selftest.sh · «humano tras el agente ⇒ pendiente» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-02 | Responder lo desbloquea | TS-02 | selftest.sh · «respondido ⇒ ya no pendiente» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-03 | Los del agente no cuentan (por marca, no por autor) | TS-03 | selftest.sh · «los del agente no cuentan» | salidas/mismo-autor.txt | — | VERIFICADO |
| AC-04 | Sin plataforma no cambia nada | TS-07 | selftest.sh · «sin plataforma ⇒ G4 libre de R43» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-05 | Sin poder distinguir, SIN EVALUAR | TS-04 TS-05 | selftest.sh · «sin comentarios no revienta» · «sin ninguna marca ⇒ no evaluable» | salidas/verify-fdge.txt | — | VERIFICADO |
| AC-06 | La regla existe en RULES.md | TS-06 | selftest.sh · «SUITE-R43 existe en RULES» | salidas/selftest-despues.txt | — | VERIFICADO |

## Lo que no está verificado, declarado

El **ciclo completo contra GitHub** —escribir un comentario sin marca, ver fallar la compuerta,
responder y verla pasar— no se ha ejecutado: los casos cubren la función pura y hoy no hay
ningún comentario pendiente que provocar sin ensuciar un issue real.
