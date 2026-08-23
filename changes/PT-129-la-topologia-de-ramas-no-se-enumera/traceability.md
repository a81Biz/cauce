# Trazabilidad — `PT-129`

> `AC` → `TS` → test → evidencia (`FDGE-R15`). Un `AC` sin `TS`, sin test o sin evidencia es un
> **Orphan Criterion** y bloquea `G3`. La columna Evidencia se completa en `PHASE 6`.

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | FDGE-R19 enumera todos los tipos de rama o remite al documento que los declara | `TS-01` `TS-02` `TS-03` | `selftest.sh:FDGE-R19 remite a LEXICON` | ⏳ PHASE 6 |
| AC-02 | Existe una comprobacion que ENUMERA las ramas reales y las contrasta con la topologia | `TS-07` `TS-09` `TS-10` `TS-11` | `selftest.sh:la topologia se enumera` | ⏳ PHASE 6 |
| AC-03 | Una rama efimera cuya tarea esta terminal se reporta | `TS-08` | `selftest.sh:efimera sobre tarea terminal ⇒ avisa` | ⏳ PHASE 6 |
| AC-04 | Una rama que no encaja en ningun tipo se nombra, no se ignora ni se borra sola | `TS-07` `TS-12` | `selftest.sh:rama fuera de la topologia ⇒ se nombra` | ⏳ PHASE 6 |
| AC-05 | La comprobacion informa y NO borra | `TS-12` | `selftest.sh:enumerar no borra ninguna rama` | ⏳ PHASE 6 |
| AC-06 | La proyeccion cauce/usuario declara cuando esta vieja | `TS-09` | `selftest.sh:la proyeccion declara su frescura` | ⏳ PHASE 6 |
| AC-07 | El type de una rama tiene UN SOLO vocabulario, el que LEXICON declara | `TS-01` `TS-06` | `selftest.sh:ramaDeTarea deriva del type del item` | ⏳ PHASE 6 |
| AC-08 | Sin type, ramaDeTarea NO inventa: devuelve null y quien llama lo dice | `TS-04` `TS-05` | `selftest.sh:sin type no hay nombre de rama` | ⏳ PHASE 6 |

---

## `AC-07` y `AC-08` son ampliación de `PHASE 2`, y se declara

El intake se firmó el `2026-08-22` **sin ellos**: `D-1` —los dos vocabularios del `<type>`— apareció
en el descubrimiento, no antes. Añadirlos en `PHASE 4` es lo que la fase existe para hacer, y
consta aquí en vez de aparecer en el diff sin explicación.

## `AC-08` tiene caso real, no fixture

`PT-125` y `PT-126` están hoy en el registro **sin `type`** por el defecto de `PT-124`. La inversa
de `TS-04` se ejecuta contra el árbol de verdad: hoy `tracker rama PT-125` devuelve
`chore/alberto-martinez/PT-125-…` y ese nombre está **inventado**.
