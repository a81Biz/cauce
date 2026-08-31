# FPGE-Implementation — Materialización en un repositorio

> **Naturaleza: procedimental.** Método: [Framework-FPGE.md](Framework-FPGE.md) ·
> Prompts: [FPGE-Prompts.md](FPGE-Prompts.md) · Reglas: [RULES.md](RULES.md) §Parte 7 ·
> Vocabulario: [LEXICON.md](LEXICON.md)
>
> Suite version: **13.5.0**

---

## Objetivo

Convertir el estado de evidencia del proyecto (auditoría PTSA + verificación QA + historia
FDGE) en **una decisión trazable de qué construir a continuación**, sin que FPGE escriba
jamás en los artefactos de los otros marcos.

---

## Artefactos

FPGE vive junto a FDGE (`docs/implementation/`) porque su salida lo alimenta.

```text
docs/implementation/
├── ROADMAP.md              ESCRIBE · sobrescribir completo en cada corrida
├── ROADMAP_HISTORY.log     ESCRIBE · append-only
│
├── REGISTRY.json           LEE (y solicita asignación de R-NNN y PT-NNN)
├── HISTORY.log             LEE
├── HANDOFF.md              LEE
├── INCIDENTS.log           LEE
├── BACKLOG.md              LEE
├── DISCOVERY.md            LEE   (índice de bugs e investigaciones pendientes)
├── ENRICHMENT.md           LEE   (índice de features especificados sin implementar)
├── REFACTOR_SCOPE.md       LEE   (índice de refactors con scope definido)
└── evidence/PT-XXX/        LEE

changes/PT-XXX-slug/        LEE   (Proposal Packages en vuelo o cerrados)

PTSA/                       LEE   RESUMEN.md · Findings/ · Products/ · PENDIENTES.md · score-history.json
QA/                         LEE   QA-DEFECTS.md · qa-score-history.json
```

`FPGE-R03` · **Regla de escritura, sin excepciones:** solo `ROADMAP.md` y
`ROADMAP_HISTORY.log`. Cualquier otra escritura es una violación de `SUITE-R10`.

---

## El proceso paso a paso

```
PHASE 1 — Compuertas de freshness y confianza

    PTSA/RESUMEN.md → score_freshness
      STALE | UNKNOWN → anotar advertencia en el encabezado de ROADMAP.md y
                        recomendar `delta PTSA` antes de decisiones irreversibles.  FPGE-R05

    QA/qa-score-history.json → última entrada con "type": "FULL"
      clasificación QA-F → marcar TODO candidato de tipo FEATURE como BLOCKED
                           hasta que se resuelvan los defectos críticos.            FPGE-R07
      score STALE        → aplicar Confidence = 0.7 a los candidatos cuya ÚNICA
                           evidencia sea QA, y declararlo en su racional.           FPGE-R08

    docs/implementation/INCIDENTS.log
      incidente abierto sin PT de seguimiento → candidato de máxima urgencia (+1.0)

PHASE 2 — Recolección de evidencia — solo lectura

    PTSA  hallazgos activos (READY, REOPENED) con dimensión, severidad, impacto, probabilidad
    PTSA  productos en BLOCKED_DOMAIN o IN_REVIEW
    PTSA  score-history.json → tendencia por dimensión (estancada / en regresión)
    QA    QA-DEFECTS.md → QD-NNN en READY con severidad CRITICAL o HIGH
    QA    qa-score-history.json → tendencia comparando entradas "type": "FULL"
    FDGE  HANDOFF.md → bugs abiertos, validaciones pendientes, acciones recomendadas
    FDGE  HISTORY.log → deuda diferida, ítems pospuestos que reinciden, deltas
    FDGE  INCIDENTS.log → incidentes y su estado
    FDGE  DISCOVERY.md / ENRICHMENT.md / REFACTOR_SCOPE.md → trabajo especificado, no hecho
    FDGE  BACKLOG.md + changes/ → trabajo YA en vuelo: no proponerlo de nuevo
    FDGE  MATRIZ.md → toda clase de evento con recuento ≥ el umbral declarado y SIN regla
                      que la reclame entra como CANDIDATO, y se cita por su `CE-nnn`.
                      La cifra NO se transcribe: la fila de la matriz es la evidencia,
                      y la matriz se deriva (`LEX-R31`, `LEX-R32`).
                      Y hay un caso PEOR que no tener regla, y también entra: una clase
                      con regla dueña cuya columna dice «la regla existe y nada emite
                      por ella» — una obligación que no puede fallar.
                      El umbral vive en `REGISTRY.tracker.umbral_clase_sin_dueno`; no se
                      escribe aquí, para que no haya dos números que puedan divergir.

PHASE 3 — Síntesis de candidatos

    Un R-NNN por unidad de trabajo accionable. Asignar el ID desde REGISTRY.json.  SUITE-R08
    Fusionar duplicados: varios hallazgos del mismo producto → un ítem con varias evidencias.

    EXCLUIR:
      - QD-NNN y H-NNN que ya tienen un PT asignado (ya tienen trabajo)
      - PTs vivos en BACKLOG.md
      - Ítems con Proposal Package ya aprobado

PHASE 4 — Cálculo de Priority

    Priority = (EvidenceWeight × ScoreImpact × Urgency × DomainMultiplier × Confidence) / Effort

    Estimar Effort con el grafo de dependencias si está disponible; si no, DECLARAR el supuesto.

PHASE 5 — Orden y desempates

    Mayor Priority → D1 antes que D2/D3/D4 → mayor riesgo de no hacer → menor id.

PHASE 6 — Emisión

    Sobrescribir ROADMAP.md. Todos los ítems en DRAFT. Declarar Top-3 impacto y Top-3 quick wins.
    Append a ROADMAP_HISTORY.log: fecha, evidencia leída con su versión, nº de candidatos, top.

PHASE 7 — Stop — decisión humana. NO promover nada.                                FPGE-R04
```

