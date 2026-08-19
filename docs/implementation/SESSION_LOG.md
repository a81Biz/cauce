# SESSION_LOG — una entrada por sesión

Append-only (`SUITE-R09`).

---

## 2026-08-13 · [INSTALL SUITE]

| | |
|:---|:---|
| Último PT | ninguno — no hay PTs asignados |
| Modo de ejecución | `SUPERVISED` (`EXEC-R02`, declarado en `CLAUDE.md` y `REGISTRY.json`) |
| suite_version | 5.2.3 · coincide con la primera entrada de `CHANGELOG.md` (`SUITE-R40`) |
| PTs vivos | ninguno |
| Rama | `trabajo` |

**Comprobaciones**

- `CORE.md` presente y sincronizado con sus fuentes — `SUITE-R15`, `SUITE-R16`.
- Foundation por archivos del núcleo — **ausente** (`FND-R08`). `SUITE-R07` bloquea trabajo nuevo.
- Grafo — `FRESH`, alcance `bin`, generado hoy con `pt_at_generation: 0` (`FDGE-R43`).
- Migración pendiente — **no**. `verify-fdge` dirá que sí: compara contra su propia constante
  `5.2.0`, no contra el `CHANGELOG`. El desalineado es el verificador (`SUITE-R40`).
- Espejo de plataforma — 0 allocations vivas ↔ 0 issues abiertos (`SUITE-R35`).
- Secretos — 400 commits revisados, 7 hallazgos con excepción firmada, 0 sin firmar (`FND-R29`).

**Confianza de partida:** media. El terreno está enumerado y firmado, pero nada del sistema
está documentado todavía: lo que el repositorio hace se sabe leyendo el código, que es
exactamente lo que Foundation existe para cambiar.

---

## 2026-08-13 · [START FOUNDATION]

| | |
|:---|:---|
| Último PT | ninguno |
| Modo de ejecución | `SUPERVISED` |
| suite_version | 5.2.3 · alineada con el `CHANGELOG` y con `package.json` |
| PTs vivos | ninguno |
| Rama | `trabajo` |

**Fases ejecutadas**

- `PHASE 0` — terreno ya firmado en la instalación; Declaración de Valor redactada leyendo
  `README`, `package.json`, los workflows y las cabeceras de las 15 herramientas. Firmada.
- `PHASE 1` — `00-Baseline.md`: 37 documentos versionados inventariados, 0 `ARCHIVE`,
  0 `SUPERSEDE`, 0 `DELETE`. **8 divergencias** entre lo que la documentación afirmaba y lo que
  el código hace, dos de ellas contra reglas HARD del propio marco. **G0 firmada** con las 7
  normalizaciones, registradas en `RECONCILIATION.log`.
- `PHASE 2`–`PHASE 4` — `01-Platform-Overview` · `02-PRD` · `03-TRD` · `04-App-Flow` ·
  `06-Backend-Architecture` · `09-Security-Architecture` · `10-Technical-Debt` ·
  `11-Conventions` con 7 Hard Rules. Omitidos con motivo: `05`, `07` y `08`.
- `PHASE 5` — `inventory/` con seis archivos; `routes` y `endpoints` declarados no aplicables.
  Grafo ya generado en la instalación, `FRESH`.
- `PHASE 6` — paquete cerrado a la espera de `[FOUNDATION VALIDATED]`.

**Comprobaciones**

- `verify-fdge --all`: **sin errores**, 13 reglas en verde. `FND-R08` pasa: los cuatro archivos
  del núcleo existen. `FND-R24` pasa: Declaración de Valor firmada.
- `npm run verify`: en verde, incluidos los 180 casos del selftest.
- Efecto colateral de `N1` detectado y corregido en el mismo acto: al recortar el procedimiento
  duplicado del `README` de la raíz, `audit.mjs` perdió las únicas menciones de tres ledgers y
  reportó tres huecos que no lo eran. El instalador de referencia pasó a ser `INSTALL.md`.

**Confianza al cerrar:** MEDIA-ALTA. Sube a ALTA cuando el grafo cubra el código de verdad
(`TD-01`).

---

## 2026-08-13 · `FDGE PHASE 0` + `PHASE 1` — `EP-001` abierto en DRAFT

**Estado al abrir**

| | |
|:---|:---|
| suite_version | 5.2.3 · alineada con `CHANGELOG` y `package.json` — sin modo restringido |
| Modo | SUPERVISED · firmante Alberto Martínez · plataforma `github` |
| Foundation | `[FOUNDATION VALIDATED]` 2026-08-13 — `SUITE-R07` satisfecha |
| PTs vivos al abrir | ninguno · `allocations: []` · contadores a 0 |
| Grafo | FRESH, alcance `bin` |
| Rama | `trabajo` |

**Comprobaciones de `PHASE 0`**

`verify-fdge --all` sin errores (0 PT) · `verify-suite` sin errores · `CORE.md` y
`CORE-PTSA.md` sincronizados · `tracker espejo` 0 = 0.

**Origen del trabajo**

Sesión de análisis sobre si cauce 5.2.3 puede aplicarse al proyecto «Inteligencia de Mercados
Energéticos Mexicanos» (suite 4.12.0, 127 asignaciones, 2 vivas). El análisis midió tres cosas
y la tercera cambió la prioridad:

1. `verify-fdge` de 5.2.3 sobre ese proyecto produce 17 errores, 14 de ellos falsos.
2. `migrate.mjs` no tiene tramo `4.12 → 5.x`: sella la versión y nada más.
3. **`SUITE-R35` es HARD, tiene herramienta y ninguna compuerta la ejecuta** — detectado por
   el humano al preguntar por qué no había issues. De ahí, la medición completa:
   167 reglas · 134 HARD · 82 con verificador que una compuerta ejecuta · 9 cuyo verificador
   no lo ejecuta ninguna · 76 sin ninguno (63 HARD). `audit.mjs` informaba «sin huecos».

`FDGE-R48` obliga a una sola implementación abierta, y son dos objetivos distintos: este lote
toma el de hacer cumplible el marco; la migración del proyecto legado queda para el siguiente.

**`PHASE 1` — qué se escribió**

- `EP-001` · `PT-001` · `PT-002` · `PT-003` asignados desde `REGISTRY.json`
  (`SUITE-R08`, `LEX-R06`): contadores `EP` 0→1 y `PT` 0→3.
- `changes/EP-001-el-marco-se-hace-cumplir/intake.md` desde `EPIC-INTAKE.md`.
- Tres `intake.md` de tarea desde `TAREA.md`, cada uno con `Firmado por lote: EP-001`.
- `DISCOVERY.md`, `ENRICHMENT.md` y `REFACTOR_SCOPE.md` **creados**: la instalación no los
  sembró y `FDGE-R31` los exige en cuanto existe el primer PT. `verify-fdge` no lo había
  reportado porque con 0 PTs no llega a comprobarlo.
