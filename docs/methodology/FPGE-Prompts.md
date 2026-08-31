# FPGE — Prompts Operativos

> Método: [Framework-FPGE.md](Framework-FPGE.md) · Procedimiento: [FPGE-Implementation.md](FPGE-Implementation.md)
> Reglas: [RULES.md](RULES.md) §Parte 7 · Vocabulario: [LEXICON.md](LEXICON.md)
>
> Suite version: **13.5.0**

---

## Antes de publicar el roadmap                                              [SUITE-R26]

```
node docs/methodology/tools/verify-qa.mjs
```

Comprueba que todo candidato cita su evidencia [FPGE-R01], que el roadmap declara frescura
[FPGE-R05] y el factor Confidence de QA-STALE [FPGE-R08], que con QA-F vigente toda FEATURE
queda BLOCKED [FPGE-R07] y que ningún artefacto ajeno lleva rastro de escritura de FPGE
[FPGE-R03]. FPGE propone; lo que no se puede verificar no se propone.

## Triggers

| Trigger | Efecto |
|:---|:---|
| `[START FPGE]` | Corrida completa: leer evidencia, sintetizar, priorizar, emitir `ROADMAP.md`, detenerse. |
| `promote FPGE R-NNN` | Promover un ítem aprobado a FDGE PHASE 1 (Intake) con un `PT-NNN` nuevo. |
| `promote FPGE R-NNN..R-MMM as EP-XXX` | Promover un rango como lote. |
| `status FPGE` | Reportar el roadmap vigente sin recalcular. |

`SUITE-R12` · FPGE nunca se auto-activa.

---

# `[START FPGE]` — Corrida completa

```
[START FPGE]

Actúa como priorizador gobernado por evidencia.

## REGLA DE ESCRITURA — la más importante de este componente               [FPGE-R03]
Escribes ÚNICAMENTE docs/implementation/ROADMAP.md y ROADMAP_HISTORY.log.
NO escribes en PTSA/, ni en QA/, ni en ningún artefacto de FDGE. Sin excepciones.
Cuando un ítem se rechaza, EMITES UNA INSTRUCCIÓN para el componente dueño; no la
ejecutas tú.

## PHASE 1 — Compuertas de freshness y confianza

1a. PTSA/RESUMEN.md → score_freshness                                       [FPGE-R05]
    Si STALE o UNKNOWN: anótalo como advertencia en el encabezado de ROADMAP.md y
    recomienda `delta PTSA` antes de tomar decisiones irreversibles.

1b. QA/qa-score-history.json → última entrada con "type": "FULL"
    Si la clasificación es QA-F: marca TODO candidato de tipo FEATURE como BLOCKED.  [FPGE-R07]
    Si el score está STALE (>3 PTs integrados o >30 días desde el último ciclo completo):
    aplica Confidence = 0.7 a los candidatos cuya ÚNICA evidencia sea QA, y decláralo
    en el racional de cada uno.                                             [FPGE-R08]

1c. docs/implementation/INCIDENTS.log
    Todo INC-NNN abierto sin PT de seguimiento → candidato con Urgency +1.0.

## PHASE 2 — Recolección de evidencia — SOLO LECTURA

PTSA:  Findings/H-NNN.md en estado READY o REOPENED (dimensión, severidad, impacto,
       probabilidad) · Products/P-NNN.md en BLOCKED_DOMAIN o IN_REVIEW ·
       score-history.json (tendencia por dimensión) · PENDIENTES.md
QA:    QA-DEFECTS.md → QD-NNN en READY con severidad CRITICAL o HIGH ·
       qa-score-history.json (tendencia entre entradas "type": "FULL")
FDGE:  HANDOFF.md · HISTORY.log · INCIDENTS.log · BACKLOG.md ·
       DISCOVERY.md / ENRICHMENT.md / REFACTOR_SCOPE.md (índices de trabajo
       especificado y no implementado) · changes/ (Proposal Packages)

## PHASE 3 — Síntesis de candidatos

Un R-NNN por unidad de trabajo accionable.
Asigna cada R-NNN desde docs/implementation/REGISTRY.json.                  [SUITE-R08]
Fusiona duplicados: varios hallazgos del mismo producto → un ítem con varias evidencias.

TODO candidato DEBE citar su evidencia de origen. Sin evidencia no es candidato:
es una opinión.                                                             [FPGE-R01]

EXCLUYE:
  - QD-NNN y H-NNN que ya tienen un PT asignado
  - PTs vivos en BACKLOG.md
  - Ítems con Proposal Package ya aprobado

## PHASE 4 — Cálculo de Priority

Priority = (EvidenceWeight × ScoreImpact × Urgency × DomainMultiplier × Confidence) / Effort

  EvidenceWeight   1–16    riesgo del hallazgo de origen (Impacto × Probabilidad)
  ScoreImpact      0–30    ganancia de Health esperada (penalización × peso de dimensión)
  Urgency          1.0–3.0 base 1.0 · +0.5 audit_due vencido · +0.5 dimensión STALE o en
                           regresión · +1.0 incidente abierto relacionado
  DomainMultiplier 1.0/1.5 1.5 si es D1 — Regla del Agua Potable              [FPGE-R06]
  Confidence       0.7/1.0 0.7 si la única evidencia es QA y el score QA está STALE
  Effort           1/2/4   S / M / L — estima con el grafo si está disponible; si no,
                           DECLARA el supuesto

## PHASE 5 — Orden y desempates
Mayor Priority → D1 antes que D2/D3/D4 → mayor riesgo de no hacerlo → menor id.

## PHASE 6 — Emisión
Sobrescribe ROADMAP.md con el schema de FPGE-Implementation.md.
TODOS los ítems en estado DRAFT.
Declara Top-3 impacto y Top-3 quick wins.
Append a ROADMAP_HISTORY.log: fecha, evidencia leída con su versión y freshness,
nº de candidatos, factores de confianza aplicados, top items.

## PHASE 7 — Stop                                                           [FPGE-R04]
NO promuevas nada. NO abras ningún PT. Espera decisión humana.
Recuerda al humano que debe marcar cada ítem READY / DEFERRED / REJECTED.
```

