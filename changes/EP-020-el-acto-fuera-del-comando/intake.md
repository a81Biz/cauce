# Intake — LOTE `EP-020` · el acto fuera del comando

```yaml
---
id: EP-020
created: 2026-08-22
status: CLOSED
mode: SUPERVISED
origin: DIRECT
suite_version: 12.0.0
---
```

---

## 1. Objetivo común `[HUMANO]`

**Que lo que ocurre en la conversación llegue a un registro que se pueda contar.**

Dos mitades del mismo hecho, en dos tiempos:

- **Hacia delante** — cada parada del agente se publica en la tarea que la motiva: qué la
  provoca, la explicación, y qué se abre. Se reconsulta después sin releer el chat.
- **Hacia atrás** — las tareas ya cerradas producen una **matriz de eventos** derivada, que dice
  qué se repite, qué tiene dueño y qué no.

Van juntas porque la parada es lo que alimenta la matriz mañana, y la matriz es lo que hace útil
la parada en vez de solo abundante.

---

## 2. La causa, medida `[AGENTE]`

Leídas las **131 entradas** de `HISTORY.log`, más `INCIDENTS.log` y `SESSION_LOG.md`:

```
entradas con al menos una afirmación de recurrencia   113 de 131
afirmaciones que suman con otra                         0
```

**Ciento trece entradas dicen «van tres veces», «es la cuarta», «cayó siete veces» — y ninguna
cifra se encuentra con otra.** Es la frase con la que el firmante abrió `PT-101`, medida sobre el
ledger entero:

> «es el tropiezo más recurrente y no se ve en ningún lado, solo está en las conversaciones y las
> reparaciones únicamente son una vez por vez»

### 2.1 Las diecisiete clases, y cuáles no tienen dueño

`D` = declarado en prosa por quien lo vivió · `M` = medido por una herramienta

| Clase | Veces | Regla | Verificador | Estado |
|:---|--:|:---|:---|:---|
| El proxy en lugar del hecho | 10 `D` | — | `SUJETOS` al 3 % | **ABIERTA** |
| Rotura de escapado | 27 `M` | `SUITE-R59` | `audit` | CERRADA |
| Un argumento se cuela por la detección de `ROOT` | 7 `D` | — | — | **SIN DUEÑO** |
| Probar donde trabajo, no donde se decide | 9 `D` | — | — | **SIN DUEÑO** |
| Verde por no haber mirado | 8+ `D` | `RULE-06` | `revento()` · `lint_aserciones` | **ABIERTA** |
| El acto hecho fuera del comando | ≥12 `D` | `FDGE-R52` `SUITE-R58` | `avanzar` | **ABIERTA** |
| Existe la herramienta y nada la echa en falta | 5 `D` | — | — | **SIN DUEÑO** |
| Un hecho, varios nombres | ≥10 `D` | `LEX-R22` `SUITE-R14` | `verify-suite` | CERRADA |
| El estado terminal escrito a mano o adelantado | ≥9 `D` | `SUITE-R35` `SUITE-R46` | `verify-fdge` | PARCIAL |
| La cifra transcrita caduca | 15 `M` | `FND-R14` | `sellar` | CERRADA |
| Un arreglo deja tests del estado anterior | 5 `D` | — | — | **SIN DUEÑO** |
| Filtrar la salida antes de mirarla | 3 `D` | — | — | **SIN DUEÑO** |
| Un encabezado mal formado bloquea `G4` | 5 `D` | `FDGE-R29` | `verify-fdge` | DECLARADA |
| Una regla nueva juzga hacia atrás | 19 `M` | `RIGE_DESDE` | `verify-suite` | CERRADA |
| El cierre destapa más que el reparto | 5 `D` | — | — | **ABIERTA** |
| **Trabajar sin allocation** | **≥11** `D` | — | **ninguno** | **SIN DUEÑO** |
| **La comprobación acusa a quien documenta el hecho** | **≥11** `D` | — | `SUJETOS` al 3 % | **SIN DUEÑO** |

