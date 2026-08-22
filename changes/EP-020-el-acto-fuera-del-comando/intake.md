# Intake — LOTE `EP-020` · el acto fuera del comando

```yaml
---
id: EP-020
created: 2026-08-22
status: DRAFT
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

### 2.1 Las quince clases, y cuáles no tienen dueño

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

**Seis clases sin regla y sin verificador.** Las cuatro `CERRADA` siguieron todas el mismo camino
—**contar** → regla en `RULES.md` → verificador que bloquea— y `SUITE-R59` es el caso puro: 27
fallos vivían en comentarios de cinco archivos, se contaron **una vez**, y dejó de ocurrir.

### 2.2 El cierre de `EP-019`, medido sobre sí mismo

El lote se declaró cerrado **cuatro veces en tres sesiones**, y ninguna completa:

```
1  el commit del registro          se quedó en la rama de tarea
2  los 17 comentarios de cierre    escritos con «gh issue comment», sin MARCA_AGENTE
                                   -> 17 SUITE-R43 fantasma, y un tag AFIRMADO que no existía
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
- **(c)** Las seis clases sin dueño de §2.1: o con dueño, o **declaradas** con su número. Ninguna
  callada.

---

## 4. Qué NO entra en el lote `[HUMANO]`

```
OUT: reescribir o reclasificar entradas ya escritas de HISTORY.log — es append-only (SUITE-R09)
OUT: publicar la conversación literal. La nota es la explicación, no el transcript
OUT: automatizar nada de la lista cerrada de SUITE-R06
OUT: los candidatos R-001..R-008 del ROADMAP vigente — siguen en DRAFT donde están
OUT: coordinación de varios agentes a la vez — sigue siendo hueco declarado
OUT: arreglar las quince clases. Se cierran las que este lote nombra; el resto queda MEDIDO
```

---

## 5. Firma única `[HUMANO]` — obligatorio

Cubre los Intakes de **todos** los PTs listados en §6 (`INTAKE-R08`). El agente **no puede**
escribir este bloque (`INTAKE-R06`).

```
Solicitado por:
Fecha:
He leído el Intake de cada PT listado en §6 y confirmo que todos reflejan mi intención: SÍ
```

---

---

# A partir de aquí lo completa el agente

## 6. PTs que componen el lote `[AGENTE]`

| # | PT | Tipo | Sev | Qué cierra | Archivos | Depende |
|:--|:--|:--|:--|:---|:---|:--|
| `L-0` | `PT-113` | BUG | S2 | **La `12.0.1`**: la guía de migración que la `12.0.0` publicó incompleta — `SUITE-R59` en `RULES` y en `CORE`, y cero veces en su `CHANGELOG` | `CHANGELOG.md` · los 21 documentos · `CORE.md` · `package.json` · `REGISTRY.json` | — |
| `L-1` | | FEATURE | S1 | **`PARADA` entra al vocabulario y a las reglas.** `LEXICON`: qué es, sus clases de `motivo` y de `desenlace`, dónde vive. `RULES`: `FDGE-R55`. `FDGE-R52` pasa a ser su caso particular | `LEXICON.md` `RULES.md` `CORE.md` | `L-0` |
| `L-2` | | FEATURE | S1 | **`tracker parada`** — el comando que la escribe. Texto largo desde archivo (`SUITE-R59`), `MARCA_AGENTE`, orden por reversibilidad. Destino: issue si hay plataforma, `TRANSICIONES.log` si no | `tools/tracker.mjs` `selftest.sh` | `L-1` |
| `L-3` | | FEATURE | S1 | **Que no dependa de que el agente se acuerde.** Todo desenlace con rastro en el registro cita su parada: `asignar --desde-parada`, exigido por `verify-fdge` desde su `RIGE_DESDE`. Segunda red: hook `Stop` | `tools/verify-fdge.mjs` `tools/tracker.mjs` `.claude/settings.json` | `L-2` |
| `L-4` | | FEATURE | S1 | **La taxonomía de clases de evento** en `LEXICON` (`LEX-R29`), cerrada, con las quince de §2.1 como semilla. Necesita **tercera clase de identificador**: no es ítem de trabajo, no pasa por `REGISTRY` | `LEXICON.md` `CORE.md` | `L-1` |
| `L-5` | | INVESTIGATION | S1 | **Clasificar las 131 entradas cerradas** → `docs/implementation/EVENTOS.jsonl`, append-only, un registro por evento **con su cita textual** y marcado `DECLARADO`. No produce código (`FDGE-R10`) | `EVENTOS.jsonl` | `L-4` |
| `L-6` | | FEATURE | S1 | **`tools/matriz.mjs` deriva `MATRIZ.md`**: clase · veces · primera/última · tareas · regla dueña · ¿verificador? · estado. Las cifras se derivan (`PT-091`); lo ilegible sale `SIN EVALUAR` | `tools/matriz.mjs` `MATRIZ.md` `package.json` | `L-5` |
| `L-7` | | CHORE | S2 | **Que no envejezca.** `sellar` la mide y la publica junto a las otras cuatro (patrón de `PT-110`); toda entrada nueva de `HISTORY.log` declara su clase; `FPGE` lee `MATRIZ.md` y toda clase ≥ 3 sin verificador entra como candidato | `tools/tracker.mjs` `FPGE-Implementation.md` `PHASES.md` | `L-6` |
| `L-8` | | BUG | S1 | **`publicar.yml` no ejecuta `sellar`**, y ni él ni `verificacion.yml` pasan `GH_TOKEN` a `verify-fdge --all`: 108 de 108 `SUITE-R43` salieron `SIN EVALUAR` y el paso cerró en verde, en el workflow que autoriza lo único irreversible | `.github/workflows/*.yml` | `L-0` |
| `L-9` | | BUG | S1 | **El viaje de vuelta tras el merge no lo cubre nada**: ningún comando escribe `DONE → INTEGRATED` en el YAML, `FDGE-R19` no define forma de rama para cerrar un lote, y ninguna fase lleva el estado terminal a la rama por defecto | `tools/tracker.mjs` `RULES.md` `PHASES.md` | `L-1` |
| `L-10` | | BUG | S2 | **El cierre de un lote pasa por el comando.** El comentario de cierre lo escribe `tracker` con `MARCA_AGENTE`; los 17 ya escritos no se editan (`SUITE-R09`), se referencian | `tools/tracker.mjs` | `L-2` |
| `L-11` | | BUG | S1 | **`BACKLOG.md` dice que es derivable y nada lo deriva.** Su cabecera declara «regenerable desde `REGISTRY.json`», el bloque `no hacer` prohíbe editarlo a mano, `tracker indices` cubre `DISCOVERY`, `ENRICHMENT` y `REFACTOR_SCOPE` — **y a él no**. Lleva **cuatro lotes** declarando `EP-015` como la implementación abierta | `tools/tracker.mjs` `BACKLOG.md` | `L-2` |

