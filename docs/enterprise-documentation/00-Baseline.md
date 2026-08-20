# 00-Baseline

> Foundation `PHASE 1` · **2026-08-19** · suite `9.0.0` · segunda ejecución
> Sustituye al baseline del **2026-08-13** (suite `5.2.3`), preservado en
> [`docs/_archive/2026-08-18/`](../_archive/2026-08-18/docs/enterprise-documentation/00-Baseline.md).
> Copiado, no movido: hasta el ACK de `G0` no se pierde nada (`FND-R10`).

## Por qué hay una segunda ejecución

No por calendario. `EXEC-R14` declara restricción automática de compuertas cuando Foundation
tiene **más de 10 PTs de antigüedad**; `REGISTRY.foundation.pt_at_generation` es `0` y hoy hay
**62 tareas cerradas**. La condición lleva activa desde `PT-043` y se declaró ausente —el
`SESSION_LOG` de aquella sesión enumeró tres de las cinco condiciones—, y **ninguna herramienta
emite `EXEC-R14`**, así que nada lo contradijo.

Lo que sigue no es una revisión de estilo: **el código se ha duplicado** desde que se escribió
la documentación que lo describe.

## Inventario documental   `FND-R09`

| Espacio | Qué hay | Decisión |
|:---|:---|:---|
| `docs/methodology/` | **36** `.md` — el producto que se publica | `KEEP` |
| `docs/enterprise-documentation/` | 9 documentos + `README` + `inventory/` | `SUPERSEDE` — los reescribe esta ejecución |
| `docs/implementation/` | ledgers, índices, `LAYOUT`, **71** `self-review.md` | `KEEP` |
| Raíz | `CLAUDE.md` · `README.md` · `QA/README.md` · `PTSA/README.md` · `evidence/README.md` | `KEEP` |
| `docs/_archive/` | **no existía** — la instalación de 2026-08-13 no archivó nada | creado hoy |

**No hay documentación legada.** Este repositorio nació con el marco, así que no existe el caso
—wikis viejas, ADRs sueltos, notas— que `FND-R09` está pensado para resolver. Ningún archivo se
propone para `ARCHIVE` ni `DELETE`.

## Divergencias   `FND-R13`

### Las diez de 2026-08-13: las diez resueltas

| | Qué era | Estado hoy |
|:---|:---|:---|
| `D1` | `README` apuntaba a `C:/DevOps/claude/`, ruta inexistente | **RESUELTA** — no queda ninguna aparición |
| `D2` | `README` ordenaba **borrar** documentación, contra `FND-R11` | **RESUELTA** — hoy el `README` explica por qué se retiró y remite a `INSTALL.md` como única fuente |
| `D3` | Lista manual de artefactos que contradecía `INSTALL.md` `I3` | **RESUELTA** — sin rastro de `ESTADO_ACTUAL`, `audit-scope` ni `playwright.config` |
| `D4` `D5` | «105 casos» en `README`, «130» en CI, 179 reales | **RESUELTAS** — ninguna de las dos cifras se escribe ya a mano |
| `D6` | «No uses este repositorio como workspace» vs `SUITE-R41` | **RESUELTA** |
| `D7` | `CLAUDE.md` declaraba 2 herramientas de 15 | **RESUELTA** |
| `D8` | `G4` descrita sobre `desarrollo`, rama que nadie usa | **RESUELTA** en la documentación. Queda `origin/desarrollo` viva: es `TD-06`, acción humana (`SUITE-R06f`) |
| `D9` | Ni `verificacion.yml` ni `publicar.yml` corrían `revisar-secretos` | **RESUELTA** — los dos lo corren con `--historial` |
| `D10` | `verify-fdge --all` no corría contra los artefactos reales | **RESUELTA** en `verificacion.yml:86`. Ver `D15` |

### Las nuevas

