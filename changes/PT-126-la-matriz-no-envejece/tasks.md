# Tareas — `PT-126`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | La medición de la matriz dentro de `sellar`, con sus tres desenlaces | `tools/tracker.mjs` | ✔ |
| 2 | El umbral y su motivo, en el registro | `REGISTRY.tracker` | ✔ |
| 3 | El caso peor —regla que no puede fallar— con frase propia | `tools/tracker.mjs` | ✔ |
| 4 | El aviso de `LEX-R31` en `verify-fdge`: avisa, no falla | `tools/verify-fdge.mjs` | ✔ |
| 5 | `FPGE` recolecta desde `MATRIZ.md`, sin repetir el umbral | `FPGE-Implementation.md` | ✔ |
| 6 | Los diecisiete casos | `tools/selftest.sh` | ✔ |

---

## Los dos defectos que aparecieron construyéndolo

**1 · `rige` no estaba en ámbito.** El aviso de `LEX-R31` usaba `rige(...)`, que no existe en esa
función: `ReferenceError`, y `verify-fdge` entero reventaba. Es la misma familia que ya me pasó en
este archivo, y la corrección es la misma: `rigeGlobal` — que además es lo **correcto** aquí,
porque la clase la exige la suite desde la `13.0.0`, no cada tarea desde su propia versión.

**2 · Los casos colgaban la batería contra GitHub.** La primera versión llamaba a `sellar` sobre
el **repositorio real**, y `sellar` termina consultando la plataforma: el bloque estuvo más de
tres minutos sin imprimir una sola línea. **Un arnés que depende de la red no es un arnés**:
daría rojo el día que GitHub esté lento, y ese rojo no diría nada sobre el marco.

Rehechos sobre el proyecto de mentira, con una `MATRIZ.md` **sintética** escrita en el propio
caso. Si usara la real, los casos caducarían en cuanto la matriz cambiara — `CE-010` cometido en
el arnés que la publica.