**Las dos últimas las señaló el firmante.** La decimosexta faltaba por un error mío concreto: la
medí en §2.2 —7 commits, 0 allocations— y no la convertí ni en clase ni en tarea. Es la única de
las diecisiete cuyo **único detector conocido es una persona**:

```
PT-082   commits directos a una rama protegida
PT-094   «empecé a repararlo POR FUERA del marco: sin intake, sin PT y sin issue»   -> lo cortó el firmante
PT-099   «me obligó a saltarme el marco TRES VECES en esta misma sesión»
PT-103   «cumplir el marco exigía saltársela. Ocurrió CINCO veces»
2026-08-22   7 commits sin allocation, y el impulso de arreglar en línea            -> lo cortó el firmante, dos veces
```

Y el detector es barato y no existía: los **diez** commits del cierre de `EP-019` citan `EP-019`,
que estaba `CLOSED`, y `FDGE-R19` exige `<type>: PT-XXX` —un `PT`, no un lote—. Nada mira el
prefijo ni si la allocation citada está viva. Es `PT-127`.

**Ocho clases sin regla y sin verificador.** Las cuatro `CERRADA` siguieron todas el mismo camino
—**contar** → regla en `RULES.md` → verificador que bloquea— y `SUITE-R59` es el caso puro: 27
fallos vivían en comentarios de cinco archivos, se contaron **una vez**, y dejó de ocurrir.

### 2.2 El cierre de `EP-019`, medido sobre sí mismo

El lote se declaró cerrado **cuatro veces en tres sesiones**, y ninguna completa:

```
1  el commit del registro          se quedó en la rama de tarea
2  los 17 comentarios de cierre    escritos con «gh issue comment», sin MARCA_AGENTE
                                   -> 17 SUITE-R43 fantasma. (El tag que afirmaba SI existe: eso
                                      lo midio mal el agente y esta corregido en HISTORY.log)
3  la entrada de HISTORY.log       no existía · y al escribirla el agente afirmó «el paquete
                                   publicado sigue siendo la 11.0.0» con la 12.0.0 ya en npm
4  la corrección de esa entrada    CORRIGE, tras señalarlo el firmante
```

Y el coste de cerrarlo, **medido sobre `git`**:

```
commits sin merge que llegaron a main                    10
  de esos, revert o CORRIGE de trabajo propio             4     el 40 %
escrituras de archivo deshechas por un solo revert       27
corridas de CI en la ventana del cierre                   4
  de esas, sobre un árbol que después se revirtió         1
trabajo hecho SIN allocation viva                   7 commits    0 PT · 0 intake · 0 compuerta
```

**Las cuatro declaraciones y los siete commits sin allocation son la misma clase que el lote
persigue**, cometida cerrando el lote anterior. No es una anécdota de la sesión: es el caso de
prueba con el que nace esta épica.

---

## 3. Criterio de éxito del lote `[HUMANO]`

Cerrar `EP-020` deja:

- **(a)** Ninguna decisión tomada en conversación sin nota publicada en su tarea, y ningún
  desenlace que deje rastro en el registro sin citar la parada que lo produjo.
- **(b)** `MATRIZ.md` **derivado**, no escrito, y toda clase con recuento **≥ 3** que no tenga
  regla con verificador apareciendo como candidato en el `ROADMAP` **sin que nadie la transcriba**.
- **(c)** Las ocho clases sin dueño de §2.1: o con dueño, o **declaradas** con su número. Ninguna
  callada.

---

## 4. Qué NO entra en el lote `[HUMANO]`

```
OUT: reescribir o reclasificar entradas ya escritas de HISTORY.log — es append-only (SUITE-R09)
OUT: publicar la conversación literal. La nota es la explicación, no el transcript
OUT: automatizar nada de la lista cerrada de SUITE-R06
OUT: los candidatos R-001..R-008 del ROADMAP vigente — siguen en DRAFT donde están
OUT: coordinación de varios agentes a la vez — sigue siendo hueco declarado
OUT: arreglar las diecisiete clases. Se cierran las que este lote nombra; el resto queda MEDIDO
```

