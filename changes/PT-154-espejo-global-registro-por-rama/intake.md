# `PT-154` — El espejo es global y el registro es por rama

```yaml
---
id: PT-154
type: INVESTIGATION
severity: S3
epic: EP-024
track: STANDARD
status: DRAFT
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Qué se investiga

`SUITE-R35` dice que **el registro asigna y la plataforma espeja**. El registro es un archivo
versionado: su contenido **depende de la rama**. Los issues no: son globales al repositorio remoto.

Se investiga si el espejo puede contrastar dos cosas de alcance distinto sin producir divergencias
que no existen — y qué hacer si no puede.

## 2. Lo medido

```
main:     194 allocations
trabajo:  203 allocations
sólo en trabajo:  PT-171 PT-172 EP-025 PT-173 PT-174 PT-175 PT-176 PT-177 PT-178   (9)
de esas, con issue publicado en GitHub:  9
```

El barrido del espejo, para cada issue abierto que ninguna allocation reclama, empuja:

```
SUITE-R35 · El issue #N «…» está abierto y no lo reclama ninguna allocation
```

Desde `main`, hoy, eso son **nueve afirmaciones falsas**. No falta nada ni sobra nada: las nueve
allocations existen, están firmadas y tienen su issue. Lo que no existe **es su registro en esa
rama**. El espejo no dice desde dónde mira, así que su veredicto se lee como un hecho del
repositorio cuando es un hecho de la copia de trabajo.

**Lo que `SUITE-R47` ya resolvió, y lo que no.** `PT-026` vio la mitad de esto: en la rama por
defecto el espejo **informa y no bloquea**, porque el registro de ahí es la foto del último merge.
Eso evita el rojo permanente. Pero **informar una afirmación falsa sigue siendo afirmarla** — las
nueve seguían saliendo, una a una, como «no lo reclama ninguna allocation».

## 3. El dictamen

**No se puede cerrar la brecha comparando más fuerte: hay que declarar el alcance.** Un issue cuya
allocation no está en *esta* rama no es un huérfano — es algo que **no se puede evaluar desde aquí**,
y `RULE-06` dice exactamente qué se hace con eso: se declara no evaluable, no se afirma.

La rama de integración es la referencia (`trabajo`), porque es donde el trabajo en curso vive antes
de `G4`. Un issue que tampoco la reclama desde ahí **sí** es un huérfano de verdad.

## 4. Alcance

| | |
|:---|:---|
| **IN** | `espejo` declara **qué rama** produjo el registro que leyó |
| **IN** | Un issue sin allocation aquí, pero con allocation en la rama de integración, se reporta como **no evaluable**, no como divergencia |
| **IN** | Sin acceso a la rama de integración, se declara no evaluable — nunca se supone huérfano |
| **OUT** | Fusionar registros de varias ramas. Un registro que mezcla ramas no es el de ninguna. |
| **OUT** | Silenciar el aviso. Un huérfano real tiene que seguir viéndose. |

## 5. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | La salida de `espejo` nombra la rama del registro que leyó |
| `AC-02` | Un issue reclamado en la rama de integración y no aquí sale como **no evaluable**, no como divergencia |
| `AC-03` | Un issue que **nadie** reclama, ni aquí ni en integración, sigue saliendo como divergencia |
| `AC-04` | Sin acceso a la rama de integración, se declara no evaluable y se dice por qué (`RULE-06`) |

## Cómo termina   `FDGE-R53`

> Termina cuando: el espejo **nombra la rama** del registro que leyó, y un issue reclamado en la rama de integración sale como `NO EVALUABLE` mientras el que no reclama nadie sigue saliendo en rojo.

## 6. Riesgo

**Convertir el aviso en ruido tolerado.** Por eso `AC-03` es el caso invertido: si el arreglo hiciera
callar también al huérfano real, habría cambiado un falso positivo por un falso negativo, que es peor
— `RULE-02`, el fallo tiene que seguir siendo distinguible del acierto.

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
