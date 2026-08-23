# CORE — Núcleo operativo

<!-- GENERADO por tools/build-core.mjs · NO EDITAR A MANO (SUITE-R16) -->
<!-- cuerpo: 2fb5426718a8 -->
<!-- fuentes: RULES.md:26e7781ea2de LEXICON.md:0d2845bde60d EXECUTION-MODES.md:c2dd967ff3d7 PHASES.md:e730d6b712c0 -->

Esto es **lo único** que carga el agente (`SUITE-R15`): reglas **y** procedimiento. Los
documentos completos solo se abren cuando una línea de aquí lo remite.

Detalle y porqué: `RULES.md` · `LEXICON.md` · `EXECUTION-MODES.md` · `PHASES.md`.
Los `*-Prompts.md` son la expansión legible de `PHASES.md` para copiar y pegar en modo
`MANUAL`; en runtime no se cargan.

## ANTES DE NADA — ¿te están pidiendo algo, o estáis pensando en voz alta?   `SUITE-R52`

No todo mensaje abre trabajo. **Declara en una línea qué has entendido** y sigue; si te
equivocas, te corregirán — lo que no vale es decidirlo en silencio.

```
PETICIÓN       tiene condición de terminado: se puede escribir «termina cuando: …»
               → abre PHASE 1, con lo pedido como origen
CONVERSACIÓN   no la tiene: es una duda, una idea, una queja, un «¿qué opinas?»
               → produce una RESPUESTA. No una allocation, no un issue, no compuertas
```

Una conversación **puede acabar** en petición, y entonces lo conversado es su origen. Pero no
empieza siéndolo. Convertir una duda en trabajo gasta compuertas y ensucia el tablero; tratar
una orden como charla pierde el trabajo.

## LO PRIMERO — el estado sale del tablero, no de tu memoria   `SUITE-R49`

**Antes de responder nada sobre el trabajo en curso, antes de tocar un archivo y antes de
avanzar de fase**, ejecuta:

```bash
node docs/methodology/tools/tracker.mjs siguiente
```

Su salida es **la respuesta** a qué toca y cómo se cierra. No es una sugerencia que confirmar
con lo que recuerdes: si lo que recuerdas no coincide, **el que se equivoca no es el tablero**.

Una consulta vale para **un turno**. Si el turno anterior cambió el registro o el tablero, está
caducada — vuelve a preguntar. Y si no se puede consultar —sin plataforma, sin credencial— se
declara `SIN EVALUAR` y se dice; no se sustituye por lo que parezca.

Esto está aquí, antes que las reglas, porque un agente que recorre las fases de memoria se las
salta: se han dado por terminados merges sin mirar la compuerta que corre después, se han
cerrado issues en órdenes que ninguna regla decía, y se han declarado cambios de especificación
que nunca se hicieron. Ninguno fue por desconocer la regla. Todos por no preguntar.

## Fases

```
FDGE  0 Context · 1 Intake◆G1 · 2 Analysis(2-B bug|2-E feature|2-R refactor) · 3 Strategy
      4 Proposal◆G2 · 5 Implementation · 6 Evidence · 7 Validation◆G3 · 8 Persistence
      9 Integration◆G4 · 10 Rollback
      tracks: STANDARD | EXPRESS(TRIVIAL) | HOTFIX(S1)
FND   0 Reconnaissance · 1 Reconciliation◆G0 · 2 Context · 3 Technical · 4 Conventions
      5 Inventory+Graph · 6 Validation
QA    1 Recon · 2 Plan◆ · 3 Specs◆ · 4 Exec · 5 Analysis · 6 Report◆ · 7 Promotion
PTSA  0 Value · 1-5 Inventory→Criticality · 6 Traceability(BLOQUEA 7-10) · 7 D2 · 8 D1
      9 D4 · 10 D3 · 11-12 Consolidation+Score · 13-14 Certification
FPGE  freshness → evidencia → candidatos → priority → ROADMAP◆ → promote
```

## Compuertas × modo

```
             MANUAL      SUPERVISED              AUTONOMOUS
G1 DoR       humano      humano                  humano (firma por lote)
G2 Proposal  humano      humano                  auto si 5 cond. §5.1 EXEC
G3 Valid.    humano      humano si BUG; auto     idem
G4 Merge     HUMANO      HUMANO                  HUMANO — sin excepción
otras        humano      checkpoint              checkpoint
```

Nunca automatizado: merge/push a main · cerrar BUG · migrar o borrar datos · producción ·
editar docs/methodology · push --force · credenciales.

## Clasificaciones

```
tipo        BUG · FEATURE · REFACTOR · INVESTIGATION · CHORE
complejidad TRIVIAL · STANDARD · MAJOR      ← esfuerzo y riesgo técnico; la propone el agente
severidad   S1 · S2 · S3 · S4               ← urgencia de negocio; la declara el HUMANO
            EJES INDEPENDIENTES: un bug crítico puede ser TRIVIAL/S1
            S1 sistema caído · pérdida de datos · brecha · bloqueo total → habilita HOTFIX
            S2 flujo crítico degradado con workaround                    → prioridad alta
            S3 flujo no crítico, o feature esperada                      → cadencia normal
            S4 cosmético · mejora · deuda sin impacto observable         → se agrupa en lote
track       STANDARD · EXPRESS (solo TRIVIAL) · HOTFIX (solo S1)
modo        MANUAL · SUPERVISED (por defecto) · AUTONOMOUS
```

## Estados

```
Lifecycle  DRAFT READY REOPENED IN_PROGRESS BLOCKED BLOCKED_DOMAIN IN_REVIEW
           VALIDATION_PENDING DONE INTEGRATED CLOSED REJECTED DEFERRED REVERTED
           CLOSED es POSTERIOR a INTEGRATED. G4 exige DONE.
Execution  PASS FAIL SKIP ERROR
Phase      NOT_STARTED IN_PROGRESS BLOCKED COMPLETE NEEDS_REVIEW
```

## IDs — todos desde REGISTRY.json, nunca contando archivos

```
PT EP QA QR QD H E P R INC · AC-nn TS-nn RC-nn por PT · RULE-nn en 11-Conventions
```

## Triggers

```
[START FIDE] [START FOUNDATION] [FOUNDATION VALIDATED]
[START PT] <tipo>: <título> · [START EP] <título> · resume PT-XXX · status FDGE
[START QA] · delta QA PT-XXX · status QA · promote QD-NNN to FDGE|PTSA · close QD-NNN
[START PTSA] · resume PTSA · delta PTSA · status PTSA · audit PTSA close H-XXX
[START FPGE] · promote FPGE R-NNN[..R-MMM as EP-XXX] · status FPGE
```

## Rutas

```
docs/enterprise-documentation/  00-Baseline 01-Platform-Overview 02-PRD 03-TRD 04-App-Flow
                                05-UI-UX-Brief 06-Backend-Architecture 07-Database-Architecture
                                08-API-Catalog 09-Security-Architecture 10-Technical-Debt
                                11-Conventions inventory/
docs/implementation/            REGISTRY.json HISTORY.log INCIDENTS.log SESSION_LOG.md
                                HANDOFF.md BACKLOG.md RECONCILIATION.log
                                DISCOVERY.md ENRICHMENT.md REFACTOR_SCOPE.md (índices)
                                ROADMAP.md ROADMAP_HISTORY.log evidence/PT-XXX/
changes/PT-XXX-slug/            intake context discovery|enrichment|scope strategy design
                                tasks spec-changes test-scenarios out-of-scope traceability
QA/ qa/ PTSA/ graphify-out/ docs/_archive/
```

## Reglas

Severidad: **H**=HARD detiene · **S**=SOFT exige justificación registrada · **C**=CHECK lo
verifica un script y bloquea la integración.

### SUITE — Transversales

