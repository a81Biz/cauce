# `PT-114` — Diseño   `PHASE 4`

## El predicado, en `patrones.mjs`

```js
export const RE_SIN_ENLACE = /sin enlace: no hay ref durable que lo contenga/;

export function cuerpoSinEnlaceConRef(cuerpo, hayRef) {
  if (cuerpo == null || hayRef == null) return null;   // SIN EVALUAR (RULE-06)
  return hayRef === true && RE_SIN_ENLACE.test(String(cuerpo));
}
```

**Puro y probable.** No lee la plataforma ni el árbol: recibe el cuerpo y el veredicto sobre la
ref. Así su inversa se escribe sin fabricar un tablero.

**`RE_SIN_ENLACE` se exporta** porque es el literal que `cuerpoDeIssue` escribe. Dos copias del
mismo literal —una que lo escribe y otra que lo busca— divergirían; con una sola constante, si
alguien cambia el texto del cuerpo, el caso lo caza.

## Dónde se usa

`tracker espejo`, junto a las demás divergencias de `SUITE-R35`. Recorre las **vivas con issue**,
lee el cuerpo publicado, y contrasta con `refDurableDe(a)`.

**Falla, no avisa.** Un cuerpo ilegible impide leer el intake, sin intake no hay firma, y sin firma
no hay `G1`. No es una molestia: es una compuerta que no puede pasar.

## Lo que NO cambia

- **La decisión de `PT-096`.** Sin ref durable se sigue publicando la ruta sin enlace y diciendo
  por qué. Lo que se detecta es el caso contrario: **ya hay ref y el cuerpo sigue mudo**.
- **`abrir --aplicar` sigue siendo quien repara.** El espejo informa.
- **`verify-fdge` no se toca.** Sin credencial en CI no puede ver esto (`PT-120`).
