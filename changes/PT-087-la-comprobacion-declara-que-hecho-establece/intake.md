# PT-087 — La comprobacion declara que hecho establece

> Plantilla de **tarea dentro de una implementacion abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-018` (`INTAKE-R08`).

```yaml
---
id: PT-087
type: BUG
epic: EP-018
track: STANDARD
status: READY
phase: 1
created: 2026-08-20
structural: no
suite_version: 10.0.0
severity: S1
---
```

## 1. Que se quiere   `[HUMANO]`

> «necesitamos atender el hallazgo sobre verificar un proxy barato en lugar del hecho»

Origen: [`H-003`](../../PTSA/Findings/H-003.md) · `D1` · **ALTA**.

## 2. Las cinco instancias, y por que no basta con corregirlas

| Comprobacion | Verificaba | En vez de | Gobierna | Estado |
|:---|:---|:---|:---|:---|
| `SUITE-R34` | la fecha del archivo | su contenido | compuerta | corregida `PT-085` |
| `FDGE-R43` | si se movieron archivos | si el grafo describe el codigo | compuerta | corregida `PT-085` |
| `audit` | menciones de un ID | emisiones del verificador | cobertura | corregida `PT-067` |
| `regla` | la primera linea que cita un ID | la definicion | consulta que bloquea | corregida `PT-078` |
| `sellar` paso 1 | que **exista** entrada en `CHANGELOG` | que **enumere** las reglas nuevas | `G2` | **abierta** |
| `SUITE-R27` | una **frase** en cualquier parte del archivo | la firma **dentro de su bloque** | `G1` | **abierta** |

**Cuatro corregidas una a una; la quinta apareció sellando la versión que las corregía, y la
sexta escribiendo este mismo intake.** Ese es el dato: la causa no está en las instancias.

Consecuencia concreta de la quinta: `SUITE-R57` —regla `HARD` nueva que bloquea `G2`— **no estaba
en la guia de migracion de la `10.0.0`**. El paso comprobaba que la guia existiera. Existia.

### La sexta apareció escribiendo este intake

`verify-fdge` rechazó el intake de `PT-093` con:

```
✗ SUITE-R27  PT-093/intake.md: firma «<persona>» en HISTORY.log», que no figura en firmantes
```

No había ninguna firma: había una **cita en prosa** explicando qué exige `SUITE-R06`.

```js
const RE_QUIEN = /(?:integrado|resuelto|autorizado|validado|aprobado)\s+por:\s*(\S+)/i;
```

Busca la frase **en todo el archivo**. Y `RE_SIGN_BLOCK` —que localiza el bloque `## Firma`— ya
existe tres líneas más arriba: **el hecho es identificable y la comprobación no lo usa.**

Se arregló la prosa para poder seguir, y se registra aquí porque es la prueba más limpia de que el
patrón sigue vivo: **lo encontró el propio verificador, contra un archivo escrito para cerrarlo**,
a las horas de haber cerrado la quinta.

**Y volvió a ocurrir dos veces más en la misma hora**, al describir el defecto en `PT-093` y al
describirlo en la entrada de `HISTORY.log` de este lote. Tres falsos positivos seguidos, los tres
por hablar del defecto.

Eso da la medida del coste, y es un dato para `AC-03`: una comprobación cuyo alcance es «todo el
archivo» **acusa a quien la documenta**. No es una anécdota — es la razón de que el sujeto tenga
que incluir *dónde* se establece el hecho, no solo cuál es.

## 3. La causa

**Nada obliga a una comprobacion a declarar que hecho pretende establecer.** Quien la escribe
elige un observable barato, y el nombre de la funcion o el ID de la regla sugieren que se
comprobo el hecho. El verde es sintacticamente correcto y semanticamente falso.

Es la misma forma que `${SEC_ACTIVA:-1}` en `PT-086`: correcto y inerte.

## 4. Criterios de aceptacion

| | Criterio |
|:---|:---|
| `AC-01` | Una comprobacion declara su **sujeto**: el hecho que pretende establecer, en texto contrastable |
| `AC-02` | Una comprobacion sin sujeto declarado **no pasa** la verificacion de la suite |
| `AC-03` | El sujeto declarado y lo que la comprobacion **lee** se contrastan mecanicamente en los casos en que el observable es un archivo, una fecha o un conteo |
| `AC-04` | …y cuando el contraste no es mecanizable, el compromiso se **declara** en el propio sujeto, como hace `PT-088` `AC-01` con las lineas borradas |
| `AC-05` | Las cinco instancias historicas quedan expresadas en el mecanismo, y la quinta —`sellar` paso 1— queda **corregida**: la guia de migracion enumera las reglas nuevas |
| `AC-06` | Un caso de la bateria demuestra que una comprobacion con sujeto **falso** —declara medir X y lee Y— es rechazada |
| `AC-07` | El mecanismo se estrena sobre las tres comprobaciones de `PT-088`, no sobre las 224 reglas |

**`AC-06` es el que sostiene todo lo demas.** Sin el, `AC-01` se cumple escribiendo prosa junto a
cada funcion — que es, otra vez, un proxy del hecho.

## 5. Que NO entra

```
OUT: reescribir las 224 reglas con su sujeto. El mecanismo se estrena en tres (PT-088) y el
     resto es adopcion progresiva, como EXIGIBLE_DESDE.
OUT: un sistema de tipos o un DSL. La salida mas probable es un campo junto a la emision y un
     verificador que lo lea, no una capa nueva.
```

## 6. Riesgo declarado

**Este PT puede caer en su propio defecto.** Un verificador que compruebe «hay sujeto declarado»
en vez de «el sujeto corresponde a lo que se lee» seria la sexta instancia del patron, escrita por
la tarea que existe para cerrarlo. `AC-03` y `AC-06` estan para eso y hay que resistir la
tentacion de aflojarlos si el contraste resulta caro.
## Condicion de cierre   `FDGE-R53`

Termina cuando: una comprobacion sin sujeto declarado no pasa `verify-suite`, un caso de la bateria demuestra que un sujeto FALSO es rechazado, y el paso 1 de `sellar` enumera las reglas nuevas de la version.

## Firma

```
Firmado por lote: EP-018
```
