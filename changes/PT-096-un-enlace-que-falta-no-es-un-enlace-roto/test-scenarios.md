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
  cuerpoDeIssue({id:'EP-9',slug:'x',title:'t'}, {url:'https://h/r', rama:'main',
                 tareas:[{id:'PT-90',issue:77,title:'t'}]})
```

**Hoy falla**, y falla **al revés**: hoy la lista se emite y `selftest.sh:1614` lo celebra. Ver
`design.md` `D-6`.

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
trlib "sin el resolvedor, el espejo se comporta como hoy"   "^\[\]$"
  compararEspejo([viva], [issueConCuerpoMudo], all, refExiste)     // sin quinto argumento
```

Un `undefined` no es un «no hay» (`RULE-06`). Protege a los 12 casos existentes de
`compararEspejo`, que llaman con cuatro argumentos.

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

**`AC-01` y `AC-05` no tienen `TS`, y se dice por qué:** se cumplen **sobre el tablero real**, no
en la batería —la batería no tiene credenciales ni red—. Su evidencia es la medición de
`PT-096.8`, con su denominador. **`AC-06`** es la existencia de esta tabla en rojo. **`AC-07`** lo
verifica `verify-suite`. **`AC-09`** no se cumple aquí: está declarado y trasladado a `L-3`.
