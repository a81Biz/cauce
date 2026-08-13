# PT-004 — Escenarios de test   `PHASE 4`

Todos se ejecutan en `docs/methodology/tools/selftest.sh`, contra el proyecto sintético.
`TS-01` y `TS-02` son **los que reproducen el defecto en rojo** (`FDGE-R17`: el escenario que
reproduce un bug se escribe primero y debe fallar antes del arreglo).

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | `PT-004` del fixture bajado a `phase: 1`, sin `traceability.md` | **no** aparece `✗ FDGE-R15` |
| `TS-02` | `AC-02` | `PT-002` (INVESTIGATION) bajado a `phase: 1`, sin `discovery.md` | **no** aparece `✗ FDGE-R42` |
| `TS-03` | `AC-03` | `PT-004` en `phase: 4`, sin `traceability.md` | aparece `✗ FDGE-R15` |
| `TS-04` | `AC-03` | `PT-002` en `phase: 2`, sin `discovery.md` | aparece `✗ FDGE-R42` |
| `TS-05` | `AC-04` `AC-05` | `PT-004` sin `phase` en la allocation y sin `phase:` en el intake, sin `traceability.md` | aparece `SIN EVALUAR`, **no** aparece `✗ FDGE-R15` |
| `TS-06` | `AC-04` | igual que `TS-05` | el aviso nombra `phase` y dice dónde declararla (`RULE-07`) |
| `TS-07` | regresión | fixture intacto | los 180 casos existentes siguen en verde |

## Por qué `TS-03` y `TS-04` no son opcionales

Son los casos **inversos**. Sin ellos, el arreglo podría consistir en no comprobar nunca nada
y los seis primeros pasarían. Un escenario que solo prueba que algo dejó de fallar no
distingue «se arregló» de «se apagó» — que es exactamente el falso verde que este lote
persigue.

## Por qué `TS-05` no espera un error

Porque `RULE-06` prohíbe inventar el valor que permitiría comprobar. Un PT sin fase declarada
no es un PT que incumpla: es un PT sobre el que no se puede afirmar nada. El escenario
comprueba las dos mitades — que **no** bloquea y que **sí** se ve.

## Regresión sobre `FDGE-R52`

`FDGE-R52` ya consumía la fase (`verify-fdge.mjs:757`) y `PT-004.2` toca esa resolución. Sus
tres casos existentes —`PHASE 4` sin bitácora falla · bitácora al día pasa · bitácora atrasada
falla— entran en `TS-07` y tienen que seguir en verde sin tocarlos.
