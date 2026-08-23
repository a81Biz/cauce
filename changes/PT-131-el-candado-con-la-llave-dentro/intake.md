# PT-131 — SUITE-R57 cuenta el estado declarado en el tag, no el trabajo que el tag contiene

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-131
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 2
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que la compuerta que impide acumular trabajo sin sellar **no bloquee a la única tarea que puede
> sellarlo**.

## 2. El defecto, medido

`SUITE-R57` bloquea **`G2` de todas las tareas del repositorio**, incluida la que cerraría la
versión:

```
$ verify-fdge --gate G2 PT-129
  ✗ SUITE-R57  17 tarea(s) integradas de lotes CERRADOS sin sellar y el umbral es 3
$ verify-fdge --gate G2 PT-113        <- la tarea que ES la 12.0.1
  ✗ SUITE-R57  el mismo error
```

**La causa, contrastada contra el árbol:**

```
v12.0.0 -> 5b184af   su REGISTRY dice   EP-019 DRAFT · las 17 en DONE
main    -> ee660db   su REGISTRY dice   EP-019 CLOSED · las 17 en INTEGRATED
```

`verify-fdge.mjs:1806` lee `git show <tag>:REGISTRY.json` y toma **las que el tag declaraba
terminales**. `DONE` **no** está en `ESTADOS_TERMINALES` —y hace bien: una tarea en `DONE` espera
`G4` y sigue viva—. Así que las 17 no constaban terminales en el tag, constan terminales ahora, y
salen como deuda.

**Pero su trabajo SÍ viajó en `v12.0.0`.** Lo que llegó después del tag fue la **etiqueta de
estado**, no el código. Se comprueba en el árbol:

```
$ git cat-file -e v12.0.0:changes/PT-096-un-enlace-que-falta-no-es-un-enlace-roto/intake.md
   -> existe
```

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La deuda se cuenta contra **lo que el tag contiene**, no contra lo que su registro declaraba | una tarea cuyo `changes/` está dentro del tag más alto NO cuenta como deuda, aunque su estado terminal se escribiera después |
| AC-02 | `G2` deja de estar bloqueada para las 17 de `EP-019` | `verify-fdge --gate G2 PT-129` pasa `SUITE-R57` |
| AC-03 | La regla **sigue bloqueando** lo que debe: trabajo integrado que **no está en ningún tag** | la inversa: una tarea terminal cuyo `changes/` no viajó en ningún tag SÍ cuenta |
| AC-04 | Sin poder leer el árbol o el tag, sale `SIN EVALUAR` y no se aprueba por omisión | `RULE-06`; ya lo hace y se conserva |
| AC-05 | Se declara el límite: esto **no** arregla que el estado terminal llegue tarde a la rama por defecto | eso es `PT-121`, y la cita es recíproca |

## 4. Cómo termina   `FDGE-R53`

> Termina cuando: la compuerta que impide acumular sin sellar deja de impedir sellar.

## 5. Qué NO entra   `[AGENTE]`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Que el estado terminal llegue a la rama por defecto **antes** del tag | Es el hueco del viaje de vuelta, y es la causa de que este defecto se manifieste | PT-121 |
| Bajar o quitar el umbral de sellado | Sería apagar la compuerta en vez de arreglar su medida. `umbral_sellado` sigue en 3 | — |
| Retag de `v12.0.0` | Mover un tag publicado es reescribir historia (`SUITE-R06f`), y el paquete de npm apunta a ese commit | — |

## 6. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es «un candado con la llave dentro», y el marco ya conoce la forma.** El comentario de
  `verify-fdge.mjs:1796` la describe de la vez anterior: *«recién creado `v10.0.0`, las 21 tareas de
  `EP-017` —que ESTÁN dentro de él— aparecían como deuda sin sellar, y con umbral 3 eso bloquea
  `G2` justo después de haber sellado»*. `PT-087` lo arregló pasando de «el tag anterior» a «el tag
  más alto». **Arregló el tag; no arregló el observable.**
- **Instancia doce de «el proxy en lugar del hecho».** El hecho es *«¿viajó este trabajo en algún
  tag?»* y su observable natural es el **árbol** —`git cat-file -e <tag>:changes/<dir>`—. La
  comprobación usa el **registro del tag**, que es una declaración sobre el trabajo y no el trabajo.
- **Bloquea el lote entero y por eso es `S1`.** Ninguna de las dieciocho tareas de `EP-020` puede
  pasar `G2` mientras esto no cierre, incluida `PT-113`, que es la que produciría el tag que lo
  limpiaría por el otro camino.
- **`G2` de esta tarea necesita excepción declarada.** No hay forma de que `PT-131` pase `G2` sin
  resolver `SUITE-R57`, que es lo que `PT-131` arregla. La excepción queda registrada en
  `SESSION_LOG.md` con su motivo: la alternativa es que **ninguna tarea del repositorio vuelva a
  pasar `G2`**. Es exactamente el caso que la regla de cumplimiento del `CLAUDE.md` contempla —
  detenerse, reportar la condición bloqueante, y continuar sólo con autorización registrada.
