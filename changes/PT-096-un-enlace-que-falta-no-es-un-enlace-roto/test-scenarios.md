# Test scenarios — `PT-096`

> `PHASE 4`. Cada `TS-nn` cita su `AC`. **BUG: el escenario que reproduce va en ROJO primero**
> (`FDGE-R17`). La batería es `docs/methodology/tools/selftest.sh`; los helpers son `trlib`
> (la salida **casa** el patrón) y `trlibno` (**no** lo casa).

---

## Los que reproducen el defecto

### `TS-01` — el cuerpo sin ref durable **no** explica un enlace que no existe `AC-02`

```
trlibno "sin ref durable, no explica el enlace"   "El enlace apunta"
  cuerpoDeIssue({id:'PT-96',slug:'x',status:'IN_PROGRESS'}, {url:'https://h/r', rama:'main'})
```

**Hoy falla:** el cuerpo emite `> El enlace apunta a \`null\`, …`.
Es el gemelo exacto de `selftest.sh:1784`, que `PT-048` escribió para la rama hermana.

### `TS-02` — y no publica el literal `null` en ninguna parte `AC-02`

```
trlibno "el cuerpo nunca publica «null»"   "null"
  cuerpoDeIssue({id:'PT-96',slug:'x',status:'IN_PROGRESS'}, {url:'https://h/r', rama:'main'})
```

**Hoy falla.** Separado de `TS-01` a propósito: `TS-01` ata la **contradicción**, `TS-02` ata el
**síntoma que vio el firmante**. Si mañana alguien reescribe la nota y vuelve a colar un valor
interno con otras palabras, `TS-02` sigue cazándolo.

### `TS-03` — un lote se reconoce por su ID, escriba lo que escriba en `type` `AC-08`

```
trlib "el lote se reconoce por su ID"   "Implementación abierta"
  cuerpoDeIssue({id:'EP-19',type:'EPIC',slug:'x',title:'t'}, {url:'https://h/r', rama:'main'})
```

**Hoy falla:** con `type:'EPIC'` la cabecera sale como `**EPIC** · severidad — · sin
implementación asignada`. Se prueba con `EPIC` **y** con `type` ausente, que son los dos valores
reales del registro que hoy fallan.

### `TS-04` — la jerarquía no se narra `AC-08` · `SUITE-R51`

```
trlibno "el cuerpo del lote NO lista sus tareas"   "Tareas de este lote"
  cuerpoDeIssue({id:'EP-9',type:'EP',slug:'x',title:'t'}, {url:'https://h/r', rama:'main',
                 tareas:[{id:'PT-90',issue:77,title:'t'}]})
```

**Hoy falla**, y falla **al revés**: hoy la lista se emite y `selftest.sh:1614` lo celebra. Ver
`design.md` `D-6`.

> **`type:'EP'` en el fixture no es un descuido: es lo que hace válido el rojo.** La primera
> versión de este escenario lo omitía, y **habría pasado hoy** —sin `type`, `esLote` es falso, la
> lista no se emite y `trlibno` da verde— es decir: un caso verde por el motivo contrario al que
> lo justifica. Se vio **ejecutándolo** contra el árbol actual, no leyéndolo.
>
> Con `type:'EP'` el caso es rojo hoy (la lista se emite) y verde tras `PT-096.3` (se retira),
> y sigue siendo correcto con el `esLote` nuevo, porque `EP-9` casa **los dos** predicados.
>
> Es la familia de *«una inversa que sale en cero no es un verde, es un aviso»* de `PT-095`,
> en su forma más barata: un caso que no puede fallar no prueba nada.

### `TS-05` — la reparación alcanza al cuerpo mudo `AC-04`

```
trlib "un cuerpo mudo con ref durable se repara"   "reparar"
  <la decision de repararEnlacesMuertos sobre un cuerpo del tracker sin enlace,
   con refDurable disponible>
```

**Hoy falla:** `if (!ref || refExiste(ref)) continue;` lo salta.

