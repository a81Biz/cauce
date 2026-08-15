# PT-045 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `MANUAL.md` | §4 declara las **dos** formas de arrancar, con la condición de cada una |
| `CASOS-DE-USO.md` | `A5` igual, y se añade el caso «estoy dentro del repositorio de cauce» |
| `bin/cauce.mjs` | Un subcomando desconocido dice cuál, la versión que corre y la salida |
| `package.json` | `npm start` |
| `tools/selftest.sh` | Los casos |

**Ninguna regla nueva ni modificada.** `SUITE-R50` ya dice lo que hace falta; lo que fallaba era
que su comando no arrancaba y no lo decía. Una regla nueva aquí sería tapar con texto un defecto
de ejecución.

**Compatibilidad:** `PATCH` en lo que a reglas respecta. Los códigos de salida no cambian.
