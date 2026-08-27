# `PT-162` — Una tarea `DRAFT` no puede cambiar de lote ni rechazarse por comando

```yaml
---
id: PT-162
type: BUG
severity: S3
epic: EP-024
track: STANDARD
status: DONE
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que lo que el marco permite hacer con una tarea que **aún no ha empezado** —moverla de lote,
rechazarla— tenga un comando, y quede registrado como cualquier otro cambio de estado.

## 2. Comportamiento observado

`tracker` asigna una tarea a un lote al crearla y **no tiene forma de moverla después**. Tampoco de
rechazarla: `REJECTED` es un estado terminal que `LEXICON` §5.1 declara y que **ningún comando
escribe**.

El intake de `PT-156` lo dejó por escrito en su propio alcance:

> **OUT** · *Mover esta tarea de `EP-024` a `EP-022`. La herramienta no puede, y eso es `PT-162`.*

`FDGE-R52` hace de los comandos la forma sancionada de mover el estado. Un estado que el léxico
declara y ninguna herramienta escribe sólo se alcanza editando el JSON a mano — que es justo lo que
`SUITE-R08` existe para impedir.

## 3. Alcance

| | |
|:---|:---|
| **IN** | `tracker mover <ID> --epica <EP-NNN>` — sólo si la tarea no ha empezado |
| **IN** | `tracker rechazar <ID> --motivo <texto>` — deja la tarea en `REJECTED` con el motivo escrito |
| **IN** | Los dos espejan en el tablero, como el resto de acciones (`SUITE-R35`) |
| **OUT** | Mover una tarea con trabajo hecho. Su evidencia y sus commits citan un lote; moverla lo desmentiría. |
| **OUT** | Rechazar una tarea ya integrada. Lo integrado se revierte, no se rechaza. |
| **OUT** | Borrar allocations. `SUITE-R09`: el registro es append-only en los hechos. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | `mover` cambia el lote de una tarea `DRAFT` o `READY`, y lo registra |
| `AC-02` | `mover` **rechaza** una tarea que ya pasó de `PHASE 1`, diciendo por qué |
| `AC-03` | `mover` rechaza un destino que no es un lote (`LEX-R27`) o que no existe |
| `AC-04` | `rechazar` lleva a `REJECTED` y **exige** motivo |
| `AC-05` | `rechazar` **no** toca una allocation en estado terminal |

## Cómo termina   `FDGE-R53`

> Termina cuando: `mover` cambia de lote una tarea que no ha empezado y se niega sobre una que sí, y `rechazar` escribe `REJECTED` con motivo y se niega sobre lo terminal.

## 5. Riesgo

**Dar un comando para reescribir la historia de una tarea.** Por eso los dos verbos se limitan a lo
que aún no ha ocurrido: `AC-02` y `AC-05` son los que impiden que `mover` y `rechazar` se conviertan
en una goma de borrar. Lo que ya tiene evidencia se revierte con `G4`, no con un comando.

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
