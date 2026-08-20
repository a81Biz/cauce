# PT-089 — Escenarios   `FDGE-R16`

**Cada comprobación con su complemento**: sin él, un verificador que fallara siempre cumpliría el
escenario positivo.

| | Escenario | Espera |
|:---|:---|:---|
| `E1` | registro `INTEGRATED`, YAML `READY` | **rojo** · «es un archivo que se quedó atrás» |
| `E2` | mismo caso | el mensaje contiene «NO establece cuál de las dos» |
| `E3` | registro `IN_PROGRESS`, YAML `READY` — dos **vivos** distintos | **verde** · es una diferencia real entre fuentes |
| `E4` | registro `INTEGRATED`, YAML `CLOSED` — dos **terminales** | **verde** · no apaga nada |
| `E5` | `phase` 9 en registro, 1 en YAML | **verde** en el error… |
| `E6` | …y **aviso** en `SUITE-R35` | el aviso sigue |
| `E7` | `avanzar` a la última fase | registro queda `INTEGRATED` |
| `E8` | …y el YAML también | `status: INTEGRATED` en el intake |
| `E9` | `avanzar` a la última fase con la tarea ya `DEFERRED` | sigue `DEFERRED` |
| `E10` | el árbol real | ninguna terminal sin sincronizar |

## `E3` y `E4` son los que impiden que nazca roja

Sin ellos, el criterio podría ser «cualquier divergencia» y los casos positivos pasarían igual.
Son los que fijan **dónde está la frontera**, y la frontera es el hallazgo de `PHASE 2`: de las
seis divergencias reales, las seis cruzan de terminal a vivo. Ninguna es `E3` ni `E4`.

## `E9` es el que impide que la herramienta decida

`FDGE-R53` dice que la tarea declara cómo termina. Sin `E9`, `avanzar` podría pisar un
`DEFERRED` o un `REJECTED` con `INTEGRATED` y nadie lo notaría hasta que pasara.

## `E10` no es ceremonia

Comprueba el árbol **real**, no el fixture. Las seis se sincronizaron a mano en esta tarea, y sin
`E10` nada impediría que la séptima apareciera mañana sin que nadie mirase.
