# FDGE — Prompts Operativos por PHASE

> Reemplaza al derogado `instrucctions.md` (`LEX-R15`).
> Método: [Framework-FDGE.md](Framework-FDGE.md) · Procedimiento: [FDGE-Implementation.md](FDGE-Implementation.md)
> Reglas: [RULES.md](RULES.md) · Vocabulario: [LEXICON.md](LEXICON.md) · Compuertas: [EXECUTION-MODES.md](EXECUTION-MODES.md)
>
> Suite version: **5.2.2**

---

## Cómo se usan

En modo `MANUAL`, se copia y pega el bloque de la fase que toca. En `SUPERVISED` y
`AUTONOMOUS` basta con el bloque de **PHASE 0** y el de **PHASE 1**: el agente encadena las
fases intermedias emitiendo checkpoints y se detiene solo en las compuertas vivas.

`EXEC-R01` · En todos los modos, cada fase produce un checkpoint legible. Auto-avanzar en
silencio está prohibido.

## Si tocas un patrón                                                    `SUITE-R38`

Los patrones críticos viven en `tools/patrones.mjs`, cada uno con lo que **tiene** que casar y
lo que **no** debe casar. Cambiar uno sin actualizar su contrato no compila el problema: lo
esconde.

```bash
node docs/methodology/tools/verify-patrones.mjs
```

**Un patrón puede estar mal y compilar.** Ocho veces en este proyecto un escape se perdió al
editar —`\b` quedó como el byte `0x08`, `\s` como la letra `s`— y el regex resultante era
válido y no casaba nada. El verificador informaba «sin errores» porque no encontraba nada que
reprochar: el fallo era indistinguible del éxito, y ninguna lectura lo veía —`/AC-d+/` y
`/AC-\d+/` se parecen demasiado.

Corre esto **antes** que nada: si un patrón se degradó, todo lo que venga después informa «sin
errores» porque no encuentra nada, no porque no haya nada.

## La plataforma de trabajo                                              `SUITE-R35`

Opcional, y cuando está cambia lo que cuesta retomar: **qué está abierto pasa de leer doscientas
líneas a una consulta**.

| Concepto | GitHub | Azure DevOps |
|:---|:---|:---|
| implementación abierta | milestone | epic work item |
| tarea | issue | task work item |
| compuerta `G4` | pull request | pull request |

```bash
node docs/methodology/tools/tracker.mjs espejo            # comprueba las dos direcciones
node docs/methodology/tools/tracker.mjs abrir --aplicar   # crea los issues que faltan
```

**El registro asigna; la plataforma espeja.** `SUITE-R08` no se toca: si la plataforma asignara
identificadores habría dos fuentes divergiendo, que es la causa raíz que la v4 nació para
eliminar. Y **el issue referencia el intake, no lo copia** — por lo mismo.

Reparto: la plataforma responde **qué está abierto**; el repositorio, **qué se decidió y qué se
probó**. Cada cosa donde pertenece.

## Retomar: el bloque ESTADO                                    `SUITE-R33` · `SUITE-R34`

`HANDOFF.md` abre con esto, y el relato va debajo:

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

Un `HANDOFF` de doscientas líneas cuenta **lo que se hizo**. Retomar necesita otra cosa: qué
está abierto, qué compuerta espera a quién y **cuál es la siguiente acción**. Si no cabe en una
pantalla, la sesión siguiente empieza explicando otra vez.

**Se escribe al cerrar cada fase**, no al terminar la sesión — porque una sesión no siempre
avisa de que va a terminar.

`SUITE-R34` lo exige contra git: si hay commits que tocaron `changes/` **después** del último
que tocó `HANDOFF.md`, la sesión dejó trabajo sin estado y `SUITE-R03` no se cumple. Git es el
único reloj que no depende de que alguien se acuerde.

### El reanclaje se escribe                                                  `FDGE-R52`

En cada transición de fase, tres líneas **en la tarea** — comentario del issue si hay
plataforma, `changes/PT-NNN-slug/bitacora.md` si no:

```
2026-08-12 · PHASE 4 → 5
cierro:   diseño aprobado en G2, middleware en vez de decorador
estoy en: implementación, tocando src/middleware/
sigue:    tests de integración y manifiesto de evidencia
```

**Escribir obliga a releer; releer no obliga a nada.** Esa es toda la diferencia, y es la razón
de que la versión anterior de esta regla —«relee el estado»— fuera la más débil del marco: no
se podía exigir ni comprobar. Una nota tiene fecha, es observable, y la siguiente sesión la
encuentra sin preguntar.

Append-only. Una bitácora que se reescribe deja de ser un rastro.

### Toda tarea declara cómo termina                                          `FDGE-R53`

Una línea, observable, en el intake. **La deriva ocurre en tareas sin forma**: la que declara su
final lo tiene; la que no, se estira hasta que nadie recuerda dónde empezó.

Si la condición de cierre necesita un «y además», son dos tareas. Partirlas ahí cuesta un
minuto; descubrirlo en `G3` cuesta la fase entera.

## El bucle de la implementación                       `[IMPLEMENTACIÓN]` · `[CIERRA]`

Una implementación no es un plan: es una **unidad abierta**. Se abre, se construye —con las
mejoras y los arreglos que hagan falta, que son la construcción— y se cierra.

### Al abrir

El criterio de si es nueva o parte de la abierta **está escrito** (`FDGE-R50`), no es tu juicio
de hoy:

| | |
|:---|:---|
| **Parte de la abierta** | toca los productos que su objetivo declara · sirve a su criterio de éxito · corrige algo que ella misma introdujo |
| **Nueva** | entrega valor que la abierta no prometió · el criterio de éxito de la abierta se cumple igual sin ella |

Aplícalo, **propón** y espera confirmación. Si es nueva y hay una abierta, primero se cierra:
solo una a la vez (`FDGE-R48`), porque con dos «esto es lo mismo» deja de tener respuesta.

### Mientras está abierta — el default invertido

**Todo lo que se diga le pertenece** (`FDGE-R49`). No preguntes en cada petición si es nueva: lo
raro es abrir y cerrar. Una tarea, una mejora o un arreglo entran con `TAREA.md` —qué se quiere,
criterios de aceptación, qué no entra— y la firma se hereda del lote (`FDGE-R51`).

Sin ese default hay que declarar cada vez que algo es nuevo, y **eso es justo lo que se olvida a
mitad de sesión**. Con él, la implementación abierta sobrevive a la sesión: al volver, lo que
está abierto lo dice el registro, no tu memoria.

`track: HOTFIX` es la única excepción: producción caída no espera a que se cierre nada.

### Al cerrar

`[CIERRA]` pasa el lote a `DONE` y **encadena `[START QA]`** sobre lo que entregó. Cerrar es un
acto explícito: mientras no ocurra, la implementación sigue abierta.

### Disciplina de respuesta                                                  [SUITE-R23]

Lo que escribes al humano cuesta tokens y tiempo de lectura.

