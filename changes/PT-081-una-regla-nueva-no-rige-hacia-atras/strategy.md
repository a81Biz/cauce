# PT-081 — Estrategia   `PHASE 3`

## `1` · Dónde vive la versión de entrada de cada regla

| Opción | Por qué no |
|:---|:---|
| Una constante por comprobación en `verify-fdge` | Tres constantes sueltas que hay que acordarse de poner. La cuarta regla se olvidará |
| Derivarla del `CHANGELOG` en tiempo de ejecución | Parsear prosa para decidir si una compuerta falla. Un cambio de redacción rompería la verificación |
| Un campo en `RULES.md` | Es el documento propietario y sería natural… pero **cada fila tendría que llevarlo, y 223 filas no lo tienen**. Migración enorme por tres reglas |
| **Una tabla en `patrones.mjs`, con las que lo necesitan** | ✅ Explícita, comprobable sin `fs`, y el sitio donde ya viven `EXIGIBLE_DESDE` y los demás contratos |

`EXIGIBLE_DESDE` ya existe ahí para decidir **qué compuerta** exige cada artefacto. Esto es su
hermana en el eje del tiempo: **desde qué versión** rige cada regla. Ponerlas juntas es lo que
hace que la siguiente se busque sola.

## `2` · Qué versión es `EP-017`

**`10.0.0`.** No por gusto de numerar: `FDGE-R54` y `SUITE-R56` son reglas `HARD` nuevas con
verificadores que fallan, y eso rompe a los instalados. `CLAUDE.md` regla 6 no deja alternativa.

Y la entrada `9.0.0` **no se toca**. Es el registro fechado de `EP-016`; reescribirla para que
signifique dos lotes borra la trazabilidad que este lote existe para defender.

## `3` · Qué se hace con la guía de migración que mintió

**No se corrige la de `9.0.0`.** Lo que dice fue verdad para `EP-016`, y sigue siéndolo para
`EP-016`. Se escribe la de `9.0.0 → 10.0.0`, que es donde el cambio ocurre.

Lo que sí hay que evitar es que vuelva a pasar, y por eso está `AC-08`: **una regla `HARD` nueva
sin versión de entrada declarada se detecta**. Sin eso, esta tarea arregla tres casos y deja el
mecanismo intacto para el cuarto — que es literalmente lo que `PT-075` documentó.

## Lo que esta tarea NO puede resolver

**Que la guía de migración siga siendo verdad.** Comprobar mecánicamente que una prosa describe
correctamente un conjunto de cambios no lo sé hacer. Lo que sí se puede es lo de `AC-08`: exigir
que toda regla nueva **conste** con su versión, para que redactar la guía sea enumerar en vez de
recordar. Se declara la diferencia en vez de fingir que es lo mismo.

## Orden

1. La tabla y el helper, con sus casos.
2. Las tres comprobaciones pasan a consultarla.
3. `AC-08`: lo que detecta a la cuarta.
4. `CHANGELOG` con la entrada `10.0.0`, su guía de migración y las dos reglas que faltaban.
5. `version.mjs` alinea los 21 documentos.

El paso 4 va **después** del 3 a propósito: si `AC-08` está puesto, escribir la entrada de la
`10.0.0` deja de depender de que yo me acuerde de qué reglas entraron.
