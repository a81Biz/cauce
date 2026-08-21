# PT-094 — Fuera de alcance   `SUITE-R44`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Regenerar el checkpoint a mano | Probado: escrito en `main` falla en `trabajo` y al revés. No hay valor correcto para una tarea cerrada | — |
| Borrar `CHECKPOINT.json` | Probado: verifica limpio y no arregla nada. Deja verde borrando el dato | — |
| Que `avanzar` **no escriba** checkpoint al llegar a terminal | Es un cambio de contrato de la transición, y este `PT` es un `BUG` que desbloquea `main` | — |
| Los **41** avisos de `verify-fdge --all` | Ninguno bloquea. `PT-089` ya los declaró y siguen declarados | — |
| Publicar | Es irreversible y la dispara una persona (`SUITE-R06`) | — |
| Las **104** reglas que aún no declaran su sujeto | `SUITE-R38` crece por adopción declarada, no por lote | — |

## Un hueco que este `PT` destapa y **no** arregla

`LEXICON` §Ciclo de vida dice `IN_REVIEW --> VALIDATION_PENDING : tipo BUG · siempre`. **`avanzar`
no lo aplica**: camina la escalera de fases y sólo toca el `status` al llegar a la última, para
ponerlo en `INTEGRATED`. Este `PT` llegó a `PHASE 9` con `status: READY` y `verify-fdge --all`
verificó limpio.

Es la misma familia que el defecto que este `PT` corrige —una regla escrita cuyo camino real no la
aplica— y **entra en su propio intake**, no aquí: cambiar qué estado asigna una transición toca el
ciclo de vida entero, no una lectura.

Aquí el estado se puso a mano, que es lo que hay que hacer hasta que el comando lo haga.

## La tercera fila es la que más me tentó

`avanzar` **sabe** que la tarea llega a un estado terminal: tiene la variable `terminal` a mano.
Podría no escribir el checkpoint, o retirarlo.

No entra porque cambia **qué hace una transición de fase**, y eso merece su propio intake firmado.
Este `PT` corrige una **lectura** —qué se contrasta y qué no— y deja el artefacto exactamente donde
estaba. Un `BUG` que desbloquea la publicación no es el sitio para redefinir el ciclo.
