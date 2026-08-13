# PHASES — Directiva densa por fase

> **Fuente canónica del procedimiento.** `tools/build-core.mjs` la inserta íntegra en
> `CORE.md`; los `*-Prompts.md` son su expansión legible para copiar y pegar en modo
> `MANUAL`. Si difieren, manda este archivo (`LEX-R21`).
>
> Formato: `LEE` fuentes obligatorias · `HAZ` acciones · `SALE` artefactos · `NO` prohibido ·
> `PARA` condición de detención. Las reglas se citan por ID; su texto está en `CORE.md §Reglas`.
>
> Suite version: **5.1.0**

---

## Instalación

### INSTALL · `[INSTALL SUITE]` — «instala el framework»
```
INTERFAZ la CONVERSACIÓN, no el archivo. Ejecuta, RESUME en 10 líneas y PREGUNTA
         ahí mismo. Escribir un .md y decir «léelo y vuelve» desperdicia el único
         medio donde el humano ya está mirando.                              [SUITE-R28]
         Los artefactos se escriben igual: son el registro, no la interfaz.
I0 TERRENO   node tools/plan-layout.mjs      (sin --write: aún no se escribe) [FND-R20]
I0b SEGURIDAD node tools/revisar-secretos.mjs . --historial                    [FND-R29]
             ANTES de que nada se publique. Bloquea y PROPONE la corrección.
             Un secreto en la historia sigue ahí tras borrarlo del archivo.
             Falso positivo ⇒ se firma por escrito. NO se silencia el escáner.
    ACCESOS  gh auth status | az account show si va a declarar plataforma   [FND-R30]
             Descubrirlo a mitad de sesión es perder la sesión.
I1 DECISIÓN  el CRITERIO ya está en la herramienta, no en tu opinión del momento:
             destino: carpeta con package.json|docker-compose|playwright = RAÍZ;
                      sin marcas = src/                                       [FND-R25]
             historia git: >1 commit o remoto ⇒ conservar; si no ⇒ git init   [FND-R26]
             .gitignore que ignora todo o repo con 0 versionados ⇒ proponer uno[FND-R27]
             presenta cada propuesta NUMERADA y espera respuesta. Con ella,
             ESCRIBE TÚ LAYOUT.md resuelto: decisión, «Revisado por:» con el
             nombre de firmantes: y la CITA de lo que respondió.       G0     [FND-R22]
             NO inventes la decisión. Sin respuesta no hay firma.
I2 EJECUTAR  solo lo ACEPTADO. Enseña el comando antes de correrlo.
             REGISTRA cada acción en docs/implementation/INSTALL.log:          [SUITE-R30]
             qué · de dónde a dónde · respaldo · commit · resultado. Append-only.
             Cada entrada que ejecuta una decisión lleva su etiqueta [L<n>], el número
             de la propuesta en LAYOUT.md. Se DECLARA, no se deduce.
             Toda propuesta ACEPTADA tiene su entrada: una decisión sin ejecución
             registrada es una decisión que nadie sabe si se cumplió.
             Repo anidado: ofrece conservar historia vs git init y di qué se pierde.
I3 ESTRUCTURA cada espacio nace CON un archivo dentro: git no versiona directorios
             vacíos y un PTSA/ vacío desaparece en el primer clon.        [SUITE-R32]
             docs/{enterprise-documentation,implementation} · changes · evidence
             QA · qa · graphify-out · ledgers vacíos · REGISTRY con contadores a 0
I4 DEPS      node · git · python · graphifyy (grafo, FDGE-R43) · playwright (QA)
             una por una, con permiso y con su motivo.                       [SUITE-R29]
I5 GRAFO     /graphify con el ALCANCE que calculó plan-layout: código propio.  [FND-R28]
             FUERA dependencias, compilación, pruebas, fixtures y mocks.
             → graphify-out/graph.json → REGISTRY.graph
I6 CLAUDE.md desde Suite-CLAUDE-Template + suite_version, execution_mode, firmantes.
             La Declaración de Valor NO se pide aquí: la produce Foundation PHASE 0,
             que es donde ya se ha leído el código. Queda como marcador.      [FND-R24]
I6c ADOPTAR   proyecto con historia: node tools/tracker.mjs abrir --aplicar   [SUITE-R36]
             SOLO lo vivo. Lo cerrado es evidencia, no estado, y se queda en el
             repositorio. Un issue por trabajo terminado llena el tablero de
             cadáveres que el espejo reconcilia para siempre.
I7 VERIFICAR build-core · verify-suite · verify-fdge --all → resume en la conversación
I8 ARRANCAR  encadena [START FOUNDATION] (o [START FIDE] si no hay código todavía)
NO   mover sin firma · pedir la Declaración de Valor al instalar · instalar en silencio
     tocar la rama principal — SUITE-R06 rige desde el minuto cero
```

## FDGE

### Disciplina de respuesta — aplica a TODAS las fases
```
NO ESCRIBAS  lo que salió bien · por qué una decisión es correcta · justificaciones de
             diseño · recapitulaciones de lo acordado · preámbulos · cierres valorativos
ESCRIBE      lo que falla · lo que cambió · lo que queda · lo que necesita decisión
PORQUÉ       solo si el humano lo pide. Vive en design.md, HISTORY.log y CHANGELOG.md,
             que se leen cuando hacen falta y no en cada turno.                [SUITE-R23]
FORMATO      checkpoint de EXEC-R01: Hecho · Artefacto · Desviaciones · Riesgos · Siguiente
LEE ASÍ      este documento es telegráfico a propósito [SUITE-R24]: LEE·HAZ·SALE·NO·PARA.
             El rationale vive en los Framework-*.md, que NO se cargan. Quitar el porqué
             del texto que se EJECUTA es ganancia; quitar precisión de la regla no lo es.
```

