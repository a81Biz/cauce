# PT-016 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un intake sin phase FALLA, en vez de quedar SIN EVALUAR | E1 E2 E3 E4 E5 | selftest.sh - «un PT vivo sin phase FALLA» - «y deja de repetirlo por artefacto» - «con phase declarada, sin error» - «un EP sin phase esta EXENTO» - «lo ya integrado sin phase, exento» | salidas/selftest.txt · salidas/impacto.txt | - | VERIFICADO |
| AC-02 | Las plantillas lo declaran obligatorio | E6 E7 | selftest.sh - «BUG-REPORT trae phase» - «FEATURE-REQUEST trae phase» - «CHANGE-REQUEST trae phase» - «TAREA trae phase» - «EPIC-INTAKE NO lo trae» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Un proyecto instalado no se rompe SIN AVISO: la migracion lo enumera | E8 | selftest.sh - «la migracion avisa de que ahora falla» | salidas/selftest.txt · salidas/impacto.txt | - | VERIFICADO |
| AC-04 | El CHANGELOG lleva su guia de migracion, y la version sube MAJOR | E9 E10 | selftest.sh - «ESTADOS_TERMINALES en un solo sitio» - «DONE NO es terminal» | salidas/selftest.txt | - | VERIFICADO |

## Lo que NO cubre

Que el campo sea CIERTO. PT-044 hace que un phase que miente se vea; esta hace que faltar cueste.
Ninguna de las dos hace que alguien lo mantenga al dia — y con phase obligatoria, el riesgo nuevo
es que se rellene con cualquier numero para que el verde llegue.

La entrada de CHANGELOG y el numero MAJOR que AC-04 nombra los resuelve el CIERRE DEL LOTE
(SUITE-R45), no esta tarea: aqui se verifica lo que la hace necesaria —la frontera compartida y
su contrato—, y la fila del cierre responde por el resto.
