# PT-022 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Cambio |
|:---|:---|
| `RULES.md` | **`SUITE-R45` nueva**, HARD. Un lote declara qué se hace al cerrarlo; en `G4` cada fila declara su estado. Incluye su límite: no comprueba que un `out-of-scope` esté completo |
| `RULES.md` · `SUITE-R44` | Citar el propio lote exige además que el lote declare su cierre |
| `PHASES.md` | Bloque `CIERRE` en `PHASE 1`, y `APLAZAR` reescrito con la gramática real |
| `FDGE-Prompts.md` | Texto copiable de `SUITE-R45` (`SUITE-R20`) |
| `CORE.md` | Regenerado |

**`MAJOR`.** `SUITE-R45` es vinculante y nueva: un lote sin sección de cierre no pasa `G4`. La
7.0.0 ya sube por `SUITE-R44`, así que entra en la misma versión y en la misma guía de migración.