### IMPLEMENTACIÓN · `[IMPLEMENTACIÓN]` · `[CIERRA]` — el bucle abierto
```
ABRIR   [IMPLEMENTACIÓN] <lo que se quiere construir>
        DECIDE con el criterio escrito, no con tu juicio del momento:       [FDGE-R50]
          PARTE DE la abierta  → toca sus productos · sirve a su criterio de éxito
                                 · corrige algo que ella introdujo
          NUEVA                → entrega valor que la abierta no prometió
                                 · el criterio de éxito de la abierta se cumple sin ella
        PROPÓN y espera confirmación. Si es nueva y hay una abierta, hay que
        cerrar la abierta primero: solo una a la vez.                       [FDGE-R48]

DENTRO  el default está INVERTIDO: todo lo que se diga pertenece a la abierta.  [FDGE-R49]
        NO preguntes «¿esto es nuevo?» en cada petición — lo raro es abrir y cerrar.
        Tarea nueva, mejora o arreglo: plantilla TAREA.md, sin ceremonia.    [FDGE-R51]
        qué se quiere + criterios de aceptación + qué NO. La firma, el veredicto
        de G1 y la severidad se heredan del lote.                            [INTAKE-R08]
        EXCEPCIÓN track HOTFIX: producción caída no espera a que se cierre nada.

CERRAR  [CIERRA] → el lote pasa a DONE y ENCADENA [START QA] sobre lo entregado.
        Cerrar es un acto explícito. Hasta entonces la implementación sigue abierta
        aunque la sesión termine — y ahí está su valor: sobrevive a la sesión.
NO      abrir dos a la vez · preguntar en cada arreglo si es nuevo · cobrar
        intake completo por una tarea de una implementación ya firmada
```

### PHASE 0 · Context
```
LEE  enterprise-documentation/README · REGISTRY.json · BACKLOG · HANDOFF
     HISTORY(3 últimos) · INCIDENTS · changes/ · graphify-out/
HAZ  comprobar: CORE.md presente y sincronizado [SUITE-R15, LEX-R25] · modo declarado; sin
     él se asume SUPERVISED [EXEC-R02] · solo un humano lo cambia [EXEC-R12]
     Foundation por ARCHIVOS del núcleo [FND-R08] · antigüedad(>10 PT→BAJA)
     suite_version vs CHANGELOG [SUITE-R13] · migración pendiente [SUITE-R17]
     restricción automática de compuertas [EXEC-R14] · hotfix vencido [EXEC-R11]
     grafo: FRESH|STALE|MISSING [FDGE-R43]
SALE SESSION_LOG (append): PT último · modo · suite · PTs vivos · comprobaciones · confianza
NO   diseñar · planificar · modificar · ejecutar comandos · avanzar solo
PARA siempre. Resumen ejecutivo y espera.
```

### PHASE 1 · Intake — **G1**
```
CIERRE   toda tarea declara EN UNA LÍNEA, observable, cómo termina.            [FDGE-R53]
         La deriva ocurre en tareas SIN FORMA: la que declara su final lo tiene.
         Si la condición necesita un «y además», son DOS tareas — y partirlas
         aquí es más barato que descubrirlo en G3.
```
```
LEE  petición o QD/H/R de origen · BACKLOG · HISTORY · ROADMAP (duplicados)
HAZ  1 asignar PT desde REGISTRY [SUITE-R08] · monotónico, nunca reutilizado [LEX-R04]
       si no puedes escribirlo, PARA
     2 crear changes/PT-XXX-slug/ + plantilla por tipo:
       BUG,INVESTIGATION→BUG-REPORT · FEATURE→FEATURE-REQUEST · REFACTOR,CHORE→CHANGE-REQUEST
     3 campos [HUMANO]: transcribir literal — el humano declara la intención y tú la
       expandes [FDGE-R02]. Si faltan, presentar plantilla y PARAR.
       Desde QD/H/R puedes redactar BORRADOR marcado como tal.
     4 campos [AGENTE]: formalizar AC-nn · complejidad · duplicados · OBSERVACIONES
     5 checklist DoR → VEREDICTO
     6 línea de índice en DISCOVERY|ENRICHMENT|REFACTOR_SCOPE [LEX-R12]
NO   firmar [INTAKE-R06] · deducir del código el comportamiento esperado [INTAKE-R01]
     inventar criterios [INTAKE-R02] · analizar · diseñar · crear ramas
SALE intake.md · línea de índice · entrada en REGISTRY
PARA G1 humana en los tres modos. PASS→PHASE 2 · FAIL→DRAFT+qué falta · CHALLENGE→decide humano
```

