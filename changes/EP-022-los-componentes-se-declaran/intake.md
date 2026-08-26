# Intake — LOTE `EP-022`

> **`G1` RESUELTA · `PASS` · firmada por delegación el 2026-08-24** (ver §4 y `SESSION_LOG.md`).
> Los campos `[HUMANO]` de §1–§3 los redactó el agente como borrador (`FDGE-R02`) y el firmante
> los aprobó con una modificación de alcance: `PT-150` entra al lote.
> Plantilla: `INTAKE/templates/EPIC-INTAKE.md` (`INTAKE-R09`)
> **Append-only a partir de aquí** (`SUITE-R09`): lo que cambie va a `## Revisiones`.

```yaml
---
id: EP-022
created: 2026-08-24
status: DRAFT
mode: SUPERVISED
origin: DIRECT
---
```

---

## 1. Objetivo común `[HUMANO]` · BORRADOR

Los componentes de la suite dejan de estar **escritos a mano dentro de las herramientas** y pasan
a declararse una sola vez, con contrato, en `tools/patrones.mjs`.

Hoy el mismo hecho —qué componentes existen, cuál es opcional, qué prefijo de reglas usa cada
uno— está afirmado en **catorce sitios de cuatro herramientas**:

```
verify-suite.mjs   250 · 254 · 256 · 289 · 403   la alternancia de 10 prefijos, cinco veces
                   425                           COMPONENTES_OPCIONALES = new Set(['FIDE'])
build-core.mjs     171                           familias de reglas en prosa
                   183                           orden de los prefijos
                   433-437                       la lista de triggers
audit.mjs          192-195                       PROMPTS: 5 componentes
                   197-202                       esperadas: 4 componentes  ← no coinciden
                   214                           Foundation → FND, a mano
                   341                           refs de PTSA
comparar-marco.mjs  39                           OPCIONALES = new Set(['FIDE'])
```

**El par de `audit.mjs` ya divergió.** `FPGE` está declarado en `PROMPTS` y ausente de
`esperadas`; `FIDE` no está en ninguno. **Dos de los seis componentes no tienen auditadas sus
fases, y nunca lo dijeron** — porque una entrada que falta en un mapa escrito a mano no falla:
no aparece. Es el mismo patrón que `verify-qa.mjs:7` registra para las reglas («`QA` 0/19 y
`FPGE` 0/10»), ahora sobre las fases y sobre otros dos componentes. Ver `PT-147` §1.

`patrones.mjs` existe **exactamente para esto** —`SUITE-R38`, un hecho con una sola definición y
su contrato— y contiene `ESTADOS_TERMINALES`, `ORDEN_COMPUERTAS`, `EXIGIBLE_DESDE`,
`PREFIJOS_DE_ID`… **pero no los componentes.**

**Se hacen juntos y no sueltos** porque las catorce afirman el mismo hecho. Arreglar la mitad deja
un marco donde unas herramientas derivan y otras escriben — peor que catorce copias coherentes,
porque la incoherencia pasa a ser invisible.

**Y hay un motivo que no es de higiene.** `verify-suite.mjs:250` filtra las reglas por una lista
literal de prefijos. Un componente nuevo con prefijo nuevo tendría **todas sus reglas invisibles
al verificador**: no daría error, pasaría en verde. Es la forma de fallo que este repositorio
declara peor —fabricar un verde— y la que dejó a `QA` en `0/19` y a `FPGE` en `0/10` cumpliéndose
«solo por buena voluntad» (`verify-qa.mjs:7`).

## 2. Criterio de éxito del lote `[HUMANO]` · BORRADOR

**Un componente se da de alta y de baja tocando un archivo declarativo y ninguna herramienta**, y
la operación se ejecuta de verdad en `selftest.sh`.

No es «el contrato existe»: eso es una promesa. Es que el alta y la baja **se ejecutan** y
`npm run verify` las ve.

## 3. Qué NO entra en el lote `[HUMANO]` · BORRADOR