`SUITE-R00` **H** Ninguna regla de este documento puede ser derogada, relajada o reinterpretada por el CLAUDE.md de un proyecto destino.
`SUITE-R01` **H** Evidence Before Action. Toda decisión técnica se apoya en evidencia verificable en un artefacto o en la ejecución observada. Nunca en memoria del agente, intuición, suposición ni contexto conversacional.
`SUITE-R02` **H** Evidence After Execution. El código no es evidencia. La ejecución verificable sí. Toda modificación produce evidencia antes de considerarse completa.
`SUITE-R03` **H** Session Independence. Ninguna sesión depende de la memoria del agente. Todo conocimiento relevante persiste en artefactos del repositorio antes de terminar la sesión.
`SUITE-R04` **H** No Hidden Reasoning. El razonamiento estratégico se materializa en un artefacto. Una decisión importante que solo existe en el chat no existe.
`SUITE-R05` **H** Human Governance. Toda acción irreversible requiere decisión humana explícita. Ver SUITE-R06.
`SUITE-R06` **H** Lista cerrada de acciones irreversibles. Ningún modo de ejecución automatiza: (a) merge o push a la rama principal; (b) cierre de un ítem de tipo BUG; (c) migración, borrado o transformación destructiva de…
`SUITE-R07` **H** No Foundation Skip. Ningún componente opera sobre un proyecto sin docs/enterprise-documentation/ generada y validada con [FOUNDATION VALIDATED]. Ver FND-R08 para la verificación real.
`SUITE-R08` **C** Un solo asignador de identificadores. Todo ID se obtiene de docs/implementation/REGISTRY.json. Derivarlo contando entradas en un .md o .json está prohibido (LEX-R04, LEX-R06). Y toda allocation de tipo PT…
`SUITE-R09` **H** Append-only es literal. Un artefacto declarado append-only nunca se reescribe, reordena ni compacta. Corregir un error pasado se hace con una entrada nueva que lo referencia, no editando la anterior.
`SUITE-R10` **H** Propiedad de artefactos. Cada artefacto tiene exactamente un componente dueño. Solo el dueño escribe en él. Ver la matriz de §Parte 9.
`SUITE-R11` **S** Declared coverage. Ningún score (Health PTSA, QA Health, confianza de fase) es válido sin cobertura y freshness declaradas junto al número.
`SUITE-R12` **H** Sin auto-activación. Ningún componente se activa sin su trigger explícito (LEX-R18).
`SUITE-R13` **C** Versionado. Todo proyecto destino declara suite_version en REGISTRY.json y en su CLAUDE.md. Un desajuste con docs/methodology/CHANGELOG.md se reporta al inicio de sesión.
`SUITE-R14` **H** Un mismo ID de regla no puede definirse en dos documentos.
`SUITE-R15` **H** Carga mínima de contexto. El agente carga CORE.md —el núcleo operativo compilado— y no los documentos completos de docs/methodology/. Abre un documento completo solo cuando CORE.md lo remite explícitamente…
`SUITE-R16` **C** CORE.md es generado, nunca editado a mano.
`SUITE-R17` **H** Compuerta de migración. Si REGISTRY.suite_version no coincide con la versión vigente de CHANGELOG.md, el proyecto entra en modo restringido: solo se permiten [START MIGRATE], los status * y terminar los PTs…
`SUITE-R18` **H** Las sesiones activas sobreviven a una migración.
`SUITE-R19` **C** Migración verificada, no solo ejecutada. tools/migrate.mjs detecta la versión instalada, ejecuta en --dry-run por defecto y solo modifica con --apply. Lo que no puede automatizarse —firmas retroactivas,…
`SUITE-R20` **C** PHASES.md y los *-Prompts.md no pueden divergir.
`SUITE-R21` **H** El CLAUDE.md del proyecto no repite reglas.
`SUITE-R22` **S** Quién es «el humano». La suite no exige que las cuatro compuertas las resuelvan personas distintas: está diseñada también para equipos de una sola persona asistida por IA, donde exigirlo la haría…
`SUITE-R23` **H** Disciplina de respuesta. Lo que el agente escribe al humano cuesta tokens y tiempo de lectura. No incluye: lo que salió bien · por qué una decisión es correcta · justificaciones de diseño · recapitulaciones…
`SUITE-R24` **H** Directiva sin relato. Lo que el agente lee sigue la misma economía: PHASES.md usa forma telegráfica (LEE · HAZ · SALE · NO · PARA) y CORE.md recorta cada regla a su primera frase imperativa. El rationale…
`SUITE-R25` **H** Overlay por componente. CORE.md lleva las reglas que toda sesión necesita. Un componente cuyo ruleset propio no cabe ahí sin encarecer todas las sesiones recibe un overlay que se carga solo al invocarlo:…
`SUITE-R26` **C** Toda regla HARD aspira a comprobación mecánica.
`SUITE-R27` **H** Qué prueba una firma. Una firma es una declaración de responsabilidad, no una prueba criptográfica: el agente escribe el archivo y podría escribir cualquier nombre. Por eso el CLAUDE.md del proyecto declara…
`SUITE-R28` **H** La conversación es la interfaz; el artefacto es el registro.
`SUITE-R29` **H** Dependencias declaradas, comprobadas e instaladas con permiso.
`SUITE-R30` **H** La instalación deja registro de lo que ejecutó.
`SUITE-R31` **H** La divergencia del marco se mide. La suite se instala copiando docs/methodology/ al proyecto, así que cada proyecto tiene la suya y nada avisa cuando se separan — lo que SUITE-R21 intenta evitar y la…
`SUITE-R32` **H** Un espacio de trabajo nace con contenido. Git no versiona directorios vacíos: un PTSA/ creado por el instalador y nunca escrito desaparece en el primer clon, y el verificador lo reporta como «nada que…
`SUITE-R33` **H** El estado se declara en un bloque corto y fijo.
`SUITE-R34` **H** El estado tiene que ser más reciente que el trabajo.
`SUITE-R35` **H** El registro asigna; la plataforma espeja. REGISTRY.json sigue siendo el único asignador de identificadores (SUITE-R08) y cada allocation guarda su número de issue. La plataforma —GitHub, Azure— responde qué…
`SUITE-R36` **H** Al adoptar la plataforma, solo migra lo vivo.
`SUITE-R37` **H** Qué se versiona, decidido de una vez. Evidencia, ledgers y docs/methodology/ sí: auditar un commit antiguo exige saber qué reglas lo gobernaban, y sin la carpeta eso depende de que el paquete siga…
`SUITE-R38` **H** Un patrón crítico vive en un solo sitio y viaja con su contrato.
`SUITE-R39` **H** La frontera del proyecto se declara, y se dice qué la sostiene.
`SUITE-R40` **H** La versión vigente se deriva; no se escribe dos veces.
`SUITE-R41` **H** Cauce no se instala sobre sí mismo, y se reconoce por identidad.
`SUITE-R42` **H** El merge se propone donde se pueda revisar.
`SUITE-R43` **H** Lo que una persona escribe en la plataforma se lee.
`SUITE-R44` **H** Cerrar un lote no borra lo que aplazó. La columna «Dónde va» de cada fila de out-of-scope.md es vocabulario cerrado: o — —no aplaza nada, queda fuera y punto— o la cita de un identificador del registro.…
`SUITE-R45` **H** Un lote declara qué se hace al cerrarlo. El intake de un EP lleva una sección ## Cierre del lote con una fila por cosa que se resuelve en el cierre y no en ninguna de sus tareas —la entrada de CHANGELOG.md,…
`SUITE-R46` **H** El tablero no se adelanta a la rama por defecto.
`SUITE-R47` **H** El espejo se comprueba donde el registro asigna.
`SUITE-R48` **H** Qué sigue lo dice el tablero, no la memoria del agente.
`SUITE-R49` **H** Consultar el tablero es lo primero, y «consultado» está definido.
`SUITE-R50` **H** El punto de entrada es el tablero. cauce start imprime el estado del tablero y después el núcleo, en ese orden, y no hay forma de obtener lo segundo sin lo primero. No es un recordatorio: es el arranque.…
`SUITE-R51` **H** La jerarquía de la plataforma es estructura, no prosa, y el enlace del issue resuelve.
`SUITE-R52` **H** Una petición se distingue de una conversación, y se declara cuál es.
`SUITE-R53` **H** La regla se alcanza desde el fallo, y lo que puede fallar se deriva.
`SUITE-R54` **H** El agente lee su manual, y puede consultarlo.
`SUITE-R55` **H** Las decisiones humanas de una migración se conducen, no se enumeran.
`SUITE-R56` **H** El rastro de una tarea sobrevive a la rama que lo produjo.
`SUITE-R57` **H** Lo integrado no se acumula sin sellar. Si hay más de N tareas INTEGRATED de lotes ya cerrados que no están en el último tag de versión, G2 se bloquea hasta que una versión cierre. N = 3 por defecto,…
`SUITE-R58` **H** El registro solo lo escribe el comando, y el marco lo comprueba.
`SUITE-R59` **H** El escape que no existe no se rompe. Un patrón se escribe como regex literal; una secuencia de control se produce con String.fromCharCode; un texto largo se escribe a un archivo, nunca por la línea de…

