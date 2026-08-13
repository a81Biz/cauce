# PT-011 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La prosa no hace miembro | TS-01 | selftest.sh · «citar un PT en prosa no lo hace miembro» · «ni siquiera al de al lado» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-02 | La fila de tabla sí | TS-02 | selftest.sh · «el de la tabla sí exige su firma» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-03 | Sin tabla, respaldo | TS-03 | selftest.sh · «sin tabla, respaldo al barrido completo» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-04 | El proyecto legado baja de 16 errores a 3 (corregido, ver abajo) | TS-04 | ejecución real contra el proyecto legado | salidas/legado-antes.txt · salidas/legado-despues.txt | — | VERIFICADO |
| AC-05 | El CHANGELOG deja de cerrar la pregunta | TS-05 | selftest.sh · «el CHANGELOG dice dónde estaba» | salidas/selftest-despues.txt | — | VERIFICADO |

## Corrección de `AC-04`

El criterio decía «baja de 16 errores a **2**». Son **3**: `SUITE-R17`, `SUITE-R16` y
`SUITE-R33`. Conté mal al redactarlo — había sumado `SUITE-R33` aparte al describir el
diagnóstico. Los tres son la migración misma y ninguno es falso, así que el arreglo cumple lo
que pretendía; lo que estaba mal era mi número.

## Lo que no está verificado, declarado

Que la migración completa de ese proyecto funcione. Los tres errores que quedan son los que
`PT-012` tiene que enseñar a resolver.