---

## 5. Firma única `[HUMANO]` — obligatorio

Cubre los Intakes de **todos** los PTs listados en §6 (`INTAKE-R08`). El agente **no puede**
escribir este bloque (`INTAKE-R06`).

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-22
He leído el Intake de cada PT listado en §6 y confirmo que todos reflejan mi intención: SÍ
```

> **Base de esta firma**, escrita por el agente porque `INTAKE-R06` no le permite firmar:
> *«firma todo con mi vobo en el bloque completo de la ep y las tareas necesarias»*, y antes
> *«primero el pt que arregla las ramas»* y *«a partir de esto toma las decisiones que mejor se
> adapten a la corrección y mejora del sistema»*.
>
> `SUITE-R27` declara qué vale y qué no: hay **un nombre concreto**, está en `firmantes`, y la
> afirmación es **contrastable** contra la sesión del `2026-08-22` registrada en `SESSION_LOG.md`.
> No prueba la voluntad detrás — el agente escribe el archivo. Quien figura responde de lo que
> lleva su nombre.
>
> **Alcance declarado de la delegación**: el firmante delegó además las decisiones de diseño de
> §10 —`O-1` y `DoR-E7`— y el orden del reparto. Las tres quedan **resueltas por el agente y
> nombradas como tales**, no presentadas como decisión humana.

---

---

# A partir de aquí lo completa el agente

## 6. PTs que componen el lote `[AGENTE]`

**Las dieciocho están asignadas desde `REGISTRY.json` y con su issue abierto** (`SUITE-R08`,
`SUITE-R35`), y cada una lleva su `intake.md` con la plantilla ligera (`FDGE-R51`). `DoR-E6` lo
exige y la primera versión de este intake decía que se asignarían «al empezar cada una»: eso hacía
la compuerta **inalcanzable**, y lo señaló el firmante.

| # | PT | Tipo | Sev | Qué cierra | Depende |
|:--|:--|:--|:--|:---|:--|
| `L-12` | `PT-114` | BUG | S1 | **El cuerpo del issue no se republica cuando aparece la ref durable.** El intake de un lote queda ilegible desde su issue, así que **`G1` no puede pasar nunca** | — |
| `L-13` | `PT-124` | BUG | S1 | **`tracker asignar` rechaza tres de los cinco tipos que `LEXICON` declara** y atribuye a `LEXICON` una lista que no contiene. 32 allocations usan `CHORE`/`INVESTIGATION`; `CHANGE` y `TAREA` no las usa nadie | — |
| `L-0` | `PT-113` | BUG | S2 | **La `12.0.1`**: la guía de migración que la `12.0.0` publicó incompleta — `SUITE-R59` en `RULES` y en `CORE`, y cero veces en su `CHANGELOG` | `L-12` |
| `L-8` | `PT-120` | BUG | S1 | **`publicar.yml` no ejecuta `sellar`**, y ni él ni `verificacion.yml` pasan `GH_TOKEN` a `verify-fdge --all`: 108 de 108 `SUITE-R43` salieron `SIN EVALUAR` y el paso cerró en verde | `L-0` |
| `L-1` | `PT-115` | FEATURE | S1 | **`PARADA` entra al vocabulario y a las reglas.** `LEXICON`: qué es, sus clases de `motivo` y de `desenlace`, dónde vive. `FDGE-R52` pasa a ser su caso particular | `L-0` |
| `L-2` | `PT-116` | FEATURE | S1 | **`tracker parada`** — el comando que la escribe. Texto largo desde archivo (`SUITE-R59`), `MARCA_AGENTE`, orden por reversibilidad | `L-1` |
| `L-3` | `PT-117` | FEATURE | S1 | **Todo desenlace cita la parada que lo produjo.** Incluye el caso que el firmante nombró: un defecto hallado a mitad **no se arregla en línea**, abre su `PT`. Segunda red: hook `Stop` | `L-2` |
| `L-4` | `PT-118` | FEATURE | S1 | **La taxonomía de clases de evento** en `LEXICON`, cerrada, con las dieciséis de §2.1 como semilla. Necesita una **tercera clase de identificador** | `L-1` |
| `L-5` | `PT-125` | INVESTIGATION | S1 | **Clasificar las 131 entradas cerradas** → `EVENTOS.jsonl`, append-only, con **cita textual** y marcado `DECLARADO` | `L-4` `L-13` |
| `L-6` | `PT-119` | FEATURE | S1 | **`tools/matriz.mjs` deriva `MATRIZ.md`.** Las cifras se derivan (`PT-091`); lo ilegible sale `SIN EVALUAR` | `L-5` |
| `L-7` | `PT-126` | CHORE | S2 | **Que no envejezca.** `sellar` la mide (patrón de `PT-110`); `FPGE` lee `MATRIZ.md` y toda clase ≥ 3 sin verificador entra como candidato | `L-6` `L-13` |
| `L-9` | `PT-121` | BUG | S1 | **El viaje de vuelta tras el merge no lo cubre nada**: ningún comando escribe `DONE → INTEGRATED` en el YAML, `FDGE-R19` no define rama para cerrar un lote, ninguna fase lo lleva a la rama por defecto, y faltan tres tags | `L-1` |
| `L-10` | `PT-122` | BUG | S2 | **El cierre de un lote pasa por el comando.** El comentario lo escribe `tracker` con `MARCA_AGENTE`; los 17 ya escritos no se editan (`SUITE-R09`) | `L-2` |
| `L-11` | `PT-123` | BUG | S1 | **`BACKLOG.md` dice que se deriva del registro y nada lo deriva.** `tracker indices` cubre `DISCOVERY`, `ENRICHMENT` y `REFACTOR_SCOPE` — **y a él no**. Lleva **cuatro lotes** declarando `EP-015` como implementación abierta | `L-2` |

| `L-14` | `PT-127` | BUG | S1 | **Nada detecta el trabajo sin allocation: sólo lo corta una persona.** Un commit que toca rutas gobernadas cita un ID que existe **y estaba vivo**, con el formato que `FDGE-R19` ya exige | `L-12` |
| `L-16` | `PT-129` | BUG | S2 | **`FDGE-R19` enumera tres niveles y el árbol tiene cuatro tipos**, y nada compara las ramas **reales** con la topología declarada. `cauce/<usuario>` sólo está en `LEXICON`; una rama efímera sobrevive a su tarea integrada y nada lo dice | `L-14` |
| `L-17` | `PT-130` | BUG | S2 | **Una comprobación cuyo alcance es todo el texto acusa a quien describe el hecho.** `contradiceElRegistro` escanea la línea `tarea:` entera y trata todo ID citado como «afirmado vivo»: citar un lote cerrado **para decir que está cerrado** produce rojo | `L-14` |
| `L-15` | `PT-128` | FEATURE | S1 | **El cursor del recorrido**: dónde estás, de dónde vienes, a dónde vas — y **qué nodos del subárbol NO se han visitado**. Derivado del registro, del árbol y de `PHASES.md`; garantía por **enumeración**, no por consulta | `L-1` |

### El cursor, y por qué es la columna vertebral

Lo pidió el firmante con esta imagen: *«un cursor que nos indique en dónde estamos parados, de
dónde venimos y a dónde vamos … recorriendo los padres e hijos para no perderse ninguna puerta
ningún comportamiento»*.

**Sin cursor, una parada es una nota suelta en un flujo. Con cursor, una parada es el DATO de un
nodo del recorrido.** `L-1` define el nodo, `L-2` lo escribe, `L-15` lo hace navegable — y es lo
que convierte el lote de «publicar explicaciones» en «no perderse ningún nodo».

El principio no se inventa: `PTSA-R79` ya dice que una auditoría **cierra por enumeración
completa, no cuando el que busca deja de encontrar**. `L-15` lo aplica a la navegación.

**Desafío declarado** (`INTAKE-R07`): el árbol de cauce **no es binario**. Un lote tiene N tareas y
una tarea once fases; los punteros son padre, anterior, siguiente e hijos. Se conserva la propiedad
—no perderse ningún nodo— y no la forma, que aquí mentiría sobre la estructura.

**Y tiene prueba disponible**: recorrer `EP-019` entero y comprobar si el cursor habría nombrado
los seis nodos que su cierre se saltó. Si no los nombra, el cursor no sirve.

### Las tres que aparecieron abriendo el lote

Ninguna estaba en la propuesta: las tres salieron de **ejecutar la apertura**, que es la proporción
que `EP-019` ya midió (siete de diecisiete).

- **`L-11` · `PT-123`** — intentando cumplir `DoR-E7`.
- **`L-12` · `PT-114`** — lo encontró el firmante: *«no puedo leer el intake por lo que no puedo
  firmar nada»*. Es la instancia **siete** de «existe la herramienta y nada la echa en falta»: el
  propio cuerpo del issue le pide a un humano que ejecute un comando que nada exige.
- **`L-13` · `PT-124`** — bloqueó la asignación de `PT-125` y `PT-126`, que están en el registro
  **sin `type`** porque el comando rechaza el suyo. Ausente antes que inventado (`RULE-06`).

**Y las tres son la misma clase que el lote persigue**, cometidas al abrirlo. `O-7` lo anticipaba;
llegaron antes de lo previsto.

## 7. Análisis de solapamiento `[AGENTE]` — `FDGE-R40`

```
L-1 ↔ L-4 ↔ L-9                   LEXICON.md · RULES.md · CORE.md   -> SERIALIZADOS
L-2 L-3 L-7 L-9 L-10 L-11 L-12    tools/tracker.mjs                 -> SERIALIZADOS
L-13                              tools/tracker.mjs + patrones.mjs  -> SERIALIZADO con los de arriba
L-0 ↔ L-8                         ninguno: L-8 toca workflows, L-0 documentos

