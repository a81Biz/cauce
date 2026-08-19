# PT-060 — Descubrimiento   `PHASE 2`

> Medido contra este repositorio el 2026-08-18.

## 1. Qué existe hoy de una sesión

| Artefacto | Qué guarda | Cómo se escribe |
|:---|:---|:---|
| `SESSION_LOG.md` | 17 entradas de prosa: qué entregó y qué aprendió cada sesión | **A mano** |
| `HANDOFF.md` | El bloque `ESTADO` con `tarea`, `siguiente`, `no hacer`, `decisiones` | A mano · el sello lo pone `avanzar` |
| `CHECKPOINT.json` | `pt`, `phase`, `sha`, `rama`, `siguiente`… todo derivado (`PT-052`) | `tracker checkpoint` |

**Ninguno registra cuándo empieza y acaba una sesión.** `SESSION_LOG` la nombra por fecha; el
`HANDOFF` no la menciona; el checkpoint habla de la **tarea**, no de la sesión.

## 2. El hueco que `PT-059` dejó apuntado, medido

`PT-059` deriva el «precedente» —lo mayor que la sesión ya completó— aproximando **una sesión = un
día de commits**, porque es lo único observable. Hoy eso da:

```
commits del dia de hoy            45
commits desde el primero de hoy   44   (el ancla no se cuenta)
```

Coinciden. **Y coinciden por casualidad**: hoy la sesión empezó hoy. El día que no coincidan
—dos sesiones en una jornada, o una que cruza la medianoche— **nada lo notaría**, y la cifra sobre
la que la compuerta de `PT-059` decide sería silenciosamente falsa.

No es un defecto de `PT-059`: es que la información no existía. Esta tarea puede hacerla existir.

## 3. Lo que se puede derivar sin memoria, y lo que no

`LEX-R26` es la regla que gobierna esto: **un campo que solo puede rellenar la memoria del agente
no entra**. Aplicado a una sesión:

| Campo | ¿Derivable? | De dónde |
|:---|:---|:---|
| `desde` — el commit donde empezó | **Sí, si se marca al arrancar** | `HEAD` en ese momento |
| `commits`, `archivos`, `lineas` | Sí | `git log desde..HEAD` |
| `tareas` tocadas en la sesión | Sí | el asunto de cada commit (`PT-057`) |
| `abierta_en` — la fecha del `desde` | Sí | `git show -s --format=%cs` |
| `pt` en curso y su fase | Sí | `CHECKPOINT.json` |
| Cuánto contexto queda | **No** | decisión 4 · `SIN EVALUAR` |
| Qué se decidió en la sesión | **No** | eso es prosa y va a `SESSION_LOG` a mano |

**`desde` es el único campo que no se deriva de un estado anterior: se captura.** Y eso no es
memoria — es una **marca**, como el `sha` del checkpoint. La diferencia importa: una marca es un
dato verificable en el momento en que se pone; la memoria es una afirmación sobre el pasado sin
nada que la respalde.

Si no hay `SESSION.json`, el inicio es `SIN EVALUAR` y se cae al día como hoy, **diciéndolo**.

## 4. La corrección a la especificación, comprobada

La especificación de la que sale el lote propone `CHECKPOINTING`, `HANDOFF_REQUIRED` y
`WAITING_NEW_SESSION` como estados. El intake ya declara que **no son de tarea**. Comprobado
contra lo que hay:

```
ESTADOS_TERMINALES   INTEGRATED · CLOSED · REVERTED · REJECTED · DEFERRED
VIVOS                DRAFT · READY · REOPENED · IN_PROGRESS · BLOCKED ·
                     BLOCKED_BY_CONTEXT · BLOCKED_DOMAIN · VALIDATION_PENDING · DONE · DEFERRED
```

Durante un handoff la tarea sigue `IN_PROGRESS`: **no cambia nada de la tarea**, termina la sesión.
Meter esos tres en `REGISTRY.json` los haría permanentes bajo `SUITE-R09` —append-only, nunca se
reescribe— y el registro guardaría para siempre mecánica transitoria de una tarde.

`BLOCKED_BY_CONTEXT` (`PT-059`) **sí** es de tarea y por eso sí entró: dice algo sobre la tarea
—no debe ejecutarse todavía—, no sobre la sesión.

## 5. `AC-06` es el criterio del lote, y no se comprueba con un caso

> «Una tarea puede recorrer dos sesiones sin repetir el análisis.»

Lo que las cuatro tareas anteriores dejaron para que eso sea posible:

```
PT-056   el arbol CORRESPONDE al checkpoint      el estado al reanudar es demostrable
PT-057   el coste tipico sale del historial      se sabe cuanto cuesta lo que viene
PT-058   cada cifra dice de que naturaleza es    no se decide sobre un dato falso
PT-059   viabilidad SAFE/MARGINAL/UNSAFE         se sabe si empezarlo ahora
```

Falta el eslabón: **al reanudar, saber qué toca sin releerlo todo**. Y eso ya está casi hecho —
`tracker siguiente` lo deriva, y `CHECKPOINT.json` guarda `siguiente` desde `PT-052`. Lo que falta
es que **una sola orden** lo reúna, y que el handoff de cambio de sesión no se escriba a mano.

## 6. Lo que esto obliga

1. `SESSION.json` con `desde` **marcado al arrancar** y todo lo demás derivado (`AC-01`).
2. Los estados de sesión **fuera** de `REGISTRY.json` (`AC-02`) — y por tanto fuera de `LEXICON` §4.
3. Sobrescribible, con las transiciones apiladas en `SESSION_LOG.md` (`AC-03`).
4. El handoff de cambio de sesión **derivado** del checkpoint y de la sesión (`AC-04`), sin tocar
   la prosa de `HANDOFF.md` (`AC-05`).
5. Y `PT-059` pasa a poder usar el `desde` real en lugar del día — **si existe**, y diciéndolo
   cuando no.
