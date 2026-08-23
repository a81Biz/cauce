# FDGE-Implementation — Materialización del framework en un repositorio

> **Naturaleza: procedimental.** Define artefactos, estructura de carpetas, workflow de git y
> el detalle de cada fase. Las reglas se citan por ID; viven en [RULES.md](RULES.md).
>
> Método: [Framework-FDGE.md](Framework-FDGE.md) · Vocabulario: [LEXICON.md](LEXICON.md)
> Compuertas: [EXECUTION-MODES.md](EXECUTION-MODES.md) · Prompts: [FDGE-Prompts.md](FDGE-Prompts.md)
> Admisión: [INTAKE/Intake-Protocol.md](INTAKE/Intake-Protocol.md)
>
> Suite version: **13.0.0**

---

# 1. Supuestos

* El agente actual no estará en la próxima sesión.
* La memoria conversacional es temporal.
* Toda decisión importante debe persistirse.
* Todo cambio debe ser justificable y toda implementación verificable.
* Ningún bug se cierra sin validación externa.
* El punto más barato para detectar un error es antes de implementar — y el más barato de
  todos es antes de analizar.

---

# 2. Estructura de carpetas

```text
docs/
├── implementation/
│   │
│   │   ── LEDGERS GLOBALES ──────────────────────────────────
│   ├── REGISTRY.json          asignador único de IDs  · counters + append
│   ├── HISTORY.log            un registro por PT       · append-only
│   ├── INCIDENTS.log          un registro por INC-NNN  · append-only
│   ├── SESSION_LOG.md         una entrada por sesión   · append-only
│   ├── HANDOFF.md             estado actual            · sobrescribible (modo merge)
│   ├── BACKLOG.md             PTs vivos y su fase      · regenerable
│   │
│   │   ── ÍNDICES (para que FPGE lea sin abrir cada PT) ──────
│   ├── DISCOVERY.md           índice de BUG / INVESTIGATION  · append-only
│   ├── ENRICHMENT.md          índice de FEATURE              · append-only
│   ├── REFACTOR_SCOPE.md      índice de REFACTOR / CHORE     · append-only
│   │
│   │   ── FPGE ──────────────────────────────────────────────
│   ├── ROADMAP.md
│   ├── ROADMAP_HISTORY.log
│   │
│   └── evidence/
│       └── PT-XXX/
│           ├── manifest.json      obligatorio · AC → evidencia real
│           ├── self-review.md
│           ├── tests/ · logs/ · api/ · screenshots/ · reports/
│
└── enterprise-documentation/      (Foundation — solo lectura para FDGE)

changes/
├── PT-XXX-slug/                   TODO el estado de trabajo del PT vive aquí
│   ├── intake.md                  PHASE 1 · firmado por el humano · append-only
│   ├── context.md                 PHASE 2 · análisis arquitectónico
│   ├── discovery.md               PHASE 2-B   (uno de los tres,
│   ├── enrichment.md              PHASE 2-E    según el tipo)
│   ├── scope.md                   PHASE 2-R
│   ├── strategy.md                PHASE 3
│   ├── design.md                  PHASE 4
│   ├── tasks.md                   PHASE 4
│   ├── spec-changes.md            PHASE 4
│   ├── test-scenarios.md          PHASE 4
│   ├── out-of-scope.md            PHASE 4
│   └── traceability.md            PHASE 4→6 · AC → TS → test → evidencia → caso QA
│
└── EP-XXX-slug/
    └── intake.md                  declaración y firma del lote
```

`FDGE-R39` y `LEX-R13` · **Ninguna ruta global es sobrescribible por un PT.** Los archivos v3
`PLAN_ACTUAL.md`, `PENDING_TASKS.md` y `CONTEXT_ANALYSIS.md` quedan derogados como archivos
globales y su contenido se mueve a `strategy.md`, `tasks.md` y `context.md` dentro del
directorio del PT. Era la única forma de que dos PTs pudieran estar en vuelo a la vez.

