# PT-050 — Autorrevisión   `PHASE 6`

## Lo entregado, medido

```
bateria completa          209 s   ·  550 casos
--solo "compuerta"        138 s   ·    6 de 550        -34 %
--solo sin coincidencias  exit 1  ·  «NINGUN CASO CASA»
--solo sin valor          exit 2  ·  y no cuesta una vuelta
casos                     536 → 550
```

## Tres veces me corrigió la ejecución

### 1 · «Las dos únicas puertas» era falso

El `discovery` afirmó que todo caso pasa por `chk`/`chkno`. Con el filtro puesto, **83 casos
seguían corriendo**:

```
453  chk / chkno
 82  trlib / trlibno        ← la tercera y la cuarta puerta
  1  escrito a mano, con su propio if/pass/bad
```

**La cifra lo delató exacta**: `536 − 453 = 83`, y **la misma con patrón y sin él**. Eso es lo que
hizo evidente que el filtro *no filtraba*, en vez de que filtrara mal — dos síntomas que se
parecen y llevan a sitios distintos.

Y el caso escrito a mano no solo puenteaba el filtro: puenteaba **`revento()`**, la función que
existe para que una herramienta reventada no certifique nada. Llevaba así desde que se escribió.
**Un caso que se salta el arnés se salta todo lo que el arnés protege.**

### 2 · El filtro se pagaba a sí mismo

La primera versión lanzaba `grep -F` por caso — **536 procesos** — y el ahorro cayó al 32 %.
`case ... in *"$SOLO"*` casa igual de literal y no lanza nada.

### 3 · La cifra que prometí no se cumple, y van tres estimaciones

```
balance de EP-013   «≈99 %»   estimado sin medir
strategy.md          55 %     medido, pero con trlib ejecutandose en el aislamiento
medido de verdad     34 %     209 s → 138 s
```

La del 55 % salió de cronometrar una copia con `chk`/`chkno` en no-op — pero `trlib`/`trlibno`
**seguían ejecutándose**, así que no era el suelo. **Cada estimación estuvo más cerca y ninguna
acertó hasta ejecutar la definitiva.**

El `discovery` lleva la corrección **debajo**, no reescrita: una medida equivocada que desaparece
no enseña nada, y es el mismo principio que `FDGE-R29` aplica al ledger.

## La familia de siempre, dos veces más

```
sed -n "/NINGUN CASO CASA/,/^fi/p"    arrancaba en la linea del propio caso
sed -n "/necesita un patron/p"        casaba su propia definicion
```

El primero se tragaba medio archivo hasta el siguiente `fi` e incluía una palabra que dispara
`revento()`. El segundo habría pasado **aunque el mensaje real desapareciera**.

Van **cinco en esta sesión** —`SUITE-R42` en `PT-043`, `FDGE-R19` en `PT-047`, `FDGE-R39` en
`PT-015`, el recuento en `PT-049`, y estos dos—. Ahora se extrae **por posición** o por una cadena
que la definición no contiene (`>&2`).

**Es el candidato más claro a caso mecánico que ha salido del lote**, y no se abre aquí: el
firmante prohibió expandir `EP-014`. Queda dicho, con sus cinco ocurrencias contadas.

## Lo que no da, y está en el intake antes que aquí

**El 66 % del reloj sigue ahí.** Son las 181 reconstrucciones del fixture, y quitarlas exige que
un bloque sea una unidad que se pueda no ejecutar — un refactor de las 2 400 líneas que **cinco**
de las seis tareas de `EP-014` van a tocar.

`AC-02` deja la limitación a la vista **en cada ejecución**: «6 de 550» no se puede confundir con
la batería, ni en una evidencia ni en un PR leído tres lotes después.

## Límite declarado, y el mismo que `PT-049`

Catorce casos comprueban la **forma** del código de `selftest`, no su comportamiento. La ejecución
real —los cuatro caminos, con sus códigos de salida— va en `salidas/solo.txt`.

Que este límite aparezca en **dos tareas seguidas** es en sí un dato: mientras `selftest` no pueda
probarse a sí mismo barato, reaparecerá en cada tarea que lo toque.

`AC` sin cubrir: ninguno. Contradicciones con otras reglas: ninguna.
