# `PT-123` — Descubrimiento   `PHASE 2-B`

## D-1 · El archivo dice de sí mismo que es derivado

`BACKLOG.md`, línea 3:

> *«Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.»*

Y su propia cabecera registra lo que pasa cuando no se regenera:

> *«Este archivo llevó **ocho lotes** sin regenerarse y llegó a declarar un estado de **tres
> versiones atrás**… un índice que se escribe a mano diverge, y sólo hace falta tiempo.»*

## D-2 · Ningún comando lo escribe

`tracker.mjs:3327` · `INDICES` cubre **tres** archivos:

```
DISCOVERY.md       BUG · INVESTIGATION
ENRICHMENT.md      FEATURE
REFACTOR_SCOPE.md  REFACTOR · CHORE
```

`BACKLOG.md` **no está**. Y `grep BACKLOG tools/*.mjs` da **una** aparición, que no es una
escritura.

## D-3 · Por qué quedó fuera, y no es descuido

Los tres índices de `INDICES` responden a la misma forma: **todos los PT de estos tipos**. Se
generan con un filtro sobre `allocations` y una tabla.

`BACKLOG.md` es de otra naturaleza: **la implementación abierta y sus tareas, en orden**, más los
aplazados. No es un filtro por tipo: es un **corte por lote vivo**. Por eso no encajaba en el
generador que existía, y por eso nadie lo añadió.

## D-4 · La consecuencia, medida hoy

```
BACKLOG.md dice          «## Implementación abierta — EP-015»    Regenerado el 2026-08-18
el registro dice          EP-015 CLOSED · la abierta es EP-020
lotes cerrados desde      4   (EP-016, EP-017, EP-018, EP-019)
```

**Cuatro lotes de retraso**, y su cabecera registra que la vez anterior fueron ocho.

## D-5 · Y deja una condición de `G1` incumplible

`DoR-E7` exige *«solapamiento calculado y declarado en `BACKLOG.md`»*. El solapamiento **está**
calculado —§7 del intake de `EP-020`— pero declararlo exige escribir un archivo que:

- dice de sí mismo que se deriva del registro,
- tiene una entrada en `no hacer` que **prohíbe editarlo a mano**,
- y **no tiene generador**.

Las tres cosas a la vez dejan una sola salida practicable: **saltarse la regla**. Que es la
definición de `FDGE-R51` aplicada al revés — *«cobrar el ritual completo por cada arreglo tiene una
sola salida practicable: saltárselo»*.

## Qué establece, y qué no

**ESTABLECE:** que el archivo se declara derivado, que ningún comando lo escribe, que lleva cuatro
lotes de retraso, y que con eso `DoR-E7` no se puede cumplir sin editarlo a mano.

**NO ESTABLECE:** qué parte de `BACKLOG.md` es derivable y cuál no. La tabla sí; el **porqué del
orden** lo escribe quien reparte, y eso es `PHASE 3`.
