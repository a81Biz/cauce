# PT-005 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una excepción firmada sobrevive al cambio de profundidad del clon | TS-01 | selftest.sh · «la huella no depende del commit» · «firmada allí ⇒ exime aquí» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-02 | Un valor distinto vuelve a bloquear | TS-02 | selftest.sh · «el secreto de la historia se caza» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-03 | Un clon superficial no se da por historia revisada | TS-03 | selftest.sh · «clon superficial ⇒ SIN EVALUAR» · «no dice que revisó la historia» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-04 | El mensaje dice qué hacer | TS-04 | selftest.sh · «y dice cómo arreglarlo» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-05 | CI clona la historia entera | TS-05 | selftest.sh · «CI clona la historia entera» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-06 | El PR de G4 pasa el paso de secretos | TS-06 | ejecución real del PR #7 | salidas/ci-fallo-original.txt | — | **PENDIENTE** |
| AC-07 | Un repositorio sin `.git` sigue funcionando | TS-07 | árbol revisado sin historia | salidas/secretos-historial.txt | — | VERIFICADO |

## `AC-06` está PENDIENTE a propósito

Es el criterio que motivó la tarea, y **solo se puede verificar reejecutando el PR #7**. No hay
fixture que lo sustituya: el defecto vive en el merge sintético que GitHub fabrica, y eso no
existe fuera de GitHub. Queda `verified: false` en el manifiesto hasta que CI lo diga.

Es lo contrario de lo que hice con la guarda de fork en `PT-001`: allí escribí una guarda para
un caso que no podía probar y se retiró. Aquí el caso **sí** se puede probar — solo que no
desde aquí.

`CasoQA` en `—`: herramienta de línea de comandos (`QA-R01`). No aplicable, declarado.
