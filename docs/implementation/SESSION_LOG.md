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
