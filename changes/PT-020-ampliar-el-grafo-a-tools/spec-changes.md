# PT-020 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `REGISTRY.json` · `graph` | `scope` pasa a incluir `docs/methodology/tools`; `pt_at_generation` al último integrado |
| `tools/selftest.sh` | El caso que impide volver al alcance viejo |

**Ninguna regla nueva ni modificada.** `FND-R28` ya dice qué cubre el grafo y `FDGE-R43` ya usa su
frescura. Lo que estaba mal era el **alcance sobre el que corrían**, no ellas.

**Compatibilidad:** `PATCH`. El lote sube `MAJOR` por `PT-016`.