---

# 3. `REGISTRY.json` — el asignador único

`SUITE-R08`, `LEX-R06` · Todo identificador se obtiene de aquí. Derivarlo contando entradas
en `HISTORY.log` o en `qa-score-history.json` está prohibido: es frágil, no es concurrente y
en el caso de `QR-NNN` se desalineaba al primer ciclo delta.

```json
{
  "suite_version": "5.2.0",
  "execution_mode": "SUPERVISED",
  "counters": {
    "PT": 42, "EP": 3, "QA": 87, "QR": 5, "QD": 12,
    "H": 21, "E": 64, "P": 9, "R": 30, "INC": 1
  },
  "allocations": [
    {
      "id": "PT-042",
      "type": "FEATURE",
      "severity": "S3",
      "slug": "pdf-export",
      "created": "2026-08-05",
      "epic": "EP-003",
      "status": "IN_PROGRESS",
      "phase": 5
    }
  ]
}
```

Asignar es una sola operación: leer `counters`, incrementar, escribir, y añadir la entrada a
`allocations`. Si el agente no puede escribir el archivo, no puede asignar el ID: se detiene
y reporta.

---

# 4. Las fases

## PHASE 0 — Context

**Objetivo:** reconstruir el estado sin depender de la memoria del agente (`SUITE-R03`).

**Lee, en este orden:**
1. `docs/enterprise-documentation/README.md` — índice y fecha del paquete Foundation
2. `docs/implementation/BACKLOG.md` — PTs vivos y su fase
3. `docs/implementation/HANDOFF.md` — estado actual
4. `docs/implementation/HISTORY.log` — los 3 PTs más recientes
5. `docs/implementation/INCIDENTS.log` — incidentes abiertos
6. `docs/implementation/REGISTRY.json` — versión de suite y modo de ejecución
7. `changes/` — Proposal Packages en vuelo
8. `graphify-out/` — grafo de dependencias, si existe

**Comprobaciones obligatorias:**

```
Foundation presente     FND-R08 · verifica ARCHIVOS del núcleo, no la carpeta
Foundation vigente      > 10 PTs desde la última ejecución → confianza BAJA
Versión de suite        REGISTRY.suite_version vs CHANGELOG.md      SUITE-R13
Modo de ejecución       ¿aplica el descenso automático a MANUAL?    EXEC-R14
Hotfix vencido          ¿hay documentación retroactiva pendiente?   EXEC-R11
```

**Escribe:** una entrada en `SESSION_LOG.md` (append-only).

**No modifica nada más. No diseña. No planifica.**

---

## PHASE 1 — Intake · Compuerta **G1**

**Objetivo:** que exista una intención humana declarada antes de gastar nada.

1. Asignar `PT-NNN` desde `REGISTRY.json`.
2. Crear `changes/PT-NNN-slug/` y copiar la plantilla de Intake correspondiente al tipo.
3. El humano rellena los campos `[HUMANO]`. El agente puede redactar un borrador desde un
   `QD-NNN`, un `H-NNN` o un `R-NNN`, pero **no puede firmarlo** (`INTAKE-R06`).
4. El agente completa los campos `[AGENTE]`, incluidas sus **Observaciones** —desafíos al
   Intake— que son obligatorias (`INTAKE-R07`).
5. El agente ejecuta la checklist de Definition of Ready y emite un veredicto:

```
DoR: PASS       → status: READY   → avanza a PHASE 2
DoR: FAIL       → status: DRAFT   → lista qué falta y quién debe aportarlo
DoR: CHALLENGE  → status: DRAFT   → formalmente completo, pero hay un problema sustantivo
```

6. Registrar el PT en el índice correspondiente (`DISCOVERY.md`, `ENRICHMENT.md` o
   `REFACTOR_SCOPE.md`) con estado `DRAFT` o `READY`.

