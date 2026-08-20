# PT-070 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | `plan-layout` reconoce el código bajo `docs/` | E1 | en cauce da `bin docs/methodology/tools` | `salidas/alcance.txt` | PENDIENTE |
| AC-02 | Coincide con lo que el registro declara | E1 | idéntico a lo que `PT-020` escribió a mano | `salidas/alcance.txt` | PENDIENTE |
| AC-03 | Las pruebas y la evidencia quedan fuera | E2 | `evidence/` y `_archive/` excluidos (`FND-R28`) | `salidas/alcance.txt` | PENDIENTE |
| AC-04 | La suite instalada no entra en un proyecto ajeno | E3 | el proyecto nuevo da `src`, no `docs/methodology/tools src` | `salidas/alcance.txt` | PENDIENTE |
| AC-05 | El alcance baja hasta donde vive el código | E1 · E4 | no `docs`, sino `docs/methodology/tools` | `salidas/alcance.txt` | PENDIENTE |

## `AC-02` es la validación, no un criterio más

`PT-020` escribió `bin, docs/methodology/tools` **a mano** en el registro. La derivación produce
lo mismo, carácter por carácter. Que el cálculo reproduzca el juicio humano que lo precedió es la
mejor prueba de que acertó — y si hubiera diferido, el que estaría mal sería el cálculo.

## `AC-04` casi se me escapa

Al probarlo en el proyecto de `PT-072` el alcance salió `docs/methodology/tools src`: **las 16
herramientas del marco instalado** en el grafo de un proyecto ajeno. Sólo apareció ejecutándolo
fuera de cauce, y es exactamente el motivo por el que `PT-072` existe.
