# Intake Protocol — La capa de admisión

> **Componente:** FDGE · **Fase:** PHASE 1 · **Compuerta:** G1 — Definition of Ready
> **Reglas vinculantes:** `INTAKE-R01`..`INTAKE-R08`, `FDGE-R01`..`FDGE-R05` en [RULES.md](../RULES.md)
> **Vocabulario:** [LEXICON.md](../LEXICON.md)

---

## Plantillas

| Plantilla | Cuándo |
|:---|:---|
| `templates/BUG-REPORT.md` · `FEATURE-REQUEST.md` · `CHANGE-REQUEST.md` | trabajo suelto, fuera de una implementación abierta |
| `templates/EPIC-INTAKE.md` | abrir una implementación (`[IMPLEMENTACIÓN]`) |
| **`templates/TAREA.md`** | **una tarea dentro de una implementación ya firmada** (`FDGE-R51`) |

La ligera existe porque el intake pesado pertenece a la implementación, no a cada cambio dentro
de ella: cobrar el ritual completo por cada arreglo tiene una sola salida practicable —
saltárselo, y perder el rastro.

## 1. El problema que resuelve

La suite v3 gobernaba al agente de forma exhaustiva y al humano no lo gobernaba en absoluto.
El trigger documentado para abrir trabajo era una línea:

```
PT-XXX BUG: [descripción]
```

A partir de ahí, el agente **inventaba** los criterios de aceptación (`STATE 1-E`:
«Enriquece la solicitud con Acceptance Criteria») y **deducía** el comportamiento esperado
de un bug. El humano los aprobaba con un ACK.

Eso es un fallo de diseño, no de ejecución:

- Los criterios de aceptación son **la definición del negocio**. No se derivan del código.
- El comportamiento esperado de un bug es **un hecho de negocio**. Si el agente lo deduce
  del código, deduce el comportamiento con el defecto dentro. El bug se «arregla» hacia
  el estado equivocado y todos los tests pasan.
- Un artefacto redactado por el agente y sellado por un humano que lee rápido tiene la
  **apariencia** de gobierno y ninguna de sus propiedades.

Y el framework lo declaraba en su propio Principio de Mínima Intervención —*«¿cuál es el
punto más temprano donde puedo detectar que esto está mal?»*— para acto seguido dejar ese
punto sin compuerta. Existía Proposal Gate (antes de implementar) y Validation Gate (antes
de cerrar). No existía compuerta de admisión: **la más barata de todas**.

```
Coste creciente de detectar un error:

  Intake  →  Análisis  →  Propuesta  →  Tests  →  Self-review  →  Revisión humana  →  Rework
    1x         3x           8x          20x         40x              80x            300x
    ▲
    └── aquí no había ninguna compuerta
```

---

## 2. Qué es un Intake

Un archivo `changes/PT-XXX-slug/intake.md` que contiene **la intención del humano en sus
propias palabras**, firmado.

No es un ticket, no es un análisis y no es una especificación técnica. Es la declaración de
qué se quiere y por qué, con el nivel de precisión suficiente para que un desacuerdo se
detecte **ahora**, cuando cuesta una frase, y no dentro de tres fases, cuando cuesta un
rework.

### 2.1 Reparto de responsabilidades

```
┌─────────────────────────────┬──────────────────────────────────────┐
│  LO ESCRIBE EL HUMANO       │  LO ESCRIBE EL AGENTE                │
│  (no puede delegarse)       │  (a partir de lo anterior)           │
├─────────────────────────────┼──────────────────────────────────────┤
│  Qué se quiere              │  Formalización en AC-01..AC-nn       │
│  Comportamiento esperado    │  Escenarios de test TS-01..TS-nn     │
│  Criterios de aceptación    │  NFRs derivados de Conventions       │
│  Out of scope               │  Capas técnicas afectadas            │
│  Severidad S1..S4           │  Complejidad TRIVIAL/STANDARD/MAJOR  │
│  Contexto de reproducción   │  Componentes y dependencias          │
│  Firma                      │  Observaciones y desafíos            │
└─────────────────────────────┴──────────────────────────────────────┘
```

`INTAKE-R07` obliga al agente a **desafiar** el Intake: señalar criterios ambiguos,
contradicciones con el PRD, un out-of-scope que resulta indispensable, o una severidad que
no cuadra con el impacto descrito. Aceptar un Intake malo en silencio viola `SUITE-R01`.

### 2.2 El agente puede redactar el borrador