```
NO ESCRIBAS  lo que salió bien · por qué una decisión es correcta · justificaciones de
             diseño · recapitulaciones de lo ya acordado · preámbulos · cierres valorativos
ESCRIBE      lo que falla · lo que cambió · lo que queda · lo que necesita decisión
```

El porqué se explica **solo si el humano lo pide**. Vive en los artefactos —`design.md`,
`HISTORY.log`, `CHANGELOG.md`— que se leen cuando hacen falta, no en cada turno.

`SUITE-R24` · La misma economía rige lo que **lees**: `PHASES.md` es telegráfico y `CORE.md`
recorta cada regla a su primera frase imperativa. El rationale vive en los `Framework-*.md`,
que no se cargan nunca. Quitar el porqué del texto que se **ejecuta** es ganancia pura;
quitar precisión de la regla no lo es: una regla ambigua se aplica mal justo en los casos
límite, que es donde importa.

### Formato del checkpoint

```
PHASE <n> — <Nombre>  ·  PT-XXX  ·  <track>  ·  modo <MODE>

Hecho:        [1-3 líneas]
Artefacto:    [ruta]
Desviaciones: [respecto a lo planificado, o «ninguna»]
Riesgos:      [nuevos, o «ninguno»]
Siguiente:    PHASE <n+1> — <Nombre>   [avanzando | esperando G<n>]
```

### Índice

