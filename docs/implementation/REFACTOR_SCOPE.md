# REFACTOR_SCOPE — índice de refactors y chores

Índice, no contenido (`LEX-R12`). Una línea por PT; el alcance vive en
`changes/PT-XXX-slug/`.

> **DERIVADO del registro.** No se edita a mano: `tracker indices --aplicar`
> lo regenera. Editarlo aquí se pierde en la siguiente regeneración, y editarlo a mano es
> lo que dejó catorce filas pegadas en una línea en el índice de refactors.

| Id | Tipo | Sev | Estado | Lote | Título |
|:---|:---|:---|:---|:---|:---|
| PT-006 | CHORE | S3 | INTEGRATED | EP-002 | PHASES declara dos mapeos que su regla no contiene; el del PR sube a RULES con su comprobación |
| PT-015 | CHORE | S4 | INTEGRATED | EP-013 | Escribir verificador para las reglas HARD que hoy no tienen ninguno |
| PT-016 | CHORE | S4 | INTEGRATED | EP-013 | Decidir si `phase` pasa a ser obligatoria, y añadirla a la plantilla TAREA.md |
| PT-017 | CHORE | S4 | INTEGRATED | EP-013 | migrate: derivar la lista de «qué llega nuevo» comparando paquete y destino |
| PT-019 | CHORE | S2 | INTEGRATED | EP-017 | Comprobar que CUALQUIER proyecto legado se puede migrar, y ejecutar la migracion de referencia |
| PT-020 | CHORE | S3 | INTEGRATED | EP-013 | Ampliar el alcance del grafo a docs/methodology/tools/ (TD-01) |
| PT-023 | CHORE | S2 | INTEGRATED | EP-013 | Auditar si PT-018 declaro mas cambios de especificacion que no hizo |
| PT-025 | CHORE | S3 | DEFERRED | — | Comprobar el orden de cierre tambien en el adaptador de Azure |
| PT-027 | CHORE | S1 | CLOSED | — | Confirmar que la CI de main queda verde tras el merge de EP-006 |
| PT-029 | CHORE | S2 | INTEGRATED | EP-013 | Buscar mas choques entre reglas: una comprobacion que hace imposible el estado que otra obliga a atravesar |
| PT-049 | CHORE | S3 | INTEGRATED | EP-014 | selftest y verify-fdge en modo silencioso: solo los fallos, con el recuento intacto |
| PT-050 | CHORE | S3 | INTEGRATED | EP-014 | selftest --solo <patron>: iterar un caso nuevo sin pagar la bateria entera |
| PT-051 | CHORE | S4 | INTEGRATED | EP-014 | regla <ID> --donde: archivo y linea del fail() que la ejecuta |
| PT-052 | CHORE | S2 | INTEGRATED | EP-014 | CHECKPOINT.json: el estado de la tarea en curso, estructurado y con el SHA del codigo |
| PT-053 | CHORE | S1 | INTEGRATED | EP-014 | tracker avanzar PT-NNN --a N --nota: los cinco actos de una transicion, atomicos y con la nota obligatoria |
| PT-054 | CHORE | S2 | INTEGRATED | EP-014 | cauce/<usuario>: proyeccion DERIVADA del estado de gobernanza, escrita solo por la herramienta |
| PT-056 | CHORE | S1 | INTEGRATED | EP-015 | STATE_MISMATCH: al retomar, comprobar que el arbol CORRESPONDA al sha declarado, no solo que exista |
| PT-057 | CHORE | S2 | INTEGRATED | EP-015 | El coste de una tarea, DERIVADO del historial del repositorio y nunca de una cifra de tokens |
| PT-058 | CHORE | S1 | INTEGRATED | EP-015 | MEDIDO / ESTIMADO / SIN EVALUAR: el presupuesto declara la naturaleza de cada dato, no solo su valor |
| PT-059 | CHORE | S1 | INTEGRATED | EP-015 | La compuerta de presupuesto: SAFE, MARGINAL, UNSAFE, y el estado BLOCKED_BY_CONTEXT |
| PT-060 | CHORE | S2 | INTEGRATED | EP-015 | SESSION.json y el handoff derivado: la sesion como recurso efimero, con su propia maquina de estados |
| PT-061 | CHORE | S1 | INTEGRATED | EP-016 | Quien es quien: la identidad de una persona se DECLARA en el registro y se reconcilia con git |
| PT-062 | CHORE | S1 | INTEGRATED | EP-016 | Rangos de ID reservados por persona: el registro sigue asignando, sin namespacear el identificador |
| PT-063 | CHORE | S1 | INTEGRATED | EP-016 | El usuario vive en la rama de tarea: <type>/<usuario>/PT-NNN-slug |
| PT-064 | CHORE | S2 | INTEGRATED | EP-016 | De quien es cada commit: el coste, el precedente y el techo dejan de mezclar personas |
| PT-065 | CHORE | S2 | INTEGRATED | EP-016 | La sesion es de alguien: SESSION.json deja de ser uno para todos |
| PT-073 | CHORE | S2 | INTEGRATED | EP-017 | Los tres documentos que lee quien llega |
| PT-086 | CHORE | S2 | INTEGRATED | EP-017 | La bateria corre lo afectado por tarea y completa solo al sellar |
| PT-092 | CHORE | S2 | INTEGRATED | EP-018 | Ejecutar QA y FPGE, los dos componentes que nunca han corrido |
| PT-093 | CHORE | S2 | INTEGRATED | EP-018 | El limite de las compuertas se declara como ya se declara el de las firmas |
| PT-126 | CHORE | S2 | DRAFT | EP-020 | sellar mide la matriz y FPGE la lee |