**Formato de línea de índice** (`LEX-R12` · una línea por PT, nunca el cuerpo del análisis):

```markdown
| PT-042 | FEATURE | S3 | READY | Exportar pedido a PDF | changes/PT-042-pdf-export/ | 2026-08-05 |
```

---

## PHASE 2 — Analysis

Bifurca según el tipo declarado en el Intake.

**Fuentes obligatorias** (`FDGE-R07`), en este orden:
`01-Platform-Overview.md` → `06-Backend-Architecture.md` → `11-Conventions.md` →
`02-PRD.md` → `03-TRD.md` → `08-API-Catalog.md` (si aplica) → `HANDOFF.md` →
`HISTORY.log` (entradas relacionadas) → `graphify-out/`

Solo se consulta código fuente si la documentación es insuficiente, y esa insuficiencia se
declara.

`FDGE-R08` · Si el grafo no existe o está desactualizado, se declara explícitamente en
`context.md`, baja la Architecture Confidence y queda registrado como riesgo. **No se puede
afirmar haber consultado un grafo inexistente.**

### PHASE 2-B — Discovery (`BUG` · `INVESTIGATION`) → `discovery.md`

Expande: **qué** ocurre · **dónde** · **cuándo** · **cómo** se manifiesta · **por qué**
(hipótesis con evidencia, no suposición). Documenta el radio de impacto y el acoplamiento.

Registra confianzas: `Root Cause` · `Architecture` · `Solution`. Si alguna baja del 70 %,
o si la causa raíz, el impacto o las dependencias son desconocidas → **Investigation Gate**
(`FDGE-R09`): el trabajo se reclasifica a `INVESTIGATION` y la planificación queda prohibida.

`FDGE-R10` · Una `INVESTIGATION` no produce código. Cierra con hallazgos documentados y
puede originar un PT nuevo.

### PHASE 2-E — Enrichment (`FEATURE`) → `enrichment.md`

Toma los criterios que el **humano** escribió en el Intake y los formaliza: los numera
`AC-nn`, los hace medibles, y deriva de cada uno sus `TS-nn`.

`INTAKE-R02` · El agente **no añade intención nueva**. Si detecta un criterio que falta, lo
propone en las Observaciones del Intake y espera decisión. No lo inserta.

Documenta: capas técnicas afectadas · cambios de contrato · NFRs con su fuente citada ·
impacto en el modelo de datos · riesgos.

### PHASE 2-R — Scope (`REFACTOR` · `CHORE`) → `scope.md`

Formaliza el límite: qué cambia · qué **no** cambia · barra de calidad medible · controles
de regresión `RC-nn` con el test que certifica cada uno · estrategia de rollback ·
cobertura actual vs. requerida.

Un refactor no puede empezar si no existe cobertura de tests sobre el código que va a
cambiar: esa cobertura es la red que certifica que el comportamiento no cambió.

### Salida común → `context.md`

Componentes · servicios · dependencias · flujo de datos · archivos implicados · áreas de
riesgo · puntos de intervención posibles · restricciones existentes · fuentes consultadas
con su fecha.

---

## PHASE 3 — Strategy → `strategy.md`

`FDGE-R11` · Secciones obligatorias:

```
Objetivo
Solución propuesta
Alternativas consideradas        (al menos 1)
Alternativas rechazadas          (con el motivo del rechazo)
Dependencias
Riesgos
Restricciones                    (citando 11-Conventions.md)
Criterios de éxito               (derivados de los AC-nn del Intake)
```

`FDGE-R12` · **Análisis de regresión obligatorio** para `STANDARD` y `MAJOR`: qué puede
romperse, workflows, servicios, APIs, flujos de UI, riesgos de integridad de datos.

Autorrevisión antes de presentar: contradicciones con la arquitectura, dependencias
faltantes, alternativas no consideradas, violación de alguna `RULE-nn`.

