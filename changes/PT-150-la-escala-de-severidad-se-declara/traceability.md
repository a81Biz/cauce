# PT-150 · `traceability.md` — `FDGE-R15`

> `Test` y `Evidencia` se rellenan desde `PHASE 6`. Vacíos aquí a propósito.

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La escala se declara una sola vez en `patrones.mjs` y las herramientas la consumen | TS-06 · TS-07 | — | — | n/a | `PENDIENTE` |
| AC-02 | La lista es la de `LEXICON`: `S1 S2 S3 S4` | TS-05 | — | — | n/a | `PENDIENTE` |
| AC-03 | `asignar --severidad S4` funciona | TS-01 · TS-04 | — | — | n/a | `PENDIENTE` |
| AC-04 | `asignar --severidad S0` falla | TS-03 | — | — | n/a | `PENDIENTE` |
| AC-05 | El mensaje enumera lo que `LEXICON` declara, **derivado** | TS-02 | — | — | n/a | `PENDIENTE` |
| AC-06 | Lo integrado no se rejuzga | TS-08 | — | — | n/a | `PENDIENTE` |
| AC-07 | Una severidad fuera de escala no entra **por comando ni sin que un verificador la cace** | TS-09 | — | — | n/a | `PENDIENTE` |

**`AC-07` no dice lo que decía el intake, y es deliberado.** El original prometía «por ningún
camino», y no es alcanzable: `REGISTRY.json` se escribe a mano y así entraron los cuatro `S4`.
Prometer la garantía completa sería `SUITE-R26` — afirmar lo que el mecanismo no da. Se cumple
por **comando + verificador**, y está desarrollado en `strategy.md` §7.

`Caso QA` es `n/a` en las siete: `QA-R01` exige navegador y este paquete no tiene interfaz.
`CASOS-DE-USO.md` lo declara en vez de forzarlo.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `verify-fdge` sigue rechazando `severity: S9` y vacío | TS-07 | `PENDIENTE` |
| RC-02 | El patrón tolera el comentario `# [HUMANO] S1 \| S2 \| S3 \| S4` que traen las plantillas | TS-07 | `PENDIENTE` |
| RC-03 | Las cinco allocations históricas siguen intactas | TS-08 | `PENDIENTE` |
| RC-04 | El recuento del `selftest` no baja | la batería | `PENDIENTE` |