---

## Schema de `ROADMAP.md`

```markdown
# ROADMAP — Priorización Gobernada por Evidencia
**Corrida:** YYYY-MM-DD
**Basado en:** PTSA Health <n>/<clasif> (freshness <estado>) · QA <clasif> (freshness <estado>)
              · HISTORY @ PT-XXX
**Advertencias:**
- [p. ej. «PTSA STALE: se recomienda `delta PTSA` antes de promover»]
- [p. ej. «QA-F activo: los candidatos FEATURE están BLOCKED»]
- [p. ej. «QA STALE: Confidence 0.7 aplicado a R-004, R-009»]
- [o «ninguna»]

## Top 3 — Mayor impacto
1. R-003 — <título>  (D1, ΔHealth +15)
2. ...

## Top 3 — Quick wins
1. R-007 — <título>  (esfuerzo S, ΔHealth +5)
2. ...

## Roadmap completo
| # | ID | Tipo | Título | Origen | Prod/Dim | ΔScore | Esf | Riesgo | Conf | Priority | Estado | PT |
|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|
| 1 | R-003 | BUG | Regenerar P-008 con guardrails | H-008 | P-008/D1 | +15 | M | ALTO | 1.0 | 36.0 | DRAFT | — |
| 2 | R-004 | BUG | Validación de email en alta | QD-011 | —/— | +4 | S | MEDIO | 0.7 | 11.2 | DRAFT | — |
| 3 | R-009 | FEATURE | Exportación a PDF | ENRICHMENT PT-031 | —/— | — | M | BAJO | 1.0 | 6.0 | BLOCKED | — |

Estados: DRAFT · READY · IN_PROGRESS (promovido) · REJECTED · DEFERRED · BLOCKED   [LEXICON §5.1]

## Racional por ítem

### R-003 — Regenerar P-008 con guardrails
**Evidencia:** H-008 (D1, ALTA, riesgo 9) · producto P-008 en BLOCKED_DOMAIN.
**Por qué ahora:** D1=75 topa el ascenso a clasificación A; es el ítem de mayor ΔHealth y
es de dominio, así que hereda el multiplicador 1.5.
**Confianza:** 1.0 — evidencia PTSA fresca (auditoría del 2026-08-01).
**Definición de hecho:** `validacion_estado='aprobado'` verificado en BD por PTSA en el
próximo delta sync.
**Tipo sugerido para FDGE:** BUG → PHASE 1 con plantilla BUG-REPORT.

### R-004 — Validación de email en alta
**Evidencia:** QD-011 (QR-005, severidad HIGH, estado READY).
**Confianza:** 0.7 — el score QA está STALE (último ciclo completo hace 41 días y 5 PTs).
Se recomienda `[START QA]` antes de tratar este ítem como prioritario.

### R-009 — Exportación a PDF
**Estado:** BLOCKED por clasificación QA-F vigente. Las nuevas features no se recomiendan
hasta resolver QD-008 y QD-012 (CRITICAL).
```

---

## Promoción — de `R-NNN` a `PT-NNN`

1. El humano revisa `ROADMAP.md` y marca cada ítem `READY` / `DEFERRED` / `REJECTED`.

