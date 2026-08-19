# PT-064 — Autorrevisión   `PHASE 6`

## Lo entregado

```
commitsConAutor            cada commit trae su autor resuelto a persona (PT-061)
soloDe · sinPersona        puras · filtrar, y contar lo que queda fuera
precedente y techo         se filtran SIEMPRE por la persona local
coste                      a petición: --mio · --de "Nombre" · y DICE de quién es
casos                      930 → 955
```

## Las tres cifras se rompían distinto

`PHASE 2` midió que **ninguna** derivación pedía el autor. Pero no se arreglan igual:

| Cifra | Con dos personas | Se filtra |
|:---|:---|:---|
| **Precedente** | **Falso** — compara contra trabajo ajeno | siempre |
| **Techo** | **Inflado** — el día de dos cuenta como una sesión | siempre |
| **Coste típico** | Mezclado, y **no es un defecto obvio** | a petición |

La asimetría no es comodidad: las dos primeras responden «¿puedo **yo**, ahora?» y la tercera
«¿cuánto suele costar **esto**?». Y ahí más casos es mejor referencia — partir 17 cerradas entre
dos personas dejaría los grupos por debajo de `MINIMO_REFERENCIA`.

## Lo que el lote anterior ya tenía resuelto

El riesgo obvio era que filtrar dejase los grupos pequeños. **No hizo falta nada**: `costeDe`
devuelve `SIN REFERENCIA` con su motivo y `viabilidadDe` con una cifra `SIN EVALUAR` devuelve
`MARGINAL` sin aprobar por omisión.

`EP-015` dejó el comportamiento correcto para este caso **antes de que el caso existiera**. Se ve
en la salida real: `--de Nadie` da `SIN REFERENCIA`, y la viabilidad de esta tarea salió `MARGINAL`
porque la sesión acababa de abrirse.

## Un separador que no podía ser un espacio

`PT-057` separó los campos de `git log` con un espacio, porque el SHA no lleva ninguno. Aquí el
campo es un **nombre**, y «Alberto Martínez» se habría partido en dos. Se usa `%x1e`.

Es el tipo de detalle que solo se ve al añadir el campo, no al leer el código anterior.

## Séptima vez, y la primera con mayúscula

`--de` no estaba en `CON_VALOR`, así que `Nadie` se tomó por `ROOT`. Van siete —`-q`, `--solo`,
`--a`, las etiquetas, los subcomandos, `--slug` y ahora `--de`— y ésta es **la primera cuyo valor
empieza en mayúscula**: `ES_ETIQUETA` no lo filtra porque no es todo mayúsculas.

El patrón es siempre el mismo: **una opción con valor que no se declara deja su valor suelto entre
los posicionales.** Ya no es una lista incompleta; es que declarar la opción es el único mecanismo
y hay que acordarse.

## Y un caso mío que era una bomba de relojería

El caso de `PT-057` asertaba `CHORE/STANDARD · 1[0-9] tareas cerradas`. Al llegar a **20**, falló —
no porque nada se rompiera, sino porque el número creció. Atar una aserción a una cifra que crece
con cada tarea cerrada garantiza que fallará algún día, sin que eso signifique nada.

## Lo que no queda comprobado

**Que las cifras por persona sean útiles.** Con grupos pequeños, `SIN REFERENCIA` será frecuente —
correcto y menos útil que hoy. Es el precio de no mezclar.

**Que dos personas se comporten así.** Todo lo probado es con una y tres identidades.

**Que nadie use esto para comparar personas.** El marco da la cifra porque la necesita para
decidir; qué se hace con ella no lo decide una herramienta.

**Y que la persona de una tarea sea la correcta cuando dos la tocan.** Es la de su **primer commit
propio** —quien la empezó—. Repartir una tarea entre dos sería inventar una fracción que nadie ha
medido. Es una decisión, no una medición, y por eso se declara.
