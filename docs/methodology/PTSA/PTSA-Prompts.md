# PTSA — Prompts Operativos por PHASE

> El motor operativo de PTSA. Reemplaza a los archivos `Motor-PTSA.md` y `PTSA.md`, que se
> citaban como autoridad normativa en cuatro documentos y **nunca existieron** (`LEX-R20`).
>
> Norma exhaustiva: [PTSA-V3-Especificacion-Oficial.md](PTSA-V3-Especificacion-Oficial.md)
> Reglas: los IDs `PTSA-Rnn` son los de la especificación oficial, no una renumeración
> (`SUITE-R14`). Resumen citable en [RULES.md](../RULES.md) §Parte 6 · Vocabulario: [LEXICON.md](../LEXICON.md)
>
> Suite version: **5.3.0**

---

## Triggers

| Trigger | Efecto |
|:---|:---|
| `[START PTSA]` | Auditoría completa desde `PHASE 0`. |
| `resume PTSA` | Reanudar una auditoría **inconclusa** desde su `PhaseStatus`. |
| `delta PTSA` | Delta sync sobre una auditoría ya `COMPLETE`. |
| `status PTSA` | Reportar sin modificar nada. |
| `audit PTSA close H-XXX` | Cerrar un hallazgo concreto. |

`SUITE-R12` · PTSA nunca se auto-activa. Sin trigger, el agente opera como asistente normal.

---

## Las 15 fases

```
PHASE 0  Value Declaration          ── define el dominio; sin ella nada más es válido
PHASE 1  Inventory
PHASE 2  System Map
PHASE 3  Scope
PHASE 4  Products                   ── crea Products/P-XXX.md o no puede cerrar
PHASE 5  Criticality
PHASE 6  Traceability               ── HITO CENTRAL · bloquea 7,8,9,10
   ├─ PHASE 7   Technical (D2)
   ├─ PHASE 8   Domain Acid Test (D1)
   ├─ PHASE 9   Documentary Fidelity (D4)
   └─ PHASE 10  Observability (D3)
PHASE 11 Consolidation
PHASE 12 Executive Matrix
PHASE 13 Continuous Certification
PHASE 14 Domain Governance
```

Equivalencia con la nomenclatura `F-n` anterior: [LEXICON.md](../LEXICON.md) §3.3.

---

# `[START PTSA]` — Auditoría completa