2. Por cada `READY`, se ejecuta `promote FPGE R-NNN`:
   * Se asigna un `PT-NNN` nuevo **desde `REGISTRY.json`** (`FPGE-R09`). En v3 se derivaba
     contando `HISTORY.log`, lo que no es concurrente ni fiable.
   * Se entrega a **FDGE PHASE 1 (Intake)** (`FPGE-R10`), con la plantilla que corresponda:

     | Tipo del ítem | Plantilla de Intake |
     |:---|:---|
     | `BUG` · `INVESTIGATION` | `INTAKE/templates/BUG-REPORT.md` |
     | `FEATURE` | `INTAKE/templates/FEATURE-REQUEST.md` |
     | `REFACTOR` · `CHORE` | `INTAKE/templates/CHANGE-REQUEST.md` |

   * El racional y la evidencia de origen se transcriben como **borrador** de los campos
     `[HUMANO]`, marcados como tales. **El humano debe firmar** (`INTAKE-R06`): un hallazgo
     de auditoría explica un síntoma, no declara qué debe hacer el sistema.
   * El ítem pasa a `IN_PROGRESS` con su `pt_asignado`.

3. Por cada `REJECTED`, FPGE **emite una instrucción; no la ejecuta** (`FPGE-R03`):

   ```
   INSTRUCCIONES DE CIERRE PENDIENTES — ejecútalas bajo el trigger de cada componente

   R-012 REJECTED (origen H-014)
     → ejecutar bajo PTSA:  audit PTSA close H-014 as REJECTED
        motivo: <el que declaró el humano>

   R-015 REJECTED (origen QD-009)
     → ejecutar bajo QA:    close QD-009 as accepted
        motivo: <el que declaró el humano>

   R-018 REJECTED (origen ENRICHMENT PT-031)
     → ejecutar bajo FDGE:  marcar PT-031 como REJECTED en ENRICHMENT.md
        motivo: <el que declaró el humano>
   ```

   En v3, FPGE escribía esos estados directamente en `Findings/H-XXX.md`, en `RESUMEN.md`
   y en `QA-DEFECTS.md` — violando su propio principio de independencia, la inmutabilidad
   auditable de PTSA (`PTSA-R19`) y la prohibición de QA de cerrar defectos sin decisión
   humana (`QA-R11`). Además inventaba `CLOSED-WONTFIX` y `CLOSED-ACCEPTED`, que no
   existían en ninguna máquina de estados (`LEX-R09`).

4. FDGE recorre su ciclo normal con todas sus compuertas. Al cerrar, registra en
   `HISTORY.log` la línea `Trazabilidad externa: [H-XXX] [QD-XXX] [R-XXX]`.

5. En el siguiente `delta PTSA`, la auditoría re-evalúa el producto y actualiza el Score.

6. La próxima corrida FPGE ve el estado nuevo y reordena. **El ciclo se cierra.**

---

## `ROADMAP_HISTORY.log`

Append-only. Una entrada por corrida y una por decisión.

```
## 2026-08-05 — Corrida FPGE
- Basado en: PTSA Health 82/B freshness FRESH · QA 74/QA-C freshness STALE (41 días)
             · HISTORY @ PT-042 · INCIDENTS: 0 abiertos
- Candidatos: 14
- Confidence 0.7 aplicado a: R-004, R-009 (evidencia únicamente QA con score STALE)
- Bloqueados por QA-F: ninguno
- Top impacto: R-003, R-005, R-009
- Top quick wins: R-007, R-001, R-012

## 2026-08-06 — Decisiones humanas
- R-003 READY → promovido a PT-043 (Intake pendiente de firma). Evidencia: H-008 / P-008.
- R-007 READY → promovido a PT-044 (Intake pendiente de firma).
- R-010 DEFERRED. Motivo: depende de la migración de la pasarela, prevista para Q4.
- R-012 REJECTED. Motivo: comportamiento aceptado por negocio.
        Instrucción emitida: `audit PTSA close H-014 as REJECTED` — pendiente de ejecución.
```

---

## Cadencia

FPGE es **a petición**, nunca continuo. Momentos naturales para dispararlo:

* Después de un `delta PTSA` (el Score cambió → el orden puede cambiar).
* Después de un ciclo QA completo (hay defectos nuevos).
* Al inicio de una planeación, para decidir qué entra.
* Cuando `HANDOFF.md` acumula acciones recomendadas sin atender.
* Cuando se cierra un `INC-NNN` y su trabajo de seguimiento debe priorizarse.

---

## Portabilidad

1. **Prerrequisitos:** al menos uno de FDGE, QA o PTSA operando y produciendo evidencia.
   FPGE no aporta valor sin ninguno.
2. Copiar `Framework-FPGE.md`, este archivo y `FPGE-Prompts.md` a `docs/methodology/`.
3. Crear `docs/implementation/ROADMAP.md` con el encabezado del schema y
   `ROADMAP_HISTORY.log` vacío.
4. Añadir la sección de FPGE al `CLAUDE.md` del proyecto (ver `Suite-CLAUDE-Template.md`).
5. Ajustar las rutas de entrada si el proyecto ubica los artefactos en otro lugar.
6. Disparar `[START FPGE]` y verificar que cada ítem cita evidencia real.

El algoritmo y los estados son universales; lo único específico del proyecto son las rutas.