- `BACKLOG.md` con el solapamiento y el orden (`FDGE-R40`, `EXEC-R08`).
- Issues creados con `tracker abrir --aplicar` (`SUITE-R35`): `EP-001`→#2 · `PT-001`→#3 ·
  `PT-002`→#4 · `PT-003`→#5. Espejo 4 = 4.

**Desviaciones**

- Las etiquetas `implementación` y `tarea` que `tracker.mjs` usa **no existían** en el
  repositorio y `gh issue create` falla sin ellas. Se crearon antes de abrir los issues. La
  herramienta no declara esa precondición ni la crea: queda como observación para `PT-001`.

**Compuerta**

`G1` = **FAIL**. Faltan dos campos que solo declara una persona: la severidad de los tres PTs
(`INTAKE-R04`) y la firma única (`INTAKE-R06`), más la confirmación de las tres
transcripciones `[HUMANO]` del intake del lote. El lote permanece en `DRAFT`.

**Confianza al cerrar:** ALTA sobre el diagnóstico —los tres defectos están medidos con
comandos reproducibles—; la ejecución no ha empezado.

---

## 2026-08-13 · `G1` PASS · `PT-004` admitido · `PHASE 2` de `PT-004`

**Compuerta `G1` resuelta: PASS.** Las tres declaraciones que faltaban llegaron el mismo día:

- Severidad de las cuatro tareas (`INTAKE-R04`) — `PT-004` S2 · `PT-001` S2 · `PT-002` S3 ·
  `PT-003` S3. Declaradas por **delegación explícita**: «usa la severidad necesaria para que
  comiences en cada PT». Ninguna es `S1`: nada de esto es sistema caído y `S1` habilitaría
  `HOTFIX`, que no corresponde.
- **Firma única por delegación** (`INTAKE-R06`): «te autorizo a que firmes a mi nombre». El
  bloque lo escribió el agente y el intake lo dice — §4 lleva la constancia con la cita
  literal, el alcance y lo que la autorización NO cubre (`G2`, `G3`, `G4`).
- Confirmación de §1, §2 y §3.

**Hueco anotado, fuera de alcance:** el marco no sabe representar una firma delegada. O el
agente escribe el bloque como si lo hubiera escrito la persona, o se detiene. La convención
usada —firmar y adjuntar constancia— se inventó en esta sesión y no es una regla.

**`PT-004` admitido en el lote** por orden humana: «el bloqueo entra como cuarta tarea». No
estaba previsto; apareció al ejecutar `PHASE 1`. Pasa a ser el **primero** del orden por
dependencia de compuerta: mientras `verify-fdge` esté en rojo por un motivo ajeno a las
demás tareas, ninguna puede demostrar que la dejó verde.

Issue `PT-004` → #6. Espejo 5 = 5. Reanclaje (`FDGE-R52`) escrito como comentario en #2, #3,
#4, #5 y #6.

**`PHASE 2` de `PT-004`** — `context.md` y `discovery.md`.

Causa raíz determinada: `checkPT()` **calcula** la fase en `verify-fdge.mjs:757` y la usa solo
para `FDGE-R52`. Las dos comprobaciones de existencia de artefactos —`:792` `discovery.md`,
`:808` `traceability.md`— no la consultan. Que sea descuido y no decisión lo prueba el propio
código, que sí razona por fases para las **columnas** de la matriz (`:818`, `:820`).
`afterPhase6` infiere la fase de la existencia de `manifest.json`, patrón que no puede
funcionar para `traceability.md` porque el artefacto a inferir es el que se comprueba.

Confianzas: RootCause 95 % · Architecture 85 % · Solution 70 %. Ninguna bajo el 70 %: sigue
como `BUG` (`FDGE-R09`). El grafo tiene alcance `bin` y no cubre `tools/` (`TD-01`); se
sustituyó por enumeración directa de consumidores, exhaustiva sobre 15 herramientas sin
dependencias externas. Declarado en `context.md` (`FDGE-R08`).

**Tercer defecto del mismo tipo, encontrado ejecutando `PHASE 2`:**

```
✗ FDGE-R52   PT-004: está en PHASE 2 y su bitácora tiene 0 nota(s); faltan 1.
```

`CORE.md` manda escribir el reanclaje «**issue si hay plataforma** · `bitacora.md` si no». Se
escribió en el issue, que es lo correcto, y `verify-fdge` falló igual: solo busca
`bitacora.md`. Cumplir el procedimiento deja la compuerta roja; ponerla verde exige duplicar
el reanclaje, que es lo que `SUITE-R35` prohíbe. Recogido como `AC-07` de `PT-001`, con
`AC-08` para la desviación de las etiquetas de `gh`.

**Estado de la compuerta al cerrar la sesión**

`verify-fdge --all`: **5 errores**, ninguno por trabajo mal hecho —
3 son el defecto de `PT-004` sobre `PT-001`, `PT-002` y `PT-003`;
1 es el defecto de `PT-004` sobre sí mismo;
1 es el defecto nuevo de `FDGE-R52`.

`npm run verify`: en verde, 180 casos.

**No se fabricó ningún artefacto para poner el verificador en verde.** `traceability.md`,
`discovery.md` ajenos y `bitacora.md` siguen sin existir porque sus fases no han ocurrido.

**Siguiente:** `PHASE 3` de `PT-004`. Decisión abierta: de dónde sale la fase de un PT.

---

## 2026-08-13 · `PT-004` de `PHASE 3` a `PHASE 6` · detenido en `G3`

**`G2` aprobada por delegación** el 2026-08-13 —«adelante, firma a mi nombre»—, con
constancia en `design.md`. La autorización cubre además `SUITE-R06e` **para este PT y dentro
del alcance de `tasks.md`**: `verify-fdge.mjs` y `selftest.sh`. Fuera de ahí, no.

**`PHASE 3`** — la decisión que `PHASE 2` dejó abierta («de dónde sale la fase») **no era una
decisión**: la precedencia intake → registro ya está implementada en `verify-fdge.mjs:757` y
el fixture del arnés declara `phase` en sus cuatro allocations desde antes de este PT. Era una
lectura que faltaba. Confianza de solución 70 % → 90 %, con el motivo escrito.

Tres alternativas rechazadas con motivo: inferir la fase de los artefactos (circular para
`traceability.md`), derivarla del `status` (`LEX-R07`: son enumeraciones distintas), y hacer
`phase` obligatoria de golpe (pondría en rojo a todo proyecto instalado — el mismo daño en la
otra dirección).

