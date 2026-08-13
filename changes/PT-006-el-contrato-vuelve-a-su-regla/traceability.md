# PT-006 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | PHASES deja de enunciar lo que su regla no contiene | TS-01 | selftest.sh · «PHASES ya no declara milestone» · «el contrato está en PHASES» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-02 | El mapeo G4 → PR queda en RULES | TS-02 TS-03 | selftest.sh · «SUITE-R42 existe en RULES» · «llega al núcleo» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-03 | La regla tiene comprobación que puede fallar | TS-05 | selftest.sh · «sin plataforma ⇒ pr no aplica» | salidas/tracker-pr.txt · salidas/g4-con-r42.txt | — | VERIFICADO |
| AC-04 | Sin plataforma no cambia nada | TS-04 | selftest.sh · «sin plataforma ⇒ G4 libre de R42» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-05 | Sin acceso se declara | TS-06 | selftest.sh · «plataforma sin acceso ⇒ pr da 3» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-06 | CORE regenerado y coherente | TS-03 | verify-suite sin errores | salidas/verify-suite.txt | — | VERIFICADO |
| AC-07 | El agente no fusiona | TS-07 | selftest.sh · «tracker no puede fusionar» | salidas/selftest-despues.txt | — | VERIFICADO |

## Lo que no está verificado, declarado

Que `--gate G4` falle **sin PR contra GitHub de verdad**. El arnés cubre «sin plataforma»; el
caso «con plataforma y sin PR» solo se ve en una rama sin PR, y esta tiene el #7. Se declara en
vez de simularse.

`CasoQA` en `—`: línea de comandos (`QA-R01`). No aplicable, declarado.
