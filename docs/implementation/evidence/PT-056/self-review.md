# PT-056 — Autorrevisión   `PHASE 6`

## Lo entregado

```
estadoDelArbol(cp, git)     pura · corresponde: true | false | null
textoDiscrepancia(e)        dice CUÁL es y PROPONE el comando · no lo ejecuta
tracker siguiente           BLOQUEA antes de decir qué toca
verify-fdge                 FALLA · LEX-R26
LEXICON · LEX-R26           la correspondencia y STATE_MISMATCH, sin regla nueva
casos                       618 → 663
```

## El hueco que cierra

`PT-052` dejó el `sha` y `verify-fdge` exige que sea **alcanzable**. Eso impide la avería obvia
—un checkpoint que apunta a nada— y **no impide la peligrosa**: un SHA real que describe un árbol
que ya no existe. Ese pasaba la comprobación anterior entera.

Está medido, no supuesto. Con el checkpoint apuntando a `abab74b` —el merge de `EP-014`, un commit
perfectamente real— la comprobación de `PT-052` daba verde y la de ahora dice:

```
✗ LEX-R26  CHECKPOINT.json de PT-056 NO corresponde al arbol (STATE_MISMATCH) —
           sha: declarado abab74b, real 87710a9.
```

Sobre ese estado iban a decidir el presupuesto de `PT-057` y la compuerta de `PT-059`.

## Lo que solo se supo ejecutando

**El diseño de `PHASE 4` habría hecho saltar el aviso después de cada commit.** `estadoDelArbol`
exigía `sha === HEAD`. `PHASE 2` había medido el dato que lo desmiente —`EP-014` hizo hasta **diez**
commits por tarea contra **nueve** transiciones de fase— y no sacó la consecuencia: el `sha`
declarado deja de ser `HEAD` en cuanto se commitea. Una herramienta que bloquea siempre no se lee
el día que tiene razón, que es exactamente lo que `test-scenarios.md` dice de `E4` y `E5` sin verlo
en el criterio de al lado.

Lo que distingue no es la igualdad sino la **historia**: antecesor de `HEAD` va por detrás y no
miente; lo que no lo es está en otra rama o en una historia reescrita. Y no poder decidirlo cuenta
como discrepancia — no haberlo demostrado no es haberlo desmentido (`RULE-06`).

La prueba es esta misma tarea: tras el commit de `PHASE 5` el checkpoint quedó en `87710a9` con
`HEAD` en `a277dad`, y `verify-fdge` lo da bueno.

## Dos defectos ajenos que encontró ejecutar

**`CORRIGE PT-052`** — `gitDe` hacía `trim()` de **toda** la salida de `git status --porcelain`.
Eso se come el espacio inicial de la **primera** línea cuando el cambio no está indexado, y el
`slice(3)` posterior cortaba un carácter del path. El `CHECKPOINT.json` vivo declaraba
`hanges/…/intake.md`: un artefacto de gobernanza afirmando una ruta que no existe. Leer el código
no lo mostró; mirar el archivo que produce, sí.

**El arnés daba verde por silencio** — los cuatro casos de `tracker siguiente` pasaban por
**vacío**: la acción se planta si el proyecto no declara plataforma y el fixture no la declaraba,
así que el `chkno` era verde porque no salía nada, no porque la herramienta callara. Es el defecto
de `PT-023` otra vez, dentro del arnés que lo persigue. Ahora hay un caso —«tracker siguiente llega
a correr»— cuya única función es impedir que los siguientes afirmen sobre nada.

Y por quinta vez en dos lotes, una aserción casaba consigo misma: el patrón `"[a-z]*ocs/` para
comprobar que ningún path pierde letras casaba también con `"docs/`. Se cambió por `"ocs/`.

**Y un tercero, que encontró CI y no yo:** los cuatro casos de `tracker siguiente` pasaban en
local y fallaban en el runner. La acción exigía **credencial de tablero** para responder algo que
se deriva del registro (`SUITE-R48`), y en CI no hay `gh auth`. Un arnés que solo está verde donde
trabaja el agente **no protege el merge**, que es donde se decide. `siguiente` pasa a
`SIN_PLATAFORMA` — y sin tablero, `SUITE-R43` se reporta como `SIN EVALUAR` en vez de callarse:
una garantía que se apaga en silencio es peor que una que no existe.

Tres casos nuevos corren con `gh` fuera del `PATH`. 657 → 660.

**Y un cuarto, que CI encontró disparando la comprobación contra sí misma:** `actions/checkout`
deja el repositorio en **detached HEAD**, donde `git rev-parse --abbrev-ref HEAD` devuelve la
cadena `HEAD` — que no es el nombre de ninguna rama, sino no poder leerlo. Tratarla como valor
habría hecho fallar **cada PR** del framework. 660 → 662.

**Y un quinto, que salió al integrar:** al fusionar, la rama de tarea se borra, y el checkpoint la
tomaba de `alloc.branch` — así que pasaba a afirmar una **referencia muerta**, justo lo que
`STATE_MISMATCH` existe para impedir. La rama declarada solo vale si existe. 662 → 663.

Las tres veces el defecto era el mismo en distinto sitio: **probé donde trabajo, no donde se
decide.**

## Lo que no repara, a propósito

La salida **propone** `tracker checkpoint PT-NNN`; no lo ejecuta. Reescribir el checkpoint al
detectar el desfase borraría **la única prueba de que hubo divergencia**, y decidir si manda el
árbol o la foto es lo que `SUITE-R06` reserva a una persona.

## Lo que no queda comprobado

Que alguien **haga caso** al bloqueo: editar archivos con la discrepancia delante sigue siendo
posible. Que `sha` y `rama` **basten**: un árbol con el mismo `sha` y contenido manipulado sin
commitear pasa. Y que la descendencia sea **cómoda** tras un rebase legítimo — se ha probado que la
herramienta lo reporta, no que convivir con ello lo sea.

`LEX-R21` cumplido: el nombre entró en `LEXICON` antes que en el código, y sin regla nueva —
`LEX-R26` se amplía, que es lo que `spec-changes.md` declaró en `PHASE 4`.
