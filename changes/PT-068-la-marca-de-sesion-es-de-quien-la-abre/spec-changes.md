# PT-068 — Cambios de especificación   `PHASE 4`

`FDGE-R22`.

| Qué | Antes | Después |
|:---|:---|:---|
| De quién es la marca leída | `SESSION-<persona>.json`, o `SESSION.json` **sea de quien sea** | el respaldo vale sólo si **no declara otra persona** |
| `viabilidad` | leía `SESSION.json` siempre | usa la misma función que `sesion` |
| «Otras sesiones abiertas» | una persona podía salir dos veces | deduplicada por nombre canónico |
| El mensaje de `sesion abrir` | decía `SESSION.json` | nombra el archivo que escribe |
| El de `sesion cerrar` | afirmaba que la siguiente lo sobrescribe — **falso** desde `PT-065` | dice lo que ocurre |

**Ninguna regla nueva.** `CHANGELOG`: `PATCH`. La versión la fija `EP-017`.

**Migración:** ninguna. Un proyecto cuyo único archivo sea `SESSION.json` sin `persona` sigue
igual; uno con `persona` empieza a distinguir, que es el arreglo.
