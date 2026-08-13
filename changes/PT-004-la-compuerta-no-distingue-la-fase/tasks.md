# PT-004 — Tareas   `PHASE 4`

Scope lock (`FDGE-R20`): **solo** los archivos listados aquí. Cualquier otro es desvío y para
la implementación (`FDGE-R21`).

## `PT-004.1` · Los casos que fallan antes del arreglo   `FDGE-R17`

- **Objetivo:** escribir la comprobación que tumba el defecto, antes de tocarlo.
- **Input:** `discovery.md`, los umbrales de `design.md`, el fixture existente.
- **Output:** casos nuevos en el bloque de cumplimiento de `selftest.sh`.
- **Validación:** `npm run selftest` **falla** en los casos nuevos y solo en ellos.
- **Archivos:** `docs/methodology/tools/selftest.sh`

Casos: `TS-01` a `TS-06` de [test-scenarios.md](test-scenarios.md).

## `PT-004.2` · Distinguir fase declarada de fase ausente

- **Objetivo:** que `verify-fdge` sepa cuándo nadie declaró la fase, en vez de asumir `0`.
- **Input:** `verify-fdge.mjs:757`.
- **Output:** la resolución devuelve el número declarado o la ausencia, distinguibles.
- **Validación:** `TS-05` y `TS-06` pasan; `FDGE-R52`, que ya usaba `fase`, conserva su
  comportamiento y sus tres casos siguen verdes.
- **Archivos:** `docs/methodology/tools/verify-fdge.mjs`

## `PT-004.3` · `FDGE-R42` se exige desde `PHASE 2`

- **Objetivo:** que una INVESTIGATION anterior a `PHASE 2` no falle por no tener `discovery.md`.
- **Input:** `verify-fdge.mjs:791-800`.
- **Output:** falta de `discovery.md` → error desde `fase >= 2`, aviso por debajo, aviso
  distinto si no hay fase declarada.
- **Validación:** `TS-02` y `TS-04`.
- **Archivos:** `docs/methodology/tools/verify-fdge.mjs`

## `PT-004.4` · `FDGE-R15` se exige desde `PHASE 4`

- **Objetivo:** lo mismo para `traceability.md`.
- **Input:** `verify-fdge.mjs:808-811`.
- **Output:** error desde `fase >= 4`, aviso por debajo, aviso distinto sin fase declarada. Las
  comprobaciones internas de la matriz no cambian.
- **Validación:** `TS-01` y `TS-03`.
- **Archivos:** `docs/methodology/tools/verify-fdge.mjs`

## `PT-004.5` · Declarar la fase de los PTs vivos de este repositorio

- **Objetivo:** que los cuatro PTs de `EP-001` declaren su fase, que es lo que la herramienta
  va a leer.
- **Input:** `REGISTRY.json`.
- **Output:** `phase` en las cuatro allocations.
- **Validación:** `verify-fdge --all` no emite el aviso de fase sin declarar.
- **Archivos:** `docs/implementation/REGISTRY.json`

## `PT-004.6` · Evidencia   `PHASE 6`

- **Objetivo:** que cada AC tenga artefacto en disco.
- **Output:** `docs/implementation/evidence/PT-004/` con salidas antes y después, manifiesto y
  self-review.
- **Validación:** `FDGE-R23`.
- **Archivos:** `docs/implementation/evidence/PT-004/**`

---

## Archivos que este PT NO toca

`RULES.md` · `CORE.md` · `PHASES.md` · `EXECUTION-MODES.md` · `LEXICON.md` ·
`INTAKE/templates/**` · `audit.mjs` · `tracker.mjs` · `bin/cauce.mjs` · `package.json` ·
`.github/workflows/**` · `CHANGELOG.md`.

`CHANGELOG.md` queda fuera **a propósito**: la entrada de versión es el cierre del lote, no de
una tarea, y `TD-05` sigue sin decidir. Ver [out-of-scope.md](out-of-scope.md).
