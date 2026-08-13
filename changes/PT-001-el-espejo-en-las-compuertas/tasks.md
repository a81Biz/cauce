# PT-001 — Tareas   `PHASE 4`

Scope lock (`FDGE-R20`): **solo** los archivos listados. Cualquier otro es desvío y para la
implementación (`FDGE-R21`). Alcance ampliado en la Revisión 1 del [intake](intake.md).

## `PT-001.1` · Los casos que fallan antes del arreglo   `FDGE-R17`

- **Objetivo:** escribir la comprobación que tumba cada frente, antes de tocarlo.
- **Output:** `TS-01` a `TS-09` de [test-scenarios.md](test-scenarios.md).
- **Validación:** `npm run selftest` falla en los casos nuevos y solo en ellos.
- **Archivos:** `docs/methodology/tools/selftest.sh`

## `PT-001.2` · `tracker` distingue «sin plataforma» de «sin acceso»

- **Objetivo:** códigos `2` y `3` separados, con el acceso comprobado al arrancar (`FND-R30`).
- **Input:** `tracker.mjs:88-102`.
- **Output:** salida `3` con mensaje accionable; `2` reservado a «no hay plataforma declarada».
- **Validación:** `TS-05`, `TS-06`.
- **Archivos:** `docs/methodology/tools/tracker.mjs`

## `PT-001.3` · `tracker notas PT-NNN`

- **Objetivo:** que `verify-fdge` pueda contar el reanclaje sin hablar con GitHub.
- **Output:** acción de **solo lectura** que imprime el número de notas de transición del
  issue del PT. Reconoce la forma que `CORE.md` fija, no cualquier comentario.
- **Validación:** `TS-07`.
- **Archivos:** `docs/methodology/tools/tracker.mjs`

## `PT-001.4` · `tracker abrir` prepara sus etiquetas

- **Objetivo:** que no falle por etiquetas inexistentes (`AC-08`).
- **Output:** las crea si faltan y lo dice; si no puede, da el comando exacto (`RULE-07`).
- **Validación:** `TS-09`.
- **Archivos:** `docs/methodology/tools/tracker.mjs`

## `PT-001.5` · `FDGE-R52` lee donde `CORE.md` manda

- **Objetivo:** con plataforma declarada, el reanclaje del issue satisface la regla.
- **Input:** `verify-fdge.mjs:788-795`.
- **Output:** tres ramas — plataforma con acceso → cuenta notas del issue · plataforma sin
  acceso → `SIN EVALUAR` (o `fail` en `G4`) · sin plataforma → `bitacora.md`, como hoy.
- **Validación:** `TS-07`, `TS-08`.
- **Archivos:** `docs/methodology/tools/verify-fdge.mjs`

## `PT-001.6` · El espejo es precondición de `G4`

- **Objetivo:** `FDGE-R34` incluye el espejo (`AC-04`).
- **Input:** `verify-fdge.mjs:942-974`.
- **Output:** con `--gate G4` y plataforma declarada, `tracker espejo` se ejecuta; `1` y `3`
  fallan la compuerta.
- **Validación:** `TS-03`, `TS-04`, `TS-06`.
- **Archivos:** `docs/methodology/tools/verify-fdge.mjs`

## `PT-001.7` · Las compuertas lo ejecutan

- **Objetivo:** `AC-03` — que no dependa de que alguien se acuerde.
- **Output:** script `verify:espejo` encadenado en `verify`; paso en `verificacion.yml` con el
  `if:` del fork; `cauce verify` mapeando `2` y `3`.
- **Validación:** `TS-01`, `TS-02` y la ejecución real sobre este repositorio.
- **Archivos:** `package.json` · `.github/workflows/verificacion.yml` · `bin/cauce.mjs`

## `PT-001.8` · Evidencia   `PHASE 6`

- **Output:** `docs/implementation/evidence/PT-001/` con salidas antes y después, manifiesto y
  self-review. Incluye la prueba de que `G4` de `PT-004` queda desbloqueada.
- **Archivos:** `docs/implementation/evidence/PT-001/**`

---

## Archivos que este PT NO toca

`RULES.md` · `CORE.md` · `PHASES.md` · `LEXICON.md` · `EXECUTION-MODES.md` ·
`INTAKE/templates/**` · `audit.mjs` · `migrate.mjs` · `plan-layout.mjs` · `CHANGELOG.md`.
