# DISCOVERY — índice de bugs e investigaciones

Índice, no contenido (`LEX-R12`). Una línea por PT; el análisis vive en
`changes/PT-XXX-slug/`.

> **DERIVADO del registro.** No se edita a mano: `tracker indices --aplicar`
> lo regenera. Editarlo aquí se pierde en la siguiente regeneración, y editarlo a mano es
> lo que dejó catorce filas pegadas en una línea en el índice de refactors.

| Id | Tipo | Sev | Estado | Lote | Título |
|:---|:---|:---|:---|:---|:---|
| PT-001 | BUG | S2 | INTEGRATED | EP-001 | SUITE-R35 tiene verificador y ninguna compuerta lo ejecuta |
| PT-002 | BUG | S3 | INTEGRATED | EP-001 | audit.mjs declara «sin huecos» midiendo por componente, no por regla |
| PT-003 | INVESTIGATION | S3 | CLOSED | EP-001 | SUITE-R35 declara milestone, issue y PR; el adaptador solo implementa issue |
| PT-004 | BUG | S2 | INTEGRATED | EP-001 | verify-fdge exige artefactos de PHASE 4 a un PT en PHASE 1 |
| PT-005 | BUG | S2 | INTEGRATED | EP-001 | La excepción de secretos no sobrevive a un clon superficial, y la historia se da por revisada sin revisarla |
| PT-009 | BUG | S2 | INTEGRATED | EP-003 | tracker cerrar comenta sin marca y SUITE-R43 toma su propio mensaje por humano |
| PT-010 | BUG | S2 | INTEGRATED | EP-003 | El cuerpo de un issue de EP dice «sin implementación» y su enlace al intake es un 404 |
| PT-011 | BUG | S2 | INTEGRATED | EP-004 | INTAKE-R08 lee los miembros de todo el texto: citar un PT en prosa lo convierte en miembro |
| PT-012 | BUG | S2 | INTEGRATED | EP-004 | migrate.mjs no tiene tramo 4.12 → 6.x: sella la versión y no dice nada más |
| PT-013 | BUG | S2 | INTEGRATED | EP-004 | Lo que un lote aplaza queda en prosa y nada obliga a que vuelva |
| PT-014 | BUG | S3 | INTEGRATED | EP-004 | El cuerpo de un lote se escribe antes de que sus tareas tengan issue y necesita una segunda pasada |
| PT-018 | BUG | S2 | INTEGRATED | EP-004 | SUITE-R44 adivina sobre prosa libre: el destino de un out-of-scope debe ser vocabulario cerrado y recíproco |
| PT-021 | BUG | S1 | INTEGRATED | EP-005 | Citar el propio lote no puede pasar G4 nunca: CLOSED ocurre despues del merge |
| PT-022 | BUG | S1 | INTEGRATED | EP-005 | SUITE-R44 solo mira las filas que existen: omitirla es invisible y declararla bloquea |
| PT-024 | BUG | S1 | INTEGRATED | EP-006 | tracker cerrar cierra issues cuyo estado terminal aun no esta en la rama por defecto |
| PT-026 | BUG | S1 | INTEGRATED | EP-006 | El espejo compara en main una foto del registro contra un tablero vivo: diverge siempre |
| PT-028 | BUG | S1 | INTEGRATED | EP-006 | SUITE-R35 denunciaba como huerfano el estado que SUITE-R46 obliga a atravesar |
| PT-031 | BUG | S1 | INTEGRATED | EP-007 | MANUAL, SUPERVISED y AUTONOMOUS deben declarar las mismas obligaciones: solo cambia quien resuelve las compuertas |
| PT-035 | BUG | S2 | INTEGRATED | EP-009 | tracker enlaza las tareas en el cuerpo del lote en vez de declararlas sub-issues |
| PT-036 | BUG | S2 | INTEGRATED | EP-009 | El cuerpo del issue apunta a la rama por defecto, donde el contenido aun no esta: 404 en el momento en que mas se lee |
| PT-044 | BUG | S2 | INTEGRATED | EP-012 | El YAML del intake declara una fase y un estado que el registro contradice |
| PT-045 | BUG | S2 | INTEGRATED | EP-012 | npx @a81biz/cauce start no arranca: el punto de entrada documentado falla |
| PT-046 | BUG | S2 | INTEGRATED | EP-012 | Una entrada de HISTORY.log mal formada bloquea G4 y ninguna regla permite corregirla |
| PT-047 | BUG | S3 | INTEGRATED | EP-013 | PHASE 5 manda crear rama por PT y los 43 PT de este repositorio se implementaron sobre trabajo |
| PT-048 | BUG | S3 | INTEGRATED | EP-013 | El cuerpo del issue de una allocation DEFERRED enlaza a un directorio que no existe |
| PT-055 | BUG | S2 | INTEGRATED | EP-017 | --gate G4 exige las filas de cierre de TODOS los lotes abiertos, no del que la compuerta evalua |
| PT-066 | BUG | S2 | INTEGRATED | EP-017 | La regla que se consulta es la que se define |
| PT-067 | BUG | S2 | INTEGRATED | EP-017 | El denominador de la cobertura esta incompleto |
| PT-068 | BUG | S1 | INTEGRATED | EP-017 | La marca de sesion es de quien la abre |
| PT-070 | BUG | S2 | INTEGRATED | EP-017 | El alcance del grafo lo calcula la herramienta |
| PT-071 | BUG | S2 | INTEGRATED | EP-017 | Publicar comprueba lo mismo que verificar |
| PT-072 | INVESTIGATION | S1 | INTEGRATED | EP-017 | Un proyecto nuevo de verdad |
| PT-074 | BUG | S2 | INTEGRATED | EP-017 | La compuerta de viabilidad necesita una fase que la abra |
| PT-075 | BUG | S1 | INTEGRATED | EP-017 | Una regla sin verificador no ocurre: subir la exigencia donde el agente puede saltarsela en silencio |
| PT-076 | BUG | S1 | INTEGRATED | EP-017 | El arnes no escribe en el repositorio real: selftest pisa la marca de sesion y apila en el ledger |
| PT-077 | BUG | S2 | INTEGRATED | EP-017 | La transicion mira lo que la consulta bloquea: avanzar ignora el STATE_MISMATCH |
| PT-079 | BUG | S1 | INTEGRATED | EP-017 | Lo que se aprende se hace mecanico: la trazabilidad sobrevive a la rama y las guardas dejan de depender de la memoria |
| PT-080 | BUG | S2 | INTEGRATED | EP-017 | Una regla no se define dos veces |
| PT-081 | BUG | S1 | INTEGRATED | EP-017 | Una regla nueva no rige hacia atras, y la version lo dice |
| PT-082 | BUG | S1 | INTEGRATED | EP-017 | Un caso no depende de quien lo ejecuta, y la rama de integracion no acepta rojo |
| PT-083 | BUG | S1 | INTEGRATED | EP-017 | La plantilla que distribuye el paquete pasa su propio verificador |
| PT-084 | BUG | S1 | INTEGRATED | EP-017 | La plataforma es opcional o no lo es |
| PT-085 | BUG | S1 | INTEGRATED | EP-017 | El sello de version: el estado retomable dice la verdad y lo integrado no se acumula |
| PT-087 | BUG | S1 | INTEGRATED | EP-018 | La comprobacion declara que hecho establece |
| PT-088 | BUG | S1 | INTEGRATED | EP-018 | Las reglas que sostienen el dominio se verifican o se declaran |
| PT-089 | BUG | S2 | INTEGRATED | EP-018 | La divergencia entre el registro y el YAML deja de apagar comprobaciones |
| PT-090 | BUG | S2 | INTEGRATED | EP-018 | La frescura del grafo es comprobable en cualquier clon |
| PT-091 | BUG | S3 | INTEGRATED | EP-018 | Las cifras del inventario se derivan, no se transcriben |
| PT-094 | BUG | S1 | INTEGRATED | — | El checkpoint de una tarea cerrada bloquea main |
| PT-095 | BUG | S1 | INTEGRATED | — | Una regla nueva no juzga lo escrito antes de que existiera |
| PT-096 | BUG | S1 | INTEGRATED | EP-019 | Un enlace que falta no es un enlace roto |
| PT-097 | BUG | S1 | INTEGRATED | EP-019 | Los umbrales de la certificacion: la letra se deriva o no se emite |
| PT-098 | BUG | S1 | INTEGRATED | EP-019 | El estado terminal se deriva del arbol, no se escribe al avanzar |
| PT-099 | BUG | S1 | INTEGRATED | EP-019 | La transicion de un BUG la aplica el comando, no la memoria |
| PT-100 | BUG | S1 | INTEGRATED | EP-019 | Un hecho, un nombre: las grafias que deciden si una verificacion corre |
| PT-101 | BUG | S2 | INTEGRATED | EP-019 | El escapado que no existe no se rompe: normalizar en vez de advertir |
| PT-102 | BUG | S1 | INTEGRATED | EP-019 | La version es un contenido, no un numero: version.mjs dice «todo declara 11.0.0» y hay tres muertas |
| PT-103 | BUG | S1 | INTEGRATED | EP-019 | El registro solo lo escribe el comando, y nada lo comprueba |
| PT-105 | BUG | S1 | INTEGRATED | EP-019 | El estado que una compuerta exige lo escribe un comando, o la compuerta es incumplible |
| PT-106 | BUG | S1 | INTEGRATED | EP-019 | Las que empezaron a juzgar despues: RIGE_DESDE se deriva del arbol, no del CHANGELOG |
| PT-107 | BUG | S0 | INTEGRATED | EP-019 | El registro no se reescribe entero: dos comandos a la vez pierden una allocation en silencio |
| PT-108 | BUG | S2 | INTEGRATED | EP-019 | La version del REGISTRO tambien es un contenido: version.mjs no mira REGISTRY.json |
| PT-109 | BUG | S2 | INTEGRATED | EP-019 | Una compuerta no es una revision sorpresa, y una mencion no es una declaracion |
| PT-110 | BUG | S2 | INTEGRATED | EP-019 | Sellar mide lo que exige: el inventario no estaba en la lista |
| PT-111 | BUG | S2 | INTEGRATED | EP-019 | El espejo compara lo que se lee: un titulo divergente no lo ve nadie |
| PT-112 | BUG | S1 | INTEGRATED | EP-019 | «--forzar» no es una compuerta: sobrescribe el marco sin dejar constancia |
| PT-113 | BUG | S2 | INTEGRATED | EP-020 | La 12.0.1: la guia de migracion que se publico incompleta |
| PT-114 | BUG | S1 | INTEGRATED | EP-020 | El cuerpo del issue no se republica cuando aparece la ref durable |
| PT-120 | BUG | S1 | INTEGRATED | EP-020 | publicar.yml no ejecuta sellar, y verify-fdge corre sin GH_TOKEN |
| PT-121 | BUG | S1 | INTEGRATED | EP-020 | El viaje de vuelta tras el merge no lo cubre ninguna fase |
| PT-122 | BUG | S2 | INTEGRATED | EP-020 | El cierre de un lote pasa por el comando, no por la mano |
| PT-123 | BUG | S1 | INTEGRATED | EP-020 | BACKLOG.md dice que se deriva del registro y nada lo deriva |
| PT-124 | BUG | S1 | INTEGRATED | EP-020 | tracker asignar rechaza tres de los cinco tipos que LEXICON declara |
| PT-125 | INVESTIGATION | S1 | INTEGRATED | EP-020 | Clasificar las 131 entradas cerradas en EVENTOS.jsonl |
| PT-127 | BUG | S1 | INTEGRATED | EP-020 | Nada detecta el trabajo sin allocation: solo lo corta una persona |
| PT-129 | BUG | S2 | INTEGRATED | EP-020 | FDGE-R19 enumera tres niveles, el arbol tiene cuatro tipos, y nada compara las ramas reales |
| PT-130 | BUG | S2 | INTEGRATED | EP-020 | Una comprobacion cuyo alcance es todo el texto acusa a quien describe el hecho |
| PT-131 | BUG | S1 | INTEGRATED | EP-020 | SUITE-R57 cuenta el estado declarado en el tag, no el trabajo que el tag contiene |
| PT-132 | BUG | S1 | INTEGRATED | EP-020 | abrir crea el issue ANTES de guardar el registro, y una interrupcion duplica |
| PT-133 | BUG | S2 | INTEGRATED | EP-020 | parada exige plataforma para escribir en TRANSICIONES.log |
| PT-135 | BUG | S2 | INTEGRATED | EP-020 | El lint de helpers solo mira los usados como comando de un caso: los de montaje se usan antes de definirse y nadie lo ve |
| PT-136 | BUG | S2 | INTEGRATED | EP-020 | Cerrar un BUG y cerrar un lote no tenian comando: la unica via era escribir el registro a mano |
| PT-137 | BUG | S1 | INTEGRATED | EP-021 | DEFERRED no tiene transicion de vuelta: ningun comando lo saca y todo comando de estado exige un intake que un aplazado no tiene |
| PT-138 | BUG | S2 | INTEGRATED | EP-021 | SUITE-R44 pone el aplazado en el tablero y no exige condicion de reentrada, fecha de revision ni dueno |
| PT-139 | BUG | S2 | INTEGRATED | EP-021 | Nada mide la edad de un aplazado: uno de ayer y uno de hace meses son indistinguibles en el tablero |
| PT-140 | BUG | S2 | INTEGRATED | EP-021 | tracker proyectar arranca un linaje nuevo en silencio si falta refs/heads de la rama de proyeccion |
| PT-141 | BUG | S2 | INTEGRATED | EP-021 | El catch de SUITE-R56 referencia una variable inexistente: el comando revienta, tapa el fallo real y deja efecto a medias |
| PT-142 | BUG | S3 | INTEGRATED | EP-021 | Nada compara el nombre de una rama con lo que ramaDeTarea deriva: type y slug inventados pasan la topologia |
| PT-143 | BUG | S3 | INTEGRATED | EP-021 | asignar toma el primer argumento en mayusculas como prefijo, asi que --tipo BUG crea BUG-001 |
| PT-150 | BUG | S2 | INTEGRATED | EP-022 | SEVERIDADES vive en tracker.mjs y contradice a LEXICON en los dos extremos |
| PT-151 | BUG | S2 | DONE | EP-024 | npm run verify no es lo que corre CI, y el CLAUDE.md dice que si |
| PT-152 | BUG | S2 | DONE | EP-024 | CORE.md publica ocho triggers y LEXICON declara trece |
| PT-153 | BUG | S3 | DONE | EP-024 | La rama de un lote no tiene forma derivable, y se inventa |
| PT-154 | INVESTIGATION | S3 | DONE | EP-024 | El espejo es global y el registro es por rama |
| PT-157 | BUG | S3 | DONE | EP-024 | contradiceElRegistro no reconoce el nombre canonico del estado |
| PT-158 | BUG | S3 | DONE | EP-024 | FIDE no tiene archivo de prompts, y LEX-R15 dice que todo componente tiene uno |
| PT-159 | BUG | S2 | DONE | EP-024 | Una parada que declara un hallazgo no esta obligada a abrir trabajo ni a decir cuando se revisa |
| PT-160 | BUG | S3 | DONE | EP-024 | Nada comprueba que los AC de traceability.md sean los del intake |
| PT-162 | BUG | S3 | DONE | EP-024 | Una tarea DRAFT no puede cambiar de lote ni rechazarse por comando |
| PT-163 | BUG | S2 | DONE | EP-024 | SUITE-R14 no caza un ID definido dos veces dentro del mismo documento |
| PT-165 | BUG | S2 | DONE | EP-024 | El mapa de fases de CORE lo escribe build-core a mano, y contradecia FPGE-R04 |
| PT-167 | BUG | S2 | DONE | EP-024 | Un caso que afirma cobertura buscando la linea del hueco solo pasa mientras hay defecto |
| PT-168 | BUG | S1 | DONE | EP-024 | audit da por cubierta la fase de un componente si el NUMERO aparece en cualquier sitio del documento |
| PT-170 | BUG | S2 | DONE | EP-024 | EXEC-R04 no reconoce una constancia real porque su encabezado usa otra palabra |
| PT-171 | BUG | S3 | DEFERRED | EP-024 | Con las secciones acotadas, algunas ordenes de primer nivel escriben a stderr sobre el esqueleto |
| PT-177 | BUG | S3 | DEFERRED | EP-024 | Una nota de reanclaje perdida deja una cuenta que ningun comando puede reparar |
| PT-178 | BUG | S2 | DONE | EP-024 | avanzar deja salir de PHASE 1 sin que exista el Intake |
| PT-179 | BUG | — | DRAFT | EP-026 | verify-fdge avisa por evidencia que falta estando la tarea pasada de PHASE 6 |
| PT-180 | BUG | — | DRAFT | EP-026 | El slug del registro y el de la carpeta divergen, y cada herramienta usa uno |
| PT-181 | BUG | — | DRAFT | EP-026 | La expectativa de un caso se compara como regex y no hay forma de decir literal |
| PT-182 | BUG | — | DRAFT | EP-026 | El mapa fase-artefacto esta escrito a mano en dos herramientas y nadie consume el del cursor |
| PT-183 | BUG | S1 | VALIDATION_PENDING | EP-024 | Una bandera desconocida se ignora en silencio, y nueve PT quedaron sin lote |
