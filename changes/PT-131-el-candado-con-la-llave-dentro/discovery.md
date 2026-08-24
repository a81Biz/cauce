# `PT-131` — Descubrimiento   `PHASE 2-B`

> Dónde está el defecto, con archivo y línea.

---

## D-1 · El punto exacto

`docs/methodology/tools/verify-fdge.mjs:1805-1809`

```js
const idsTag = (() => {
  if (!tag) return null;
  const j = git(['show', `${tag}:docs/implementation/REGISTRY.json`]);
  try { return JSON.parse(j).allocations.filter((a) => ESTADOS_TERMINALES.has(a?.status)).map((a) => a.id); }
  catch { return null; }
})();
const debe = sinSellar(REGISTRO?.allocations ?? [], idsTag);
```

`idsTag` = **«qué declaraba el registro del tag como terminal»**.
El hecho que la regla persigue es **«qué trabajo viajó ya en un tag»**.

Son cosas distintas en cuanto el estado terminal se escribe **después** de etiquetar, que es
exactamente lo que pasó con `EP-019`.

## D-2 · La prueba, sobre el árbol

```
$ git cat-file -e v12.0.0:changes/PT-096-un-enlace-que-falta-no-es-un-enlace-roto/intake.md   -> existe
$ git cat-file -e v12.0.0:changes/PT-100-un-hecho-un-nombre/intake.md                          -> existe
$ git cat-file -e v12.0.0:changes/PT-112-forzar-no-es-una-compuerta/intake.md                  -> existe
```

**El trabajo de las diecisiete está dentro de `v12.0.0`.** Su `status` no lo estaba.

```
v12.0.0 : REGISTRY   EP-019 DRAFT · PT-096..PT-112 en DONE      DONE ∉ ESTADOS_TERMINALES
main    : REGISTRY   EP-019 CLOSED · PT-096..PT-112 INTEGRATED  INTEGRATED ∈ ESTADOS_TERMINALES
```

## D-3 · `DONE` fuera de `ESTADOS_TERMINALES` es **correcto** y no se toca

`patrones.mjs` lo declara así a propósito, y `SUITE-R08` lo explica: *«`DONE` no está en ella, y no
es un olvido: un `PT` en `DONE` espera `G4` y sigue vivo»*.

Cambiar eso arreglaría este síntoma y rompería seis comprobaciones que se eximen de lo terminal.
**No es el camino.**

## D-4 · El marco ya cazó esta forma una vez, y la arregló a medias

`verify-fdge.mjs:1796-1803`, comentario de `PT-087`:

> *«"el tag anterior" era un PROXY de "lo ya sellado" … recién creado `v10.0.0`, las 21 tareas de
> `EP-017` —que ESTÁN dentro de él— aparecían como deuda sin sellar, y con umbral 3 eso bloquea
> `G2` justo después de haber sellado. El hecho es "lo que ya viajó en algún tag", y su observable
> es el TAG MÁS ALTO que exista.»*

**El comentario nombra el hecho correcto —«lo que ya viajó en algún tag»— y luego elige un
observable que no lo mide.** Cambió *qué tag* mirar; siguió mirando *el registro* del tag en vez
del *árbol* del tag.

## D-5 · El alcance del bloqueo, medido

```
$ verify-fdge --gate G2 PT-129   ->  ✗ SUITE-R57 · 17 sin sellar, umbral 3
$ verify-fdge --gate G2 PT-113   ->  ✗ SUITE-R57 · el mismo error
```

`PT-113` **es** la `12.0.1`: la tarea que produciría el tag que limpiaría la deuda. Las dieciocho
tareas de `EP-020` están bloqueadas, y la que abre la salida también.

---

## Lo que el grafo aportó

Consultado por `sellar|sinSellar|deuda`:

```
tools_patrones_sinsellar        <- la función que decide
tools_tracker_sellar            <- el comando que la publica
```

`sinSellar` vive en `patrones.mjs` y la llaman **dos** sitios —`verify-fdge` y `tracker sellar`—,
así que el arreglo tiene que ir **en ella** y no en el llamador: cambiarlo en uno dejaría al otro
midiendo distinto, que es `SUITE-R38`.

---

## Qué establece, y qué no

**ESTABLECE:** que `idsTag` mide una declaración en vez del árbol; que el trabajo de las 17 está
dentro de `v12.0.0`; que `DONE` fuera de los terminales es correcto y no es el camino; y que el
bloqueo alcanza a las dieciocho tareas del lote.

**NO ESTABLECE:** cuál es el observable correcto. Hay al menos dos —`git cat-file` sobre el
`changes/` de cada tarea, o `git log <tag> -- changes/<dir>`— y elegir es `PHASE 3`.
