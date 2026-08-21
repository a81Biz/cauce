# PT-091 — Escenarios   `FDGE-R16`

| | Escenario | Espera |
|:---|:---|:---|
| `E1` | cifra transcrita **igual** a la real | **verde** |
| `E2` | cifra **desviada** | se reporta con **las dos** cifras |
| `E3` | herramienta en el inventario y **no** en el árbol | «no existe», **aparte** |
| `E4` | fila de tabla de `services.md` | se lee |
| `E5` | línea que **no** es fila | no cuenta |
| `E6` | recuento de herramientas de `CLAUDE.md` | se lee |
| `E7` | lista de comandos de `CLAUDE.md` | se cuenta |
| `E8` | `tracker inventario` con una cifra desviada | la enumera |
| `E9` | …y dice **cómo** arreglarlo | `--aplicar` |
| `E10` | …y **sin** la marca no ha escrito nada | el archivo intacto |
| `E11` | …y **con** la marca la reescribe | la cifra corregida |
| `E12` | el árbol real | las 16 coinciden |

## `E3` es el que impide confundir dos hechos

Una herramienta **retirada** y una con la cifra desviada no son lo mismo, y el generador no puede
«corregir» la primera. `null` no es cero — `PT-058`, otra vez.

## `E10` es el que hace que `--aplicar` signifique algo

Sin él, la acción podría escribir siempre y el caso de `E11` seguiría en verde. Es el mismo par
que `asignar --ver` tiene desde `PT-062`.

## `E5` es el complemento de `E4`

Una línea de prosa que menciona una herramienta y un número **no es una fila**. Sin `E5`, el
lector podría casar cualquier texto y el generador reescribiría prosa.
