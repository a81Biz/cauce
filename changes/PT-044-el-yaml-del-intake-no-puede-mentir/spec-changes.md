# PT-044 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `RULES.md` | **`SUITE-R35` ampliada**: el registro asigna y espejan **todos** los artefactos que copian su estado —la plataforma, el YAML del intake y la línea de índice—, no solo la plataforma |
| `PHASES.md` · `FDGE-Prompts.md` | La citan (`SUITE-R20`) |
| `CORE.md` | Regenerado |
| `tools/verify-fdge.mjs` | La comprobación en las tres direcciones |
| `tools/selftest.sh` | Los casos, incluidos los que **no** deben avisar |
| `CHANGELOG.md` | Lo resuelve el cierre de `EP-012` (`SUITE-R45`), no esta tarea |

**No cambia:** la precedencia de `PT-004` —el YAML sigue mandando—, ni `FDGE-R31`, que sigue
comprobando que el estado sea canónico: se le **añade** la comparación, no se le sustituye.

**Compatibilidad:** `MINOR`. Lo nuevo es un aviso; solo bloquea en `G4`, que es donde el estado
tiene que ser uno solo.