Nada impide que el agente proponga un borrador —desde un `QD-NNN`, un `H-NNN`, un ítem de
roadmap o una descripción hablada. Lo que no puede hacer es **firmarlo** (`INTAKE-R06`).
La firma es el acto que convierte una interpretación en una intención declarada.

---

## 3. Las tres plantillas

| Tipo de trabajo | Plantilla |
|:---|:---|
| `BUG` · `INVESTIGATION` | [templates/BUG-REPORT.md](templates/BUG-REPORT.md) |
| `FEATURE` | [templates/FEATURE-REQUEST.md](templates/FEATURE-REQUEST.md) |
| `REFACTOR` · `CHORE` | [templates/CHANGE-REQUEST.md](templates/CHANGE-REQUEST.md) |
| Lote `EP-NNN` | [templates/EPIC-INTAKE.md](templates/EPIC-INTAKE.md) (`INTAKE-R09`) |

Se copian a `changes/PT-XXX-slug/intake.md` y se rellenan. La plantilla marca cada campo
como `[HUMANO]`, `[AGENTE]` o `[OPCIONAL]`.

---

## 4. Definition of Ready — la compuerta G1

Un PT pasa de `DRAFT` a `READY` solo si **todas** las condiciones aplicables se cumplen.
El agente ejecuta esta checklist y reporta el resultado ítem por ítem. Si algo falla,
declara **exactamente qué campo falta** y se detiene (`FDGE-R03`).

### 4.1 Condiciones universales

```
[ ] DoR-01  El tipo está declarado y es uno de: BUG · FEATURE · REFACTOR · INVESTIGATION · CHORE
[ ] DoR-02  La severidad S1..S4 está declarada por el humano
[ ] DoR-03  Existe el bloque ## Firma con nombre y fecha, escrito por un humano
[ ] DoR-04  El out-of-scope está declarado explícitamente (o «ninguno» de forma consciente)
[ ] DoR-05  El PT-NNN fue asignado desde REGISTRY.json, no inventado
[ ] DoR-06  No duplica un PT vivo en BACKLOG.md ni un ítem de roadmap ya promovido
[ ] DoR-07  El agente registró sus Observaciones (o declaró «ninguna»)
```

### 4.2 Condiciones por tipo

**`BUG` / `INVESTIGATION`**
```
[ ] DoR-B1  Comportamiento esperado declarado por el humano, no deducido del código
[ ] DoR-B2  Comportamiento observado descrito con detalle observable
[ ] DoR-B3  Pasos de reproducción, o declaración explícita de «no reproducible de forma fiable»
[ ] DoR-B4  Entorno identificado: URL/host, build o commit, rol de usuario, navegador si aplica
[ ] DoR-B5  Frecuencia declarada: siempre · intermitente · una vez
[ ] DoR-B6  Impacto y usuarios afectados declarados
```

**`FEATURE`**
```
[ ] DoR-F1  Objetivo de negocio declarado: qué cambia para quién y por qué ahora
[ ] DoR-F2  Actor y disparador identificados
[ ] DoR-F3  Al menos un criterio de aceptación escrito por el humano
[ ] DoR-F4  Todo criterio es verificable con ✓/✗ observando el sistema (INTAKE-R05)
[ ] DoR-F5  Métrica de éxito o señal de que funcionó, declarada
[ ] DoR-F6  Out-of-scope no vacío (una feature sin límites no tiene límites)
```

**`REFACTOR` / `CHORE`**
```
[ ] DoR-R1  Qué cambia internamente, declarado
[ ] DoR-R2  Qué NO debe cambiar: contratos, comportamiento observable, interfaces públicas
[ ] DoR-R3  Barra de calidad medible declarada (umbral, no adjetivo)
[ ] DoR-R4  Motivación técnica: por qué el estado actual es insostenible
```

### 4.3 Resultado de G1

El agente emite exactamente uno de estos veredictos:

```
DoR: PASS      → el PT pasa a READY, avanza a PHASE 2
DoR: FAIL      → el PT permanece DRAFT. Se lista qué falta y quién debe aportarlo.
DoR: CHALLENGE → el Intake está formalmente completo pero el agente detecta un problema
                 sustantivo. Se reporta y se espera decisión humana antes de avanzar.
```

`CHALLENGE` no es un rechazo: es el mecanismo por el que el agente cumple `INTAKE-R07` sin
bloquear el trabajo unilateralmente. El humano puede responder «procede igual» y queda
registrado.

---

## 5. Trazabilidad — de la intención a la evidencia

El Intake es el origen de la única cadena que hace auditable el trabajo. En v3 los
identificadores existían (`AC-nn`, `TS-nn`, `QA-nnn`) pero **ningún documento obligaba a
enlazarlos**, de modo que no se podía responder «¿qué evidencia prueba AC-03?».

