# PT-090 — Descubrimiento   `PHASE 2`

## Dos defectos, no uno

`H-005` describía uno: el grafo está en `.gitignore`. Al medirlo aparecen **dos**, y el segundo
no estaba en el hallazgo.

### `A` · El manifiesto guarda el hash **y nadie lo mira**

```
$ node -e "…manifest.json…"
archivos: 17
ejemplo: C:\DevOps\Desarrollos\cauce\bin\cauce.mjs
         -> {"mtime":1787100823.976, "ast_hash":"3cd2ef84…", "semantic_hash":"3cd2ef84…"}
```

Y [patrones.mjs:915](docs/methodology/tools/patrones.mjs):

```js
export function derivaDelGrafo(manifest, mtimeDe) {
  …
    if (Math.abs(actual - Number(d?.mtime ?? 0)) > 1) cambiados.push(ruta);
}
```

**El `ast_hash` está en la misma línea del manifiesto y la función usa `mtime`.** No es que el
dato bueno no existiera: es que se eligió el barato teniéndolo al lado.

Consecuencia medida: `git clone` reescribe los `mtime` con la fecha del clon, así que **los 17
archivos aparecen cambiados** en cualquier clon aunque el contenido sea idéntico. Y al revés —dos
`commit` seguidos sin tocar nada— también los mueve: es lo que puso el grafo en `SUSPECT` dos
veces durante este mismo lote, la última con **6 de 17** por una normalización de `CRLF`.

### `B` · Las rutas del manifiesto son **absolutas**

```
C:\DevOps\Desarrollos\cauce\bin\cauce.mjs
```

Aunque el grafo viajara, el manifiesto sólo sirve en un disco donde el proyecto esté en esa ruta.
**Versionarlo no bastaría**, que es lo que el hallazgo daba por hecho.

## El coste real de la salida «versionar»

```
$ du -sh graphify-out
2.3M
$ ls -la graphify-out/
graph.html   517 901
graph.json   …
cache/       …
```

**2,3 MB, y `graph.html` es medio megabyte de artefacto regenerable.** `SUITE-R37` ya dice que
`graphify-out/` es regenerable, y el `no hacer` del `HANDOFF` prohíbe corregirlo a mano.

Versionar entero significa además un conflicto de merge por cada regeneración, en un archivo que
nadie lee en un diff.

## Lo que este descubrimiento cambia respecto del intake

| | Intake decía | Medido |
|:---|:---|:---|
| El problema | «`graphify-out/` está en `.gitignore`» | **Dos**: el `mtime` en vez del hash, y las rutas absolutas |
| Salida 1 · versionar | «~1 MB en la historia» | **2,3 MB**, medio de ellos `graph.html`, y conflicto por regeneración |
| Salida 2 · hash | «hace el cálculo portable, no el archivo» | **El hash ya está en el manifiesto.** No hay que calcularlo: hay que usarlo |
| Salida 3 · `MISSING` avisa | correcta | y sigue haciendo falta: sin `graphify-out/` no hay nada que comparar |

**Las salidas 2 y 3 juntas resuelven el problema sin mover un archivo**, y la 2 resulta ser casi
gratis. La 1 se descarta con su coste medido, no por intuición.

## Lo que sigue sin resolverse, y hay que decirlo

Con hash y con `MISSING` explícito, **en un clon limpio el grafo sigue sin existir**. La
comprobación pasará de un bloqueo que nadie alcanza a un «no evaluable aquí» — que es honesto,
y no es lo mismo que comprobarlo.

Lo único que cerraría eso es versionar el grafo o generarlo en CI, y las dos cosas son decisiones
de alcance que no toma esta tarea.