### `TS-06` — el espejo reporta el enlace ausente `AC-03`

```
trlib "el espejo ve el cuerpo mudo"   "SUITE-R51"
  compararEspejo([viva], [issueConCuerpoMudo], all, refExiste, () => 'trabajo')
```

**Hoy falla:** `compararEspejo` devuelve `[]` — es el «el espejo cuadra» con diez rotos.

---

## Los que protegen lo que ya funciona

### `TS-07` — `PT-048` sigue en pie `regresión`

```
trlibno "sin directorio, sigue sin explicar el enlace"   "El enlace apunta"
  cuerpoDeIssue({id:'PT-97',slug:'x',status:'DEFERRED'}, {…, hayDirectorio:false})
```

Ya existe (`:1784`) y **debe seguir verde**. Se cita aquí porque `PT-096.2` reescribe justo esa
zona: si cae, el arreglo rompió al vecino.

### `TS-08` — el marcador está atado a quien lo escribe `RIE-4`

```
trlib "cuerpoDeIssue escribe el marcador que la reparacion busca"
      "Intake, criterios de aceptación y evidencia:"
  cuerpoDeIssue({id:'PT-99',slug:'x'}, {url:'https://h/r', rama:'main', refDurable:'trabajo'})
```

**Hoy pasa**, y es deliberado: no reproduce ningún defecto. Existe para que cambiar el texto del
cuerpo **rompa un caso** en vez de apagar `esCuerpoDelTracker` en silencio — que es el riesgo que
`D-4` introduce.

### `TS-09` — sin `refDurable` inyectado, nada cambia `regresión`

```
trlib "sin el resolvedor, el espejo se comporta como hoy"   "VACIO"
  const d = compararEspejo([viva], [issueConCuerpoMudo], all, refExiste)   // sin quinto argumento
  console.log(d.length ? d.map((x) => x.regla).join(' ') : 'VACIO')
```

Un `undefined` no es un «no hay» (`RULE-06`). Protege a los 12 casos existentes de
`compararEspejo`, que llaman con cuatro argumentos.

> **Se serializa a la palabra `VACIO` en vez de asertar contra `[]`**, que es la convención de
> `PT-085` y `PT-090`: para `grep`, `[]` es una **clase de caracteres** y el caso no casa su
> propia salida. `selftest.sh:1649` lo esquiva escapando (`^\[\]$`) y funciona, pero al fallar
> solo dice «no casó». Serializando las **reglas** que aparecieron, un fallo dice *cuál* apareció
> — que es la diferencia entre un rojo y un rojo que se puede diagnosticar.

**El fixture lleva sus etiquetas correctas**, y no es cosmético: sin ellas `compararEspejo`
devuelve una divergencia `SUITE-R35` por las etiquetas, y `TS-06` pasaría a verde el día que el
cuerpo mudo dejara de detectarse — verde por la divergencia equivocada. Comprobado ejecutándolo:
con las etiquetas puestas, hoy devuelve exactamente `[]`.

---

## Los dos que **cambian de sentido** — `design.md` `D-6`

No se hacen pasar. Se invierten, y la inversión lleva su motivo en el comentario:

```
:1787  trlib   "y el cuerpo dice donde esta"        -> trlibno   · afirmaba que la nota se
                "donde el contenido existe ahora"                  emite SIN ref durable
:1614  trlib   "el cuerpo del lote ya trae numero"  -> trlibno   · afirmaba que la lista
                "#77"                                              en prosa se emite
```

---

## Mapa `TS` → `AC` → tarea

| TS | AC | Tarea | Estado hoy |
|:---|:---|:---|:---|
| `TS-01` | `AC-02` | `PT-096.2` | **rojo** |
| `TS-02` | `AC-02` | `PT-096.2` | **rojo** |
| `TS-03` | `AC-08` | `PT-096.3` | **rojo** |
| `TS-04` | `AC-08` | `PT-096.3` | **rojo** |
| `TS-05` | `AC-04` | `PT-096.4` | **rojo** |
| `TS-06` | `AC-03` | `PT-096.5` | **rojo** |
| `TS-07` | regresión `PT-048` | `PT-096.2` | verde, debe seguir |
| `TS-08` | `RIE-4` | `PT-096.4` | verde por construcción |
| `TS-09` | regresión | `PT-096.5` | verde, debe seguir |

