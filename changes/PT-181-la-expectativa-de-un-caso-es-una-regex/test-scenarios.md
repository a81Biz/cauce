# `PT-181` · `test-scenarios.md`

## `TS-01` — existe una forma de declarar la expectativa LITERAL   → `AC-01`

```
DADO   chkl y chknol en el arnes
CUANDO se usan con una expectativa cualquiera
ENTONCES se comportan como chk y chkno para el texto que SI esta
```

## `TS-02` — un literal con `.` NO casa cualquier carácter   → `AC-02`

```
DADO   la expectativa literal "regla.mjs"
CUANDO la salida dice «reglaXmjs»
ENTONCES NO casa
```

**Y su pareja, que es la que prueba que `chkl` hace algo:**

```
DADO   la MISMA expectativa con chk (regex)
CUANDO la salida dice «reglaXmjs»
ENTONCES SI casa — y por eso hacia falta chkl
```

Sin las dos mitades, `TS-02` lo satisface un `chkl` que fuera un alias de `chk`.

## `TS-03` — las expectativas que hoy son regex siguen funcionando   → `AC-03`

```
DADO   una expectativa con metacaracteres a proposito, como "^0$"
CUANDO se usa con chk
ENTONCES sigue interpretandose como regex
```

**Es el que impide arreglarlo rompiendo 215 casos.** Y lo respalda la corrida entera: 1400+ casos
que usan `chk` siguen en verde.

## `TS-04` — la cifra de ambiguas se declara   → `AC-03`

```
DADO   el arnes
CUANDO termina una corrida
ENTONCES dice cuantas expectativas parecen literales y se interpretan
```

Se prueba sobre un arnés **falso** con expectativas conocidas, no sobre el real: fijar el número del
real sería fijar el número de lo correcto (`HANDOFF -18`) y cambiaría con cada tarea.

## Lo que NO se cubre, y consta   `SUITE-R26`

**Las 96 ambiguas no se migran ni se auditan.** Está declarado en el intake §4 y en
`strategy.md §2`. Lo que esta tarea entrega es la **forma** y la **cifra visible**.