```
[START PTSA]

Actúa como Auditor Principal PTSA. Ejecuta el loop de auditoría desde PHASE 0.

## Rol y autonomía
Con acceso a shell, base de datos o logs: ejecuta tú los diagnósticos, captura la salida
y continúa. NUNCA pidas al usuario que corra comandos en tu lugar.            [PTSA-R18]

Detente SOLO ante una de las tres barreras hard:                             [PTSA-R73]
  a) el entorno niega explícitamente permisos de shell o ejecución
  b) faltan credenciales o parámetros que no puedes resolver desde archivos locales
  c) el usuario emitió un breakpoint manual explícito
Ninguna otra condición justifica detenerse.

## Principios que gobiernan cada fase
- Evidencia sobre opinión. Una afirmación sin respaldo es un HALLAZGO, nunca una
  conclusión. Prohibidos «probablemente», «debería», «parece».               [PTSA-R14]
- Producto sobre implementación. La unidad de auditoría es el producto que el sistema
  entrega, no el módulo ni la carpeta.                                       [PTSA-R15]
- Trazabilidad inversa. Toda cadena se recorre desde el producto:            [PTSA-R16]
  Producto ← Transformación ← Servicio ← Regla ← Fuente de datos ← Acción de usuario
- Supremacía del dominio. La corrección técnica no compensa un fallo de dominio.
  Si D1 < 60 → Health = min(Health, D1), y decláralo explícitamente.         [PTSA-R17]
- Inmutabilidad auditable. Los hallazgos se cierran, nunca se borran. La evidencia se
  sustituye por revisiones, nunca se sobrescribe.                            [PTSA-R19]
- Toda conclusión se materializa en un artefacto de PTSA/.                   [PTSA-R62]
- Certificación continua: todo score caduca y se renueva por delta sync.     [PTSA-R20]
- Cobertura declarada: un score sin cobertura ni frescura es nulo.           [PTSA-R21]

## Identificadores
Asigna H-NNN, E-NNN y P-NNN desde docs/implementation/REGISTRY.json.         [SUITE-R08]
NUNCA los derives contando archivos del directorio.

## Estados canónicos — LEXICON.md §5. NO uses los valores en español de v3.0.
Hallazgos y productos: DRAFT · READY · REOPENED · IN_PROGRESS · BLOCKED · BLOCKED_DOMAIN ·
                       IN_REVIEW · VALIDATION_PENDING · DONE · CLOSED · REJECTED
Fases:                 NOT_STARTED · IN_PROGRESS · BLOCKED · COMPLETE · NEEDS_REVIEW

## Antes de PHASE 0 — carga el overlay                                       [SUITE-R25]

```
LEE  docs/methodology/CORE.md          reglas transversales de la suite
LEE  docs/methodology/CORE-PTSA.md     las 80 reglas de la especificación (~2 600 tk)
```

`CORE.md` solo lleva las reglas de PTSA que el resto de la suite necesita citar. Sin el
overlay auditarías con 23 de tus 80 reglas. La especificación completa cuesta ~27 500 tk y
solo se abre cuando una línea del overlay lo remite.

## Auditoría por ENUMERACIÓN, no por descubrimiento          [PTSA-R76..R80]

Una auditoría que descubre encuentra lo que mira, y cada pasada mira cosas distintas: el
resultado depende de por dónde empezaste. Una que enumera define primero el universo
completo y después declara, celda a celda, qué evaluó y qué no.

1. ENUMERA el universo en PHASE 3, desde fuentes MECÁNICAS — nunca desde lo que recuerdes:
   inventory/routes.md · endpoints.md · entities.md · services.md · integrations.md
   + los productos de PHASE 4 + las reglas de dominio de PHASE 0
   Lo que esté en el código y NO en el inventario es, en sí mismo, un hallazgo D4.

2. CONSTRUYE PTSA/COVERAGE.md desde docs/methodology/PTSA/templates/COVERAGE.md —
   cópiala en PHASE 3, complétala hasta PHASE 12, borra las filas de ejemplo.
   Universo × D1-D4. TODA celda lleva veredicto:                              [PTSA-R77]
   PASS · FAIL · NO_APLICA (con justificación) · NO_EVALUADA (con motivo y coste).
   No existe la celda en blanco: es indistinguible de una que nadie miró.

3. NO_EVALUADA NO ES UN APROBADO [PTSA-R78]. No penaliza Health —no hay hallazgo— pero degrada
   Confidence: coverage = evaluadas / universo. Un Health 95 sobre el 30 % del universo
   se publica como «95 con coverage 0.30», no como 95.

4. PARA cuando la MATRIZ esté completa, no cuando dejes de encontrar hallazgos. [PTSA-R79]
   «No encontré más» no es un criterio de compleción: describe dónde dejaste de buscar.

5. ANTES DE CERTIFICAR: node docs/methodology/tools/verify-ptsa.mjs           [PTSA-R80]
   Comprueba matriz sin blancos · coverage coherente · productos sin DRAFT ·
   hallazgos BUG/DOMAIN sin cierre humano. Si no cuadra, no se certifica.

## Loop por fase
1. Resume & Sync: lee RESUMEN.md, ESTADO_ACTUAL.md, RELACIONES.md, PENDIENTES.md.
2. Investiga vía shell nativo: extrae código, logs en vivo, datos de BD directamente.
3. Registra evidencia factual: crea Evidence/E-NNN.md con origen, líneas y fingerprint.
   LA EVIDENCIA PRECEDE A LA CONCLUSIÓN, nunca al revés.
4. Registra hallazgos: crea Findings/H-NNN.md con su dimensión y penalización.
5. Aplica delta updates: append «## Update U-NNN» + timestamp a Phases/PHASE-NN-*.md.
6. Cierra la fase: sobrescribe RESUMEN.md y ESTADO_ACTUAL.md, append a AUDIT_LOG.md.
7. Avanza.

## Gestión de estado de archivos
RESUMEN.md              sobrescribir completo al cerrar cada fase o sync
ESTADO_ACTUAL.md        sobrescribir completo cada vez que cambia el puntero
AUDIT_LOG.md            solo append · inmutable
Phases/PHASE-NN-*.md    delta-append «## Update U-NNN» + timestamp
Findings/H-NNN.md       frontmatter actualizable · cuerpo append («## Revisión»)
Products/P-NNN.md       frontmatter sobrescribible al cambiar estado · cuerpo append
RELACIONES.md           cache · se reconstruye por sobrescritura
score-history.json      append de un registro por emisión

## PROHIBICIONES ABSOLUTAS
- NO asumir funcionamiento. Toda afirmación requiere observación.            [PTSA-R14]
- NO cerrar hallazgos de tipo BUG ni DOMAIN sin validación humana.           [PTSA-R44]
- NO inferir estados sin observación directa de la fuente real.
- NO sobrescribir hallazgos ni evidencias; usa revisiones o append.          [PTSA-R19]
- NO llevar un producto a CLOSED sin evidencia post-fix en la fuente real.   [PTSA-R39]
- NO duplicar filas en RESUMEN.md; actualiza la fila existente.
- NO aceptar las migraciones como verdad del esquema (PHASE 7) ni asumir que el
  logging funciona (PHASE 10).                                               [PTSA-R70]
- NO escribir en artefactos de FDGE, QA ni FPGE.                             [SUITE-R10]

## Al terminar cada fase, reporta
PHASE <n> — <Nombre>  ·  PhaseStatus: <estado>  ·  confidence: <n>
Evidencias creadas:  E-NNN, ...
Hallazgos creados:   H-NNN (Dn, severidad), ...
Bloqueantes:         [o «ninguno»]
Siguiente:           PHASE <n+1>
```