---

## PHASE 4 — Proposal · Compuerta **G2**

Produce el Proposal Package completo en `changes/PT-XXX-slug/`.

| Archivo | Contenido |
|:---|:---|
| `design.md` | Decisiones de arquitectura y su justificación. Por qué esta solución y no otra. |
| `tasks.md` | Lista atómica. Cada tarea: `PT-XXX.N`, objetivo único, input, output, validación, estado. |
| `spec-changes.md` | Cambios en PRD, TRD, API, esquema, contratos, tipos, eventos. |
| `test-scenarios.md` | `TS-nn`, cada uno citando el `AC-nn` que verifica. Para `BUG`: el escenario que reproduce el fallo debe estar en rojo antes del fix. |
| `out-of-scope.md` | Exclusiones explícitas, heredadas del Intake y ampliadas. |
| `traceability.md` | La matriz. Se crea aquí con las columnas `AC` → `TS` → `Test`; se completa en PHASE 6. |

**Rama propuesta** (no creada todavía):

```
fix/PT-XXX-slug          BUG
feature/PT-XXX-slug      FEATURE
refactor/PT-XXX-slug     REFACTOR
chore/PT-XXX-slug        CHORE
investigate/PT-XXX-slug  INVESTIGATION
hotfix/PT-XXX-slug       track HOTFIX
```

`FDGE-R13` · **Antes de resolver G2: 0 líneas modificadas, 0 ramas abiertas.**

Resolución de G2 según modo: ver [EXECUTION-MODES.md §5](EXECUTION-MODES.md).

---

## PHASE 5 — Implementation

Orden obligatorio. No es sugerido: produce commits limpios y detecta errores en el punto más
barato.

```
1. git checkout -b <type>/PT-XXX-slug

2. TESTS — escribir primero, todos en rojo                          FDGE-R17
   Derivados de test-scenarios.md. Si no puedes escribir el test,
   no entendiste el requisito.
   → test: PT-XXX add failing tests for <descripción>

   Excepción FDGE-R18: un CHORE o un TRIVIAL cuyo diff no toca lógica
   ejecutable puede omitir tests nuevos, declarando en strategy.md el
   motivo y la verificación alternativa. En traceability.md ese AC lleva
   «Test: —»; la columna Evidencia sigue siendo obligatoria.

   Track HOTFIX: PHASE 4 está diferida y test-scenarios.md aún no existe.
   La obligación se mantiene en su forma mínima — escribir primero UN test
   que reproduzca el fallo, en rojo. La batería completa llega con la
   PHASE 4 retroactiva (FDGE-R17, FDGE-R22).

3. DOCUMENTACIÓN in-code — stubs y estructura antes del contenido
   → docs: PT-XXX <qué se documentó>

4. CÓDIGO — implementar hasta que los tests pasen (verde)
   Ejecutar las tareas en el orden de tasks.md, actualizando su estado.
   Commits atómicos por unidad lógica, nunca big-bang al final.
   → feat|fix|refactor|chore: PT-XXX <descripción específica>

5. SUITE COMPLETA — unitarios verdes · integración sin regresiones ·
   cobertura no desciende · lint sin errores nuevos
   → test: PT-XXX all tests passing, update report

6. DELTA — registrar en design.md toda decisión que cambió durante la
   implementación y por qué; marcar tasks.md como DONE
   → docs: PT-XXX update proposal with actual vs planned delta
```

**Prohibido:** `FDGE-R19` commits que mezclen cambios lógicos o con mensajes `WIP`/`fix`/
`changes`/`update`/`final`. `FDGE-R20` tocar archivos fuera de `tasks.md` o implementar algo
de `out-of-scope.md`. Actualizar `HISTORY.log`, `HANDOFF.md` o los índices durante esta fase.