### PHASE 2 · Analysis — `2-B` bug/investigación · `2-E` feature · `2-R` refactor/chore
```
LEE  intake.md ← no lo contradigas
     01-Platform-Overview · 06-Backend-Architecture · 11-Conventions · 02-PRD · 03-TRD
     08-API-Catalog(si) · 09-Security(2-E) · HANDOFF · HISTORY(relacionadas) · graphify-out/
     código solo si la doc es insuficiente — y declara esa insuficiencia
HAZ  clasificar complejidad (severidad ya viene del Intake [FDGE-R04])
     2-B expandir qué/dónde/cuándo/cómo/por qué(hipótesis CON evidencia)
          confianzas RootCause·Architecture·Solution → <70% ⇒ INVESTIGATION [FDGE-R09]
     2-E formalizar AC-nn del Intake · derivar TS-nn citando su AC · NFRs con fuente
          transcribir out-of-scope y marcar lo añadido
     2-R qué cambia · qué NO · barra de calidad MEDIBLE · RC-nn con su test
          cobertura actual vs requerida · rollback
     grafo ausente o STALE ⇒ declarar en context.md y bajar confianza [FDGE-R08]
SALE context.md + discovery.md (2-B) | enrichment.md (2-E) | scope.md (2-R)
NO   diseñar solución · crear Proposal · tocar código · avanzar si Investigation Gate activo
PARA checkpoint. MANUAL: STOP.
```

### PHASE 3 · Strategy
```
LEE  intake · artefacto de PHASE 2 · context · 06-Backend · 11-Conventions · 02-PRD · 03-TRD
HAZ  objetivo · solución · ≥1 alternativa evaluada · rechazadas con motivo · dependencias
     riesgos · restricciones citando Conventions · criterios de éxito DERIVADOS de los AC
     análisis de regresión si STANDARD|MAJOR [FDGE-R12]
     autorrevisión: contradicciones · dependencias faltantes · RULE-nn violadas · AC no cubiertos
SALE strategy.md
NO   crear Proposal · tocar código · crear ramas
PARA checkpoint. MANUAL: STOP.
```

### PHASE 4 · Proposal — **G2**
```
LEE  intake · strategy · context · artefacto de PHASE 2 · 11-Conventions
HAZ  design.md          decisiones y por qué esta y no otra
     tasks.md           PT-XXX.N: objetivo único · input · output · validación · Archivos · estado
     spec-changes.md    PRD/TRD/API/esquema/contratos/eventos
     test-scenarios.md  TS-nn citando su AC. BUG: el escenario que reproduce, en ROJO
     out-of-scope.md
     traceability.md    AC|Criterio|TS|Test|Evidencia|CasoQA|Estado — AC y TS ya; Test y
                        Evidencia desde PHASE 6 [FDGE-R15]
     rama propuesta: fix|feature|refactor|chore|investigate|hotfix /PT-XXX-slug — NO crearla
NO   crear rama · tocar código. Antes de G2: 0 líneas, 0 ramas [FDGE-R13]
PARA G2. MANUAL,SUPERVISED→ACK. AUTONOMOUS→auto solo si las CINCO condiciones [EXEC §5.1]
     MAJOR con grafo ausente o STALE ⇒ bloqueado [FDGE-R43]
```

### PHASE 5 · Implementation
```
LEE  design · tasks · test-scenarios · out-of-scope · traceability · 11-Conventions · graphify-out/
HAZ  1 git checkout -b <type>/PT-XXX-slug
     2 TESTS EN ROJO desde test-scenarios [FDGE-R17]
       → test: PT-XXX add failing tests for <desc>
       excepción CHORE|TRIVIAL sin lógica ejecutable [FDGE-R18]: declarar en strategy.md;
       en traceability ese AC lleva Test:— y Evidencia sigue obligatoria
       HOTFIX: PHASE 4 diferida ⇒ un test que REPRODUZCA el fallo, en rojo
     3 docs in-code  → docs: PT-XXX <qué>
     4 código hasta VERDE, tareas en orden de tasks.md
       → feat|fix|refactor|chore: PT-XXX <desc específica>
     5 suite completa: unitarios verdes · sin regresiones · cobertura ≥ base · lint limpio
     6 delta en design.md · tasks DONE · columna Test de traceability
NO   código antes de test en rojo · commits mezclados o WIP/fix/changes/update/final
     archivos fuera de tasks.md · nada de out-of-scope · tocar HISTORY/HANDOFF/índices
PARA desvío ⇒ STOP con evidencia. Sube de TRIVIAL a STANDARD|MAJOR ⇒ volver a PHASE 2 [FDGE-R21]
```

### PHASE 6 · Evidence
```
LEE  intake · test-scenarios · traceability · 11-Conventions
HAZ  evidencia PROPORCIONAL [FDGE-R24]:
       backend→salida completa de tests+cobertura+logs · API→request/response reales
       UI→capturas antes/después+flujo · datos→consulta ejecutada+resultado · build→salida
     REDACTAR antes de escribir: credenciales, tokens, claves, cookies y datos personales →
       «REDACTADO», anotando qué se redactó. La evidencia es append-only: lo que entra no
       se puede retirar.                                                     [FDGE-R45]
     manifest.json: {pt, generated, criteria:[{ac,statement,scenarios,tests,evidence,verified}],
                     suite:{passed,failed,skipped,coverage,baseline}}
       cada ruta de evidence DEBE existir en disco [FDGE-R23]
     completar Test y Evidencia en traceability — AC huérfano bloquea G3 [FDGE-R15]
     self-review.md: AC verificados · sin huérfanos · código = design · delta registrado
       sin regresiones · Conventions · commits atómicos · sin debug · out-of-scope intacto
       sin problemas de seguridad evidentes · docs de contrato público
     INVESTIGATION: exenta de traceability y manifest. Exige discovery.md § Conclusión [FDGE-R42]
SALE evidence/PT-XXX/{manifest.json,self-review.md,...}
NO   tocar HISTORY · HANDOFF · cerrar el PT
PARA checkpoint con resumen de evidencia.
```

