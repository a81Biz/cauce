# PT-008 — Escenarios de test   `PHASE 4`

Sobre la función pura, sin plataforma.

| TS | AC | Entrada (del más viejo al más nuevo) | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | `[marcado, sin marca]` | pendiente |
| `TS-02` | `AC-02` | `[marcado, sin marca, marcado]` | **no** pendiente |
| `TS-03` | `AC-03` | `[marcado, marcado]` | **no** pendiente — los del agente no cuentan |
| `TS-04` | `AC-05` | `[]` | no pendiente, y no revienta |
| `TS-05` | `AC-05` | `[sin marca, sin marca]` | **no se puede saber** — `SIN EVALUAR`, ni pendiente ni limpio |
| `TS-06` | `AC-06` | `RULES.md` | contiene `SUITE-R43` |
| `TS-07` | `AC-04` | fixture sin plataforma | `verify-fdge` no menciona `SUITE-R43` |

## Los inversos

`TS-02` y `TS-03` impiden que «hay pendiente» se implemente devolviendo siempre `true`.
`TS-05` es `RULE-06`: sin ninguna marca no se aprueba **ni** se bloquea, se declara. `TS-07` es
la garantía de los proyectos sin plataforma.
