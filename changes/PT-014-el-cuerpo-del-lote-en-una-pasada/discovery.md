# PT-014 — Descubrimiento   `PHASE 2` · `FDGE-R42`

## Dónde está

`docs/methodology/tools/tracker.mjs` · `abrir()`, el bucle que crea los issues que faltan.

```js
for (const a of pendientes) {
  const cuerpo = cuerpoDeIssue(a, contextoCuerpo(a));
  const n = adaptador.crear(...);
  a.issue = n;
}
```

`pendientes` sale de `vivas.filter((a) => !a.issue)`, que conserva **el orden del registro**. Y
en el registro un lote va antes que sus tareas, porque se abre antes.

## La dependencia va en un solo sentido

Esto es lo que hace que el defecto tenga arreglo trivial y no lo pareciera:

| Quién | A quién cita | Cómo |
|:---|:---|:---|
| El cuerpo de un `EP` | a sus tareas | **por número de issue** — `- \`PT-011\` · #18 — …` |
| El cuerpo de un `PT` | a su lote | **por identificador** — `de la implementación \`EP-004\`` |

Un `PT` no necesita saber el número de su lote. **No hay ciclo**, así que un orden basta.

## Por qué no se vio antes

`sincronizarCuerpos()` existe y arregla esto — pero solo corre en la rama de `abrir()` en la que
**no hay nada que abrir**. En la pasada que crea, la función retorna antes de llegar. Por eso
una segunda ejecución del mismo comando lo dejaba bien: la segunda vez ya no había pendientes.

Es decir: el arreglo ya estaba escrito y **no se alcanzaba**. Eso es peor que no tenerlo, porque
al leer el código parece cubierto.

## Alcance real

Solo `abrir()`. `espejo`, `cerrar`, `notas`, `pr`, `estado` y `pendiente` no crean issues.