### PHASE 7 · Validation — **G3**
```
LEE  manifest · self-review · intake · traceability
HAZ  BUG           → VALIDATION_PENDING y PARA. Solo un humano lo lleva a DONE, y firma
                     «G3 YYYY-MM-DD nombre» en HISTORY [FDGE-R26]
                     apoyo opcional: delta QA PT-XXX con PASS del caso de origen [FDGE-R28]
     FEATURE       → DONE si tests verdes + manifest válido + TODOS los AC verificados
     REFACTOR      → DONE si comportamiento preservado + barra de calidad alcanzada
     CHORE         → DONE si la verificación declarada pasa y la suite sigue verde
     INVESTIGATION → CLOSED directo, sin INTEGRATED: no produce código [FDGE-R27]
PARA G3 humana si BUG, en los tres modos. Resto: auto solo si las SIETE condiciones [EXEC §5.2]
     — y auto significa que verify-fdge PASÓ, no que tú lo afirmes [EXEC-R06]
```

### La plataforma de trabajo — espejo, no fuente                     [SUITE-R35]
```
CONTRATO  implementación abierta → milestone | epic work item
          tarea                  → issue     | task work item
          compuerta G4           → pull request         [FDGE-R33: el merge es humano]
          cierre de implementación → dispara [START QA] sobre lo entregado
REPARTO   la plataforma responde QUÉ ESTÁ ABIERTO; el repositorio QUÉ SE DECIDIÓ.
          El issue REFERENCIA el intake, no lo copia: dos copias divergen.
ASIGNA    el REGISTRO, siempre. La plataforma espeja y guarda su número de issue.
          node tools/tracker.mjs espejo        comprueba las dos direcciones
          node tools/tracker.mjs abrir --aplicar   crea los issues que faltan
NO        dejar que la plataforma asigne identificadores · copiar el intake al issue
          · usar MCP como único canal: la verificación corre donde no hay nadie delante
```

### El bloque ESTADO — se escribe al cerrar cada fase                [SUITE-R33]
```
<!-- ESTADO -->
implementación: EP-NNN · <slug>            (o «ninguna abierta»)
tarea:          PT-NNN · PHASE n           (o «ninguna»)
compuerta:      G3 pendiente · <quién>     (o «ninguna»)
siguiente:      <la acción concreta que toca ahora>
decisiones:     <lo que se decidió y no se deduce del repositorio>
no hacer:       <lo que alguien podría intentar y no debe>
actualizado:    AAAA-MM-DD
<!-- /ESTADO -->
```
```
FRESCURA  tiene que ser MÁS RECIENTE que el último commit que tocó changes/.  [SUITE-R34]
          Si hay trabajo posterior, la sesión terminó sin dejar el estado
          retomable. Se comprueba contra git, el único reloj que no depende
          de nadie.
REANCLAJE en cada transición de fase, ESCRIBE tres líneas en la TAREA:        [FDGE-R52]
          qué cierras · dónde estás · qué sigue.
          issue si hay plataforma · changes/PT-NNN-slug/bitacora.md si no.
          Escribir obliga a releer; releer no obliga a nada — y no deja rastro.
          Append-only: una bitácora que se reescribe deja de ser un rastro.
NO        contar aquí lo que se hizo: eso es HISTORY.log y el relato de HANDOFF.
          Esto responde qué está abierto y qué sigue, y cabe en una pantalla.
```

### PHASE 8 · Persistence
```
HAZ  1 HISTORY (append, formato canónico único):
       ## PT-XXX — TIPO: título / Fecha / Estado / Severidad·Complejidad·Track / Lote
       Rama / Modo / Estructural: sí|no [FDGE-R44] / Objetivo / Causa raíz(BUG) / Solución
       Archivos modificados / Evidencia / Criterios AC-nn ✓ / Delta real vs planificado
       Compuertas: G1 fecha nombre · G2 … · G3 … · G4 …
       Trazabilidad externa: QD-XXX H-XXX R-XXX
     2 HANDOFF en MODO MERGE: leer el existente y PRESERVAR validaciones e investigaciones
       ajenas al PT [FDGE-R30]
     3 regenerar BACKLOG desde REGISTRY y changes/
     4 índice de origen → estado canónico [FDGE-R31]
     5 REGISTRY: status · phase · structural
     5b si el modo de ejecución cambió en esta sesión: registrarlo en HISTORY con modo
        anterior, modo nuevo y motivo. Sin ese registro no se puede auditar por qué un PT
        tuvo las compuertas que tuvo.                                       [EXEC-R13]
     6 si Estructural: sí ⇒ solicitar regeneración del grafo y anotarlo en HANDOFF [FDGE-R32]
NO   editar entradas existentes de HISTORY · borrarlas · tocar código
```

### PHASE 9 · Integration — **G4**
```
HAZ  precondiciones, todas verificables [FDGE-R34]:
       CI verde · verify-fdge sin errores · entrada en HISTORY · manifest válido
       self-review sin bloqueadores · traceability sin huérfanos · estado DONE
       si BUG: «Compuertas:» con G3 fecha y nombre humano
       CLOSED NO vale: es posterior a INTEGRATED
     PR «PT-XXX tipo: título» con enlaces a Proposal, evidencia y manifest · CI verde
     tras el merge: tag si aplica · borrar rama · PT→INTEGRATED · intake.md CLOSED
       CONSERVAR changes/PT-XXX-slug/ [FDGE-R35] · actualizar HANDOFF, BACKLOG, REGISTRY
PARA G4 HUMANA EN LOS TRES MODOS, sin excepción [FDGE-R33, EXEC-R04]. Prepara el comando y
     descríbelo. Registra quién resolvió cada compuerta [SUITE-R22].
```

