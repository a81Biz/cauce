# Diseño — `PT-102`

## El patrón, en su sitio

`docs/methodology/tools/patrones.mjs` · `PATRONES.VERSION_DECLARADA`

```
^([>\s]*(?:Suite version:\s*\*\*|suite_version:\s*))(\d+\.\d+\.\d+)(\*\*)?
```

Tres decisiones, y cada una tiene su caso:

| Parte | Por qué | Lo prueba |
|:---|:---|:---|
| `^` | la prosa de un documento que se recorre no se toca | `S-2` |
| `[>\s]*` | el documento que viaja declara la versión dentro de una cita | `S-4` |
| `\d+\.\d+\.\d+` | el marcador `X.Y.Z` de una plantilla no es una versión | `S-3` |
| la alternancia | las dos formas son legítimas y distintas | `S-1` |
| `(\*\*)?` opcional | la forma `yaml` no lleva cierre | — |

El grupo `3` opcional es lo que permite **una sola línea de reemplazo para las dos formas**: un
grupo que no participa se reemplaza por cadena vacía.

## El recorrido

`version.mjs` caminaba `docs/methodology/`. Ahora también el `CLAUDE.md` del proyecto, que vive
dos niveles por encima — con el precedente que ya existía en el mismo archivo: `package.json`
se alcanza desde ese mismo nivel.

```
BASE = docs/methodology/
  ├── *.md            recorridos, menos CHANGELOG.md (es la fuente)
  └── ../../
        ├── package.json     ya se alcanzaba
        └── CLAUDE.md        AHORA
```

## Lo que NO se hizo

**No se unifican las dos formas.** Son distintas a propósito: una es prosa de encabezado, la
otra un campo parametrizable. Unificarlas obligaría a reescribir el `CLAUDE.md` de todo
proyecto ya instalado, y ninguna de las dos está mal.

**No se avisa en vez de alinear.** La herramienta existe para alinear; avisar es lo que ya hacía
mal.
