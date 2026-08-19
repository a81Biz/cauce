# PT-062 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir cómo se asigna hoy y qué pasa con dos personas | ejecución | nadie asigna · la colisión, reproducida | ejecución | — | hecha en `PHASE 2` |
| T2 | `rango` y su contrato en `LEXICON` | `LEX-R21` | §6.5f | `verify-suite` | `LEXICON.md` | pendiente |
| T3 | `siguienteEnRango`, pura, derivada de lo usado | `design` | función | selftest | `tools/patrones.mjs` | pendiente |
| T4 | Agotado ⇒ `null` **con motivo**, nunca invadir | T3 | — | selftest | `tools/patrones.mjs` | pendiente |
| T5 | `seSolapan` y `solapes` | `design` | funciones | selftest | `tools/patrones.mjs` | pendiente |
| T6 | `tracker asignar` — lo único que escribe un ID | T3 | acción | selftest | `tools/tracker.mjs` | pendiente |
| T7 | …y sin rangos, del contador global como hoy | T6 | — | selftest | `tools/tracker.mjs` | pendiente |
| T8 | `--ver` no escribe nada | T6 | — | selftest | `tools/tracker.mjs` | pendiente |
| T9 | `verify-fdge`: dos rangos solapados **fallan** | T5 | comprobación | selftest | `tools/verify-fdge.mjs` | pendiente |
| T10 | …y una allocation fuera de todo rango también | T5 | comprobación | selftest | `tools/verify-fdge.mjs` | pendiente |
| T11 | `tracker personas` enseña los rangos | T3 | — | selftest | `tools/tracker.mjs` | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/patrones.mjs · tools/tracker.mjs ·
tools/verify-fdge.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `patrones.mjs` y `tracker.mjs` los tocó `PT-061`, **ya integrada**.
`T11` toca `tracker personas` de `PT-061`: **añade** una columna, no cambia lo que hace.
`PT-063`…`PT-065` no han empezado.
