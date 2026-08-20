# PT-083 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | La plantilla rellenada tal cual pasa `FDGE-R04` | E1 | `selftest.sh`: «la plantilla BUG-REPORT no falla FDGE-R04» | `salidas/plantillas.txt` | PENDIENTE |
| AC-02 | El criterio es el mismo para los seis campos | E2 | los cinco vecinos ya toleraban el comentario; `severity` era el único que no | `salidas/plantillas.txt` | PENDIENTE |
| AC-03 | Una severidad inválida sigue fallando | E3 | `selftest.sh`: «una severidad invalida SIGUE fallando» · «…y una vacia tambien» | `salidas/plantillas.txt` | PENDIENTE |
| AC-04 | Las **cuatro** plantillas se comprueban, no sólo la de `BUG` | E1 | `selftest.sh`: el bucle sobre `BUG-REPORT`, `FEATURE-REQUEST`, `CHANGE-REQUEST` | `salidas/plantillas.txt` | **PARCIAL — declarado** |
| AC-05 | La comprobación es mecánica | E1 | un caso rellena cada plantilla y la pasa por `verify-fdge` | `salidas/plantillas.txt` | PENDIENTE |

## `AC-04` está **parcial**, y se dice

El intake pedía **cuatro** plantillas: `BUG-REPORT`, `FEATURE-REQUEST`, `CHANGE-REQUEST`,
`EPIC-INTAKE` y `TAREA`. Se comprueban **las tres primeras**.

`EPIC-INTAKE.md` describe un **lote**, y `verify-fdge PT-NNN` valida una **tarea**: pasarle un
intake de `EP` mediría otra cosa. `TAREA.md` es la plantilla ligera de `FDGE-R51`, que hereda la
severidad del lote y por tanto **no declara `severity`** — el campo que este defecto afecta.

Ninguna de las dos tiene el defecto, y ninguna se comprueba. Es una reducción de alcance con
motivo, no un olvido.

## `AC-03` es lo que impide que el arreglo abra una puerta

Relajar un ancla es la clase de cambio que soluciona un caso y admite tres. `severity: S9` y
`severity:` vacío siguen fallando, comprobado con los cinco casos **antes** de tocar el arnés.
