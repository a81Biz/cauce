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
