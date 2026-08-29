# `PT-200` · `test-scenarios.md`

Todos sobre un proyecto sintético en `$WORK`, con su `REGISTRY.json` y sus artefactos. Nunca sobre
el registro real: un caso que corriera sobre él mediría el estado de hoy.

## `TS-01` — un `PT` terminal y sellado NO se re-verifica   → `AC-01`

```
DADO   un PT INTEGRATED con su sello, y nada cambiado
CUANDO corre verify-fdge --all
ENTONCES no aparece entre los PT verificados
```

## `TS-02` — si cambia lo que su sello cubre, VUELVE ENTERO   → `AC-02`

```
DADO   el mismo PT sellado
CUANDO se toca uno de sus artefactos
ENTONCES vuelve a verificarse
```

**Es el que impide que el sello sea ciego.** `TS-01` lo cumple un `verify-fdge` que salte todo lo
`INTEGRATED` sin mirar nada — que es el camino descartado en `strategy.md §1`.

Y su hermano, que cubre el error más fácil de cometer:

```
DADO   el mismo PT sellado y sus artefactos intactos
CUANDO cambia el VERIFICADOR
ENTONCES vuelve a verificarse
```

Sin esto, el sello certificaría contra una versión de las reglas que ya no existe.

## `TS-03` — un `PT` VIVO se verifica siempre   → `AC-03`

```
DADO   un PT en DRAFT o DONE, con sello o sin el
CUANDO corre verify-fdge --all
ENTONCES se verifica
```

Sellar lo vivo sería apagar la compuerta justo donde hace falta.

## `TS-04` — sin sellos, se verifican TODOS   → `AC-04`

```
DADO   un proyecto sin SELLOS-PT.json
CUANDO corre verify-fdge --all
ENTONCES los verifica todos
```

Copia la lección de `bloques-sellados`: **su silencio significa «no acotes»**, nunca «no hay nada que
correr». Un verde por vacío sería el falso verde más caro que este marco podría producir.

## `TS-05` — sellar es una DECISIÓN, no un efecto   → `AC-01`

```
DADO   una corrida de verify-fdge sin --sellar
CUANDO termina en verde
ENTONCES NO se escribe ningun sello
```

Es la lección de `PT-191`: sin ella, el sello se estamparía por el mero hecho de ejecutar el comando.

## Lo que NO se cubre, y consta   `SUITE-R26`

**Un cambio en `RULES.md` que no toque `verify-fdge.mjs` no invalida el sello.** Igual que en la
batería. Se declara en `strategy.md`.

**Y no se mide una cifra de minutos.** Fijarla sería fijar el número de lo correcto (`-18`); lo que
se mide es que lo terminal y sin cambios no se recorre.
