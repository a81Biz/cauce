# `PT-189` — `FDGE-R54` bloquea con un pronóstico sobre una tarea que ya terminó

```yaml
---
id: PT-189
type: BUG
severity: S2
epic: EP-025
track: STANDARD
status: DONE
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.3.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que una compuerta que existe para **detener antes de empezar** no detenga sobre trabajo ya
terminado, y que distinguir las dos situaciones **esté en el mecanismo**, no en una autorización
fuera de él.

## 2. Comportamiento observado, medido

`PT-188` en `PHASE 8`: implementada, ocho casos en verde, batería `OK · 1878`, `HISTORY` escrito y
`G3` firmada. Y la compuerta la detiene:

```
✗ FDGE-R54  PT-188: viabilidad UNSAFE y la tarea esta en PHASE 8.
            UNSAFE exige evidencia EN CONTRA, asi que no es una duda.
```

El veredicto compara **coste estimado** (`1458`) contra **lo mayor hecho hoy** (`927`). Es una
predicción —*«no se empieza lo que no se puede terminar»*— evaluada **después de terminar**.

```js
if (rige('FDGE-R54') && !esLote(…) && !ESTADOS_TERMINALES.has(status)) { … }
```

Se salta en estado **terminal**, y `DONE` **no lo es** (`LEXICON` §5.1). Una tarea acabada y
verificada seguía bajo una compuerta que pregunta si podrá acabarse.

**Y no había salida declarada.** La única vía era la cláusula general de `SUITE-R06` —autorización
humana con registro—, que es una puerta **fuera del mecanismo**. `PT-183` escribió por qué eso es lo
peor que le puede pasar a una regla.

## 3. Por qué es universal

**Todo proyecto destino lo encuentra.** La compuerta compara contra el precedente **del día**, así
que cualquier sesión larga —justo las que cierran un lote— la dispara sobre sus últimas tareas, y
las dispara **cuando ya están hechas**, que es cuando el aviso no sirve para nada.

## 4. Alcance

| | |
|:---|:---|
| **IN** | `UNSAFE` **avisa** desde `PHASE 8`: ahí la predicción ya no decide nada |
| **IN** | Sigue **fallando** en `PHASE 5`, `6` y `7`, donde queda trabajo por hacer |
| **IN** | El aviso dice que el veredicto era **previo** y por qué ya no bloquea |
| **OUT** | Relajar `UNSAFE` en general. Su función —detener antes de empezar— no se toca. |
| **OUT** | Recalcular el veredicto al terminar. Sería reescribir lo que la compuerta midió, y `SUITE-R09` lo impide. |

## 5. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | `UNSAFE` en `PHASE 8` **avisa** en vez de fallar |
| AC-02 | El aviso explica que el veredicto era previo y que el trabajo está hecho |
| AC-03 | `UNSAFE` en `PHASE 6` **sigue siendo error** |
| AC-04 | En `PHASE 6` **no** aparece la excusa de estar hecho |

## Cómo termina   `FDGE-R53`

> Termina cuando: una tarea `UNSAFE` en `PHASE 8` pasa con aviso, una en `PHASE 6` sigue en rojo, y
> ninguna necesita una autorización fuera del mecanismo para cerrar.

## 6. Riesgo

**Aflojar la compuerta.** Degradar un error a aviso es aflojar, y lo único que lo hace aceptable es
que el punto elegido —`PHASE 8`— es aquel en el que la pregunta que hace **ya no tiene respuesta
útil**: el trabajo está hecho, y detenerlo no lo deshace. `AC-03` y `AC-04` son los casos invertidos
que comprueban que donde sí queda trabajo no se aflojó nada.

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
