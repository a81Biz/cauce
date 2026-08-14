# PT-046 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | `CORRIGE` como encabezado canónico | — | entrada de vocabulario | `verify-suite` sin errores | `LEXICON.md` | pendiente |
| T2 | `FDGE-R29` admite la entrada de corrección | `SUITE-R09` | regla ampliada | `verify-suite` sin errores | `RULES.md` | pendiente |
| T3 | Su cita en el procedimiento | `FDGE-R29` | dos citas | `verify-suite` sin errores | `PHASES.md` · `FDGE-Prompts.md` | pendiente |
| T4 | El formato, en el documento que lo declara | `design.md` | bloque canónico | lectura | `FDGE-Implementation.md` | pendiente |
| T5 | Descontar y preferir la última corrección | `verify-fdge.mjs:1075-1130` | comprobación nueva | selftest | `tools/verify-fdge.mjs` | pendiente |
| T6 | Una `CORRIGE` huérfana falla | idem | comprobación nueva | selftest | `tools/verify-fdge.mjs` | pendiente |
| T7 | Los casos, incluidos los que deben fallar | `test-scenarios.md` | casos nuevos | `selftest.sh` en verde | `tools/selftest.sh` | pendiente |
| T8 | Las cuatro correcciones reales | `HISTORY.log` | 4 entradas `CORRIGE` | `--gate G4` en los cuatro | `docs/implementation/HISTORY.log` | pendiente |
| T9 | Regenerar el núcleo | `RULES` · `LEXICON` · `PHASES` | `CORE.md` | `build-core --check` | `CORE.md` | pendiente |

**Archivos tocados** (`FDGE-R20`, y es lo que hace computable el solapamiento del lote):

```
docs/methodology/LEXICON.md · RULES.md · PHASES.md · FDGE-Prompts.md
docs/methodology/FDGE-Implementation.md · CORE.md
docs/methodology/tools/verify-fdge.mjs · tools/selftest.sh
docs/implementation/HISTORY.log
```

Solapamiento con `PT-044`: `tools/verify-fdge.mjs` y `tools/selftest.sh`. **Serializados**, y
esta va primero porque `PT-044` no tiene solución honesta sin ella.
