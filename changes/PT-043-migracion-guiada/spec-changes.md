# PT-043 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `RULES.md` | **`SUITE-R55` nueva**, HARD. Las decisiones humanas de una migración se conducen, no se enumeran |
| `PHASES.md` | La cita en el bloque de plataforma y procedimiento (`SUITE-R20`) |
| `FDGE-Prompts.md` | La cita en su expansión legible (`SUITE-R20`) |
| `CORE.md` | Regenerado: la regla llega al núcleo que carga el agente |
| `tools/migrate.mjs` | El conductor, y las dos correcciones `D1` y `D2` |
| `tools/selftest.sh` | Los casos que la ejecutan contra la salida real |
| `CHANGELOG.md` | **`7.6.0`** — lo resuelve el cierre de `EP-011` (`SUITE-R45`), no esta tarea |

**No cambia:** `LEXICON.md` —ningún nombre nuevo—, `EXECUTION-MODES.md` —ninguna compuerta— ni
`INSTALL.md` —la instalación ya conducía; es de donde sale el patrón—.

**No hay cambio de contrato público:** `migrate` conserva su interfaz (`[--apply] [ruta]`) y sus
tres códigos de salida (`0` nada pendiente · `1` pendientes o verificación fallida · `2` error).
