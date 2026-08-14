# PT-028 — Estrategia   `PHASE 3`

Reclamar desde **todas** las allocations, no solo las vivas, y distinguir tres casos en vez de
dos:

| Quién reclama el issue | Qué es |
|:---|:---|
| una allocation viva | normal |
| una allocation terminal | **cierre pendiente** — se informa, no bloquea |
| nadie | huérfano — trabajo fuera del registro, **bloquea** |

Lo que no se toca: la dirección huérfana. Es la que caza trabajo que el registro no conoce, y
relajarla para arreglar esto habría cambiado un choque de reglas por un agujero.