---

# `promote FPGE R-NNN`

```
promote FPGE R-NNN

## 1. Verificar
El ítem debe estar marcado READY por el humano en ROADMAP.md.
Si está en DRAFT: DETENTE — nadie lo ha aprobado.
Si está BLOCKED por QA-F: DETENTE y explica qué defectos hay que resolver primero.

## 2. Asignar el PT
Asigna PT-NNN desde docs/implementation/REGISTRY.json.                      [FPGE-R09]
NO lo derives contando HISTORY.log.

## 3. Entregar a FDGE PHASE 1 — Intake, NO al análisis                       [FPGE-R10]

Crea changes/PT-NNN-slug/ y copia la plantilla según el tipo del ítem:
  BUG · INVESTIGATION   → docs/methodology/INTAKE/templates/BUG-REPORT.md
  FEATURE               → docs/methodology/INTAKE/templates/FEATURE-REQUEST.md
  REFACTOR · CHORE      → docs/methodology/INTAKE/templates/CHANGE-REQUEST.md

Transcribe el racional y la evidencia de origen como BORRADOR de los campos [HUMANO],
marcándolos explícitamente como borrador.

NO firmes el Intake.                                                        [INTAKE-R06]
Un hallazgo de auditoría explica un síntoma; no declara qué debe hacer el sistema.
El comportamiento esperado y los criterios de aceptación siguen siendo del humano.

Registra en el Intake:
  origin: R-NNN
  Evidencia de origen: [H-NNN | QD-NNN | entrada de HISTORY.log | tendencia]
  Racional del roadmap: [transcrito]

## 4. Actualizar ROADMAP.md
R-NNN → estado IN_PROGRESS · pt_asignado: PT-NNN
(Esta es una escritura sobre TU PROPIO artefacto: permitida.)

## 5. Append a ROADMAP_HISTORY.log
## YYYY-MM-DD — Promoción
- R-NNN READY → PT-NNN (FDGE PHASE 1, Intake pendiente de firma).
  Evidencia: [origen]. Plantilla: [cuál].

## 6. STOP
Entrega el control a FDGE PHASE 1. El PT queda en DRAFT hasta que el humano firme
el Intake y G1 dé PASS.
```

