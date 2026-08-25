# PT-150 · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La escala se declara una sola vez en `patrones.mjs` y las herramientas la consumen | TS-06 · TS-07 | `verify-patrones.mjs` · bloque `PT-150` | `salidas/verify-patrones.out` | n/a | `CUMPLIDO` |
| AC-02 | La lista es la de `LEXICON` §8.3: `S1 S2 S3 S4` | TS-05 | `verify-patrones.mjs` | `salidas/verify-patrones.out` | n/a | `CUMPLIDO` |
| AC-03 | `asignar --severidad S4` funciona, incluido el valor por defecto de la plantilla | TS-01 · TS-04 | `selftest.sh` ×2 | `salidas/asignar-s4.out` · `salidas/selftest-plantilla.out` | n/a | `CUMPLIDO` |
| AC-04 | `asignar --severidad S0` falla | TS-03 | `selftest.sh` | `salidas/asignar-s0.out` | n/a | `CUMPLIDO` |
| AC-05 | El mensaje enumera lo que `LEXICON` declara, **derivado** | TS-02 | `selftest.sh` ×2 | `salidas/asignar-s0.out` | n/a | `CUMPLIDO` |
| AC-06 | Lo integrado no se rejuzga | TS-08 | `selftest.sh` ×2 · `git diff` | `salidas/ac06-historicas.out` | n/a | `CUMPLIDO` |
| AC-07 | Una severidad fuera de escala no entra por comando, y **se caza en trabajo vivo** | TS-09 | `selftest.sh` | `salidas/selftest-s0.out` | n/a | `CUMPLIDO` |

**`AC-07` no dice lo que decía el intake, y es deliberado.** El original prometía «por ningún
camino» y no es alcanzable: `REGISTRY.json` se escribe a mano y así entraron los cuatro `S4`.
Prometer la garantía completa sería `SUITE-R26`. Se cumple por **comando + verificador**, y el
verificador nuevo mira **el registro**, no solo el intake — porque `FDGE-R04` lee `severity:` del
intake y se salta los que heredan del lote (`FDGE-R51`), así que una severidad inválida en el
registro **no la miraba nadie**.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `verify-fdge` sigue rechazando `severity: S9` y vacío | `verify-patrones` | `CUMPLIDO` |
| RC-02 | El patrón tolera el comentario de las plantillas del paquete | `verify-patrones` | `CUMPLIDO` |
| RC-03 | Las cinco allocations históricas siguen intactas | `git diff` sobre `REGISTRY.json` | `CUMPLIDO` |
| RC-04 | El recuento del `selftest` no baja | 1703 → **1711** | `CUMPLIDO` |

## Lo que encontró equivocarse

Tres casos afirmaban sobre el **identificador** —`"PT-001"`— y el fixture nombra los tres por
`FDGE-R01`, porque no tienen `changes/`. **Uno pasaba en verde por una razón ajena** a lo que
decía comprobar.

Corregidos para afirmar sobre el **mensaje de severidad**. Es la misma clase de error que
`PT-144` cometió con el caso que esperaba un `SyntaxError`: una comprobación que pasa por el
motivo equivocado no es una comprobación.
