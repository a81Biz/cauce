# PT-070 — Descubrimiento   `PHASE 2`

## El defecto, en una línea

[plan-layout.mjs:59](docs/methodology/tools/plan-layout.mjs#L59):

```js
const FUERA_DEL_GRAFO = /(^|\/)(node_modules|…|out|docs)(\/|$)/;
```

**`docs` estaba en la exclusión general.** Correcto para documentación; falso para código. Y en
cauce las 16 herramientas viven en `docs/methodology/tools/` —viajan dentro del paquete y ahí está
su sitio, declarado como desviación consciente en `11-Conventions`—.

```
plan-layout devolvia   alcance: bin           1 archivo
el registro decia      bin, docs/methodology/tools
```

El registro acertaba **porque `PT-020` lo escribió a mano**. Cualquier instalación nueva nacía con
el defecto, y `FDGE-R43` evaluaba la frescura de un grafo cuyo alcance ya era falso.

## Tres cosas que sólo aparecieron ejecutando

**1 · El alcance salía del primer segmento.** Al dejar de excluir `docs`, el alcance pasó a `bin
docs` — y `docs` arrastra toda la documentación. Hay que bajar hasta el directorio que **contiene
el código**, no quedarse en el primer nivel.

**2 · Entraron dos directorios de evidencia.** `docs/implementation/evidence/PT-023` y `PT-029`
guardan `.mjs` que son **salidas de una tarea**, no el sistema. `FND-R28` ya los excluye por
concepto —fixtures—; lo que faltaba era nombrarlos, porque hasta ahora vivían bajo el `docs/` que
se excluía entero y nadie los había visto.

**3 · Y en el legado real, `docs/_archive/2026-08-06`.** Historia guardada, misma categoría.

## El que casi se me escapa

Probado en el proyecto de `PT-072`, el alcance salió **`docs/methodology/tools src`**: habría
metido **las 16 herramientas del marco instalado** en el grafo de un proyecto ajeno.

`docs/methodology/` es **la suite instalada**, y en cualquier proyecto que no sea cauce es marco
de terceros — `FND-R28` lo deja fuera igual que `node_modules`. En cauce es código propio porque
`SUITE-R41` lo aloja a sí mismo.

La identidad se comprueba **como la comprueba el instalador**: por el `name` del `package.json`.

## Conclusión

El alcance se **deriva** ahora, y coincide **exactamente** con lo que `PT-020` había escrito a
mano — que es la prueba de que la derivación acertó, no una coincidencia afortunada.

| Proyecto | Alcance derivado |
|:---|:---|
| cauce | `bin docs/methodology/tools` |
| el proyecto nuevo de `PT-072` | `src` |
| el legado real | `apps/… packages/core/src/… tools` |

Los tres correctos, y el legado sin tocarlo: `0` cambios.
