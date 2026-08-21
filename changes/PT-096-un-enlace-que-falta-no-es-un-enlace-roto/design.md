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

---

## D-8 · `esLote` se **importa** de `patrones.mjs`, no se reescribe — `Revisión 4`

`D-1` decía «se cambia por `/^EP-/`». Al buscar dónde ponerlo apareció que **ya está escrito**:

```js
// patrones.mjs:859
const esLote = (a) => /^EP-/.test(String(a?.id ?? ''));
```

con el comentario de quien tropezó antes y llegó a la misma conclusión, citando `SUITE-R38`: *«el
campo es opcional, así que fiarse de él es depender de dos fuentes del mismo hecho y quedarse con
la peor»*.

**Decisión:** se **exporta** desde `patrones.mjs` —el módulo compartido, cuyo papel declarado es
«los patrones críticos, con su contrato»— y se importa en `tracker.mjs`. Escribir una tercera
copia sería exactamente lo que ese comentario condena, y `D-1` habría sido la segunda.

**Riesgo, y por qué se acepta:** `patrones.mjs` lo importan ocho herramientas, y el intake del
lote midió que tocarlo obliga a ~669 casos. **Aquí solo se añade un `export`**: ninguna función
existente cambia de comportamiento, así que el riesgo es el de un símbolo nuevo, no el de un
cambio semántico. La batería completa se corre igual antes de `G3`.

## D-9 · Los ocho sitios de `tracker.mjs`, no dos — `Revisión 4`

```
:175    etiquetas       «implementación» vs «tarea»
:367    cuerpoDeIssue   la cabecera del cuerpo            <- AC-08
:564    orden           los lotes al final de la lista
:1120   contextoCuerpo  a quien se le calculan «tareas»   <- AC-08
:1372   estado          quien es lote                     <- el que pierde PT-096
:1373   estado          quien es tarea                    <- idem
:1966   pendiente       a quien se le pide fase
:2583   indices         YA usa /^EP-/ — se deja, y pasa a usar el helper
```

**Por qué los ocho y no los dos de `AC-08`.** Porque el defecto **no es del cuerpo del issue**: es
del predicado. Arreglar dos y declarar *«un hecho, un nombre»* sería la hipocresía que este lote
existe para señalar — y `EP-017` ya pagó dos veces por arreglar instancias sin tocar la causa.

Y es **menos** arriesgado que arreglar dos: con el helper importado hay **una** fuente; con dos
sitios arreglados hay seis que siguen respondiendo distinto a la misma pregunta.

**`:1120` desaparece entero.** Con `D-2` retirada la lista en prosa, `tareas` no lo consume nadie:
se quita del contexto en vez de dejar un cálculo muerto que el siguiente lector creerá vivo.

## D-10 · Los seis de `verify-fdge.mjs` **no** entran — `Revisión 4`

```
:707   lotes IN_PROGRESS          EP-019 esta en DRAFT           -> no dispara hoy
:717   huerfanos                  trataria a EP-019 como tarea   -> no dispara: tiene epic? no,
                                                                    pero VIVOS/type filtran antes
:1368  exencion de «sin fase»     EP-019 declara phase 1         -> no dispara hoy
:1369  el texto de esa exencion   idem
:1388  FDGE-R54 viabilidad        EP-019 la tiene registrada     -> no dispara hoy
```

**Están mal y hoy no tienen consecuencia**, que no es lo mismo que estar bien. Se declaran con su
medición y van a `L-3`: cambiarlas altera **veredictos de verificación**, que es otra clase de
riesgo —un verde que pasa a rojo o al revés— y merece su propia prueba inversa, no ir de paso en
una tarea sobre enlaces.

## D-11 · La **decisión** se separa del **efecto**, y es la que se prueba

`TS-05` no era testeable tal como estaba escrito: `repararEnlacesMuertos` no es pura ni exportada
—habla con la plataforma y escribe—. Se vio al intentar montar el caso, no al diseñarlo.

En vez de escribir un caso que hable con GitHub, se extrae la decisión:

```js
// puro, exportado, sin git ni red — el patron que PT-048 y PT-079 ya establecieron aqui
export function decisionDeEnlace(cuerpo, refExiste, durable) {
  if (!esCuerpoDelTracker(cuerpo)) return 'AJENO';
  const ref = refDeEnlace(cuerpo);
  if (ref) return refExiste(ref) ? 'OK' : (durable ? 'REPARAR_MUERTO' : 'ROTO_SIN_SALIDA');
  return durable ? 'REPARAR_MUDO' : 'MUDO_SIN_REF_DURABLE';
}
```