### LEX — Nombres

`LEX-R01` **H** Los documentos Framework-*.md no numeran sus estados cognitivos.
`LEX-R02` **H** EXPRESS es un track, no una fase. Un PT de complejidad TRIVIAL puede recorrer el track EXPRESS, que condensa PHASE 2 + 3 + 4 en un único bloque con una sola compuerta G2. Nunca omite PHASE 1, 6, 7, 8 ni 9.…
`LEX-R03` **H** El componente se llama FQAGE en prosa normativa y QA en triggers, rutas y nombres de archivo ([START QA], QA/, Framework-QA.md).
`LEX-R04` **H** Todo identificador es monotónico, único y permanente.
`LEX-R05` **H** Las reglas normativas se identifican con prefijo de componente, nunca con una R desnuda.
`LEX-R06` **H** Asignar un identificador es: leer counters, incrementar, escribir el nuevo valor y añadir la entrada a allocations en la misma operación.
`LEX-R07` **H** La suite tiene tres enumeraciones de estado y ninguna más.
`LEX-R08` **H** Un ítem de tipo BUG nunca transita de IN_REVIEW a DONE por acción del agente.
`LEX-R09` **H** Los valores CLOSED-WONTFIX, CLOSED-ACCEPTED y REJECTED que FPGE v3 escribía en artefactos ajenos quedan derogados.
`LEX-R10` **H** Un archivo tiene un solo nombre. Cualquier documento que lo referencie usa exactamente esta grafía.
`LEX-R11` **H** Todo generador de esta carpeta debe usar exactamente estos nombres.
`LEX-R12` **H** Estos tres archivos son append-only e índices.
`LEX-R13` **H** Ningún archivo de trabajo de un PT vive en una ruta global.
`LEX-R14` **H** Los nombres de directorio de la suite están en inglés.
`LEX-R15` **H** El archivo instrucctions.md (con errata) queda derogado.
`LEX-R16` **H** Gramática única: [VERB COMPONENT] para triggers de arranque en corchetes; verbo componente [argumento] en minúscula para operaciones sobre un componente ya activo.
`LEX-R17` **H** resume PTSA y delta PTSA son operaciones distintas con precondiciones distintas.
`LEX-R18` **H** Ningún componente se auto-activa. En ausencia de trigger, el agente opera como asistente normal. La única excepción es FDGE, que rige toda actividad de desarrollo por defecto — pero incluso FDGE requiere…
`LEX-R19` **H** Complejidad y severidad son ejes independientes.
`LEX-R20` **H** Términos derogados. Su aparición en cualquier documento de la suite es un defecto que tools/verify-suite.mjs debe reportar.
`LEX-R21` **H** Ante un conflicto entre documentos, el orden de autoridad es:
`LEX-R22` **H** Los documentos Framework-*.md explican; no mandan.
`LEX-R23` **H** Un ID se define en exactamente un documento.
`LEX-R24` **H** Sub-identificadores. Una regla con cláusulas enumeradas admite sub-IDs con letra minúscula pegada: SUITE-R06a, SUITE-R06f. Solo para citar una cláusula concreta; la regla sigue siendo una sola y se define…
`LEX-R25` **H** CORE.md, CORE-PTSA.md, PHASES.md, tools/ y los directorios templates/ forman parte del paquete instalable.
`LEX-R26` **H** Un campo que solo pueda rellenar la memoria no entra en CHECKPOINT.json.
`LEX-R27` **H** Un lote (EP-NNN) NO lleva type: se reconoce por su identificador, que el registro asigna (SUITE-R08) y que siempre está.
`LEX-R28` **H** El tipo de un caso de QA es uno de esos cuatro.

### EXEC — Compuertas y modos

`EXEC-P1` **H** La compuerta protege contra lo irreversible, no contra el avance.
`EXEC-R01` **H** Un checkpoint siempre produce un registro legible.
`EXEC-R02` **H** SUPERVISED es el modo por defecto. Un proyecto que no declara modo opera en SUPERVISED.
`EXEC-R03` **H** AUTONOMOUS no significa «sin humano». Significa que el humano decide dos veces por lote (al admitirlo y al integrarlo) en lugar de cuatro veces por PT.
`EXEC-R04` **H** G4 es humana en los tres modos, sin excepción (FDGE-R33, SUITE-R06a).
`EXEC-R04a` **H** La constancia de una G4 tiene forma fija. Una entrada en docs/implementation/SESSION_LOG.md cuyo encabezado sea ## <YYYY-MM-DD> · … y mencione G4, VoBo o autorizad…, con un nombre de firmantes en su cuerpo.…
`EXEC-R05` **H** G3 es humana para todo BUG en los tres modos (FDGE-R26, LEX-R08).
`EXEC-R06` **H** Estas condiciones son verificables mecánicamente, no declarativas.
`EXEC-R07` **H** Si un PT requiere una de estas acciones para completarse, el agente prepara todo lo demás, se detiene en el punto exacto y describe el comando a ejecutar.
`EXEC-R08` **H** HARD · Los tres modos exigen lo mismo. Un modo cambia quién resuelve una compuerta y cuándo se pide confirmación. Nunca cambia qué se exige: ni un artefacto menos, ni una regla que no se comprueba, ni…
`EXEC-R09` **H** EXPRESS condensa; no colapsa. Las fases ocurren y se documentan; solo se agrupan en menos artefactos y menos compuertas. Omitir Intake, evidencia, validación, persistencia o integración está prohibido en…
`EXEC-R10` **H** Si durante EXPRESS el agente detecta que el trabajo no es TRIVIAL, se detiene y el PT vuelve a PHASE 2 en track STANDARD (FDGE-R21).
`EXEC-R11` **H** Un hotfix con documentación retroactiva vencida bloquea la apertura de todo PT nuevo.
`EXEC-R12` **H** El modo se declara en el CLAUDE.md del proyecto y solo lo cambia un humano.
`EXEC-R13` **H** Un cambio de modo se registra como una entrada en HISTORY.log, con fecha, modo anterior, modo nuevo y motivo.
`EXEC-R14` **H** Restricción automática de compuertas. Cuando se cumple cualquiera de las condiciones de abajo, el agente opera como si el modo fuera MANUAL y lo declara al inicio de la sesión.

### FND — Foundation

