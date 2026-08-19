# PT-076 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Ningún caso escribe en el repositorio real | E1 | | | - | PENDIENTE |
| AC-02 | Los casos que necesitan historial real siguen leyéndolo | E2 | | | - | PENDIENTE |
| AC-03 | `sesion abrir`/`cerrar` se prueban en el fixture | E3 · E4 · E5 | | | - | PENDIENTE |
| AC-04 | Algo falla si vuelve a colarse una acción que escribe por `TRR` | E6 · E7 | | | - | PENDIENTE |
| AC-05 | Las 140 entradas ya escritas se declaran | E8 | | | - | PENDIENTE |

`E1` es el criterio de verdad: **huella antes, pasada completa, huella después**. Los demás
explican por qué, pero si `E1` pasa y los otros fallan, el daño está contenido; si `E1` falla,
lo demás da igual.