| | Dónde | Afirma | Hace |
|:---|:---|:---|:---|
| **D11** | baseline anterior y [01-Platform-Overview:53](01-Platform-Overview.md#L53) | «34 documentos y 15 herramientas» | **36** documentos · 15 `.mjs` + `selftest.sh` |
| **D12** | [10-Technical-Debt `TD-02`](10-Technical-Debt.md) | `verify-fdge` **1 027** líneas · `selftest.sh` **1 110** · juntos el 39 % del código | **1 618** y **3 541**, el **45 %** de **11 454** líneas. `tools/` era 5 441: se ha **duplicado** |
| **D13** | [10-Technical-Debt `TD-03`](10-Technical-Debt.md) | «180 casos» de selftest | **697** contados como los contaba el baseline anterior (`chk`/`chkno`); **959** incluyendo `PL`/`PLNO`/`trlib` |
| **D14** | [06-Backend-Architecture:66](06-Backend-Architecture.md#L66) | `tracker` = «`REGISTRY.json` ↔ issues de GitHub», una línea de tabla | **17 acciones**: `espejo abrir cerrar notas pr estado pendiente siguiente checkpoint avanzar proyectar coste viabilidad sesion personas asignar rama`. `CORE.md` pone `tracker siguiente` **antes que las reglas**, así que el documento de arquitectura no describe el componente sobre el que corre hoy el marco |
| **D15** | [publicar.yml](../../.github/workflows/publicar.yml) vs [verificacion.yml](../../.github/workflows/verificacion.yml) | Las dos tuberías comprueban el paquete | `verificacion` corre **8** comprobaciones; `publicar` corre **5**. Al publicar **no** corren `verify:patrones`, `tracker espejo` ni **`verify-fdge --all`** — la que `FDGE-R34` llama precondición de `G4` |
| **D16** | [`plan-layout.mjs`](../methodology/tools/plan-layout.mjs) | Calcula el alcance del grafo (`FND-R28`) | Hoy sigue devolviendo `alcance: bin` — **1 archivo** — mientras `REGISTRY.graph.scope` es `bin, docs/methodology/tools` desde `PT-020`. Es la **segunda vía de `TD-01`**, la que quedó abierta: **cualquier instalación nueva nace con este defecto** |

### Divergencias entre reglas y su ejecución mecánica

| | Regla | Qué debería correr | Qué corre |
|:---|:---|:---|:---|
| **D17** | `EXEC-R14` — restricción automática de compuertas · `EXEC-R11` — hotfix vencido | Alguna comprobación que las emita | **Ninguna herramienta las emite.** `EXEC-R14` lleva en vigor desde `PT-043` sin que nada lo dijera |
| **D18** | `PHASE 8` paso 3 — «regenerar `BACKLOG` desde `REGISTRY` y `changes/`» · `SUITE-R35` — los índices espejan el registro | Un generador de `BACKLOG`, `DISCOVERY`, `ENRICHMENT`, `REFACTOR_SCOPE` | **No existe.** `verify-fdge` comprueba el espejo (3 divergencias vivas), `PHASE 8` ordena regenerar, y el `no hacer` del `HANDOFF` prohíbe editarlos a mano. **Las tres instrucciones no se pueden cumplir a la vez**, y por eso `BACKLOG` declara hoy `EP-015` abierta y `EP-016` `DEFERRED` cuando el registro dice las dos `CLOSED` |
| **D19** | `AC-03` y `AC-06` de `PT-065` — lo que la sesión deriva es de **su** persona, y una sesión ajena **se distingue** | `tracker sesion` | `SESSION.json` quedó **huérfano**: `PT-065` movió la escritura a `SESSION-<persona>.json` y dejó la lectura con `?? SESSION.json` ([tracker.mjs:1462](../methodology/tools/tracker.mjs#L1462)). Un usuario no declarado deriva **8 commits y 2 252 líneas ajenas, de una sesión cerrada, etiquetados `MEDIDO`**, y la misma persona aparece como dos sesiones simultáneas. Reproducido |
| **D20** | `LEX-R22` — ningún documento enuncia obligaciones: las **cita** por ID | `tools/regla.mjs`, la consulta derivada | Reporta mal **47 de 196** reglas ([regla.mjs:55](../methodology/tools/regla.mjs#L55)): **21** existentes las declara inexistentes —las 11 de severidad `CHECK`, entre ellas `FDGE-R34`, y las 10 `EXEC-*`— y **26** devuelven **el texto de otra regla** bajo la cabecera «definida en `RULES.md`». `verify-suite` pasa limpio |

## Áreas sin documentación

`docs/enterprise-documentation/` no describe nada de lo que entró en `EP-013`, `EP-014`,
`EP-015` ni `EP-016` — cuatro lotes y cuatro versiones `MAJOR`:

- la **continuidad de sesión** (`SESSION.json`, `CHECKPOINT.json`, `LEX-R26`, el handoff derivado)
- el **presupuesto y la viabilidad** (`MEDIDO`/`ESTIMADO`/`SIN EVALUAR`, `coste`, `viabilidad`)
- el **multiusuario** (personas, rangos de ID reservados, rama por usuario, `cauce/<usuario>`)
- la **topología de ramas** de `8.3.0` en adelante (`<type>/<usuario>/PT-NNN-slug`)

`05-UI-UX-Brief`, `07-Database-Architecture` y `08-API-Catalog` siguen legítimamente ausentes y
declarados en [README.md](README.md): no hay interfaz, ni base de datos, ni API.

## Desorden estructural del código   `FND-R16`

| Comprobación | Resultado |
|:---|:---|
| Código fuera de `src/` | **Sí, y es deliberado**: `bin/` y `docs/methodology/tools/` viajan dentro del paquete. Desviación declarada en `11-Conventions` |
| Módulos huérfanos | **Ninguno.** Las 16 herramientas están referenciadas; la menos citada, `version.mjs`, en 4 sitios |
| Módulos duplicados | Ninguno |
| Tests mezclados con el código | `selftest.sh` vive en `tools/`, con las herramientas que prueba. Coherente con que `tools/` viaje entero |
| Archivos desproporcionados | `selftest.sh` **3 541** · `tracker.mjs` **2 070** · `verify-fdge.mjs` **1 618**. Los tres solos son el **63 %** de `tools/` |
| Rutas que contradicen `11-Conventions` | `QA/` y `qa/` — **`TD-04` confirmada en este host**: `ls -d QA qa` resuelve al mismo directorio, que contiene solo `README.md`. `qa/tests/`, donde `verify-qa` busca, no existe |

## Propuesta de normalización — para `G0`

Ningún movimiento de archivos. Las cuatro propuestas son de **documentación y alcance**:

| # | Propuesta | Decisión | Motivo / destino real |
|:--|:---|:---|:---|
| 1 | `SUPERSEDE` de los 9 documentos de `enterprise-documentation` y el `inventory/`: reescribirlos en `PHASE 2`–`PHASE 5` contra la `9.0.0`. El paquete de 2026-08-13 se archiva completo en `docs/_archive/2026-08-18/` | **ACEPTADO** | Respuesta literal: «adelante, tienes mi VoBo para firmar todo lo necesario para que comiences ahora y no pares hasta terminar todas las tareas y el EP» |
| 2 | Tras la reescritura, `REGISTRY.foundation.pt_at_generation` pasa de `0` a **65** y `validated` se refirma. Es lo único que levanta `EXEC-R14` | **ACEPTADO** | Ídem. El valor se escribe **después** de reescribir, no antes: escribirlo antes sería fabricar el verde que `EXEC-R14` existe para impedir |
| 3 | `D16` (`plan-layout` calcula `bin`) se corrige **en la herramienta**, no en el registro: es la causa de que toda instalación nueva nazca con el grafo mal. Va a `EP-017`, no aquí — toca `docs/methodology/` (`SUITE-R06e`) | **ACEPTADO** | Ídem |
| 4 | `D17`–`D20` (`EXEC-R14`/`EXEC-R11` sin verificador · los índices sin generador · el huérfano de `SESSION.json` · `regla.mjs`) van a `EP-017`. Son defectos **del producto que se publica**, no del terreno | **ACEPTADO** | Ídem |

**Ninguna de las cuatro mueve código.** `FND-R17` es explícita: Foundation diagnostica y propone;
mover código es un `PT REFACTOR` con `Estructural: sí` y sus compuertas.

## Confianza de partida

| Área | Confianza | Por qué |
|:---|:---|:---|
| Estado mecánico | **ALTA** | `verify-suite` limpio · `core:check` sincronizado · `verify-fdge --all` sin errores sobre 59 PTs · espejo cuadra |
| Terreno | **ALTA** | `plan-layout` no propone nada y `LAYOUT.md` está firmado |
| Documentación de arquitectura | **BAJA** | Describe un sistema con la mitad de código del que hay, y no menciona cuatro lotes |
| Cobertura mecánica de reglas | **MEDIA, y MEDIDA** | 112/181 ejecutadas por una compuerta; 60 sin verificador (51 `HARD`). `TD-08`, contado, no estimado |
| Que el marco sirva a un proyecto ajeno | **SIN EVALUAR** | Es exactamente lo que `EP-017` existe para medir. Ningún dato de este repositorio lo responde |

## Compuerta **G0**   `FND-R10`

Ningún modo de ejecución automatiza esto. Para cada propuesta: **ACEPTADO**, **RECHAZADO** (con
motivo) o **MODIFICADO** (con el destino real).

`G0` **no estaba en la delegación** inicial de esta sesión, que cubría `G1`, `G2` y `G3`. Se paró
aquí y se pidió explícitamente. El firmante lo amplió el **2026-08-19**:

> «adelante, tienes mi VoBo para firmar todo lo necesario para que comiences ahora y no pares
> hasta terminar todas las tareas y el EP»

```
Revisado por:        Alberto Martínez  (firmado por delegación, SUITE-R27)
Fecha:               2026-08-19
El baseline y la propuesta de normalización reflejan lo que quiero: SÍ
```

**Lo que esta firma NO cubre**, porque el mismo firmante lo reservó en el primer mensaje de la
sesión —«`G4` y publicar son míos. No publiques la 9.0.0»— y no lo ha retirado:

- **`G4`** — el merge de `trabajo` a `main` (`SUITE-R06a`, `EXEC-R04`)
- **publicar la `9.0.0`** — condicionada además a que `EP-017` cierre

Las cuatro propuestas quedan `ACEPTADO`. Se ejecuta la reconciliación y se registra en
[`RECONCILIATION.log`](../implementation/RECONCILIATION.log).
