# PT-068 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un usuario no declarado NO deriva la sesión de otra persona | E1 · E4 | | | - | PENDIENTE |
| AC-02 | La misma persona no aparece como dos sesiones abiertas | E5 | | | - | PENDIENTE |
| AC-03 | Los mensajes dicen el archivo que de verdad se escribe | E7 | | | - | PENDIENTE |
| AC-04 | `sesion cerrar` deja de afirmar algo falso | E8 | | | - | PENDIENTE |
| AC-05 | Con una sola persona declarada nada cambia | E2 · E3 | | | - | PENDIENTE |
| AC-06 | El caso cubre la **elección de archivo**, no sólo las funciones puras | E1..E5 | | | - | PENDIENTE |
| AC-07 | `viabilidad` lee la MISMA marca que `sesion` | E6 | | | - | PENDIENTE |

**`AC-06` es el que faltaba en `PT-065`.** Sus seis criterios se comprobaban con casos que
construyen la marca a mano y llaman a funciones puras. Ninguno ejercitaba **de qué archivo sale**
— que es lo único que aquella tarea cambió.
