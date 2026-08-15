# PT-047 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `FDGE-R19` declara la topología | presente en `RULES.md` |
| E2 | AC-01 | …y llega al núcleo | presente en `CORE.md` |
| E3 | AC-01 | `PHASES.md` la cita | presente |
| E4 | AC-02 | Un PT vivo en `PHASE 5` sin `branch` se **reporta** | `FDGE-R19` |
| E5 | AC-02 | Con `branch` declarada, silencio | no aparece |
| E6 | AC-02 | En `G4` **bloquea** | `✗ FDGE-R19` |
| E7 | AC-02 | Un PT ya `INTEGRATED` sin rama **no** se reporta | no aparece |
| E8 | AC-02 | Un PT en `PHASE 4` tampoco: la rama nace en `PHASE 5` | no aparece |
| E9 | AC-03 | El `CLAUDE.md` declara las efímeras | `<type>/PT-NNN-slug` |
| E10 | AC-04 | `SUITE-R42` dice **para qué rama** | «rama por defecto» |

## Los que NO deben avisar

`E5`, `E7` y `E8` son tres de diez. Sin `E7` esto exigiría rama retroactiva a 46 tareas
integradas; sin `E8`, a toda tarea recién abierta. Un aviso que aparece cuando no toca es la
forma más rápida de que se ignore el que sí toca.
