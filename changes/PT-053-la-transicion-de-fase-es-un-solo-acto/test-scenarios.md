# PT-053 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `avanzar` con todo en orden | registro, YAML, índice, checkpoint y nota |
| E2 | AC-01 | …y **llama** a lo que ya existe | no reimplementa `queSigue` ni `checkpointDe` |
| E3 | AC-02 | **Sin `--nota`** | **no avanza**, y el registro queda como estaba |
| E4 | AC-02 | Con `--nota` vacía | idem: una cadena vacía no es una nota |
| E5 | AC-03 | El paso irreversible falla | los cuatro escritos **vuelven** a como estaban |
| E6 | AC-03 | …incluido `CHECKPOINT.json` cuando **no existía** | se **borra**, no se deja vacío |
| E7 | AC-04 | `--a` salta una fase | **no avanza** |
| E8 | AC-04 | `--a` retrocede | **no avanza** |
| E9 | AC-04 | `--a` es la fase siguiente | avanza |
| E10 | AC-05 | Sin plataforma declarada | **no avanza** y dice qué hacer |
| E11 | AC-05 | Un PT en estado terminal | **no avanza** |
| E12 | AC-05 | Un PT que no está en el registro | **no avanza** |
| E13 | AC-06 | `avanzar` está en `LEXICON` | aparece con las demás acciones |
| E14 | AC-01 | `--ver` valida y **no escribe nada** | ningún archivo cambia |

`E5` y `E6` son el corazón. **Cuatro de cinco no es una versión degradada del éxito: es el defecto
que motiva la tarea** — los ocho fallos de CI de `EP-013` fueron exactamente eso.

`E6` distingue restaurar de vaciar: `CHECKPOINT.json` puede no existir antes del primer `avanzar`,
y dejar un archivo vacío donde no había nada es **un estado que no existía**.

## Lo que ningún caso puede comprobar

**Que `avanzar` se use.** Nada impide editar `REGISTRY.phase` a mano y saltarse el comando, y
quitar el acceso al archivo rompería todo lo demás. Lo que hay es que **`FDGE-R52` lo cazará
después** —que es donde estábamos— pero ahora con un camino fácil que no lo requiere.

Es un juicio sobre el comportamiento humano y se declara como tal: la medida de si funcionó será
contar, en `EP-015`, cuántas veces `FDGE-R52` vuelve a cazar la misma transición. **En `EP-014`
fueron tres.**
