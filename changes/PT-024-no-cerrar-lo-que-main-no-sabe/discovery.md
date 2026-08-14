# PT-024 — Descubrimiento   `PHASE 2` · `FDGE-R42`

## La secuencia que falla

```
1. trabajo: PTs en DONE, issues abiertos          main: DONE, abiertos    ✅
2. merge trabajo → main                            main: DONE, abiertos    ✅
3. trabajo: PTs a INTEGRATED                       main: DONE, abiertos    ✅
4. trabajo: tracker cerrar --aplicar               main: DONE, CERRADOS    ❌
```

El paso 4 cierra issues basándose en un registro que `main` todavía no tiene. Y el paso 3 nunca
llega a `main` por sí solo: llegará con el merge **siguiente**.

## Por qué no es un despiste

Es el orden que el propio marco sugiere: `INTEGRATED` significa «integrado», así que se apunta
después de integrar. Pero lo que se apunta después del merge vive en la rama de trabajo, y la
compuerta corre sobre `main`. **La CI de `main` fallaría tras cada merge**, no solo tras este.

## Dónde está en el código

`tracker.mjs` · `cerrar()`:

```js
const muertas = all.filter((a) => a.issue && !VIVOS.has(a?.status));
```

`all` sale del `REGISTRY.json` **de la rama actual**. No hay ninguna referencia a lo que la rama
por defecto sabe.

## Lo que ya existe y sirve

`REPO` en el adaptador de GitHub ya deriva la rama por defecto, y el repositorio es un clon con
`origin`. Leer el registro de esa rama es `git show origin/<rama>:docs/implementation/REGISTRY.json`
— sin red, sin credenciales y sin cambiar de rama.
