# PT-068 — Diseño   `PHASE 4`

## 1 · `marcaDe`, en `patrones.mjs`

Va ahí y no en `tracker` porque **dos lecturas del mismo hecho divergen** (`SUITE-R38`) — que es
literalmente el defecto que esta tarea arregla.

```js
/**
 * PT-068 · De quien es la marca de sesion que se va a leer.
 *
 * PT-065 movio la ESCRITURA a SESSION-<persona>.json y dejo dos lecturas apuntando al viejo
 * SESSION.json. Resultado: una identidad no declarada heredaba 32 commits y 13 194 lineas
 * ajenas, etiquetadas MEDIDO.
 *
 * El respaldo NO se quita: AC-05 de PT-065 exige que un proyecto de una sola persona no cambie,
 * y los anteriores a la 8.3.0 solo tienen SESSION.json. Lo que se distingue es de QUIEN es.
 */
export function marcaDe(persona, leer) {
  const propia = leer(archivoSesion(persona));
  if (propia) return propia;
  const vieja = leer('SESSION.json');
  if (!vieja) return null;
  // Sin «persona» es de un proyecto de una sola persona: es mia.
  if (!vieja.persona) return vieja;
  // Con OTRA persona no es mia. Heredarla seria presentar trabajo ajeno como propio.
  return normalizaRef(vieja.persona) === normalizaRef(persona ?? '') ? vieja : null;
}
```

## 2 · Las dos lecturas la usan

```js
// tracker.mjs:1359  viabilidad()
- const marcaSesion = leerJSON(join(IMPL, 'SESSION.json'));
+ const marcaSesion = marcaDe(yo, (f) => leerJSON(join(IMPL, f)));

// tracker.mjs:1485  sesion()
- const marca = leerJSON(F_SESION()) ?? leerJSON(join(IMPL, 'SESSION.json'));
+ const marca = marcaDe(yoSoy(), (f) => leerJSON(join(IMPL, f)));
```

## 3 · Una persona, una sesión

```js
// marcasDeSesion(): deduplicar por nombre canonico, quedandose con el archivo PROPIO.
// Con SESSION.json declarando a Alberto y SESSION-alberto-martinez.json tambien, Alberto salia
// DOS veces en «Otras sesiones abiertas»: una sesion fantasma.
const porPersona = new Map();
for (const m of marcas) {
  const k = normalizaRef(m?.persona ?? '');
  if (!porPersona.has(k) || m.__propia) porPersona.set(k, m);
}
```

## 4 · Los mensajes dejan de mentir

```js
- notas.push(`SESSION.json escrito: desde ${...}`);
+ notas.push(`${basename(F_SESION())} escrito: desde ${...}`);

- di('  Apilado en SESSION_LOG.md. SESSION.json NO se borra: la sesion siguiente lo sobrescribe.');
+ di(`  Apilado en SESSION_LOG.md. ${basename(F_SESION())} NO se borra: al abrir la siguiente`);
+ di('  se sobrescribe. El SESSION.json antiguo, si lo hay, ya no se escribe (PT-068).');
```

El segundo era **falso** desde `PT-065`: nadie sobrescribe `SESSION.json`.

## Lo que NO cambia

| Pieza | Por qué |
|:---|:---|
| `sesionDe` y `handoffDeSesion` | Son puras y reciben la marca. `PT-065` las dejó bien |
| El respaldo a `SESSION.json` | `AC-05`. Sigue valiendo cuando no declara otra persona |
| El `SESSION.json` de este repositorio | No se borra: `PT-065` lo declaró fuera de alcance |
| `archivoSesion()` | Correcta |
