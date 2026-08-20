# PT-069 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | Existe un generador de los tres índices | E1 | `tracker indices` | `salidas/indices.txt` | PENDIENTE |
| AC-02 | Sin `--aplicar` sólo enumera | E2 | el contrato de `abrir`, `cerrar` y `proyectar` | `salidas/indices.txt` | PENDIENTE |
| AC-03 | El reparto sigue `LEX-R12` | E3 | bugs e investigaciones · features · refactors y chores | `salidas/indices.txt` | PENDIENTE |
| AC-04 | Ninguna tarea del registro queda fuera | E4 | los 86 `PT` aparecen en alguno de los tres | `salidas/indices.txt` | PENDIENTE |
| AC-05 | Los lotes no entran | E3 | un `EP` no es una tarea; su sitio es `BACKLOG` | `salidas/indices.txt` | PENDIENTE |
| AC-06 | Cada índice declara que es derivado | E1 | la cabecera avisa de que editarlo a mano se pierde | `salidas/indices.txt` | PENDIENTE |

## `AC-04` es el criterio que importa

Antes había **89 filas para 86 tareas**, y la diferencia no era duplicación: **27 estaban mal
archivadas** —16 bugs y 11 features en el índice de refactors—. La comprobación no es que los
números cuadren, sino que **ningún `PT` del registro quede fuera de todo índice**.

Comprobado que ninguna se perdió: los 28 IDs que salieron de `REFACTOR_SCOPE` siguen todos en el
registro, y aparecen en el índice que les toca.

## Lo que NO entra, declarado

`BACKLOG.md` no se genera. `FDGE-R40` le exige el plan de solapamiento, que sale del `tasks.md` de
cada tarea y no del registro. Generarlo con las columnas de los otros tres produciría un
`BACKLOG` que parece al día y ha perdido lo único que lo hacía útil.