`FND-R01` **H** Nothing is invented. Todo hecho documentado cita su fuente: ruta de archivo y línea, o el comando que lo evidencia. Un hecho no citable no se documenta: se registra como «No determinado» en…
`FND-R02` **H** Foundation descubre, no diseña. Las recomendaciones van exclusivamente a 10-Technical-Debt.md, separadas de los hechos observados.
`FND-R03` **C** Los nombres de archivo generados son exactamente los de LEX-R10 §6.1.
`FND-R04` **H** Re-ejecutar Foundation sobrescribe el paquete completo.
`FND-R05` **C** 11-Conventions.md contiene, como mínimo: estructura de carpetas, convenciones de naming con ejemplos reales, patrones arquitectónicos con ejemplo de código, y al menos 3 Hard Rules en formato RULE-nn.
`FND-R06` **H** Foundation está completo solo tras [FOUNDATION VALIDATED] emitido por un humano que declaró explícitamente haber leído el PRD y el TRD.
`FND-R07` **S** Se re-ejecuta cuando: cambia la arquitectura principal, se añade un módulo mayor, pasan 3 meses de desarrollo activo, u otro componente detecta discrepancias.
`FND-R08` **C** La verificación de existencia de Foundation comprueba los archivos del núcleo, no la carpeta.
`FND-R09` **H** Inventario del desorden. Antes de generar nada, Foundation cataloga toda la documentación preexistente del repositorio (*.md, wikis locales, notas, ADRs, READMEs de subcarpeta) en 00-Baseline.md, con una…
`FND-R10` **H** Compuerta de reconciliación (G0). Nada se mueve, archiva ni borra sin ACK humano sobre 00-Baseline.md. Es la única compuerta de Foundation además del [FOUNDATION VALIDATED] final.
`FND-R11` **H** Nada se borra: se archiva. Los documentos marcados ARCHIVE o SUPERSEDE se mueven a docs/_archive/<fecha>/ conservando su ruta original. DELETE solo aplica a artefactos regenerables (builds, cachés,…
`FND-R12` **H** Fuente única tras la reconciliación. Al cerrar Foundation, docs/enterprise-documentation/ es la única documentación de arquitectura, dominio y convenciones vigente. Cualquier documento superviviente marcado…
`FND-R13` **C** Línea base de divergencia. Verificado: si existe 00-Baseline.md, debe declarar totales de inventario, divergencias y confianza de partida; si existen decisiones en RECONCILIATION.log, debe existir…
`FND-R14` **C** El grafo forma parte del paquete. Foundation genera o exige graphify-out/ sobre src/ y registra en REGISTRY.json el bloque graph con generated, scope y pt_at_generation. Sin grafo, Foundation cierra con…
`FND-R15` **H** Reconciliación suelta. PHASE 1 — Reconciliation puede ejecutarse aislada sobre un proyecto que ya tiene Foundation, con [START RECONCILE]. Actualiza 00-Baseline.md y RECONCILIATION.log y no regenera el…
`FND-R16` **H** Inventario estructural del código. PHASE 1 cataloga también el desorden del código, no solo de la documentación: código fuera de src/ · módulos duplicados o casi duplicados · módulos huérfanos que nadie…
`FND-R17` **H** Foundation no mueve código. Diagnostica y propone; ejecuta FDGE. Cada normalización estructural aprobada en G0 se convierte en un PT de tipo REFACTOR con Estructural: sí, y pasa por sus compuertas, sus…
`FND-R18` **H** La estructura objetivo no se improvisa. Toda propuesta de normalización cita la estructura declarada en 11-Conventions.md §Folder Structure. Si esa sección no existe o no la cubre, se define primero —es…
`FND-R19` **H** La carpeta que recibe la suite manda. Es la raíz, sin excepción. Todo lo demás —repositorios anidados, código suelto, documentos de investigación— se acomoda bajo ella. Mover la raíz para acomodar lo que ya…
`FND-R20` **H** El terreno se enumera antes de documentarlo.
`FND-R21` **H** El plan de terreno propone; no ejecuta. Se escribe en docs/implementation/LAYOUT.md y ningún archivo se mueve al generarlo. Mover código rompe importaciones, historias de git y rutas de despliegue. Un…
`FND-R22` **H** El plan de terreno pasa por G0. Cada movimiento se resuelve ACEPTADO, RECHAZADO con motivo o MODIFICADO con el destino real, y el bloque de firma lo cierra una persona. Ningún modo de ejecución lo…
`FND-R23` **H** Sin terreno resuelto no se abre trabajo nuevo.
`FND-R24` **H** La Declaración de Valor no se pide al instalar: la produce Foundation.
`FND-R25` **H** Destino canónico, por criterio y no por gusto.
`FND-R26` **H** La estrategia de historia git sale de los hechos.
`FND-R27` **H** Qué se versiona es una decisión humana. Un repositorio que no versiona ni un archivo —un .gitignore con *, por ejemplo— es tan inútil como no tenerlo: G4 no tiene qué fusionar, PHASE 10 no tiene a qué…
`FND-R28` **H** El grafo cubre el código propio y nada más.
`FND-R29` **H** Nada se publica sin revisar secretos, y la revisión bloquea.
`FND-R30` **H** Los accesos se comprueban antes de necesitarlos.

### FDGE — Desarrollo

`FDGE-R01` **H** Todo trabajo entra por un Intake. Ningún PT avanza a PHASE 2 sin changes/PT-XXX-slug/intake.md firmado. Aplica a los cinco tipos (BUG · FEATURE · REFACTOR · INVESTIGATION · CHORE) y a los tres tracks,…
`FDGE-R02` **H** El humano declara la intención; el agente la expande.
`FDGE-R03` **H** Definition of Ready (G1). Un PT pasa a READY solo si su Intake cumple la checklist de Intake-Protocol.md §DoR. Si falla, el PT permanece DRAFT y el agente reporta exactamente qué campo falta. Detenerse aquí…
`FDGE-R04` **H** Severidad y complejidad son ejes distintos.
`FDGE-R05` **H** Request Waste. Iniciar análisis, diseño o implementación sobre una solicitud sin Intake admitido está prohibido. Un request sin comportamiento esperado, sin criterios de aceptación y sin out-of-scope no es…
`FDGE-R06` **H** Discovery Before Design. La señal inicial nunca es la especificación. Se expande hasta ser un problema definido antes de diseñar nada.
`FDGE-R07` **H** Architecture Before Solution. Ninguna solución se diseña sin haber consultado 11-Conventions.md, la arquitectura y el grafo de dependencias. Modificar código sin ese paso es *Architecture Blindness*.
`FDGE-R08` **S** Fallback de grafo. Si graphify-out/ no existe o está STALE, el agente lo declara en context.md, baja su Architecture Confidence y lo registra como riesgo. No puede afirmar que consultó un grafo inexistente.…
`FDGE-R09` **H** Investigation Gate. Si la causa raíz, el impacto arquitectónico o las dependencias son desconocidas, o si cualquier confianza declarada está por debajo del 70 %, el trabajo se reclasifica a INVESTIGATION de…
`FDGE-R10` **H** Una INVESTIGATION no produce código. Cierra con hallazgos documentados y puede originar un PT nuevo de otro tipo. Por eso queda exenta de FDGE-R15 (trazabilidad AC→test) y de FDGE-R23 (manifiesto): su…
`FDGE-R11` **H** La estrategia declara: objetivo, solución propuesta, al menos una alternativa evaluada, alternativas rechazadas con su motivo, dependencias, riesgos, restricciones citando 11-Conventions.md, y criterios de…
`FDGE-R12` **H** Análisis de regresión obligatorio en PHASE 3 para STANDARD y MAJOR: qué puede romperse, workflows, servicios, APIs, flujos de UI y riesgos de integridad de datos afectados.
`FDGE-R13` **H** Proposal Gate (G2). No se crea rama, no se modifica una sola línea de código fuente y no comienza la implementación hasta que la compuerta G2 se resuelve conforme a EXECUTION-MODES.md. Antes de G2: 0 líneas…
`FDGE-R14` **H** El Proposal Package es la fuente de verdad durante toda la implementación.
`FDGE-R15` **C** Matriz de trazabilidad. traceability.md enlaza cada AC-nn con al menos un TS-nn, cada TS-nn con al menos un archivo de test, y cada AC-nn con al menos una entrada de evidencia. Un AC huérfano bloquea G3.…
`FDGE-R16` **H** Toda tarea de tasks.md tiene objetivo único, input definido, output definido y método de validación.
`FDGE-R17` **H** Tests first. Los tests derivados de test-scenarios.md existen y fallan antes de escribir la primera línea de implementación. Si no puedes escribir el test, no entendiste el requisito. En track HOTFIX, donde…
`FDGE-R18` **S** Excepción de tests para cambios sin lógica.
`FDGE-R19` **H** Commits atómicos, y una rama por tarea. Un commit = un cambio lógico. Formato obligatorio: <type>: PT-XXX <descripción específica> con type ∈ feat·fix·refactor·test·docs·chore — el vocabulario de git, y…
`FDGE-R20` **H** Scope lock. Está prohibido tocar archivos fuera de lo declarado en tasks.md, y prohibido implementar cualquier ítem de out-of-scope.md.
`FDGE-R21` **H** Alerta de desvío. Si durante la implementación el trabajo resulta más complejo de lo planificado: detención inmediata y reporte con evidencia. Un desvío dentro del scope declarado continúa con ACK. Un…
`FDGE-R22` **H** Carril HOTFIX. Solo para severity: S1. Permite recorrer PHASE 1 → 5 → 6 → 9 con G1 y G4 vivas y G2/G3 diferidas. Obliga a: rama hotfix/PT-XXX-slug, un INC-NNN abierto, y completar PHASE 2, 3, 4, 7 y 8 de…
`FDGE-R23` **C** Manifiesto de evidencia. evidence/PT-XXX/manifest.json existe y mapea cada AC-nn a al menos un artefacto de evidencia real presente en disco. Sin manifiesto válido no hay PHASE 7.
`FDGE-R24` **H** La evidencia es proporcional al tipo de cambio, no un formato fijo.
`FDGE-R25` **H** El Self-Review no es un control: es una preparación.
`FDGE-R26` **H** No Bug Auto-Close. Un ítem de tipo BUG transita a VALIDATION_PENDING y ahí se detiene. Solo un humano lo lleva a DONE, y al hacerlo registra quién y cuándo en la línea Compuertas: de HISTORY.log (G3…
`FDGE-R27` **H** Condiciones de DONE por tipo. FEATURE: todos los tests pasan, manifiesto válido y todos los AC-nn verificados con evidencia. REFACTOR: comportamiento observable preservado por tests y barra de calidad de…
`FDGE-R28` **S** Cierre asistido por QA. Si el PT se originó en un QD-nnn, la validación humana puede apoyarse en delta QA PT-XXX con resultado PASS del caso de origen. La ejecución QA es evidencia; la decisión de cerrar…
`FDGE-R29` **C** HISTORY.log recibe exactamente una entrada por PT, en el formato canónico de FDGE-Implementation.md.
`FDGE-R30` **H** HANDOFF.md se sobrescribe en modo merge: antes de escribir, se lee el existente y se preservan todas las validaciones pendientes e investigaciones activas ajenas al PT que se cierra.
`FDGE-R31` **C** El índice de origen actualiza el estado del PT al valor canónico correspondiente.
`FDGE-R32` **H** Si el PT es Estructural: sí (FDGE-R44), el agente solicita explícitamente la regeneración del grafo antes de cerrar PHASE 8, y la anota como pendiente en HANDOFF.md.
`FDGE-R33` **H** Integration Gate (G4). El merge a la línea principal es siempre una decisión humana, en todos los modos de ejecución, sin excepción (SUITE-R06a).
`FDGE-R34` **C** Precondiciones de G4, todas verificables: CI en verde · verify-fdge sin errores · entrada en HISTORY.log · manifest.json válido · self-review.md presente · traceability.md sin AC huérfanos · estado del PT…
`FDGE-R35` **H** Tras el merge: el PT pasa a INTEGRATED, la rama se borra, changes/PT-XXX-slug/ se marca CLOSED en su intake.md y el directorio se conserva (nunca se borra: es el registro de la propuesta).
`FDGE-R36` **H** Rollback. Revertir un PT integrado abre un INC-NNN en INCIDENTS.log, lleva el PT a REVERTED y añade una entrada nueva a HISTORY.log referenciando la original. La entrada original nunca se edita (SUITE-R09).
`FDGE-R37` **H** Todo INC-NNN genera, al cerrarse, un PT de tipo INVESTIGATION o BUG con la causa raíz.
`FDGE-R38` **H** Un EP-NNN agrupa PTs; no los sustituye. Cada PT del lote conserva su ciclo completo, su directorio y su entrada en HISTORY.log.
`FDGE-R39` **H** Aislamiento de estado. Todo archivo de trabajo de un PT vive bajo changes/PT-XXX-slug/ (LEX-R13). Ninguna ruta global es sobrescribible por un PT. Sin esta regla, dos PTs en vuelo se destruyen mutuamente y…
`FDGE-R40` **H** Antes de ejecutar un lote, el agente calcula el solapamiento de scope entre sus PTs a partir de tasks.md.
`FDGE-R41` **H** Un lote se detiene completo ante el primer BLOCKED o el primer fallo de compuerta no resuelto.
`FDGE-R42` **C** Criterio de cierre de una INVESTIGATION. discovery.md contiene una sección ## Conclusión con: qué se determinó, qué evidencia lo sustenta, qué quedó sin determinar, y el PT de seguimiento propuesto (o…
`FDGE-R43` **C** Frescura del grafo. El grafo es STALE si desde su generación se integró algún PT que creó, movió, renombró o eliminó archivos (REGISTRY.graph.pt_at_generation vs los PTs INTEGRATED con structural: true), o…
`FDGE-R44` **H** Marcado estructural. Todo PT declara en su entrada de HISTORY.log la línea Estructural: sí \| no. sí cuando creó, movió, renombró o eliminó archivos, o cambió un límite de módulo. Es lo que hace computable…
`FDGE-R45` **C** Higiene de la evidencia. La evidencia se guarda en el repositorio y HISTORY.log es append-only: un secreto que entra ahí no se puede retirar. Antes de escribir en evidence/PT-XXX/, el agente redacta…
`FDGE-R46` **S** Métricas del propio proceso. status FDGE reporta, calculadas desde HISTORY.log: tasa de rechazo por compuerta · proporción de PTs con delta distinto de «según plan» · nº de PTs revertidos · hotfixes y su…
`FDGE-R47` **S** Envejecimiento del trabajo parado. Un PT en DRAFT o BLOCKED durante más de 30 días se reporta en status FDGE como estancado, con su antigüedad y el motivo declarado. A los 60 días se propone explícitamente…
`FDGE-R48` **H** Una sola implementación abierta. Como mucho un EP-NNN en IN_PROGRESS a la vez. Con dos abiertas, «esto es lo mismo» deja de tener respuesta y el default de FDGE-R49 no significa nada. Cerrar una es un acto…
`FDGE-R49` **H** Mientras haya una implementación abierta, todo le pertenece.
`FDGE-R50` **H** Nueva o parte de: el criterio está escrito.
`FDGE-R51` **H** El intake pesado pertenece a la implementación, no a cada cambio dentro de ella.
`FDGE-R52` **H** El reanclaje se escribe, no se relee. Cada transición de fase deja tres líneas en la tarea —comentario del issue si hay plataforma, docs/implementation/TRANSICIONES.log si no—: qué se cierra · dónde se está…
`FDGE-R53` **H** Toda tarea declara cómo termina. Una línea, observable, en el intake: la condición que hace que la tarea esté hecha. La deriva ocurre en tareas sin forma: una tarea que declara su final lo tiene; una que…
`FDGE-R54` **H** No se empieza lo que no se puede terminar, y consta.

### INTAKE — Admisión

`INTAKE-R01` **H** El comportamiento esperado de un bug lo declara el humano.
`INTAKE-R02` **H** Los criterios de aceptación de un feature los declara el humano.
`INTAKE-R03` **H** El out-of-scope lo declara el humano. Es la única defensa contra el alcance que crece solo.
`INTAKE-R04` **H** La severidad la declara el humano (FDGE-R04).
`INTAKE-R05` **H** Un criterio de aceptación debe poder responderse con ✓/✗ observando el sistema.
`INTAKE-R06` **H** Firma. El Intake lleva un bloque ## Firma con nombre, fecha y la declaración explícita de que el contenido refleja la intención. El agente no puede escribir ese bloque.
`INTAKE-R07` **S** El agente puede y debe desafiar el Intake: señalar criterios ambiguos, contradicciones con el PRD, out-of-scope que en realidad es indispensable, o severidad que no se corresponde con el impacto descrito.
`INTAKE-R08` **H** Un EP-NNN admite firma por lote: un solo bloque de firma en changes/EP-NNN-slug/intake.md que cubre los Intakes de todos sus PTs, siempre que cada Intake individual esté completo.
`INTAKE-R09` **C** El lote tiene su propia plantilla. changes/EP-NNN-slug/intake.md se crea desde INTAKE/templates/EPIC-INTAKE.md y declara: objetivo común · PTs que lo componen · orden y su motivo · dependencias ·…

### QA — Verificación de UX

`QA-R01` **H** User-First Execution. El agente QA opera exclusivamente desde el navegador contra la URL desplegada. No lee código fuente, no inspecciona endpoints, no consulta la base de datos. Lo que no es verificable…
`QA-R02` **H** Proposal Before Execution. No se ejecuta ningún caso sin ACK humano al QA-PLAN.md, ni ningún spec sin ACK humano a los specs generados. Un caso no autorizado es un caso prohibido.
`QA-R03` **H** Evidence Is Screenshot. Todo paso relevante produce captura. Sin captura, el paso no fue ejecutado.
`QA-R04` **H** Explicit Pass/Fail. Solo PASS o FAIL. No existe «parcialmente correcto». La ambigüedad es FAIL hasta que se demuestre lo contrario.
`QA-R05` **H** Defect Isolation. QA no corrige. Documenta, crea un QD-NNN, se detiene y reporta.
`QA-R06` **H** Todo caso FAIL genera un QD-NNN. Sin QD, el fallo no existe como hallazgo e invalida el reporte.
`QA-R07` **H** Todo QD-NNN lleva captura del paso fallido.
`QA-R08` **H** Regression by Default. Los casos REG se ejecutan siempre primero. Un REG que falla es prioridad máxima con independencia de su causa.
`QA-R09` **H** Score crítico. Si cualquier caso HP resulta FAIL, la clasificación es QA-F con independencia del porcentaje global.
`QA-R10` **H** QA no arranca sin QA_BASE_URL definida y alcanzable, ni contra un entorno de producción sin aislamiento declarado.
`QA-R11` **H** El agente no cierra ni promueve un QD-NNN sin decisión humana.
`QA-R12` **H** Durante la ejecución, el agente no modifica código, no reinicia servicios y no altera el estado del sistema.
`QA-R13` **H** El número de ciclo QR-NNN se obtiene de REGISTRY.json (SUITE-R08).
`QA-R14` **S** Aislamiento de datos. Ningún caso QA depende del estado dejado por otro. Si un caso requiere un usuario preexistente, ese usuario se provisiona en el setup del caso.
`QA-R15` **S** Selectores. Preferencia estricta: data-testid → rol ARIA → label → texto visible → CSS como último recurso documentado. Nunca clases de estilo.
`QA-R16` **H** Sin esperas fijas. waitForTimeout está prohibido. Se espera una condición observable.
`QA-R17` **S** Freshness. El QA Health Score es STALE si se integraron más de 3 PTs o pasaron más de 30 días desde el último ciclo completo. Un score STALE se reporta con alerta.
`QA-R18` **S** Escalado de defectos. Un QD sin acción durante 2 ciclos completos sube un nivel de severidad; a los 3 ciclos se reporta como deuda crítica acumulada. El escalado se anota en el historial del QD y solo se…
`QA-R19` **H** Todo QA-NNN generado a partir de un PT cita el AC-nn de origen.

### PTSA — Auditoría — definidas en la especificación oficial

`PTSA-R14` **H** Evidencia sobre opinión. Una afirmación sin respaldo es un hallazgo, nunca una conclusión. Prohibidas «probablemente», «debería», «parece».
`PTSA-R15` **H** Producto sobre implementación. La unidad de auditoría es el producto entregado, no el módulo.
`PTSA-R16` **H** Trazabilidad inversa. Producto ← Transformación ← Servicio ← Regla ← Fuente de datos ← Acción de usuario.
`PTSA-R17` **H** Supremacía del dominio. Si D1 < 60, Health = min(Health, D1), declarado explícitamente.
`PTSA-R18` **H** Auditoría autónoma. Con acceso a shell, BD o logs, el auditor obtiene la evidencia él mismo.
`PTSA-R19` **H** Inmutabilidad auditable. Los hallazgos se cierran, nunca se borran; la evidencia se revisa, nunca se sobrescribe.
`PTSA-R20` **H** Certificación continua. Todo score caduca y se renueva por delta sync.
`PTSA-R21` **H** Cobertura declarada. Un score sin cobertura y frescura declaradas es nulo.
`PTSA-R39` **H** Un producto llega a CLOSED solo con evidencia post-fix observada en la fuente real.
`PTSA-R44` **H** El auditor no cierra hallazgos de tipo BUG ni DOMAIN: los lleva a VALIDATION_PENDING y se detiene (LEX-R08).
`PTSA-R45` **H** PHASE 6 — Traceability es el hito central: PHASE 7..PHASE 10 no arrancan hasta que esté COMPLETE para todos los productos.
`PTSA-R47` **H** PHASE 4 debe crear Products/P-NNN.md por producto, o no puede cerrar.
`PTSA-R62` **H** Toda conclusión se materializa en un artefacto de PTSA/ (SUITE-R04).
`PTSA-R70` **H** PHASE 7 verifica el esquema real de la BD vía shell, nunca las migraciones.
`PTSA-R73` **H** Condiciones de halt cerradas: (a) el entorno niega permisos de shell; (b) faltan credenciales irresolubles; (c) breakpoint manual explícito.
`PTSA-R76` **H** Universo auditable enumerado. El universo se construye desde fuentes mecánicas —inventory/ de Foundation, productos de PHASE 4, reglas de PHASE 0— no desde lo que el auditor encuentre. Lo que está en el…
`PTSA-R77` **H** Matriz de cobertura. Universo × dimensiones en PTSA/COVERAGE.md. Toda celda lleva PASS · FAIL · NO_APLICA · NO_EVALUADA. No existe la celda en blanco: es indistinguible de una que nadie miró.
`PTSA-R78` **H** NO_EVALUADA no es un aprobado. No penaliza Health, pero degrada Confidence: coverage = evaluadas / universo. Un Health 95 sobre el 30 % del universo se publica como 95 con coverage 0.30.
`PTSA-R79` **H** Parada por enumeración. La auditoría cierra cuando la matriz está completa, no cuando el auditor deja de encontrar hallazgos. «No encontré más» describe dónde dejó de buscar.
`PTSA-R80` **H** Verificación mecánica. tools/verify-ptsa.mjs comprueba matriz, coverage, productos sin DRAFT y hallazgos BUG/DOMAIN sin cierre humano. Un score cuya matriz no cuadra no se certifica.

### FPGE — Priorización

`FPGE-R01` **H** Priorización gobernada por evidencia. Todo candidato cita su evidencia de origen: H-NNN, QD-NNN, entrada de HISTORY.log, recomendación de HANDOFF.md o tendencia de un historial de scores. Sin evidencia no…
`FPGE-R02` **H** Reproducibilidad. Dos corridas sobre el mismo estado producen el mismo orden. La priorización es una función determinista de la evidencia.
`FPGE-R03` **H** FPGE es read-only sobre artefactos ajenos, sin excepción.
`FPGE-R04` **H** Compuerta humana. FPGE propone; el humano dispone. FPGE nunca inicia desarrollo ni convierte hallazgos en tareas por sí mismo.
`FPGE-R05` **H** Freshness gate. Si el score PTSA es STALE/UNKNOWN, FPGE lo declara en el encabezado del roadmap y recomienda delta PTSA antes de tomar decisiones irreversibles.
`FPGE-R06` **H** Supremacía del dominio heredada. Los ítems D1 superan a D2/D3/D4 en igualdad de prioridad, vía multiplicador 1.5.
`FPGE-R07` **H** Bloqueo por QA-F. Con una clasificación QA-F vigente, FPGE marca todo candidato de tipo FEATURE como BLOCKED hasta que se resuelvan los defectos críticos.
`FPGE-R08` **H** Efecto de QA-STALE. Un QA Health Score STALE aplica un factor Confidence = 0.7 a los candidatos cuya única evidencia sea QA, y lo declara en el racional del ítem. Cierra el mecanismo que v3 enunciaba sin…
`FPGE-R09` **H** El PT-NNN de una promoción se obtiene de REGISTRY.json (SUITE-R08), no contando HISTORY.log.
`FPGE-R10` **H** Una promoción entrega el ítem a FDGE PHASE 1 (Intake), no a PHASE 2.

### FIDE — Incubación

`FIDE-R01` **H** Soberanía anfitrión–huésped. FIDE opera desde el anfitrión y nunca se instala en el proyecto generado. Inyecta la suite operativa y se retira. La carpeta FIDE/ no se copia al huésped.
`FIDE-R02` **H** Idempotencia. Si el directorio ya contiene andamiaje o 00-Business-Case.md, FIDE no destruye el progreso: retoma o aborta limpiamente.
`FIDE-R03` **H** Autoridad consultiva, obediencia operativa.
`FIDE-R04` **H** Compatibilidad con Foundation. FIDE genera docs/enterprise-documentation/ con los nombres canónicos de LEX-R10 §6.1, y copia también los documentos de Foundation a docs/methodology/. La numeración propia de…
`FIDE-R05` **H** Las features que FIDE vuelca al índice ENRICHMENT.md nacen en DRAFT, nunca en READY.
`FIDE-R06` **H** El README.md del paquete generado por FIDE declara explícitamente que documenta arquitectura prevista, no observada, y que no cumple todavía FND-R01.

## Procedimiento por fase

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
     CHECKPOINT.json si existe: el estado de la TAREA en curso, mientras HANDOFF
     responde por el PROYECTO. Todos sus campos se DERIVAN y ninguno se recuerda
     —un campo que solo pueda rellenar la memoria miente con la autoridad de un
     dato estructurado— y el «sha» que declara tiene que existir     [LEX-R26]
       node tools/tracker.mjs checkpoint PT-NNN     lo escribe
     SESSION.json si existe: el estado de la SESIÓN, que NO es el de la tarea ni el
     del proyecto. «desde» es lo único capturado —una MARCA, no memoria— y el resto
     se deriva de «desde..HEAD». Sin él, lo que lleva la sesión es SIN EVALUAR: el
     día NO es la sesión                                          [LEXICON §6.5e]
       node tools/tracker.mjs sesion abrir          marca el inicio
       node tools/tracker.mjs sesion               lo derivado
     HISTORY(3 últimos) · INCIDENTS · changes/ · graphify-out/
HAZ  comprobar: CORE.md presente y sincronizado [SUITE-R15, LEX-R25] · modo declarado; sin
     él se asume SUPERVISED [EXEC-R02] · solo un humano lo cambia [EXEC-R12]
     Foundation por ARCHIVOS del núcleo [FND-R08] · antigüedad(>10 PT→BAJA)
     suite_version vs CHANGELOG [SUITE-R13] · migración pendiente [SUITE-R17]
     restricción automática de compuertas [EXEC-R14] · hotfix vencido [EXEC-R11]
     grafo: FRESH|STALE|MISSING [FDGE-R43]
SALE SESSION_LOG (append): PT último · modo · suite · PTs vivos · comprobaciones · confianza
       node tools/tracker.mjs sesion cerrar        el handoff DERIVADO, al terminar
     No sustituye a HANDOFF.md: su prosa —decisiones, «no hacer»— es lo único del
     estado que NO se puede derivar, y solo se le pone el sello
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
       CON EL COMANDO, y con sus campos: --tipo --severidad --epica [SUITE-R58]
     0 AL ESCRIBIR CODIGO O TEXTO: el escape que no existe no se rompe [SUITE-R59]
       regex LITERAL · String.fromCharCode para un salto · texto largo a un ARCHIVO,
       nunca por la linea de comandos. Y si construyes un patron desde una variable,
       usa el normalizador de patrones.mjs —comoPalabra, comoLiteral, CLASE, CAR—:
       ninguno lleva una barra invertida escrita, y lo que no se escribe no se pierde.
       escribir REGISTRY.json a mano deja la allocation sin «phase» — y sin ella
       «avanzar» no puede moverla NUNCA. Si el comando no admite lo que necesitas,
       eso es un defecto del comando: decláralo, no lo rodees en silencio.
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
     viabilidad CONSULTADA y REGISTRADA — no basta consultarla       [FDGE-R54]
       node tools/tracker.mjs viabilidad PT-XXX --registrar
       MARGINAL no prohibe: obliga a trabajo ATOMICO con checkpoint entre pasos
       UNSAFE detiene: checkpoint, handoff y parada
```

### PHASE 5 · Implementation
```
LEE  design · tasks · test-scenarios · out-of-scope · traceability · 11-Conventions · graphify-out/
HAZ  1 git checkout -b <type>/PT-XXX-slug        DESDE la rama de integracion [FDGE-R19]
       tres niveles: <type>/PT-NNN-slug efimera -> rama de integracion
       («trabajo») -> rama por defecto. El PR de la TAREA es revision y NO
       es G4; G4 es el merge del LOTE a la rama por defecto y NO se
       multiplica por tarea [EXEC-R03, FDGE-R33].
       Declarala en REGISTRY.allocations[].branch: un PT vivo en PHASE 5+
       sin rama se reporta, y en G4 bloquea. Lo ya terminado no se
       retrofecha — pedir rama a lo integrado es pedir que se invente.
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
CONTRATO  tarea e implementación → issue | work item        [SUITE-R35: es lo que la regla dice]
          compuerta G4           → pull request              [SUITE-R42]
          cierre de implementación → dispara [START QA] sobre lo entregado
          NO hay mapeo para agrupar: la implementación YA tiene su issue. Un segundo
          artefacto para el mismo hecho es la divergencia que SUITE-R35 impide.
REPARTO   la plataforma responde QUÉ ESTÁ ABIERTO; el repositorio QUÉ SE DECIDIÓ.
          El issue REFERENCIA el intake, no lo copia: dos copias divergen.
JERARQUIA una tarea con `epic` es SUB-ISSUE de su lote, no un enlace en su   [SUITE-R51]
          cuerpo: un enlace no da progreso ni cierra en cascada. Y el enlace
          del issue apunta a DONDE EL CONTENIDO ESTA — rama de trabajo si
          esta vivo, rama por defecto si ya es INTEGRATED.
          node tools/tracker.mjs abrir --aplicar   lo mantiene
LA FASE   toda allocation PT VIVA declara «phase». Falta ⇒ ERROR desde 8.0.0 [SUITE-R08]
          Un LOTE no lleva «type»: se reconoce por su identificador [LEX-R27], y
          ninguna herramienta decide nada mirando ese campo.
          EXENTOS: un EP —su ciclo no tiene fases de tarea— y lo ya terminado.
          La frontera «se exige a lo VIVO» la comparten FDGE-R52, FDGE-R19 y
          esta, desde ESTADOS_TERMINALES en patrones.mjs. DONE NO esta ahi: un
          PT en DONE espera G4 y sigue vivo.
ESPEJA    TODO lo que copie el estado, no solo la plataforma.              [SUITE-R35]
          registro ↔ YAML del intake ↔ linea de indice. Si divergen se DICE:
          aviso durante el trabajo, ERROR en G4. Manda el YAML (PT-004) y se
          declara cual se uso. Falta un lado ⇒ no se compara: un campo ausente
          no es una divergencia. Sin esto, un «phase: 1» olvidado APAGA
          FDGE-R52 —que solo corre desde phase >= 2— sin avisar.
SELLAR    cerrar una VERSION es un acto, y tiene ocho pasos.             [SUITE-R57]
          node tools/tracker.mjs sellar   los enumera y dice cuales faltan.
          1 CHANGELOG con su guia de migracion                       [SUITE-R19]
          2 version.mjs --aplicar   3 build-core   4 BATERIA COMPLETA
          5 /graphify y REGISTRY.graph al dia                        [FDGE-R32]
          6 SELLO.md: cada documento de entrada ACTUALIZADO o NO PROCEDE
            con motivo — MANUAL, CASOS-DE-USO, README, Suite-CLAUDE-Template
            y el grafo. Celda vacia NO pasa, igual que en LAYOUT.   [FND-R22]
          7 PR a la rama por defecto · HUMANO                        [EXEC-R04]
          8 git tag · HUMANO, y DESPUES del merge: un tag antes apunta a un
            arbol sin lo que la version trae, y la linea base miente.
          Mas de N integradas de lotes CERRADOS sin sellar ⇒ G2 BLOQUEADA.
          Las de un lote ABIERTO no cuentan: el lote es la unidad. [EXEC-R03]

ASIGNA    el REGISTRO, siempre. La plataforma espeja y guarda su número de issue.
          node tools/tracker.mjs espejo        comprueba las dos direcciones
          node tools/tracker.mjs abrir --aplicar   crea los issues que faltan
APLAZAR   la columna «Donde va» es VOCABULARIO CERRADO: o «—» o la cita de   [SUITE-R44]
          un identificador. Nada de prosa: no se interpreta. Y la cita es
          RECIPROCA — hermano del lote vale siempre; el propio lote solo si
          esta DONE o CLOSED; cualquier otro debe ser DEFERRED con su
          «origin» mencionando el PT. En G4 bloquea.
CIERRE    el intake del LOTE lleva «## Cierre del lote»: una fila por cosa   [SUITE-R45]
          que se resuelve al cerrarlo, con su estado en G4. Sin ella G4
          bloquea. Existe porque la misma obligacion estaba copiada en dos
          out-of-scope y ausente en tres — copiar una regla la hace diverger.
ARRANQUE  el punto de ENTRADA es el tablero, no una regla que recordar.     [SUITE-R50]
          cauce start   →  estado del tablero, y DESPUES el nucleo
          No hay forma de obtener lo segundo sin lo primero. Usa la
          definicion de SUITE-R49; no escribe la suya. No automatiza nada.
EL MANUAL instalar EMPIEZA por remitir al manual y al catalogo, no por      [SUITE-R54]
          copiar. cauce start los pone POR DELANTE del nucleo. No obliga a
          leerlo —no se puede— pero no se arranca sin que se ponga delante.
          Si no esta, se DICE: CORE.md es lo unico obligatorio.
MIGRAR    las decisiones humanas se CONDUCEN, no se enumeran.               [SUITE-R55]
          numeradas · cada una dice QUE decide y POR QUE es tuya · el
          motivo se RECONOCE y, si no, se dice (RULE-06) · el titular que
          se corta se marca · el modo restringido se explica AL ENTRAR y
          no se relaja: queda en REGISTRY.migration_pending y sale con 1.
          No decide ninguna y no puede comprobar que se tomen.
LA REGLA  todo fallo cita su regla, y la regla se CONSULTA — no se deduce.  [SUITE-R53]
          cauce regla SUITE-RNN    que exige, donde vive, quien la comprueba
          cauce regla --fallos     TODO lo que puede fallar, DERIVADO del codigo
          Una lista escrita a mano se queda corta; esta sale de los fail().
QUE ES     antes de nada: ¿PETICION o CONVERSACION? Se DECLARA en una      [SUITE-R52]
          linea y se puede corregir. Peticion = tiene condicion de terminado
          («termina cuando: …», FDGE-R53). Sin ella es conversacion, y lo que
          produce es una RESPUESTA, no una allocation. Una conversacion puede
          ACABAR en peticion; no empieza siendolo.
LO PRIMERO  del turno: consultar el tablero. CORE.md abre con ello.       [SUITE-R49]
          «Consultado» = se ejecuto `tracker siguiente` EN ESTE TURNO y su
          salida es la respuesta. Vale para UN turno; si el anterior cambio
          el registro o el tablero, caduco. Sin poder consultar: SIN EVALUAR.
          La definicion vive en SUITE-R49 y se CITA, no se copia.
SIGUIENTE antes de avanzar de fase, PREGUNTA al tablero. No de memoria.     [SUITE-R48]
          node tools/tracker.mjs siguiente PT-NNN
          Deriva que produce la fase, que la cierra, que compuerta toca y
          que la bloquea. Un comentario humano sin responder BLOQUEA la
          respuesta. Sin «phase» declarada: SIN EVALUAR, no se adivina.
ESPEJO    bloquea en la rama de TRABAJO y en los PR; en la rama por defecto  [SUITE-R47]
          solo INFORMA: alli el registro es la foto del ultimo merge y el
          tablero sigue vivo, asi que divergen por construccion. Donde decide
          es G4, sobre la rama de trabajo.
CERRAR    el issue se cierra DESPUES de que el estado terminal este en la    [SUITE-R46]
          rama por defecto. Orden: apuntar INTEGRATED aqui, mergear, cerrar.
          Al reves, la principal declara «vivo» con el issue cerrado y su
          compuerta falla — tras CADA merge, no solo tras uno.
          node tools/tracker.mjs cerrar --aplicar   se niega si va adelantado
LEE       lo que el humano escriba en el issue ANTES de cerrar fase.          [SUITE-R43]
          node tools/tracker.mjs pendiente PT-NNN   → 1 si queda sin responder
          Se distingue por MARCA de procedencia, no por autor: el agente comenta
          con la credencial de la persona. Falsificable, y declarado.
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
          issue si hay plataforma · docs/implementation/TRANSICIONES.log si no [INC-008].
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
CORREGIR una entrada YA ESCRITA que salio mal: NO se edita.            [FDGE-R29]
       ## PT-NNN — CORRIGE: <que se corrige>
       Corrige: la entrada de AAAA-MM-DD  /  Motivo: <por que>  /  <campos rehechos>
       G4 lee la ULTIMA correccion para cada campo que declare, y la original para
       los que no. La original NO se toca: es lo que se audita. Sin entrada
       original, la CORRIGE falla — seria declarar trabajo sin registro.
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
     tras el merge: PUBLICAR LA PROYECCION — el rastro sobrevive a la rama  [SUITE-R56]
       node tools/tracker.mjs proyectar --publicar
       la rama efimera se borra (FDGE-R19); el enlace del issue apunta a un ref
       DURABLE y la proyeccion guarda el SHA de cada tarea
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
PHASE 2 Test Plan       QA-PLAN.md: por caso tipo(HP|EC|EF|REG) [LEX-R28] · eje · fuente · precondiciones
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

## Verificación

```
node docs/methodology/tools/verify-fdge.mjs PT-XXX | --all | --gate G4 PT-XXX
node docs/methodology/tools/verify-suite.mjs docs/methodology
node docs/methodology/tools/build-core.mjs --check
```