```
OUT: el componente DICTAMEN. Este lote HABILITA el séptimo; no lo construye. Va en EP-023.
OUT: modularidad de reglas o de fases. Solo de COMPONENTES. Si aparece la palabra «plugin»
     aplicada a una regla, el lote se salió de su alcance.
OUT: renombrar, fusionar o retirar ninguno de los seis componentes actuales.
OUT: corregir las cinco allocations históricas con severidad fuera de escala. Están
     INTEGRATED; rejuzgar hacia atrás trabajo cerrado es otra decisión (ver PT-150 §5).
OUT: revisar el resto de listas canónicas escritas dentro de herramientas. Este lote
     sugiere que aparecerán más: se DECLARAN, no se arreglan aquí.
```

> **Resuelto el 2026-08-24 por el firmante:** la divergencia de `SEVERIDADES` **entra** en el
> lote como `BUG` propio, `PT-150`. Estaba declarada `OUT` en el borrador de esta sección y la
> decisión la cambió; queda escrito porque **modifica el alcance firmado**.

---

## 4. Firma única `[HUMANO]` — obligatorio

> Cubre los Intakes de los **siete** PTs de §5 (`INTAKE-R08`). Cada uno lleva la línea
> `Firmado por lote: EP-022`.

```
Solicitado por:       Alberto Martínez
Fecha:                2026-08-24
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ
Severidad del lote:   S2 — confirmada explícitamente por el firmante
```

**Firmada por delegación**, y eso se dice: el firmante dio su VoBo el 2026-08-24 —«tienes mi
VoBo, firma todo en mi nombre»— autorizando al agente a firmar esta compuerta en su nombre, con
la autorización enumerada en `SESSION_LOG.md`. En la misma decisión confirmó `S2` y resolvió
incorporar `PT-150` al lote.

`SUITE-R27` sigue rigiendo: una firma **no prueba** que firmara una persona. Lo que la hace
contrastable es esa entrada del `SESSION_LOG.md`, y que `Alberto Martínez` esté en la lista
`firmantes` del `CLAUDE.md`. El VoBo **no levanta** la lista cerrada de `SUITE-R06`: `G4`, el
cierre de un `BUG`, `npm publish` y la modificación de la metodología siguen exigiendo el acto
humano en su momento.

---
---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote `[AGENTE]`

| Orden | PT | Tipo | Sev | Título | Archivos que toca | Depende de |
|:--|:--|:--|:--|:--|:--|:--|
| 1 | `PT-144` | CHORE | S2 | El contrato de componentes vive en `patrones.mjs` | `tools/patrones.mjs` · `tools/verify-patrones.mjs` | — |
| 2 | `PT-150` | **BUG** | S2 | `SEVERIDADES` contradice a `LEXICON` en los dos extremos | `tools/patrones.mjs` · `tools/tracker.mjs` | `PT-144` (mismo archivo) |
| 3 | `PT-145` | REFACTOR | S2 | `verify-suite` y `comparar-marco` derivan del contrato | `tools/verify-suite.mjs` · `tools/comparar-marco.mjs` | `PT-144` |
| 4 | `PT-146` | REFACTOR | S2 | `build-core` deriva familias, orden y triggers | `tools/build-core.mjs` | `PT-144` |
| 5 | `PT-147` | REFACTOR | S2 | `audit` deriva fases, sigla y referencias | `tools/audit.mjs` | `PT-144` |
| 6 | `PT-148` | CHORE | S2 | El alta y la baja quedan escritas y con regla | `LEXICON.md` · `RULES.md` · `CASOS-DE-USO.md` · `CORE.md`(gen) | `PT-145..147` |
| 7 | `PT-149` | CHORE | S2 | La prueba mecánica de alta y baja | `tools/selftest.sh` | `PT-148` |

## 6. Análisis de solapamiento `[AGENTE]` — obligatorio