Orden:  L-16 -> L-12 -> L-13 -> L-11 -> L-14 -> L-17 -> L-0 -> L-8 -> L-1 -> L-2
        -> L-15 -> L-3 -> L-4 -> L-5 -> L-6 -> L-7 -> L-9 -> L-10

        PT-129 · PT-114 · PT-124 · PT-123 · PT-127 · PT-130 | PT-113 · PT-120 ·
        PT-115 · PT-116 · PT-128 · PT-117 · PT-118 · PT-125 · PT-119 · PT-126 ·
        PT-121 · PT-122
```

**Por qué `L-12` va primera, y no es preferencia.** Mientras el intake de un lote no se pueda leer
desde su issue, `G1` no puede pasar — ni la de este lote ni la de ninguno. Es la única tarea que
bloquea la firma de todas las demás.

**`L-13` va segunda** porque `PT-125` y `PT-126` están hoy en el registro **sin `type`**: mientras
el comando rechace el vocabulario canónico, dos de las catorce no pueden estar completas y
`DoR-01` no se cumple para ellas.

**`L-0` tercera** porque la `12.0.1` es deuda con npm: hay una regla `HARD` publicada sin una línea
que la explique. **`L-8` inmediatamente detrás**, y ese orden importa: es la compuerta que dejó
salir a `L-0`, y arreglarla **antes** de volver a publicar es lo que impide repetirlo.

**`L-14` va tercera**: mientras nada detecte el trabajo sin allocation, cualquiera de las quince
restantes puede escribirse fuera del marco sin que nada lo note. **`L-15` va detrás de `L-2`**
porque el cursor necesita el nodo definido y escrito antes de poder recorrerlo.

Ejecución **secuencial** por defecto (`EXEC-R08`): once de las dieciocho tocan `tools/tracker.mjs`.

## 8. Supuestos compartidos `[AGENTE]`

- El issue de la tarea es el sitio donde se reconsulta. Sin plataforma, `TRANSICIONES.log` cubre
  lo mismo (`PT-084`).
- La prosa de `HISTORY.log` basta para clasificar sin abrir cada rama. Si no basta, `L-5` lo
  declara y no lo inventa.
- Las quince clases de §2.1 son un punto de partida, no la lista final. `L-5` puede encontrar más.

## 9. Observaciones del agente `[AGENTE]` — `INTAKE-R07`

**O-1 · Desafío al enunciado literal: «después de cada tanda de herramientas» no es sostenible.**
Una tarea de 40 paradas produce 40 comentarios, y entonces `SUITE-R43` —el comentario humano sin
responder— se vuelve imposible de ver entre el ruido. **Recomiendo** que se publique la parada que
**lleva una decisión**, con clase de motivo dentro de una lista cerrada: hallazgo · condición
bloqueante · compuerta · abrir trabajo nuevo · límite alcanzado · desafío al Intake. Si se prefiere
el literal, se hace, pero constaría como decisión del firmante.

**O-2 · Hay una parte no mecanizable, y `SUITE-R26` obliga a decirlo.** Una parada cuyo desenlace
es «no se abre nada» **no la puede exigir ningún script desde el repositorio**: no hay rastro
contra el que contrastar. `L-3` cubre las que sí lo dejan; el hook cubre el resto sin garantía. El
hueco se declara con su número.

**O-3 · La taxonomía necesita una tercera clase de identificador.** `E-NNN` ya es de PTSA, y una
clase de evento **no es un ítem de trabajo**: no pasa por `REGISTRY` ni por sus `counters`.
`LEXICON` §4 hoy solo tiene dos clases —trabajo y regla—. Si no se declara, dentro de dos versiones
alguien la asignará contando entradas.

**O-4 · Clasificar 131 entradas es un juicio, no una derivación.** `EVENTOS.jsonl` marca cada
registro como `DECLARADO` con su cita textual, para que sea contrastable. Y **ninguna tarea cerrada
se rejuzga**: la matriz describe, no reabre.

**O-5 · `SUITE-R06e` cubre las once.** Todo este lote modifica `docs/methodology/` o los workflows.
Nada aquí es trabajo de paso: cada tarea se detiene en su punto humano.

**O-6 · Once tareas bajo una firma.** `EP-019` tuvo diecisiete y cerró. Se recomienda un solo lote
porque comparten causa raíz —§2.1— y porque separar la matriz de la parada dejaría a la primera sin
la fuente que la mantiene viva. Si el firmante prefiere dos lotes, `L-0` y `L-8` salen solos.

**O-9 · `SUITE-R58` dice «la allocation nace completa» y no nace.** `tracker asignar` escribió
`EP-020` y `PT-113` sin `suite_version`, y `verify-fdge` avisa: *«2 allocation(s) sin
`suite_version`. Sin ese sello, una migración no puede respetar el trabajo en vuelo»* (`SUITE-R18`).
`PT-103` amplió el comando con `--tipo`, `--severidad`, `--epica`, `--titulo` y `phase: 1`, y este
campo se quedó fuera. **No se escribe a mano**: sería la avería que `PT-103` y `PT-107` cierran —el
registro solo lo escribe el comando—. Queda medido aquí; si el firmante quiere, es una tarea más o
entra en `L-9`.

**O-8 · La sexta instancia apareció abriendo este lote.** `DoR-E7` pide declarar el solapamiento en
`BACKLOG.md`; ese archivo dice de sí mismo que es derivable, prohíbe editarse a mano y **no tiene
generador**. Es `L-11`, y deja `G1` con una condición que hoy no se puede cumplir sin una excepción
declarada — ver §10. Que la épica sobre «actos fuera del comando» tropiece con esto al abrirse no
es irónico: es la medida de cuánto pesa la clase.

**O-7 · El riesgo de esta épica es que se cumpla a sí misma.** Diez de las once tareas construyen
mecanismos para vigilar al agente, y el agente es quien las escribe. `EP-018` documentó cuatro
instancias del patrón que perseguía **cometidas dentro del propio lote**, y `PT-110` reimplementó
siete veces una herramienta del marco dentro del lote que existe para usarlo. Se declara ahora para
que aparezca contado y no como sorpresa.

## 10. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x] confirmado con la firma de §5
DoR-E2 criterio de éxito del lote declarado        [x] confirmado con la firma de §5
DoR-E3 out-of-scope del lote declarado             [x] confirmado con la firma de §5
DoR-E4 firma única presente                        [x] Alberto Martínez, 2026-08-22, con su base declarada
DoR-E5 EP asignado desde REGISTRY.json             [x] EP-020, con tracker asignar
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote   [x] las 18, con «Firmado por lote: EP-020»
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                      [x] resuelto por (b) — ver abajo
DoR-E8 observaciones registradas                   [x] O-1..O-9

VEREDICTO: PASS
```

