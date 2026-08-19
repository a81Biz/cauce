# PT-059 — Estrategia   `PHASE 3`

## Lo que se construye

```
tracker viabilidad PT-NNN

  PT-061 · FEATURE/STANDARD
    coste tipico     689 (ESTIMADO)      de 6 tareas cerradas
    mayor hecho     4210 (MEDIDO)        en esta sesion
    veredicto       SAFE

  La sesion ya ha completado algo mayor que esto. No es certeza: es PRECEDENTE.
```

Y la función pura detrás, `viabilidadDe`, que devuelve `SAFE`, `MARGINAL` o `UNSAFE` **con el
motivo**.

## La decisión que lo gobierna todo

`PHASE 2` midió que **`disponible = total − gastado` no se puede calcular**: el total es el
contexto del modelo y sale `SIN EVALUAR` siempre. Así que la compuerta **no compara contra un
presupuesto**. Compara contra el **precedente**:

> ¿Ha completado ya esta sesión algo del tamaño de lo que viene?

Eso es observable, no requiere inventar nada, y es honesto sobre lo que afirma: no dice «cabe»,
dice «esta sesión ya pudo con algo así».

## Los tres veredictos, y qué los separa

| Veredicto | Cuándo | Qué implica |
|:---|:---|:---|
| `SAFE` | coste ≤ lo mayor ya completado en la sesión | Se puede empezar |
| `MARGINAL` | coste ≤ lo mayor × `HOLGURA`, **o** alguna entrada es `SIN EVALUAR` | Solo trabajo atómico |
| `UNSAFE` | coste > lo mayor × `HOLGURA`, con las dos cifras conocidas | No se inicia · checkpoint y parada |

**`SIN EVALUAR` cae en `MARGINAL`, no en `UNSAFE`.** Es `AC-05` y es la decisión más delicada de
la tarea:

- Aprobarlo (`SAFE`) sería aprobar por omisión — la compuerta daría verde justo cuando menos sabe.
- Bloquearlo (`UNSAFE`) suena prudente y **es peor**: como el disponible es `SIN EVALUAR` siempre,
  bloquearía todo trabajo para siempre. Una compuerta que bloquea siempre se apaga, y entonces no
  protege el día que tiene razón — lo mismo que `PT-056` midió con las discrepancias.

`MARGINAL` es la respuesta honesta: **no apruebo, y no invento un motivo para prohibir**. Restringe
a lo atómico y deja la decisión donde estaba.

`UNSAFE` se reserva a cuando hay **evidencia en contra**, no ausencia de evidencia a favor.

## `AC-06`: no cabría nunca ≠ no cabe ahora

Si el coste típico supera **la mayor sesión jamás registrada** —29 286 líneas hoy— el problema no
es el momento: es la tarea. Ahí `BLOCKED_BY_CONTEXT` sería un bucle infinito, porque la siguiente
sesión daría lo mismo.

La compuerta lo dice y **pide partirla**. No la parte: partir una tarea cambia su alcance, y el
alcance lo firma una persona (`INTAKE-R06`).

Se deriva del historial completo, **no de un contador de reintentos** — un contador diría «van tres
veces» sin poder distinguir mala suerte de imposibilidad.

## `BLOCKED_BY_CONTEXT`

Estado de **tarea**, en `LEXICON` §4, **no terminal**:

```
BLOCKED               falta algo EXTERNO       lo desbloquea alguien haciendo algo
BLOCKED_BY_CONTEXT    la tarea esta lista;     lo desbloquea empezar otra sesion
                      el MOMENTO no
```

Meterlo dentro de `BLOCKED` perdería la diferencia entre «hay un problema» y «no es el momento», y
esa diferencia es literalmente lo que el firmante escribió: *la tarea no está fallando*.

**No terminal** importa mecánicamente: `verify-fdge` y `tracker` tratan los estados terminales como
trabajo cerrado. Una tarea en `BLOCKED_BY_CONTEXT` sigue **viva** y sigue apareciendo en el tablero.

## Dónde vive

| Qué | Dónde | Por qué |
|:---|:---|:---|
| `SAFE` · `MARGINAL` · `UNSAFE` · `HOLGURA` | `tools/patrones.mjs` | Junto a `NATURALEZAS`, que es lo que consumen |
| `viabilidadDe(coste, precedente, historico)` | `tools/patrones.mjs` | Pura · la usarán `tracker` y `verify-fdge` |
| `tracker viabilidad PT-NNN` | `tools/tracker.mjs` | Deriva de git y del registro · en `SIN_PLATAFORMA` |
| `BLOCKED_BY_CONTEXT` | `LEXICON.md` §4 + `patrones.mjs` | `LEX-R21` · y `VIVOS` tiene que incluirlo |
| El vocabulario de veredictos | `LEXICON.md` §6.5d | `LEX-R21` · antes que el código |

## Lo que NO se hace

**No resuelve `G1`..`G4`.** Es una compuerta de **viabilidad**, no de gobernanza. Confundirlas
metería una condición técnica dentro de una decisión humana.

**No parte tareas.** Lo dice; no lo hace.

**No cambia `MEDIDO`/`ESTIMADO`/`SIN EVALUAR`.** Los consume tal como `PT-058` los dejó.

**No escribe `SESSION.json`.** Eso es `PT-060`.

## El riesgo

Que `SAFE` se lea como una promesa. La sesión mayor de este repositorio hizo cuatro veces más que
la menor, así que el precedente es una señal **ruidosa**. La defensa es que la salida diga siempre
**de qué sale** —el coste con su naturaleza, el precedente con la suya— y que la palabra que
acompaña a `SAFE` sea «precedente», nunca «capacidad».

Y un segundo, real: **`HOLGURA` es un juicio**, como `MINIMO_REFERENCIA` en `PT-057`. Se declara
con nombre y comentario en vez de enterrarse en un `if`.
