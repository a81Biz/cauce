# PT-043 — Estrategia   `PHASE 3`

## Objetivo

Que migrar un legado deje de ser una lista y pase a ser un recorrido acompañado, sin que la
máquina decida nada por nadie y sin relajar `SUITE-R17`.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Modo interactivo: preguntar cada decisión por consola | `migrate` corre en CI y en scripts. Una herramienta que bloquea esperando `stdin` deja de poder verificarse |
| Escribir un `MIGRACION.md` y decir «léelo» | Es el defecto que `SUITE-R28` nombra: el `.md` es el registro, la conversación es la interfaz |
| Proponer un valor por defecto para cada decisión | Es como se rellena un estado que miente. `SUITE-R19` lo prohíbe: lo que no se automatiza **no se inventa** |
| **Conducir en la salida: qué decide, por qué es tuyo, qué pasa después** | Es lo que se puede hacer sin interlocutor y sin inventar nada |

## Solución

Tres piezas, ninguna nueva de concepto — las tres existen ya en `INSTALL`:

```
1 · numerar          «3/6», no una viñeta suelta. Un recorrido tiene principio y final
2 · dar el porqué    por cada una: qué decide y POR QUÉ no puede decidirlo una máquina
3 · explicar la puerta  el modo restringido se dice AL ENTRAR, no se descubre chocando
```

Y el porqué **se reconoce, no se adivina**: sale de lo que la acción nombra. Si no se reconoce,
se dice (`RULE-06`) — que es exactamente lo que delató `D1` en `PHASE 2`.

## Los dos defectos de `PHASE 2`

**`D1`** — el `need()` de `migrate.mjs:217` es una advertencia sobre el de `:211`, no una decisión
aparte. Se **funde** en el primero. No se enseña su texto a `PORQUE`: enseñárselo habría hecho
desaparecer el síntoma dejando la fila que sobra.

**`D2`** — `resumen()` corta a 96 sin mirar dónde. Se corta **en el último espacio** antes del
límite y se marca con `…`, para que se vea que hay más — el texto completo ya está impreso arriba,
bajo `REQUIERE UNA PERSONA`.

Rechazado: subir el límite. Con 120 se parten dos en vez de tres; el defecto no es el número.

## La regla

`SUITE-R55`, HARD, en `RULES.md`. Sin regla, esto es un texto bonito en una salida de consola que
la siguiente edición puede quitar sin que nada lo note — que es como se perdió la mitad de lo que
`EP-011` está recuperando. Citada en `PHASES.md` y `FDGE-Prompts.md` (`SUITE-R20`).

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| El código de salida de `migrate` (`1` con pendientes) | Se ejecuta contra el legado real y se mira `$?` |
| `REGISTRY.migration_pending` — lo lee `verify-fdge` para `SUITE-R17` | Fundir dos `need()` en uno baja la lista de 7 a 6; sigue siendo no vacía y sigue bloqueando |
| El informe `REQUIERE UNA PERSONA` | La fila fundida conserva su texto dentro de la primera |
| El proyecto legado | **Nada**: solo se ejecuta sin `--apply`, que no toca un archivo |
| `verify-suite` | `SUITE-R55` nueva debe estar citada y no duplicada (`SUITE-R14`, `LEX-R23`) |

## Criterios de éxito, derivados de los AC

- `AC-01` → la salida real sobre el legado numera cada decisión y ninguna queda partida
- `AC-02` → ninguna de las seis cae en el `RULE-06` por defecto
- `AC-03` → el modo restringido aparece con su explicación en la misma salida
- `AC-04` → `migrate` sigue saliendo con código `1` y `migration_pending` sigue poblado

## Autorrevisión

Contradicciones: ninguna con `SUITE-R19` —no se automatiza ninguna decisión— ni con `SUITE-R17`.
`AC` sin cubrir: ninguno. Dependencias que faltan: ninguna; no se toca `patrones.mjs`.