```
Intake                Proposal              Implementación        Evidencia          QA
─────────────────────────────────────────────────────────────────────────────────────────
AC-01  ──────────▶  TS-01, TS-02  ──────▶  test file:line  ──▶  evidence/…  ──▶  QA-014
       (humano)       (agente)             (agente)            (ejecución)      (agente)
```

`FDGE-R15` obliga a materializar esa cadena en `changes/PT-XXX-slug/traceability.md`:

```markdown
| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | POST /items responde 201 con el ID creado | TS-01 | `tests/items.spec.ts:24` | `evidence/PT-042/api/create-201.json` | QA-014 | ✓ |
| AC-02 | Payload inválido responde 422 con detalle por campo | TS-02, TS-03 | `tests/items.spec.ts:41` | `evidence/PT-042/api/create-422.json` | QA-015 | ✓ |
```

Un `AC` sin `TS`, sin test o sin evidencia es un **Orphan Criterion** y bloquea la
compuerta G3 (`FDGE-R15`). `verify-fdge` lo detecta mecánicamente.

`QA-R19` cierra el otro extremo: todo caso QA generado desde un PT cita el `AC-nn` que
verifica.

---

## 6. Severidad — el eje que faltaba

v3 solo clasificaba **complejidad** (`TRIVIAL`/`STANDARD`/`MAJOR`), que mide esfuerzo. Por
tanto un fallo crítico de producción y un texto mal alineado recorrían el mismo camino con
la misma urgencia.

La severidad la declara el humano en el Intake y es **ortogonal** a la complejidad
(`LEX-R19`, `FDGE-R04`):

| | `TRIVIAL` | `STANDARD` | `MAJOR` |
|:---|:---|:---|:---|
| **S1** | Hotfix inmediato de una línea | Hotfix con análisis | Incidente mayor, todo el equipo |
| **S2** | Cabeza de cola normal | Prioridad alta | Prioridad alta con análisis de riesgo |
| **S3** | Track EXPRESS | Cadencia normal | Cadencia normal, requiere lote propio |
| **S4** | Se agrupa en lote | Se agrupa en lote | Se difiere a planificación |

Solo `S1` habilita el carril `HOTFIX` (`FDGE-R22`), que difiere —pero **no elimina**— las
fases de análisis y propuesta, con un plazo de 48 h para completarlas retroactivamente.
Existe precisamente para que nadie tenga que saltarse el framework en silencio: un bypass
documentado es recuperable, uno silencioso no.

---

## 7. Intake de un lote (`EP-NNN`)

`INTAKE-R08` permite una firma por lote. El directorio del lote es:

```
changes/EP-003-facturacion/
  intake.md          ← declaración del lote + firma única
  PT-101 → changes/PT-101-slug/     (referencias, no copias)
  PT-102 → changes/PT-102-slug/
```

El `intake.md` del lote declara: objetivo común, orden sugerido, dependencias entre PTs y
la firma. Cada PT conserva **su propio** `intake.md` completo (`FDGE-R38`); lo que el lote
ahorra es la ceremonia de firmar cinco veces, no el contenido.

---

## 8. Origen del Intake

Un Intake puede nacer de cuatro sitios. En los cuatro casos, la firma humana es obligatoria.

| Origen | Quién redacta el borrador | Trigger |
|:---|:---|:---|
| Petición directa | Humano | `[START PT] BUG: …` |
| Defecto QA | Agente, desde el `QD-NNN` | `promote QD-NNN to FDGE` |
| Hallazgo de auditoría | Agente, desde el `H-NNN` | (vía roadmap) |
| Ítem de roadmap | Agente, desde el racional del `R-NNN` | `promote FPGE R-NNN` |

`FPGE-R10` es explícita: una promoción entrega el ítem a **PHASE 1 (Intake)**, no a PHASE 2.
En v3 la promoción entregaba directamente al análisis y saltaba la admisión, de modo que
todo el trabajo nacido del roadmap entraba sin intención humana declarada.

---

## 9. Qué hace el agente con un Intake admitido

En PHASE 2, el agente **expande** el Intake; nunca lo contradice ni lo reescribe. Si el
análisis revela que la intención declarada es inviable o incorrecta, no la corrige: emite
un `CHALLENGE` y devuelve el PT a `DRAFT` para que el humano decida.

El `intake.md` es **append-only** una vez firmado. Las revisiones se añaden como bloques
`## Revisión N` con su propia firma.
