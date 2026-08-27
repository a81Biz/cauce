# `PT-186` — `FDGE-R01` falla sobre una tarea en `PHASE 1`, que es la fase que produce el intake

```yaml
---
id: PT-186
type: BUG
severity: S2
epic: EP-024
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.3.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que abrir una tarea **no** deje la CI en rojo hasta que se escriba su intake.

## 2. Comportamiento observado, medido

`npm run verify` — el mismo que corre CI:

```
✗ FDGE-R01  PT-179: no existe changes/PT-179-slug/. Todo trabajo entra por un Intake.
✗ FDGE-R01  PT-180 · PT-181 · PT-182: lo mismo.
```

Las cuatro están en **`PHASE 1` `DRAFT`**, en `EP-026`, **sin empezar**. Y `PHASE 1` **es la fase
que produce el intake**: exigirlo ahí es exigir el resultado de la fase para poder empezarla.

`PT-178` razonó exactamente esto **unas horas antes, en este mismo lote**, y por eso bloqueó sólo la
**salida** de `PHASE 1`. `checkPT` no hacía la distinción: sin carpeta, error, sea cual sea la fase.

## 3. Por qué no es sólo ruido

**Dos reglas del mismo marco empujando en direcciones opuestas.** `FDGE-R55` pide abrir el trabajo
en cuanto se encuentra —*«un hallazgo no se queda suelto»*— y esto **castigaba por obedecerla**.

La salida practicable era **no abrir la tarea hasta tener tiempo de escribir su intake**, que es
justo el comportamiento que `PT-159` acaba de cerrar. Una regla que empuja a rodear otra no se
cumple: se rodea.

## 4. Alcance

| | |
|:---|:---|
| **IN** | En `PHASE 1`, la ausencia del intake es **aviso** y dice que aún no es exigible |
| **IN** | Desde `PHASE 2` sigue siendo **error** |
| **OUT** | Relajarlo más allá de `PHASE 1`. `PT-178` ya impide salir sin él; el hueco se mueve, no se ensancha. |
| **OUT** | Escribir intakes de relleno para callar el rojo. Sería `CE-001` con otro traje. |

## 5. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | Una tarea en `PHASE 1` sin intake sale como **aviso**, no como error |
| AC-02 | El aviso **dice por qué** aún no es exigible y cita a `PT-178` |
| AC-03 | Una tarea en `PHASE 2` o más sin intake **sigue siendo error** |
| AC-04 | `npm run verify` deja de fallar por las cuatro de `EP-026` |

## Cómo termina   `FDGE-R53`

> Termina cuando: `verify-fdge` sobre una tarea en `PHASE 1` sin intake avisa en vez de fallar, una
> en `PHASE 2` sigue fallando, y `npm run verify` queda en verde.

## 6. Riesgo

**Abrir la puerta más de lo debido.** Degradar un error a aviso es aflojar. Lo que lo contiene es
que `PT-178` **ya impide salir de `PHASE 1` sin intake**: la exigencia no desaparece, se traslada al
único punto donde puede cumplirse. `AC-03` es el caso invertido que comprueba que a partir de
`PHASE 2` no se aflojó nada.

## 6. Fuera de lo declarado

`SUITE-R06(e)` cubre `docs/methodology/`. Esta tarea lo modifica **con intake firmado**, que es
como se mantiene este repositorio desde `SUITE-R41`. No hay merge, publicación ni borrado de datos
aquí: lo que toque la rama principal se detiene en `G4`, que es humana por definición.

## `G1` — Definition of Ready

VEREDICTO: PASS

Cada criterio nombra el mecanismo que lo comprueba, y el alcance declara qué **no** toca. Lo que se
afirma del comportamiento observado está **medido**, no supuesto: la medición está en §2 con el
comando que la produjo.

Firmado en `PHASE 1` por Alberto Martínez, 2026-08-26.

## Firma   `INTAKE-R06` · `SUITE-R27`

`EP-024` no está firmado como lote, así que esta tarea **no hereda nada de él**: `INTAKE-R08`
*admite* la firma por lote, no la impone.

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-26
He leído este Intake y confirmo que refleja mi intención: SÍ
```

### Constancia de cómo se escribió esta firma

La escribió el agente por delegación, con el VoBo que el firmante dio en sesión para las firmas de
este lote, y consta en `SESSION_LOG.md`. `SUITE-R27` dice lo que esto **no** prueba: que firmara
una persona. Sí lo hace contrastable — el nombre está en `firmantes`, y quien aparece en esa lista
responde de lo que lleva su nombre.
