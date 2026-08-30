# `PT-204` · `test-scenarios.md`

## `TS-01` — lo que nadie ha juzgado sale como `SIN_JUZGAR`   → `AC-01`

```
DADO   una regla sin verificador y sin juicio
CUANDO se clasifica
ENTONCES cae en SIN_JUZGAR, no en «deuda»
```

Y su pareja: **lo juzgado mecanizable y sin verificador es `DEUDA`**, que es otra cosa y se arregla
distinto — **juzgar cuesta un párrafo; verificar cuesta una tarea**.

## `TS-02` — la suma sigue cuadrando   → `AC-01`

```
DADO   la clasificacion
CUANDO se abre PENDIENTE en dos
ENTONCES PENDIENTE = DEUDA + SIN_JUZGAR, y las tres casillas siguen siendo exhaustivas
```

**Sin esto, «abrir» la casilla podría perder reglas por el camino y nadie lo notaría.** `PT-078`
construyó las tres casillas exactamente para que ninguna quedara fuera en silencio.

## `TS-03` — una bajada de cobertura **se dice**   → `AC-03`

```
DADO   un hito anterior con una cifra mayor
CUANDO corre audit
ENTONCES lo dice, con las dos cifras
```

## `TS-04` — …y **no bloquea**   → `AC-03`

```
DADO   la misma bajada
CUANDO corre audit
ENTONCES no emite ningun error
```

**Bloquear obligaría a escribir el verificador antes de poder añadir la regla**, y eso es
exactamente la regresión que el firmante descartó. Y su pareja: **que el aviso exista** — sin ella,
«no bloquea» lo cumple una salida vacía, que es literalmente lo que pasó en el primer intento.

## `TS-05` — la subida también se dice   → `AC-03`

```
DADO   un hito anterior con una cifra menor
CUANDO corre audit
ENTONCES lo dice
```

Sin esto, el hito **sólo hablaría de lo malo** y nadie sabría si el trabajo de un lote sirvió.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **No se escribe ningún verificador**: eso es `EP-029`.
- **No se declara `NO_VERIFICABLE` ninguna regla**: decidir por 123 sería inventar 123 juicios.
- **`AC-02` y `AC-04` no tienen caso**, y no lo tienen porque **son juicios**: el ranking por
  frecuencia y la decisión sobre el lote son lo que la tarea **sabe**, no lo que **impide**. Su
  evidencia es `self-review.md` y `HISTORY.log`.
