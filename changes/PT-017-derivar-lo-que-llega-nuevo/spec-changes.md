# PT-017 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `tools/migrate.mjs` | La lista de «qué llega nuevo» se **deriva**; ya no es una constante |
| `tools/selftest.sh` | Los casos, incluidos los que **no** deben emitir fila |

**Ninguna regla nueva ni modificada.** `RULE-01` ya prohíbe el hecho copiado y `RULE-06` ya obliga
a decir lo que no se puede saber. Lo que faltaba era cumplirlas aquí.

**Compatibilidad:** `PATCH` por sí sola. El lote sube `MAJOR` por `PT-016`.
