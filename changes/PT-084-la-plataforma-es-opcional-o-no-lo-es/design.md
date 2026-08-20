# PT-084 — Propuesta   `PHASE 4` · `G2`

## Un solo interruptor, consultado en dos sitios

```js
const HAY_TABLERO_PARA_LA_NOTA = Boolean(adaptador?.comentar);
```

**Las guardas** — sólo exigen issue y acceso si hay tablero:

```js
if (HAY_TABLERO_PARA_LA_NOTA) {
  if (!a.issue) throw new Error(`${id} no tiene issue: hay plataforma declarada…`);
  if (adaptador.disponible && !adaptador.disponible()) throw new Error('…gh auth login');
}
```

**La publicación** — al issue, o al ledger:

```js
if (HAY_TABLERO_PARA_LA_NOTA) adaptador.comentar(a.issue, cuerpo);
else { /* TRANSICIONES.log, append-only */ }
```

**Y el espejo de etiquetas**, que era el segundo punto y sólo se vio ejecutando:

```js
if (adaptador?.etiquetasDeIssue && adaptador?.etiquetar) { … }
```

## `FDGE-R52` no se toca

`--nota` **sigue siendo obligatoria**. Lo único que cambia es dónde vive. Un caso lo fija:
sin plataforma y sin `--nota`, `avanzar` sigue negándose.

## Escenarios

| # | Escenario | Espera |
|:---|:---|:---|
| E1 | Sin plataforma, `avanzar` con nota | **funciona**, y la fase cambia |
| E2 | …y la nota queda en `TRANSICIONES.log` | con el cuerpo de la transición |
| E3 | Sin plataforma y **sin** `--nota` | sigue fallando — `FDGE-R52` intacta |
| E4 | Con plataforma | nada cambia: la nota va al issue |
| E5 | `migrate` | ya no promete «sin ella no cambia nada» |

`E4` es el que evita que esto sea un arreglo que rompe el camino bueno. Sin él, cualquier
implementación pasaría `E1`..`E3`.

## `G2`

```
Firmado por lote: EP-017 · delegada · 2026-08-20 · Alberto Martínez
Viabilidad (FDGE-R54): SAFE · registrada en REGISTRY.allocations[].viabilidad
```
