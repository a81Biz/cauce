# PT-054 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `tracker proyectar` sobre un repositorio con allocations vivas | escribe `cauce/<usuario>` |
| E2 | AC-01 | …y contiene `ESTADO.md` y `CHECKPOINT.json` | los dos |
| E3 | AC-02 | Tras proyectar, el árbol de trabajo | **no cambia**: ni rama ni archivos |
| E4 | AC-04 | Cada fila de `ESTADO.md` | lleva la rama **y** su SHA |
| E5 | AC-04 | Una tarea sin rama creada | lo declara vacío; **no hereda** el SHA de otra |
| E6 | AC-03 | Cada commit de la proyección | lleva la marca `cauce:proyeccion` |
| E7 | AC-03 | Un commit **sin** la marca en esa rama | se **reporta**, y no se borra |
| E8 | AC-05 | Sin `git config user.name` | **no se proyecta** y se dice |
| E9 | AC-05 | El nombre se normaliza para ser una referencia válida | `Alberto Martínez` → `alberto-martinez` |
| E10 | AC-06 | La proyección | **no** borra ni reescribe: añade un commit encima |
| E11 | AC-01 | `avanzar` la llama, dentro de su respaldo | si falla, la transición se revierte |
| E12 | AC-06 | Sin `--publicar` | la rama se queda **local** |

`E3` es el que sostiene todo el diseño: **la fontanería no toca el árbol**. Si lo tocara, la
proyección no podría ocurrir mientras se trabaja — que es su única razón de ser.

`E7` es el que impide que la decisión se erosione sola. Una rama derivada en la que alguien
escribió **deja de serlo**, y `cauce/alberto` con un commit humano se ve exactamente igual que sin
él.

## Lo que ningún caso puede comprobar

**Que alguien mire la proyección.** Se comprueba que exista, que agregue y que diga la verdad;
que sirva para lo que se pidió —ver en qué se trabaja sin preguntar— solo lo dirá usarla.

Y **la convivencia de dos personas**: aquí el usuario es uno, el de `git config`. Que dos
proyecciones no se pisen es de `EP-016`, y prometerlo aquí sería dejarle una casilla marcada.
