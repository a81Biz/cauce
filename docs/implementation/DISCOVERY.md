# DISCOVERY — índice de bugs e investigaciones

Índice, no contenido (`LEX-R12`). Una línea por PT; el análisis vive en
`changes/PT-XXX-slug/`. Append-only: un PT que cambia de estado se edita en su fila, y los
que se cierran se quedan (`SUITE-R09` rige el contenido, no la columna de estado).

Los identificadores los asigna `REGISTRY.json` (`SUITE-R08`). Este archivo no asigna nada.

| PT | Tipo | Sev | Estado | Implementación | Título |
|:---|:---|:---|:---|:---|:---|
| PT-001 | BUG | S2 | DONE | EP-001 | SUITE-R35 tiene verificador y ninguna compuerta lo ejecuta |
| PT-002 | BUG | S3 | DONE | EP-001 | audit.mjs declara «sin huecos» midiendo por componente, no por regla |
| PT-003 | INVESTIGATION | S3 | CLOSED | EP-001 | SUITE-R35 declara milestone, issue y PR; el adaptador solo implementa issue |
| PT-004 | BUG | S2 | DONE | EP-001 | verify-fdge exige artefactos de PHASE 4 a un PT en PHASE 1 |
| PT-005 | BUG | S2 | DONE | EP-001 | La excepción de secretos no sobrevive a un clon superficial, y la historia se da por revisada sin revisarla |
| PT-009 | BUG | S2 | DONE | EP-003 | tracker cerrar comenta sin marca y SUITE-R43 toma su propio mensaje por humano |
| PT-010 | BUG | S2 | DONE | EP-003 | El cuerpo de un issue de EP dice «sin implementación» y su enlace al intake es un 404 |
| PT-011 | BUG | S2 | DONE | EP-004 | INTAKE-R08 lee los miembros de todo el texto: citar un PT en prosa lo convierte en miembro |
| PT-012 | BUG | S2 | READY | EP-004 | migrate.mjs no tiene tramo 4.12 → 6.x |
| PT-013 | BUG | S2 | READY | EP-004 | Lo que un lote aplaza queda en prosa y nada obliga a que vuelva |
| PT-014 | BUG | S3 | READY | EP-004 | El cuerpo de un lote se escribe antes de que sus tareas tengan issue |
