# PT-074 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La viabilidad tiene una fase que la invoca | E1 | `selftest.sh`: «PHASE 4 cita la viabilidad» · «…y el prompt de G2 tambien» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-02 | El veredicto queda registrado y se puede auditar | E2 · E3 · E4 | `selftest.sh`: «el cuerpo lleva el veredicto» · «…y la naturaleza de la cifra» · «…y contra que se midio» | `salidas/issue-espejado.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-03 | `MARGINAL` y `UNSAFE` tienen consecuencia observable | E5 · E6 | `selftest.sh`: «MARGINAL dice que obliga» · «UNSAFE dice que detiene» | `salidas/issue-espejado.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-04 | `viabilidad` lee la marca correcta, y los quince se re-registran | E9 | re-registro de las quince de `EP-017` | `salidas/re-registro.txt` | - | VERIFICADO |
| AC-05 | Algo falla si la compuerta se queda sin invocación | E1 · E7 | `selftest.sh`: «PHASE 4 cita la viabilidad» · «sin viabilidad no inventa la linea» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-06 | El veredicto **se espeja** en la plataforma | E2 · E8 | `selftest.sh`: «el cuerpo lleva el veredicto» · «sin viabilidad no inventa la linea» | `salidas/issue-espejado.txt` | - | VERIFICADO |

## El antes y el después, en el tablero

```
ANTES    **INVESTIGATION** · severidad S1 · de la implementación `EP-017`
         Intake, criterios de aceptación y evidencia: [...]

DESPUES  Viabilidad (`FDGE-R54`): **MARGINAL** · coste — (SIN EVALUAR) · medida contra `7735ff4`
         > `MARGINAL` no prohíbe: obliga a trabajo **atomico** con checkpoint entre pasos.
```

Y los quince veredictos pasan de `medido_en: 258be16` —la sesión huérfana— a `7735ff4`.

## La inversa, y por qué costó dos intentos

La primera dio **verde en los tres casos**. El reemplazo no casó —los saltos de línea eran
`CRLF`— y `str.replace` no falla cuando no encuentra: hace nada, en silencio. **Una inversa que
no revierte nada certifica lo contrario de lo que pretende.**

Repetida con `assert`:

```
✗ el cuerpo lleva el veredicto     cae
✗ MARGINAL dice que obliga         cae
✓ sin viabilidad no inventa        sigue pasando — no depende del arreglo
```

Es la lección de `PT-050` —«un caso que pasa en las dos direcciones no prueba nada»— aplicada a
la propia herramienta de verificar.

## `AC-05` y `E7` son la misma guarda vista al revés

`E7` comprueba que **sin** viabilidad no se inventa una línea. Una allocation recién asignada no
la tiene hasta `G2`, y emitir `SIN EVALUAR` ahí sería inventar un dato donde sólo hay un hueco
(`RULE-06`). En la inversa **sigue pasando**, que es lo correcto: no depende del arreglo.
