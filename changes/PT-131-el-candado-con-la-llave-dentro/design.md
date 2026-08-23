# `PT-131` — Diseño   `PHASE 4`

## La función única, en `patrones.mjs`

Junto a `sinSellar`, que es quien la va a usar. **No en los llamadores**: la lectura del tag está
hoy duplicada en `verify-fdge.mjs:1805` y `tracker.mjs:2995` con el comentario de `PT-087`
copiado palabra por palabra, y ésa es la avería que produjo el defecto (`SUITE-R38`).

```js
/**
 * Lo que YA VIAJO en un tag, derivado del ARBOL y no de lo que el tag declaraba.
 *
 * PT-131 · PT-087 arreglo QUE TAG mirar —el mas alto— y siguio mirando su REGISTRY.json, que es
 * una declaracion SOBRE el trabajo y no el trabajo. En cuanto el estado terminal se escribe
 * DESPUES de etiquetar —EP-019: 17 tareas en DONE dentro de v12.0.0 y en INTEGRATED despues— la
 * declaracion y el arbol dejan de coincidir y la deuda sale falsa.
 *
 * DOS condiciones, no una: la tarea tiene trabajo AHORA, y ese trabajo NO esta en el tag. Sin la
 * primera, PT-025 (DEFERRED, nunca trabajada) y PT-032 (cerrada sin artefactos) contarian como
 * deuda: una tarea sin trabajo no tiene nada que sellar.
 *
 * UN solo comando de git para las 131 entradas.
 */
export function selladoEnTag(ls, existe, allocations) {
  const dirs = ls();                      // git ls-tree --name-only <tag> changes/
  if (dirs == null) return null;          // sin tag o sin git: SIN EVALUAR (RULE-06)
  const enTag = new Set(dirs);
  return new Set((allocations ?? [])
    .filter((a) => !existe(a) || enTag.has(`${a.id}-${a.slug}`))
    .map((a) => a.id));
}
```

**`ls` y `existe` se inyectan.** `patrones.mjs` no ejecuta git ni toca el disco: los dos
llamadores tienen su propio `gitDe`/`execFileSync` y su propio `existsSync`. Inyectarlos deja la
función **pura y probable**, que es lo que permite la inversa de `TS-03` sin fabricar un repo.

## Los dos llamadores

| Archivo | Antes | Después |
|:---|:---|:---|
| `verify-fdge.mjs:1805` | `idsTag` desde `git show <tag>:REGISTRY.json` | `selladoEnTag(...)` |
| `tracker.mjs:2995` | la **misma** lectura, duplicada | `selladoEnTag(...)` |

El comentario largo de `PT-087` se conserva **una sola vez**, en `patrones.mjs`, y se le añade lo
que `PT-131` mide. Dos copias de una explicación divergen igual que dos copias de una regla.

## Lo que NO cambia

- **`sinSellar` mantiene su firma** `(allocations, idsEnTag)`. Sigue recibiendo un conjunto de IDs
  sellados; lo que cambia es **de dónde sale ese conjunto**.
- **`ESTADOS_TERMINALES` no se toca.** `DONE` sigue fuera, y hace bien.
- **El umbral sigue en 3.**
- **Ninguna regla cambia de texto.** `SUITE-R57` dice lo mismo; lo que cambia es que su
  comprobación mida lo que la regla dice.
