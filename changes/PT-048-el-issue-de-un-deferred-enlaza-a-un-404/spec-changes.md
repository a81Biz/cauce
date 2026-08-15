# PT-048 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `tools/tracker.mjs` | El cuerpo del issue no enlaza a un directorio que no existe: dice qué hay |
| `tools/selftest.sh` | Los casos, incluidos los dos que **no** deben cambiar |

**Ninguna regla nueva ni modificada.** `SUITE-R44` ya dice que un `DEFERRED` está exento de tener
artefactos, y `PT-036` ya dice que el enlace apunta a donde el contenido está. Lo que faltaba era
el caso en que **no hay contenido** — y eso es un defecto de implementación, no un hueco de
la norma. Escribir una regla para taparlo sería el error que `PT-045` ya rechazó.

**Compatibilidad:** `PATCH` por sí sola. El lote sube `MAJOR` por `PT-016`.
