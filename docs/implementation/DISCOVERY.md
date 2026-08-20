# DISCOVERY — índice de bugs e investigaciones

Índice, no contenido (`LEX-R12`). Una línea por PT; el análisis vive en
`changes/PT-XXX-slug/`. Append-only: un PT que cambia de estado se edita en su fila, y los
que se cierran se quedan (`SUITE-R09` rige el contenido, no la columna de estado).

Los identificadores los asigna `REGISTRY.json` (`SUITE-R08`). Este archivo no asigna nada.

| PT | Tipo | Sev | Estado | Implementación | Título |
|:---|:---|:---|:---|:---|:---|
| PT-001 | BUG | S2 | INTEGRATED | EP-001 | SUITE-R35 tiene verificador y ninguna compuerta lo ejecuta |
| PT-002 | BUG | S3 | INTEGRATED | EP-001 | audit.mjs declara «sin huecos» midiendo por componente, no por regla |
| PT-003 | INVESTIGATION | S3 | CLOSED | EP-001 | SUITE-R35 declara milestone, issue y PR; el adaptador solo implementa issue |
| PT-004 | BUG | S2 | INTEGRATED | EP-001 | verify-fdge exige artefactos de PHASE 4 a un PT en PHASE 1 |
| PT-005 | BUG | S2 | INTEGRATED | EP-001 | La excepción de secretos no sobrevive a un clon superficial, y la historia se da por revisada sin revisarla |
| PT-009 | BUG | S2 | INTEGRATED | EP-003 | tracker cerrar comenta sin marca y SUITE-R43 toma su propio mensaje por humano |
| PT-010 | BUG | S2 | INTEGRATED | EP-003 | El cuerpo de un issue de EP dice «sin implementación» y su enlace al intake es un 404 |
| PT-011 | BUG | S2 | INTEGRATED | EP-004 | INTAKE-R08 lee los miembros de todo el texto: citar un PT en prosa lo convierte en miembro |
| PT-012 | BUG | S2 | INTEGRATED | EP-004 | migrate.mjs no tiene tramo 4.12 → 6.x |
| PT-013 | BUG | S2 | INTEGRATED | EP-004 | Lo que un lote aplaza queda en prosa y nada obliga a que vuelva |
| PT-014 | BUG | S3 | INTEGRATED | EP-004 | El cuerpo de un lote se escribe antes de que sus tareas tengan issue |
| PT-015 | CHORE | S4 | DONE | EP-013 | Escribir verificador para las reglas HARD que hoy no tienen ninguno |
| PT-016 | CHORE | S4 | DONE | EP-013 | Decidir si phase pasa a ser obligatoria, y añadirla a TAREA.md |
| PT-017 | CHORE | S4 | DONE | EP-013 | migrate: derivar la lista de «qué llega nuevo» |
| PT-066 | BUG | S2 | INTEGRATED | EP-017 | La regla que se consulta es la que se define |
| PT-067 | BUG | S2 | INTEGRATED | EP-017 | El denominador de la cobertura esta incompleto |
| PT-068 | BUG | S1 | INTEGRATED | EP-017 | La marca de sesion es de quien la abre |
| PT-070 | BUG | S2 | READY | EP-017 | El alcance del grafo lo calcula la herramienta |
| PT-071 | BUG | S2 | READY | EP-017 | Publicar comprueba lo mismo que verificar |
| PT-072 | INVESTIGATION | S1 | READY | EP-017 | Un proyecto nuevo de verdad |
| PT-074 | BUG | S2 | INTEGRATED | EP-017 | La compuerta de viabilidad necesita una fase que la abra |
| PT-075 | BUG | S1 | INTEGRATED | EP-017 | Una regla sin verificador no ocurre: subir la exigencia donde el agente puede saltarsela en silencio |
| PT-076 | BUG | S1 | INTEGRATED | EP-017 | El arnes no escribe en el repositorio real: selftest pisa la marca de sesion y apila en el ledger |
| PT-077 | BUG | S2 | READY | EP-017 | La transicion mira lo que la consulta bloquea: avanzar ignora el STATE_MISMATCH |
| PT-078 | BUG | S2 | READY | EP-017 | Ninguna regla queda sin clasificar: VERIFICADA, NO_VERIFICABLE o PENDIENTE |
| PT-079 | BUG | S1 | INTEGRATED | EP-017 | Lo que se aprende se hace mecanico: la trazabilidad sobrevive a la rama |
| PT-080 | BUG | S2 | READY | EP-017 | Una regla no se define dos veces: FDGE-R22, R40 y R41 tienen dos textos y los tres divergen |
| PT-081 | BUG | S1 | READY | EP-017 | Una regla nueva no rige hacia atras, y la version lo dice: EP-017 es la 10.0.0 |
| PT-082 | BUG | S1 | READY | EP-017 | Un caso no depende de quien lo ejecuta, y la rama de integracion no acepta rojo |
