# PT-002 — Trazabilidad   `FDGE-R15`

`AC` y `TS` se declaran en `PHASE 4`. `Test` y `Evidencia`, en `PHASE 6`.

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Publica cuántas reglas tienen verificador que una compuerta ejecuta, sobre el total | TS-01 TS-05 TS-06 | selftest.sh · «lleva denominador» · «ni 0 ni el total» · «SIN EVALUAR» | salidas/audit-despues.txt · salidas/audit-sin-evaluar.txt | — | VERIFICADO |
| AC-02 | El informe distingue tres estados y no dos | TS-02 | selftest.sh · «declara las ejecutadas / las que nadie ejecuta / las que nadie verifica» | salidas/audit-despues.txt | — | VERIFICADO |
| AC-03 | Deja de afirmar cobertura completa cuando por regla no lo es | TS-03 | selftest.sh · «ya no dice cobertura completa» | salidas/audit-antes.txt · salidas/audit-despues.txt | — | VERIFICADO |
| AC-04 | Las reglas sin verificador se pueden enumerar | TS-04 | selftest.sh · «enumera las que nadie verifica / las que nadie ejecuta» | salidas/audit-enumerado.txt | — | VERIFICADO |
| AC-05 | La comprobación por componente no se pierde | TS-07 | selftest.sh · «cobertura sin huecos» | salidas/selftest-despues.txt | — | VERIFICADO |

`CasoQA` en `—`: herramienta de línea de comandos, y `FQAGE` opera desde un navegador contra
una URL desplegada (`QA-R01`). No aplicable, declarado en vez de dejado en blanco.

## Lo que la cifra no dice, declarado

«Citada» sigue siendo que el identificador aparezca en el texto de la herramienta, así que
**91 es un límite superior**: una mención en un comentario cuenta igual que una comprobación.
Afinarlo exigiría interpretar código y una heurística peor no sería una mejora. Está en el
self-review como el punto más discutible de esta tarea.
