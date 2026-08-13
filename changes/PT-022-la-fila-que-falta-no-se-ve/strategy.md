# PT-022 — Estrategia   `PHASE 3`

| Camino | Por qué |
|:---|:---|
| Exigir que todas las tareas de un lote declaren las mismas filas | Produce filas copiadas para pasar. Ruido con aspecto de rigor, y `AC-04` lo excluye |
| Inferir qué filas faltan | Exige saber el alcance real de la tarea. No es mecanizable y fingirlo sería peor |
| **Mover la obligación al lote y cerrarle el círculo** | Un solo sitio donde escribirla, y una compuerta que comprueba que se cumplió |

## Lo que se hace

**`SUITE-R45` — un lote declara qué se hace al cerrarlo, y `G4` lo comprueba.**

El intake de un `EP` lleva una sección `## Cierre del lote` con una fila por cosa que se resuelve
al cerrar: la entrada de `CHANGELOG`, el número de versión, lo que sus tareas le hayan aplazado.
En `G4` cada fila tiene que estar resuelta o citar dónde fue. Sin la sección, `G4` bloquea.

Y `SUITE-R44` se le engancha: **citar el propio lote vale si el lote declara ese cierre.** Hoy
citarlo es gratis y no obliga a nada; con esto, apuntar al lote cuesta escribirlo en el lote.

## Qué arregla y qué no

| | |
|:---|:---|
| ✅ Lo aplazado al cierre del lote **no se puede perder**: vive en un sitio, no en cinco copias | |
| ✅ El destino más citado deja de ser el único sin reciprocidad | |
| ⚠️ Una fila que una tarea omite **sigue sin verse**, y no tiene arreglo mecánico | Se declara en el diseño y en la regla (`RULE-06`) |

Lo que cambia no es que se detecte la omisión: es que **omitir deja de perder nada**, porque la
obligación ya no vive en la fila que se omitió.
