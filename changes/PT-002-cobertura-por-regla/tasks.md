# PT-002 — Tareas   `PHASE 4`

Scope lock (`FDGE-R20`): solo estos archivos.

## `PT-002.1` · Los casos, primero y en rojo   `FDGE-R17`

- **Output:** `TS-01` a `TS-07` de [test-scenarios.md](test-scenarios.md).
- **Validación:** `selftest` falla en los nuevos y solo en ellos.
- **Archivos:** `docs/methodology/tools/selftest.sh`

## `PT-002.2` · Derivar quién ejecuta cada herramienta

- **Objetivo:** el conjunto «con compuerta» se lee del repositorio, no se escribe (`RULE-01`).
- **Input:** `package.json` · `.github/workflows/*.yml` · `bin/cauce.mjs`.
- **Output:** conjunto de herramientas invocadas por una compuerta, o **no evaluable**.
- **Validación:** `TS-05`, `TS-06`.
- **Archivos:** `docs/methodology/tools/audit.mjs`

## `PT-002.3` · Clasificar cada regla en los tres estados

- **Output:** `ejecutada` · `citada` · `sin verificar`, con desglose HARD.
- **Validación:** `TS-01`, `TS-02`.
- **Archivos:** `docs/methodology/tools/audit.mjs`

## `PT-002.4` · Publicar el número y enumerar bajo demanda

- **Output:** bloque de cobertura en el informe; `--sin-compuerta` y `--sin-verificar`.
- **Validación:** `TS-03`, `TS-04`, `TS-07`.
- **Archivos:** `docs/methodology/tools/audit.mjs`

## `PT-002.5` · Evidencia   `PHASE 6`

- **Archivos:** `docs/implementation/evidence/PT-002/**`

---

## Archivos que este PT NO toca

`RULES.md` · `CORE.md` · `PHASES.md` · `LEXICON.md` · `EXECUTION-MODES.md` ·
`verify-fdge.mjs` · `tracker.mjs` · `CHANGELOG.md`.

`package.json`, los workflows y `bin/cauce.mjs` **se leen, no se modifican**: son la fuente de
la que se deriva quién ejecuta qué. Tocarlos falsearía la medida.
