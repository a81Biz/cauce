# FIDE — Implementación y Prompts

> **Naturaleza: procedimental.** Método: [Framework-FIDE.md](Framework-FIDE.md) ·
> Reglas: [RULES.md](../RULES.md) §Parte 10 · Vocabulario: [LEXICON.md](../LEXICON.md)
>
> Suite version: **13.1.0**

---

## Punto de entrada

```
[START FIDE] prompt: "[descripción de la app o del negocio]"
```

---

# PHASE 1 — Discovery

**Contexto:** el agente acaba de recibir `[START FIDE]`.

```
1. VERIFICACIÓN DE IDEMPOTENCIA                                             [FIDE-R02]
   Lee el directorio actual. Si existe docs/enterprise-documentation/00-Business-Case.md,
   un package.json o un docker-compose.yml: NO destruyas nada.
   Pregunta si se retoma la sesión previa o se aborta.

2. INVESTIGACIÓN WEB — real, no recordada
   - 3 competidores clave y su propuesta de valor.
   - Modelos de monetización vigentes en el nicho.
   - Stack tecnológico moderno más eficiente para este tipo de aplicación
     (frontend, backend, base de datos, infraestructura).

3. Pasa a PHASE 2.
```

---

# PHASE 2 — Advisory

```
1. Presenta el DISCOVERY BRIEF:
   - Resumen del mercado y de los competidores.
   - Recomendación formal de stack, justificando por qué encaja en este nicho.
   - Recomendación de infraestructura y DevOps.

2. DETENTE y pide aprobación:
   «¿Estás de acuerdo con este enfoque tecnológico y de negocio, o quieres modificar el
    stack o el alcance antes de generar la documentación y el código base?»

3. Si el usuario propone una opción subóptima: ADVIERTE del riesgo.              [FIDE-R03]
   Si insiste: OBEDECE y registra la decisión en 11-Conventions.md bajo
   «Deuda Técnica Aceptada desde el Día Cero».

4. ALTO. No pases a PHASE 3 sin un [ACK] explícito del humano.
```

---

# PHASE 3 — Blueprinting

`FIDE-R04` y `LEX-R11` · **Los nombres de archivo son los canónicos de `LEXICON.md` §6.1. No inventes
una numeración propia.** Los consumidores de esta carpeta —FDGE, QA, PTSA y FPGE— leen rutas
exactas; una numeración alternativa los rompe a todos en silencio.

Genera en `docs/enterprise-documentation/`:

```
00-Business-Case.md          ← único documento propio de FIDE, fuera del rango de Foundation
                               Problema, propuesta de valor, audiencia, KPIs que PTSA auditará

01-Platform-Overview.md      Resumen ejecutivo, visión, diagrama de arquitectura
02-PRD.md                    Problema, usuarios, casos de uso, reglas de dominio, épicas
03-TRD.md                    Stack, infraestructura, variables de entorno, comandos
04-App-Flow.md               Flujos end-to-end con diagramas Mermaid
05-UI-UX-Brief.md            Si hay frontend planificado
06-Backend-Architecture.md   Servicios previstos, rutas, middleware, patrones
07-Database-Architecture.md  Si hay base de datos
08-API-Catalog.md            Si hay API HTTP
09-Security-Architecture.md  Auth, autorización, CORS, riesgos
10-Technical-Debt.md         Deuda aceptada desde el día cero (PHASE 2)
11-Conventions.md            Reglas de código, naming, y ≥ 3 Hard Rules RULE-nn   [FND-R05]

inventory/
  routes.md · endpoints.md · entities.md · components.md · services.md · integrations.md

README.md                    Índice del paquete, fecha de generación y scope
```

> **Naturaleza distinta a la de Foundation.** Foundation documenta lo que **existe**
> (`FND-R01`: nada se inventa). FIDE documenta lo que se va a **construir**. Por eso el
> paquete de FIDE es una **intención**, no una fotografía, y debe declararlo en su
> `README.md`. Ver `FIDE-R06` más abajo.

---

# PHASE 4 — Scaffolding