**`PHASE 5`** — los 8 casos se escribieron **antes** del arreglo y fallaron 6 de 8; los 2 que
pasaban eran los inversos, que es lo esperado (`FDGE-R17`). Ambas salidas quedan como
evidencia. El arreglo: `faseDeclarada` distingue fase declarada de ausente, y una función
`exigible()` con tres salidas —error · aviso · `SIN EVALUAR`— que consultan `FDGE-R15` y
`FDGE-R42`. `fase` se conserva como `faseDeclarada ?? 0` para no alterar `FDGE-R52`, que está
fuera de alcance.

**Resultado medido**

| | Antes | Después |
|:---|:---|:---|
| `verify-fdge --all` | 4 errores | **1** |
| `selftest` | 180 casos | **188**, 0 fallos |

**El error que queda es el previsto en `strategy.md`:** `FDGE-R52` busca `bitacora.md` e
ignora la plataforma declarada. El reanclaje de `PT-004` está escrito en los comentarios del
issue #6, que es donde `CORE.md` manda ponerlo. Pertenece a `PT-001` (`AC-07`).

**No se escribió `bitacora.md` para poner la compuerta en verde.** Duplicaría el reanclaje en
dos sitios —lo que `SUITE-R35` prohíbe— y convertiría una evidencia en un adorno. `AC-06`
queda `PARCIAL`, con `verified: false` en el manifiesto, y se cierra con `PT-001`.

**Parada: `G3`.** `PT-004` es un `BUG` y pasa a `VALIDATION_PENDING`. Cerrar un BUG no lo
automatiza ningún modo de ejecución (`SUITE-R06b`, `FDGE-R26`, `EXEC-R05`, `LEX-R08`), y esa
parada **no la levanta ninguna delegación**: es la lista cerrada de acciones irreversibles, no
un campo de formulario.

**Siguiente:** `G3` humana sobre `PT-004`. Después, `PHASE 8` y `PT-001`.

---

## 2026-08-13 · `G3` de `PT-004` · `PHASE 8` · `G4` bloqueada por el defecto de `PT-001`

`G3` resuelta **en persona** por Alberto Martínez: `PT-004` a `DONE`. Es la única compuerta de
esta sesión que no se resolvió por delegación, y no por criterio del agente: cerrar un `BUG`
está en `SUITE-R06`, la lista cerrada que ningún modo de ejecución automatiza.

`PHASE 8`: entrada en `HISTORY.log` con las cuatro compuertas y quién resolvió cada una,
`Estructural: no`, índice a `DONE`, `REGISTRY` sellado con `validated_by`.

**`G4` queda BLOQUEADA, y por el motivo que el lote predijo.**

```
$ verify-fdge --gate G4 PT-004
✓ FDGE-R34   precondiciones de G4 satisfechas
✗ FDGE-R52   está en PHASE 8 y su bitácora tiene 0 notas; faltan 7
1 error(es). La compuerta G4 queda bloqueada.
```

`FDGE-R34` pasa: CI, `HISTORY.log`, manifiesto, self-review, trazabilidad y estado `DONE`,
todo correcto. Lo que bloquea es `FDGE-R52` buscando `bitacora.md` mientras el reanclaje está
donde `CORE.md` manda —los comentarios del issue #6—, que es el defecto recogido en `AC-07`
de `PT-001`.

El error **crece** con la fase: pedía 1 nota en `PHASE 2` y pide 7 en `PHASE 8`. Escribir esas
siete notas ahora pondría `G4` en verde y sería un falso verde de manual: siete entradas
redactadas de una vez para satisfacer un contador, duplicando un reanclaje que ya existe.

Confirma el orden decidido en `G1`: `PT-001` va inmediatamente después porque es lo que
desbloquea el merge de lo ya hecho.

**Siguiente:** `PT-001`, `PHASE 2`.

---

## 2026-08-13 · `PT-001` de `PHASE 3` a `PHASE 6` · detenido en `G3`

`G2` aprobada por delegación, con constancia en `design.md` y `SUITE-R06e` acotada a los seis
archivos de `tasks.md`.

**Decisión de diseño:** una sola herramienta habla con la plataforma. `tracker` separa el
adaptador de la lógica —la comparación del espejo es ahora función pura y exportada— y
`verify-fdge` le pregunta en vez de tener su propio cliente de GitHub.

**Decisión humana de `AC-05`**, del 2026-08-13: el espejo **bloquea** donde la credencial es
exigible (`npm run verify`, `push` a `main`, `G4`) y sale **`SIN EVALUAR`** donde no puede
estarlo (PR desde fork, máquina sin `gh auth login`). Código de salida `3`, antes fundido con
el `2` de «sin plataforma declarada», que es una decisión opuesta.

**Resultado medido**

| | Antes | Después |
|:---|:---|:---|
| `selftest` | 188 casos | **202**, 0 fallos |
| Espejo real | no se ejecutaba | 5 vivas = 5 issues, sin divergencias |
| `G4` de `PT-004` | sin comprobar el espejo | `✓ SUITE-R35 el espejo con github cuadra` |

**Tres defectos encontrados ejecutando, no leyendo**

1. El arnés se engañaba a sí mismo: pasaba la ruta del módulo como `argv[1]`, que es
   exactamente lo que el guard entiende por «me ejecutan directamente». Los 14 casos daban
   rojo por la razón equivocada.
2. `VIVOS` no incluía `DONE` ni `VALIDATION_PENDING`. Se vio al correr el espejo de verdad:
   `PT-004` pasó a `DONE` esperando `G4` y su issue quedó denunciado como huérfano. Un PT que
   espera el merge no es trabajo cerrado — le queda una compuerta humana.
3. `tracker notas PT-004 .` resolvía la ruta como el directorio «PT-004».

**Lo que la regla me pilló a mí**

`FDGE-R52` ahora lee el issue, y lo primero que hizo fue acusarme: `PT-001` tiene 1 nota para
`PHASE 4` y `PT-004` tiene 2 para `PHASE 8`. **Tiene razón.** Escribí comentarios consolidados
—«PHASE 2 → 6» en uno solo— en vez de una nota por transición. La regla existe contra eso:
reanclar al final no es reanclar, es resumir.

Escribir las notas que faltan ahora, de golpe y con fecha de hoy, sería el falso verde que
este lote existe para eliminar. **No se ha hecho.** Queda como error abierto y como decisión
humana.

**Parada: `G3`.** `PT-001` es un `BUG` y pasa a `VALIDATION_PENDING` (`SUITE-R06b`).

---

## 2026-08-13 · dos correcciones humanas sobre `PT-001`

**1 · La guarda de fork se retira.** Pregunta humana: «¿cuándo se hizo un fork?». Comprobado:
**cero forks**, y el único PR de la historia del repositorio salió de una rama propia. El
`if:` que escribí protegía un caso que aquí no ha ocurrido nunca y que no se puede probar
desde aquí — yo mismo lo había declarado «no verificado» en el self-review.

