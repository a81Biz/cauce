# PT-010 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un issue de EP no se contradice | TS-01 TS-02 TS-07 | selftest.sh · «el EP no se niega a si mismo» · «ES una implementacion» · «a qué lote va» | salidas/cuerpo-ep-antes.txt · salidas/cuerpo-ep-despues.txt | — | VERIFICADO |
| AC-02 | El enlace resuelve desde un issue | TS-03 | selftest.sh · «el enlace es absoluto» | salidas/cuerpo-ep-despues.txt | — | VERIFICADO |
| AC-03 | Sin URL derivable no se inventa | TS-04 | selftest.sh · «sin URL no se inventa» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-04 | El cuerpo dice de qué va sin salir de GitHub | TS-05 | selftest.sh · «enumera sus tareas con su issue» | salidas/cuerpo-ep-despues.txt | — | VERIFICADO |
| AC-05 | Los issues abiertos se sincronizan | — ejecución real | ejecución real · tres cuerpos sincronizados | salidas/cuerpo-ep-despues.txt | — | VERIFICADO |
| AC-06 | Sigue sin copiar el intake | TS-06 | selftest.sh · «sigue sin copiar el intake» | salidas/selftest-despues.txt | — | VERIFICADO |

## Lo que no está verificado, declarado

Que el enlace **resuelva** tras el merge: hoy apunta a `main`, donde `EP-003` todavía no está.
Y nada comprueba automáticamente que una URL resuelva — haría falta red en una compuerta. Es el
mismo límite que dejó pasar el defecto original.
