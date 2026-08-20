# PT-085 — Autorrevisión   `PHASE 6`

## Cinco defectos, una raíz

**El marco registra lo que pasa y no comprueba que lo registrado siga siendo cierto.** Es
`PT-075` un escalón más arriba: aquella dijo *una regla sin verificador no ocurre*; ésta dice
*un registro sin verificador deja de ser cierto*.

Y **dos de los cinco son literalmente el mismo error**: `SUITE-R34` mira la fecha del archivo en
vez de su contenido, y `FDGE-R43` mira si se movieron archivos en vez de si el grafo describe el
código. Los dos gobiernan compuertas.

## Dos criterios se validaron solos, contra datos reales

**`AC-01` cazó una mentira en su primera ejecución.** El `HANDOFF` de hoy afirmaba que `PT-081` y
`PT-019` seguían en `PHASE 9` con las dos ya `INTEGRATED`. No fue un caso preparado: fue el
verificador estrenándose contra el estado real y encontrándolo falso.

**`AC-15` dio `SUSPECT · 12 de 16`** sobre un grafo que llevaba cinco días diciendo `FRESH`, y que
respondía que `patrones.mjs` tiene 2 importadores cuando tiene 8.

## El candado con la llave dentro, evitado por medir antes de escribir

`SUITE-R57` iba a contar «toda `INTEGRATED` que no esté en el último tag». Medido antes de
escribir la regla: **13 contra un umbral de 3**.

Y el sello de la versión **es** el lote abierto. La regla habría bloqueado `G2` sin salida
posible — no habría podido terminar la épica que la introduce.

Contar por **lote cerrado** da **1**, y ésa sí es deuda real con salida. No es una concesión:
`EXEC-R03` ya dice que `G4` es la compuerta **del lote** y que no se multiplica por tarea, así que
el lote es la unidad de sellado. La definición correcta estaba en el marco; yo la había ignorado.

Es exactamente el error que esta misma tarea corrige en `FDGE-R43`, y sólo lo vi porque la
medición fue antes que la regla.

## Un defecto de datos que rompía el filtro en silencio

`EP-017` **no tiene campo `type`**. Escribí el filtro como `type === 'EP'` y **no casó ningún
lote**, así que el resultado seguía siendo 13 y parecía que mi razonamiento era erróneo.

Los lotes se reconocen ahora por su **identificador**, que es lo que `SUITE-R08` garantiza.
Fiarse del campo era depender de dos fuentes del mismo hecho y quedarse con la peor (`SUITE-R38`).

## Dos decisiones para que la comprobación no se apague sola

| | Por qué |
|:---|:---|
| `A` falla por **contradicción**, no por omisión | exigir exhaustividad convertiría el bloque en un volcado del registro, y el `HANDOFF` existe para lo que el registro **no** puede decir |
| `SUSPECT` **avisa y no bloquea** | casi toda tarea toca un archivo del grafo; bloquear ahí cerraría `G2` en todos los `MAJOR` de forma permanente |

Las dos son la misma lección: **una comprobación que siempre bloquea se termina desactivando**, y
entonces no protege el día que tiene razón. Es lo que `LEXICON` §6.5d dice de la viabilidad y lo
que `SUITE-R26` dice de la cobertura.

Por eso `AC-02` existe: sin él, un verificador que fallara siempre cumpliría `AC-01`.

## `D` · resolver, no actualizar

Exigir que el `MANUAL` cambie produciría retoques cosméticos para acallar la comprobación — el
equivalente documental de fabricar un verde. Y un manual que cambia tampoco prueba que se
revisara lo que hacía falta.

La forma es la de `FND-R22` con el `LAYOUT`: **cada documento lleva su decisión y una celda vacía
no pasa**, porque es indistinguible de una que nadie miró. `NO PROCEDE` **exige motivo**.

El dato que lo justifica: en una versión `MAJOR` con dos reglas `HARD` nuevas, la rama de
integración protegida y el salto `9 → 10`, **ninguno de los dos `README` se tocó**. Y `MANUAL` y
`CASOS-DE-USO` sí — pero sólo porque `PT-079` los puso en su lista de cinco sitios.

## `B` · el fallo que mi propio `try/catch` no habría cazado

Escribí el commit del ledger envuelto en `try/catch`. **`gitDe` devuelve `null` en vez de lanzar**,
así que el `catch` nunca se habría ejecutado y el caso habría pasado en verde con el commit
fallando en silencio. Lo vi leyendo el contrato de la función, no ejecutándolo — esta vez llegué
antes.

## Lo que no se verifica, y está declarado

**Que `decisiones` y `no hacer` digan la verdad.** Son lo único del estado que no se deriva de
nada, y por eso son lo más valioso que tiene el `HANDOFF`. Nadie los verifica, y ahora al menos
`SUITE-R33` avisa si faltan.

`AC-01`..`AC-17`, los diecisiete.