| Bloque | Cuándo |
|:---|:---|
| [PHASE 0 — Context](#phase-0--context) | Al abrir cualquier sesión |
| [PHASE 1 — Intake](#phase-1--intake--compuerta-g1) | Al abrir trabajo nuevo · **G1** |
| [PHASE 2-B](#phase-2-b--discovery-bug--investigation) · [2-E](#phase-2-e--enrichment-feature) · [2-R](#phase-2-r--scope-refactor--chore) | Análisis, según el tipo del Intake |
| [PHASE 3 — Strategy](#phase-3--strategy) | Tras el análisis |
| [PHASE 4 — Proposal](#phase-4--proposal--compuerta-g2) | Tras la estrategia · **G2** |
| [PHASE 5 — Implementation](#phase-5--implementation) | Tras resolver G2 |
| [PHASE 6 — Evidence](#phase-6--evidence) | Implementación terminada |
| [PHASE 7 — Validation](#phase-7--validation--compuerta-g3) | Evidencia completa · **G3** |
| [PHASE 8 — Persistence](#phase-8--persistence) | Tras validar |
| [PHASE 9 — Integration](#phase-9--integration--compuerta-g4) | Listo para merge · **G4** |
| [PHASE 10 — Rollback](#phase-10--rollback) | Un PT integrado falló |
| [TRACK EXPRESS](#track-express--trivial) | Cambio `TRIVIAL` |
| [TRACK HOTFIX](#track-hotfix--s1) | Solo `severity: S1` |
| [Lotes EP-NNN](#lotes--ep-nnn) | Varios PTs a la vez |
| [status FDGE](#status-fdge) | Consultar sin modificar |

---

# PHASE 0 — Context

```
He abierto una nueva sesión. Ejecuta EXCLUSIVAMENTE PHASE 0 (Context).

## Objetivo
Reconstruir el estado operativo del proyecto sin planificar, auditar ni modificar nada.

## Lee en este orden
1. docs/enterprise-documentation/README.md
2. docs/implementation/REGISTRY.json          → suite_version, execution_mode, PTs vivos
3. docs/implementation/BACKLOG.md             → PTs en vuelo y su fase
4. docs/implementation/HANDOFF.md             → estado actual
5. docs/implementation/HISTORY.log            → los 3 PTs más recientes
6. docs/implementation/INCIDENTS.log          → incidentes abiertos
7. changes/                                   → Proposal Packages en vuelo
8. graphify-out/                              → grafo de dependencias, si existe

## Comprobaciones obligatorias
- Foundation presente: verifica que existen los ARCHIVOS del núcleo (02-PRD.md, 03-TRD.md,
  06-Backend-Architecture.md, 11-Conventions.md), no solo la carpeta.        [FND-R08]
- Foundation vigente: si hay más de 10 PTs desde su última ejecución, o si HANDOFF.md
  documenta cambios arquitectónicos posteriores, reporta confianza BAJA.
- Versión de suite: compara REGISTRY.suite_version con docs/methodology/CHANGELOG.md.
  Si difiere, repórtalo.                                                     [SUITE-R13]
- CORE.md presente y sincronizado; es lo único que cargas.      [SUITE-R15, LEX-R25]
- Modo de ejecución declarado; sin él se asume SUPERVISED [EXEC-R02] y solo un humano
  lo cambia [EXEC-R12]. Comprueba si aplica la restricción automática a MANUAL. [EXEC-R14]
- Migración pendiente: si REGISTRY.suite_version ≠ la vigente, MODO RESTRINGIDO —
  solo migrate, status * y terminar los PTs en vuelo. No se abre nada nuevo.  [SUITE-R17]
- Grafo: FRESH | STALE | MISSING. STALE o MISSING bloquea G2 en PTs MAJOR.    [FDGE-R43]
- Hotfix vencido: si hay documentación retroactiva de un HOTFIX pendiente más allá
  de 48 h, decláralo — bloquea la apertura de trabajo nuevo.                 [EXEC-R11]

## REGLAS
1. Documentation-First. No inspecciones código salvo que la documentación sea insuficiente,
   y declara esa insuficiencia.
2. NO diseñes estrategias, NO generes tareas, NO modifiques archivos, NO ejecutes comandos.
3. NO avances a PHASE 1 por tu cuenta.

## Entregable

### Estado general
Qué es el sistema (2 líneas) · estado arquitectónico · dominios funcionales principales.

### Estado de la sesión
Último PT · PTs vivos y su fase · ramas activas · ítems en VALIDATION_PENDING ·
incidentes abiertos · modo de ejecución vigente.

### Contexto recuperado
Componentes relevantes · restricciones críticas y Hard Rules RULE-nn aplicables.

### Comprobaciones
Foundation: presente/ausente · vigente/desactualizada
Versión de suite: [coincide | desajuste]
Modo: [MANUAL | SUPERVISED | AUTONOMOUS] · descenso automático: [no aplica | motivo]
Hotfix pendiente: [ninguno | PT-XXX, vence YYYY-MM-DD]

### Nivel de confianza
Alto | Medio | Bajo — según la completitud de la documentación encontrada.

## Escribe
Append a docs/implementation/SESSION_LOG.md:

## Sesión [YYYY-MM-DD HH:MM]
Último PT: PT-XXX · Modo: [MODE] · Suite: [version]
PTs vivos: [lista con su fase]
Contexto cargado: [documentos leídos y sus fechas]
Comprobaciones: Foundation [estado] · Suite [estado] · Hotfix [estado]
Confianza: Alto | Medio | Bajo
Riesgos al inicio: [lista o «ninguno»]

## STOP
Detente y espera instrucciones.
```

---

# PHASE 1 — Intake · Compuerta **G1**

```
Ejecuta EXCLUSIVAMENTE PHASE 1 (Intake) para el trabajo indicado.

Entrada: [START PT] <BUG|FEATURE|REFACTOR|INVESTIGATION|CHORE>: <título>
         (o el QD-NNN / H-NNN / R-NNN de origen)

## Pasos

1. ASIGNAR IDENTIFICADOR
   Lee docs/implementation/REGISTRY.json, incrementa el contador PT, escribe el nuevo valor
   y añade la entrada a allocations. Todo en la misma operación.
   El ID es monotónico y nunca se reutiliza.                                 [LEX-R04]
   PROHIBIDO derivar el número contando HISTORY.log.                         [SUITE-R08]
   Si no puedes escribir REGISTRY.json, DETENTE y repórtalo.

2. CREAR EL DIRECTORIO DEL PT
   changes/PT-XXX-slug/
   Copia la plantilla de Intake según el tipo:
     BUG · INVESTIGATION   → docs/methodology/INTAKE/templates/BUG-REPORT.md
     FEATURE               → docs/methodology/INTAKE/templates/FEATURE-REQUEST.md
     REFACTOR · CHORE      → docs/methodology/INTAKE/templates/CHANGE-REQUEST.md
   como changes/PT-XXX-slug/intake.md

3. CAMPOS DEL HUMANO
   Si el humano ya los proporcionó, transcríbelos LITERALMENTE.
   Si no, presenta la plantilla con los campos [HUMANO] vacíos y DETENTE hasta recibirlos.
   Si el trabajo viene de un QD-NNN, H-NNN o R-NNN, puedes redactar un BORRADOR de los
   campos [HUMANO] a partir de esa evidencia — marcándolo como borrador.

   El humano declara la intención; tú la expandes.                           [FDGE-R02]
   NUNCA escribas el bloque ## Firma.                                        [INTAKE-R06]
   NUNCA deduzcas del código el comportamiento esperado de un bug: es un hecho de
   negocio, y deducirlo del código deduce el defecto.                        [INTAKE-R01]
   NUNCA inventes criterios de aceptación: son la definición del negocio.    [INTAKE-R02]

4. CAMPOS DEL AGENTE
   Completa formalización, complejidad propuesta, verificación de duplicados
   (BACKLOG.md, HISTORY.log, ROADMAP.md) y OBSERVACIONES.

   Las Observaciones son OBLIGATORIAS.                                       [INTAKE-R07]
   Señala: criterios ambiguos o no verificables · contradicciones con el PRD o con
   11-Conventions.md · out-of-scope que resulta indispensable · severidad que no cuadra
   con el impacto descrito · métricas no medibles con lo que hoy existe.
   Aceptar un Intake malo en silencio viola SUITE-R01.

5. COMPUERTA G1 — Definition of Ready
   Ejecuta la checklist completa del §15/§17/§14 de la plantilla, ítem por ítem.
   Emite un veredicto:
     DoR: PASS       → status READY.  Avanza a PHASE 2 (según el modo).
     DoR: FAIL       → status DRAFT.  Lista EXACTAMENTE qué campo falta y quién lo aporta.
     DoR: CHALLENGE  → status DRAFT.  Formalmente completo, pero hay un problema
                       sustantivo. Repórtalo y espera decisión humana.

6. REGISTRAR EN EL ÍNDICE
   Una línea en DISCOVERY.md / ENRICHMENT.md / REFACTOR_SCOPE.md según el tipo:
   | PT-XXX | TIPO | SEV | ESTADO | Título | changes/PT-XXX-slug/ | YYYY-MM-DD |
   Append-only. NUNCA el cuerpo del análisis, NUNCA sobrescribir.            [LEX-R12]

## PROHIBIDO
Analizar el problema · consultar el código para deducir intención · diseñar soluciones ·
crear ramas · modificar código · firmar el Intake.

## STOP
G1 es una compuerta humana en los tres modos. Presenta el Intake y el veredicto DoR,
y espera ACK.
```

---

# PHASE 2-B — Discovery (`BUG` · `INVESTIGATION`)

```
G1 resuelto con PASS. Ejecuta EXCLUSIVAMENTE PHASE 2-B (Discovery & Architecture).

## Contexto obligatorio, en este orden
1. changes/PT-XXX-slug/intake.md            ← la intención declarada; no la contradigas
2. docs/enterprise-documentation/01-Platform-Overview.md
3. docs/enterprise-documentation/06-Backend-Architecture.md
4. docs/enterprise-documentation/11-Conventions.md
5. docs/enterprise-documentation/02-PRD.md
6. docs/enterprise-documentation/03-TRD.md
7. docs/implementation/HANDOFF.md
8. docs/implementation/HISTORY.log (entradas relacionadas)
9. graphify-out/ (acoplamiento de los componentes afectados)

Solo consulta código fuente si la documentación es insuficiente. Declara esa insuficiencia.

## REGLAS
1. Clasifica complejidad: TRIVIAL · STANDARD · MAJOR. (La severidad ya la declaró el
   humano en el Intake — no la cambies.)                                     [FDGE-R04]
2. Expande, partiendo del comportamiento esperado que declaró el humano:
   Qué ocurre · Dónde · Cuándo · Cómo se manifiesta · Por qué (hipótesis CON evidencia).
3. Identifica: componentes · servicios · dependencias · flujos de datos · riesgos ·
   restricciones · radio de impacto.
4. Registra confianzas: Root Cause __% · Architecture __% · Solution __%.
5. Si graphify-out/ no existe o está desactualizado: decláralo, baja Architecture
   Confidence y regístralo como riesgo. NO afirmes haber consultado un grafo
   inexistente.                                                              [FDGE-R08]

## Investigation Gate                                                        [FDGE-R09]
Si la causa raíz, el impacto arquitectónico o las dependencias son desconocidas, o si
CUALQUIER confianza baja del 70 %:
→ reclasifica a INVESTIGATION de inmediato. La planificación de implementación queda
  prohibida hasta que la investigación eleve la confianza.

## Output
changes/PT-XXX-slug/discovery.md

## PT-XXX — [título]
Fecha: · Tipo: BUG | INVESTIGATION · Complejidad: · Severidad: [del Intake]

### Expansión
Qué / Dónde / Cuándo / Cómo / Por qué (hipótesis con evidencia)

### Comportamiento esperado
[TRANSCRITO del Intake — no reinterpretado]

### Comportamiento observado
### Impacto (usuarios, negocio)
### Componentes afectados
### Acoplamiento
Fuente: graphify-out/ [fecha] | análisis directo | no disponible
### Confianza
Root Cause __% · Architecture __% · Solution __%
### Investigation Gate
NO APLICA | ACTIVADO — motivo:

changes/PT-XXX-slug/context.md
Componentes · servicios · dependencias · flujo de datos · archivos implicados ·
áreas de riesgo · puntos de intervención · restricciones · fuentes con su fecha.

## PROHIBIDO
Diseñar soluciones · modificar código · crear ramas · avanzar a PHASE 3 si el
Investigation Gate se activó.

## Checkpoint
Emite el checkpoint. En MANUAL, STOP. En SUPERVISED/AUTONOMOUS, continúa a PHASE 3
salvo que el Investigation Gate se haya activado.
```

---

# PHASE 2-E — Enrichment (`FEATURE`)

```
G1 resuelto con PASS. Ejecuta EXCLUSIVAMENTE PHASE 2-E (Enrichment & Architecture).

## Contexto obligatorio, en este orden
1. changes/PT-XXX-slug/intake.md            ← los AC del humano; son el contrato
2. docs/enterprise-documentation/02-PRD.md
3. docs/enterprise-documentation/06-Backend-Architecture.md
4. docs/enterprise-documentation/11-Conventions.md
5. docs/enterprise-documentation/01-Platform-Overview.md
6. docs/enterprise-documentation/03-TRD.md
7. docs/enterprise-documentation/08-API-Catalog.md (si existe)
8. docs/enterprise-documentation/09-Security-Architecture.md
9. docs/implementation/HANDOFF.md
10. graphify-out/

## REGLA CENTRAL                                                             [INTAKE-R02]
Los criterios de aceptación los declaró el HUMANO en el Intake. Tu trabajo es
FORMALIZARLOS: numerarlos AC-nn, hacerlos medibles y derivar de cada uno sus TS-nn.

NO añadas intención nueva. Si detectas un criterio que falta, PROPONLO en las
Observaciones del Intake y espera decisión. NO lo insertes.

Un criterio debe poder responderse con ✓/✗ observando el sistema.            [INTAKE-R05]
«Funciona correctamente» no vale. «POST /items responde 201 con el ID creado cuando el
payload es válido» sí.

## REGLAS
1. Clasifica complejidad: TRIVIAL · STANDARD · MAJOR.
2. Formaliza AC-01..AC-nn a partir del Intake.
3. Deriva TS-nn. CADA TS CITA EL AC QUE VERIFICA.                            [FDGE-R15]
   Cubre: happy path · edge cases · failure cases.
4. Extrae NFRs de 11-Conventions.md, 09-Security-Architecture.md y 03-TRD.md,
   CITANDO LA FUENTE de cada uno.
5. Transcribe el out-of-scope del Intake y amplíalo si el análisis revela exclusiones
   necesarias — marcando cuáles añadiste tú.
6. Identifica componentes, puntos de integración, impacto en el modelo de datos, riesgos.
7. Si graphify-out/ no está disponible: decláralo y baja la confianza.       [FDGE-R08]

## Output
changes/PT-XXX-slug/enrichment.md

## PT-XXX — [título]
Fecha: · Complejidad: · Severidad: [del Intake]

### Solicitud original
[texto literal del humano en el Intake]

### Acceptance Criteria (formalizados)
- [ ] AC-01: ...   (origen: Intake §4 criterio 1)
- [ ] AC-02: ...

### Test Scenarios
Happy path
- TS-01 (AC-01, AC-02): ...
Edge cases
- TS-02 (AC-03): ...
Failure cases
- TS-03 (AC-04): ...

### NFRs
Rendimiento: ...   (fuente: 03-TRD.md §…)
Seguridad: ...     (fuente: 09-Security-Architecture.md §…)

### Out of scope
[del Intake]
[+ añadido en análisis: ...]

### Componentes afectados · Impacto en modelo de datos · Riesgos
### Acoplamiento
Fuente: graphify-out/ [fecha] | análisis directo | no disponible
### Confianza
Architecture __% · Implementation __%

changes/PT-XXX-slug/context.md
[igual que en 2-B]

## PROHIBIDO
Diseñar la solución técnica · crear el Proposal Package · modificar código · crear ramas ·
inventar criterios de aceptación.

## Checkpoint
Emite el checkpoint. En MANUAL, STOP.
```

---

# PHASE 2-R — Scope (`REFACTOR` · `CHORE`)

```
G1 resuelto con PASS. Ejecuta EXCLUSIVAMENTE PHASE 2-R (Scope & Architecture).

## Contexto obligatorio
1. changes/PT-XXX-slug/intake.md            ← el límite «qué NO cambia» es el contrato
2. docs/enterprise-documentation/06-Backend-Architecture.md
3. docs/enterprise-documentation/11-Conventions.md
4. docs/enterprise-documentation/01-Platform-Overview.md
5. docs/enterprise-documentation/03-TRD.md
6. docs/implementation/HANDOFF.md
7. docs/implementation/HISTORY.log (refactors previos relacionados)
8. graphify-out/

## REGLAS
1. Clasifica complejidad.
2. Formaliza el scope a partir del Intake:
   - Qué cambia: archivos, módulos, patrones concretos.
   - Qué NO cambia: el límite explícito del humano. Todo lo que está fuera no se toca.
   - Barra de calidad: el umbral MEDIBLE del Intake. Si el humano dio un adjetivo en vez
     de un umbral, levántalo en Observaciones — no lo inventes.
   - Controles de regresión RC-nn: cada uno con el test que lo certifica.
3. Deriva AC-nn desde la barra de calidad y los RC-nn.
4. Mide la cobertura ACTUAL del área a modificar y compárala con la requerida.
   Un refactor no puede empezar sin la red de tests que certifique el comportamiento.
5. Mapea el acoplamiento: qué depende del área afectada.
6. Documenta la estrategia de rollback. Obligatoria si es MAJOR.

## Output
changes/PT-XXX-slug/scope.md

## PT-XXX — [título]
Fecha: · Complejidad: · Severidad: [del Intake]

### Motivación técnica
[del Intake: coste actual, qué se vuelve posible, qué pasa si no se hace]

### Qué cambia
### Qué NO cambia (límite explícito del Intake)
### Barra de calidad
Métrica: · Actual: · Objetivo: · Cómo se comprueba:

### Controles de regresión
- RC-01: [comportamiento] → Test: [cómo se certifica] → Estado: [existe | falta]

### Acceptance Criteria derivados
- [ ] AC-01 (barra de calidad): ...
- [ ] AC-02 (RC-01 preservado): ...

### Cobertura de tests
Actual: __% en [módulo] · Requerida antes de empezar: __%
¿Se puede empezar hoy? sí / no — si no, qué falta:

### Acoplamiento
Fuente: graphify-out/ [fecha] | análisis directo | no disponible
### Estrategia de rollback
### Confianza
Architecture __% · Regression risk __%

changes/PT-XXX-slug/context.md
[igual que en 2-B]

## PROHIBIDO
Diseñar la implementación · modificar código · crear ramas · empezar sin la cobertura
de regresión requerida.

## Checkpoint
Emite el checkpoint. En MANUAL, STOP.
```

---

# PHASE 3 — Strategy

```
Análisis completo. Ejecuta EXCLUSIVAMENTE PHASE 3 (Strategy).

## Contexto obligatorio
1. changes/PT-XXX-slug/intake.md
2. changes/PT-XXX-slug/{discovery|enrichment|scope}.md
3. changes/PT-XXX-slug/context.md
4. docs/enterprise-documentation/06-Backend-Architecture.md
5. docs/enterprise-documentation/11-Conventions.md
6. docs/enterprise-documentation/02-PRD.md · 03-TRD.md
7. graphify-out/

## REGLAS                                                                    [FDGE-R11]
Secciones obligatorias en strategy.md:
  Objetivo                  qué se consigue al terminar
  Solución propuesta        descripción técnica
  Alternativas consideradas AL MENOS UNA
  Alternativas rechazadas   con el motivo del rechazo
  Dependencias              qué debe existir o resolverse antes
  Riesgos                   qué puede ir mal
  Restricciones             citando 11-Conventions.md y las RULE-nn aplicables
  Criterios de éxito        DERIVADOS de los AC-nn — no inventados aquí

## Análisis de regresión — obligatorio para STANDARD y MAJOR                 [FDGE-R12]
Qué puede romperse · workflows afectados · servicios · APIs · flujos de UI ·
riesgos de integridad de datos.

## Autorrevisión antes de presentar
- ¿Contradice alguna decisión de la arquitectura documentada?
- ¿Falta alguna dependencia?
- ¿Hay una alternativa que no evalué?
- ¿Viola alguna RULE-nn de 11-Conventions.md?
- ¿Los criterios de éxito cubren TODOS los AC del Intake?

## Output
changes/PT-XXX-slug/strategy.md   (sobrescribible dentro del PT, no global)

## PROHIBIDO
Crear el Proposal Package · modificar código · crear ramas · ejecutar comandos.

## Checkpoint
Emite el checkpoint. En MANUAL, STOP.
```

---

# PHASE 4 — Proposal · Compuerta **G2**

```
Estrategia aprobada. Ejecuta EXCLUSIVAMENTE PHASE 4 (Proposal Package).

## Contexto obligatorio
changes/PT-XXX-slug/{intake, strategy, context, discovery|enrichment|scope}.md
docs/enterprise-documentation/11-Conventions.md   ← naming de archivos, ramas, commits

## Genera en changes/PT-XXX-slug/

design.md
  Decisiones de arquitectura y su justificación. Por qué esta solución y no otra.

tasks.md
  Lista atómica. Cada tarea con objetivo ÚNICO:                              [FDGE-R16]
    PT-XXX.1
    Objetivo:   [qué logra]
    Input:      [qué necesita]
    Output:     [qué produce]
    Validación: [cómo se verifica]
    Archivos:   [rutas que toca]      ← necesario para el análisis de solapamiento
    Estado:     READY

spec-changes.md
  Cambios en PRD, TRD, API, esquema, contratos, tipos, eventos.

test-scenarios.md
  TS-nn, cada uno CITANDO el AC-nn que verifica.
  Para BUG: el escenario que reproduce el fallo debe estar en ROJO antes del fix.

out-of-scope.md
  Exclusiones explícitas, heredadas del Intake y ampliadas.

traceability.md                                                              [FDGE-R15]
  | AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
  Se crea aquí con AC, Criterio y TS. Test y Evidencia se completan en PHASE 6.
  Todo AC del Intake debe aparecer. Un AC sin TS es un defecto de esta fase.

## Rama propuesta (NO la crees todavía)
  fix/ · feature/ · refactor/ · chore/ · investigate/ + PT-XXX-slug

## COMPUERTA G2 — STOP ABSOLUTO                                              [FDGE-R13]
NO se crea ninguna rama. NO se modifica ningún archivo de código fuente.
Antes de resolver G2: 0 líneas modificadas, 0 ramas abiertas.

Resolución según el modo — ver EXECUTION-MODES.md §5:
  MANUAL, SUPERVISED  → ACK humano.
  AUTONOMOUS          → auto solo si se cumplen LAS CINCO condiciones de §5.1:
                        complexity ∈ {TRIVIAL, STANDARD} · severity ∈ {S3, S4} ·
                        sin breaking change en contrato público ·
                        no toca «Files Requiring Extra Care» ·
                        no contradice ninguna RULE-nn.
                        Si falta una sola → ACK humano.

Declara explícitamente cómo se resolvió G2 y déjalo registrado.
```

---

# PHASE 5 — Implementation

```
G2 resuelto. Ejecuta EXCLUSIVAMENTE PHASE 5 (Implementation).

## Contexto obligatorio antes de tocar un archivo
changes/PT-XXX-slug/{design, tasks, test-scenarios, out-of-scope, traceability}.md
docs/enterprise-documentation/11-Conventions.md
graphify-out/ (dependencias de los archivos que vas a tocar)

## ORDEN ESTRICTO

1. RAMA
   git checkout -b <type>/PT-XXX-slug

2. TESTS PRIMERO — todos en ROJO                                             [FDGE-R17]
   Derivados de test-scenarios.md. Deben fallar antes de escribir una sola línea de
   implementación. Si no puedes escribir el test, no entendiste el requisito.
   → test: PT-XXX add failing tests for <descripción>

   EXCEPCIÓN [FDGE-R18]: un CHORE o un TRIVIAL cuyo diff no toca lógica ejecutable
   (texto, estilo, documentación, configuración declarativa) puede omitir tests nuevos.
   Declara en strategy.md el motivo y la verificación alternativa. En traceability.md
   ese AC lleva «Test: —»; la columna Evidencia sigue siendo obligatoria.

   TRACK HOTFIX [FDGE-R17]: PHASE 4 está diferida, así que test-scenarios.md aún no
   existe. Escribe primero UN test que reproduzca el fallo, en rojo. La batería
   completa llega con la PHASE 4 retroactiva.

3. DOCUMENTACIÓN in-code — stubs antes del contenido
   → docs: PT-XXX <qué se documentó>

4. CÓDIGO — hasta que los tests pasen (VERDE)
   Ejecuta las tareas en el orden de tasks.md, actualizando su Estado.
   Commits atómicos por unidad lógica. Nunca big-bang al final.
   → feat|fix|refactor|chore: PT-XXX <descripción específica>

5. SUITE COMPLETA
   Unitarios verdes · integración sin regresiones · cobertura no desciende respecto a
   la línea base · lint sin errores nuevos.
   → test: PT-XXX all tests passing, update report

6. DELTA
   Registra en design.md toda decisión que cambió durante la implementación y por qué.
   Marca tasks.md como DONE. Rellena la columna «Test» de traceability.md.
   → docs: PT-XXX update proposal with actual vs planned delta

## PROHIBIDO
- Escribir código antes de tener tests en ROJO (salvo excepción declarada). [FDGE-R17]
- Commits que mezclen cambios lógicos, o con mensajes WIP/fix/changes/update/final.
                                                                            [FDGE-R19]
- Tocar archivos fuera de tasks.md o implementar algo de out-of-scope.md.   [FDGE-R20]
- Actualizar HISTORY.log, HANDOFF.md o los índices durante esta fase.

## Alerta de desvío                                                          [FDGE-R21]
Si el trabajo resulta más complejo de lo planificado: DETENTE y reporta con evidencia.
- Desvío dentro del scope declarado → continúa con ACK.
- Desvío que eleva la complejidad (TRIVIAL → STANDARD/MAJOR) → NO continúes.
  El PT vuelve a PHASE 2 en track STANDARD.

## Checkpoint
Reporta: tests pasados, archivos modificados, commits realizados, desvíos.
```

---

# PHASE 6 — Evidence

```
Implementación terminada. Ejecuta EXCLUSIVAMENTE PHASE 6 (Evidence & Self-Review).

## Contexto obligatorio
changes/PT-XXX-slug/{intake, test-scenarios, traceability}.md
docs/enterprise-documentation/11-Conventions.md

## 0. REDACTAR SECRETOS antes de escribir nada                              [FDGE-R45]
La evidencia vive en el repositorio y HISTORY.log es append-only: un secreto que entra aquí
NO se puede retirar. Antes de guardar request/response, logs o volcados de BD, sustituye por
«REDACTADO»: credenciales, tokens, claves privadas, cookies de sesión y datos personales
identificables. Anota al final del archivo qué redactaste.
verify-fdge rechaza patrones de secreto conocidos en la evidencia.

## 1. Generar evidencia — PROPORCIONAL al cambio                             [FDGE-R24]
Directorio: docs/implementation/evidence/PT-XXX/

  Backend      → salida COMPLETA de tests (no «pasó»), cobertura, logs relevantes
  API          → request y response reales con sus códigos de estado
  UI           → capturas antes/después y el flujo navegado
  Datos        → la consulta ejecutada y su resultado
  Build/infra  → salida del build, del pipeline o del comando

No exijas capturas de pantalla a un cambio de backend: eso es ceremonia, no evidencia.
El código no es evidencia. La ejecución es evidencia.                        [SUITE-R02]

## 2. manifest.json — OBLIGATORIO                                            [FDGE-R23]
docs/implementation/evidence/PT-XXX/manifest.json

{
  "pt": "PT-XXX",
  "generated": "<ISO-8601>",
  "criteria": [
    { "ac": "AC-01", "statement": "...", "scenarios": ["TS-01"],
      "tests": ["ruta:línea"], "evidence": ["ruta relativa a evidence/PT-XXX/"],
      "verified": true }
  ],
  "suite": { "passed": 0, "failed": 0, "skipped": 0, "coverage": 0.0, "baseline": 0.0 }
}

Cada ruta de "evidence" debe existir realmente en disco. Sin manifiesto válido no hay
PHASE 7.

## 3. Completar traceability.md
Rellena Test y Evidencia para cada AC.
Un AC sin TS, sin test o sin evidencia es un ORPHAN CRITERION y bloquea G3. [FDGE-R15]

## 4. Self-Review → evidence/PT-XXX/self-review.md
NO es un control: es una preparación para la revisión humana.               [FDGE-R25]

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
- [ ] Los test-scenarios de este PT quedan disponibles como insumo para QA

Estado: SELF_REVIEW_COMPLETE | SELF_REVIEW_BLOCKERS_FOUND
Con bloqueadores: corrígelos antes de continuar.

## PROHIBIDO
Actualizar HISTORY.log o HANDOFF.md · cerrar el PT.

## Checkpoint
Presenta el resumen de evidencia y el resultado del self-review.
```

---

# PHASE 7 — Validation · Compuerta **G3**

```
Evidencia completa. Ejecuta EXCLUSIVAMENTE PHASE 7 (Validation Gate).

## Contexto obligatorio
docs/implementation/evidence/PT-XXX/{manifest.json, self-review.md}
changes/PT-XXX-slug/{intake, traceability}.md

## Cierre según tipo

BUG
  Estado requerido: VALIDATION_PENDING                          [FDGE-R26 · EXEC-R05]
  El agente NO cierra bugs. En NINGÚN modo. La confirmación humana es obligatoria.
  Flujo: Implementación → Evidencia → VALIDATION_PENDING → validación humana → DONE.

  Si el PT nació de un QD-NNN: puedes ofrecer «delta QA PT-XXX» como evidencia de
  apoyo para la validación. La ejecución QA es evidencia; la decisión sigue siendo
  humana.                                                                    [FDGE-R28]

Condiciones de DONE por tipo:                                                [FDGE-R27]
FEATURE      → DONE solo si: tests verdes · manifiesto válido · TODOS los AC verificados
REFACTOR     → DONE solo si: comportamiento preservado por tests · barra de calidad
               alcanzada · RC-nn verificados
CHORE        → DONE solo si: la verificación declarada pasa
INVESTIGATION→ CLOSED cuando discovery.md tiene su sección «## Conclusión»: qué se
               determinó, qué evidencia lo sustenta, qué quedó sin determinar y el PT
               de seguimiento propuesto.                                     [FDGE-R42]
               Va directo a CLOSED: no pasa por INTEGRATED, no produce código.

## Resolución de G3 según el modo — EXECUTION-MODES.md §5.2
MANUAL                  → ACK humano siempre
SUPERVISED, AUTONOMOUS  → ACK humano si type = BUG
                          auto para el resto solo si se cumplen LAS SIETE condiciones:
                            type ≠ BUG · suite verde · cobertura no desciende ·
                            manifest.json válido · traceability sin huérfanos ·
                            self-review sin bloqueadores · verify-fdge sin errores
                          Auto-resolver significa que verify-fdge PASÓ, no que tú lo
                          afirmes.                                           [EXEC-R06]

## Checkpoint
Reporta el estado final del PT y cómo se resolvió G3.
Para BUG en VALIDATION_PENDING: DETENTE hasta confirmación humana explícita.
```

---

# PHASE 8 — Persistence

```
Validación resuelta. Ejecuta EXCLUSIVAMENTE PHASE 8 (Persistence).

## 1. Append a docs/implementation/HISTORY.log                               [FDGE-R29]
Formato canónico ÚNICO — no uses ninguna variante:

## PT-XXX — [TIPO]: [Título]
Fecha: YYYY-MM-DD
Estado: DONE | VALIDATION_PENDING | CLOSED
Severidad: S_ · Complejidad: ____ · Track: ____
Estructural: sí | no        ← sí si creó, movió, renombró o eliminó archivos, o cambió un
                              límite de módulo. Sin este dato la frescura del grafo no es
                              computable y verify-fdge lo rechaza.            [FDGE-R44]
Lote: EP-XXX          (omitir si no aplica)
Rama: <type>/PT-XXX-slug
Modo de ejecución: MANUAL | SUPERVISED | AUTONOMOUS
Objetivo: [una línea]
Causa raíz: [solo BUG]
Solución: [qué se hizo]
Archivos modificados:
  - ...
Evidencia: docs/implementation/evidence/PT-XXX/
Criterios: AC-01 ✓ · AC-02 ✓ · ...
Delta (real vs planificado): [qué cambió y por qué · «según plan» si nada]
Compuertas: G1 YYYY-MM-DD [nombre] · G2 YYYY-MM-DD [nombre|auto] · G3 YYYY-MM-DD [nombre|auto] · G4 [pendiente]
            Para un BUG, G3 DEBE llevar fecha y nombre humano: es la prueba de que no
            hubo auto-cierre, y la comprueba verify-fdge.                    [FDGE-R26]
Trazabilidad externa: [QD-XXX] [H-XXX] [R-XXX]     (omitir las que no apliquen)

Append-only. NUNCA reescribas ni edites una entrada existente.               [SUITE-R09]

## 2. Sobrescribir HANDOFF.md en MODO MERGE                                  [FDGE-R30]
ANTES de escribir, LEE el HANDOFF.md existente. PRESERVA todas las validaciones
pendientes e investigaciones activas que NO se relacionen con este PT.

# HANDOFF — Estado actual
Actualizado: YYYY-MM-DD · Último PT: PT-XXX · Modo: [MODE]
## Ramas activas
## Estado del sistema
## Bugs en VALIDATION_PENDING
## Validaciones pendientes
## Investigaciones activas
## Incidentes abiertos (INC-NNN)
## Riesgos conocidos
## Acciones recomendadas

## 3. Regenerar BACKLOG.md
Vista de todos los PTs vivos con su fase actual, lote y solapamiento, desde
REGISTRY.json y changes/.

## 4. Actualizar el índice de origen                                         [FDGE-R31]
En DISCOVERY.md / ENRICHMENT.md / REFACTOR_SCOPE.md, actualiza el ESTADO del PT al
valor canónico. Un PT cerrado que sigue figurando como pendiente hace que FPGE lo
re-proponga indefinidamente.

## 5. Actualizar REGISTRY.json
La entrada de allocations del PT: status, phase y structural.

Si el modo de ejecución cambió durante esta sesión, registra el cambio en HISTORY.log con
modo anterior, modo nuevo y motivo. Sin ese registro no se puede auditar por qué un PT tuvo
las compuertas que tuvo.                                                     [EXEC-R13]

## 6. Grafo                                                                  [FDGE-R32]
Si el PT creó, movió, renombró o eliminó archivos: decláralo explícitamente y solicita
la actualización del grafo de dependencias.

## PROHIBIDO
Modificar entradas existentes de HISTORY.log · eliminar entradas · modificar código.

## Checkpoint
Resumen: qué se hizo, estado final, si hace falta actualizar el grafo.
Siguiente: PHASE 9 (Integration).
```

---

# PHASE 9 — Integration · Compuerta **G4**

```
Persistencia completa. Ejecuta EXCLUSIVAMENTE PHASE 9 (Integration).

## Precondiciones — TODAS verificables                                       [FDGE-R34]
Comprueba y reporta ítem por ítem:

[ ] CI en verde
[ ] node docs/methodology/tools/verify-fdge.mjs PT-XXX  → sin errores
[ ] entrada en HISTORY.log
[ ] evidence/PT-XXX/manifest.json válido y con todas las rutas existentes
[ ] self-review.md presente y sin bloqueadores
[ ] traceability.md sin criterios huérfanos
[ ] estado del PT: DONE
[ ] si es BUG: la línea «Compuertas:» de HISTORY.log lleva «G3 YYYY-MM-DD [nombre]»
    CLOSED NO vale aquí: es posterior a INTEGRATED (LEXICON §5.1)
[ ] rama actualizada con la línea principal, sin conflictos

Si falta alguna: DETENTE y repórtala. No abras el PR.

## Secuencia
1. Abrir PR: "PT-XXX <tipo>: <título>"
   Cuerpo: enlace al Proposal Package, a la evidencia y al manifiesto.
   Lista de AC con su estado. Delta real vs planificado.
2. Esperar CI en verde.
3. COMPUERTA G4 — revisión humana.

   EL MERGE ES HUMANO EN LOS TRES MODOS, SIN EXCEPCIÓN.  [FDGE-R33 · EXEC-R04 · SUITE-R06a]
   Registra en la línea «Compuertas:» quién resolvió cada una.               [SUITE-R22]
   No hay configuración, urgencia ni tipo de trabajo que lo automatice.
   Prepara todo, describe la acción exacta y DETENTE.                        [EXEC-R07]

4. Tras el merge (lo ejecuta el humano):
   - Tag, si aplica al esquema de versionado del proyecto.
   - Borrar la rama.
   - PT → INTEGRATED. Marcar CLOSED en intake.md.
   - CONSERVAR changes/PT-XXX-slug/. NUNCA se borra: es el registro de la
     propuesta y de su delta.                                                [FDGE-R35]
   - Actualizar HANDOFF.md, BACKLOG.md y REGISTRY.json.
   - Añadir a la línea «Compuertas» de HISTORY.log: G4 [fecha/quién].

## Checkpoint
Reporta el estado de las precondiciones y detente en G4.
```

---

# PHASE 10 — Rollback

```
Un PT INTEGRATED está causando un fallo. Ejecuta EXCLUSIVAMENTE PHASE 10 (Rollback).

## 1. Abrir el incidente
Asigna INC-NNN desde REGISTRY.json.                                          [SUITE-R08]

Append a docs/implementation/INCIDENTS.log:

## INC-NNN — YYYY-MM-DD
PT de origen: PT-XXX (<rama>, integrado YYYY-MM-DD)
Detectado: YYYY-MM-DD HH:MM · por: [quién] · entorno: [cuál]
Síntoma observado:
Impacto: [usuarios, duración, pérdida de datos sí/no]
Decisión: REVERT | FIX-FORWARD
Estado: OPEN

## 2. Revertir
git revert <sha del merge>
NUNCA reescribas historia. NUNCA git push --force.                    [SUITE-R06f]
El revert es una operación sobre la rama principal → requiere autorización humana.
Prepara el comando exacto y DETENTE.                                         [EXEC-R07]

## 3. Registrar
- PT-XXX → REVERTED
- AÑADE una entrada NUEVA a HISTORY.log referenciando la original.
  La entrada original NUNCA se edita.                             [FDGE-R36 · SUITE-R09]

  ## PT-XXX — REVERTIDO por INC-NNN
  Fecha: YYYY-MM-DD
  Entrada original: [enlace/fecha]
  Commit de revert: <sha>
  Motivo:

## 4. Trabajo de seguimiento                                                 [FDGE-R37]
Abre un PT nuevo de tipo INVESTIGATION (si la causa raíz es desconocida) o BUG (si es
conocida), con el INC-NNN como origen del Intake.
Un INC-NNN sin PT de seguimiento queda ABIERTO.

## 5. Actualizar
INCIDENTS.log (commit de revert, hora de restauración, PT de seguimiento) ·
HANDOFF.md · BACKLOG.md · REGISTRY.json.

## Nota sobre el modo de ejecución
Un incidente abierto sin causa raíz documentada fuerza el descenso a modo MANUAL
hasta que se cierre.                                                         [EXEC-R14]
```

---

# TRACK EXPRESS — `TRIVIAL`

```
Ejecuta el track EXPRESS para la tarea TRIVIAL indicada.

EXPRESS condensa PHASE 2 + 3 + 4 en un bloque con una sola compuerta G2.
CONDENSA; NO COLAPSA. Intake, evidencia, validación, persistencia e integración
ocurren igual.                                                    [EXEC-R09 · LEX-R02]

## PHASE 1 — Intake (obligatorio, sin atajo)
Aplica el bloque de PHASE 1 completo. La plantilla y la firma son las mismas.
Un TRIVIAL sin intención declarada sigue siendo trabajo sin especificar.     [FDGE-R01]

## PHASE 2+3+4 condensadas → changes/PT-XXX-slug/strategy.md

## Contexto obligatorio
1. changes/PT-XXX-slug/intake.md
2. docs/enterprise-documentation/11-Conventions.md
3. El archivo o componente específico afectado

## Contenido
PT-XXX — TRIVIAL — [título]
Clasificación: [tipo] / TRIVIAL / S_
Qué es exactamente:
Archivos afectados:
Cambio propuesto (2-3 líneas):
AC-01: [criterio único, verificable, derivado del Intake]
Verificación: [cómo se comprueba que está hecho]
Tests: [nuevos | ninguno — motivo, según FDGE-R18]
Out of scope: [del Intake]

No se requiere Proposal Package completo.

## COMPUERTA G2
Presenta el plan condensado y espera su resolución según el modo.

## Tras G2
PHASE 5  implementar · commits atómicos con el prefijo correcto
PHASE 6  evidencia mínima (una verificación EJECUTADA + suite en verde) +
         manifest.json (obligatorio también aquí) + self-review abreviado
PHASE 7  validación — si es BUG, VALIDATION_PENDING igualmente
PHASE 8  HISTORY.log con Delta «según plan» · HANDOFF.md · índice
PHASE 9  integración por G4 como cualquier otro PT

## Regla de escape                                                           [EXEC-R10]
Si durante EXPRESS descubres que el trabajo NO es TRIVIAL: DETENTE.
El PT vuelve a PHASE 2 en track STANDARD. No se termina rápido «porque ya casi está».
```

---

# TRACK HOTFIX — `S1`

```
Ejecuta el track HOTFIX. SOLO válido si severity = S1 declarada por el humano.
Si no es S1, este track no aplica: usa STANDARD o EXPRESS.                   [FDGE-R22]

Este carril existe para que nadie tenga que saltarse el framework en silencio.
Difiere el análisis y la propuesta; NO los elimina.

## Recorrido
PHASE 1  Intake mínimo: qué pasa · comportamiento esperado · impacto · FIRMA   ── G1 ──
         La firma humana NO se omite. Es lo que distingue un hotfix de un bypass.
PHASE 5  Implementación en rama hotfix/PT-XXX-slug
PHASE 6  Evidencia: prueba de que el síntoma desapareció + suite en verde + manifest.json
PHASE 9  Integración                                                          ── G4 ──

## Obligatorio al abrir
1. Rama hotfix/PT-XXX-slug
2. Abrir INC-NNN en INCIDENTS.log describiendo el impacto
3. Anotar en HANDOFF.md que hay un HOTFIX en curso con su fecha límite

## Deuda documental — 48 HORAS
Dentro de las 48 h siguientes al merge hay que completar retroactivamente:
  PHASE 2  análisis y causa raíz
  PHASE 3  estrategia (incluido por qué esta solución y qué alternativas había)
  PHASE 4  Proposal Package retroactivo con la trazabilidad AC → test → evidencia
  PHASE 7  validación formal del BUG por un humano
  PHASE 8  entrada completa en HISTORY.log

## Bloqueo                                                                   [EXEC-R11]
Documentación retroactiva vencida → BLOQUEA la apertura de todo PT nuevo.
El bloqueo se levanta completando la documentación, nunca ignorándolo.
Repórtalo en PHASE 0 de cada sesión hasta que se resuelva.
```

---

# Lotes — `EP-NNN`

```
Ejecuta un lote de PTs.

Entrada:  [START EP] <título>
     o:   promote FPGE R-NNN..R-MMM as EP-XXX

## 1. Abrir el lote
Asigna EP-NNN desde REGISTRY.json. Crea changes/EP-NNN-slug/intake.md desde la plantilla
INTAKE/templates/EPIC-INTAKE.md                                              [INTAKE-R09]
con:
  Objetivo común del lote
  PTs que lo componen (referencias, no copias)
  Orden sugerido y su motivo
  Dependencias entre PTs
  Firma humana ÚNICA que cubre los Intakes de todos sus PTs             [INTAKE-R08]

Cada PT conserva SU PROPIO intake.md completo. El lote ahorra la ceremonia de firmar
cinco veces, no el contenido.                                                [FDGE-R38]

## 2. Análisis de solapamiento — antes de ejecutar nada                      [FDGE-R40]
Lee el campo «Archivos» de tasks.md de cada PT y calcula qué PTs comparten archivos.
Declara el plan en BACKLOG.md:

## EP-NNN — [título]
Modo: [MODE] · Admitido: YYYY-MM-DD · Firma: [nombre]

| Orden | PT | Tipo | Sev | Archivos | Depende de |
|:--|:--|:--|:--|:--|:--|

Solapamiento detectado: [pares] → serializados.

## 3. Ejecución
SECUENCIAL por defecto.                                                      [EXEC-R08]
Cada PT recorre su ciclo completo con las compuertas de su tipo y del modo vigente.

## 4. Regla de parada                                                        [FDGE-R41]
El lote se detiene COMPLETO ante el primer BLOCKED o el primer fallo de compuerta no
resuelto. NO continúa «con los que sí pudieron»: los PTs de un lote suelen compartir
supuestos, y seguir sobre un supuesto falso multiplica el rework.

El humano puede retirar el PT problemático del lote y ordenar reanudar explícitamente.

## 5. Cierre
EP-NNN → CLOSED cuando todos sus PTs están INTEGRATED/CLOSED o fueron retirados
explícitamente. Registra una entrada propia en HISTORY.log enumerando sus PTs.
```

---

# status FDGE

```
status FDGE

Reporta, sin modificar ningún archivo:

1. Modo de ejecución vigente y si aplica el descenso automático a MANUAL.
2. PTs vivos: ID, tipo, severidad, fase actual, estado, rama, lote.
3. PTs en VALIDATION_PENDING y desde cuándo.
4. Lotes abiertos y su progreso.
5. Incidentes abiertos y si tienen PT de seguimiento.
6. Hotfixes con documentación retroactiva pendiente y su fecha límite.
7. Ramas abiertas sin PT asociado (dangling branches).
8. Últimos 3 PTs integrados.
9. Foundation: fecha y PTs transcurridos desde entonces.
10. Versión de suite y desajustes con CHANGELOG.md.

11. TRABAJO ESTANCADO                                                        [FDGE-R47]
    PTs en DRAFT o BLOCKED con más de 30 días: antigüedad y motivo declarado.
    Con más de 60 días: propón explícitamente DEFERRED o REJECTED.

12. MÉTRICAS DEL PROCESO — calculadas desde HISTORY.log                      [FDGE-R46]
    · tasa de rechazo por compuerta: cuántas veces G1/G2/G3/G4 devolvieron trabajo
    · % de PTs cuyo Delta NO fue «según plan» — mide si la planificación acierta
    · PTs revertidos y su proporción sobre los integrados
    · hotfixes ejecutados y cuántos saldaron su deuda documental en plazo
    · antigüedad media del trabajo parado
    La suite mide el producto; esto la mide a ella.

NO recalcules nada. NO sobrescribas nada.
```
