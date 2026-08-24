# Diseño — `PT-135`   `PHASE 4`

> La propuesta completa. Es lo que `G2` resuelve.

---

## 1 · La lista se deriva

```sh
HELPERS=$(grep -oE "^[a-zA-Z_][a-zA-Z0-9_]*\(\) \{" "$f" | sed 's/() {//' | grep -v "^lint_")
```

Todas las definiciones del archivo, menos las del propio lint —que si no se recorrería a sí
mismo, la autorreferencia que ya mordió dos veces en `PT-051` y en la guarda anterior—.

## 2 · Las dos formas de usar un helper

```
COMO COMANDO DE UN CASO      chk "nombre" "patron" mihelper arg
COMO LINEA DE MONTAJE        mihelper        ·        build_fixture; mihelper
```

La segunda es la que fallaba, y se reconoce tanto al principio de línea como **después de `;` o
`&&`** — que es exactamente cómo se invocaba `git_fixture`.

## 3 · Anclar la posición, no leer la línea

```sh
uso_caso=$(grep -E "^[0-9]+:(chk|chkno)[[:space:]]+\"[^\"]*\"[[:space:]]+\"[^\"]*\"[[:space:]]+$h…")
```

Las comillas van **en la expresión**. Sin eso, `A` casaba dentro de `"EDITADO A MANO"` y `OTRO`
dentro del nombre de otro caso: leer la línea entera en vez de la posición del comando es
`CE-017`, y `PT-130` acababa de arreglar la misma forma en `contradiceElRegistro`.

## 4 · Fuera de los heredocs

Una pasada de `awk` numera las líneas y **vacía** las que caen dentro de un heredoc. Su contenido
es **fixture**, no código del arnés: una línea que dice `M` dentro de un heredoc no es una
invocación de `M()`.

Es lo que quitó el tercer falso positivo.

## 5 · Los dos usos anteriores, arreglados

`git_fixture` y `con_phase` se mueven junto a `build_fixture`. Y su comentario viaja con ellos.

**El movimiento tuvo su propio defecto**, y va escrito en `tasks.md`: la primera rutina decidía si
una definición era de una sola línea mirando si la línea **termina** en `{`. La de `git_fixture`
termina en un **comentario**, así que se llevó sólo la cabecera y dejó el cuerpo huérfano. La
batería murió en silencio en el caso siguiente. Es el mismo defecto que esta tarea persigue —leer
el final de la línea en vez del hecho— cometido al arreglarlo.

## 6 · El caso puede fallar

```
antes   "helper\|ninguno"      casa con las dos respuestas posibles
ahora   "ningun helper"        sólo con la buena
```

## 7 · Lo que este diseño NO hace

- **No reordena la batería** más allá de lo que el lint señala.
- **No convierte el lint en error duro** en la misma tarea que lo amplía.
- **No pone `set -e`.**
