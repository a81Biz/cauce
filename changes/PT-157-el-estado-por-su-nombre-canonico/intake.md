# `PT-157` — `contradiceElRegistro` no reconoce el nombre canónico del estado

```yaml
---
id: PT-157
type: BUG
severity: S3
epic: EP-024
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que decir la verdad **no salga como contradicción**. Si el bloque `ESTADO` escribe que una tarea
quedó `REVERTED` y el registro dice `REVERTED`, la comprobación tiene que callarse.

## 2. Comportamiento observado, medido

`contradiceElRegistro` decide si el bloque **declara** el cierre buscando una lista escrita a mano:

```js
new RegExp(sujeto + '[^.]{0,80}(INTEGRAD|CERRAD|CLOSED|DEFERRED)', 'i')
```

Los estados terminales que `LEXICON` §5.1 declara son **cinco**:

```
INTEGRATED · CLOSED · REVERTED · REJECTED · DEFERRED
```

**Faltaban `REVERTED` y `REJECTED`.** Un bloque que dijera «`PT-155` quedó `REVERTED`» —el nombre
canónico, el hecho— salía acusado de contradecir al registro. Es `CE-017`: la comprobación acusa a
quien documenta el hecho. Y `CE-008`: dos listas de estados terminales con nombres distintos.

**Corrección de lo que el análisis creía.** El intake preliminar decía que también faltaba `DONE`.
Es falso: `DONE` **no es terminal** —`LEXICON` §5.1 lo declara «terminado, esperando `G4`»—, así que
la comprobación no se dispara para él y nunca hubo falso positivo por ahí. Se vio ejecutando los
cinco, no releyendo la lista.

## 3. Alcance

| | |
|:---|:---|
| **IN** | `patrones.mjs`: la lista se **deriva** de `ESTADOS_TERMINALES` |
| **IN** | Se conservan las formas en prosa `INTEGRAD` y `CERRAD`: el bloque `ESTADO` se escribe para leerse |
| **OUT** | Cambiar qué estados son terminales. Eso lo manda `LEXICON`, y aquí solo se lee. |
| **OUT** | Añadir `DONE`. No es terminal, y añadirlo sería declarar cerrado lo que espera `G4`. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | La lista se deriva de `ESTADOS_TERMINALES`, no se escribe a mano |
| `AC-02` | Los **cinco** estados terminales, escritos por su nombre canónico, no producen contradicción |
| `AC-03` | Un bloque que **sí** contradice al registro sigue produciéndola — el arreglo no apaga la comprobación |

## Cómo termina   `FDGE-R53`

> Termina cuando: los cinco estados terminales escritos por su nombre canónico no producen contradicción, y una contradicción real sigue produciéndose.

## 5. Riesgo

**Apagar la comprobación en vez de arreglarla.** Ampliar lo que cuenta como «lo declara» acerca el
patrón a aceptarlo todo. Por eso `AC-03` es un caso invertido: comprueba que el fallo sigue siendo
distinguible del acierto (`RULE-02`), que es justo lo que un arreglo perezoso rompe.

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
