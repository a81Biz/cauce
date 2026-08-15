# PT-044 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una divergencia YAML-registro se reporta | E1 E2 E7 | selftest.sh - «YAML y registro con fases distintas» - «con estados distintos» - «en G4 la divergencia BLOQUEA» | salidas/antes.txt · salidas/selftest.txt | - | VERIFICADO |
| AC-02 | La precedencia sigue siendo la de PT-004, y se dice cual se uso | E4 | selftest.sh - «y dice cual de los dos se usa» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Si coinciden ni error ni aviso; si falta un lado no se inventa | E5 E6 | selftest.sh - «si coinciden, ni una linea de mas» - «sin fase en el registro no se inventa» | salidas/selftest.txt · salidas/despues.txt | - | VERIFICADO |
| AC-04 | Los intakes sincronizados y verify-fdge --all sin errores | E8 | selftest.sh - «un PT vivo sin bitacora falla» - «uno ya integrado, no: no se retrofecha» | salidas/antes.txt (78) · salidas/despues.txt (0) | - | VERIFICADO |
| AC-05 | El indice tampoco puede contradecir al registro | E3 | selftest.sh - «el indice tampoco puede contradecir» | salidas/despues.txt | - | VERIFICADO |

## Lo que NO cubre

Que el REGISTRO sea cierto. Esta tarea hace que las tres copias coincidan; si el registro se
equivoca, ahora se equivocan las tres a la vez y en silencio. La coherencia no es verdad, y
decirlo es mas util que dejarlo entender.
