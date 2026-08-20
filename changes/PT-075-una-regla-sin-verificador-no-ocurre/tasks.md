# PT-075 — Tareas   `PHASE 4`

Archivos que toca (`FDGE-R40`):

```
docs/methodology/RULES.md
docs/methodology/PHASES.md
docs/methodology/CORE.md                 (regenerado, no editado)
docs/methodology/tools/verify-fdge.mjs
docs/methodology/tools/tracker.mjs
docs/methodology/tools/selftest.sh
docs/enterprise-documentation/10-Technical-Debt.md
```

| # | Tarea | Archivo | Estado |
|:--|:---|:---|:---|
| 1 | Casos en **rojo** de `AC-01`..`AC-05` | `selftest.sh` | |
| 2 | `FDGE-R54` en `RULES.md` | `RULES.md` | |
| 3 | La cita en `PHASE 4` | `PHASES.md` | |
| 4 | `tracker viabilidad --registrar` | `tracker.mjs` | |
| 5 | La comprobación de `FDGE-R54` | `verify-fdge.mjs` | |
| 6 | La segunda mitad de `SUITE-R42` (`B3`) | `verify-fdge.mjs` | |
| 7 | El artefacto `acciones-humanas.md` y su exigencia (`B4`) | `verify-fdge.mjs` | |
| 8 | `TD-14`: lo que no es comprobable (`B5`) | `10-Technical-Debt.md` | |
| 9 | `build-core` para regenerar `CORE.md` | — | |
| 10 | Comprobación **inversa** | — | |
| 11 | `npm run verify` completo | — | |

La 1 antes que la 2 (`FDGE-R17`). La 9 después de la 2 y la 3, o `core:check` falla.
