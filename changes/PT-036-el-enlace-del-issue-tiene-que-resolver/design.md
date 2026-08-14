# PT-036 — Diseño   `PHASE 4` · `FDGE-R21`

```js
const viva = VIVOS.has(a?.status);
const ramaDelEnlace = (viva && ramaTrabajo) ? ramaTrabajo : (rama ?? 'main');
```

| Estado | Enlaza a | Por qué |
|:---|:---|:---|
| vivo, rama conocida | rama de trabajo | ahí está el contenido |
| `INTEGRATED` | rama por defecto | ahí se queda |
| rama desconocida | rama por defecto | no se inventa un nombre (`RULE-06`) |

`RAMA_TRABAJO` sale de `git rev-parse --abbrev-ref HEAD`; `HEAD` desprendido cuenta como
desconocida.

Y `abrir()` termina siempre en `cerrarPasada()`.
