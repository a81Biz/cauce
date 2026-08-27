# `PT-167` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Existe un barrido que **señala** los casos sospechosos | TS-08 | `audit` sobre el árbol real | `evidence/PT-167/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | Caza los **cuatro** que `EP-022` encontró, como fixture | TS-01..TS-04 | `selftest` ×4 | `evidence/PT-167/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-03 | **No** caza un caso legítimo que asierta sobre un mensaje de error | TS-05..TS-07 | `selftest` ×3 | `evidence/PT-167/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-04 | Lo que no puede decidir sale como **candidato**, no como fallo | TS-08 | `audit` emite `warn`, no `gap` | `evidence/PT-167/salidas/audit.out` | n/a | `CUMPLIDO` |

**`AC-03` es el que decidió el diseño, no `AC-01`.** Se probaron **tres** criterios y sólo el
tercero da cero falsos positivos:

| Criterio | Falsos |
|:---|---:|
| la **explicación** del hueco | 30 |
| el **esqueleto** del identificador | 9 |
| el identificador **instanciado** | **0** |

Los dos primeros habrían cazado los cuatro conocidos **y** los tres legítimos. Un barrido así se
desactiva en la primera corrida.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `audit` sigue saliendo en verde sobre el árbol real | `sin huecos` · `EXIT=0` | `CUMPLIDO` |
| RC-02 | El barrido no convierte candidatos en huecos | emite `warn`, no `gap` | `CUMPLIDO` |
| RC-03 | Ninguna regla nueva: se acoge a `SUITE-R61` | `verify-suite` | `CUMPLIDO` |

## Lo que esta tarea destapó, y **tiene tarea**

Nada nuevo. Dos cosas quedaron registradas como parada **sin abrir trabajo**:

- Un caso mío que **no podía pasar** —esperaba una cadena de un `grep -c`— y salió en rojo a la
  primera. Corregido; no es un hueco del marco sino de mi escritura.
- **Edité `audit.mjs` con la batería corriendo** y la corrida quedó invalidada: dos rojos que eran
  una **foto movida**, no una regresión. La línea `3` del `no hacer` se amplió — no es sólo
  `selftest.sh`, es **cualquier herramienta que los casos invoquen**.
