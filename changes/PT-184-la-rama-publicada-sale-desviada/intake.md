# `PT-184` — El recorte del prefijo remoto nunca casa, y toda rama publicada bloquea `G4`

```yaml
---
id: PT-184
type: BUG
severity: S1
epic: EP-024
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

Que publicar una rama —requisito para abrir el PR que `SUITE-R42` exige— **no** la convierta en una
rama desviada.

## 2. Comportamiento observado, medido

Al abrir el PR de `EP-024`:

```
✗ FDGE-R19  1 rama(s) no coinciden con lo que «ramaDeTarea» deriva del registro:
   «origin/chore/alberto-martinez/PT-169-…» → deberia ser «chore/alberto-martinez/PT-169-…»
```

**La única diferencia es el prefijo `origin/`.** La rama no se desvió: se **publicó**.

```js
const RE_REMOTO = new RegExp('^remotes/[^/]+/');
git branch --format=%(refname:short) --all   →   origin/chore/…
```

El patrón está escrito para la forma **larga** y `%(refname:short)` devuelve la **corta**. **El
recorte nunca casa**: es código muerto que aparenta hacer su trabajo.

Y el **otro barrido del mismo archivo lo hace bien**, cuarenta líneas más abajo, con
`.replace(/^origin\//, '')`. Dos sitios para la misma pregunta, uno correcto y otro no — `RULE-01`
dentro del verificador que existe para cazar eso.

## 3. Por qué es `S1`

Cierra **la única puerta que el marco declara para integrar**: `G4` exige un PR, un PR exige
publicar la rama, y publicarla es lo que dispara el fallo. **La compuerta se bloquea a sí misma por
construcción.**

Y su mensaje empuja a lo contrario de lo que hay que hacer —*«renombrarla rompe su pull request,
así que esto se arregla en la SIGUIENTE»*— mientras **bloquea la actual**. `PT-183` acaba de
escribir por qué eso es lo peor que le puede pasar a una regla: se rodea.

## 4. Alcance

| | |
|:---|:---|
| **IN** | Lo que es un prefijo remoto lo dice **`git remote`**, no un patrón |
| **IN** | Se cubren las **dos** formas: `origin/x` y `remotes/origin/x` |
| **OUT** | Renombrar la rama de este lote. El propio verificador dice que una rama creada se termina como empezó. Se declara y se aplica en la siguiente. |
| **OUT** | Unificar los dos barridos en uno. Es correcto y es otra tarea: aquí se arregla el que miente. |

## 5. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | Una rama publicada `origin/<rama>` **no** se reporta como desviada |
| AC-02 | La forma larga `remotes/<remoto>/<rama>` tampoco |
| AC-03 | Una rama **local** de tres niveles conserva su primer nivel — no se le come `chore/` |
| AC-04 | Una rama que **de verdad** se desvía del nombre derivado **sigue** reportándose |
| AC-05 | **Ninguna** rama que `git` liste conserva su prefijo de remoto tras el recorte |

## Cómo termina   `FDGE-R53`

> Termina cuando: ninguna rama que `git` liste conserva su prefijo de remoto tras el recorte —en
> **cualquier** clon, no sólo en éste—, y una rama realmente desviada sigue saliendo.

**`AC-05` se reescribió después de escribirlo.** Decía *«`verify-fdge --gate G4` deja de fallar»*, y
eso es una propiedad **del checkout**: en CI la topología de ramas es otra y el caso salió rojo con
la batería local en verde. Un criterio que fija el estado de hoy mide la fecha, no la regla — la
misma avería que `PT-173` recoge, encontrada aquí por tercera vez.

## 6. Riesgo

**Recortar de más.** El primer intento fue `^(?:remotes/)?[^/]+/(?=.*/)` y se comía el primer nivel
de una rama **local** de tres: `chore/alberto-martinez/PT-169-x` → `alberto-martinez/PT-169-x`.
Adivinar por la forma no distingue `origin/a/b` de `chore/a/b`. `AC-03` es el caso invertido que lo
impide, y `AC-04` el que impide apagar la comprobación entera.

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