**Alerta de desvío** (`FDGE-R21`): si el trabajo resulta más complejo de lo planificado,
detención inmediata con evidencia. Un desvío dentro del scope continúa con ACK; un desvío
que eleva la complejidad obliga a volver a PHASE 2.

---

## PHASE 6 — Evidence

**Evidencia proporcional al cambio** (`FDGE-R24`), no un formato fijo:

| Tipo de cambio | Evidencia |
|:---|:---|
| Backend | Salida completa de tests (no «pasó»), reporte de cobertura, logs relevantes |
| API | Request y response reales, con códigos de estado |
| UI | Capturas antes/después y el flujo navegado |
| Datos | La consulta ejecutada y su resultado |
| Build / infra | Salida del build, del pipeline o del comando |

### `manifest.json` — obligatorio y verificable

`FDGE-R23` · Sin manifiesto válido no hay PHASE 7.

```json
{
  "pt": "PT-042",
  "generated": "2026-08-05T14:22:00Z",
  "criteria": [
    {
      "ac": "AC-01",
      "statement": "POST /items responde 201 con el ID creado si el payload es válido",
      "scenarios": ["TS-01"],
      "tests": ["tests/items.spec.ts:24"],
      "evidence": ["api/create-201.json", "tests/run-2026-08-05.txt"],
      "verified": true
    }
  ],
  "suite": { "passed": 148, "failed": 0, "skipped": 2, "coverage": 81.4, "baseline": 79.8 }
}
```

### `traceability.md` — se completa aquí

```markdown
| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | POST /items → 201 con ID | TS-01 | tests/items.spec.ts:24 | api/create-201.json | QA-014 | ✓ |
```

`FDGE-R15` · Un `AC` sin `TS`, sin test o sin evidencia es un **Orphan Criterion** y bloquea
G3. `verify-fdge` lo detecta mecánicamente.

### Self-Review → `self-review.md`

`FDGE-R25` · **No es un control: es una preparación.** Filtra lo que el agente puede detectar
por sí mismo para que la revisión humana se concentre en decisiones de negocio.

```markdown
# Self-Review — PT-XXX
Fecha: YYYY-MM-DD

- [ ] Todos los AC del Intake verificados con evidencia real
- [ ] traceability.md sin criterios huérfanos
- [ ] El código implementado corresponde al design.md
- [ ] El delta real vs planificado está registrado en design.md
- [ ] Sin regresiones (verificado con tests, no por inspección)
- [ ] Reglas RULE-nn de 11-Conventions.md respetadas
- [ ] Commits atómicos, nombrados y trazables al PT
- [ ] Sin artefactos de depuración: console.log, código comentado, TODO sin registrar
- [ ] Ningún ítem de out-of-scope.md implementado por accidente
- [ ] Sin problemas de seguridad evidentes (inyección, exposición de datos, auth)
- [ ] Documentación actualizada si cambió un contrato público

## Bloqueadores encontrados
## Resolución
## Estado
SELF_REVIEW_COMPLETE | SELF_REVIEW_BLOCKERS_FOUND
```

Con bloqueadores: se corrigen antes de continuar.

---

## PHASE 7 — Validation · Compuerta **G3**

| Tipo | Quién cierra | Estado resultante |
|:---|:---|:---|
| `BUG` | **Humano, siempre y en todos los modos** (`FDGE-R26`) | `VALIDATION_PENDING` → `DONE`, y el humano firma `G3 fecha nombre` en `HISTORY.log` |
| `FEATURE` | Agente si se cumplen las condiciones de `FDGE-R27` | `DONE` |
| `REFACTOR` | Agente si el comportamiento está preservado y se alcanzó la barra de calidad | `DONE` |
| `CHORE` | Agente si la verificación declarada pasa | `DONE` |
| `INVESTIGATION` | Agente si `discovery.md` tiene su `## Conclusión` (`FDGE-R42`) | `CLOSED` — no pasa por `INTEGRATED`: no produce código |