### PHASE 10 · Rollback
```
HAZ  1 INC-NNN desde REGISTRY → INCIDENTS.log: síntoma·impacto·decisión·entorno·quién
     2 git revert <sha del merge>. NUNCA reescribir historia ni --force
     3 PT → REVERTED
     4 AÑADIR entrada nueva a HISTORY referenciando la original. La original NO se edita
     5 abrir PT de seguimiento INVESTIGATION|BUG con el INC como origen [FDGE-R37]
PARA el revert toca la rama principal ⇒ autorización humana. Prepara el comando y PARA.
NOTA INC abierto sin causa raíz ⇒ restricción automática a MANUAL [EXEC-R14]
```

### TRACK EXPRESS · solo TRIVIAL
```
PHASE 1 completa con firma → G1 → PHASE 2+3+4 condensadas en strategy.md → G2
→ PHASE 5 → PHASE 6 (una verificación EJECUTADA + manifest obligatorio) → G3 → 8 → 9 → G4
NO omitir Intake, evidencia, validación, persistencia ni integración. Condensar ≠ colapsar.
Si deja de ser TRIVIAL ⇒ PARA y vuelve a PHASE 2 en STANDARD [EXEC-R10]
```

### TRACK HOTFIX · solo S1
```
PHASE 1 mínimo CON FIRMA → G1 → abrir INC → rama hotfix/ → PHASE 5 (test que reproduce, en
rojo, primero) → PHASE 6 (síntoma desaparecido + suite verde + manifest) → G4
DEUDA 48 h: completar PHASE 2,3,4,7,8 retroactivas. Vencida ⇒ BLOQUEA todo PT nuevo [EXEC-R11]
```

### status FDGE
```
LEE  REGISTRY · BACKLOG · HISTORY · INCIDENTS · changes/ · git branch
HAZ  ESTADO   modo vigente y si aplica restricción automática [EXEC-R14] · PTs vivos con
              fase, estado, rama y lote · VALIDATION_PENDING y desde cuándo · lotes abiertos
              · incidentes sin PT de seguimiento · hotfix con deuda vencida · ramas sin PT ·
              últimos 3 integrados · antigüedad de Foundation · versión de suite
     ESTANCADO  PT en DRAFT o BLOCKED >30 días: antigüedad y motivo. >60 días: proponer
              DEFERRED o REJECTED.                                          [FDGE-R47]
     MÉTRICAS desde HISTORY.log:                                            [FDGE-R46]
              rechazo por compuerta (G1/G2/G3/G4) · % de PTs con delta ≠ «según plan» ·
              PTs revertidos · hotfixes y deuda documental · antigüedad media del parado
              Sin estas cifras no se sabe si el marco ayuda o solo cuesta.
NO   recalcular · sobrescribir nada
```

### LOTES · EP-NNN
```
HAZ  1 EP desde REGISTRY · changes/EP-NNN-slug/intake.md desde la plantilla
       INTAKE/templates/EPIC-INTAKE.md [INTAKE-R09]: objetivo común · criterio de éxito del
       lote · out-of-scope · PTs · orden · dependencias · solapamiento · FIRMA ÚNICA.
       Cada PT conserva su intake completo con la línea «Firmado por lote: EP-NNN» [INTAKE-R08]
     2 solapamiento desde el campo Archivos de cada tasks.md → declarar en BACKLOG [FDGE-R40]
     3 ejecución SECUENCIAL. Los que comparten archivos, serializados
     4 primer BLOCKED o compuerta fallida ⇒ EP→BLOCKED y se detiene el lote entero [FDGE-R41]
     5 cierre: todos INTEGRATED|CLOSED o retirados → EP CLOSED + entrada propia en HISTORY
```

---

## Foundation

### PHASE 0 · Reconnaissance — terreno y valor
```
TERRENO PRIMERO. La carpeta que recibe la suite MANDA: es la raíz.            [FND-R19]
     node docs/methodology/tools/plan-layout.mjs --write                      [FND-R20]
     → docs/implementation/LAYOUT.md: repos anidados · dónde vive el código ·
       manifiestos · documentos sueltos · artefactos que faltan
     PROPONE, no mueve. Ni un archivo se toca al generarlo.                   [FND-R21]
     PARA en G0: cada movimiento ACEPTADO|RECHAZADO|MODIFICADO y FIRMADO.     [FND-R22]
     Lo aceptado se ejecuta como PT REFACTOR «Estructural: sí», no aquí.      [FND-R17]

VALOR. La Declaración de Valor la REDACTAS TÚ leyendo lo que hay.             [FND-R24]
     LEE README · manifiestos · rutas y entry points · docs/business/*.md
     PROPÓN dominio · para quién · productos P-NNN · qué hace VÁLIDO cada uno
     El humano corrige y FIRMA. Sin firma no es válida: PTSA audita contra ella.
     No la preguntes en blanco: en blanco se responde con generalidades.

LEE  README · CLAUDE.md · package.json|go.mod|requirements|Cargo → stack
     docker-compose|Dockerfile · .env.example · migraciones/esquema · entry points
     estructura completa · rutas y controllers · tests
HAZ  determinar condicionales: frontend→05 · BD→07 · API HTTP→08
     si ya hubo ejecución previa, leer 11-Conventions para conservar Hard Rules y Delta Log
NO   escribir nada. Esta fase produce comprensión.
```