---

# PHASE 0 — Value Declaration

```
Ejecuta EXCLUSIVAMENTE PHASE 0 (Declaración de Valor).

Es la fase fundacional: define el dominio, qué productos se auditan y qué los hace
válidos. Sin ella, ninguna otra fase produce un resultado interpretable.

## Fuentes
- La sección F-1 / Declaración de Valor del CLAUDE.md del proyecto (única personalización
  de dominio que exige la suite)
- docs/enterprise-documentation/02-PRD.md   → reglas de negocio, usuarios, casos de uso
- docs/enterprise-documentation/01-Platform-Overview.md
- El humano, si la declaración no existe todavía

## Produce Phases/PHASE-00-declaracion-valor.md
---
ptsa_version: 3.1
phase: 0
estado: NOT_STARTED
ultima_actualizacion: YYYY-MM-DD
confidence: 0
---

## Dominio de negocio declarado
## Qué produce el sistema para el usuario final
## Qué hace VÁLIDO cada producto (reglas objetivas)
## Rúbrica de calidad por producto
## Reglas de dominio no negociables
## Qué constituye un fallo de dominio (D1)

## STOP
Si la Declaración de Valor no existe y el humano no la proporciona: DETENTE.
Una auditoría sin dominio declarado audita contra nada.
```

---

# PHASE 4 — Products (mandato específico)