```
1. INIT
   Ejecuta los inicializadores acordados (npm create…, git init, etc.).

2. ENTORNO LOCAL
   docker-compose.yml con las dependencias locales (base de datos, caché).

3. CI/CD
   .github/workflows/ci.yml configurado para testear y desplegar según la arquitectura
   elegida. Incluye el paso de verificación de la suite:
     node docs/methodology/tools/verify-fdge.mjs --all

4. INYECCIÓN DE LA SUITE                                                    [FIDE-R04]
   Copia desde el anfitrión a docs/methodology/ del huésped:
     CORE.md          ← IMPRESCINDIBLE: es lo único que el agente carga (SUITE-R15)
     PHASES.md        ← fuente del procedimiento que compila CORE.md
     LEXICON.md · RULES.md · EXECUTION-MODES.md · CHANGELOG.md
     Foundation-Protocol.md · Foundation-Implementation.md · Foundation-Prompts.md
     Framework-FDGE.md · FDGE-Implementation.md · FDGE-Prompts.md
     Framework-FPGE.md · FPGE-Implementation.md · FPGE-Prompts.md
     INTAKE/  (protocolo + las 3 plantillas)
     QA/      (Framework-QA.md · QA-Implementation.md · QA-Prompts.md)
     PTSA/    (especificación oficial + PTSA-Prompts.md)
     tools/   (build-core.mjs · verify-fdge.mjs · verify-suite.mjs · migrate.mjs · selftest.sh)

   Tras copiar, ejecuta `node docs/methodology/tools/build-core.mjs docs/methodology`
   para regenerar CORE.md en el huésped y comprobar que sus fuentes viajaron completas.

   NO copies la carpeta FIDE/.                                              [FIDE-R01]

   FIDE v3 copiaba solo «FDGE, QA, PTSA y FPGE» y omitía Foundation —dejando el CLAUDE.md
   del huésped apuntando a un documento de autoridad que no existía.

5. ESTRUCTURA DE ARTEFACTOS
   docs/implementation/
     REGISTRY.json      inicializado con suite_version, execution_mode y contadores a 0
     HISTORY.log · INCIDENTS.log · SESSION_LOG.md      vacíos
     HANDOFF.md · BACKLOG.md                           con su encabezado
     DISCOVERY.md · ENRICHMENT.md · REFACTOR_SCOPE.md  con su cabecera de índice
     ROADMAP.md · ROADMAP_HISTORY.log
     evidence/
   changes/
   QA/  (QA-PLAN.md · QA-DEFECTS.md · QA-LOG.md · qa-score-history.json «[]» · cases/ · reports/)
   qa/  (tests/ · fixtures/)
   playwright.config.ts
   PTSA/ (RESUMEN.md · ESTADO_ACTUAL.md · AUDIT_LOG.md · PENDIENTES.md · RELACIONES.md ·
          audit-scope.yaml · score-history.json «[]» · Phases/ · Findings/ · Evidence/ · Products/)

   REGISTRY.json inicial:
   {
     "suite_version": "5.2.0",
     "execution_mode": "SUPERVISED",
     "counters": { "PT":0,"EP":0,"QA":0,"QR":0,"QD":0,"H":0,"E":0,"P":0,"R":0,"INC":0 },
     "allocations": []
   }
```

---

# PHASE 5 — Handoff

```
1. DESGLOSE DEL PRD
   Convierte las épicas de 02-PRD.md en features atómicas.
   Registra cada una en docs/implementation/ENRICHMENT.md como línea de ÍNDICE:

   | PT-— | FEATURE | S3 | DRAFT | <título> | (sin PT asignado aún) | YYYY-MM-DD |

   Estado DRAFT, nunca READY.                                               [FIDE-R05]
   Cada feature necesitará su Intake firmado en FDGE PHASE 1 antes de construirse.
   Un PRD generado por un agente a partir de una consultoría es un punto de partida
   excelente; no es una declaración de intención firmada.

2. PRIMER ROADMAP
   Escribe docs/implementation/ROADMAP.md con el primer lote propuesto (todos en DRAFT),
   ordenado por dependencia técnica: autenticación → dominio base → funcionalidad.

3. DECLARAR LA NATURALEZA DEL PAQUETE                                       [FIDE-R06]
   En docs/enterprise-documentation/README.md, declara explícitamente:

   > **Origen: FIDE (greenfield).** Este paquete documenta la arquitectura *prevista*, no
   > una implementación observada. Sus afirmaciones NO cumplen todavía FND-R01 («nada se
   > inventa»): son decisiones de diseño, no hechos verificados en el código.
   >
   > Ejecutar `[START FOUNDATION]` cuando exista código sustantivo, para reemplazar la
   > intención por la observación. Hasta entonces, PTSA auditará contra un dominio
   > declarado pero no contra una arquitectura verificada.

   Esta declaración es obligatoria. Sin ella, todo consumidor del paquete asume —como hace
   con cualquier salida de Foundation— que cada afirmación está respaldada por el código.

4. REEMPLAZO DEL ANFITRIÓN
   Lee Suite-CLAUDE-Template.md del anfitrión y SOBRESCRIBE COMPLETAMENTE el CLAUDE.md
   del huésped. Esto borra las reglas de FIDE e instala las operativas.
   Declara mode: SUPERVISED en la sección de modo de ejecución.

5. CIERRE
   «Incubación FIDE completada. Suite 5.2.0 instalada, modo SUPERVISED.

    Siguiente paso: `promote FPGE R-001` para llevar el primer ítem a FDGE PHASE 1 (Intake).
    Tendrás que firmar su Intake antes de que empiece la construcción.

    Cuando exista código sustantivo, ejecuta `[START FOUNDATION]` para sustituir la
    documentación de intención por documentación verificada contra el código.»
```
