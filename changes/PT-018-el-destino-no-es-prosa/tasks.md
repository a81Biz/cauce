# PT-018 — Tareas   `PHASE 4`

| # | Tarea | Archivo |
|:---|:---|:---|
| T1 | Quitar `RE_APLAZA`: la heurística de palabras deja de existir | `tools/verify-fdge.mjs` |
| T2 | Gramática cerrada: `—` o cita de identificador; nada más pasa | `tools/verify-fdge.mjs` |
| T3 | Reciprocidad: hermano del lote · epic propio solo si `CLOSED` · si no, `DEFERRED` cuyo `origin` mencione este PT | `tools/verify-fdge.mjs` |
| T4 | Reescribir `SUITE-R44` con la gramática, no con la intención | `RULES.md` |
| T5 | Citar la gramática donde se redacta el `out-of-scope` | `PHASES.md` · `FDGE-Prompts.md` |
| T6 | Casos: prosa que antes pasaba, cita sin reciprocidad, epic abierto, `DEFERRED` correcto | `tools/selftest.sh` |
| T7 | Aplicar la gramática al propio repositorio y asignar lo que aparezca | `changes/*/out-of-scope.md` |
