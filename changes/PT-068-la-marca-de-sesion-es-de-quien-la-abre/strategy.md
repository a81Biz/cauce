# PT-068 — Estrategia   `PHASE 3`

## Opciones

| # | Opción | Por qué no / por qué sí |
|:--|:---|:---|
| A | Quitar el respaldo a `SESSION.json` | **No.** Rompe `AC-05` de `PT-065`: los proyectos anteriores a la `8.3.0` tienen ese archivo como único, y se quedarían sin sesión |
| B | Borrar el `SESSION.json` huérfano de este repositorio | **No, y no es lo mismo.** Arregla un repositorio y deja el defecto en el paquete. Además `PT-065` declaró fuera de alcance borrar marcas de sesión: hacerlo sería decidir por otro |
| C | El respaldo vale **sólo si no declara otra persona** | **Sí.** Conserva el caso de una sola persona y cierra el de la identidad ajena |
| D | Que `viabilidad` use la misma función que `sesion` | **Sí, y es obligatorio.** Dos lecturas del mismo hecho divergen (`SUITE-R38`) |

**Elegidas: C y D.**

## La regla, escrita entera

```
marcaDe(persona):
    propia = SESSION-<persona>.json
    si existe propia            -> propia
    si SESSION.json NO declara persona  -> SESSION.json    (proyecto de una sola persona)
    si SESSION.json declara OTRA persona -> null            (no hay sesion mia, y se DICE)
```

El tercer caso es el arreglo. Los otros dos son lo que ya funcionaba y no puede romperse.

**`null` no es un fallo.** `sesionDe(null)` ya responde «no se abrió una sesión» y dice que el
día no es la sesión. Esa rama existe desde `PT-060` y tiene casos: aquí sólo se llega a ella
cuando corresponde.

## Y una persona no puede aparecer dos veces

`marcasDeSesion()` lee **todos** los `SESSION*.json`. Con `SESSION.json` declarando a Alberto y
`SESSION-alberto-martinez.json` también, Alberto sale dos veces en «Otras sesiones abiertas» —
una sesión fantasma, que es justo lo que el `HANDOFF` avisa de no crear.

Se deduplica por **nombre canónico**, quedándose con el archivo propio: es el que se escribe.

## El riesgo

**Romper el proyecto de una sola persona**, que es el caso mayoritario y el que `PT-065` protegió
con `AC-05`. Se contiene con casos explícitos para las tres ramas de `marcaDe`, y con la inversa:
revertido el arreglo, el caso de la identidad ajena vuelve a heredar trabajo.

## Alcance

```
docs/methodology/tools/patrones.mjs   marcaDe(): la regla, en un solo sitio
docs/methodology/tools/tracker.mjs    sesion() y viabilidad() la usan · los dos mensajes
docs/methodology/tools/selftest.sh    las tres ramas, la deduplicacion y la inversa
```

Ninguna regla nueva. `CHANGELOG`: `PATCH`.
