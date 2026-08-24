# Fuera de alcance — `PT-113`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| **`AC-06` — «el diff fuera del `CHANGELOG` y las versiones es vacío»** | **Decae** con el reanclaje (`R-1`). Fue escrito para un `PATCH`; en un `MAJOR` que trae `FDGE-R55` y cuatro herramientas tocadas, exigirlo sería exigir lo contrario de lo que el lote hace. No se marca cumplido: se declara caído (`RULE-06`) | `PT-134` |
| Arreglar la compuerta que dejó salir la `12.0.0` sin pasar por `sellar` | Un `PATCH` corrige el texto, no la compuerta que no lo vigiló. Ahora tiene **instancia medida**: con el árbol en `13.0.0`, `sellar` ya no mira la entrada de la `12.0.0` y da verde sobre el defecto vivo | `PT-120` |
| Contrastar la cifra de cabecera de una entrada con el registro | «Doce» contra diecisiete es `H-007` otra vez (`PT-091`). Una entrada en prosa **no se genera**, así que no se puede derivar; lo que puede existir es algo que la **contraste** | `PT-120` |
| Despublicar o modificar la `12.0.0` de npm | No se puede, y se dice | — |
| Crear los tags `v10.0.0` y `v11.0.0` que también faltan | — | `PT-121` |

## `AC-06` es el único de los seis que no está verde, y no es un descuido

El marco **no tiene vocabulario para un `AC` firmado que deja de aplicar**. `FDGE-R15` exige un
`TS` a todo criterio, y un criterio caído no puede tenerlo: las dos salidas son **fingir un verde**
o **bloquear la tarea**. Hoy bloqueó, que es la menos mala de las dos, y por eso se ve.

`PT-134` queda `DEFERRED` con su `origin` citando esta tarea, que es lo que `SUITE-R44` pide para
que aplazar no sea narrar.
