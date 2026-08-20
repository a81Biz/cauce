# PT-082 — Estrategia   `PHASE 3`

## `A` · cómo se hace determinista el caso

| Opción | Por qué no |
|:---|:---|
| Pasar `--mio` | Resuelve la identidad **de la máquina**: mismo problema con otro nombre |
| `git config user.name` en el arnés | Escribe en la configuración de quien ejecuta. Efecto lateral fuera del fixture |
| Mover el caso al fixture | Perdería lo que mide: que funciona contra un repositorio **real** con sesión abierta |
| **`GIT_CONFIG_COUNT` por entorno** | ✅ Mecanismo estándar de git, no toca ninguna configuración, y es explícito sobre de quién habla el caso |

## `B` · por qué protección de rama y no una comprobación

Se evaluó poner en `verify-fdge --gate G4` una consulta a `gh pr checks`. **Se descartó**, y no
por comodidad:

- Es **evitable no ejecutándolo** — que es literalmente el defecto que `PT-075` documentó.
- Depende de tener `gh` autenticado. En un clon sin credencial daría `SIN EVALUAR`, y un control
  que se apaga solo no controla.
- La protección de rama la aplica **GitHub**, antes del merge, sin depender de que nadie corra nada.

`SUITE-R26` dice que una regla `HARD` **aspira** a comprobación mecánica. Ésta la tiene, y la
tiene en el sitio donde no se puede saltar.

## El orden, que no es arbitrario

1. Arreglar el caso **primero**. Con la protección ya puesta y CI en rojo, ni el PR que arregla la
   protección podría fusionarse. Es el clásico candado con la llave dentro.
2. Aplicar la protección **después** — ya hecho el 2026-08-19, y por eso esta tarea la documenta
   en vez de proponerla: el firmante la autorizó respondiendo a la pregunta directa.

## Lo que esta tarea NO arregla, y consta

Las otras ocho apariciones del patrón están cerradas. Lo que **no** existe es algo que impida la
décima: detectar «este caso depende del entorno» es análisis que no sé hacer con una expresión
regular. Queda declarado en `TD`, no fingido.
