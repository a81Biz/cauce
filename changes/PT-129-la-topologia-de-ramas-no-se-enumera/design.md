# `PT-129` — Diseño   `PHASE 4`

> Qué se toca exactamente, y por qué así y no de otra forma.

---

## `E-1` · El vocabulario sale de `LEXICON`, no de `RULES`

`RULES.md` — `FDGE-R19`. La frase que hoy dice

> *«Formato obligatorio: `<type>: PT-XXX <descripción>` con `type` ∈ `feat`·`fix`·`refactor`·
> `test`·`docs`·`chore`»*

**se conserva tal cual para los commits** —ese vocabulario es correcto y es el de git— y se le
añade que **el `<type>` de una rama no es ése**: es el `type` del ítem, en minúsculas, y lo declara
`LEXICON` §943.

No se copia la lista: se **cita** (`LEX-R23`). Copiarla sería crear la cuarta representación.

## `E-2` · La enumeración pasa a cuatro, y «Prohibidos» se desambigua

```
efímera        <tipo-de-ítem>/<usuario>/PT-NNN-slug    nace en PHASE 5, muere al fusionarse
integración    «trabajo» por convención                recibe el PR de cada tarea · NO es G4
por defecto    «main»                                  recibe el merge del lote · SÍ es G4
derivada       cauce/<usuario>                         proyección del estado · LEXICON §810
```

Y la lista de prohibidos pasa de palabras sueltas a decir de qué habla: **son descripciones de
commit vagas**, no valores de `type`. `fix` deja de estar en las dos listas de la misma frase.

## `E-3` · `ramaDeTarea` deja de inventar

`patrones.mjs:557`

```js
// antes
const t = String(tipo ?? 'chore').toLowerCase();

// después
if (!tipo) return null;        // sin type no hay nombre: se DICE, no se adivina
const t = String(tipo).toLowerCase();
```

Quien llama —`tracker rama`— pasa de imprimir un nombre inventado a decir **por qué** no puede
proponerlo y qué falta. Es `RULE-06`: el «no lo sé» antes que el falso dato.

**Y tiene caso hoy**: `PT-125` y `PT-126` están sin `type` por `PT-124`, así que la inversa se
puede ejecutar contra el árbol real en vez de contra un fixture.

## `E-4` · La comprobación que enumera — el corazón de la tarea

`verify-fdge.mjs`, comprobación nueva bajo `FDGE-R19`.

**Entrada:** las ramas reales, derivadas y no declaradas.

```js
git ls-remote --heads origin          // el remoto, que es donde se decide
git for-each-ref refs/heads           // y el local, que es donde se trabaja
```

**Contraste, en tres preguntas, y cada una con su tercer desenlace:**

| Pregunta | `ok` | `fail` / `warn` | `SIN EVALUAR` |
|:---|:---|:---|:---|
| ¿Cada rama encaja en uno de los cuatro tipos? | encaja | no encaja → se **nombra** | sin acceso al remoto |
| ¿Cada efímera tiene su tarea **viva**? | viva | terminal → **avisa** y describe el borrado | la tarea no está en el registro |
| ¿Cada `PT` en `PHASE 5+` tiene su rama **existiendo**? | existe | declarada y ausente | sin git |

**Avisa, no falla, y es deliberado.** `FDGE-R19` ya sentó el criterio con el usuario en la rama:
*«una rama creada antes de la 8.3.0 se termina como empezó… y por eso la comprobación avisa y no
falla»*. Un `fail` aquí pondría en rojo un repositorio sano por dos ramas históricas. Se sube a
`fail` **sólo en `--gate G4`**, que es donde el estado tiene que ser uno solo — el mismo patrón que
`SUITE-R35` ya usa.

**Y nunca borra.** `SUITE-R06f`. Describe el comando (`EXEC-R07`).

---

## Lo que este diseño NO establece

- **Que el vocabulario de `LEXICON` sea el mejor.** Establece que es **el único** que ya existe en
  el registro y que `LEX-R21` le da precedencia. Si el firmante prefiere el otro, el cambio es
  `E-1` al revés y `E-4` no se entera.
- **Que las dos ramas históricas se arreglen.** No se tocan: se **nombran**.
- **Que no haya más ramas fuera de la topología en otros proyectos.** Se mide sobre éste.
