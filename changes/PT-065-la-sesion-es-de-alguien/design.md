# PT-065 — Diseño   `PHASE 4`

## El archivo

```
docs/implementation/SESSION-alberto-martinez.json      con persona resuelta
docs/implementation/SESSION.json                       sin ella · como hoy
```

```json
{ "persona": "Alberto Martínez", "desde": "6c0bc18…", "abierta": "2026-08-18" }
```

`persona` es el **nombre canónico** (`PT-061`); el nombre del archivo usa `normalizaRef`
(`PT-063`), el mismo que las dos ramas del marco.

## Las funciones puras

```js
/** El archivo de sesion de una persona. Sin persona, el de siempre. */
export const archivoSesion = (persona) =>
  (persona ? `SESSION-${normalizaRef(persona)}.json` : 'SESSION.json');

/**
 * Las sesiones AJENAS. AC-06, y no es cosmetico: si cada persona solo viera la suya, las dos
 * creerian que trabajan solas y ninguna entenderia por que las cifras no cuadran.
 *
 * Una marca SIN persona no cuenta como ajena: es la de un proyecto de una persona, y contarla
 * haria que alguien viera una sesion fantasma.
 */
export const sesionesAjenas = (marcas, yo) =>
  (marcas ?? []).filter((m) => m?.persona && m.persona !== yo);
```

## Qué cambia en la acción

```js
// abrir
const yo = personaLocal(...).persona;
writeFileSync(join(IMPL, archivoSesion(yo)), JSON.stringify({ persona: yo, desde, abierta }));

// leer: la PROPIA primero; si no hay, SESSION.json — un proyecto de una persona no cambia nada
const marca = leerJSON(join(IMPL, archivoSesion(yo))) ?? leerJSON(join(IMPL, 'SESSION.json'));
```

Y al mostrar:

```
  sesion desde 6c0bc18 (2026-08-18)
    commits    12 (MEDIDO)
    …

  Otras sesiones abiertas:
    Bruno · desde e4c8cb1 (2026-08-18)
```

## Lo que NO se toca

| Qué | Por qué |
|:---|:---|
| `sesionDe` · `handoffDeSesion` | Son **puras** y reciben la marca; no la leen |
| El filtrado de lo que la sesión deriva | Ya lo hizo `PT-064` |
| `HANDOFF.md` | `AC-04` · su prosa es lo único no derivable |
| `LEX-R26` y `CHECKPOINT.json` | Otro criterio: el checkpoint **es uno** porque responde por la tarea |
| `SESSION.json` como nombre | Sigue valiendo · es el caso de una persona |