`FDGE-R28` · **Cierre asistido por QA.** Si el PT se originó en un `QD-NNN`, la validación
humana puede apoyarse en `delta QA PT-XXX` con resultado `PASS` del caso de origen. La
ejecución QA es evidencia; la decisión de cerrar sigue siendo humana. Esto cierra el loop
QA↔FDGE que la v3 enunciaba sin procedimiento.

Condiciones para auto-resolver G3 en `SUPERVISED`/`AUTONOMOUS`: [EXECUTION-MODES.md §5.2](EXECUTION-MODES.md).

---

## PHASE 8 — Persistence

### `HISTORY.log` — append-only, formato canónico único

`FDGE-R29` · Este es el **único** formato. La v3 tenía tres en tres documentos distintos.

```markdown
## PT-042 — FEATURE: Exportar pedido a PDF
Fecha: 2026-08-05
Estado: DONE
Severidad: S3 · Complejidad: STANDARD · Track: STANDARD
Lote: EP-003
Rama: feature/PT-042-pdf-export
Modo de ejecución: SUPERVISED
Objetivo: [una línea]
Causa raíz: [solo BUG]
Solución: [qué se hizo]
Archivos modificados:
  - src/orders/pdf-export.service.ts
  - src/orders/orders.controller.ts
Evidencia: docs/implementation/evidence/PT-042/
Criterios: AC-01 ✓ · AC-02 ✓ · AC-03 ✓
Delta (real vs planificado): [qué cambió respecto al Proposal Package y por qué · «según plan» si nada]
Compuertas: G1 2026-08-05 Ada Lovelace · G2 2026-08-05 Ada Lovelace · G3 auto · G4 pendiente
Trazabilidad externa: [QD-007] [H-021] [R-014]   — omitir las que no apliquen
```

### Corregir una entrada ya escrita   `FDGE-R29`

Una entrada de `HISTORY.log` **no se edita nunca** (`SUITE-R09`). Si salió mal, se añade:

```markdown
## PT-XXX — CORRIGE: [qué se corrige]
Corrige: la entrada de YYYY-MM-DD
Motivo: [por qué la original no cumple el formato canónico]
[los campos que se rehacen, con la misma grafía de arriba]
```

Las comprobaciones de `G4` leen **la última corrección** para cada campo que declare y la
entrada original para los que no, así que una corrección que solo arregla el `Estado:` no hace
desaparecer el `Estructural:`. La entrada original **permanece**: es lo que se audita, y ver las
dos es lo que dice que hubo un error — precisamente lo que editar habría borrado.

Una corrección **sin entrada original a la que referirse falla**: sin ese cierre, `CORRIGE` sería
una vía para declarar trabajo del que no hay registro.

Es el mismo patrón que `## PT-XXX — REVERTIDO` (`FDGE-R36`), que este ledger ya admitía.

### `HANDOFF.md` — sobrescribible en **modo merge**

`FDGE-R30` · Antes de escribir, leer el existente y **preservar** todas las validaciones
pendientes e investigaciones activas ajenas al PT que se cierra.

```markdown
# HANDOFF — Estado actual
Actualizado: YYYY-MM-DD · Último PT: PT-XXX · Modo: SUPERVISED

## Ramas activas
## Estado del sistema
## Bugs en VALIDATION_PENDING
## Validaciones pendientes
## Investigaciones activas
## Incidentes abiertos (INC-NNN)
## Riesgos conocidos
## Acciones recomendadas
```

### `BACKLOG.md` — regenerable

Vista de todos los PTs vivos con su fase actual, su lote y su solapamiento. Se regenera
desde `REGISTRY.json` y `changes/`.

### Índice de origen

`FDGE-R31` · Actualizar el estado del PT en `DISCOVERY.md`, `ENRICHMENT.md` o
`REFACTOR_SCOPE.md` al valor canónico. Un PT cerrado que sigue figurando como pendiente hace
que FPGE lo re-proponga indefinidamente — que es exactamente lo que ocurría en v3 con los
refactors, porque la fase de persistencia buscaba `REFACTOR_PENDING` y los prompts escribían
`SCOPE_PENDING`.