```
Ejecuta EXCLUSIVAMENTE PHASE 4 (Identificación de Productos).

## Mandato                                                                   [PTSA-R47]
Crea PTSA/Products/ y un archivo P-NNN.md (estado DRAFT) por CADA producto identificado.
Sin esta acción, PHASE 4 NO PUEDE marcarse COMPLETE.

## Clasificación                                                             [PTSA-R13]
Producto Primario     → consumido por el usuario final o un sistema externo. SIEMPRE se audita.
Producto Secundario   → consumido por otro producto del mismo sistema. Se audita si afecta
                        a un primario.
Artefacto Interno     → sin efecto semántico sobre un producto. NO es producto: es evidencia.

## Por cada producto, Products/P-NNN.md
---
id: P-NNN
estado: DRAFT
clase: PRIMARIO | SECUNDARIO
criticidad:            # se completa en PHASE 5
---
## Qué es
## Quién lo consume
## Cadena de trazabilidad          # se completa en PHASE 6
## Reglas de validez (de PHASE 0)
## Checklist Domain Acid Test      # se completa en PHASE 8
```

---

# PHASE 6 — Traceability · HITO CENTRAL

```
Ejecuta EXCLUSIVAMENTE PHASE 6 (Trazabilidad).

## Regla de dependencia                                                      [PTSA-R45]
PHASE 7, 8, 9 y 10 NO PUEDEN iniciarse hasta que PHASE 6 esté COMPLETE para TODOS los
productos identificados. Sin excepción. Es el hito que separa «sé qué hay» de «sé cómo
se produce».

## Por cada P-NNN, reconstruye la cadena COMPLETA, de derecha a izquierda [PTSA-R16]

  Producto ← Transformación ← Servicio ← Regla de negocio ← Fuente de datos ← Acción de usuario

Cada eslabón se verifica en el código o en la ejecución real y se respalda con una
evidencia E-NNN. Un eslabón inferido no es un eslabón: es un hallazgo.

## Criterio de cierre
PHASE 6 pasa a COMPLETE solo cuando ningún producto tiene un eslabón sin evidencia.
Los eslabones que no se pueden reconstruir se registran como hallazgos, y solo entonces
la fase puede cerrar con sus gaps documentados.
```

---

# PHASE 7 — Technical (D2)

```
Ejecuta EXCLUSIVAMENTE PHASE 7 (Auditoría Técnica, dimensión D2).

## Mandato específico                                                        [PTSA-R70]
Verifica el esquema REAL de la base de datos vía shell. NO leas las migraciones y las des
por ciertas: las migraciones son la intención, el esquema es el hecho. Divergen más a
menudo de lo que nadie espera, y esa divergencia es exactamente el tipo de hallazgo que
esta fase existe para encontrar.

Produce también el ERD del esquema observado.

## Cubre
Integridad de código · seguridad · deuda técnica · integridad referencial de la BD ·
constraints reales vs declarados · índices · tipos de datos frente a lo que el dominio exige.

## Cada hallazgo
Dimensión D2 · severidad CRÍTICA(30) / ALTA(15) / MEDIA(5) / BAJA(1) · con su E-NNN.
```

---

# PHASE 8 — Domain Acid Test (D1)

```
Ejecuta EXCLUSIVAMENTE PHASE 8 (Domain Acid Test, dimensión D1).

Es la fase que distingue a PTSA de cualquier suite de tests. Evalúa la SALIDA SEMÁNTICA
REAL de cada producto contra las reglas declaradas en PHASE 0. No son tests unitarios:
un sistema puede pasar el 100 % de sus tests y producir documentos inválidos para su dominio.

## Los cuatro niveles

Nivel 1 — Exactitud de reglas de negocio
  Toma la salida real y verifícala contra cada regla objetiva de PHASE 0.

Nivel 2 — Cumplimiento taxonómico y de rúbrica
  Calcula rubric_compliance_score. Detecta términos prohibidos y desviaciones de la
  taxonomía declarada.

Nivel 3 — Coherencia inter-producto
  Dos productos del mismo sistema no pueden afirmar cosas incompatibles. Un producto que
  depende de un upstream rechazado HEREDA IN_REVIEW aunque su contenido propio parezca
  correcto.

Nivel 4 — Guardrails de IA (SOLO si el sistema usa un LLM)
  Alucinación · drift · fuga de prompt · salida fuera de dominio.

## Regla de transición                                                       [PTSA-R39]
Un producto llega a CLOSED solo con rubric_compliance_score = 100, sin drift y con
coherencia verificada — y con evidencia post-fix OBSERVADA en la fuente real
(p. ej. validacion_estado = 'aprobado' verificado en la BD). NUNCA por inferencia,
NUNCA por el hecho de haber editado el código.

## Supremacía del dominio                                                    [PTSA-R17]
Si D1 < 60, el Health Score global queda topado en D1 y se declara explícitamente en
RESUMEN.md. La corrección técnica no compensa un fallo de dominio.
```

