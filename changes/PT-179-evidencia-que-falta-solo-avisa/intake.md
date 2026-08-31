# `PT-179` — verify-fdge avisa por evidencia que falta estando la tarea pasada de PHASE 6

```yaml
---
id: PT-179
type: BUG
epic: EP-026
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

`verify-fdge` da **0 errores** a una tarea en `PHASE 7` **sin evidencia**, diciendo:

```
! FDGE-R23   PT-XXX: aún sin evidence/PT-XXX/manifest.json (normal antes de PHASE 6).
```

**La tarea ya pasó `PHASE 6`.** El aviso describe una situación que no es la suya: la compuerta
concede sin mirar la fase.

## 2. Por qué es un defecto   `[HUMANO]`

`PHASE 6` es la fase que **produce** el manifest. Una tarea en `PHASE 7` sin él no está «antes de
`PHASE 6`»: está **incumpliendo** `FDGE-R23`.

Y la prueba de que no es teórico está en el `SESSION_LOG` del lote que lo descubrió: tres errores de
evidencia —ruta equivocada, `tests` como cadena donde el esquema pide array, un `coverage` que
comparaba texto contra texto— **pasaron los tres en verde antes de corregirse**. Se dijo entonces:
*«son la prueba de `PT-179`»*.

Es la forma que da nombre al lote: **verde sin mirar**.

## 3. Cómo se arregla, y cómo NO

**No** convirtiendo el aviso en error siempre: antes de `PHASE 6` el manifest **no** tiene que
existir, y exigirlo bloquearía trabajo legítimo.

**Sí** haciendo que el veredicto dependa de la **fase declarada**: aviso antes de `PHASE 6`, error
desde `PHASE 6` cerrada. El dato ya está en el registro; sólo no se consulta.

## 4. Lo que NO promete   `SUITE-R26`

No revisa todas las reglas que conceden sin mirar la fase. Cubre `FDGE-R23`, que es la medida.
Si al ejecutarla aparecen otras, se declaran — no se arreglan de paso.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Falta el manifest y la tarea pasó `PHASE 6` ⇒ **error** | `TS-01` |
| `AC-02` | Falta el manifest y la tarea está antes de `PHASE 6` ⇒ **aviso**, como hoy | `TS-02` |
| `AC-03` | El mensaje no afirma «normal antes de `PHASE 6`» cuando la tarea ya pasó de ahí | `TS-03` |

## Severidad: PENDIENTE, y consta

El registro **no declara** severidad para esta tarea. El `SESSION_LOG` la describió como `S1`, y
**eso no se transcribe aquí como si fuera un hecho del registro**: el registro asigna (`SUITE-R08`).
Vence el `2026-09-30` (`PT-183`).

## Cómo termina   `FDGE-R53`

> Termina cuando: una tarea sin la evidencia que su fase ya debía haber producido **no puede** salir
> en verde.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
