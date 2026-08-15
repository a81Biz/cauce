# PT-047 — Cambios de especificación   `PHASE 4`

| Documento | Cambio |
|:---|:---|
| `RULES.md` · `FDGE-R19` | **Ampliada**: declara la topología de ramas y que un PT vivo en `PHASE 5+` la declara en el registro |
| `RULES.md` · `SUITE-R42` | **Aclarada**: el PR que `G4` necesita es el de la **rama por defecto**. Con dos niveles de merge, «la rama» era ambiguo |
| `PHASES.md` · `FDGE-Prompts.md` | La citan (`SUITE-R20`) |
| `CLAUDE.md` | La tabla de ramas declara las dos permanentes **y** las efímeras por tarea |
| `CORE.md` | Regenerado |
| `tools/verify-fdge.mjs` | La comprobación |
| `tools/selftest.sh` | Los casos, incluido el que **no** debe avisar |

**No cambia:** quién resuelve `G4` ni cuántas veces (`EXEC-R04`, `EXEC-R03`), ni `SUITE-R46`
—la rama por defecto sigue siendo `main`—, ni `FDGE-R22`, que ya usa el mismo patrón.

**Compatibilidad:** `MINOR` por sí sola. El lote sube `MAJOR` por `PT-016`.
