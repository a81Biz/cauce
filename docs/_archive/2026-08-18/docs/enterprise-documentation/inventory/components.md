# inventory/components — los documentos del marco

> Foundation `PHASE 5` · 2026-08-13. No hay componentes de interfaz: los «componentes» de este
> sistema son los 34 documentos que se publican. Su papel lo fija `LEX-R21`.

## Por papel

| Papel | Documentos | Puede mandar |
|:---|:---|:---|
| **Autoridad** | `LEXICON.md` · `RULES.md` · `EXECUTION-MODES.md` | Sí. En conflicto, en ese orden |
| **Núcleo generado** | `CORE.md` · `CORE-PTSA.md` | Sí, pero **no se editan**: son compilados (`SUITE-R16`) |
| **Procedimiento** | `PHASES.md` · `INSTALL.md` · los `*-Implementation.md` | Sí, subordinados a la autoridad |
| **Prompts** | `FDGE-Prompts` · `Foundation-Prompts` · `FPGE-Prompts` · `QA-Prompts` · `PTSA-Prompts` | Dan el texto copiable |
| **Explicación** | `Framework-FDGE` · `Framework-FPGE` · `Framework-QA` · `Framework-FIDE` · `Foundation-Protocol` | **No.** Explican y nunca mandan (`LEX-R22`), y `verify-suite` lo comprueba |
| **Plantillas** | `INTAKE/templates/` (5) · `PTSA/templates/COVERAGE.md` | No |
| **Integración** | `Suite-CLAUDE-Template.md` | Parametriza; no legisla (`SUITE-R00`) |
| **Historia** | `CHANGELOG.md` | Es la fuente de la versión vigente (`SUITE-R40`) |
| **Manual** | `README.md` de la suite | No |

## Por componente de la suite

| Componente | Documentos propios |
|:---|:---|
| Foundation | `Foundation-Protocol` · `Foundation-Implementation` · `Foundation-Prompts` |
| FDGE | `Framework-FDGE` · `FDGE-Implementation` · `FDGE-Prompts` · `INTAKE/Intake-Protocol` + 5 plantillas |
| FQAGE | `QA/Framework-QA` · `QA/QA-Implementation` · `QA/QA-Prompts` |
| PTSA | `PTSA/PTSA-V3-Especificacion-Oficial` (2 296 líneas, 80 reglas) · `PTSA-Prompts` · `templates/COVERAGE.md` |
| FPGE | `Framework-FPGE` · `FPGE-Implementation` · `FPGE-Prompts` |
| FIDE | `FIDE/Framework-FIDE` · `FIDE-Implementation` · `FIDE-CLAUDE-Launcher` |

**Los componentes son independientes**: un cambio en FDGE no debe romper QA, PTSA ni FPGE.

## Qué carga una sesión

`CORE.md` y nada más (`SUITE-R15`). Cualquier otro documento se abre **solo** cuando `CORE.md`
lo remite para un caso concreto. `[START PTSA]` añade el overlay `CORE-PTSA.md`: sin él,
auditaría con 23 de sus 80 reglas (`SUITE-R25`).
