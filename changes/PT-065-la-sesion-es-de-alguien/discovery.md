# PT-065 — Descubrimiento   `PHASE 2`

> Medido el 2026-08-18. El conflicto está **reproducido**.

## 1. `SESSION.json` es uno, y está versionado

```json
{ "desde": "6c0bc18…", "abierta": "2026-08-18", "generado": "2026-08-18" }
```

```
$ git ls-files docs/implementation/SESSION.json
docs/implementation/SESSION.json          ← versionado
```

**No tiene persona**, y **viaja en el repositorio**. Las dos cosas juntas son el problema: la marca
de una persona no solo se pierde localmente — se **propaga**.

## 2. Qué pasa con dos personas, reproducido

Ana y Bruno abren sesión cada uno en su rama:

```
$ git merge ana
CONFLICT (content): Merge conflict in SESSION.json

<<<<<<< HEAD
{"desde":"bru222", …}
=======
{"desde":"ana111", …}
>>>>>>> ana
```

**Conflicto en cada merge.** No es como el de `PT-062` —donde el daño era que el conflicto parecía
pequeño—: aquí es **ruidoso y constante**. Cada vez que dos personas trabajen a la vez, cada merge
traerá un conflicto en un archivo que **no es trabajo**, sino mecánica transitoria.

Y la resolución obvia —quedarse con uno— **borra la sesión del otro**: a partir de ahí, su
precedente sale de una marca que no es suya.

## 3. Dos formas de arreglarlo, y una es mejor

| | Cómo | Conflicto |
|:---|:---|:---|
| **Un archivo, N sesiones** | `SESSION.json` con `sesiones: [...]` | **Sigue habiéndolo**: dos personas escriben el mismo archivo |
| **Un archivo por persona** | `SESSION-<usuario>.json` | **Ninguno**: nadie toca el archivo de nadie |

La segunda es la misma lógica que `PT-062` aplicó a los identificadores: **evitar la colisión por
construcción**, en vez de resolverla mejor. Dos personas nunca escriben el mismo archivo, así que
git no tiene nada que fusionar.

## 4. Y no rompe `LEX-R26`

`LEX-R26` dice que `CHECKPOINT.json` **es uno**: responde por *la tarea en curso*, y escribirlo
sobre otra la sustituye. Eso sigue siendo cierto y no se toca.

`SESSION.json` es distinto: responde por **una sesión**, y puede haber varias a la vez. Un archivo
por sesión abierta no contradice nada — al contrario, es lo que hace que «la sesión es un recurso
temporal» (`PT-060`) tenga sentido con más de una persona.

## 5. Lo que ya existe y sirve

- `personaLocal` (`PT-061`) resuelve el nombre canónico.
- `normalizaRef` (`PT-063`) lo convierte en algo que vale como nombre de archivo.
- `sesionDe` y `handoffDeSesion` (`PT-060`) son puras y **no necesitan cambiar**: reciben la marca
  y los datos, no los leen.

## 6. Lo que esto obliga

1. La marca se escribe en `SESSION-<usuario>.json` cuando hay persona resuelta.
2. **Sin persona**, sigue siendo `SESSION.json` — un proyecto de una persona no cambia nada
   (`AC-05`).
3. Al leer, se busca **la propia**; y las **ajenas se ven**, porque si no, cada persona creería que
   trabaja sola (`AC-06`).
4. Todo lo que la sesión deriva sale del trabajo de **su** persona — y eso ya lo dejó `PT-064`.
5. El handoff de cierre sigue **derivado** y sigue sin tocar `HANDOFF.md` (`AC-04`).
