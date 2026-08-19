# FIDE — Launcher temporal para Claude

> **Instrucciones para el humano:**
> 1. Crea una carpeta vacía donde vivirá tu nuevo proyecto.
> 2. Crea un archivo `CLAUDE.md` en su raíz y pega todo este texto dentro.
> 3. En Claude, escribe: `[START FIDE] prompt: "Quiero construir [TU IDEA]"`
> 4. Claude te entrevistará, investigará, generará la documentación y el código base, y al
>    terminar reemplazará este texto por la suite operativa completa.
>
> Suite version: **8.2.0**

---

# MODO ANFITRIÓN: FIDE ACTIVO

**[Atención, agente Claude]**

Estás operando bajo el **Framework de Investigación y Diseño Evolutivo (FIDE)**, el Eslabón
Cero de la Methodology Suite. Tu objetivo: tomar la idea del usuario, investigarla,
documentarla, crear el código base e instalar la suite operativa.

Documentos de referencia en el anfitrión (`C:/DevOps/claude/docs/methodology/`):
`Framework-FIDE.md` · `FIDE-Implementation.md` · `LEXICON.md` · `RULES.md`.

## Idempotencia

Antes de ejecutar cualquier comando, revisa si la carpeta tiene archivos. Si ya existe
`docs/enterprise-documentation/00-Business-Case.md`, un `package.json` o un
`docker-compose.yml`: **no destruyas nada**. Retoma la fase donde quedó o aborta limpiamente.

---

## FLUJO OBLIGATORIO

### PHASE 1 — Discovery
Investiga el nicho con búsquedas web reales. Identifica competidores, modelos de negocio y
el stack + DevOps ideal según las mejores prácticas actuales.

### PHASE 2 — Advisory
Presenta un **Discovery Brief** con tu propuesta de negocio, arquitectura y despliegue.
Pide aprobación. Si el usuario propone algo subóptimo, adviértele del riesgo; si insiste,
acata y registra la deuda en las convenciones.

**ALTO.** No pases a PHASE 3 sin un `[ACK]` explícito.

### PHASE 3 — Blueprinting

Genera `docs/enterprise-documentation/` con **exactamente estos nombres**. No inventes una
numeración propia: FDGE, QA, PTSA y FPGE leen rutas exactas, y una numeración alternativa
los rompe a todos en silencio.

```
00-Business-Case.md          ← único documento propio de FIDE
01-Platform-Overview.md      06-Backend-Architecture.md
02-PRD.md                    07-Database-Architecture.md   (si aplica)
03-TRD.md                    08-API-Catalog.md             (si aplica)
04-App-Flow.md               09-Security-Architecture.md
05-UI-UX-Brief.md  (si aplica)  10-Technical-Debt.md
                             11-Conventions.md   ← ≥ 3 Hard Rules en formato RULE-nn
inventory/  routes.md · endpoints.md · entities.md · components.md · services.md · integrations.md
README.md
```

### PHASE 4 — Scaffolding

1. Inicializadores (`npm create…`, `git init`).
2. `docker-compose.yml` con las dependencias locales.
3. `.github/workflows/ci.yml`, incluyendo el paso
   `node docs/methodology/tools/verify-fdge.mjs --all`.
4. **Instalación de la suite.** Copia desde `C:/DevOps/claude/docs/methodology/` a
   `docs/methodology/` del proyecto nuevo:

   ```
   CORE.md          ← IMPRESCINDIBLE: es lo único que el agente carga
   PHASES.md
   LEXICON.md · RULES.md · EXECUTION-MODES.md · CHANGELOG.md
   Foundation-Protocol.md · Foundation-Implementation.md · Foundation-Prompts.md
   Framework-FDGE.md · FDGE-Implementation.md · FDGE-Prompts.md
   Framework-FPGE.md · FPGE-Implementation.md · FPGE-Prompts.md
   INTAKE/ · QA/ · PTSA/ · tools/
   ```

   Después: `node docs/methodology/tools/build-core.mjs docs/methodology`

   **NO copies la carpeta `FIDE/`.** FIDE incuba desde fuera y se retira.
   **SÍ copia Foundation:** el `CLAUDE.md` que vas a instalar lo declara como autoridad.

5. Crea la estructura de artefactos, con `REGISTRY.json` inicializado:

   ```json
   {
     "suite_version": "5.2.0",
     "execution_mode": "SUPERVISED",
     "counters": { "PT":0,"EP":0,"QA":0,"QR":0,"QD":0,"H":0,"E":0,"P":0,"R":0,"INC":0 },
     "allocations": []
   }
   ```

   Más: `docs/implementation/` (ledgers, índices, `evidence/`) · `changes/` ·
   `QA/` + `qa/` + `playwright.config.ts` · `PTSA/` con sus subcarpetas.

### PHASE 5 — Handoff

1. Desglosa el PRD en features y regístralas como líneas de índice en
   `docs/implementation/ENRICHMENT.md`, **en estado `DRAFT`**.

   No las marques `READY`: cada una necesita su Intake firmado por un humano en FDGE
   PHASE 1 antes de construirse. Un PRD que redactaste tú a partir de una conversación es
   un punto de partida excelente, pero no es una intención declarada por el negocio.

2. Escribe `docs/implementation/ROADMAP.md` con el primer lote propuesto, ordenado por
   dependencia técnica.

3. **Declara la naturaleza del paquete** en
   `docs/enterprise-documentation/README.md`:

   > **Origen: FIDE (greenfield).** Este paquete documenta la arquitectura *prevista*, no
   > una implementación observada. Ejecutar `[START FOUNDATION]` cuando exista código
   > sustantivo para reemplazar la intención por la observación.

   Es obligatorio: sin esa nota, todo consumidor asumirá que cada afirmación está
   respaldada por el código, como ocurre con cualquier salida de Foundation.

4. **Relevo del anfitrión.** Lee
   `C:/DevOps/claude/docs/methodology/Suite-CLAUDE-Template.md` y **sobrescribe
   completamente este archivo `CLAUDE.md`**. Eso borra las reglas de FIDE e instala las
   operativas. Declara `mode: SUPERVISED`.

5. Cierra con:

   > *Incubación FIDE completada. Suite 5.2.0 instalada, modo SUPERVISED.*
   >
   > *Siguiente paso: `promote FPGE R-001` para llevar el primer ítem a FDGE PHASE 1
   > (Intake). Tendrás que firmar su Intake antes de que empiece la construcción.*
   >
   > *Cuando exista código sustantivo, ejecuta `[START FOUNDATION]` para sustituir la
   > documentación de intención por documentación verificada contra el código.*
