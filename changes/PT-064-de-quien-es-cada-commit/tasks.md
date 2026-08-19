# PT-064 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir qué cifras mezclan personas | ejecución | las tres, y de forma distinta | ejecución | — | hecha en `PHASE 2` |
| T2 | `soloDe` y `sinPersona`, puras | `design` | funciones | selftest | `tools/patrones.mjs` | pendiente |
| T3 | Las tres derivaciones piden el autor | `design` | — | selftest | `tools/tracker.mjs` | pendiente |
| T4 | …y lo pasan por `personaDe` | T3 | — | selftest | `tools/tracker.mjs` | pendiente |
| T5 | El precedente se filtra **siempre** | T4 | — | selftest | `tools/tracker.mjs` | pendiente |
| T6 | El techo, también | T4 | — | selftest | `tools/tracker.mjs` | pendiente |
| T7 | El coste, **a petición**: `--mio` · `--de` | T4 | — | selftest | `tools/tracker.mjs` | pendiente |
| T8 | …y **dice** de quién es, siempre | T7 | texto | selftest | `tools/tracker.mjs` | pendiente |
| T9 | Los no declarados se **cuentan** y se dicen | T2 | texto | selftest | `tools/tracker.mjs` | pendiente |
| T10 | Con una persona o ninguna, nada cambia | T5-T7 | — | selftest | `tools/tracker.mjs` | pendiente |

**Archivos tocados:**

```
docs/methodology/tools/patrones.mjs · tools/tracker.mjs · tools/selftest.sh
```

**No toca `LEXICON` ni `RULES`**: no introduce vocabulario ni obligaciones — cambia de dónde salen
unas entradas. Solapamiento (`FDGE-R40`): `patrones.mjs` y `tracker.mjs` los tocaron `PT-061`,
`PT-062` y `PT-063`, **las tres integradas**. `PT-065` no ha empezado.