### Grafo

`FDGE-R32` · Si el PT creó, movió, renombró o eliminó archivos, declararlo y solicitar la
actualización del grafo de dependencias.

---

## PHASE 9 — Integration · Compuerta **G4**

Esta fase no existía en v3. El workflow de git terminaba en el último commit y la rama
quedaba abierta indefinidamente.

### Precondiciones, todas verificables (`FDGE-R34`)

```
[ ] CI en verde
[ ] verify-fdge.mjs sin errores
[ ] entrada en HISTORY.log
[ ] evidence/PT-XXX/manifest.json válido
[ ] self-review.md presente y sin bloqueadores
[ ] traceability.md sin criterios huérfanos
[ ] estado del PT: DONE  — y si es BUG, la línea «Compuertas:» lleva «G3 fecha nombre»
[ ] rama actualizada con la línea principal, sin conflictos
```

### Secuencia

```
1. Abrir PR: "PT-XXX <tipo>: <título>" con enlace al Proposal Package y a la evidencia
2. CI verde
3. Revisión humana → G4                                        FDGE-R33 · SUITE-R06a
4. Merge (el humano ejecuta la acción de merge)
5. Tag si aplica al esquema de versionado del proyecto
6. Borrar la rama
7. PT → INTEGRATED · marcar CLOSED en intake.md
   (CLOSED es POSTERIOR a INTEGRATED. Exigirlo antes del merge era el bloqueo
    circular que impedía integrar cualquier bug — corregido en 4.0.1)
   (`CLOSED` es POSTERIOR a `INTEGRATED`: exigirlo antes del merge era el bloqueo
    circular que impedía integrar cualquier bug — corregido en 4.0.1)
8. Conservar changes/PT-XXX-slug/ — nunca se borra                     FDGE-R35
9. Actualizar HANDOFF.md y BACKLOG.md
```

`FDGE-R33` · **El merge es humano en los tres modos de ejecución, sin excepción.** No hay
configuración, urgencia ni tipo de trabajo que lo automatice.

`FDGE-R35` · El directorio del PT **nunca se borra**: es el registro permanente de la
propuesta y de su delta. Se marca cerrado; se conserva.

---

## PHASE 10 — Rollback · carril condicional

Tampoco existía en v3, de modo que un PT integrado que rompía producción no tenía ningún
camino dentro del framework.

### Cuándo

Un PT `INTEGRATED` produce un fallo en el entorno de destino que no puede corregirse con la
rapidez que exige el impacto.

### Secuencia

```
1. Asignar INC-NNN desde REGISTRY.json
2. Registrar en INCIDENTS.log: qué se observó, cuándo, qué PT lo introdujo,
   impacto y decisión de revertir
3. Revertir  (git revert del merge — nunca reescribir historia · SUITE-R06f)
4. PT → REVERTED
5. AÑADIR una entrada nueva a HISTORY.log que referencia la original.
   La entrada original NUNCA se edita.                          FDGE-R36 · SUITE-R09
6. Abrir un PT de tipo INVESTIGATION o BUG con la causa raíz    FDGE-R37
7. Actualizar HANDOFF.md
```

### Formato de `INCIDENTS.log`

```markdown
## INC-001 — 2026-08-06
PT de origen: PT-042 (feature/PT-042-pdf-export, integrado 2026-08-05)
Detectado: 2026-08-06 09:14 · por: [quién] · entorno: producción
Síntoma observado:
Impacto: [usuarios, duración, pérdida de datos sí/no]
Decisión: REVERT · commit de revert: <sha>
Restaurado: 2026-08-06 09:41
PT de seguimiento: PT-045 (INVESTIGATION)
Causa raíz: [se completa al cerrar PT-045]
Estado: OPEN | CLOSED
```

