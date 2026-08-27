# `PT-170` — `EXEC-R04` no reconocía una constancia real porque su encabezado usa otra palabra

```yaml
---
id: PT-170
type: BUG
severity: S2
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

Que una constancia de autorización **que existe y es válida** se reconozca, aunque su encabezado no
use la palabra que el patrón espera.

## 2. Comportamiento observado, medido

`anunciaAutorizacion` decidía leyendo **sólo el encabezado**: `RE_ANUNCIA` contra `RE_ESPERA`. Una
constancia real de `SESSION_LOG.md`, con la autorización escrita y el firmante nombrado, fue
**rechazada** porque su encabezado decía «espera» en otro sentido.

El defecto de fondo: se juzgaba por la **forma del título** un hecho que vive en el **cuerpo**.
`CE-001` — el proxy en lugar del hecho. Un encabezado es una pista; quién autoriza es un dato.

## 3. Alcance

| | |
|:---|:---|
| **IN** | `patrones.mjs`: campo estructurado `Autoriza: <nombre>` en el cuerpo, y basta con él |
| **IN** | El encabezado sigue valiendo cuando no hay campo — no se rompe lo ya escrito |
| **IN** | Un campo **vacío** o con **marcador** no cuenta |
| **OUT** | Comprobar que el nombre esté en `firmantes`. Eso ya lo hace `SUITE-R27` y no se duplica. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | Una constancia con `Autoriza: <nombre>` se reconoce, sea cual sea su encabezado |
| `AC-02` | Un encabezado que anuncia autorización sigue reconociéndose sin campo — no hay regresión |
| `AC-03` | `Autoriza:` vacío **no** cuenta |
| `AC-04` | `Autoriza:` con marcador entre corchetes **no** cuenta |

## Cómo termina   `FDGE-R53`

> Termina cuando: una constancia con `Autoriza: <nombre>` se reconoce sea cual sea su encabezado, y un campo vacío o con marcador **no** cuenta.

## 5. Riesgo

**Que el arreglo acepte más de la cuenta.** Añadir una vía nueva para dar por buena una autorización
es aflojar una compuerta. Por eso `AC-03` y `AC-04` son casos invertidos: comprueban que el campo
sólo cuenta cuando **dice algo**, y que un esqueleto sin rellenar no autoriza nada.

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
