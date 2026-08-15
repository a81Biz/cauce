# PT-020 — Descubrimiento   `PHASE 2` · `2-R`

## Medido

```
REGISTRY.graph   {"generated":"2026-08-13","scope":"bin","pt_at_generation":0}
graph.json       18 nodos, TODOS de bin/cauce.mjs
tools/           16 archivos · ninguno en el grafo
```

`bin/cauce.mjs` son ~300 líneas. `docs/methodology/tools/` son las 16 herramientas donde vive
**prácticamente todo el código ejecutable de este marco** — `verify-fdge.mjs` sola pasa de 1400
líneas.

## Qué decide sobre ese grafo

`FDGE-R43` bloquea `G2` en un PT `MAJOR` cuando el grafo está ausente o `STALE`. Hoy está
`STALE` —`PT-034` fue estructural— así que **de hecho bloquea**. Pero si estuviera `FRESH`,
`FDGE-R43` daría por bueno un grafo que **no describe el sistema**: la compuerta pasaría mirando
`bin/` y afirmando algo sobre `tools/`.

Es la forma más silenciosa de fallo que este marco reconoce: **un verde que no miró**.

## Lo que la regla pide, y lo que el alcance dice

`FND-R28`: *«El grafo cubre el código propio y nada más. Fuera: dependencias de terceros, salida
de compilación, pruebas, fixtures y mocks.»*

`CLAUDE.md` §Estructura ya lo declara con todas las letras: *«No hay `src/`: el ejecutable está en
`bin/` y en `docs/methodology/tools/`, porque las herramientas viajan dentro del paquete»*. **La
desviación estaba escrita y el grafo no la siguió.**

## Lo que este descubrimiento NO puede afirmar

Que ampliar el alcance haga el grafo útil. Un grafo de 16 archivos que se importan poco entre sí
—cada herramienta es casi autónoma, y comparten `patrones.mjs`— puede describir bien y decir poco.
`PHASE 3` tiene que declarar qué se espera de él, o esto será una casilla marcada.
