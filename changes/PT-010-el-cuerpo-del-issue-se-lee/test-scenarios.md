# PT-010 — Escenarios de test   `PHASE 4`

| TS | AC | Entrada | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | `cuerpoDeIssue` de un `EP` | **no** contiene «sin implementación» |
| `TS-02` | `AC-01` | ídem | dice que **es** una implementación |
| `TS-03` | `AC-02` | `EP` con `url` y `rama` | el enlace empieza por `https://` |
| `TS-04` | `AC-03` | sin `url` | **no** hay `https://` ni `](`, y se dice por qué |
| `TS-05` | `AC-04` | `EP` con dos tareas | las enumera con su `#issue` |
| `TS-06` | `AC-06` | cualquiera | conserva la nota de que referencia y no copia |
| `TS-07` | `AC-01` | tarea con `epic` | sí dice a qué implementación pertenece |

## Los inversos

`TS-04` es `RULE-06`: sin él, «enlace absoluto» podría implementarse inventando una URL.
`TS-07` impide que arreglar el `EP` rompa el cuerpo de una tarea, que hoy sí funciona.
