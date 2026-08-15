# PT-029 — Diseño   `PHASE 4`

## El hecho, y por qué viaja con su fase

En `patrones.mjs`, junto a `ESTADOS_TERMINALES` y por la misma razón (`SUITE-R38`):

```js
export const ORDEN_COMPUERTAS = ['G1', 'G2', 'G3', 'G4'];

export const EXIGIBLE_DESDE = {
  'manifest.json':  { desde: 'G3', fase: 6 },   // PHASE 6 lo escribe · G3 cierra PHASE 7
  'self-review.md': { desde: 'G3', fase: 6 },   // idem
  'HISTORY.log':    { desde: 'G4', fase: 8 },   // PHASE 8 lo escribe · G4 cierra PHASE 9
};

export const exigibleEn = (gate, artefacto) => { … };
```

La **fase** va al lado de la compuerta a propósito. Sin ella, `'G3'` es un número que hay que
creerse; con ella, es derivable: `manifest.json` se escribe en `PHASE 6`, la primera compuerta
posterior es `G3`, luego `G3` es la primera que puede exigirlo. El caso comprueba justo esa
relación, no el valor.

## `exigibleEn` y el borde que importa

```js
exigibleEn(undefined, 'HISTORY.log')  →  false    sin compuerta no se exige nada
exigibleEn('G1', 'manifest.json')     →  false    PHASE 1 · el artefacto es de PHASE 6
exigibleEn('G3', 'manifest.json')     →  true
exigibleEn('G3', 'HISTORY.log')       →  false    PHASE 7 · el artefacto es de PHASE 8
exigibleEn('G4', 'HISTORY.log')       →  true
exigibleEn('G4', cualquiera)          →  true     G4 es la última: no relaja nada
```

**`G4` no pierde ni una exigencia.** Es la propiedad que hay que proteger, y tiene caso propio.

## Las tres sustituciones

```
verify-fdge.mjs:1097   if (gate)                 →  if (exigibleEn(gate, 'manifest.json'))
verify-fdge.mjs:1129   if (gate || afterPhase6)  →  if (exigibleEn(gate, 'self-review.md') || afterPhase6)
verify-fdge.mjs:1155   if (gate)                 →  if (exigibleEn(gate, 'HISTORY.log'))
```

`afterPhase6` se conserva en la segunda: exigir el `self-review` a partir de `PHASE 6` **sin**
compuerta ya era correcto y no es lo que estaba roto.

## El caso que caza la forma

`selftest.sh` falla si `verify-fdge.mjs` contiene `if (gate)` seguido de `fail(` — una comprobación
que se active con **cualquier** compuerta. Hoy hay tres; después, cero.

Lo que este caso **puede** hacer: poner en rojo la cuarta el día que se escriba.
Lo que **no** puede: cazar la misma intención escrita de otra forma —`if (gate !== undefined)`,
`if (gate?.length)`—. Se declara en `test-scenarios.md`; ampliar la lista de formas es perseguir
el idioma, que es lo que `SUITE-R44` ya decidió no hacer.

## Lo que este diseño **no** hace

No acopla `verify-fdge` a `tracker.mjs` para derivar la tabla de fases: son dos herramientas que
hoy no se importan, y hacerlo por tres filas cambiaría la topología del paquete por una tabla.
La fase se escribe **al lado** del valor, que es lo que la hace contrastable sin el acoplamiento.

No toca ninguna regla: `FDGE-R23`, `FDGE-R25` y `FDGE-R29` dicen lo correcto. Lo que estaba mal
era **cuándo** se comprobaban.