La 5.2.1 ya resolvió esto descartando enviar un `.claude/settings.json` con reglas `deny`:
«un control sin probar es el verde por omisión que este marco existe para cazar». Era lo
mismo, en CI. Cuando aparezca el primer PR desde un fork habrá un caso real contra el que
escribir, que es como se trata el adaptador de Azure.

**2 · El recorrido de reanclaje, rehecho.** De las tres opciones presentadas —excepción
firmada, rehacer el recorrido, revisar la regla— la decisión humana fue **rehacer el
recorrido**. Doce notas nuevas, una por transición, con lo que ocurrió realmente en cada una y
declarando cada una que se escribe retroactivamente. La fecha no se disimula.

Se descartó revisar la regla para que una nota de rango contara por varias: es la forma más
fácil de ablandar una regla justo cuando molesta, y la regla tenía razón.

**Y una corrección de rumbo.** `G4` no se toca hasta que el lote entero esté cerrado: mandar a
`main` es desplegar una versión, y la versión no está completa. El trabajo sigue en `trabajo`.

**Estado de las compuertas**

```
verify-fdge --all            Sin errores. PTs verificados: 4.
verify-fdge --gate G4 PT-004 Sin errores.        ← desbloqueada
npm run verify               verde · 202 casos · incluye ya verify:espejo
tracker espejo               5 vivas = 5 issues, sin divergencias
```

`PT-001` sigue en `VALIDATION_PENDING`, detenido en `G3`.

---

## 2026-08-13 · `PT-002` de `PHASE 3` a `PHASE 6` · detenido en `G3`

`G2` aprobada por delegación, con `SUITE-R06e` acotada a `audit.mjs` y `selftest.sh`.

**Decisión de diseño:** el conjunto de herramientas con compuerta **se deriva** de
`package.json`, los workflows y `bin/cauce.mjs`. Una lista escrita a mano se queda atrás el día
que se añada un paso a CI — la avería que este repositorio arrastra allí donde se copió un
hecho (`RULE-01`, `SUITE-R40`).

Tres estados por regla y no dos. La franja del medio —citada por una herramienta que ninguna
compuerta ejecuta— es donde vivió `SUITE-R35` durante tres versiones.

**Resultado medido**

```
antes    Cobertura completa: sin huecos.

ahora    ejecutadas por una compuerta   91 / 167   · HARD 69 / 134
         citadas sin compuerta que las corra   7
         sin verificador                69                 (HARD 59)

selftest  202 → 211 casos, 0 fallos
```

Las 7 de la franja del medio: `SUITE-R19` `FND-R21` `FND-R26` `FND-R28` `FDGE-R39` `QA-R10`
`FIDE-R04`. Todas de instalación o migración.

**Una regresión propia.** Cambiar la frase final rompió dos casos existentes que greppeaban
`sin huecos`. Se resolvió conservando el literal en minúscula, **no** reescribiendo los
asertos: cambiar el aserto para que encaje con la salida nueva es como se pierde la señal que
ese aserto daba.

**Y `FDGE-R52` volvió a avisar, esta vez a tiempo.** Al llegar a `PHASE 6` faltaban dos notas
de reanclaje y se escribieron en el momento, no al final. Es la diferencia con lo que pasó en
`PT-001` y `PT-004`.

**Límite declarado:** «citada» sigue siendo que el identificador aparezca en el texto de la
herramienta, así que **91 es un límite superior**. Afinarlo exigiría interpretar código.

**Parada: `G3`.** `PT-002` es un `BUG` y pasa a `VALIDATION_PENDING` (`SUITE-R06b`).

---

## 2026-08-13 · `EP-001` cerrado · versión `5.3.0` · a la espera de `G4`

`PT-003` cerrado en `CLOSED` tras `G3` humana. `EP-001` a `DONE` con su entrada propia en
`HISTORY.log` enumerando las cuatro tareas.

**Dos correcciones que hicieron las compuertas al cerrar:**

1. `FDGE-R52` volvió a cazar un reanclaje consolidado en `PT-002` —«PHASE 6 → PHASE 8» en un
   solo comentario—. Tercera vez, y la tercera con razón. Se escribieron separadas.
2. El espejo denunció el issue #5 abierto sin allocation viva: `PT-003` está `CLOSED`, que es
   terminal. `tracker cerrar --aplicar` lo cerró. Es la regla funcionando en la dirección que
   nadie mira.

**Versión decidida: `5.3.0`**, `MINOR` con guía de migración explícita. Ninguna regla cambia de
texto y se añade capacidad. El único cambio que puede poner en rojo algo que antes pasaba es el
espejo en `G4` para un proyecto que declare plataforma y nunca haya espejado — y ese requisito
lo declaró ya la 5.0.0; lo que faltaba era quien lo comprobara. La guía lo dice y da los tres
comandos que lo resuelven.

`TD-05` **resuelta**: la corrección de `SUITE-R40` entró en la misma entrada. Se decidió `MINOR`
y no el `PATCH` que recomendaba la deuda porque la entrada cubre además tres capacidades.

`version.mjs --aplicar` alineó los 21 documentos y `package.json`. `build-core` regeneró el
núcleo: 229 reglas, 69 % de reducción.

**Y el marco se aplicó su propia compuerta de migración.** Al subir el CHANGELOG, `SUITE-R17`
puso el repositorio en modo restringido por declarar 5.2.3 frente a la vigente 5.3.0.
`migrate --apply` selló el registro y `CLAUDE.md` se actualizó a mano, que es lo que la propia
herramienta lista como pendiente humano.

**Estado**

```
npm run verify        verde · 211 casos
verify-fdge --all     sin errores
tracker espejo        sin divergencias
package.json          5.3.0 = CHANGELOG
```

**Siguiente:** `G4`. El PR de `trabajo` → `main`, y el merge lo aprieta una persona
(`EXEC-R04`, `SUITE-R06a`). Después: `INTEGRATED` para los tres PT, `EP-001` a `CLOSED`, y
publicar con `publicar.yml`, que es manual y desde `main`.

---

## 2026-08-13 · `EP-002` cerrado · versión `6.0.0` · a la espera de `G4`

Tres tareas, todas con `G3` **automática** —ninguna es `BUG` y `verify-fdge` pasó (`EXEC-R06`)—
y `G1`/`G2` firmadas por delegación con constancia.

```
PT-006  CHORE    SUITE-R42 · el contrato vuelve a su regla
PT-007  FEATURE  el issue lleva la fase y la compuerta, derivadas
PT-008  FEATURE  SUITE-R43 · lo que una persona escribe se lee
```

**Lo que el lote entrega:** el tablero de GitHub responde «qué va cuándo» sin abrir el
repositorio, con la condición intacta de que el registro asigna y la plataforma espeja.