**`AC-05` no tiene caso de batería, y se dice por qué:** se cumple **sobre el tablero real**, y la
batería no tiene credenciales ni red — un caso que simulara el tablero probaría el simulador. Su
comprobación es `tracker espejo` sobre el tablero, y su evidencia la medición de `PT-096.8` con su
denominador. **`AC-06`** es la existencia de esta tabla en rojo. **`AC-07`** lo verifica
`verify-suite`. **`AC-09`** no se cumple aquí: está declarado y trasladado a `L-3`.

> **`AC-01` sí tiene caso desde la `Revisión 4`**: `TS-10`, más abajo. Este párrafo decía lo
> contrario y se corrige aquí en vez de reescribirlo, porque la contradicción entre dos partes del
> mismo documento es justo la avería que `SUITE-R38` persigue — y taparla editando arriba dejaría
> el documento limpio y la lección perdida.

---

## Añadidos por la `Revisión 4` — el predicado, no solo el cuerpo

### `TS-10` — lo que el cuerpo escribe, `refDeEnlace` lo lee `AC-01`

```
trlib "lo que el cuerpo escribe, refDeEnlace lo lee"   "trabajo"
  refDeEnlace(cuerpoDeIssue({id:'PT-94',slug:'x',status:'IN_PROGRESS'},
              {url:'https://h/r', rama:'main', refDurable:'trabajo'}))
```

**Hoy pasa.** No reproduce un defecto: ata al **escritor** con el **lector**. Si alguien cambia la
forma de la URL en `cuerpoDeIssue`, `refDeEnlace` deja de reconocerla y `repararEnlacesMuertos`
se apaga en silencio — el mismo riesgo que `RIE-4`, en la otra dirección.

### `TS-11` — la etiqueta de un lote no depende de cómo se escribiera su `type` `AC-08`

```
trlib "un lote se etiqueta como implementacion, escriba lo que escriba en type"  "implementación"
  etiquetasDe({id:'EP-19', type:'EPIC', phase:1})
```

**Hoy falla:** devuelve `tarea`. Se prueba con `EPIC` y con `type` ausente.

### `TS-12` — los lotes van al final, se llamen como se llamen `AC-08`

```
trlib "el lote va al final aunque su type sea EPIC"   "^EP-19$"
  ordenDeApertura([{id:'EP-19',type:'EPIC'},{id:'PT-1',type:'BUG'}]).at(-1).id
```

**Hoy falla:** con `type:'EPIC'` el lote no se ordena al final y sale primero.

### `TS-13` — una tarea de un lote **aparece** en el tablero `AC-08`

```
chk "una tarea de un lote aparece en «estado»"   "PT-096"
  node docs/methodology/tools/tracker.mjs estado
```

**Hoy falla, y es el caso que ordenó la `Revisión 4`.** `estado()` parte el registro en `eps`
(`type === 'EP'`) y `pts` (`type !== 'EP'`): `EP-019` no entra en `eps`, así que su grupo no se
imprime; y `PT-096` declara `epic`, así que tampoco es «suelto». **Se cuenta y no se lista.**

Es un `chk` y no un `trlib` porque `estado()` no es una función pura exportada: lo observable es
la salida del comando, que es además lo que una persona mira.

## Mapa actualizado

| TS | AC | Tarea | Estado hoy |
|:---|:---|:---|:---|
| `TS-10` | `AC-01` | `PT-096.4` | verde, ata escritor y lector |
| `TS-11` | `AC-08` | `PT-096.3` | **rojo** |
| `TS-12` | `AC-08` | `PT-096.3` | **rojo** |
| `TS-13` | `AC-08` | `PT-096.3` | **rojo** |