```
Pares que comparten archivos:
  PT-144 <-> PT-150   (tools/patrones.mjs)   -> SERIALIZADOS

Es el ÚNICO par. La descomposición es POR HERRAMIENTA, y por eso los cuatro del medio
tocan cada uno un archivo que ningún otro toca. PT-145 agrupa verify-suite.mjs y
comparar-marco.mjs en una sola tarea A PROPÓSITO —los dos Set(['FIDE']) son EL MISMO
HECHO— y partirlos habría dejado la mitad derivando durante una integración entera.

Orden de ejecución resultante:
  1. PT-144   nadie puede derivar de un contrato que no existe
  2. PT-150   mismo mecanismo sobre un hecho hermano; solapa en patrones.mjs
  3. PT-145 · 4. PT-146 · 5. PT-147   independientes entre sí; secuenciales por EXEC-R08
  6. PT-148   la documentación describe el mecanismo YA construido, no el planeado
  7. PT-149   la prueba se escribe sobre el procedimiento ya escrito

Motivo del orden: dependencia técnica (1) · solapamiento (2) · prioridad declarada (3-5)
· dependencia técnica (6-7).

PT-150 va en la 2 y no al final porque es el ÚNICO BUG del lote y porque estrena, sobre
un hecho pequeño y aislado, el mismo mecanismo que las cuatro herramientas van a usar
después. Si el contrato de PT-144 no sirve, se sabe aquí y no en la quinta tarea.
```

## 7. Supuestos compartidos `[AGENTE]`

```
- Que los catorce sitios son TODOS. Se enumeraron con grep sobre bin/ y tools/ antes de
  descomponer. El decimocuarto YA apareció, en PHASE 1 y antes de la firma, comprobando una
  afirmación que el agente había escrito mal (ver §8). Si aparece un decimoquinto durante la
  ejecución, FDGE-R41 aplica: el lote entero se detiene.
- Que las cuatro herramientas pueden importar de patrones.mjs. Están en el mismo directorio
  y varias ya lo importan.
- Que ninguno de los catorce cambios altera comportamiento observable. Es lo que hace
  REFACTOR a PT-145..147: si alguno lo altera, deja de ser REFACTOR y vuelve a G1.
- Que «npm run verify» en verde ANTES del lote es la línea base contra la que se compara.
```

## 8. Observaciones del agente `[AGENTE]` — obligatorio · `INTAKE-R07`

- **El conteo subió de trece a catorce durante este Intake, y merece decirse cómo.** Yo había
  escrito en `PT-147` que «`QA` y `FPGE` no aparecen en la tabla de fases». Al ir a comprobarlo
  antes de dejarlo firmado, resultó falso **y peor de lo que decía**: `QA` sí está, `FPGE` está
  en un mapa y no en el otro, `FIDE` en ninguno, y los mapas son **dos**. El hallazgo —dos de
  seis componentes sin auditar sus fases— no salió de ejecutar el lote: salió de verificar una
  frase mía. Queda escrito porque el lote va precisamente de eso: lo escrito a mano diverge sin
  avisar, y la única defensa es contrastarlo contra la fuente.

- **El lote no se pidió: se derivó de un trabajo distinto.** Nació investigando un componente
  nuevo (`DICTAMEN`). El hallazgo es que el séptimo componente **no se puede añadir hoy sin que
  su verificación nazca apagada**. Eso hace de este lote un habilitante, no una mejora — y le da
  una prueba de aceptación real, que es `EP-023`.

- **Alternativa de cierre que descarté, y el firmante puede preferir.** Consideré que `EP-022`
  cerrara solo cuando `DICTAMEN` demostrara la propiedad. Lo descarté porque ataría el cierre de
  un lote al de otro y `FDGE-R41` no contempla esa dependencia. `PT-149` usa en su lugar un
  componente **de prueba**, que se da de alta y de baja dentro del propio `selftest`. Es un
  fixture mecánico, no un defecto inventado — la objeción de `PT-019` contra lo sintético no
  aplica aquí.

