# `PT-177` — Una nota de reanclaje perdida deja una cuenta que ningún comando puede reparar

```yaml
---
id: PT-177
type: BUG
severity: S3
epic: EP-024
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que una nota de reanclaje que **no llegó a publicarse** se pueda publicar después, sin mover la
fase y sin fingir cuándo se escribió.

## 2. Comportamiento observado, medido

`FDGE-R52` cuenta las notas del issue y exige `fase − 1`. `G4` sobre `PT-161`:

```
✗ FDGE-R52  PT-161: está en PHASE 8 y su issue #303 tiene 6 nota(s) de reanclaje; faltan 1.
```

**El déficit no se podía reparar.** `avanzar` publica una nota **y sube la fase** en el mismo acto,
así que intentar reparar con él agranda el hueco en vez de cerrarlo. Y `parada` se niega
explícitamente a publicar un `cambia-fase` suelto, porque *«dejaría una nota sobre una transición
que no ocurrió»* (`LEX-R30`).

**No había ningún comando que publicara una nota sin avanzar.** Una regla `HARD` con un
incumplimiento que la herramienta no permite corregir sólo se puede rodear.

## 3. Por qué se retomó ahora

Su condición de reentrada decía, literal: *«cuando `EP-024` se descomponga o cuando vuelva a
perderse una nota»*. Ocurrió, y bloqueó `G4` del lote. `LEX-R33`: se retoma cuando su condición se
cumple, no antes.

## 4. Alcance

| | |
|:---|:---|
| **IN** | `tracker reanclar <PT> --fase <n> --nota "…"` — publica **sin** mover la fase |
| **IN** | Se exige que la transición **ya haya ocurrido**: la fase actual mayor que la reanclada |
| **IN** | Se exige que **haya déficit**: inflar la cuenta engaña igual que acortarla |
| **IN** | La nota **dice que repara una pérdida** y lleva la fecha de hoy |
| **OUT** | Fingir la fecha de la transición. Es justo el dato que falta; inventarlo sería `SUITE-R26`. |
| **OUT** | Relajar `FDGE-R52`. La cuenta sigue exigiéndose; lo que se añade es la forma de cumplirla. |

## 5. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | `reanclar` publica la nota que falta y la cuenta pasa a cumplir `FDGE-R52` |
| AC-02 | Reanclar una fase **que no ha ocurrido** se niega (`LEX-R30`) |
| AC-03 | Reanclar donde **no hay déficit** no publica nada |
| AC-04 | La nota publicada **declara** que repara una pérdida, y lleva la fecha de hoy |
| AC-05 | La fase **no se mueve**: el registro dice lo mismo antes y después |

## Cómo termina   `FDGE-R53`

> Termina cuando: `PT-161` pasa `FDGE-R52` con las siete notas, la fase de `PT-161` es la misma
> antes y después, y reanclar una fase futura o sin déficit se niega.

## 6. Riesgo

**Dar una forma de inflar la cuenta.** Un comando que publica notas sueltas convierte `FDGE-R52` en
decorativa: bastaría con publicar tantas como haga falta. Por eso `AC-02` y `AC-03` son las dos
puertas —la transición tiene que haber ocurrido y tiene que faltar algo—, y son las que impiden que
esto sea una manera de aprobar la compuerta escribiendo comentarios.

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
