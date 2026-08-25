# PT-144 · `context.md` — `PHASE 2` Analysis (`2-R`)

> Lote `EP-022`. Tarea `CHORE`, `S2`, track `STANDARD`.
> `PHASE 2` no diseña ni toca código: describe el terreno (`PHASES` · `2-R`).

## 1. Qué se leyó

| Fuente | Qué aportó |
|:---|:---|
| `intake.md` | los ocho campos que el contrato debe sostener · el caso irregular `Foundation → FND` |
| `11-Conventions.md` §Hard Rules | `RULE-01` y `RULE-02`, que gobiernan esta tarea entera |
| `graphify-out/` | **FRESH**, regenerado hoy sobre 19 archivos · quién importa `patrones.mjs` |
| `tools/patrones.mjs` | la forma real de un contrato compartido |
| `tools/verify-patrones.mjs` | qué comprueba hoy, y qué **no** |
| `HANDOFF.md` | «no escribir `REGISTRY.json` a mano» · «no fiarse del exit code de una tubería» |

**El grafo NO está ausente ni `STALE`** (`FDGE-R08`, `FDGE-R43`): se regeneró antes de abrir esta
fase, con autorización expresa del firmante. No hay confianza que degradar.

## 2. La tarea es la forma normativa de `RULE-01`

`RULE-01` —«un hecho se escribe en un sitio; los demás lo derivan»— dice literalmente que **es la
causa raíz que la v4 nació para eliminar, y reaparece sola**, y enumera dónde ya reapareció: la
versión en `verify-suite`, en `verify-fdge`, en `migrate` y en el fixture del selftest; el sello,
copiado en tres archivos; el número de casos, en cuatro sitios y erróneo en los cuatro.

**Los componentes son la siguiente instancia de esa lista**, y `EP-022` la mide en catorce sitios.
Esta tarea no introduce un principio nuevo: aplica uno ya escrito a un hecho que se le escapó.

## 3. Acoplamiento — derivado del grafo, no de leer imports a mano

`FDGE-R08`. **Ocho de las nueve herramientas del lote ya importan `patrones.mjs`:**

```
audit.mjs  ·  build-core.mjs  ·  migrate.mjs  ·  tracker.mjs
verify-fdge.mjs  ·  verify-patrones.mjs  ·  verify-suite.mjs  ·  version.mjs   ->  patrones.mjs
```

**`comparar-marco.mjs` NO lo importa.** Es la excepción, y tiene consecuencia directa sobre
`PT-145`: allí no basta con sustituir el literal `OPCIONALES = new Set(['FIDE'])` por una
referencia — **hay que añadir la arista de import que hoy no existe**. Es la única de las cuatro
herramientas del lote que necesita eso.

> Este dato es exactamente para lo que se regeneró el grafo antes de empezar, y es lo que el
> análisis de `PT-145` habría tenido que averiguar a mano. Queda escrito aquí para que no se
> vuelva a averiguar.

**Radio de impacto de `PT-144`: cero.** Añade un export nuevo a un módulo que ya se importa en
ocho sitios. Nada lo consume todavía — ese es su `AC-04`.

## 4. La forma real de un contrato en `patrones.mjs`

El módulo declara hoy dos clases de cosa, y **`verify-patrones.mjs` las comprueba de forma
distinta**:

| Clase | Ejemplo | Cómo se comprueba hoy |
|:---|:---|:---|
| Patrón (`PATRONES`) | `AC_ID: { re, para, casa, noCasa }` | genéricamente: todo patrón necesita `para`, `casa` y `noCasa`, y sus ejemplos se ejecutan |
| Contrato a medida | `selloDe` | con **aserciones propias** escritas para su propiedad concreta |
| Constante con contrato | `ESTADOS_TERMINALES`, `EXIGIBLE_DESDE`, `RIGE_DESDE`, `PREFIJOS_DE_ID`, `TIPOS_DE_ITEM` | **no se comprueba en `verify-patrones`** |

**Esto obliga a precisar `AC-03` del intake**, que pide comprobar el contrato nuevo «como
comprueba los demás». Los demás **no son uno**:

- Si «los demás» son las constantes (`ESTADOS_TERMINALES` y compañía), entonces hoy **no se
  comprueba ninguna**, y el criterio sería «no hacer nada» — que no es lo que el intake quiere.
- Si «los demás» es `selloDe`, hay precedente exacto: **un contrato no-regex con aserciones
  propias dentro de `verify-patrones.mjs`**, que falla citando `SUITE-R38`.

**Se toma la segunda lectura**, y es la que respeta `RULE-02`: la comprobación tiene que poder
fallar. `AC-03` se ejecuta escribiendo aserciones propias para el contrato de componentes, con
el patrón de `selloDe` (`verify-patrones.mjs:60-68`) como plantilla.

No contradice el intake: lo **precisa**, que es lo que `PHASE 2` existe para hacer.

## 5. `Foundation → FND` es el caso que decide el diseño

`audit.mjs:214` resuelve con un ternario que el nombre del componente y la sigla de sus reglas no
coinciden:

```js
const sigla = comp === 'Foundation' ? 'FND' : comp;
```

Un contrato que no separe `nombre` de `sigla` **no serviría para el único caso irregular que
existe hoy**, y obligaría al siguiente a escribirse igual, al lado. Es el caso de prueba del
diseño, no una nota al pie.

## 6. Dato del corpus que apareció al regenerar el grafo

El grafo anterior declaraba alcance `bin, docs/methodology/tools` y contenía **17** archivos. El
directorio tiene **19**: faltaban `eventos.mjs` y `matriz.mjs`.

Ninguna de las dos está en el alcance de `EP-022` —no nombran componentes—, así que **no cambia
esta tarea**. Se registra porque un alcance declarado que no coincide con lo contenido es la
misma clase de defecto que el lote persigue, y callarlo sería elegir no verlo.

## 7. Complejidad

```
Complejidad propuesta:  STANDARD
```

No es `TRIVIAL`: introduce una estructura de la que van a depender cinco tareas, y el criterio de
irregularidad (§5) es una decisión de diseño real. No es `MAJOR`: no cambia comportamiento
observable, su radio de impacto es cero y no toca contratos externos.

`BACKLOG.md` consultado: no hay trabajo vivo que toque `tools/patrones.mjs` salvo `PT-150`, del
mismo lote y **serializado detrás de esta tarea** (`EP-022` §6).
