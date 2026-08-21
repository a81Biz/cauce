# Design — `PT-096`

> `PHASE 4`. Las decisiones y **por qué ésta y no otra**. La evaluación de alternativas está en
> `strategy.md` §3 y no se repite.

---

## D-1 · `esLote` se deriva del **ID**, no del campo `type`

```js
// antes
const esLote = a?.type === 'EP';
// despues
const esLote = /^EP-/.test(String(a?.id ?? ''));
```

**Por qué ésta.** `LEXICON` declara `EP-NNN` como el identificador de un lote y **no declara**
ningún valor de `type` para él (§8.1 enumera los cinco de una tarea). El registro escribe tres
respuestas distintas —`EP` ×16, ausente ×2, `EPIC` ×1— porque la pregunta no tiene respuesta
declarada.

Derivar del ID usa el único nombre que `LEXICON` sí declara, y es **lo que este mismo archivo ya
hace** en `indices()`:

```js
.filter((a) => !/^EP-/.test(String(a?.id ?? '')))     // tracker.mjs:2583
```

Dos lugares del mismo archivo respondiendo la misma pregunta de dos formas era, en sí, la causa
`C-2`. Ahora responden igual.

**Por qué no declarar el `type` canónico en `LEXICON` aquí.** Sería lo correcto y sigue
pendiente; pero es una decisión de vocabulario que afecta a las 19 `allocations` de lote y a
quien las lea, y su dueña es `L-3` —*un hecho, un nombre*—. Esta decisión hace que el arreglo
**no dependa** de aquélla, que es distinto de resolverla.

## D-2 · Se retira la lista `Tareas de este lote:`

**Por qué ésta, y no «hacer que aparezca».** Es la decisión contraintuitiva de la tarea y la
ordena la medición, no el criterio:

```
PT-035    «una tarea es SUB-ISSUE de su lote, NO un enlace en su cuerpo»
SUITE-R51  HARD · la jerarquia es estructura, no prosa
medido     14 issues de lote la llevan hoy
```

`PT-035` añadió el anidamiento —que **funciona**: `PT-096 #191 → sub-issue de EP-019 #189`,
verificado en esta sesión— y no retiró la copia narrada. `D-1` haría aparecer esa copia en tres
lotes más, es decir **propagaría una violación de regla** creyendo arreglar un defecto.

Se conserva la cabecera `**Implementación abierta** · <título>`: eso es información **del lote**,
no una segunda representación de su jerarquía.

## D-3 · La nota del enlace se condiciona a que haya enlace

```js
// antes: la rama «else» emite la nota siempre, con ramaDelEnlace posiblemente null
// despues: tres ramas explicitas
//   hayDirectorio === false   -> nota de SUITE-R44          (PT-048, ya existia)
//   sin ref durable           -> nota que dice QUE HACER    (nueva)
//   con enlace                -> «apunta a X»               (lo de hoy)
```

**Por qué el texto dice qué hacer y no solo qué pasa.** El cuerpo lo lee una persona que quiere
llegar al intake. *«No hay ref durable»* le informa de un estado interno; *«aparecerá al
integrarse, y si no, `tracker abrir --aplicar` lo republica»* le da la salida. `RULE-06` obliga a
no inventar el dato; no obliga a ser oscuro.

## D-4 · La reparación distingue **ausente** de **muerto**

```js
// antes
const ref = refDeEnlace(publicado);
if (!ref || refExiste(ref)) continue;
// despues
const ref = refDeEnlace(publicado);
const mudo = !ref && esCuerpoDelTracker(publicado);
if (!mudo && (!ref || refExiste(ref))) continue;
```

**Por qué hace falta `esCuerpoDelTracker`.** `refDeEnlace` devuelve `null` para dos cosas
distintas: un cuerpo del tracker sin enlace, y **cualquier issue que el tracker no escribió**.
Sin distinguirlas, la reparación reescribiría issues ajenos — que es peor que el defecto.

Se reconoce por el marcador que la propia función escribe:

```js
const MARCADOR_CUERPO = 'Intake, criterios de aceptación y evidencia:';
```

**Y por eso `RIE-4` existe:** si alguien cambia ese texto en `cuerpoDeIssue`, la reparación deja
de reconocer sus propios cuerpos **en silencio**. Se ata con un caso de batería que comprueba que
`cuerpoDeIssue` **contiene** el marcador — de modo que cambiar el texto rompe el caso en vez de
apagar la reparación.

## D-5 · El espejo reporta el enlace ausente, y `compararEspejo` sigue siendo pura

```js
// firma: compararEspejo(vivas, issues, all, refExiste, refDurable)
// refDurable se INYECTA, igual que refExiste desde PT-079, para que el arnes
// pueda probarla sin git ni credenciales.
```

**Por qué opcional.** Un parámetro nuevo sin valor por defecto rompería a los llamadores que no
lo pasan, incluidos los casos de batería existentes. Se trata como `refExiste`: si no viaja, la
comprobación **no se hace** y nada cambia. Un `undefined` no es un «no hay» (`RULE-06`).

**Cuándo dispara.** Solo si `refDurable(a)` devuelve algo **y** el cuerpo no enlaza. En `PHASE 1`,
recién abierto el issue, no hay ref durable: no dispara, porque no hay nada que enlazar. Dispara
en cuanto el intake entra en un commit — que es el primer momento en que se puede arreglar.

**Dónde muerde.** `npm run verify:espejo` corre en CI. Sobre la rama de trabajo el espejo
**bloquea** (`SUITE-R47`), así que el caso deja de depender de que alguien mire el tablero.

## D-6 · Dos casos de la batería **cambian de sentido**, y no se hacen pasar

Es el hallazgo que `PT-079` documentó sobre sí mismo y aquí vuelve a ocurrir. Se declara antes de
tocar nada para que no parezca una regresión:

```
selftest.sh:1787   trlib "y el cuerpo dice donde esta"  "donde el contenido existe ahora"
                   …cuerpoDeIssue({…}, {url, rama:'main', ramaTrabajo:'trabajo'})   // SIN refDurable

                   AFIRMA que la nota se emite cuando NO hay ref durable.
                   Es exactamente el defecto, escrito como caso verde.
                   -> se INVIERTE a trlibno, citando este PT.

selftest.sh:1614   trlib "el cuerpo del lote ya trae numero"  "#77"
                   …cuerpoDeIssue({id:"EP-9",type:"EP",…},{tareas:[…]})

                   AFIRMA que la lista en prosa se emite.
                   Es lo que PT-035 declaro defecto y SUITE-R51 prohibe.
                   -> se INVIERTE a trlibno, citando PT-035 y SUITE-R51.
```

**Ninguno de los dos se «arregla» para que siga pasando.** Un caso que codifica el defecto no es
una red de seguridad: es el defecto con un test que lo protege.

## D-7 · Qué NO se cambia

- **`refDurableDe`** — su respuesta `null` en `PHASE 1` es **correcta**: en ese instante de verdad
  no hay ref durable. El defecto es que nadie vuelve a preguntar, no que responda mal.
- **`sincronizarCuerpos`** — ya reescribe las vivas y funciona.
- **`espejo` no escribe.** Sigue siendo lectura (`strategy.md` §3, `A-2`).
- **`SUITE-R51`** — se cita, no se toca. Ya dice lo necesario.