**Y lo que se aprendió:** las tres tareas encontraron algo que su análisis no había previsto —un
prompt desincronizado, una compuerta de acceso que dejaba `estado` inútil, y que agente y
humano comparten login—. **Las tres veces lo dijo una comprobación, no el agente.**

`AC-03` de `PT-008` se reformuló por eso: distinguir comentarios por autor es imposible cuando
el agente usa la credencial de la persona. Se midió antes de decidir.

**Versión `6.0.0`**, `MAJOR`: `SUITE-R42` y `SUITE-R43` son reglas vinculantes nuevas, que es el
criterio con el que la 5.0.0 subió. Las dos condicionadas a plataforma declarada. La `5.3.0` no
llegó a publicarse; su contenido va dentro y su entrada se conserva.

```
selftest              180 → 241 casos
audit                 92/169 reglas con verificador que una compuerta ejecuta
verify-fdge --all     sin errores
espejo                9 issues, sin divergencias
```

**Parada final: `G4` y la publicación.** Las dos son humanas. `SUITE-R06` es la lista cerrada
que ningún modo automatiza y `EXEC-R04` no admite excepción, así que la delegación de firma no
las cubre — y tomarlas dejaría al marco sin la única compuerta que protege lo irreversible.

---

## 2026-08-13 · `G4` resuelta · los dos lotes integrados · tres defectos abiertos

Merge del PR #7 por Alberto Martínez (`9ecb1d3`). GitGuardian se resolvió como falso positivo:
las tres marcas eran la misma cadena sintética de los fixtures, ya firmada.

Cierre posterior: siete PT a `INTEGRATED`, `EP-001` y `EP-002` a `CLOSED`, y
`tracker cerrar --aplicar` cerró los nueve issues. Espejo **0 = 0**.

**Tres defectos abiertos, todos en cómo `tracker` escribe en la plataforma.** Los dos primeros
los vio el humano mirando el tablero; el tercero lo cazó la regla que acabábamos de crear.

1. **El cuerpo de un issue de `EP` dice «sin implementación»** sobre la implementación misma.
   El generador usa un solo texto para tarea y lote, y un `EP` no tiene campo `epic`.
2. **El enlace al intake es relativo** y en el cuerpo de un issue de GitHub no resuelve: apunta
   a `github.com/a81Biz/cauce/changes/…`, que es un 404. Por eso al abrir el issue de `EP-002`
   no había «nada de EP-002»: lo único que había era un enlace roto.
3. **`tracker cerrar` comenta sin la marca de procedencia**, así que `SUITE-R43` toma su propio
   mensaje de cierre por un comentario humano. `verify-fdge --all` está en rojo por eso.

El tercero es la mejor prueba de la sesión de que la regla funciona: nació en `PT-008` y lo
primero que hizo fue cazar a la herramienta que la implementa, en la primera ejecución
posterior. Nadie lo buscó.

**No se han arreglado.** Los tres tocan `docs/methodology/` y no hay implementación abierta:
abrir trabajo nuevo exige un `EP` con su `G1` firmada, y la delegación de `EP-002` se declaró
acotada a ese lote.

---

## 2026-08-13 · `EP-003` · `PT-009` y `PT-010` en `VALIDATION_PENDING`

Las dos tareas del lote recorridas de `PHASE 1` a `PHASE 6`. **Ninguna `G3` automática**: son
`BUG` y `SUITE-R06b` no lo automatiza ningún modo — es la diferencia con `EP-002`.

```
selftest           241 → 251 casos
verify-fdge --all  sin errores (estaba en rojo al empezar)
```

**`PT-009`.** `tracker cerrar` comentaba sin marca, así que `SUITE-R43` tomaba su propio
mensaje de cierre por humano. El comentario ya publicado es inmutable: se **respondió** en vez
de excluirlo de la comprobación, y `TS-05` existe para que nadie relaje la regla más adelante.

En el self-review queda escrita una salida más cómoda que **no** se tomó: excluir los PT
`INTEGRATED` de `SUITE-R43`. Es defendible sobre el texto de la regla y quita rojos — por eso
no se hizo de paso.

**`PT-010`.** El cuerpo de un issue de `EP` decía «sin implementación» sobre la implementación
misma, y su enlace era relativo: un 404 desde un issue. Ahora distingue lote de tarea, enumera
las tareas del lote con su issue y enlaza con URL absoluta a la rama por defecto. Sin URL
derivable no se inventa.

**Un defecto propio, cazado por su caso:** `contextoCuerpo` leía `adaptador.repo` al cargar el
módulo, y `estado` corre **sin** adaptador — justo la acción que existe para funcionar sin
credencial. Reventaba, y lo dijo su caso.

**El límite que sigue ahí:** nada comprueba que un enlace resuelva. Haría falta red en una
compuerta. Es lo que dejó pasar el defecto original y sigue sin cubrirse.

---

## 2026-08-13 · `EP-003` cerrado · versión `6.0.1` · a la espera de `G4`

`G3` de `PT-009` y `PT-010` **resuelta por delegación**, ampliada ese mismo día por decisión
del firmante. Está registrada como Revisión 1 del intake del lote, con lo que cuesta escrito:
`G3` existe para que alguien mire la evidencia antes de dar un defecto por resuelto; firmada
por delegación lo que queda es que la evidencia **está escrita y es contrastable**, no que
alguien la haya leído.

`G4` y la publicación siguen sin delegar — el propio firmante se las reservó.

**Versión `6.0.1`**, `PATCH`: dos correcciones, ninguna regla nueva ni modificada.

```
selftest           241 → 251 casos
verify-fdge --all  sin errores (estaba en rojo al empezar el lote)
espejo             sin divergencias
package.json 6.0.1 = CHANGELOG = los 21 documentos
```

**Lo que este lote deja como aprendizaje:** los dos defectos vinieron de sitios distintos y
ninguno del análisis previo. Uno lo cazó una regla recién creada, sobre su propia herramienta.
El otro lo vio una persona mirando el tablero, y **ninguna comprobación lo habría encontrado** —
no hay nada que verifique que un enlace resuelve ni que un texto se contradice. El límite queda
escrito en el `CHANGELOG` y en la trazabilidad en vez de fingir que está cubierto.

---

## 2026-08-13 · `G4` de `EP-003` · `6.0.1` publicada · sesión cerrada

Merge del PR #16 por Alberto Martínez (`018e791`) y publicación en npm. Cierre posterior:
`PT-009` y `PT-010` a `INTEGRATED`, `EP-003` a `CLOSED`, sus tres issues cerrados. Espejo
**0 = 0**. `verify-fdge --all` sin errores.

**Publicación verificada desde fuera**, no desde el árbol de trabajo:

