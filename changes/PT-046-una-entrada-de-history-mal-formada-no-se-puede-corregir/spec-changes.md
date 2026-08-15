# PT-046 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `LEXICON.md` | **`CORRIGE`** entra como encabezado canónico de `HISTORY.log`, junto a `REVERTIDO` (`LEX-R10`) |
| `RULES.md` | **`FDGE-R29` ampliada**: admite las entradas de corrección, con las tres condiciones que las hacen seguras |
| `PHASES.md` · `FDGE-Prompts.md` | La citan (`SUITE-R20`) |
| `FDGE-Implementation.md` | El formato del bloque `CORRIGE`, donde ya vive el formato canónico de `HISTORY.log` |
| `CORE.md` | Regenerado |
| `tools/verify-fdge.mjs` | Descuenta las correcciones y prefiere la última; una huérfana falla |
| `tools/selftest.sh` | Los casos, incluidos los dos que deben **fallar** |
| `CHANGELOG.md` | Lo resuelve el cierre de `EP-012` (`SUITE-R45`), no esta tarea |

**No cambia:** `SUITE-R09` —esto **es** su mecanismo, no una excepción a ella—,
`EXECUTION-MODES.md` —ninguna compuerta— ni `FDGE-R34`, que sigue exigiendo `Estado:`.

**Compatibilidad:** `MINOR`. `FDGE-R29` se amplía; nada que pasara antes falla ahora, y ningún
proyecto instalado tiene que rehacer un artefacto.
