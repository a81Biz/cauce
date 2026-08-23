# `PT-129` — Descubrimiento   `PHASE 2-B`

> Dónde está el defecto, con archivo y línea. Lo que aquí no esté medido no está.

---

## D-1 · El `<type>` de una rama está declarado **dos veces y distinto**

Es la causa raíz, y no la vi al escribir el intake.

| Fuente | Vocabulario | Para `PT-129`, que es `BUG` |
|:---|:---|:---|
| `FDGE-R19` — la **regla** | `feat` · `fix` · `refactor` · `test` · `docs` · `chore` — los tipos de **commit** | `fix/…` |
| `patrones.mjs:557` `ramaDeTarea()` — la **herramienta** | el `type` del **ítem**, en minúsculas: `bug` · `feature` · `chore` · `refactor` · `investigation` | `bug/…` |

```
$ tracker rama PT-129     ->  bug/alberto-martinez/PT-129-la-topologia-de-ramas-no-se-enumera
$ tracker rama PT-115     ->  feature/alberto-martinez/PT-115-la-parada-entra-al-vocabulario
```

**`bug` no está en la lista de `FDGE-R19`. `feature` tampoco. `fix` no es un tipo de ítem.**
Los dos vocabularios se solapan sólo en `chore` y `refactor`.

Es exactamente `LEX-R28` —«la herramienta esperaba un conjunto y tres documentos decían otro»— y
`PT-100` —«un hecho, un nombre: las grafías que deciden si una verificación corre»—, en un tercer
campo. La clase **un hecho, varios nombres**, que la matriz da por `CERRADA`, sigue viva aquí.

## D-2 · Ninguna de las ramas que existen sale de la herramienta

```
remoto                                              lo que ramaDeTarea daría
cauce/alberto-martinez                              — (no es rama de tarea)
chore/alberto-martinez/PT-113-apertura              bug/alberto-martinez/PT-113-la-guia-que-se-publico-incompleta
fix/alberto-martinez/PT-081-una-regla-nueva-...     bug/alberto-martinez/PT-081-una-regla-nueva-no-rige-hacia-atras
```

**Las dos ramas de tarea del repositorio se nombraron a mano.** La primera la escribí yo esta
sesión copiando el precedente de `EP-019` (`chore/…/PT-097-apertura`); la segunda es anterior.
`tracker rama` existe, propone el nombre correcto, y **nadie lo invoca** — séptima instancia de
«existe la herramienta y nada la echa en falta».

## D-3 · `FDGE-R19` enumera tres niveles y el árbol tiene cuatro

La regla dice literalmente *«la topología de ramas es **esta**, en tres niveles»* — efímera,
integración, por defecto. El cuarto tipo, `cauce/<usuario>`, lo crea `tracker proyectar`
(`PT-054`) y está declarado **sólo** en `LEXICON.md` §810 y §875.

`LEX-R21` pone `LEXICON` por encima de `RULES`, así que **la rama es legítima**: lo que falla es
que la regla se presente como enumeración completa sin serlo.

## D-4 · Sin `type`, la rama se inventa un `chore`

`patrones.mjs:558` — `const t = String(tipo ?? 'chore').toLowerCase();`

```
$ tracker rama PT-125     ->  chore/alberto-martinez/PT-125-clasificar-las-tareas-cerradas
```

`PT-125` **no tiene `type`** (es el defecto de `PT-124`). El fallback no dice que está adivinando:
devuelve `chore` con la misma cara que devolvería un tipo real. Es `RULE-06` al revés — un dato
inventado en vez de un `SIN EVALUAR`.

## D-5 · Nada enumera las ramas reales

`verify-fdge.mjs:1689` comprueba `enRegistroPT.branch` —**el campo que la allocation declara**— y
`:1700` que ese campo lleve usuario. **Nunca pregunta al árbol qué ramas existen.**

```
$ grep -c "ls-remote\|for-each-ref" docs/methodology/tools/verify-fdge.mjs   ->  0
```

Consecuencia medida hoy: `origin/fix/alberto-martinez/PT-081-…` sigue viva con `PT-081` en
`INTEGRATED`, y `FDGE-R19` dice que la efímera **se borra al fusionarse**. Nadie lo comprueba.

## D-6 · La lista de «Prohibidos» de `FDGE-R19` es ambigua

> *«`type` ∈ `feat`·`fix`·`refactor`·`test`·`docs`·`chore`. **Prohibidos:** `WIP`, `fix`,
> `changes`, `update`, `final`…»*

`fix` aparece **en las dos listas** de la misma frase. Por contexto la prohibición es sobre
**descripciones vagas** —«fix: PT-042 fix»— y no sobre el `type`, pero está escrito como una lista
de palabras sueltas. `SUITE-R24` dice que quitar precisión a una regla no es ganancia: *«una regla
ambigua se aplica mal justo en los casos límite, que es donde importa»*.

Se declara. No es la causa del defecto, pero está en la misma frase que hay que tocar.

---

## Lo que el grafo aportó, y lo que no

`graphify-out/graph.json` — 798 nodos, 1244 aristas, generado `2026-08-20`, estado `SUSPECT`
(1 de 17 archivos cambió: `selftest.sh`).

Consultado con `rama|branch|topolog`, devolvió **los seis nodos exactos** en los que está el
defecto, sin abrir un solo archivo a ciegas:

```
tools_patrones_ramadetarea      tools_tracker_ramade
tools_patrones_ramallevausuario tools_tracker_esramapordefecto
tools_tracker_rama              tools_tracker_rama_trabajo
```

**Lo que no aportó:** nada sobre `FDGE-R19` ni sobre `LEXICON`. El grafo cubre `bin` y
`docs/methodology/tools` (`REGISTRY.graph.scope`) — el código, no las reglas. `D-1`, `D-3` y `D-6`
salieron de leer los documentos, y eso se dice en vez de atribuirle al grafo un alcance que no
tiene.

---

## Qué establece este descubrimiento, y qué no

**ESTABLECE:** que hay dos vocabularios para el `<type>` de una rama, que ninguna rama existente
sale de la herramienta, que la enumeración de `FDGE-R19` está incompleta, que el fallback inventa
un `chore`, y que nada contrasta las ramas reales con la topología.

**NO ESTABLECE:** cuál de los dos vocabularios debe ganar. Es una decisión de diseño y va en
`PHASE 3`, no aquí.
