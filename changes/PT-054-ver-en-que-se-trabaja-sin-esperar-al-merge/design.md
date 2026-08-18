# PT-054 — Diseño   `PHASE 4`

## La fontanería, paso a paso

```js
blob  = git hash-object -w --stdin      <- el contenido de cada archivo
arbol = git mktree                      <- "100644 blob <sha>\t<nombre>" por linea
padre = git rev-parse refs/heads/cauce/<usuario>   (o ninguno, la primera vez)
commit = git commit-tree <arbol> [-p <padre>] -m "<marca> ..."
         git update-ref refs/heads/cauce/<usuario> <commit>
```

**Ninguno toca el árbol de trabajo.** `hash-object -w` escribe en la base de objetos, no en el
directorio; `update-ref` mueve un puntero. Se puede proyectar mientras se edita otra rama.

## Qué se proyecta

```
ESTADO.md          una fila por allocation VIVA
CHECKPOINT.json    el de la tarea en curso, tal cual
```

`ESTADO.md` lleva, por fila: `id · tipo · estado · fase · rama · SHA`. **El SHA es `AC-04`**: sin
él la proyección diría *qué* sin decir *sobre qué código*, y ese vínculo es el que `PT-052` puso y
esta tarea no puede perder.

El SHA de cada fila sale de `git rev-parse <rama>` — la punta de **su** rama, no la de la actual.
Una tarea que no ha creado su rama todavía lo declara vacío en vez de heredar el de otra.

## La marca

```
cauce:proyeccion    en el mensaje de cada commit que escribe la herramienta
```

Un commit **sin** la marca es humano. `proyectar` lo detecta y **lo dice**, sin borrarlo: una rama
derivada en la que alguien escribió deja de serlo, y decidir qué hacer con eso es humano
(`SUITE-R06`).

## `--publicar`

`update-ref` deja la rama **local**. `--publicar` hace `git push`, y **no** lo llama `avanzar`.

No es una omisión: empujar en cada transición convierte un acto de publicación en un efecto
colateral. Y `SUITE-R06f` deja fuera la reescritura y el borrado de ramas remotas — esto no es
ninguna de las dos, pero la frontera conviene respetarla por el lado prudente.

## Sin usuario, no se proyecta

`git config user.name` → si falta, **no se proyecta y se dice** (`RULE-06`). Una rama
`cauce/desconocido` sería peor que ninguna: agregaría el trabajo de todos bajo un nombre que no
es de nadie.

El nombre se normaliza —minúsculas, sin espacios ni acentos— porque una referencia de git no
admite cualquier cosa. `Alberto Martínez` → `cauce/alberto-martinez`.

## Lo que este diseño **no** hace

No toca la rama de tarea. No hace `checkout` ni `worktree`. No borra ni reescribe nada: solo añade
un commit encima. No resuelve la identidad multiusuario —`EP-016`— y no decide qué hacer con un
commit humano: lo reporta.
