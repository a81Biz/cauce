# `PT-169` · `scope.md` — `PHASE 2-R`

## Lo que se midió antes de tocar nada

| | |
|:---|:---|
| Batería completa | **1 415 445 ms · 23,6 min** |
| `--solo` con **cualquier** patrón | **252 373 ms** — y ejecutando **cero** casos |
| Casos | **1749** · **45** secciones · **68** bloques por tarea |
| Sitios que mutan un fixture | **61** · ninguno comprobaba que la mutación ocurriera |

**El síntoma que el firmante nombró —«tarda veinte minutos en mandar el error de uno solo»— no
venía del número de casos.** `--solo` existe para iterar rápido y **pagaba el arnés entero**.

## Qué se toca

| Archivo | Qué cambia | Por qué |
|:---|:---|:---|
| `patrones.mjs` | `seccionesConCaso()` · `seccionesDelArnes` devuelve el cuerpo | La selección se **deriva** del arnés, como su hermana `seccionesAfectadas` |
| `selftest.sh` | `ACOTADO` como concepto propio · las tres guardas | «las secciones están filtradas» estaba pegado a «git dice qué cambió» |
| `selftest.sh` | `--solo` calcula sus secciones | `PT-086` construyó el salto y lo cableó sólo a `--afectados` |
| `selftest.sh` | `muta()` · `rot144` lo adopta · tres casos | La mitad comprobable de `SUITE-R61` |
| `RULES.md` | `SUITE-R61`, `CHECK` | La regla que obliga a repetir la poda |
| `PHASES.md` · `FDGE-Prompts.md` | la citan | `LEX-R22`: sólo `RULES` enuncia; los demás citan |
| `audit.mjs` | `warn()` y la adopción de `muta` | Una regla `CHECK` necesita un verificador que **viaje** |

## Qué NO se toca

**La batería completa sigue tardando 23,6 min, y eso es correcto.** Lo que se abarató es
**iterar**: 252 s → 47 s. Hacer más rápida la corrida completa exigiría dejar de reconstruir 211
fixtures, y eso requiere saber **cuál depende de la frescura** — se intentó, cambió el universo de
casos, y se revirtió.

**Y no se poda ni un caso.** La tarea entrega **el mecanismo y la regla**; qué se retira es la
decisión de quien pode, y `SUITE-R61` la obliga a publicarse. Retirar casos hoy, sin el barrido de
`PT-167` y sin la cuenta por patrón, sería exactamente lo que la regla existe para impedir.
