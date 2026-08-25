# Escenarios de test — `PT-141`   `PHASE 4`

| TS | Escenario | Cierra |
|:---|:---|:---|
| `TS-01` | Un `catch` que interpola algo fuera de ámbito se nombra | AC-01 |
| `TS-02` | El mismo con la variable buena, no | AC-01 |
| `TS-03` | Lo declarado **dentro** del bloque no es hallazgo | AC-02 |
| `TS-04` | Lo declarado en la función que **envuelve**, tampoco | AC-02 |
| `TS-05` | El texto de una **cadena** no es un identificador | AC-02 |
| `TS-06` | Un **comentario** que explica el defecto no es el defecto | AC-02 |
| `TS-07` | Sin fuentes devuelve `null`, no cero | AC-05 |
| `TS-08` | El **árbol real** no tiene manejadores rotos | AC-03 |

## Cada filtro tiene su caso, y cada caso salió de un falso positivo real

`TS-03`, `TS-04`, `TS-05` y `TS-06` no son hipótesis: la primera versión de la heurística los
produjo, nueve hallazgos con seis falsos. **Un detector que grita seis veces de nueve se apaga.**
