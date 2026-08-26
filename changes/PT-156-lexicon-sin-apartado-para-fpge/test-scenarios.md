# `PT-156` · `test-scenarios.md` — `PHASE 4`

| TS | Qué prueba | Cómo puede fallar | Mecanismo |
|:---|:---|:---|:---|
| `TS-01` | `FPGE-Implementation` numera sus pasos `PHASE n` | vuelve un `[n]` | `chk` · `chkno` |
| `TS-02` | `FPGE-Prompts` numera igual | sólo se cambia uno de los dos documentos | `chk` |
| `TS-03` | `LEXICON` §3 tiene apartado para `FPGE` | se borra o se renombra la cabecera | `chk` |
| `TS-04` | `CORE` publica `7 Stop◆` y **no** «promote» | vuelve la línea escrita a mano | `chk` · `chkno` |
| `TS-05` | Un rango declarado **sin** apartado en `LEXICON` se caza | fixture: se renombra `### 3.6` | `verify-patrones` |
| `TS-06` | Un apartado que el contrato da por `SIN_EVALUAR` se caza | fixture: `fases` vuelve a `SIN_EVALUAR` | `verify-patrones` |
| `TS-07` | El contraste **no lleva lista** de componentes | alguien escribe un array literal | `chkno` |
| `TS-08` | `audit` no reporta ningún hueco de clase `fase` | — | `npm run audit` |

## `TS-05` y `TS-06` son el par, y sin los dos no hay comprobación

Una sola dirección no sirve. Comprobar **sólo** que el rango exista permite escribirlo sin
documento del que salga: el «rango inventado» que `PT-144` describió al poner `SIN_EVALUAR`.
Comprobar **sólo** que el apartado exista permite dejar el contrato diciendo «no sé» con el dato
delante, y entonces `audit` audita **cero** fases de ese componente y sale en verde — el defecto
que `PT-147` midió sobre dos de los seis componentes.

**Medido, sobre copias del árbol:** `TS-05` → *«rango INVENTADO»*; `TS-06` → *«el contrato lo da
por `SIN_EVALUAR`»*. Las dos se ejecutaron antes de escribir esta tabla.

## Lo que estos casos NO establecen

Que los siete nombres de `LEXICON` §3.6 sean **los mismos** que los de los dos documentos
operativos. `TS-03` comprueba que la cabecera existe, no que la tabla coincida fila a fila. Se
verificó a mano y se declara (`SUITE-R26`): nada mecánico lo sostiene.
