# PT-009 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Todo comentario de `tracker` lleva la marca | TS-01 TS-02 | selftest.sh · «el cierre lleva la marca» · «y no pierde lo que decia» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-02 | `verify-fdge --all` vuelve a verde | TS-04 | verify-fdge --all sobre este repositorio | salidas/verify-fdge-verde.txt | — | VERIFICADO |
| AC-03 | La regla no se relaja | TS-05 | selftest.sh · «SUITE-R43 sigue exigiendo respuesta» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-04 | Un comentario ajeno sigue bloqueando | TS-03 | selftest.sh · «humano tras el agente ⇒ pendiente» | salidas/selftest-despues.txt | — | VERIFICADO |
