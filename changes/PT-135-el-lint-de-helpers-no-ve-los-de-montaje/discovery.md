# Descubrimiento — `PT-135`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió.

---

## 1 · Cómo apareció

Corriendo la batería completa de `PT-118`. Dos líneas entre 1483 verdes:

```
selftest.sh: line 2402: git_fixture: command not found
selftest.sh: line 2404: con_phase: command not found
```

`git_fixture` se definía en la **5160**; `con_phase`, en la **6754**. Se usaban en la **2402**.

El caso que va detrás —«el aviso dice en qué compuerta se convierte en error», de `PT-109`— salía
**verde** con su fixture **sin `git init`** y su allocation **sin `phase: 8`**. Pasaba por la
razón equivocada, o por ninguna.

Es `CE-005` —verde por no haber mirado— **con un lint escrito exactamente para esto**.

## 2 · Por qué el lint no podía verlo

```sh
uso=$(grep -nE "^(chk|chkno)[[:space:]].*[[:space:]]$h([[:space:]]|\$)" "$f" …)
```

Sólo reconocía un helper cuando era el **comando de un caso**. `git_fixture` y `con_phase` se
invocan como **líneas de montaje sueltas**, antes del `chk`. La forma que el lint reconoce y la
forma en que fallan son distintas: **no se le escapó, no podía verlo**.

Y su lista de helpers estaba **escrita a mano** —nueve nombres— y ninguno de los dos estaba en
ella. Una lista escrita a mano de lo que hay que vigilar es la copia que diverge (`CE-008`)
**dentro del lint que existe para vigilar**.

## 3 · Y el caso que lo comprobaba no podía fallar

```sh
chk "los helpers usados antes se enumeran"  "helper\|ninguno"  lint_helpers
```

El patrón casa con **las dos** respuestas posibles. Un caso que no puede fallar ocupa el sitio del
que haría falta —lo midió `PT-023`— y aquí tapó dos helpers mal colocados durante un lote entero.

## 4 · Al derivar la lista salieron tres falsos positivos

```
M(linea 320)  ·  A(linea 1155)  ·  OTRO(linea 2293)
```

Y los tres con la **misma raíz** que `PT-130`, que se acababa de arreglar:

| Falso positivo | Dónde casaba realmente |
|:---|:---|
| `A` | dentro del **patrón** de un caso: `"EDITADO A MANO"` |
| `OTRO` | dentro del **nombre** de otro caso |
| `M` | dentro de un **heredoc**: contenido de fixture, no código |

Leer la línea entera en vez de la posición del comando es `CE-017` otra vez: acusar al texto por
describir algo.

**Arreglo**: anclar la posición —`chk "…" "…" helper`, con las comillas en la expresión— y
descartar las líneas que caen dentro de un heredoc con una pasada de `awk`.

## 5 · Y una cuarta cifra que nadie recalculaba

Con `eventos.mjs` y `matriz.mjs`, `CLAUDE.md` seguía declarando **16 herramientas** y hay **18**.
Lo dijo `FND-R14` en la misma corrida. Es `CE-010`.

---

## Conclusión

**Dos helpers mal colocados, encontrados y corregidos**, y el caso de `PT-109` afectado **vuelve a
pasar con su montaje corriendo de verdad** — comprobado en la corrida completa, no supuesto.

**Y el lint ya no depende de que alguien mantenga una lista**: la deriva del archivo, reconoce las
dos formas de usar un helper, y su caso puede fallar.

`CE-004` —«probar donde trabajo, no donde se decide»— es la clase más repetida del ledger, con
ordinal declarado **9** y sin regla que la reclame. Esta tarea no le da regla: le quita una
instancia y deja el mecanismo que impide la siguiente.
