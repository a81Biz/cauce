# PT-057 — Estrategia   `PHASE 3`

## Lo que se construye

Una acción `tracker coste` y la función pura detrás, que responde:

```
$ tracker coste CHORE STANDARD

  CHORE/STANDARD · 13 tareas cerradas
    commits     2     (1 – 7)
    archivos   26     (19 – 29)
    lineas   1966     (398 – 2491)
  Derivado de 13 de las 53 tareas cerradas. 8 cerradas no tienen commit propio.
```

Y con pocos datos **no da la cifra**:

```
$ tracker coste CHORE SIMPLE

  CHORE/SIMPLE · 1 tarea cerrada — SIN REFERENCIA
  Una mediana de una tarea no es una mediana. Lo que hay: commits 1, archivos 3, lineas 73,
  y es UN caso, no una referencia.
```

## Las tres decisiones, y por qué

### 1. La atribución es el **asunto** del commit, y solo el asunto

`PHASE 2` lo midió: el cuerpo cita otras tareas —`CORRIGE PT-052`, «el mismo defecto que `PT-023`
encontró»— y eso es **lo correcto** en un repositorio con bitácora append-only. Por eso `--grep`
no sirve: 61 de 162 commits nombran más de un `PT`.

La alternativa que se descartó: reconstruir la rama de cada tarea desde su merge
(`git log <merge>^1..<merge>^2`). Es **más exacta** y cubre **15 tareas** de 53 — la topología de
rama por tarea solo existe desde `PT-047`. Más precisa sobre un tercio del historial es peor
referencia que razonablemente precisa sobre el 85 %.

### 2. La mediana, con su **rango**, nunca la media

Los grupos son pequeños y dispersos —medido: `CHORE/STANDARD` va de **398 a 2491** líneas, y
`BUG/TRIVIAL` de **242 a 2591**, un factor de diez—. Una media la arrastra un solo caso; la
mediana no. Y el rango se enseña **siempre**, porque una cifra central
sin dispersión invita a leerla como una predicción — que es justo lo que el `out-of-scope` dice
que esto no es.

### 3. El umbral de `AC-03` es **cinco**, y es un juicio declarado

Por debajo de cinco tareas no se da cifra: se dice cuántas hay y se muestran los casos en crudo.

No hay nada que demuestre que cinco es el número correcto — es un juicio, y se declara como tal en
vez de esconderlo en el código. Lo que sí está medido es lo que decide: con el umbral en cinco,
`INVESTIGATION/STANDARD`, `CHORE/TRIVIAL`, `CHORE/SIMPLE` (1 tarea cada uno) y `BUG/SIMPLE` (3)
quedan **sin referencia**, y los cuatro grupos grandes —`BUG/STANDARD` 13, `CHORE/STANDARD` 13,
`BUG/TRIVIAL` 7, `FEATURE/STANDARD` 6— la dan.

## Dónde vive

| Qué | Dónde | Por qué |
|:---|:---|:---|
| `costeDe(cerradas, {tipo, complejidad})` | `tools/tracker.mjs` | pura y exportada, como `estadoDelArbol` y `checkpointDe` |
| `tracker coste [tipo] [complejidad]` | `tools/tracker.mjs` | y en `SIN_PLATAFORMA`: se deriva del registro y de git |
| El nombre y el contrato | `LEXICON.md` | `LEX-R21` · antes que el código |

**No** se añade regla nueva. `LEX-R26` no aplica —esto no es el checkpoint— y lo que se declara es
vocabulario: qué es una **referencia de coste**, de qué sale y cuándo no la hay.

## Lo que esta tarea NO va a hacer, y ya se sabe

**No guarda la cifra en ningún sitio.** Se recalcula al preguntar. Un archivo con los costes sería
una copia que diverge en cuanto se cierre la tarea siguiente (`SUITE-R38`, `RULE-01`), y el cálculo
es barato: 45 commits y sus `numstat`.

**No dice si una tarea cabe en la sesión.** Eso es `PT-059`, y necesita antes que `PT-058`
distinga `MEDIDO` de `ESTIMADO`. Aquí solo hay la referencia.

**No toca `HISTORY.log`.** Es append-only y su formato es prosa; hacerlo estructurado sería
reescribir 57 entradas, que `SUITE-R09` prohíbe.

## El riesgo real

Que alguien lea «`CHORE/STANDARD` cuesta 1966 líneas» como una predicción de **su** tarea. La
defensa no es técnica: es que la salida enseñe **el rango, el número de casos y de dónde sale** en
la misma línea que la cifra, y que con pocos datos no haya cifra que malinterpretar.

Y una segunda: que la referencia envejezca sin que nadie lo note. Se recalcula siempre, así que no
puede quedarse vieja — pero **sí puede describir un pasado que ya no aplica**, como los
`BUG/TRIVIAL` con commits de antes de `FDGE-R19`. La salida dice de **cuántas** tareas sale; decir
también *de cuándo* es lo que haría falta, y no está en el alcance de esta tarea. Se declara.
