# PT-016 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | `ESTADOS_TERMINALES` una vez, con su contrato | las tres copias | constante exportada | `verify-patrones` | `tools/patrones.mjs` | pendiente |
| T2 | `FDGE-R52` y `FDGE-R19` la usan | T1 | dos copias menos | selftest | `tools/verify-fdge.mjs` | pendiente |
| T3 | Un `PT` vivo sin `phase` **falla** | `faseDeclarada` | error | selftest | `tools/verify-fdge.mjs` | pendiente |
| T4 | Un `EP` y lo terminado siguen exentos | idem | aviso | selftest | `tools/verify-fdge.mjs` | pendiente |
| T5 | `SUITE-R08` lo declara | — | regla ampliada | `verify-suite` | `RULES.md` | pendiente |
| T6 | Sus citas | T5 | dos citas | `verify-suite` | `PHASES.md` · `FDGE-Prompts.md` | pendiente |
| T7 | Las plantillas de tarea traen `phase`; la del lote **no** | — | 4 plantillas | selftest | `INTAKE/templates/` | pendiente |
| T8 | La migración dice que ahora falla | `migrate.mjs` | texto | selftest | `tools/migrate.mjs` | pendiente |
| T9 | Los casos | `test-scenarios.md` | casos nuevos | `selftest.sh` verde | `tools/selftest.sh` | pendiente |
| T10 | Regenerar el núcleo | `RULES` · `PHASES` | `CORE.md` | `build-core --check` | `CORE.md` | pendiente |

**Archivos tocados:**

```
docs/methodology/tools/patrones.mjs · verify-fdge.mjs · migrate.mjs · selftest.sh
docs/methodology/RULES.md · PHASES.md · FDGE-Prompts.md · CORE.md
docs/methodology/INTAKE/templates/
```

Solapamiento con `PT-015` (`RULES.md`, `verify-fdge.mjs`) y `PT-017` (`migrate.mjs`):
**serializados**, y esta va antes de las dos.