Los `PT-NNN` de `L-1` a `L-11` los asigna `tracker asignar` al empezar cada uno (`SUITE-R08`).
`L-0` ya está asignado porque desbloquea publicar.

**`L-11` apareció abriendo este lote**, intentando cumplir `DoR-E7`. Es la instancia número **seis**
de «existe la herramienta y nada la echa en falta» —aquí ni siquiera existe— y la segunda vez que
`BACKLOG.md` se queda atrás: su propia cabecera registra que ya «llevó ocho lotes sin regenerarse».

## 7. Análisis de solapamiento `[AGENTE]` — `FDGE-R40`

```
L-1 ↔ L-4 ↔ L-9                LEXICON.md · RULES.md · CORE.md   -> SERIALIZADOS
L-2 ↔ L-3 ↔ L-7 ↔ L-9 ↔ L-10   tools/tracker.mjs                 -> SERIALIZADOS
L-0 ↔ L-8                      ninguno: L-8 toca workflows, L-0 documentos

Orden: L-0 -> L-8 -> L-1 -> L-2 -> L-3 -> L-4 -> L-5 -> L-6 -> L-7 -> L-9 -> L-10

Motivo: L-0 primero porque desbloquea publicar la 12.0.1, que es deuda con npm.
        L-8 segundo porque es la compuerta que dejó salir a L-0: arreglarla antes de
        volver a publicar es lo que impide repetirlo. Secuencial (EXEC-R08).
```

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
DoR-E1 objetivo común declarado                    [~] borrador del agente · falta confirmación
DoR-E2 criterio de éxito del lote declarado        [~] borrador del agente · falta confirmación
DoR-E3 out-of-scope del lote declarado             [~] borrador del agente · falta confirmación
DoR-E4 firma única presente                        [ ] FALTA — solo del firmante (INTAKE-R06)
DoR-E5 EP asignado desde REGISTRY.json             [x] EP-020, con tracker asignar
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote   [ ] solo L-0
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                      [!] BLOQUEADA · ver abajo
DoR-E8 observaciones registradas                   [x] O-1..O-8

VEREDICTO: FAIL
Motivo: falta la firma del bloque §5 y la confirmación de §1, §3 y §4. Sin firma el lote no
        avanza, y el agente no puede escribirla.
```

**`DoR-E7` no se puede cumplir hoy, y no se finge que sí.** El solapamiento **está** calculado
—§7— pero declararlo exige escribir `BACKLOG.md`, y ese archivo **no tiene generador**: su cabecera
dice que se deriva del registro, el bloque `no hacer` prohíbe editarlo a mano, y `tracker indices`
no lo cubre. Es `L-11`.

Salidas, y la decisión es del firmante:

```
a) Autorizar la excepción: se escribe a mano SOLO el bloque de EP-020, con esta línea
   como constancia, y L-11 lo deja generado antes de cerrar el lote.
b) Mover L-11 al principio del orden: se escribe el generador primero y DoR-E7 se cumple
   con la herramienta. Retrasa L-0, que es deuda con npm.

Recomendación del agente: (a). El coste de (b) es publicar más tarde una corrección que ya
está escrita, y el de (a) es una edición a mano declarada que L-11 borra.

Autorizado por:
Fecha:
```

---

## Cierre del lote

`EP-020` pasa a `CLOSED` cuando todos sus PTs están `INTEGRATED`/`CLOSED` o fueron retirados
explícitamente, con entrada propia en `HISTORY.log` enumerándolos.

| Fila | Qué la resuelve | Estado |
|:---|:---|:---|
| La `12.0.1` publicada en npm | `L-0` + acto del firmante | |
| `publicar.yml` ejecuta `sellar` y ve `SUITE-R43` | `L-8` | |
| Una parada con decisión se publica en su tarea | `L-1` `L-2` `L-3` | |
| `MATRIZ.md` derivado y alimentando el `ROADMAP` | `L-4` `L-5` `L-6` `L-7` | |
| El viaje de vuelta tras el merge tiene dueño | `L-9` | |
| El cierre de un lote pasa por el comando | `L-10` | |

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
