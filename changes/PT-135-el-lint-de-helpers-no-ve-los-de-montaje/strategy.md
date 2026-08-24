# Estrategia — `PT-135`   `PHASE 3`

> `FDGE-R54`: viabilidad **`SAFE`**, registrada.

---

## Las tres piezas, y ninguna sobra

| Pieza | Por qué |
|:---|:---|
| **Derivar la lista** de helpers del archivo | Una lista escrita a mano de lo que hay que vigilar es la copia que diverge, **dentro del lint que existe para vigilar**. Los dos helpers rotos no estaban en ella |
| **Reconocer las dos formas** de usar un helper | La forma que el lint reconocía y la forma en que fallaban eran distintas. No se le escapó: **no podía verlo** |
| **Que el caso pueda fallar** | `"helper\|ninguno"` casa con las dos respuestas. Un caso que no puede fallar ocupa el sitio del que haría falta (`PT-023`) |

## Anclar la posición, no leer la línea

Derivar la lista destapó tres falsos positivos —`A` dentro del patrón de un caso, `OTRO` dentro
del nombre de otro, `M` dentro de un heredoc— con la **misma raíz** que `PT-130` acababa de
arreglar en `contradiceElRegistro`.

Dos anclajes:

- **La posición del comando**: `^(chk|chkno)\s+"[^"]*"\s+"[^"]*"\s+helper`, con las comillas en la
  expresión. Así el nombre no puede casar dentro del nombre ni del patrón.
- **Fuera de los heredocs**: una pasada de `awk` marca las líneas que caen dentro de uno. Su
  contenido es **fixture**, no código del arnés, y una línea de fixture que dice `M` no es una
  invocación.

## Se arregla el orden, no se documenta

`AC-03` pide enumerar los usos anteriores a la definición y **arreglarlos o declararlos uno a
uno**. Son dos, y los dos se arreglan: `git_fixture` y `con_phase` se mueven junto a
`build_fixture`, que es donde vive el resto del montaje compartido y donde se buscan.

**Y hay que comprobar que el caso afectado sigue pasando con su fixture corriendo** (`AC-05`).
Si no pasara, habría que decirlo: llevaba un lote entero pasando sin montaje, y no se puede dar
por bueno lo que nunca se ejecutó.

## Lo que NO se hace

- **No se reordena la batería entera** por criterio estético. Se mueve lo que el lint señale.
- **No se convierte el lint en error duro** en la misma tarea que lo amplía: primero se enumera lo
  que hay (`SUITE-R09`). Hoy sale limpio, así que el caso puede exigir «ninguno» sin bloquear a
  nadie.
- **No se pone `set -e`**: cambiaría el comportamiento de 1551 casos de golpe.
