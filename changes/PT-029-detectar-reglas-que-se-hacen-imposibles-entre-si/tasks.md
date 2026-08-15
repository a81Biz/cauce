# PT-029 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Buscar los choques cruzando fases × compuertas | `tracker.mjs` · `verify-fdge.mjs` | 3 choques | ejecución | — | hecha en `PHASE 2` |
| T2 | `EXIGIBLE_DESDE` y `exigibleEn`, con la fase al lado | `PHASES` | constante nueva | selftest | `tools/patrones.mjs` | pendiente |
| T3 | Las tres comprobaciones nombran su compuerta | T2 | 3 sustituciones | `--gate G1..G4` | `tools/verify-fdge.mjs` | pendiente |
| T4 | `G4` no pierde ninguna exigencia | T3 | — | caso propio | `tools/selftest.sh` | pendiente |
| T5 | El caso que caza la **forma**, no los tres casos | T3 | caso nuevo | `selftest.sh` verde | `tools/selftest.sh` | pendiente |
| T6 | La familia que **no** se detecta, declarada | `origin` de PT-029 | escrito | lectura | `self-review.md` | pendiente |

**Archivos tocados:**

```
docs/methodology/tools/patrones.mjs · verify-fdge.mjs · selftest.sh
```

Solapamiento (`FDGE-R40`): los tres con `PT-015`, `PT-016`, `PT-017`, `PT-020`, `PT-023` y
`PT-047`, **todos ya integrados en `trabajo`**. Esta rama sale de `trabajo` después de los seis:
sin conflicto.