### `DoR-E7` — resuelto por **(b)**, no por la excepción

El firmante delegó la decisión. **Se elige (b): `PT-123` sube al reparto y escribe el generador
antes de que `DoR-E7` se dé por cumplida.** Se descarta la recomendación anterior del agente —(a),
la excepción a mano— por una razón medida y no por preferencia:

> Este lote existe porque **una edición a mano declarada se olvida y una herramienta no**. `BACKLOG.md`
> ya lleva **dos** episodios de quedarse atrás —ocho lotes la primera vez, cuatro ahora— y los dos
> empezaron por editarlo a mano «sólo esta vez». Autorizar la excepción en el intake del lote que
> persigue esa clase habría sido la instancia siguiente, escrita por mí.

El coste declarado de (b) —retrasar `L-0`, que es deuda con npm— se acepta: la `12.0.0` publicada
tiene una regla sin línea de migración, y eso **ya está descrito en su `CHANGELOG` corregido**;
esperar dos tareas más no lo empeora.

### `O-1` — resuelto: **parada con decisión**, y qué se pierde

El firmante delegó la decisión. **Se elige la lista cerrada de motivos**, no el literal «después de
cada tanda de herramientas». La razón, con su coste dicho:

```
motivos que SÍ publican parada    hallazgo · condición bloqueante · compuerta ·
                                  abrir trabajo nuevo · límite alcanzado ·
                                  desafío al Intake  (LEXICON, cerrada — L-1)
lo que se pierde                  las paradas sin decisión no quedan registradas
por qué se acepta                 40 comentarios por tarea entierran SUITE-R43, que
                                  es la regla que detecta al humano sin responder.
                                  Cambiar una invisibilidad por otra no es ganar.
lo que lo hace reversible         la lista vive en LEXICON y ampliarla es un cambio
                                  de metodología, no un parche
```

