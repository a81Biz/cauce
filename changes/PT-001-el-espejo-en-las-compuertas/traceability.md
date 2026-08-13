# PT-001 — Trazabilidad   `FDGE-R15`

`AC` y `TS` se declaran en `PHASE 4`. `Test` y `Evidencia`, en `PHASE 6`.

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Allocation viva sin issue hace fallar la verificación | TS-01 | selftest.sh · «viva sin issue ⇒ divergencia» · «issue muerto ⇒ divergencia» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-02 | Issue huérfano hace fallar la verificación | TS-02 | selftest.sh · «issue huérfano ⇒ divergencia» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-03 | El espejo se ejecuta en CI, no solo a mano | TS-01 TS-02 | package.json · verify:espejo · verificacion.yml · paso del espejo | salidas/espejo-real.txt | — | VERIFICADO |
| AC-04 | El espejo es precondición de G4 | TS-03 TS-04 | selftest.sh · «sin plataforma ⇒ G4 libre del espejo» | salidas/g4-pt004-despues.txt | — | VERIFICADO |
| AC-05 | Sin credencial: bloquea donde es exigible, SIN EVALUAR donde no puede estar | TS-06 | selftest.sh · «declarada y sin acceso ⇒ 3» · «sin acceso dice cómo entrar» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-06 | Un proyecto sin plataforma declarada no se ve afectado | TS-05 | selftest.sh · «sin plataforma ⇒ código 2» · «⇒ exige bitácora» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-07 | FDGE-R52 acepta el reanclaje donde CORE.md manda | TS-07 TS-08 | selftest.sh · «sin plataforma ⇒ exige bitácora» · «⇒ bitácora al día» | salidas/notas-pt004.txt | — | VERIFICADO |
| AC-08 | tracker no falla por etiquetas inexistentes | TS-09 | selftest.sh · «etiquetas que faltan» | salidas/selftest-despues.txt | — | VERIFICADO |

`CasoQA` en `—`: `FQAGE` opera desde un navegador contra una URL desplegada (`QA-R01`) y esto
son herramientas de línea de comandos. No aplicable, declarado en vez de dejado en blanco.

`AC-07` cierra además el `AC-06` que `PT-004` dejó `PARCIAL`: es lo que desbloquea su `G4`.

## Verificado por ejecución real, además del arnés

`AC-03`, `AC-04` y `AC-07` se comprobaron **contra este repositorio y su GitHub**, no solo con
el fixture: el espejo cuadra 5 = 5, `verify-fdge --gate G4 PT-004` imprime
`✓ SUITE-R35 el espejo con github cuadra`, y `tracker notas PT-004` devuelve `2` leyendo los
comentarios del issue. Las salidas están en `evidence/PT-001/salidas/`.

## Lo que NO está verificado, declarado

- **La rama de fork en CI.** El `if:` que salta el paso está escrito y no se ha ejecutado:
  hace falta un PR desde un fork real.
- **`GH_TOKEN` en el runner.** Que el token por defecto alcance para `issue list` lo dirá el
  primer PR.

No son huecos silenciosos: se dicen (`RULE-06`).