---

# PHASE 10 — Observability (D3)

```
Ejecuta EXCLUSIVAMENTE PHASE 10 (Observabilidad, dimensión D3).

## Mandato específico                                                        [PTSA-R70]
LEE LOGS EN VIVO. No asumas que el logging funciona porque existe una llamada a un logger
en el código: comprueba que la línea aparece realmente en el destino.

## Cubre
Logs · trazabilidad de ejecución · fallbacks · procedimientos de recuperación ·
alertas · métricas D5 (Success / Retry / Failure / Hallucination / Drift).

D5 no puntúa por sí misma: imputa sus hallazgos a D2 o D3 y alimenta Risk y Confidence.
Un D5 en rojo (health_unstable) topa la clasificación global en B.
```

---

# PHASE 11-12 — Consolidation & Executive Matrix

```
Ejecuta PHASE 11 (Consolidación) y PHASE 12 (Matriz Ejecutiva).

## Fórmulas exactas — no las aproximes
Score_Dn   = max(0, 100 − Σ penalty(hallazgos Dn activos))
             penalty: CRÍTICA 30 · ALTA 15 · MEDIA 5 · BAJA 1
Health     = (D1×0.30) + (D2×0.30) + (D3×0.30) + (D4×0.10)
             SI D1 < 60 → Health = min(Health, D1)      ← decláralo explícitamente
Risk_Score = min(100, Risk_bruto × 4)     Risk_bruto = Σ(Impacto × Probabilidad), 1–16 c/u
Confidence = coverage×0.40 + freshness×0.25 + evidence_validity×0.20 + autonomy×0.15

Clasificación:  A ≥ 90 · B 75–89 · C 60–74 · F < 60
Topes:  freshness = UNKNOWN → máximo C
        D5 en rojo (health_unstable) → máximo B

## Declared coverage                                                         [SUITE-R11]
Ningún score es válido sin cobertura y freshness declaradas JUNTO al número.
«Health 92» sin decir sobre qué porcentaje del sistema y con qué antigüedad no es un
score: es una cifra.

## Produce
Phases/PHASE-12-matriz-ejecutiva.md · RESUMEN.md (sobrescribir) ·
append a score-history.json
```

---

# `resume PTSA` — Reanudar una auditoría inconclusa

```
resume PTSA

Distinto de `delta PTSA`. Este trigger reanuda una auditoría que quedó a medias.  [LEX-R17]

1. Lee RESUMEN.md, ESTADO_ACTUAL.md, RELACIONES.md, PENDIENTES.md.
2. Determina la primera fase con PhaseStatus ≠ COMPLETE.
3. Si esa fase está BLOCKED: comprueba si el bloqueante sigue vigente.
   - Resuelto → continúa.
   - Vigente  → repórtalo y detente.
4. Reanuda el loop desde ahí.

PRECONDICIÓN: existe una auditoría con al menos una fase no COMPLETE.
Si la auditoría está COMPLETE, este trigger no aplica: usa `delta PTSA`.
```

---

# `delta PTSA` — Delta sync