### PHASE 1 · Reconciliation — **G0**
```
HAZ  1 inventariar TODA la documentación preexistente: *.md en cualquier ruta, wikis, ADRs,
       notas, READMEs de subcarpeta, diagramas. También regenerables y código fuera de src/
       decisión por archivo: KEEP|SUPERSEDE|ARCHIVE|DELETE [FND-R09]
     2 medir divergencia: lo que la doc previa AFIRMA vs lo que el código HACE [FND-R13]
     3 inventario ESTRUCTURAL DEL CÓDIGO [FND-R16]: código fuera de src/ · módulos duplicados
       o casi duplicados · módulos huérfanos que nadie importa · configuración dispersa ·
       tests mezclados con el código · archivos desproporcionados · rutas que contradicen
       11-Conventions §Folder Structure
       La estructura OBJETIVO se cita de 11-Conventions; si no existe, se define primero
       —es parte del paquete— y solo después se propone mover nada [FND-R18]
     4 00-Baseline.md: inventario · totales · divergencias · áreas sin doc · desorden
       estructural · propuesta de normalización · confianza de partida
PARA G0. Nada se mueve, archiva ni borra sin ACK humano [FND-R10]
HAZ  tras el ACK: ejecutar movimientos · SUPERSEDE|ARCHIVE → docs/_archive/<fecha>/ con su
     ruta original · DELETE solo regenerables [FND-R11] · registrar cada uno en
     RECONCILIATION.log (append) con motivo y la firma del ACK
NO   MOVER CÓDIGO. Foundation diagnostica y propone; ejecuta FDGE [FND-R17].
     Cada normalización aprobada en G0 se convierte en un PT REFACTOR con «Estructural: sí»
     y pasa por sus compuertas, tests de regresión y rollback. Mover código sin red de tests
     es lo que el marco prohíbe: permitírselo aquí abriría la puerta trasera de todo.
     La documentación (KEEP/SUPERSEDE/ARCHIVE/DELETE) SÍ se mueve aquí: no tiene tests que
     romper y su desorden bloquea a PHASE 2.
NOTA greenfield: se ejecuta igual y cierra en dos líneas. Saltarla es Phase Collapse.
     suelta sobre un proyecto ya documentado: [START RECONCILE] [FND-R15]
```

### PHASE 2 · Contexto · PHASE 3 · Técnicos · PHASE 4 · Conventions
```
HAZ  nombres EXACTOS de LEX-R10 §6.1. Cualquier otra grafía es defecto [FND-R03]
     2 contexto:  01-Platform-Overview · 02-PRD
     3 técnicos:  03-TRD · 04-App-Flow · 05-UI-UX-Brief(si) · 06-Backend-Architecture
                  07-Database(si) · 08-API-Catalog(si) · 09-Security · 10-Technical-Debt
     4 11-Conventions: estructura · naming CON EJEMPLOS REALES · patrones con código
       ≥3 Hard Rules RULE-nn (qué NO hacer, por qué, correcto/incorrecto) [FND-R05]
       archivos que exigen cuidado · Delta Log
NO   inventar. Todo hecho cita archivo y línea; lo no citable va a 10-Technical-Debt
     como «No determinado» [FND-R01]. Recomendaciones SOLO a 10 [FND-R02]
```

### PHASE 5 · Inventory & Graph
```
HAZ  inventory/: routes · endpoints · entities · components · services · integrations
     grafo sobre src/ (NUNCA la raíz) → REGISTRY.graph {generated, scope, pt_at_generation}
     [FND-R14]. Sin grafo: cerrar con confianza BAJA declarada y FDGE-R43 bloquea MAJOR
```

### PHASE 6 · Human Validation
```
SALE README del paquete con fecha, scope y estado del ACK
PARA reportar: documentos generados y omitidos con motivo · hechos no citables · nº de
     Hard Rules · áreas fuera de scope. Solicitar [FOUNDATION VALIDATED]. NO puedes emitirlo
     tú: comparar la doc con la intención original exige a alguien que conozca la intención
     [FND-R06]
HAZ  al recibirlo: registrar en el README · discrepancias → 10-Technical-Debt ·
     REGISTRY.foundation {generated, validated_by, pt_at_generation}
```

---

## QA

