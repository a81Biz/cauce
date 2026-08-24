# Fuera de alcance — `PT-121`

> `SUITE-R44` · La última columna es el destino, y es vocabulario cerrado.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Automatizar el merge | `G4` es humana en los tres modos, sin excepción (`EXEC-R04`, `SUITE-R06a`) | — |
| Crear tags históricos para versiones anteriores a la `8.2.0` | Fecharlos hoy sería inventar cuándo se selló cada una. Se declaran ausentes | — |
| Cerrar el issue dentro de `integrar` | Eso es `cerrar`, y va **después**: el estado terminal tiene que estar ya en la rama por defecto (`SUITE-R46`) | — |
| Que `integrar` acepte estados distintos de `DONE` | `FDGE-R34` exige `DONE` para `G4`. Otro estado significa que `G4` no pasó, o que ya se integró, y no se adivina cuál | — |
| Que `firmar` escriba el estado de `G2`, `G3` o `G4` | Cada compuerta produce un estado distinto; fingir que son el mismo sería inventar una transición | — |
| Que una declaración al final de una regla llegue a `CORE.md` | El núcleo condensa a ~210 caracteres por diseño (`SUITE-R15`). Cambiarlo es tocar el contrato del núcleo entero | — |
| Responder si el trabajo **de lote** puede citar el `EP` en un commit | Es sobre `FDGE-R19` y la unidad del commit, no sobre la rama. La midió `PT-127` —15 commits— y `PT-130` la dejó declarada | `FPGE` · pregunta abierta |

---

## Lo que esta tarea **produce** y no resuelve

El viaje de vuelta ya no depende de que nadie se acuerde: **hay comando, hay rama declarada y hay
fase que lo nombra**. Lo que sigue abierto es la pregunta de la **unidad del commit** para el
trabajo de lote, que `PT-127` midió y `PT-130` dejó escrita — y que ahora tiene, además, una rama
declarada sobre la que discutirla.
