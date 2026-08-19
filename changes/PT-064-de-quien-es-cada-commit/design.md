# PT-064 — Diseño   `PHASE 4`

## Lo que cambia en las tres derivaciones

```js
// Antes: git log --format=%H %s
// Ahora: git log --format=%H%x1e%an%x1e%ae%x1e%s   ->  el autor viaja con el commit
//
// El separador es un caracter que no aparece en nombres ni en asuntos. NO se usa un espacio,
// como en PT-057: alli el SHA no lleva espacios y bastaba; aqui un nombre SI los lleva.
```

Y cada commit pasa por `personaDe` (`PT-061`):

```js
const quien = personaDe({ nombre, correo }, reg.personas ?? []).persona;   // null si no declarado
```

## Las funciones puras

```js
/**
 * Filtra por persona, pero SOLO si hay a quien filtrar.
 *
 * Con `persona` null devuelve todo: es el caso de un proyecto sin «personas» declaradas, y es lo
 * que hace que esta tarea no rompa nada (AC-05).
 */
export const soloDe = (items, persona) =>
  (persona ? (items ?? []).filter((x) => x?.persona === persona) : (items ?? []));

/** Cuantos quedaron fuera por no tener persona declarada. Se DICE, no se resta en silencio. */
export const sinPersona = (items) => (items ?? []).filter((x) => !x?.persona).length;
```

## Dónde se filtra, y dónde no

```
precedente   SIEMPRE por la persona local     decide «¿puedo YO, ahora?»
techo        SIEMPRE por la persona local     decide «¿cabria esto ALGUNA vez?»
coste        a peticion: --mio | --de NOMBRE  responde «¿cuanto suele costar esto?»
```

La asimetría es deliberada. Las dos primeras comparan **contra mí**; comparar contra el trabajo de
otro es comparar contra nada. La tercera es una referencia de un **tipo de tarea**, y ahí más casos
es mejor referencia — `PHASE 2` lo midió: partir 17 cerradas entre dos personas dejaría los grupos
por debajo de `MINIMO_REFERENCIA`.

## La salida dice siempre de quién es

```
$ tracker coste CHORE STANDARD

  CHORE/STANDARD · 17 tareas cerradas · de TODAS las personas
    …

$ tracker coste CHORE STANDARD --mio

  CHORE/STANDARD · 17 tareas cerradas · solo de Alberto Martínez
    …
```

**Sin filtro también lo dice.** Lo peligroso no es dar una cifra u otra: es no saber cuál te están
dando.

## Y los no declarados se cuentan

```
  3 commits de autores sin declarar no se han repartido (SIN EVALUAR).
  → tracker personas los enumera. No se adjudican por parecido (LEXICON 6.5f).
```

`AC-04`. La ausencia se **ve**, en vez de restar en silencio.

## Lo que NO se construye

| Qué | Por qué |
|:---|:---|
| Tocar `costeDe` o `viabilidadDe` | `PT-057` y `PT-059` decidieron **cómo**; esto cambia **de dónde** |
| Comparar personas entre sí | Sirve para que el marco no decida mal, no para medir a nadie |
| Adjudicar por parecido | `PT-061` · convierte una duda en un dato |
| Un grupo mínimo distinto por persona | `MINIMO_REFERENCIA` ya devuelve `SIN REFERENCIA` |
