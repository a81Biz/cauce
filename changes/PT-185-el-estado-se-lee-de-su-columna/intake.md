# `PT-185` — El estado del índice se busca en toda la línea, y un título que nombre un estado lo rompe

```yaml
---
id: PT-185
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

Que el estado que declara una línea de índice se lea **de su columna**, y que un título pueda
nombrar un estado sin que la comprobación lo confunda con el estado de la tarea.

## 2. Comportamiento observado, medido

`G4` sobre `PT-162`:

```
✗ SUITE-R35  PT-162: «estado» divergente — el registro dice «DONE»
             y su línea de índice en DISCOVERY.md dice «DRAFT».
```

**El índice era correcto.** Su línea es:

```
| PT-162 | BUG | S3 | DONE | EP-024 | Una tarea DRAFT no puede cambiar de lote… |
                     ^^^^ lo cierto        ^^^^^ lo que leía
```

`LIFECYCLE.find((st) => new RegExp('\b'+st+'\b').test(line))` devuelve el primer estado **de la
lista** que aparezca en **cualquier punto de la fila**, incluido el título. `DRAFT` precede a `DONE`
en `LIFECYCLE`, así que ganó el del título.

**La tarea se llama así porque va de eso**: `PT-162` construyó `mover` y `rechazar` para tareas en
`DRAFT`. Es `CE-017` en su forma más limpia: la comprobación acusa a quien documenta el hecho, y
sólo se dispara sobre las tareas cuyo título nombra aquello de lo que tratan.

## 3. Alcance

| | |
|:---|:---|
| **IN** | El estado se lee de la **celda**, como hace `parseTraceability` |
| **IN** | Si la fila **no** es una tabla, se cae al barrido anterior — no evaluar sería peor |
| **OUT** | Cambiar el título de `PT-162`. Sería esconder el defecto renombrando el síntoma. |
| **OUT** | Reordenar `LIFECYCLE`. El orden no es la causa: cualquier estado en un título rompería igual. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | Una fila cuyo **título** nombra un estado se lee por su **columna** |
| AC-02 | Una fila cuya columna **sí** diverge del registro **sigue** saliendo |
| AC-03 | Una línea que no es fila de tabla se sigue evaluando con el barrido anterior |
| AC-04 | `verify-fdge --gate G4 PT-162` deja de fallar por este motivo |

## Cómo termina   `FDGE-R53`

> Termina cuando: `PT-162` pasa `G4` sin tocar su título, y una divergencia real de la columna
> sigue reportándose.

## 5. Riesgo

**Dejar de evaluar donde no hay tabla.** Si la celda no se encuentra y no hubiera respaldo, la
comprobación se apagaría en silencio sobre los índices que no usan tabla — cambiar un falso
positivo por un falso negativo, que es peor (`RULE-02`). Por eso el barrido anterior se conserva
como respaldo y `AC-03` lo comprueba.

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