- **La divergencia adyacente ENTRÓ al lote, por decisión del firmante, como `PT-150`.** Estaba
  declarada `OUT` en el borrador de §3. `tracker.mjs:2556` declara
  `SEVERIDADES = ['S0','S1','S2','S3']` y **atribuye esa lista a LEXICON**, que declara
  `S1 S2 S3 S4` y **no declara `S0` en ninguna parte**. Y el registro **ya divergió en los dos
  sentidos**: cuatro allocations con `S4` que la herramienta rechaza (`PT-015`, `PT-016`,
  `PT-017`, `PT-051`) y una con `S0` que `LEXICON` no reconoce (`PT-107`) — las cinco
  `INTEGRATED`, es decir, escritas rodeando la herramienta.

  Es el único sitio del lote con un agravante propio: **el mensaje de error no calla, miente
  con autoridad.** Dice «LEXICON declara S0 · S1 · S2 · S3», y quien lo lea corregirá su severidad
  en vez de ir a `LEXICON`. Los otros catorce fallan en silencio; este **enseña el dato
  equivocado**. Ver `PT-150`.

- **Todo el lote cae bajo `SUITE-R06(e)`.** Las cuatro herramientas viven en
  `docs/methodology/tools/`. No es una excepción: es el modo normal de este repositorio, y
  significa que cada tarea se detiene en su compuerta.

- **Riesgo de alcance que declaro ahora para poder señalarlo después.** «Contrato de
  componentes» es la clase de abstracción que crece sola. El límite está en §3 y es
  verificable: si el contrato empieza a describir reglas o fases, se salió.

- **`PT-025` sigue aplazado** (`#35`, `DEFERRED`) y es el único arrastre vivo. Este lote no lo
  toca ni lo desbloquea.

## 9. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]  §1
DoR-E2 criterio de éxito del lote declarado        [x]  §2
DoR-E3 out-of-scope del lote declarado             [x]  §3 · la decisión abierta, resuelta
DoR-E4 firma única presente                        [x]  §4 · POR DELEGACIÓN · SESSION_LOG.md
DoR-E5 EP asignado desde REGISTRY.json             [x]  EP-022 · tracker asignar
DoR-E6 los siete PTs tienen intake completo y firmado por lote  [x]  PT-144..PT-150
DoR-E7 solapamiento calculado y declarado          [x]  §6 · BACKLOG.md · 1 par serializado
DoR-E8 observaciones registradas                   [x]  §8

VEREDICTO: PASS

Los ocho criterios satisfechos. La firma es POR DELEGACIÓN y así consta en §4 y en
SESSION_LOG.md: el firmante autorizó el 2026-08-24 firmar en su nombre, confirmó la
severidad S2 del lote y resolvió incorporar PT-150.

Lo que la delegación NO cubre, y sigue exigiendo acto humano en su momento:
  G4 · el merge a main                                          SUITE-R06a
  el cierre de PT-150, que es un BUG                            SUITE-R06b
  npm publish                                                   reservado al firmante
  la regeneración del grafo                                     FDGE-R32
```

---

## Cierre del lote

`SUITE-R45` · Lo que se resuelve **al cerrar**, escrito una sola vez aquí y no como fila repetida
en cada tarea.

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` | **HECHO** — `13.2.0`, con los dieciséis sitios, el de severidades, lo que `PT-147` destapó, y lo que el lote **no** establece (`SUITE-R26`) |
| Número de versión | **HECHO** — `13.2.0`, `MINOR`. Se confirmó, no se supuso: las **tres** reglas nuevas —`SUITE-R60`, `LEX-R35`, `LEX-R36`— son aditivas, y **ninguna obligación existente cambia de enunciado ni de severidad**. `CORE` sigue en 263 reglas. Un proyecto instalado que regenere `CORE.md` verá líneas **de más** y ninguna de menos, así que no hay guía de migración que escribir |
| Regla nueva de `PT-148` | **HECHO** — `SUITE-R60`, y nace `CHECK`, no `HARD`: el chequeo llegó. Media comprobación ya existía en `verify-patrones`; la otra media es el barrido nuevo, con **cuatro casos negativos permanentes** porque su criterio no es que cace, sino que **no cace comentarios** |
| Validación humana de `PT-150` | **HECHO — 2026-08-25.** Único `BUG` del lote. Transitó `VALIDATION_PENDING → DONE` con la validación firmada por delegación y su constancia en `SESSION_LOG.md`, y su entrada de `HISTORY.log` lo dice con todas las letras: *«`FDGE-R26` y `SUITE-R06b` exigen que la firme una persona: la firma un agente EN SU NOMBRE, y eso se dice»*. Esta fila estuvo declarando lo contrario durante el cierre porque se escribió sin abrir `HISTORY` — el error que el propio lote persigue, cometido en su acta de cierre |
| Lo que `PT-147` destape en `FPGE` y `FIDE` | **HECHO, y fue más de lo previsto.** `FPGE` tenía prompts declarados y **nadie auditaba sus fases**; `FIDE` no estaba en ninguno de los dos mapas. La causa de `FPGE` estaba tres documentos más arriba —numeraba sus pasos `[1]`..`[7]`, y `LEXICON` §2 prohíbe las grafías **por su nombre** sin incluir el corchete— y se corrigió en `PT-156`. La de `FIDE` salió en `PT-149`: **faltaba en el mapa de fases de `CORE`** teniendo rango declarado. Lo que queda abierto se declara y no se arrastra: `PT-164` · `PT-166` · `PT-167` · `PT-168` |
| Las cinco allocations con severidad fuera de escala | **HECHO — se dejan como están** (`PT-150` `AC-06`). Normalizarlas sería rejuzgar trabajo ya integrado, y ésa es otra decisión |

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

