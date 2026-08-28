# `PT-173` — Las secciones montan lo que necesitan — y resulta que ya lo hacían

```yaml
---
id: PT-173
type: CHORE
severity: S2
epic: EP-025
track: STANDARD
status: DONE
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que se pueda **demostrar**, y volver a demostrar, que el resultado de una sección es **suyo** y no de
la posición en que corrió. Sin eso, sellar un bloque certifica una propiedad de la secuencia.

## 2. Lo medido, ejecutando

```
46 secciones corridas AISLADAS, cada una con $WORK recién creado
46 en verde
1882 casos sumados en aislado  =  1882 casos de la corrida completa
```

**Ni un caso se pierde ni se gana.** La única que falló —`PT-091 · las cifras se derivan`— no
dependía de otra sección: su caso mide **el árbol real**, y sus cifras estaban viejas porque se
había editado `selftest.sh`. Refrescado el inventario, pasa.

## 3. La premisa del lote era falsa

El intake de `EP-025` declara:

> *«**338 de 1439** casos corren sobre el `$WORK` que dejó otra sección»*
> *«**Ocho secciones** tienen el 100 %. `D · migración` son 49 de 49»*

**`D · migración` pasa sola: 49 de 49.** Y las otras siete.

Antes de ejecutar se midió con **cuatro criterios estáticos**: `595`, `292`, `111`, `276`. Los cuatro
falsos, cada uno por una razón distinta, y ninguno cerca del `338`. **El número correcto es cero.**

Cada criterio intentaba **deducir** del texto qué monta y qué lee cada sección, y el shell no se
deja: comandos de varias líneas, rutas con variables, funciones por sustitución, `perl`, `sed -i`,
redirecciones dentro de `bash -c`. Afinar el detector era perseguir la sintaxis.

**Ejecutar no deduce: comprueba.** Y da lo que ninguna medida estática puede dar: la sección que
falla sola **dice qué le falta**.

## 4. Alcance

| | |
|:---|:---|
| **IN** | `--seccion`: corre **una** sección con `$WORK` recién creado |
| **IN** | Un patrón que no case ninguna sección es **rojo**, no verde por vacío |
| **IN** | La cifra del intake se **corrige** con la medida real, no se calla |
| **OUT** | «Hacer independientes» las secciones. **Ya lo son**: no hay nada que arreglar. |
| **OUT** | Demostrar que un **bloque** es independiente. Es otra pregunta y es de `PT-175`. |

## 5. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | `--seccion` corre una sola sección, con su terreno recién montado |
| AC-02 | Un patrón que no casa ninguna sección **falla** — el silencio no es éxito |
| AC-03 | Las 46 pasan aisladas, y la suma de sus casos **iguala** la corrida completa |
| AC-04 | La cifra falsa del intake del lote queda **corregida y explicada** |

## Cómo termina   `FDGE-R53`

> Termina cuando: `--seccion` corre una sección sola, las 46 pasan aisladas sumando los mismos casos
> que la corrida completa, y un patrón que no casa nada sale en rojo.

## 6. Riesgo

**Leer este resultado como más de lo que dice.** Que cada sección pase **sola** y pase **en su
posición** no prueba que pase **como parte de un bloque**: un bloque arranca limpio pero sus
secciones se acumulan entre ellas, y ése es un tercer caso que **no está medido**. Es poco probable
que rompa, y decir que está demostrado sería `SUITE-R26`. Lo establece `PT-175`.

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
