# PT-051 — Descubrimiento   `PHASE 2` · `2-B`

## Lo medido

```
reglas con al menos un fail() o warn()          95
puntos de emision en total                     213
reglas emitidas por MAS de una herramienta       5   SUITE-R13 R16 R35 R40 R42
```

**213 puntos de emisión para 95 reglas**: de media, cada regla se comprueba en **2,2 sitios**. Y
`regla` hoy dice el **archivo** y calla la línea:

```
$ node tools/regla.mjs SUITE-R34
  la comprueba  verify-fdge.mjs   (BLOQUEA)
```

`verify-fdge.mjs` tiene **1 490 líneas**. Saber que la comprobación está «en `verify-fdge.mjs`»
deja el mismo trabajo que no saber nada: hay que abrirlo y buscar.

## Lo que ya está derivado, y por qué esta tarea es barata

```js
// tools/regla.mjs:66-80
export function fallosPosibles(fuentes) {
  const RE = /\b(fail|warn)\(\s*'([A-Z]+-R\d+)'/g;
  for (const { archivo, texto } of fuentes ?? []) {
    for (const m of String(texto).matchAll(RE)) { … e.herramientas.add(archivo); }
  }
}
```

**La herramienta ya recorre cada `fail()` uno a uno.** Tiene el `m.index` de cada coincidencia en
la mano y lo **descarta**: se queda solo con el nombre del archivo.

No hay que buscar nada nuevo. Hay que **dejar de tirar** lo que ya se tiene.

## El detalle que decide la implementación

La línea se calcula contando saltos hasta `m.index`. Y **hay una forma equivocada de hacerlo que
ya costó un defecto en este repositorio**: usar `texto.indexOf(m[0])` en vez de `m.index`.

`PT-043` lo encontró en `verify-fdge`: con dos entradas `CORRIGE` de idéntica cabecera,
`indexOf` devolvía **siempre la primera**. Aquí el efecto sería peor y más silencioso: dos
`fail('SUITE-R35', …)` en el mismo archivo darían **la misma línea**, y esa línea sería plausible.

`m.index` es lo correcto y es lo que ya está en la mano.

## Las cinco que se emiten desde varias herramientas

`SUITE-R13`, `SUITE-R16`, `SUITE-R35`, `SUITE-R40` y `SUITE-R42` se comprueban en **dos**
herramientas cada una. Hoy `regla` las lista separadas por `·` y no dice cuántas veces en cada una.

Son justo las que más falta hace localizar: una regla que se comprueba en dos sitios es una que
puede divergir consigo misma, que es lo que `SUITE-R38` persigue.

## Las que nadie comprueba

`audit` cuenta **62** reglas sin verificador (`TD-08`). Para ésas, `regla --donde` no puede dar una
línea — y la respuesta correcta no es una lista vacía, que se lee como «no encontré».

**«No tiene verificador» y «no encontré nada» son dos respuestas**, y hoy se verían igual. Es
`RULE-06` en su forma más corta, y `AC-03` existe por eso.

## Lo que NO es el defecto

No es que `fallosPosibles` esté mal. Está bien y está derivado — `selftest` ya tiene un caso que
comprueba que **no hay una lista escrita a mano** (`no hay lista escrita de fallos`). Lo que falta
es que la información que ya circula llegue entera a quien pregunta.