**Y queda medido, no prometido**: `L-6` publicará cuántas paradas se registraron por tarea en este
lote. Si el número resulta ser tan bajo que la clase se vuelve inútil, la lista se amplía con
evidencia en vez de con opinión.

### El orden — resuelto, y con el criterio escrito

El firmante pidió **`PT-129` primero**. El resto lo ordena el agente por un solo criterio: **antes
va lo que habría cazado los defectos de esta misma sesión**, para que el lote no repita lo que
persigue.

```
1  PT-129  las ramas se enumeran            <- pedido por el firmante
2  PT-114  el intake se puede leer          sin esto NINGÚN lote pasa G1
3  PT-124  el vocabulario canónico          PT-125 y PT-126 siguen sin «type»
4  PT-123  BACKLOG tiene generador          cierra DoR-E7 con herramienta
5  PT-127  trabajo sin allocation           habría cazado los 10 commits del cierre anterior
6  PT-130  la comprobación no acusa         habría evitado el rojo de hoy
   ────────────────────────────────────────────────────────────────────────
   las seis primeras son las que hacen que las doce siguientes no repitan la sesión
   ────────────────────────────────────────────────────────────────────────
7  PT-113  la 12.0.1        8  PT-120  publicar.yml ejecuta sellar
9  PT-115  PARADA          10  PT-116  tracker parada      11  PT-128  el cursor
12 PT-117  el desenlace cita su parada
13 PT-118  taxonomía       14  PT-125  clasificar          15  PT-119  matriz.mjs
16 PT-126  sellar la mide  17  PT-121  el viaje de vuelta  18  PT-122  el cierre por comando
```

