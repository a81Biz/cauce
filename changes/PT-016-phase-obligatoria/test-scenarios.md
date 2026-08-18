# PT-016 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | Un `PT` vivo sin `phase` | `✗ SUITE-R08` |
| E2 | AC-01 | …y deja de repetirlo **por artefacto**: un mensaje, no cinco | «la exigencia de» no aparece |
| E3 | AC-01 | Un `PT` vivo **con** `phase` | sin error |
| E4 | AC-01 | Un `EP` sin `phase` | **exento**, no falla |
| E5 | AC-01 | Un `PT` ya `INTEGRATED` sin `phase` | **exento**, no falla |
| E6 | AC-02 | Las cuatro plantillas de tarea traen `phase` | presente |
| E7 | AC-02 | `EPIC-INTAKE.md` **no** lo trae | ausente |
| E8 | AC-03 | La migración dice que ahora falla | «deja de ser un aviso» |
| E9 | AC-04 | `ESTADOS_TERMINALES` vive en un solo sitio | presente en `patrones.mjs` |
| E10 | AC-04 | …y **no** contiene `DONE` | `DONE` no está |

## `E10` es el que protege a los otros nueve

`DONE` **no es terminal**: un PT en `DONE` espera `G4` y sigue vivo. Si alguien lo añadiera
«porque suena a terminado», se apagarían **a la vez** `FDGE-R52`, `FDGE-R19` y `SUITE-R08` — las
tres comparten la constante desde esta tarea. El contrato lo declara y el caso lo comprueba.

## Los que NO deben fallar

`E3`, `E4` y `E5`. Sin ellos esto exigiría fase a seis lotes y a cuatro tareas integradas, que es
pedir que se invente el dato: el defecto que la tarea corrige, con el signo cambiado.
