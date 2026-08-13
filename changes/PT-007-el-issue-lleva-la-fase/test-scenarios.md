# PT-007 — Escenarios de test   `PHASE 4`

Sobre la función pura, sin plataforma.

| TS | AC | Entrada | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | allocation en `phase: 4` | incluye `fase: 4` |
| `TS-02` | `AC-02` | allocation en `phase: 4` | incluye `G2` |
| `TS-03` | `AC-02` | allocation en `phase: 5` | **no** incluye ninguna `G` — ninguna compuerta espera en PHASE 5 |
| `TS-04` | `AC-01` | allocation sin `phase` | ninguna etiqueta de fase, y no revienta |
| `TS-05` | `AC-04` | issue con `fase: 2` y registro en `phase: 4` | divergencia |
| `TS-06` | `AC-04` | issue con las etiquetas correctas | sin divergencia |
| `TS-07` | `AC-05` | `REGISTRY.json` sin `tracker` | `estado` funciona y el espejo no exige etiquetas |
| `TS-08` | `AC-06` | `tracker estado` | imprime PT, fase y compuerta sin tocar la plataforma |

## Los inversos

`TS-03` impide que «deriva la compuerta» se implemente poniendo una siempre. `TS-06` impide
que la comprobación nueva denuncie todo. `TS-07` es la garantía de los proyectos sin plataforma.
