# Trazabilidad — `PT-114`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Un cuerpo SIN enlace se detecta en cuanto existe ref durable | `TS-01` | `selftest.sh:cuerpo mudo CON ref durable ⇒ divergencia` | `salidas/casos.txt` |
| AC-02 | Distingue «sin ref todavia» de «ref existente y cuerpo sin actualizar» | `TS-02` `TS-03` | `selftest.sh:…y SIN ref durable es correcto` | `salidas/casos.txt` |
| AC-03 | Ninguna compuerta queda en verde con el intake de un lote ilegible | `TS-01` | `tracker espejo` | `salidas/espejo.txt` |
| AC-04 | NO inventa un ref cuando de verdad no lo hay: PT-096 sigue en pie | `TS-02` | `selftest.sh:…y SIN ref durable es correcto` | `salidas/casos.txt` |
| AC-05 | Sin poder leer el cuerpo o sin saber si hay ref, sale SIN EVALUAR | `TS-04` `TS-05` | `selftest.sh:sin poder leer el cuerpo ⇒ null` | `salidas/casos.txt` |
| AC-06 | El literal que se busca es el mismo que cuerpoDeIssue escribe | `TS-06` | `selftest.sh:el literal buscado es el que se escribe` | `salidas/casos.txt` |

**Seis criterios, seis con `TS`, seis con evidencia ejecutada.**

## La inversa que decide

`TS-02` · **`…y SIN ref durable es correcto`**. Si marcara ese caso estaría acusando a `PT-096`
de un defecto que no tiene, y el ruido en cada corrida enseñaría a ignorar la comprobación — que
es peor que no tenerla.

## `AC-06` no estaba en el intake

Salió de `PHASE 4`: el predicado busca un literal que `cuerpoDeIssue` escribe, y **dos copias del
mismo literal divergen**. `RE_SIN_ENLACE` se exporta y la usan los dos lados; el caso es lo único
que impide que se separen.
