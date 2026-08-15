| PT-046 | BUG | S2 | INTEGRATED || PT-045 | BUG | S2 | INTEGRATED || PT-044 | BUG | S2 | INTEGRATED |# REFACTOR_SCOPE — índice de refactors y chores

Índice, no contenido (`LEX-R12`). Una línea por PT; el alcance vive en
`changes/PT-XXX-slug/`.

Los identificadores los asigna `REGISTRY.json` (`SUITE-R08`). Este archivo no asigna nada.

| PT | Tipo | Sev | Estado | Implementación | Título |
|:---|:---|:---|:---|:---|:---|
| PT-006 | CHORE | S3 | INTEGRATED | EP-002 | PHASES declara dos mapeos que su regla no contiene; el del PR sube a RULES |
| PT-018 | BUG | S2 | INTEGRATED | EP-004 | El destino de un out-of-scope es vocabulario cerrado, no prosa |
| PT-014 | BUG | S3 | INTEGRATED | EP-004 | El cuerpo del lote se compone antes de que sus tareas tengan numero |
| PT-021 | BUG | S1 | INTEGRATED | EP-005 | Citar el propio lote no podia pasar G4 nunca: CLOSED ocurre despues del merge |
| PT-022 | BUG | S1 | INTEGRATED | EP-005 | SUITE-R44 solo mira las filas que existen: omitirla es invisible |
| PT-024 | BUG | S1 | INTEGRATED | EP-006 | El tablero se adelantaba a la rama por defecto y rompia la CI de main en cada merge |
| PT-026 | BUG | S1 | INTEGRATED | EP-006 | El espejo comparaba en main una foto contra un tablero vivo |
| PT-028 | BUG | S1 | INTEGRATED | EP-006 | Un cierre pendiente no es un huerfano: SUITE-R35 y SUITE-R46 chocaban |
| PT-030 | FEATURE | S1 | INTEGRATED | EP-007 | tracker siguiente: que toca y como se cierra, derivado del tablero |
| PT-031 | BUG | S1 | INTEGRATED | EP-007 | MANUAL, SUPERVISED y AUTONOMOUS deben declarar las mismas obligaciones |
| PT-032 | FEATURE | S1 | CLOSED | EP-008 | Convencion o agente propio que ate al agente al tablero |
| PT-033 | FEATURE | S1 | INTEGRATED | EP-008 | CORE.md abre con el tablero y «consultado» queda definido |
| PT-034 | FEATURE | S1 | INTEGRATED | EP-008 | cauce start: el punto de entrada ES el tablero |
| PT-035 | BUG | S2 | INTEGRATED | EP-009 | tracker enlazaba las tareas en prosa en vez de declararlas sub-issues |
| PT-036 | BUG | S2 | INTEGRATED | EP-009 | El enlace del issue apuntaba a la rama por defecto: 404 al abrirlo |
| PT-037 | FEATURE | S1 | INTEGRATED | EP-010 | El catalogo: 28 casos en seis familias, con sus huecos declarados |
| PT-038 | FEATURE | S1 | INTEGRATED | EP-010 | El manual: de cero al primer trabajo cerrado |
| PT-039 | FEATURE | S1 | INTEGRATED | EP-011 | Peticion o conversacion: se declara, no se decide en silencio |
| PT-040 | FEATURE | S1 | INTEGRATED | EP-011 | Que puede fallar, derivado de los fail() reales |
| PT-041 | FEATURE | S1 | INTEGRATED | EP-011 | La regla en el mensaje que la incumple |
| PT-042 | FEATURE | S1 | INTEGRATED | EP-011 | El agente lee su manual y sabe autorreferenciarse |
| PT-043 | FEATURE | S1 | INTEGRATED | EP-011 | Migracion guiada: las decisiones se conducen |
| PT-044 | BUG | S2 | DONE | EP-012 | El YAML del intake declara una fase que el registro contradice |
| PT-045 | BUG | S2 | DONE | EP-012 | npx @a81biz/cauce start no arranca: el punto de entrada documentado falla |
| PT-046 | BUG | S2 | DONE | EP-012 | Una entrada de HISTORY mal formada bloquea G4 y ninguna regla permite corregirla |
| PT-047 | BUG | S3 | DEFERRED | — | PHASE 5 manda rama por PT y los 43 PT de este repositorio van sobre trabajo |
| PT-048 | BUG | S3 | DEFERRED | — | El issue de una allocation DEFERRED enlaza a un directorio que no existe |
