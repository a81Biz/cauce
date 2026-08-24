# `PT-131` — Cambios de especificación   `PHASE 4`

## Ninguno. Y se dice en vez de callarlo.

**No cambia ninguna regla, ningún nombre canónico y ninguna obligación.** `SUITE-R57` sigue
diciendo exactamente lo mismo: *«lo integrado no se acumula sin sellar»*. Lo que cambia es que su
**comprobación mida lo que la regla dice** en vez de un proxy.

| Documento | Decisión | Motivo |
|:---|:---|:---|
| `RULES.md` | NO PROCEDE | El enunciado de `SUITE-R57` es correcto. El defecto está en el verificador |
| `LEXICON.md` | NO PROCEDE | No aparece vocabulario nuevo. `ESTADOS_TERMINALES` no se toca |
| `EXECUTION-MODES.md` | NO PROCEDE | `G2` no cambia de dueño ni de condición |
| `RIGE_DESDE` | NO PROCEDE | La regla no empieza a juzgar nada nuevo: **deja de juzgar mal** lo que ya juzgaba |
| `CHANGELOG.md` | ACTUALIZADO al cerrar el lote | Corrección de comportamiento de una comprobación. No es `MAJOR`: un destino no tiene nada que migrar |

## Por qué esto importa decirlo

`SUITE-R26` mide cuántas `HARD` tienen comprobación. Una comprobación que **existe y mide otra
cosa** cuenta como cubierta y no lo está — es peor que una que falta, porque la falta se ve. Esta
tarea no añade cobertura: **corrige una que estaba inflada**.
