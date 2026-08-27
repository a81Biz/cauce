# `PT-183` — Una bandera desconocida se ignora en silencio, y nueve `PT` quedaron sin lote

```yaml
---
id: PT-183
type: BUG
severity: S1
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

Que una bandera que el comando no conoce **se rechace**, y que un `PT` sin lote **no llegue** a
`DONE` con todos los verificadores en verde.

## 2. Comportamiento observado, medido

`asignar` lee `flag('--epica')`. Se escribió `--epic`. El valor se perdió y **nadie dijo nada**:

```
node tracker.mjs siguiente --banderaquenoexiste
  Sin divergencias.
```

El `undefined` viajó a los tres artefactos de gobernanza:

```
registro                          epic: undefined
changes/PT-178-…/intake.md        epic: undefined
docs/implementation/HISTORY.log   Lote: undefined
```

Alcance en el registro:

```
PT en el registro:  182     sin lote: 9

PT-025(DEFERRED)  PT-027(CLOSED)  PT-094(INTEGRATED)  PT-095(INTEGRATED)
PT-178(DONE)      PT-179(DRAFT)   PT-180(DRAFT)       PT-181(DRAFT)   PT-182(DRAFT)
```

**Los cinco últimos son de esta sesión y la anterior**, todos por el mismo error de una letra.
`EP-026` existe, tiene issue, y **está vacío**: sus cuatro tareas no lo citan.

Y `mover` —construido en `PT-162` para exactamente esto— **se niega**, porque trata «ponerle el
lote que le falta» como si fuera «cambiarlo de lote»:

```
✗ FDGE-R52   PT-178 esta en PHASE 8 / «DONE» y ya no se mueve: su evidencia, su rama y sus
             commits citan «undefined».
```

Su propio mensaje lo dice: citan `undefined`. No hay lote anterior que desmentir.

## 3. Por qué es `S1`

`EXEC-R03` hace `G4` una por lote; `SUITE-R45` hace que un lote resuelva sus filas al cerrar. Las
dos gobiernan **el lote**. Una tarea sin lote **no está bajo ninguna**: se integra sin que ninguna
compuerta de lote la mire. No es una etiqueta que falta — es trabajo fuera del alcance de las
compuertas que existen para mirarlo.

## 4. Alcance

| | |
|:---|:---|
| **IN** | `tracker`: una bandera `--algo` que ningún comando conoce **se rechaza**, y se dicen las que sí |
| **IN** | `mover`: asignar el lote a quien **no tiene ninguno** no es mover — se permite, y se distingue |
| **IN** | `verify-fdge`: un `PT` sin lote **falla**, desde `13.2.0` |
| **IN** | Los cinco recientes se reparan: `PT-178` a `EP-024`, `PT-179`–`PT-182` a `EP-026` |
| **OUT** | Reparar los cuatro históricos —`PT-025`, `PT-027`, `PT-094`, `PT-095`—. Son de antes, `SUITE-R09` es append-only, y `CE-014` prohíbe juzgar hacia atrás. Se **cuentan y se declaran**. |
| **OUT** | Adivinar el lote de un `PT` sin él. Se pide, no se infiere. |

## 5. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | Una bandera desconocida hace **fallar** al comando, y el mensaje enumera las conocidas |
| AC-02 | Las banderas legítimas de cada acción siguen funcionando — no hay regresión |
| AC-03 | `mover` asigna el lote a un `PT` que no tiene ninguno, sea cual sea su fase |
| AC-04 | `mover` **sigue negándose** a cambiar de lote a una tarea empezada que **sí** tiene uno |
| AC-05 | `verify-fdge` **falla** sobre un `PT` sin lote nacido desde `13.2.0`, y **cuenta y declara** los anteriores |
| AC-06 | Los cinco recientes citan su lote en registro, intake e `HISTORY`, y `EP-026` deja de estar vacío |

## Cómo termina   `FDGE-R53`

> Termina cuando: `tracker` rechaza una bandera desconocida, `verify-fdge` falla sobre un `PT` sin
> lote nacido desde `13.2.0`, y los cinco `PT` recientes citan su lote en los tres artefactos.

## 6. Riesgo

**Rechazar una bandera legítima.** La lista de banderas conocidas escrita a mano es exactamente el
defecto que `PT-057` condenó —«se arreglan con una regla de FORMA, no con un caso más»— y que este
archivo ya resolvió para el **valor** de un flag derivándolo de la posición. Aquí hay que derivar el
**nombre**: se recogen de los `flag('--…')` que el propio archivo contiene, no de una lista aparte
que envejecería. `AC-02` es el caso invertido que lo comprueba.

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
