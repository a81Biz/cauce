# PT-001 — Trazabilidad   `FDGE-R15`

`AC` y `TS` se declaran en `PHASE 4`. `Test` y `Evidencia`, en `PHASE 6`.

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Allocation viva sin issue hace fallar la verificación | TS-01 | | | — | PENDIENTE |
| AC-02 | Issue huérfano hace fallar la verificación | TS-02 | | | — | PENDIENTE |
| AC-03 | El espejo se ejecuta en CI, no solo a mano | TS-01 TS-02 | | | — | PENDIENTE |
| AC-04 | El espejo es precondición de G4 | TS-03 TS-04 | | | — | PENDIENTE |
| AC-05 | Sin credencial: bloquea donde es exigible, SIN EVALUAR donde no puede estar | TS-06 | | | — | PENDIENTE |
| AC-06 | Un proyecto sin plataforma declarada no se ve afectado | TS-05 | | | — | PENDIENTE |
| AC-07 | FDGE-R52 acepta el reanclaje donde CORE.md manda | TS-07 TS-08 | | | — | PENDIENTE |
| AC-08 | tracker no falla por etiquetas inexistentes | TS-09 | | | — | PENDIENTE |

`CasoQA` en `—`: `FQAGE` opera desde un navegador contra una URL desplegada (`QA-R01`) y esto
son herramientas de línea de comandos. No aplicable, declarado en vez de dejado en blanco.

`AC-07` cierra además el `AC-06` que `PT-004` dejó `PARCIAL`: es lo que desbloquea su `G4`.
