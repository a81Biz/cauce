# `PT-203` · `discovery.md` — el defecto es el doble de grande, y va en las dos direcciones

## 1. Lo medido, sobre los 26 lotes del registro

`git 1bb6fc7` · comparando **lo que el extractor lee** con **lo que el registro asigna**:

```
EP-001   leidos:4  registro:5    INVISIBLE: PT-005
EP-004   leidos:4  registro:5    INVISIBLE: PT-018
EP-008   leidos:2  registro:3    INVISIBLE: PT-032
EP-012   leidos:5  registro:3    FANTASMA:  PT-039 PT-042
EP-013   leidos:9  registro:8    FANTASMA:  PT-018
EP-017   leidos:15 registro:23   INVISIBLE: PT-079 … PT-086   (8)
EP-019   leidos:0  registro:17   INVISIBLE: PT-096 … PT-112   (17)
EP-020   leidos:20 registro:23   FANTASMA:  PT-091 PT-110 · INVISIBLE: PT-131 … PT-136 (5)
EP-024   leidos:4  registro:28   FANTASMA:  PT-149 · INVISIBLE: 25 tareas
EP-025   leidos:1  registro:11   FANTASMA:  PT-169 · INVISIBLE: 10 tareas
---
26 lotes · 10 con divergencia
```

**`FANTASMA`** = se comprueba a quien no es miembro. Es el defecto que el intake nombra: **7 casos**.

**`INVISIBLE`** = es miembro y **su firma de lote no se comprueba nunca**. Es el defecto que el
intake **no vio**: **62 casos**. `EP-019` lee **cero** de sus diecisiete.

## 2. Por qué eso es lo grave

`INTAKE-R08` es **`HARD`** y **bloquea**. Ha estado corriendo sobre una fracción de sus sujetos, y
el que no cubría **no daba error: no daba nada**. Es `CE-005` —verde por no haber mirado— en la
forma más grande medida en este lote, y sale justo del criterio de éxito de `EP-026`.

El `FANTASMA` **se ve**: sale en rojo, molesta, y por eso hay ya dos parches. El `INVISIBLE`
**calla**, y por eso lleva ahí desde `EP-001`.

## 3. Los dos parches anteriores, y por qué el tercero sería el mismo error

```
PT-011   de «todo el texto» a «las filas de tabla»        verify-fdge.mjs:1572
PT-022   recorta «## Cierre del lote» antes de leer       verify-fdge.mjs:1586
```

Los dos estrechan **la heurística de lectura del intake**. Cada uno arregló su síntoma y ninguno
tocó la causa: **el intake no es la fuente de la pertenencia**. `SUITE-R08` dice quién lo es —el
registro asigna— y `allocations[].epic` lo tiene escrito para las 229 allocations.

Un tercer recorte arreglaría los 7 `FANTASMA` y dejaría los 62 `INVISIBLE` intactos.

## 4. Lo que se hace

**La pertenencia se deriva de `allocations[].epic`.** El intake deja de definirla.

Y la tabla del intake no se tira: pasa a **contrastarse** contra el registro, que es de donde sale
la otra mitad. Un `PT` listado en la tabla que no está en el lote es un **aviso con su nombre** —
puede ser una cita legítima de origen, que es lo que `FDGE-R55` premia— y deja de ser un error que
manda a tocar el intake de una tarea de otro lote.

## 5. El respaldo que hay que retirar con cuidado

`verify-fdge.mjs:1592` conserva el barrido de todo el texto *«cuando no hay ninguna fila
reconocible, para no dejar de comprobar EN SILENCIO los intakes escritos antes de que la plantilla
tuviera tabla»*. El razonamiento era correcto **y no funcionó**: `EP-019` tiene filas, así que el
respaldo no entró, y sus diecisiete quedaron sin comprobar igual.

Derivar del registro lo hace innecesario: no hay intake del que depender.

## 6. Lo que NO se toca   `SUITE-R26`

- **`INTAKE-R09`** —«lista `PT-NNN` y no existe `changes/PT-NNN-slug/`»— sigue leyendo la tabla:
  ésa **sí** es una comprobación sobre lo que el intake declara, y es su sitio.
- **No se retrofecha nada.** Los 62 `INVISIBLE` empezarán a comprobarse: si alguno no lleva la
  línea, el rojo es de hoy y se declara — no se retoca su intake en silencio (`SUITE-R09`).
