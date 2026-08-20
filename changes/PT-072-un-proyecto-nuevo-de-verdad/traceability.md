# PT-072 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | La instalación se hace desde el paquete | E1 · E2 | `salidas/instalacion.txt` | VERIFICADO |
| AC-02 | El proyecto recorre las nueve fases de una tarea | E3 · E4 · E5 · E6 | `salidas/ciclo-completo.txt` | VERIFICADO |
| AC-03 | Cada hueco queda anotado con su fase y su síntoma | E7 · E8 | `salidas/huecos.md` | VERIFICADO |
| AC-04 | El grafo nace con el alcance correcto | — | `salidas/instalacion.txt` | VERIFICADO con salvedad |
| AC-05 | Lo que no se pueda completar se declara | — | `discovery.md` | VERIFICADO |

## `AC-04` lleva salvedad, y se dice

`plan-layout` calculó `alcance: src`, que es **correcto** aquí: todo el código propio está en
`src/`. Pero eso significa que la prueba **no midió** el defecto de `PT-070`, que aparece cuando
hay código fuera de `src/` — como en cauce, con `bin/`. El intake ya lo preveía: «si no, se
declara que la prueba midió el defecto». Midió el caso bueno, y consta.

## `AC-05` · lo que no se completó

Las nueve fases de `PT-001` se movieron **editando el registro**, no con `tracker avanzar`, porque
`H7` lo hace imposible sin plataforma. Está declarado en la autorrevisión de aquel `PT` y es la
razón de `PT-082`. No se simuló: se hizo de otra forma y se dijo cuál.