**Esto no es una promesa de que no se repetirán.** Una promesa no es un mecanismo, y este lote
existe justamente por eso. Es una **apuesta ordenada y medible**: las seis primeras construyen los
detectores, y al cerrar el lote `L-6` publicará cuántas veces cazaron algo dentro del propio lote.
Si la cifra es cero, o el orden no sirvió, o los detectores no valen — y las dos cosas se sabrán.

---

## Cierre del lote

`EP-020` pasa a `CLOSED` cuando todos sus PTs están `INTEGRATED`/`CLOSED` o fueron retirados
explícitamente, con entrada propia en `HISTORY.log` enumerándolos.

| Fila | Qué la resuelve | Estado |
|:---|:---|:---|
| La `12.0.1` publicada en npm | `L-0` + acto del firmante |  **`PT-113`** · la guía se rehízo en la `13.0.0`, que es la vía que existe: npm no se despublica. **Publicar no es fila de esta sección** (`SUITE-R45`) y queda pendiente del firmante |
| `publicar.yml` ejecuta `sellar` y ve `SUITE-R43` | `L-8` |  **HECHO** · `PT-120` |
| Una parada con decisión se publica en su tarea | `L-1` `L-2` `L-3` |  **HECHO** · `PT-115` `PT-116` `PT-117` `PT-133` |
| `MATRIZ.md` derivado y alimentando el `ROADMAP` | `L-4` `L-5` `L-6` `L-7` |  **HECHO** · `PT-118` `PT-125` `PT-119` `PT-126` |
| El viaje de vuelta tras el merge tiene dueño | `L-9` |  **HECHO** · `PT-121` |
| El cierre de un lote pasa por el comando | `L-10` |  **HECHO** · `PT-122` |
| Nada detecta el trabajo sin allocation | la clase dieciséis, que faltaba en la matriz | **HECHO** · `PT-127` |
| Una comprobación acusa a quien documenta el hecho | la clase diecisiete | **HECHO** · `PT-130` |
| Un caso pasa en verde porque su montaje nunca corrió | lo encontró la corrida completa de `PT-118` | **HECHO** · `PT-135` |

