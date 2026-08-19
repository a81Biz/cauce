# PT-066 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Las 20 reglas `CHECK` de `RULES.md` se encuentran | E1 · E6 | | | - | PENDIENTE |
| AC-02 | Las 15 `EXEC-R*` se encuentran | E2 · E6 | | | - | PENDIENTE |
| AC-03 | Las `LEX-R*` se encuentran | E3 · E6 | | | - | PENDIENTE |
| AC-04 | Nunca se devuelve el texto de otra regla | E4 · E6 | | | - | PENDIENTE |
| AC-05 | Una regla que de verdad no existe se sigue declarando inexistente | E5 | | | - | PENDIENTE |
| AC-06 | Un caso por cada uno de los IDs definidos, derivado y no escrito a mano | E6 | | | - | PENDIENTE |

**`AC-06` es el que hace verificables a los otros cinco.** Recorre los tres documentos
propietarios y exige, por cada ID, que la definición devuelta **empiece por ese ID**. Sin esa
segunda condición, «devuelve algo» pasa por «devuelve lo correcto» — y así 26 reglas devolvían
el texto de otra sin que nadie lo viera.