`FDGE-R37` · Un `INC-NNN` sin PT de seguimiento queda abierto, y un incidente abierto sin
causa raíz documentada fuerza el descenso a modo `MANUAL` (`EXEC-R14`).

---

# 5. Convenciones de git

## Ramas

```
feature/PT-XXX-slug · fix/PT-XXX-slug · refactor/PT-XXX-slug
chore/PT-XXX-slug   · investigate/PT-XXX-slug · hotfix/PT-XXX-slug
```

Se abre únicamente tras resolver G2. Se borra tras el merge.

## Commits

```
<type>: PT-XXX <descripción específica>
```

`type` ∈ `feat` · `fix` · `refactor` · `test` · `docs` · `chore`

```
✅  test: PT-042 add failing tests for PDF export endpoint
✅  feat: PT-042 implement PDF generation service
✅  feat: PT-042 add PDF export controller and route
✅  test: PT-042 all tests passing, update report

❌  fix stuff
❌  more changes
❌  WIP
❌  final
```

`FDGE-R19` · Un commit = un cambio lógico. Los commits son la trazabilidad del trabajo: un
historial limpio permite auditar, revertir y entender sin leer el chat.

---

# 6. Trabajo por lotes

`FDGE-R38` · Un `EP-NNN` agrupa PTs; no los sustituye. Cada uno conserva su ciclo completo.

`FDGE-R40` · Antes de ejecutar, calcular el solapamiento de archivos entre los `tasks.md` de
sus PTs y declarar el plan en `BACKLOG.md`. Los que comparten archivos se serializan.

`FDGE-R41` · El lote se detiene completo ante el primer `BLOCKED` o el primer fallo de
compuerta no resuelto. No continúa «con los que sí pudieron»: los PTs de un lote suelen
compartir supuestos, y seguir sobre un supuesto falso multiplica el rework.

Detalle en [EXECUTION-MODES.md §7](EXECUTION-MODES.md).

---

# 7. Entradas y salidas de una sesión

**Entra:** `CLAUDE.md` · `REGISTRY.json` · `BACKLOG.md` · `HANDOFF.md` · `HISTORY.log` ·
`INCIDENTS.log` · el directorio del PT activo · `docs/enterprise-documentation/` ·
`graphify-out/` · estado de git.

**Sale:** código en la rama correcta con commits atómicos · el directorio del PT completo ·
`evidence/PT-XXX/` con manifiesto válido · `HISTORY.log` (append) · `HANDOFF.md` (merge) ·
`BACKLOG.md` · índice de origen actualizado · `REGISTRY.json` actualizado · `SESSION_LOG.md`
(append).

---

# 8. Criterios de cumplimiento

Una sesión FDGE es correcta cuando todo esto es cierto — y `verify-fdge.mjs` verifica
mecánicamente los que llevan `CHECK`:

* Existe `intake.md` firmado y G1 dio `PASS`.
* Los criterios de aceptación los declaró el humano.
* Existe análisis arquitectónico con sus fuentes y fechas declaradas.
* Existe estrategia con al menos una alternativa evaluada.
* G2 se resolvió antes de abrir la rama.
* Los tests se escribieron antes del código, o la excepción está declarada.
* Los commits son atómicos, nombrados y trazables.
* `manifest.json` es válido y `traceability.md` no tiene criterios huérfanos. **(CHECK)**
* Existe `self-review.md` sin bloqueadores. **(CHECK)**
* Los bugs permanecen en `VALIDATION_PENDING` hasta confirmación humana.
* `HISTORY.log` tiene exactamente una entrada para el PT. **(CHECK)**
* `HANDOFF.md` preservó las pendientes ajenas al PT.
* El índice de origen refleja el estado final. **(CHECK)**
* La rama se integró por G4 y se cerró, o el PT está explícitamente en curso.
