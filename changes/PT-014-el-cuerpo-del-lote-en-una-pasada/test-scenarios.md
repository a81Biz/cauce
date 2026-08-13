# PT-014 — Escenarios de prueba   `PHASE 4` · `FDGE-R23`

| # | Escenario | Esperado |
|:---|:---|:---|
| E1 | Un lote y dos tareas, en orden de registro | `PT-90, PT-91, EP-9` |
| E2 | La misma tanda | 3 elementos: ni se pierde ni se duplica |
| E3 | Solo las tareas | conservan el orden del registro |
| E4 | La lista original tras llamar | intacta |
| E5 | `undefined` | lista vacía, sin excepción |
| E6 | Cuerpo de lote con una tarea ya numerada | contiene `#77` |

E1 es el que importa: **sin el arreglo sale `EP-9, PT-90, PT-91`** y el caso va rojo. Verificado
revirtiendo la función a la identidad antes de darlo por bueno.