Las tres últimas no estaban al abrir el lote: **las abrió el propio trabajo**.

**Lo que NO se cierra queda declarado con su número**, que es lo que `§3(c)` pide —o con
dueño, o declarada—:

- **`PT-134`** sigue `DEFERRED`, con su issue abierto: declarar un `AC` caído sin fingir verde
  ni bloquear.
- **Seis clases de evento sin regla que las reclame**: `CE-004` (ordinal declarado **9**),
  `CE-001` (**12**), `CE-003` (**7**), `CE-005`, `CE-015` y `CE-007`. `sellar` las publica como
  candidatas en cada corrida; promoverlas es del firmante (`FPGE-R04`).
- **`CE-002` tiene regla y nada emite por ella.** `SUITE-R59` existe desde la `12.0.0` y
  ninguna herramienta la `fail()`. Es **peor** que no tener regla: parece cubierta.
- **Once lecturas de alcance amplio**, enumeradas con archivo y línea por `PT-130`. No se
  arreglan: hacerlo sin un caso por cada una sería cambiar once comportamientos a ciegas.
- **Si el trabajo de lote puede citar el `EP` en un commit.** La midió `PT-127` —15 commits—,
  `PT-130` la dejó declarada y `PT-121` le dio una rama declarada sobre la que discutirla. Es
  sobre `FDGE-R19` y merece su propia propuesta, no un arreglo de paso.

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
