# `PT-199` · `test-scenarios.md`

Los tres corren en `selftest.sh`, sección `EP-026`, y **ninguno anida la batería** — eso es lo que
`PT-188` impide. Todos ejercitan la función del esqueleto de forma aislada.

## `TS-01` — la corrida acotada no emite errores de andamiaje   → `AC-01`

```
DADO   el esqueleto inerte montado sobre un $WORK vacio
CUANDO el andamiaje toca las rutas que el arnes menciona
ENTONCES ninguna orden falla con «No such file or directory»
```

Se ejercita sobre las dos rutas que **fallaban de verdad** —`docs/implementation/HISTORY.log` y
`changes/PT-002-pool/discovery.md`— porque son el defecto medido, no un ejemplo inventado.

## `TS-02` — si el andamiaje toca algo no montado, SE SABE   → `AC-02`

```
DADO   una ruta que el esqueleto NO monta
CUANDO el andamiaje escribe en ella
ENTONCES la corrida lo dice, en vez de dejarlo pasar
```

**Éste es el que impide que esto vuelva.** `TS-01` lo satisface añadir dos rutas a mano; sólo `TS-02`
distingue «hoy está limpio» de «no puede ensuciarse en silencio». Y es el que cubre el límite
declarado en `discovery.md §6`: las rutas construidas en variables, que ningún `grep` ve.

## `TS-03` — los casos que sí corren siguen midiendo lo mismo   → `AC-03`

```
DADO   una seccion ACTIVA
CUANDO se monta el fixture
ENTONCES es el fixture COMPLETO, no el esqueleto
```

El arreglo toca la rama inactiva de `build_fixture`. `TS-03` fija que **la activa no cambió**: sin
él, un esqueleto que se montara siempre dejaría toda la batería corriendo sobre árboles vacíos y
**en verde**.

## La comprobación inversa   cierre de `PHASE 5`

Con la derivación retirada del esqueleto, `TS-01` tiene que ponerse **rojo**. Se ejecuta y se anota:
un caso que pasa igual con y sin el arreglo no prueba nada.

## Lo que NO se cubre, y consta   `SUITE-R26`

**Que el esqueleto monte las 174.** El `grep` no ve rutas construidas en variables, así que la
cobertura no será del 100 % y **no se afirma que lo sea**. Lo que se afirma es que las que el arnés
menciona literalmente se montan, y que lo que falte **se nota** (`TS-02`).
