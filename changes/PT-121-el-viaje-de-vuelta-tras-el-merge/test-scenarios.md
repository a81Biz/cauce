# Escenarios de test — `PT-121`

> `FDGE-R17`: rojo primero, y **válido**.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | `integrar` propone `DONE -> INTEGRATED` | la transición |
| `TS-02` | …nombrando **las dos** fuentes | `intake` |
| `TS-03` | …y al aplicar escribe las dos | `REG=INTEGRATED YAML=INTEGRATED` |
| `TS-04` | Un estado que no es `DONE` **no** se integra | `solo escribe DONE` |
| `TS-05` | Sin intake, el comando **falla** | `no existe` |
| `TS-06` | …y el registro **no** se toca | `REG=DONE` |
| `TS-07` | `firmar` propone `DRAFT -> READY` | la transición |
| `TS-08` | Un firmante que no está en la lista **falla** | `SUITE-R27` |
| `TS-09` | …y `G1` sólo produce `READY` desde `DRAFT` | el mensaje |
| `TS-10` | `FDGE-R19` declara la rama del trabajo de lote | la frase |
| `TS-11` | …y `FDGE-R19` llega al núcleo | `FDGE-R19` |
| `TS-12` | `PHASES` declara el viaje de vuelta | `EL VIAJE DE VUELTA` |
| `TS-13` | …con su comando | `tracker.mjs integrar` |
| `TS-14` | …y su salida | `SALIDA: allocations` |
| `TS-15` | …y el texto copiable lo lleva | `integrar PT-XXX` |
| `TS-16` | `sellar` nombra el tag anterior **por versión** | `tag anterior v12.0.0` |
| `TS-17` | …y dice que resuelve | `v12.0.0 resuelve` |
| `TS-18` | …y que el de esta versión todavía no existe | `v13.0.0 todavia NO existe` |
| `TS-19` | …y que crearlo es humano y va después del merge | `paso 8` |
| `TS-20` | El orden se deriva por versión, no por alfabeto | `sort=-v:refname` |

---

## Los que existen porque algo falló

**`TS-05` y `TS-06` juntos** — son el par que sostiene «un solo acto». Con sólo el primero, una
implementación que fallara **después** de tocar el registro también pasaría, y dejaría las dos
fuentes divergiendo: el defecto que el comando cierra.

**`TS-04`** — el negativo. Sin él, `integrar` escribiría `INTEGRATED` sobre cualquier cosa, y un
`BUG` en `VALIDATION_PENDING` —que sólo cierra una persona— pasaría a integrado por comando.

**`TS-08`** — la firma inventada. `SUITE-R27` es la única defensa mecánica que existe contra ella.

**`TS-16`..`TS-20`** — el fixture lleva **cuatro** tags elegidos a propósito: `v4.13.0`, `v9.0.0`,
`v10.0.0`, `v12.0.0`. Son los que hacen que el alfabeto y la versión den respuestas **distintas**
—el alfabeto da `v9.0.0`—, que es el error de medición real que este intake tuvo que corregir.

**`TS-11`** — nació de una expectativa **falsa** mía: esperaba que «trabajo DE LOTE» llegara a
`CORE.md`. No llega, y está bien: el núcleo condensa a ~210 caracteres (`SUITE-R15`). El caso
exige ahora lo que sí tiene que llegar.

---

## Prueba inversa

| Se quita | Qué se pone rojo |
|:---|:---|
| La guarda de estado en `integrar` | integra un `VALIDATION_PENDING` — `TS-04` |
| La escritura del YAML | el intake se queda en `READY` — `TS-03` |
| El contraste de la firma | «Quien Sea» pasa — `TS-08` |
| El orden por versión en `sellar` | el tag anterior deja de ser `v12.0.0` — `TS-16` |

Cuatro supresiones, cuatro escenarios distintos, todas sobre una copia del módulo real.

### Y los casos de `sellar` se rehicieron

La primera versión los corría contra el **repositorio real**, y `sellar` termina consultando la
plataforma: el bloque se quedó sin terminar dentro del tiempo. **Es exactamente lo que `PT-126`
había enseñado horas antes.** Ahora corren sobre un fixture con sus propios tags, que además es lo
único que permite controlar **qué** tags hay — que es justo lo que se mide.