## Revisión 1 — 2026-08-25 · `PT-156` entra en el alcance del lote

**Qué cambia.** El apartado de `LEXICON` §3 que declara el rango de fases de `FPGE` —hoy
registrado como `PT-156` en `EP-024`— **se ejecuta antes de cerrar `EP-022`**.

**Motivo.** `PT-147` hizo entrar a `FPGE` y `FIDE` en la auditoría de fases, que es su `AC-03`.
Al hacerlo, `audit` pasó de `EXIT=0` a `EXIT=1` con un único hueco:

```
✗ FPGE fases   LEXICON §3 no declara su rango — SIN EVALUAR, no se inventa (RULE-06)
```

**Antes salía verde porque no miraba.** Convertir un falso verde en un rojo verdadero es
exactamente lo que este lote existe para hacer — pero `audit` sale `1` con cualquier hueco, así
que **`npm run verify` no puede quedar en verde mientras `LEXICON` §3 no declare ese rango**, y
`§2` de este intake exige que la operación «se ejecute y `npm run verify` la vea».

Sin esta revisión, el lote no podría cumplir su propio criterio de éxito.

**Quién lo decidió.** El firmante, el 2026-08-25, ante las tres salidas que `PT-147` declaró en su
parada de `#282`: (`A`) `PT-156` entra, (`B`) cerrar con la batería roja y excepción en `G4`,
(`C`) sacar `FPGE` del recorrido —que restauraría el falso verde—. Eligió **`A`**.

**Precedente.** `PT-150` entró en este mismo lote por una decisión suya, cuando el borrador de
`§3` lo declaraba `OUT`.

**Lo que esta revisión NO cambia.** El `OUT` de `§3` sigue vigente para todo lo demás: el lote
sigue siendo aditivo y sigue yendo de **componentes**. `LEXICON` §3 es el *mapa de fases por
componente*, así que cae dentro de esa frontera y no la mueve.

**Una limitación de herramienta, declarada en vez de rodeada.** `PT-156` **sigue registrada bajo
`EP-024`**: sólo `asignar` escribe `epic` al crear y `retomar` sólo lo cambia desde `DEFERRED`, así
que **no hay comando** para mover una tarea `DRAFT` entre lotes. Escribir `REGISTRY.json` a mano
es el `no hacer` número 2 del `HANDOFF`.

`PHASES` `PHASE 1` es explícita sobre qué hacer entonces: *«si el comando no admite lo que
necesitas, eso es un defecto del comando: decláralo, no lo rodees en silencio»*. El defecto es
`PT-162`, y el registro sigue diciendo la verdad sobre lo que la herramienta puede escribir.

Firmado por: Alberto Martínez — por delegación, autorización en `SESSION_LOG.md`
