# `PT-174` — La selección sigue el grafo de importación

```yaml
---
id: PT-174
type: CHORE
severity: S2
epic: EP-025
track: STANDARD
status: DRAFT
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que un cambio en una herramienta active **todas** las secciones cuyo comportamiento depende de ella,
incluidas las que la usan **a través de otra**.

## 2. Comportamiento observado, medido

`seccionesAfectadas` compara el **nombre** del archivo que cambió con el que la sección menciona, y
ahí se acaba:

```
patrones.mjs      16 de 46 secciones
tracker.mjs       22 de 46
verify-fdge.mjs   28 de 46
```

Y a `patrones.mjs` **lo importan nueve herramientas** —`audit`, `build-core`, `comparar-marco`,
`migrate`, `tracker`, `verify-fdge`, `verify-patrones`, `verify-suite`—. Las secciones que ejercitan
cualquiera de ellas **no se activaban**, aunque su comportamiento dependa de lo que cambió.

Con el cierre transitivo: **44 de 46**.

## 3. Por qué importa para el sello

Sellar sobre entradas incompletas **certifica de menos**: un bloque queda sellado sin haber corrido
lo que sí dependía del cambio, y sigue certificando lo que ya no es.

## 4. Alcance

| | |
|:---|:---|
| **IN** | `importadoresDe`: el cierre transitivo, **derivado del código** |
| **IN** | `--afectados` lo usa: de 16 a 44 de 46 |
| **IN** | El objetivo entra en su propio cierre — lo que cambió también se ejercita |
| **OUT** | Una tabla de «quién importa a quién». Es la clase de mapa a mano que este lote lleva seis tareas quitando. |
| **OUT** | Afinar para activar **menos**. Peca de más a propósito: correr de más es recuperable, saltarse una sección es un falso verde (`PT-086`). |

## 5. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | El cierre alcanza a quien importa el archivo cambiado |
| AC-02 | Y a los **indirectos** — quien importa a quien lo importa |
| AC-03 | Lo que **no** lo importa **no entra** |
| AC-04 | El archivo cambiado entra en su propio cierre |

## Cómo termina   `FDGE-R53`

> Termina cuando: un cambio en `patrones.mjs` activa las secciones de las nueve herramientas que lo
> importan, y una herramienta que no lo importa sigue sin activarse.

## 6. Riesgo

**Que el cierre lo active todo siempre.** Si cualquier cambio activara las 46, la selección dejaría
de seleccionar y volvería a ser la batería completa con otro nombre. `AC-03` es el caso invertido
que lo impide: una herramienta que no importa lo que cambió **no entra**.

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
