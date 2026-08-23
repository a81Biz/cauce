# `PT-129` — Trazabilidad   `FDGE-R15`

> `AC` → `TS` → test → evidencia. Un `AC` sin `TS`, sin test o sin evidencia es un **Orphan
> Criterion** y bloquea `G3`. Se crea aquí con las tres primeras columnas; la evidencia se completa
> en `PHASE 6`.

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| `AC-01` | `FDGE-R19` enumera **todos** los tipos de rama o remite al documento que los declara | `TS-01` `TS-02` `TS-03` | `selftest.sh` · bloque `FDGE-R19` | | ⏳ |
| `AC-02` | Existe una comprobación que **enumera las ramas reales** y las contrasta con la topología | `TS-07` `TS-09` `TS-10` `TS-11` | `verify-fdge.mjs` + casos | | ⏳ |
| `AC-03` | Una rama efímera cuya tarea está terminal **se reporta** | `TS-08` | caso con `PT-081` | | ⏳ |
| `AC-04` | Una rama que no encaja en ningún tipo **se nombra**, no se ignora ni se borra sola | `TS-07` `TS-12` | caso con `desarrollo` | | ⏳ |
| `AC-05` | La comprobación **informa y no borra** | `TS-12` | inversa: el árbol de ramas no cambia | | ⏳ |
| `AC-06` | `cauce/<usuario>` declara cuándo está **vieja**, como el grafo declara `SUSPECT` | `TS-09` | caso de frescura de la proyección | | ⏳ |

## Los dos `AC` que salieron del descubrimiento y no estaban en el intake

`D-1` y `D-4` no tenían criterio. Se añaden aquí porque `FDGE-R15` exige que **todo** lo que se
implementa tenga fila, y sin ellas `PT-129.3` sería trabajo sin criterio:

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| `AC-07` | El `<type>` de una rama tiene **un solo** vocabulario, y es el que `LEXICON` declara | `TS-01` `TS-06` | `ramaDeTarea` + caso de cita | | ⏳ |
| `AC-08` | Sin `type`, `ramaDeTarea` **no inventa**: devuelve `null` y quien llama lo dice | `TS-04` `TS-05` | caso real contra `PT-125` | | ⏳ |

**`AC-07` y `AC-08` se declaran como ampliación, no como descubrimiento oculto.** El intake se
firmó el `2026-08-22` sin ellos porque `D-1` apareció en `PHASE 2`; añadirlos en `PHASE 4` es lo
que la fase existe para hacer, y consta aquí en vez de aparecer en el diff sin explicación.
