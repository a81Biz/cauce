# PT-085 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | La parte derivable del bloque `ESTADO` se contrasta con el registro | E1 | `selftest.sh`: un handoff que declara viva una `INTEGRATED` falla | `salidas/estado-contrastado.txt` | PENDIENTE |
| AC-02 | …y un handoff correcto **pasa** | E2 | `selftest.sh`: el complemento | `salidas/estado-contrastado.txt` | PENDIENTE |
| AC-03 | Lo no derivable se declara, no se finge verificado | E3 | `selftest.sh`: sin `decisiones` o `no hacer`, avisa | `salidas/estado-contrastado.txt` | PENDIENTE |
| AC-04 | `sesion cerrar` deja su entrada commiteada | E4 | `selftest.sh`: tras cerrar, el ledger no queda sucio | `salidas/sesion-cerrar.txt` | PENDIENTE |
| AC-05 | …o **no dice que cerró** | E5 | `selftest.sh`: si el commit falla, lanza | `salidas/sesion-cerrar.txt` | PENDIENTE |
| AC-06 | `SUITE-R57`: pasado el umbral, `G2` se bloquea | E6 | `selftest.sh`: `N+1` integradas de lote cerrado ⇒ falla | `salidas/suite-r57.txt` | PENDIENTE |
| AC-07 | …y por debajo del umbral no molesta | E7 | `selftest.sh`: el complemento | `salidas/suite-r57.txt` | PENDIENTE |
| AC-08 | El umbral es declarable | E8 | `selftest.sh`: `umbral_sellado` en el registro manda | `salidas/suite-r57.txt` | PENDIENTE |
| AC-09 | El acto de sellar está definido y es ejecutable | E9 | `selftest.sh`: `tracker sellar` enumera los ocho pasos | `salidas/sellar.txt` | PENDIENTE |
| AC-10 | Sellar exige batería **completa** | E10 | `selftest.sh`: el paso 4 lo dice | `salidas/sellar.txt` | PENDIENTE |
| AC-11 | Sellar exige **resolver** cada documento de entrada | E11 | `selftest.sh`: `selloSinResolver` sobre un acta a medias | `salidas/sellar.txt` | PENDIENTE |
| AC-12 | Una celda vacía **no pasa** | E12 | `selftest.sh`: `NO PROCEDE` sin motivo no resuelve | `salidas/sellar.txt` | PENDIENTE |
| AC-13 | El sello avisa de lo que probablemente cambió | E13 | `tracker sellar` sobre el repositorio real | `salidas/sellar.txt` | PENDIENTE |
| AC-14 | Está dicho desde las instrucciones | E14 | `selftest.sh`: `PHASES` · prompt de `G4` · `CORE` · `MANUAL` | `salidas/cinco-sitios.txt` | PENDIENTE |
| AC-15 | `FDGE-R43` detecta deriva de contenido | E15 | `selftest.sh`: `derivaDelGrafo` con un `mtime` movido | `salidas/grafo-suspect.txt` | PENDIENTE |
| AC-16 | …y la deriva **avisa, no bloquea** | E16 | `selftest.sh`: `MAJOR` con `SUSPECT` no falla | `salidas/grafo-suspect.txt` | PENDIENTE |
| AC-17 | Sellar exige el grafo al día | E17 | `tracker sellar` lo enumera | `salidas/sellar.txt` | PENDIENTE |

## Dos criterios se validaron solos, contra datos reales

**`AC-01`** cazó una mentira **en su primera ejecución**: el `HANDOFF` de hoy afirmaba que
`PT-081` y `PT-019` seguían en `PHASE 9` con las dos ya `INTEGRATED`. No fue un caso preparado.

**`AC-15`** dio `SUSPECT · 12 de 16` sobre el grafo real, que llevaba cinco días diciendo `FRESH`.

## Dos decisiones de diseño que evitan que la comprobación se apague

| | Por qué |
|:---|:---|
| `AC-02` existe | sin él, un verificador que fallara siempre cumpliría `AC-01` |
| `AC-16` — `SUSPECT` avisa | casi toda tarea toca un archivo del grafo; bloquear ahí cerraría `G2` en todos los `MAJOR` para siempre |

## `AC-06` estuvo a punto de ser un candado con la llave dentro

La definición ingenua —«toda `INTEGRATED` que no esté en el tag»— daba **13 contra un umbral de
3**, y el sello de la versión **es** el lote abierto: `G2` habría quedado bloqueada sin salida.

Contar por **lote cerrado** —que es lo que `EXEC-R03` ya dice: `G4` es la compuerta del lote— da
**1**, y esa sí es deuda real con salida. Es el mismo error que la tarea corrige en `FDGE-R43`,
detectado antes de cometerlo porque la medición se hizo antes de escribir la regla.
