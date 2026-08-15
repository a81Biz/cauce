# PT-015 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `RULES.md` · `SUITE-R26` | **Ampliada**: se declara qué significa «aspira» — las `CHECK` la cumplen todas, y de las `HARD` se cubren las que un gate consulta o por las que una herramienta bloquea. El resto queda **medido** por `regla --sin-comprobar` |
| `CORE.md` | Regenerado |
| `tools/verify-patrones.mjs` | Emite `SUITE-R38` |
| `tools/revisar-secretos.mjs` | Emite `FND-R29` |
| `tools/tracker.mjs` | Emite `SUITE-R47` donde el espejo decide |
| `tools/verify-fdge.mjs` | Comprueba `FDGE-R39` |
| `tools/selftest.sh` | Los casos |

**No cambia:** cuándo bloquea ninguna de las tres herramientas, ni sus códigos de salida. Cambia
que el fallo lleve a la regla (`SUITE-R53`).

**Compatibilidad:** `MINOR` por sí sola. El lote sube `MAJOR` por `PT-016`.
