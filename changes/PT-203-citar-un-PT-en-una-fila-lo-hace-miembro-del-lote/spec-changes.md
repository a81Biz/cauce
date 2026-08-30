# `PT-203` · `spec-changes.md` — el alcance creció en `PHASE 5`, y se declara

`G2` ya estaba resuelta cuando esto apareció. Ampliar el alcance en silencio es lo contrario de una
compuerta, así que el cambio se escribe aquí.

## Qué destapó el cambio

Los `AC` del intake son tres, y ninguno habla de certificar nada:

| | Criterio |
|:---|:---|
| `AC-01` | Citar un `PT` como origen **no** lo hace miembro del lote |
| `AC-02` | Los miembros reales se siguen detectando |
| `AC-03` | El mensaje distingue «no es miembro» de «le falta la firma de lote» |

Al implementar `AC-02` —la pertenencia la asigna el registro— `INTAKE-R08` empezó a cubrir **62
tareas que nunca cubrió**, y **26 no cumplen**. Todas terminales. El arreglo correcto de `AC-02`
introducía, por su propia corrección, **26 avisos permanentes sin dueño**.

## Por qué eso no se podía dejar

Un aviso permanente que nadie puede resolver es una compuerta que enseña a ignorarse — el mismo
razonamiento que `SECRETOS-EXCEPCIONES.md` escribe para su caso: *«una compuerta siempre roja
enseña a saltársela; eso es peor que no tenerla»*.

Y no era pequeño: **26 instancias**, con una de ellas (`PT-172`) siendo una divergencia real entre
el registro y un intake sobre el mismo hecho.

## La decisión del firmante, y por qué se le pidió

El agente **midió, reportó la cifra y se detuvo**. El `VoBo` del `2026-08-28` cubre `G1`, `G2` y `G3`
de `EP-026`; **no** cubría certificar trabajo de lotes anteriores, y extenderlo solo habría sido el
deslizamiento que `SUITE-R27` describe.

> «necesitamos corregir o certificar y sellar, no podemos dejar pendientes menos una deuda tan
> grande. De ser necesario ponlos en una épica que atacaremos al terminar ésta»
> — Alberto Martínez, `2026-08-29`

## Qué entra de más, exactamente

| | Qué | Por qué cabe aquí y no en otra tarea |
|:---|:---|:---|
| 1 | `FIRMAS-DE-LOTE.md` — 26 filas firmadas, con dueño | `PT-203` es quien hace visibles las 26; dejarlas colgando sería que esta tarea introdujera la deuda |
| 2 | `verify-fdge` lee la certificación en `INTAKE-R08` | Es la misma línea de código que `AC-03` toca |
| 3 | `INTAKE-R09` honra la certificación | `CE-017`: bloqueaba el intake de `EP-027` por **citar** las dos tareas sin carpeta que existe para arreglar |
| 4 | `EP-027` abierta, con intake y sin `G1` | La certificación necesita un dueño **con identificador**, o no es un plazo sino una excusa |

## Lo que **no** entra, y sigue sin entrar

- **Corregir las 26.** Es `EP-027`. Trabajo cerrado no se reescribe de paso (`SUITE-R09`, `CE-014`).
- **`G1` de `EP-027`.** La autorización cubre **abrir** el lote, no admitirlo. Se pedirá al empezarlo.
- **Ampliar la certificación.** La lista es cerrada: 26 filas del `2026-08-29`. Una fila nueva sería
  una decisión nueva, y hay seis casos que lo prueban.

## Los `AC` no se reinterpretan

`AC-01`, `AC-02` y `AC-03` se cumplen **tal como estaban escritos** — su trazabilidad no cambia. Lo
que se añade es un cuarto bloque de conducta que el intake no pedía y que la implementación de
`AC-02` hizo necesario. Se verifica con seis casos propios y se declara aquí en vez de colarse en
la lectura de un `AC` existente.
