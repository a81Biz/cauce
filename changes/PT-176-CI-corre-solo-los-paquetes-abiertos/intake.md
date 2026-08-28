# `PT-176` — El bloque se deriva de cuándo se añadió la sección, no de lo que declara

```yaml
---
id: PT-176
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

Que **toda** sección caiga en un bloque, incluidas las escritas antes de que existiera la idea de
bloque — y que eso valga igual en un proyecto destino que ya va empezado.

## 2. Lo que no funcionaba, medido

`PT-172` fijó que la versión se declara **en el intake**. Vale para lo que venga y **deja fuera todo
lo escrito**. El firmante lo nombró:

> *«si no sólo lo hará hacia adelante y no lo anterior»*

Agrupar por la versión MAYOR del `PT` que la sección **nombra** deja fuera **20 de 46** —incluida
`P · plataforma`, que sola es el **28 %** de la batería— porque no todas nombran un `PT`.

## 3. Lo que sí funciona

Toda sección tiene el **commit que la introdujo**, y ese commit declara una versión en
`package.json`. De ahí sale su MAYOR, y de ahí su bloque. **Retroactivo por construcción**: no hace
falta que nadie declare nada, ya está escrito — y la historia la tiene **cada destino en su propio
`git`**.

```
version actual: 13.x.x   ·   46 secciones   ·   1882 casos

  bloque  8.x.x   29 secciones   1389 casos   SELLABLE
  bloque  9.x.x    6 secciones     73 casos   SELLABLE
  bloque 10.x.x    8 secciones    198 casos   SELLABLE
  bloque 11.x.x    2 secciones    137 casos   SELLABLE
  bloque 13.x.x    1 sección       85 casos   ← abierto

SELLABLE: 45 secciones · 1797 casos = 95 % de la batería
```

**Las 46 caen en un bloque. Ninguna queda fuera.**

## 4. El ahorro real, medido

```
batería completa   1 415 s  (23,6 min)   1882 casos
bloque 13 solo       433 s  ( 7,2 min)     85 casos

casos saltados 95 %      tiempo ahorrado 69 %
```

**No es el 95 %, y decirlo lo sería.** El suelo lo pone el **andamiaje**: una sola sección con 85
casos cuesta 433 s. Es la misma cifra que `PT-169` midió cuando `--solo` tardaba `252 s` ejecutando
**cero** casos. Abaratar el montaje es otra tarea y otro lote.

## 5. Alcance

| | |
|:---|:---|
| **IN** | `bloquesDelArnes`: agrupa por MAYOR y marca **cerrado** lo anterior a la versión vigente |
| **IN** | El bloque de la versión **en curso** no se sella: ahí se sigue escribiendo |
| **IN** | Lo no clasificable **se declara** (`RULE-06`), no se sella |
| **IN** | `mayorDe` se **inyecta**: la función no habla con `git` y se puede comprobar sin repositorio |
| **OUT** | Cablear CI a los bloques. Necesita `PT-182`, que es quien integra — cambiar lo que CI ejecuta antes apagaría la única compuerta que hoy mira todo. |
| **OUT** | Prometer el 95 % de ahorro en tiempo. Son el 69 %, medidos. |

## 6. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | Las secciones se agrupan por versión MAYOR |
| AC-02 | Lo anterior a la versión vigente queda **cerrado** |
| AC-03 | El bloque de la versión vigente **no** cierra |
| AC-04 | Lo que no se puede clasificar **se declara** y no cae en ningún bloque |

## Cómo termina   `FDGE-R53`

> Termina cuando: las 46 secciones caen en un bloque derivado de su commit, los anteriores a la
> versión vigente quedan cerrados, el vigente no, y lo no clasificable se declara.

## 7. Riesgo

**Sellar por defecto lo que no se pudo clasificar.** Sería certificar lo que no se midió — lo
contrario de para qué existe esto. `AC-04` es el caso invertido: lo no clasificable sale por su
lado y **no** entra en ningún bloque.

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
