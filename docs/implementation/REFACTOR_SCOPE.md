# REFACTOR_SCOPE — índice de refactors y chores

Índice, no contenido (`LEX-R12`). Una línea por PT; el alcance vive en
`changes/PT-XXX-slug/`.

Los identificadores los asigna `REGISTRY.json` (`SUITE-R08`). Este archivo no asigna nada:
cada fila **espeja** la del registro (`SUITE-R35`).

| PT | Tipo | Sev | Estado | Implementación | Título |
|:---|:---|:---|:---|:---|:---|
| PT-006 | CHORE | S3 | INTEGRATED | EP-002 | PHASES declara dos mapeos que su regla no contiene; el del PR sube a RULES con su comprobación |
| PT-014 | BUG | S3 | INTEGRATED | EP-004 | El cuerpo de un lote se escribe antes de que sus tareas tengan issue y necesita una segunda pasada |
| PT-015 | CHORE | S4 | INTEGRATED | EP-013 | Escribir verificador para las reglas HARD que hoy no tienen ninguno |
| PT-016 | CHORE | S4 | INTEGRATED | EP-013 | Decidir si `phase` pasa a ser obligatoria, y añadirla a la plantilla TAREA.md |
| PT-017 | CHORE | S4 | INTEGRATED | EP-013 | migrate: derivar la lista de «qué llega nuevo» comparando paquete y destino |
| PT-018 | BUG | S2 | INTEGRATED | EP-004 | SUITE-R44 adivina sobre prosa libre: el destino de un out-of-scope debe ser vocabulario cerrado y recíproco |
| PT-020 | CHORE | S3 | INTEGRATED | EP-013 | Ampliar el alcance del grafo a docs/methodology/tools/ (TD-01) |
| PT-021 | BUG | S1 | INTEGRATED | EP-005 | Citar el propio lote no puede pasar G4 nunca: CLOSED ocurre despues del merge |
| PT-022 | BUG | S1 | INTEGRATED | EP-005 | SUITE-R44 solo mira las filas que existen: omitirla es invisible y declararla bloquea |
| PT-023 | CHORE | S2 | INTEGRATED | EP-013 | Auditar si PT-018 declaro mas cambios de especificacion que no hizo |
| PT-024 | BUG | S1 | INTEGRATED | EP-006 | tracker cerrar cierra issues cuyo estado terminal aun no esta en la rama por defecto |
| PT-026 | BUG | S1 | INTEGRATED | EP-006 | El espejo compara en main una foto del registro contra un tablero vivo: diverge siempre |
| PT-028 | BUG | S1 | INTEGRATED | EP-006 | SUITE-R35 denunciaba como huerfano el estado que SUITE-R46 obliga a atravesar |
| PT-029 | CHORE | S2 | INTEGRATED | EP-013 | Buscar mas choques entre reglas: una comprobacion que hace imposible el estado que otra obliga a atravesar |
| PT-030 | FEATURE | S1 | INTEGRATED | EP-007 | tracker siguiente: que toca y como se cierra, derivado del tablero y no del criterio del agente |
| PT-031 | BUG | S1 | INTEGRATED | EP-007 | MANUAL, SUPERVISED y AUTONOMOUS deben declarar las mismas obligaciones: solo cambia quien resuelve las compuertas |
| PT-032 | FEATURE | S1 | CLOSED | EP-008 | Convencion o agente propio de cauce que ate al agente al tablero sin que haya que recordarselo |
| PT-033 | FEATURE | S1 | INTEGRATED | EP-008 | La convencion: CORE.md abre con el estado del tablero y ninguna fase avanza sin haberlo consultado |
| PT-034 | FEATURE | S1 | INTEGRATED | EP-008 | Un agente propio de cauce cuyo punto de entrada es el tablero: no una regla que se pueda saltar |
| PT-035 | BUG | S2 | INTEGRATED | EP-009 | tracker enlaza las tareas en el cuerpo del lote en vez de declararlas sub-issues |
| PT-036 | BUG | S2 | INTEGRATED | EP-009 | El cuerpo del issue apunta a la rama por defecto, donde el contenido aun no esta: 404 en el momento en que mas se lee |
| PT-037 | FEATURE | S1 | INTEGRATED | EP-010 | Enumerar todos los casos de uso y, por cada uno, su ruta exacta hasta el final |
| PT-038 | FEATURE | S1 | INTEGRATED | EP-010 | Escribir el manual: de cero al primer PT cerrado siguiendo un solo documento |
| PT-039 | FEATURE | S1 | INTEGRATED | EP-011 | Distinguir una peticion de una conversacion: la regla primero, y despues el arranque |
| PT-040 | FEATURE | S1 | INTEGRATED | EP-011 | Que puede fallar, DERIVADO de los fail() reales y no escrito de memoria |
| PT-041 | FEATURE | S1 | INTEGRATED | EP-011 | cauce regla SUITE-RNN, y que el mensaje del fallo lleve a ella |
| PT-042 | FEATURE | S1 | INTEGRATED | EP-011 | El agente lee su manual al instalar y al arrancar, y sabe autorreferenciarse |
| PT-043 | FEATURE | S1 | INTEGRATED | EP-011 | Las siete decisiones de migrar un legado se CONDUCEN, no se enumeran |
| PT-044 | BUG | S2 | INTEGRATED | EP-012 | El YAML del intake declara una fase y un estado que el registro contradice |
| PT-045 | BUG | S2 | INTEGRATED | EP-012 | npx @a81biz/cauce start no arranca: el punto de entrada documentado falla |
| PT-046 | BUG | S2 | INTEGRATED | EP-012 | Una entrada de HISTORY.log mal formada bloquea G4 y ninguna regla permite corregirla |
| PT-047 | BUG | S3 | INTEGRATED | EP-013 | PHASE 5 manda crear rama por PT y los 43 PT de este repositorio se implementaron sobre trabajo |
| PT-048 | BUG | S3 | INTEGRATED | EP-013 | El cuerpo del issue de una allocation DEFERRED enlaza a un directorio que no existe |
| PT-049 | CHORE | S3 | DONE | EP-014 | selftest y verify-fdge en modo silencioso: solo los fallos, con el recuento intacto |
| PT-050 | CHORE | S3 | DONE | EP-014 | selftest --solo <patron>: iterar un caso nuevo sin pagar la bateria entera |
| PT-051 | CHORE | S4 | READY | EP-014 | regla <ID> --donde: archivo y linea del fail() que la ejecuta |
| PT-052 | CHORE | S2 | READY | EP-014 | CHECKPOINT.json: el estado de la tarea en curso, estructurado y con el SHA del codigo |
| PT-053 | CHORE | S1 | READY | EP-014 | tracker avanzar PT-NNN --a N --nota: los cinco actos de una transicion, atomicos y con la nota obligatoria |
| PT-054 | CHORE | S2 | READY | EP-014 | cauce/<usuario>: proyeccion DERIVADA del estado de gobernanza, escrita solo por la herramienta |
| PT-055 | BUG | S2 | DEFERRED | — | --gate G4 exige las filas de cierre de TODOS los lotes abiertos, no del que la compuerta evalua |
