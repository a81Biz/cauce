# PTSA — espacio de trabajo de la auditoria

**Auditado el 2026-08-20.** Primera ejecucion de PTSA sobre este repositorio.

| | |
|:---|:---|
| Version auditada | `10.0.0` · rama `trabajo` · commit `b67dc92` |
| Certificacion | **B** · Health 79.9 · Risk 73 · Confidence 0.94 |
| Cobertura | `coverage 0.89` — 175 de 196 celdas del universo |
| Hallazgos | 9 · dos corregidos y en `VALIDATION_PENDING` · ninguno cerrado |
| Frescura | `2026-08-20` · **caduca el `2026-09-20`** (`PTSA-R20`) |

Empieza por [RESUMEN.md](RESUMEN.md). La matriz esta en [COVERAGE.md](COVERAGE.md) y es lo que
sostiene el score: **sin ella el numero seria nulo** (`PTSA-R21`).

```
RESUMEN.md            dictamen, los cuatro scores y el roadmap priorizado
COVERAGE.md           51 elementos x 4 dimensiones · toda celda con veredicto
Products/             P-001..P-004 · criterio de validez firmado y su Acid Test
Findings/             H-001..H-009 · uno por hallazgo, se cierran, nunca se borran
Evidence/             E-001..E-011 · captura literal y observacion factual, sin causa
Phases/               las catorce fases de la corrida
AUDIT_LOG.md          append-only · una entrada por auditoria
score-history.json    todo score emitido, con fecha, cobertura y frescura
```

**Ningun hallazgo se cierra sin una persona.** `PTSA-R44`: los de tipo `BUG` y `DOMAIN` los valida
y cierra el firmante, no el agente que los encontro.
