# Descubrimiento — `PT-108`

## Dónde está

```
version.mjs   camina docs/methodology/*.md + CLAUDE.md + package.json
              NO mira docs/implementation/REGISTRY.json

REGISTRY.json:2   "suite_version": "11.0.0"
verify-fdge       SUITE-R17 · modo restringido
```

## Las tres formas, ahora conocidas

| Forma | Dónde | Desde |
|:---|:---|:---|
| `Suite version: **X.Y.Z**` | 21 documentos de la metodología | siempre |
| `suite_version: X.Y.Z` | `CLAUDE.md`, `MANUAL`, `README`, la plantilla | `PT-102` |
| `"suite_version": "X.Y.Z"` | `REGISTRY.json` | **esta tarea** |

## Por qué apareció ahora y no antes

**El sello es la única operación que toca todas las declaraciones a la vez.** Mientras la versión
no sube, nadie compara: cada declaración es correcta por separado.

## Lo que este descubrimiento NO establece

- **Si hay una cuarta forma.** Se conocen tres.