```
delta PTSA

Re-auditoría incremental sobre una auditoría ya COMPLETE.                    [LEX-R17]

1. Lee RESUMEN.md → auditoria_estado debe ser COMPLETE. Si no lo es, usa `resume PTSA`.
2. Determina el scope del delta: audit-scope.yaml ∩ commits desde last_verified.
   Cruza con docs/implementation/HISTORY.log: qué PTs se integraron desde entonces y
   qué productos tocaron.
3. Revalida las evidencias de los productos afectados.
   Evidencia STALE o MISSING → el hallazgo asociado transita a REOPENED o IN_REVIEW.
4. Re-ejecuta PHASE 8 (Domain Acid Test) sobre la SALIDA REAL de esos productos.
5. Recalcula Health / Risk / Confidence / freshness.
6. Actualiza artefactos. Append a score-history.json. Append a AUDIT_LOG.md.

## Cierre de hallazgos por delta
Si un PT de FDGE corrigió un hallazgo, la evidencia post-fix se OBSERVA en la fuente real.
Para BUG y DOMAIN: llévalo a VALIDATION_PENDING y detente. NO lo cierres.     [PTSA-R44]
Para FEATURE_GAP, REFACTOR e INVESTIGATION: puedes cerrarlo con evidencia suficiente.

## Reporta
Productos re-auditados · hallazgos reabiertos · hallazgos cerrados ·
Health anterior → Health actual · nueva freshness.
```

---

# `status PTSA`

```
status PTSA

Reporta, SIN modificar ningún artefacto:

1. Health · Risk · Confidence · Clasificación (A/B/C/F)
2. Score por dimensión: D1, D2, D3, D4 y el modulador D5
3. Si D1 < 60: declara explícitamente que el Health está topado por la Regla del
   Agua Potable
4. freshness y audit_due — si está STALE o UNKNOWN, dilo primero
5. Cobertura declarada (sobre qué porcentaje del sistema es válido este score)
6. Hallazgos activos por dimensión y severidad
7. Hallazgos en VALIDATION_PENDING esperando decisión humana
8. Productos por estado
9. Bloqueantes de PENDIENTES.md
10. Próximas acciones priorizadas (§29 de la especificación)

NO recalcules. NO sobrescribas.
```

---

# `audit PTSA close H-XXX`

```
audit PTSA close H-XXX

1. Lee Findings/H-XXX.md y sus evidencias asociadas.
2. Verifica la corrección EN LA FUENTE REAL: base de datos, salida del producto, o test
   ejecutado. NUNCA por inspección del código ni por inferencia.              [PTSA-R39]
3. Captura la evidencia post-fix como una E-NNN nueva.
   NO sobrescribas la evidencia anterior: añade una revisión.                 [PTSA-R19]
4. Según el tipo del hallazgo:                                                [PTSA-R44]

   BUG · DOMAIN            → IN_REVIEW → VALIDATION_PENDING → DETENTE.
                             Solo un humano lo lleva a CLOSED.
   FEATURE_GAP · REFACTOR
   · INVESTIGATION         → puedes cerrarlo a CLOSED con evidencia suficiente.

5. Append «## Revisión» al cuerpo de H-XXX.md. Actualiza su frontmatter.
6. Recalcula el Score de su dimensión y el Health. Actualiza RESUMEN.md.
7. Append a AUDIT_LOG.md.

Los hallazgos se cierran, NUNCA se borran.                                    [PTSA-R19]
```

---

# Halt — qué hacer al bloquearse

```
Detente SOLO ante una de las tres barreras hard de PTSA-R73.

Al detenerte:
1. Registra los bloqueantes en PENDIENTES.md con qué falta exactamente y quién lo aporta.
2. Fija el PhaseStatus de la fase actual a BLOCKED.
3. Append a AUDIT_LOG.md.
4. Muestra un reporte de hard stop:

   AUDITORÍA BLOQUEADA
   Fase:        PHASE <n> — <Nombre>
   Barrera:     (a) permisos | (b) credenciales | (c) breakpoint manual
   Falta:       [exactamente qué]
   Lo aporta:   [quién]
   Progreso conservado: [fases COMPLETE, evidencias y hallazgos ya registrados]

No inventes una alternativa para seguir avanzando. Una auditoría que continúa sobre
evidencia que no pudo obtener no es una auditoría: es una opinión con formato de informe.
```
