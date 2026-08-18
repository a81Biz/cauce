# PT-020 — Autorrevisión   `PHASE 6`

Las tres expectativas de `strategy.md` se escribieron **antes** de generar el grafo, para poder
contrastarlas. Aquí está el contraste, medido sobre `graphify-out/graph.json` del 2026-08-15:
**500 nodos · 635 aristas · 14 comunidades**, sobre `bin` + `docs/methodology/tools` (16 archivos).

---

## 1 · «que `patrones.mjs` aparezca como el nodo del que cuelgan las demás»   **SE CUMPLE**

De las **19 aristas entre archivos** del grafo, **17 apuntan a `patrones.mjs`** — y las dos que no
son los falsos positivos de más abajo. Seis de los dieciséis archivos lo importan:

```
build-core.mjs      --imports--> patrones.mjs   (3)
migrate.mjs         --imports--> patrones.mjs   (2)
verify-fdge.mjs     --imports--> patrones.mjs   (4)
verify-patrones.mjs --imports--> patrones.mjs   (3)
verify-suite.mjs    --imports--> patrones.mjs   (3)
version.mjs         --imports--> patrones.mjs   (2)
```

Es el **único** destino de import entre archivos del marco, y todas esas aristas son `EXTRACTED`:
no hay inferencia de por medio. `SUITE-R38` decía que un patrón
crítico vive en un solo sitio; el grafo ahora lo **enseña** en vez de que haya que creerlo.
`selloDe()` aparece además en los god nodes con grado 7 — el único de `patrones.mjs` que llega
ahí, y llega por ser compartido, no por ser grande.

## 2 · «que `verify-fdge` se vea como el mayor»   **NO SE CUMPLE COMO ESTABA ESCRITA**

Por número de nodos, `verify-fdge.mjs` es el **segundo**:

```
62  audit.mjs
60  verify-fdge.mjs
57  verify-suite.mjs
48  tracker.mjs
```

La expectativa estaba mal formulada: **«el mayor» no nombraba una métrica.** Por tamaño no lo es;
por acoplamiento interno sí, y de forma abrumadora — los **cinco** primeros god nodes del
repositorio entero son suyos (`fail()` 19, `ok()` 19, `read()` 17, `checkPT()` 16, `warn()` 13) y
`audit.mjs` no coloca ninguno en el top-10.

Lo que esto significa: `audit.mjs` es más **largo** y `verify-fdge.mjs` está más **entretejido**.
Para «esto es un cambio MAJOR» la métrica útil es la segunda, no la primera. La expectativa
apuntaba a lo correcto con la palabra equivocada.

**No se ajusta el alcance para que salga bonito.** Se deja escrito que la expectativa era
imprecisa y cuál es la medida que sí responde a la pregunta que la motivaba.

## 3 · «que una herramienta que nadie importa se vea aislada»   **SE CUMPLE, Y DICE OTRA COSA**

Se ve. Pero no es una: son **ocho de dieciséis**.

```
con arista entre archivos (8):  patrones · verify-fdge · verify-suite · verify-patrones
                                build-core · migrate · version · cauce
aisladas (8):                   audit · comparar-marco · plan-layout · regla
                                revisar-secretos · tracker · verify-ptsa · verify-qa
```

La expectativa asumía que **aislado ⇒ sobra**. Con la mitad del código aislado, esa inferencia no
se sostiene: son CLIs independientes, y esa es la forma que el marco quiso. Lo que el grafo
detecta no es «la que sobra» sino **cuánto código propio no comparte nada** — y eso, con
`SUITE-R38` delante, es una pregunta abierta, no un hallazgo.

Las 14 comunidades lo confirman: **13 son un archivo cada una.** La única que cruza archivos es
`patrones.mjs` + `verify-patrones` + `version` + `build-core`. El grafo describe bien y, tal como
`PHASE 2` temía, dice poco — porque hay poco que decir.

---

## Lo que el grafo enseñó y no se buscaba

Dos aristas `calls` entre archivos son **falsos positivos**, y hay que decirlo porque quien lea el
grafo sin comprobar concluirá que `verify-fdge` depende de `build-core`:

```
verify-fdge.mjs:927  checkPT()      --calls--> cauce.mjs · divergencia()      INFERRED 0.8
verify-fdge.mjs:1183 checkHistory() --calls--> build-core.mjs · cuerpoDe()    INFERRED 0.8
```

`verify-fdge.mjs` importa **una sola cosa** del marco: `./patrones.mjs`. `divergencia()` y
`cuerpoDe()` son funciones **locales suyas** que comparten nombre con otras. El extractor resuelve
por nombre y no por ámbito.

Están marcadas `INFERRED 0.8`, no `EXTRACTED`, así que el rastro de auditoría funcionó: el grafo
**no afirma** que sean ciertas. Pero un `0.8` se lee como «casi seguro», y no lo es. Queda
declarado aquí en vez de corregido a mano en el JSON: `SUITE-R37` dice que `graphify-out/` es
regenerable, y editarlo a mano haría que la siguiente regeneración borrara la corrección sin
avisar. Se arregla en el extractor o no se arregla.

## Lo que sigue sin verificarse

`test-scenarios.md` ya lo declaraba: **ningún caso comprueba que el grafo sirva.** `E1`–`E4` y los
seis casos nuevos de `selftest.sh` comprueban que el **alcance** cubre lo que dice cubrir y que no
puede volver al de ayer. Que las tres expectativas se contrasten a ojo, y que dos de las tres
resultaran mal formuladas, es el resultado de haberlas escrito antes — no un fallo del método.

`AC` sin cubrir: ninguno. Contradicciones con otras reglas: ninguna; `FDGE-R43` no se toca, lo que
estaba mal era el alcance sobre el que corría.