```
npx @a81biz/cauce@6.0.1 version   →  cauce 6.0.1
el tarball trae SUITE-R42 y SUITE-R43 en RULES.md
y cuerpoDeIssue / mensajeDeCierre en tracker.mjs
```

**Sobre «actualizar el paquete de cauce a 6.0.1» en este repositorio: no hay nada que
instalar.** Este repositorio **es** cauce (`SUITE-R41`), y tenerlo como dependencia de sí mismo
dejaría dos copias completas del marco que solo pueden divergir — está documentado como avería
desde la 5.2.3 y el propio instalador lo detecta. `package.json` no tiene dependencias y
declara 6.0.1, igual que el `CHANGELOG` y los 21 documentos.

**Lo que queda del objetivo con el que empezó la sesión.** Se abrió preguntando si cauce servía
para el proyecto «Inteligencia de Mercados Energéticos Mexicanos», que sigue en **4.12.0**. Ahí
sí hay paquete que instalar. Y el defecto que lo bloqueaba —`migrate.mjs` sin tramo
`4.12 → 5.x`— **sigue sin escribirse**: se apartó al out-of-scope de `EP-001` para no mezclar y
nunca volvió a abrirse.

Tres lotes, diez tareas y tres versiones después, el trabajo que originó la sesión está donde
estaba. Queda escrito aquí para que no se pierda.

---

## 2026-08-14 · PHASE 0 · Context — la primera entrada en tres lotes

Escrita porque **faltaba**. `PHASE 0` produce una entrada aquí y no se escribió ninguna durante
`EP-009`, `EP-010` ni `EP-011`: tres lotes, doce tareas, tres versiones. La última entrada de
arriba es de la `6.0.1`.

```
último PT integrado   PT-043 (EP-011, CLOSED) · main af79c6b
modo                  SUPERVISED · sin restricción automática (EXEC-R14): sin INC abierto,
                      sin hotfix con deuda vencida, sin migración pendiente
suite_version         7.6.0 · REGISTRY, CLAUDE.md, 21 documentos y package.json alineados
PTs vivos             11, todos DEFERRED. Ninguno en curso
Foundation            presente y validada · pt_at_generation 0, hoy 43 integrados ⇒ ANTIGUA
grafo                 STALE — scope «bin», generado con pt_at_generation 0, y PT-034 estructural
                      integrado desde entonces (FDGE-R43). Bloquea G2 en PTs MAJOR
CORE.md               presente y sincronizado (build-core --check)
espejo                11 allocations vivas y 11 issues abiertos: cuadra
confianza             MEDIA. Lo que la baja está enumerado abajo, no promediado
```

### Lo que esta lectura encontró de mi propio uso del marco

Cinco cosas, todas comprobadas contra el repositorio y ninguna recordada:

1. **`SESSION_LOG` sin entradas** durante tres lotes. `PHASE 0` la exige y `PHASE 0` no se
   ejecutó: se entró directo a `PHASE 1` en los doce PTs. Esta entrada es la corrección.
2. **`BACKLOG.md` lleva ocho lotes sin regenerar** (`PHASE 8` paso 3). Declara `EP-003` como
   implementación abierta, `PT-009` y `PT-010` en `DONE`, y «publicar `6.0.1`» como lo
   siguiente. Quien lo lea recibe un estado de tres versiones atrás.
3. **Ningún PT ha creado su rama.** `PHASE 5` paso 1 manda `git checkout -b <type>/PT-XXX-slug`
   y `PHASE 4` obliga a proponerla. Los 43 PTs de este repositorio se han implementado sobre
   `trabajo`, y el `CLAUDE.md` declara dos ramas y ninguna por tarea. **El marco y su propio uso
   se contradicen**, y nada lo detecta.
4. **El issue de una allocation `DEFERRED` enlaza a un directorio que no existe.** `SUITE-R44`
   la exime de tener artefactos, pero `cuerpoDeIssue` enlaza igual: `PT-015`, `PT-025`, `PT-044`,
   `PT-045` y `PT-046` apuntan a un 404. Es lo que `PT-036` existe para impedir.
5. **El grafo describe `bin`**, no el código del marco. `FND-R28` pide el código propio y las
   herramientas viven en `docs/methodology/tools/`. `FDGE-R43` se satisface sobre un grafo que no
   describe el sistema — ya estaba escrito como `TD-01`, y sigue.

Las tres primeras son mías, de esta sesión y de las dos anteriores. Las dos últimas son del
marco.

---

## 2026-08-15 · `EP-013` cerrado · 8.0.0 sellada

`PHASE 0` ejecutada al arrancar y **antes de cada transición de fase**, por instrucción explícita
del firmante: *«antes de cada transición de fase, ejecuta `tracker siguiente`. No de memoria»*.
Se cumplió en las ocho tareas; las desviaciones están dichas en el issue de cada una, no aquí.

