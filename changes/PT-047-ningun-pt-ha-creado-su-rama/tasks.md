# PT-047 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | La topología, escrita donde manda | decisión del firmante | `FDGE-R19` ampliada | `verify-suite` | `RULES.md` | pendiente |
| T2 | `SUITE-R42` dice **para qué rama** | `SUITE-R42` | regla sin ambigüedad | `verify-suite` | `RULES.md` | pendiente |
| T3 | Sus citas | — | dos citas | `verify-suite` | `PHASES.md` · `FDGE-Prompts.md` | pendiente |
| T4 | Un PT vivo en `PHASE 5+` sin rama se reporta | `alloc.branch` | aviso, error en `G4` | selftest | `tools/verify-fdge.mjs` | pendiente |
| T5 | Lo ya terminado no se retrofecha | idem | silencio | selftest | `tools/verify-fdge.mjs` | pendiente |
| T6 | Los casos | `test-scenarios.md` | casos nuevos | `selftest.sh` verde | `tools/selftest.sh` | pendiente |
| T7 | El `CLAUDE.md` deja de contradecir a `PHASE 5` | topología | tabla de ramas | selftest | `CLAUDE.md` | pendiente |
| T8 | Esta tarea **estrena su propia rama** | — | `fix/PT-047-…` | `git branch` | — | pendiente |
| T9 | Regenerar el núcleo | `RULES` · `PHASES` | `CORE.md` | `build-core --check` | `CORE.md` | pendiente |

**Archivos tocados:**

```
docs/methodology/RULES.md · PHASES.md · FDGE-Prompts.md · CORE.md
docs/methodology/tools/verify-fdge.mjs · tools/selftest.sh
CLAUDE.md · docs/implementation/REGISTRY.json
```

Solapamiento con las otras siete de `EP-013`: `RULES.md` con `PT-016`, `PT-015` y `PT-029`;
`verify-fdge.mjs` con `PT-016` y `PT-015`. **Serializados**, y esta va primera.
