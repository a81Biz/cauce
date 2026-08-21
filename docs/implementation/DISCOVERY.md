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
| PT-087 | BUG | S1 | DRAFT | EP-018 | La comprobacion declara que hecho establece |
| PT-088 | BUG | S1 | DRAFT | EP-018 | Las reglas que sostienen el dominio se verifican o se declaran |
| PT-089 | BUG | S2 | DRAFT | EP-018 | La divergencia entre el registro y el YAML deja de apagar comprobaciones |
| PT-090 | BUG | S2 | DRAFT | EP-018 | La frescura del grafo es comprobable en cualquier clon |
| PT-091 | BUG | S3 | DRAFT | EP-018 | Las cifras del inventario se derivan, no se transcriben |
| PT-094 | BUG | S1 | INTEGRATED | — | El checkpoint de una tarea cerrada bloquea main |