```
PHASE 1 Reconnaissance  LEE 02-PRD · 04-App-Flow · 05-UI-UX-Brief · 08-API-Catalog
                        QA/cases/ · QA-DEFECTS · HANDOFF · test-scenarios de PTs recientes
                        SALE mapa de flujos candidatos (nada en disco todavía)
PHASE 2 Test Plan       QA-PLAN.md: por caso tipo(HP|EC|EF|REG) · eje · fuente · precondiciones
                        pasos · resultado esperado · capturas requeridas
                        todo caso derivado de un PT CITA su AC-nn [QA-R19]
                        QR desde REGISTRY, nunca contando el historial [QA-R13]
                        PARA ACK humano [QA-R02]
PHASE 3 Specs           qa/tests/QA-NNN-slug.spec.ts. Selectores: data-testid→ARIA→label→
                        texto→CSS documentado, nunca clases de estilo [QA-R15]
                        sin waitForTimeout [QA-R16] · datos en fixtures, no hardcodeados
                        PARA ACK humano
PHASE 4 Execution       orden REG→HP→EC→EF [QA-R08] · captura en cada paso relevante
                        NO modificar código, reiniciar servicios ni alterar estado [QA-R12]
                        URL caída ⇒ STOP y reporte de bloqueo
PHASE 5 Analysis        por cada FAIL: paso exacto · captura · esperado vs observado ·
                        severidad · promoción sugerida → QD-NNN [QA-R06,R07]
                        Score = PASS/(PASS+FAIL)×100 · un HP en FAIL ⇒ QA-F [QA-R09]
PHASE 6 Report          QR-NNN/REPORT.md · summary.json · qa-score-history · QA-LOG
                        PARA human review
PHASE 7 Promotion       promote QD→FDGE: PT desde REGISTRY · changes/PT-NNN-slug/ +
                        BUG-REPORT como BORRADOR. NO firmar [INTAKE-R06]. Entra por PHASE 1
                        promote QD→PTSA: H-NNN con el QD como evidencia
                        cierre de QD: PT en DONE|INTEGRATED Y caso re-ejecutado en PASS,
                        o REJECTED por el humano. El agente nunca cierra solo [QA-R11]
BASE opera SOLO desde el navegador, nunca lee código [QA-R01] · sin captura el paso no
     ocurrió [QA-R03] · solo PASS o FAIL, la ambigüedad es FAIL [QA-R04] · QA no corrige,
     aísla [QA-R05] · nunca contra producción sin aislamiento [QA-R10]
```

---

## PTSA

```
PHASE 0  CARGA CORE-PTSA.md junto a CORE.md: las 80 reglas de la especificación, no solo
         las 23 que CORE trae para el resto de la suite.                      [SUITE-R25]
         Value Declaration   dominio · productos · qué los hace VÁLIDOS · rúbrica · reglas
                             no negociables · qué es fallo D1. Sin ella, PARA
PHASE 1-3 Inventory→Scope    inventario · mapa del sistema · alcance (audit-scope.yaml)
             ENUMERAR el universo desde fuentes MECÁNICAS: inventory/{routes,endpoints,
             entities,services,integrations}.md + productos + reglas de PHASE 0.
             Lo que esté en el código y no en el inventario es hallazgo D4.   [PTSA-R76]
             COPIA PTSA/templates/COVERAGE.md → PTSA/COVERAGE.md y enumera ahí el universo.
             Auditar por enumeración, no por descubrimiento: una auditoría que descubre
             encuentra lo que mira, y cada pasada mira cosas distintas.
PHASE 4  Products            Products/P-NNN.md por producto o la fase NO cierra [PTSA-R47]
                             Primario siempre · Secundario si alimenta a un primario ·
                             Artefacto Interno NO es producto: es evidencia
PHASE 5  Criticality
PHASE 6  Traceability        HITO CENTRAL. Por producto, cadena completa de derecha a izquierda:
                             Producto←Transformación←Servicio←Regla←Fuente←Acción de usuario
                             cada eslabón con su E-NNN. Un eslabón inferido es un hallazgo.
                             BLOQUEA 7-10 hasta COMPLETE para TODOS [PTSA-R45]
PHASE 7  Technical D2        esquema REAL de BD vía shell, NUNCA las migraciones [PTSA-R70]
                             + ERD observado · seguridad · deuda · integridad referencial
PHASE 8  Domain Acid Test D1 salida semántica REAL vs reglas de PHASE 0. 4 niveles:
                             1 reglas de negocio · 2 rúbrica→rubric_compliance_score
                             3 coherencia inter-producto (upstream rechazado se HEREDA)
                             4 guardrails IA solo si usa LLM
                             CLOSED solo con rubric=100, sin drift, coherente y evidencia
                             post-fix OBSERVADA en la fuente real [PTSA-R39]
PHASE 9  Documentary D4
PHASE 10 Observability D3    LOGS EN VIVO. No asumir que el logging funciona [PTSA-R70]
                             D5 imputa a D2/D3 y alimenta Risk y Confidence
PHASE 11-12 Consolidation    COVERAGE.md: universo × D1-D4. Toda celda con veredicto
             PASS | FAIL | NO_APLICA | NO_EVALUADA. Sin celdas en blanco.     [PTSA-R77]
             NO_EVALUADA no aprueba: no penaliza Health, degrada Confidence.  [PTSA-R78]
             coverage = evaluadas / universo, y se publica junto al score.
             Score_Dn = max(0,100−Σ penalty) · penalty 30/15/5/1
                             Health = D1×.30+D2×.30+D3×.30+D4×.10
                             SI D1<60 → Health = min(Health,D1) y decláralo [PTSA-R17]
                             Risk = min(100, Σ(Impacto×Probabilidad)×4)
                             Confidence = cobertura×.40+freshness×.25+validez×.20+autonomía×.15
                             A≥90 · B 75-89 · C 60-74 · F<60 · freshness UNKNOWN⇒máx C ·
                             D5 rojo⇒máx B · sin cobertura declarada el score es nulo
PHASE 13-14 Certification    freshness · audit_due · delta sync · Domain Rules as Code
BASE evidencia antes que conclusión · producto sobre implementación · trazabilidad inversa
     autonomía real: con shell/BD/logs ejecuta TÚ los diagnósticos [PTSA-R18]
     NO cerrar hallazgos BUG|DOMAIN sin humano [PTSA-R44] · nunca sobrescribir [PTSA-R19]
     halt SOLO por: permisos denegados · credenciales irresolubles · breakpoint humano [PTSA-R73]
PARADA   la auditoría cierra cuando la MATRIZ está completa, no cuando dejas de encontrar
         hallazgos. «No encontré más» describe dónde dejaste de buscar.       [PTSA-R79]
         Antes de certificar: node tools/verify-ptsa.mjs                      [PTSA-R80]
ESCRITURA RESUMEN.md y ESTADO_ACTUAL.md sobrescribir · AUDIT_LOG.md append · Phases delta-append
     Findings frontmatter+append · Products frontmatter+append · RELACIONES cache
     score-history append
```

