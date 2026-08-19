# PT-063 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir qué comprueba hoy el formato | ejecución | nada lo comprueba | ejecución | — | hecha en `PHASE 2` |
| T2 | `FDGE-R19` dice el formato nuevo | `SUITE-R19` | regla modificada | `verify-suite` | `RULES.md` | pendiente |
| T3 | El formato en `LEXICON` | `LEX-R21` | §6.5f | `verify-suite` | `LEXICON.md` | pendiente |
| T4 | `normaliza` extraído y compartido | `design` | función | selftest | `tools/patrones.mjs` | pendiente |
| T5 | `ramaDeTarea`, pura | T4 | función | selftest | `tools/patrones.mjs` | pendiente |
| T6 | …y sin usuario, dos niveles como hoy | T5 | — | selftest | `tools/patrones.mjs` | pendiente |
| T7 | `ramaLlevaUsuario` | `design` | función | selftest | `tools/patrones.mjs` | pendiente |
| T8 | `tracker rama PT-NNN` — propone, no crea | T5 | acción | selftest | `tools/tracker.mjs` | pendiente |
| T9 | `verify-fdge` **avisa**, y dice desde cuándo | T7 | comprobación | selftest | `tools/verify-fdge.mjs` | pendiente |
| T10 | Comprobar que `trabajo` sigue siendo una | — | casos | selftest | `tools/selftest.sh` | pendiente |
| T11 | …y que `G4` no se multiplica | — | casos | selftest | `tools/selftest.sh` | pendiente |

**Archivos tocados:**

```
docs/methodology/RULES.md · LEXICON.md · tools/patrones.mjs · tools/tracker.mjs ·
tools/verify-fdge.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): **`RULES.md` solo lo toca esta tarea** en todo el lote — es el `MAJOR`.
`patrones.mjs` y `tracker.mjs` los tocaron `PT-061` y `PT-062`, **las dos integradas**. `T4` extrae
`normaliza` de `ramaDe` (`PT-054`): las dos ramas del marco pasan a normalizar igual, que es lo que
ya hacían por separado.
