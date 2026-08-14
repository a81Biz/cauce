# PT-036 — Estrategia   `PHASE 3`

| Camino | Por qué |
|:---|:---|
| Copiar el intake en el issue | Dos copias del mismo texto divergen. `PT-010` ya lo decidió y sigue teniendo razón |
| Enlazar a un commit fijo | Envejece mal: el contenido cambia durante el trabajo |
| **Enlazar donde el contenido está** | Rama de trabajo mientras vive; rama por defecto al integrarse |

La transición no la hace nadie: el cuerpo se resincroniza en cada `abrir --aplicar`, y `SUITE-R35`
ya obliga a que esa pasada ocurra.

## Y `abrir()` pasa a tener UN final

`cerrarPasada()` — etiquetas, cuerpos y jerarquía. No es refactor de adorno: es que la función
tenía dos salidas y solo una estaba completa, y eso ya ha causado cuatro defectos distintos.