---

# `promote FPGE R-NNN..R-MMM as EP-XXX`

```
promote FPGE R-NNN..R-MMM as EP-XXX

## 1. Verificar
TODOS los ítems del rango deben estar READY. Si alguno no lo está, DETENTE y dilo.

## 2. Abrir el lote
Asigna EP-XXX desde REGISTRY.json. Crea changes/EP-XXX-slug/intake.md con:
  Objetivo común del lote
  Los R-NNN que lo componen y el PT-NNN asignado a cada uno
  Orden sugerido, derivado del orden de Priority
  Dependencias entre ítems
  Un bloque de firma ÚNICO que cubrirá los Intakes de todos sus PTs.        [INTAKE-R08]

## 3. Promover cada ítem
Aplica `promote FPGE R-NNN` a cada uno, con epic: EP-XXX en su Intake.
CADA PT conserva su propio intake.md completo.                              [FDGE-R38]

## 4. Entregar a FDGE
El lote entra por el flujo de lotes de FDGE-Prompts.md, que calculará el solapamiento
de scope antes de ejecutar nada.                                            [FDGE-R40]

## 5. STOP
```

---

# Instrucciones de cierre por rechazo

```
El humano marcó ítems como REJECTED en ROADMAP.md.

## NO ejecutes ningún cierre                                                [FPGE-R03]
FPGE es read-only sobre artefactos ajenos. Escribir el estado de cierre en un hallazgo de
PTSA o en un defecto de QA violaría además PTSA-R19 (inmutabilidad auditable) y QA-R11
(el agente no cierra defectos sin decisión humana bajo el trigger de QA).

## EMITE las instrucciones y detente

INSTRUCCIONES DE CIERRE PENDIENTES
Ejecútalas bajo el trigger de cada componente dueño.

R-012 REJECTED  (origen: H-014, PTSA)
  → audit PTSA close H-014 as REJECTED
     motivo: <el declarado por el humano>

R-015 REJECTED  (origen: QD-009, QA)
  → close QD-009 as accepted
     motivo: <el declarado por el humano>

R-018 REJECTED  (origen: ENRICHMENT PT-031, FDGE)
  → marcar PT-031 como REJECTED en docs/implementation/ENRICHMENT.md
     motivo: <el declarado por el humano>

## Registra en ROADMAP.md y ROADMAP_HISTORY.log
El estado REJECTED del ítem y la instrucción emitida, marcada como «pendiente de ejecución»
hasta que el componente dueño confirme.

Sin este cierre, la evidencia de origen sigue activa y la próxima corrida FPGE
volverá a proponer el mismo ítem indefinidamente.
```

---

# `status FPGE`

```
status FPGE

Reporta, SIN recalcular ni sobrescribir nada:

1. Fecha de la última corrida y sobre qué evidencia se basó (con su freshness).
2. Advertencias vigentes: PTSA STALE · QA-F · QA STALE · incidentes abiertos.
3. Ranking actual con el estado de cada ítem:
   DRAFT (esperando decisión) · READY (aprobado, sin promover) ·
   IN_PROGRESS (promovido, con su PT) · REJECTED · DEFERRED · BLOCKED
4. Ítems READY sin promover — son trabajo aprobado que nadie ha arrancado.
5. Ítems IN_PROGRESS y la fase actual de su PT (leyendo BACKLOG.md).
6. Instrucciones de cierre emitidas y aún no ejecutadas por su componente dueño.
7. Top-3 impacto y Top-3 quick wins de la corrida vigente.

Si la corrida vigente tiene más de 14 días o se integraron PTs desde entonces,
declara que el roadmap está desactualizado y recomienda `[START FPGE]`.
```