---

## FPGE

```
1 FRESHNESS  PTSA STALE|UNKNOWN → advertir y recomendar delta PTSA [FPGE-R05]
             QA-F → todo candidato FEATURE a BLOCKED [FPGE-R07]
             QA STALE → Confidence 0.7 a los candidatos cuya ÚNICA evidencia sea QA [FPGE-R08]
             INC abierto sin PT de seguimiento → Urgency +1.0
2 EVIDENCIA  SOLO LECTURA. PTSA: Findings READY|REOPENED · Products BLOCKED_DOMAIN|IN_REVIEW ·
             score-history · PENDIENTES. QA: QD READY CRITICAL|HIGH · qa-score-history.
             FDGE: HANDOFF · HISTORY · INCIDENTS · BACKLOG · los tres índices · changes/
3 CANDIDATOS un R-NNN por unidad accionable, desde REGISTRY. Fusionar duplicados.
             TODO candidato cita su evidencia [FPGE-R01]. Excluir lo que ya tiene PT.
4 PRIORITY   (EvidenceWeight × ScoreImpact × Urgency × DomainMultiplier × Confidence) / Effort
             EW 1-16 · SI 0-30 · U 1.0-3.0 · DM 1.5 si D1 · C 0.7|1.0 · E 1|2|4
5 ORDEN      mayor Priority → D1 antes que D2/D3/D4 → mayor riesgo de no hacer → menor id
6 EMISIÓN    ROADMAP.md sobrescrito, todos en DRAFT · Top-3 impacto y Top-3 quick wins ·
             append a ROADMAP_HISTORY
7 PARA       no promuevas nada [FPGE-R04]
PROMOTE      solo si READY. PT desde REGISTRY [FPGE-R09]. Entrega a FDGE PHASE 1 (Intake),
             NO al análisis [FPGE-R10]. Racional y evidencia = BORRADOR de los campos
             [HUMANO]. NO firmar.
RECHAZO      EMITE la instrucción de cierre para el componente dueño; NO la ejecutes [FPGE-R03]
ESCRITURA    solo ROADMAP.md y ROADMAP_HISTORY.log. Nada más, nunca.
```

---

## FIDE

```
PHASE 1 Discovery     búsqueda web real: 3 competidores · monetización · stack + DevOps
PHASE 2 Advisory      Discovery Brief · PARA hasta [ACK]. Opción subóptima ⇒ advertir,
                      obedecer si insiste, registrar en 11-Conventions como deuda día cero
PHASE 3 Blueprinting  docs/enterprise-documentation/ con los nombres CANÓNICOS [FIDE-R04]
                      + 00-Business-Case (único propio de FIDE)
PHASE 4 Scaffolding   init · docker-compose · CI con verify-fdge --all
                      copiar la suite EXCEPTO FIDE/ [FIDE-R01] · SÍ copiar Foundation
                      REGISTRY inicial · estructura de artefactos · QA/ qa/ PTSA/
PHASE 5 Handoff       features → índice ENRICHMENT en DRAFT, nunca READY [FIDE-R05]
                      ROADMAP inicial · declarar en el README del paquete que documenta
                      arquitectura PREVISTA, no observada [FIDE-R06]
                      sobrescribir CLAUDE.md con Suite-CLAUDE-Template · modo SUPERVISED
IDEMPOTENCIA si ya hay 00-Business-Case o package.json: NO destruir. Retomar o abortar.
```

---

## Migración y compatibilidad

```
[START MIGRATE]   node tools/migrate.mjs --dry-run   → informe, no toca nada
                  node tools/migrate.mjs --apply     → ejecuta lo mecánico
DETECCIÓN  PHASE 0 compara REGISTRY.suite_version con CHANGELOG [SUITE-R13]
RESTRICCIÓN Con migración pendiente: solo migrate · status * · y TERMINAR los PTs en vuelo.
            NO se abren PTs nuevos [SUITE-R17]
SESIONES ACTIVAS  Cada allocation lleva su propio suite_version. Un PT abierto bajo una
            versión la conserva hasta cerrar; los nuevos usan la vigente [SUITE-R18].
            Una migración nunca invalida trabajo en curso.
DESDE 3.x   crear REGISTRY con contadores = máximo ID YA USADO (nunca 0) · SESSION_SUMMARY→
            SESSION_LOG · convertir los tres archivos en índices y mover el cuerpo a
            changes/PT-XXX/ · PLAN_ACTUAL→strategy.md · PENDING_TASKS→tasks.md ·
            CONTEXT_ANALYSIS→context.md · estados por LEXICON §5.4 · PTSA Fases→Phases,
            Hallazgos→Findings, Evidencias→Evidence, Productos→Products ·
            intake retroactivo por PT vivo · [START RECONCILE] · [START FOUNDATION] si vino de FIDE
DESDE 4.0.x añadir REGISTRY.graph y allocation.structural · «Estructural:» a las entradas
            de HISTORY · [START RECONCILE] (la fase no existía) · generar CORE.md
DESDE 4.1.x generar CORE.md con los prompts incluidos. Sin cambios de artefactos.
```
