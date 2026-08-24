# Tareas — `PT-119`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | `clasesDeclaradas` — las clases y su enunciado, de `LEXICON` §4.4 | `tools/matriz.mjs` | ✔ |
| 2 | `duenasPorClase` — la regla que CITA la clase, en sus **dos** formas y sus **dos** documentos | `tools/matriz.mjs` | ✔ |
| 3 | `eventosDe` — los registros, con `null` si el archivo no es legible | `tools/matriz.mjs` | ✔ |
| 4 | `filasDe` — veces, primera, última, tareas, ordinal máximo, dueñas, verificadores | `tools/matriz.mjs` | ✔ |
| 5 | El desenlace `SIN EVALUAR`, que **no escribe archivo** | `tools/matriz.mjs` | ✔ |
| 6 | Diez reglas citan su clase | `RULES.md` | ✔ |
| 7 | `npm run matriz` · `npm run matriz:check`, y `matriz:check` dentro de `verify` | `package.json` | ✔ |
| 8 | Los dieciocho casos | `tools/selftest.sh` | ✔ |

---

## Los cuatro defectos que aparecieron construyéndolo

**1 · La derivación sólo veía la fila de tabla.** `SUITE-R14` se define en forma **suelta**, así
que `CE-008` salía «sin dueño» **teniendo dueño**. Una clase mal marcada como huérfana es peor que
no derivar: parece un hecho.

**2 · «142 entradas recorridas» y son 164.** Yo contaba `origen:tarea` distintos, y `PT-094` tiene
tres entradas. La cifra correcta ya la había derivado `eventos.mjs` y estaba en la cabecera del
`.jsonl`. Recontarla era una segunda fuente del mismo hecho —`CE-008`— dando un número distinto
—`CE-010`—, publicada bajo la etiqueta equivocada.

**3 · La fecha de generación rompía `--check`.** El archivo no se podía reproducir, así que la
comprobación de frescura habría fallado siempre. Se sustituyó por el rango de los datos.

**4 · Y una rotura de escapado, la duodécima.** El primer parche de `duenasPorClase` entró por
heredoc y `\r?\n` llegó como salto de línea literal: el módulo no compilaba. La respuesta fue la
que `SUITE-R59` prescribe — escribir el archivo, no pasar el texto por la línea de órdenes.

## Y la prueba inversa dio cuatro rojos por el motivo equivocado

Las cuatro mutaciones decían «no compila». No era cierto: las copias se escribían en un directorio
temporal y `matriz.mjs` importa `./regla.mjs`, que ahí no existe. **Cuatro rojos falsos contados
como aciertos** — `CE-005` dentro de la prueba que existe para detectarlo. Ahora las copias se
escriben al lado del original y se borran al empezar y al terminar.