**Cinco resultados, cada uno con nombre.** Hoy el código responde a esta pregunta con dos
`continue` repartidos entre dos funciones, y por eso `REPARAR_MUDO` no existía: no es que estuviera
mal decidido, es que **no había dónde decidirlo**.

**Y resuelve `SUITE-R38` de paso:** `repararEnlacesMuertos` y `compararEspejo` preguntan lo mismo
—«¿este cuerpo está bien?»— y hoy lo responden por separado con la misma guarda copiada. Con esto
hay **una** fuente:

```
repararEnlacesMuertos   actua si REPARAR_MUERTO o REPARAR_MUDO
compararEspejo          reporta si REPARAR_MUERTO (SUITE-R56) o REPARAR_MUDO (SUITE-R51)
                        y NO reporta si MUDO_SIN_REF_DURABLE: no hay nada que enlazar todavia
```

`ROTO_SIN_SALIDA` y `AJENO` existen para que **no se confundan con `OK`**, que es lo que pasa hoy:
los dos caen por el mismo `continue` que el cuerpo sano. `ROTO_SIN_SALIDA` es el caso que `PT-079`
ya declaraba —*«queda roto y consta»*— y ahora tiene nombre en vez de una rama de `if`.

### `TS-05` reescrito

```
trlib "un cuerpo mudo con ref durable se repara"      "REPARAR_MUDO"
  decisionDeEnlace(cuerpoDeIssue({id:'PT-96',slug:'x'},{url:'https://h/r',rama:'main'}),
                   () => true, 'trabajo')

trlib "…y sin ref durable NO se toca"                 "MUDO_SIN_REF_DURABLE"
  decisionDeEnlace(<el mismo cuerpo>, () => true, null)

trlib "un issue ajeno no es asunto del tracker"       "AJENO"
  decisionDeEnlace('un issue escrito a mano por una persona', () => true, 'trabajo')

trlib "un enlace muerto sigue reparandose"            "REPARAR_MUERTO"
  decisionDeEnlace(<cuerpo con enlace>, () => false, 'trabajo')

trlib "y uno sano se deja en paz"                     "OK"
  decisionDeEnlace(<cuerpo con enlace>, () => true, 'trabajo')
```

Los cinco resultados con caso propio. **`MUDO_SIN_REF_DURABLE` y `AJENO` son los que impiden que
el arreglo se pase de frenada** — sin ellos, «repara lo mudo» acabaría reescribiendo issues que
nadie del tracker escribió, que es peor que el defecto (`strategy.md` `RIE`).

## D-12 · Una lectura fallida no es un cuerpo sano — encontrado midiendo `AC-05`

Al correr `tracker abrir` con el arreglo puesto, la herramienta anunció **seis** reparaciones. La
medición decía **diez**. Comprobado uno a uno con `decisionDeEnlace` sobre los diez cuerpos
publicados: los diez dan `REPARAR_MUDO`.

Los cuatro que faltaban se perdieron aquí:

```js
try { publicado = adaptador.cuerpoRemoto(a.issue); } catch { continue; }
```

**Un `catch` que hace `continue` convierte «no pude mirar» en «no hay nada que hacer».** En una
pasada sobre 99 issues, cuatro lecturas de plataforma fallaron y la herramienta no lo dijo.

**Por qué entra aquí y no en otra tarea.** Porque rompe `AC-05`. El criterio dice *«0 cuerpos
mudos sobre el tablero completo, con denominador»*, y con este `catch` el número real habría sido
«0 de los que pude leer» publicado como si fuera del tablero entero — **exactamente el error de
muestreo que `PT-079` documenta sobre sí mismo**: *«medí 0 de 17 sobre los issues vivos y lo
escribí como si fuera el tablero»*.

No es una ampliación de alcance: es la condición para que la medición de esta tarea signifique
algo. Un `AC` que se puede cumplir sin mirar la mitad del universo no es un `AC`.

```js
catch (e) {
  notas.push(`${a.id} #${a.issue}: no se pudo leer el cuerpo (…). SIN EVALUAR: no se afirma que este bien.`);
  continue;
}
```

`SIN EVALUAR` y no un fallo: **no saber no es permiso, pero tampoco es una acusación** (`RULE-06`).
Un fallo de red no dice nada del cuerpo, y bloquear por él dejaría la herramienta a merced de la
plataforma.

### Y de paso, el mensaje se leía mal

`se repararia el enlace sin enlace -> «trabajo»`. El `origen` de `D-4` ya evitaba el `«null»`, pero
encajado en la frase antigua producía «el enlace sin enlace». Queda `se repararia: sin enlace ->
«trabajo»`. Es cosmético y se anota porque **lo vio leer la salida real**, no el diff — que es la
misma forma en que apareció todo lo demás de esta tarea.