**Lo que la sesión entregó:** las ocho tareas de `EP-013` en `DONE` e integradas en `trabajo`
(PRs #74–#82), las cuatro filas de cierre resueltas, `CHANGELOG` **8.0.0** con guía de migración,
los 21 documentos alineados y `CORE.md` regenerado. `selftest` **456 → 520**.

**Lo que la sesión aprendió, y no estaba en ninguna tarea:**

1. **Cuatro de los ocho hallazgos aparecieron ejecutando, no leyendo**, y dos de ellos mientras se
   trabajaba en otra cosa. `--gate G3` llevaba roto desde que existe el parámetro; lo encontró
   `PT-020` por curiosidad. `REFACTOR_SCOPE.md` tenía catorce filas pegadas en una línea desde la
   apertura de este mismo lote; apareció al leerlo para otra cosa.
2. **La ruta rota fue siempre la ruta indocumentada.** Tres compuertas de cuatro no se podían
   evaluar porque la cabecera solo enseñaba `--gate G4`. Lo que no se documenta no se usa, y lo
   que no se usa se pudre en silencio.
3. **Un índice escrito a mano diverge; solo hace falta tiempo.** `REFACTOR_SCOPE` corrupto,
   `BACKLOG` ocho lotes desactualizado. Los cuatro se derivan ahora del registro, y el `HANDOFF`
   lo prohíbe explícitamente.
4. **Medir antes de decidir cambió dos decisiones.** `PT-023` iba a escribir un verificador de
   `FDGE-R22`; la medida dio 75 % de falsos positivos y no se escribió. `PT-020` iba a dar por
   bueno el grafo; dos de sus tres expectativas fallaron y quedó dicho.

**Lo que cazó al agente, tres veces, y las tres quedan dichas:**

```
SUITE-R34   la CI en rojo por separar el estado del trabajo en dos commits (PT-020)
revento()   dos veces seguidas, el caso derivado que estrenaba esa misma funcion (PT-029)
FDGE-R52    la transicion PHASE 3 -> 4 escrita tarde, tres veces. La cuarta se
            publico ANTES de escribir los artefactos, y se dijo por que
```

Y un descuido propio sin regla que lo cace: se escribió un `intake.md` duplicado para `PT-023`
**sin comprobar antes si ya existía** —existía, firmado por el lote el día anterior—. Se retiró y
se usó el original. Nada lo habría detectado: el directorio con otro slug estaba a la vista.

**Dónde queda:** `G4` pendiente. Es del firmante y no se delega (`EXEC-R04`, `SUITE-R06a`).

## 2026-08-18 · sesion abierta en `0919eda`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 0919eda (2026-08-18)
             1 (MEDIDO) commits · 248 (MEDIDO) lineas
tareas       PT-060
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion abierta en `daa057e`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde daa057e (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde daa057e (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde daa057e (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion abierta en `daa057e`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `daa057e`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde daa057e (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde daa057e (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde daa057e (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion abierta en `daa057e`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `daa057e`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde daa057e (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde daa057e (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde daa057e (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 6 Evidencia
sobre        daa057e  chore/PT-060-la-sesion-es-el-worker-no-el-estado
sigue        PHASE 6 · Evidencia — cierra con: cada AC con su evidencia, o declarado no verificado. Luego PHASE 7 · Validación.
```

## 2026-08-18 · sesion abierta en `daa057e`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `33cf8f2`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 33cf8f2 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-060 · PHASE 10
sobre        33cf8f2  trabajo
sigue        PT-060 ya es INTEGRATED. Lo cerrado es evidencia, no estado (SUITE-R36).
```

## 2026-08-18 · `EP-015` cerrado · 8.2.0 sellada

**Lo que la sesión entregó:** las cinco tareas de `EP-015` integradas en `trabajo` (PRs #109–#113),
las cinco filas de cierre resueltas, `CHANGELOG` **8.2.0** con los 21 documentos alineados y
`CORE.md` regenerado. `selftest` **618 → 829**. Y `EP-013` y `EP-014` integradas en `main` al
principio de la sesión (PRs #93 y #108).

**Lo que la sesión aprendió, y no estaba en ninguna tarea:**

1. **Un enunciado del lote era imposible.** `PT-059` se pedía como «no comenzar lo que no quepa en
   el presupuesto disponible», y medirlo en `PHASE 2` mostró que ese presupuesto **no existe**: el
   total es el contexto del modelo. La tarea cambió de pregunta —mide **precedente**— en vez de
   fingir que la respondía.

2. **Dos señales obvias estaban mal, y las dos se descubrieron midiendo.** Atribuir commits por
   `--grep` daba `TRIVIAL` y `STANDARD` idénticos hasta la línea; y la señal con **mejor
   cobertura** —los artefactos de `changes/`— resultó la **peor predictora**, porque mide
   cumplimiento del procedimiento y no esfuerzo.

3. **El marco llevaba ocho lotes incumpliendo `LEX-R21`.** `SIN EVALUAR` en 50 sitios y cero en
   `LEXICON`. `verify-suite` comprueba vocabulario *derogado*, no vocabulario *usado sin declarar*:
   dos comprobaciones distintas, y sólo existía una.

4. **Las herramientas del marco encontraron cuatro cosas que se me pasaron.** `audit` vio bytes de
   control invisibles en el código y un artefacto que ningún instalador creaba; CI puso en rojo dos
   veces comprobaciones verdes en local. El patrón: **probar donde trabaja el agente y no donde se
   decide un merge**.

5. **Y dos patrones ya crónicos:** la detección de `ROOT` se tragó un argumento por **quinta** vez,
   y una aserción casó con la prosa de al lado por **séptima**. Los dos se arreglan por *forma* y
   los dos vuelven: el arnés comparte espacio de nombres con la prosa que lo describe.

**La medida de `EP-014`, cobrada:** `FDGE-R52` cazó tres reanclajes olvidados en `EP-014`. En
`EP-015`, sobre **40 transiciones**: **cero**. `tracker avanzar` se niega sin `--nota`.

**Dónde queda:** `G4` de `EP-015` con VoBo del firmante. Publicar **no** entra: no se pidió.

## 2026-08-18 · `8.2.0` PUBLICADA · `EP-015` cerrado del todo

Autorizado por Alberto Martínez: *«tienes mi VoBo para terminar y publicar correctamente lo
necesario»*. `G4` en `main` (PR #114, tag `v8.2.0`) y **publicada en npm**.

**El primer intento de publicar FALLÓ, y enseñó algo.** Cuatro casos de `tracker coste` en rojo
—los mismos que pasaban en `verificacion.yml`—. `publicar.yml` clonaba en **superficial** y esos
casos **derivan del historial** (`PT-057`): sin historia no encuentran nada. `verificacion.yml` ya
usaba `fetch-depth: 0` por otra razón, así que **el verde de uno no decía nada del otro**.

Es el mismo patrón que `EP-015` encontró tres veces —probar donde trabaja el agente y no donde se
decide— y esta es la cuarta, en el sitio más caro: la puerta de publicación. Corregido en PR #115
antes de republicar.

## 2026-08-18 · sesion abierta en `c5d6bd7`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde c5d6bd7 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-061 · PHASE 5 Implementación
sobre        c5d6bd7  chore/PT-061-quien-es-quien-la-identidad-se-declara-y-se-reconcilia
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde c5d6bd7 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-061 · PHASE 5 Implementación
sobre        c5d6bd7  chore/PT-061-quien-es-quien-la-identidad-se-declara-y-se-reconcilia
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde c5d6bd7 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-061 · PHASE 5 Implementación
sobre        c5d6bd7  chore/PT-061-quien-es-quien-la-identidad-se-declara-y-se-reconcilia
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `c5d6bd7`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `c5d6bd7`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde c5d6bd7 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-061 · PHASE 5 Implementación
sobre        c5d6bd7  chore/PT-061-quien-es-quien-la-identidad-se-declara-y-se-reconcilia
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde c5d6bd7 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-061 · PHASE 5 Implementación
sobre        c5d6bd7  chore/PT-061-quien-es-quien-la-identidad-se-declara-y-se-reconcilia
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde c5d6bd7 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-061 · PHASE 5 Implementación
sobre        c5d6bd7  chore/PT-061-quien-es-quien-la-identidad-se-declara-y-se-reconcilia
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `c5d6bd7`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `d61a241`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde d61a241 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-062 · PHASE 5 Implementación
sobre        d61a241  chore/PT-062-los-ids-se-reparten-por-rangos-reservados
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde d61a241 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-062 · PHASE 5 Implementación
sobre        d61a241  chore/PT-062-los-ids-se-reparten-por-rangos-reservados
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde d61a241 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-062 · PHASE 5 Implementación
sobre        d61a241  chore/PT-062-los-ids-se-reparten-por-rangos-reservados
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `d61a241`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `d61a241`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde d61a241 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-062 · PHASE 5 Implementación
sobre        d61a241  chore/PT-062-los-ids-se-reparten-por-rangos-reservados
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde d61a241 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-062 · PHASE 5 Implementación
sobre        d61a241  chore/PT-062-los-ids-se-reparten-por-rangos-reservados
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde d61a241 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-062 · PHASE 5 Implementación
sobre        d61a241  chore/PT-062-los-ids-se-reparten-por-rangos-reservados
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `d61a241`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `d61a241`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde d61a241 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-062 · PHASE 5 Implementación
sobre        d61a241  chore/PT-062-los-ids-se-reparten-por-rangos-reservados
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde d61a241 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-062 · PHASE 5 Implementación
sobre        d61a241  chore/PT-062-los-ids-se-reparten-por-rangos-reservados
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde d61a241 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-062 · PHASE 5 Implementación
sobre        d61a241  chore/PT-062-los-ids-se-reparten-por-rangos-reservados
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `d61a241`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `e4c8cb1`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde e4c8cb1 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-063 · PHASE 5 Implementación
sobre        e4c8cb1  chore/PT-063-el-usuario-vive-en-la-rama-de-tarea
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde e4c8cb1 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-063 · PHASE 5 Implementación
sobre        e4c8cb1  chore/PT-063-el-usuario-vive-en-la-rama-de-tarea
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde e4c8cb1 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-063 · PHASE 5 Implementación
sobre        e4c8cb1  chore/PT-063-el-usuario-vive-en-la-rama-de-tarea
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `e4c8cb1`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `e4c8cb1`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde e4c8cb1 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-063 · PHASE 5 Implementación
sobre        e4c8cb1  chore/PT-063-el-usuario-vive-en-la-rama-de-tarea
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde e4c8cb1 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-063 · PHASE 5 Implementación
sobre        e4c8cb1  chore/PT-063-el-usuario-vive-en-la-rama-de-tarea
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde e4c8cb1 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-063 · PHASE 5 Implementación
sobre        e4c8cb1  chore/PT-063-el-usuario-vive-en-la-rama-de-tarea
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `e4c8cb1`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `e4c8cb1`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde e4c8cb1 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-063 · PHASE 5 Implementación
sobre        e4c8cb1  chore/PT-063-el-usuario-vive-en-la-rama-de-tarea
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde e4c8cb1 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-063 · PHASE 5 Implementación
sobre        e4c8cb1  chore/PT-063-el-usuario-vive-en-la-rama-de-tarea
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde e4c8cb1 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-063 · PHASE 5 Implementación
sobre        e4c8cb1  chore/PT-063-el-usuario-vive-en-la-rama-de-tarea
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `e4c8cb1`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `37392ac`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `37392ac`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `37392ac`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `37392ac`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `37392ac`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `37392ac`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `37392ac`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 37392ac (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 5 Implementación
sobre        37392ac  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `37392ac`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `6c0bc18`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 6c0bc18 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 9 Integración
sobre        57abee6  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 9 · Integración — cierra con: G4 · HUMANA sin excepción (EXEC-R04, SUITE-R06a). Luego PHASE 10 · Cierre.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 6c0bc18 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 9 Integración
sobre        57abee6  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 9 · Integración — cierra con: G4 · HUMANA sin excepción (EXEC-R04, SUITE-R06a). Luego PHASE 10 · Cierre.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 6c0bc18 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-064 · PHASE 9 Integración
sobre        57abee6  chore/alberto-martinez/PT-064-de-quien-es-cada-commit
sigue        PHASE 9 · Integración — cierra con: G4 · HUMANA sin excepción (EXEC-R04, SUITE-R06a). Luego PHASE 10 · Cierre.
```

## 2026-08-18 · sesion abierta en `6c0bc18`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion cerrada

<!-- cauce:agente -->  Handoff DERIVADO del checkpoint y de la sesion:

```
sesion       desde 258be16 (2026-08-18)
             0 (MEDIDO) commits · 0 (MEDIDO) lineas
en curso     PT-065 · PHASE 5 Implementación
sobre        258be16  chore/alberto-martinez/PT-065-la-sesion-es-de-alguien
sigue        PHASE 5 · Implementación — cierra con: los casos en verde y la comprobación inversa en rojo. Luego PHASE 6 · Evidencia.
```

## 2026-08-18 · sesion abierta en `258be16`

<!-- cauce:agente -->  Marca de inicio. Lo que la sesion mueva se DERIVA de aqui en adelante.

## 2026-08-18 · `EP-016` cerrado · 9.0.0 sellada

Autorizado por Alberto Martínez: *«cerrar completamente la épica y comenzar con la EP-016 sin parar
hasta terminar»*. Cinco tareas integradas (PRs #121–#125), las cinco filas de cierre resueltas y
`CHANGELOG` **9.0.0** con **guía de migración** — obligatoria por ser `MAJOR`.

**Lo que la sesión entregó, en total:** tres lotes cerrados —`EP-014`, `EP-015` y `EP-016`—, dos
publicaciones (`8.2.0` en npm) y `selftest` **618 → 977**.

**Lo que la sesión aprendió, y no estaba en ninguna tarea:**

1. **Dos enunciados de tarea eran imposibles o falsos, y medirlos lo mostró.** `PT-059` pedía
   comparar contra un presupuesto que **no existe**; `PT-063` se declaró como el cambio que rompe
   compatibilidad y resultó que **el formato de rama no se comprobaba**. Las dos veces, `PHASE 2`
   evitó construir sobre una suposición.

2. **La identidad no es un campo.** En un repositorio de **una** persona había **tres**
   identidades. El desorden no viene de trabajar con más gente: viene de cambiar de máquina.

3. **`SUITE-R08` era una afirmación sin mecanismo.** Decía que el registro asigna y **nadie**
   asignaba: lo hacía quien editaba el archivo, durante 65 tareas.

4. **El patrón «probar donde trabajo, no donde se decide» apareció OCHO veces** en tres lotes. CI y
   `audit` encontraron lo que a mí se me pasó: bytes de control invisibles, credenciales que en el
   runner no existen, `detached HEAD`, y un caso que dependía de `git config` de la máquina.

5. **Y la detección de `ROOT` se tragó siete argumentos distintos.** Ya no es una lista incompleta:
   es que un posicional y el valor de una opción son indistinguibles por forma si la opción no se
   declara.

**Dónde queda:** `G4` de `EP-016` con VoBo del firmante. **No se ha publicado la 9.0.0**: la
autorización de publicar era para «lo necesario» y se usó en la 8.2.0.

