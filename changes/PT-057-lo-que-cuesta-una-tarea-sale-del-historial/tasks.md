# PT-057 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir qué señales existen y cuáles discriminan | ejecución | tres señales con cobertura | ejecución | — | hecha en `PHASE 2` |
| T2 | El nombre y el contrato en `LEXICON` | `LEX-R21` | «referencia de coste» | `verify-suite` | `LEXICON.md` | pendiente |
| T3 | `resumen(xs)` — mediana, min, max, n | `design` | función nueva | selftest | `tools/tracker.mjs` | pendiente |
| T4 | `duenoDe(asunto)` — el primer `PT` del asunto | `discovery` | función nueva | selftest | `tools/tracker.mjs` | pendiente |
| T5 | `costeDe(cerradas, {tipo, complejidad})`, pura | T3 · T4 | función nueva | selftest | `tools/tracker.mjs` | pendiente |
| T6 | `MINIMO_REFERENCIA = 5` con nombre y comentario | `strategy` | constante | selftest | `tools/tracker.mjs` | pendiente |
| T7 | `tracker coste`, en `SIN_PLATAFORMA` | T5 | acción | selftest | `tools/tracker.mjs` | pendiente |
| T8 | La salida dice casos, rango y de dónde sale | T7 | texto | selftest | `tools/tracker.mjs` | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/tracker.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `tracker.mjs` con `PT-058`…`PT-060`, que **no han empezado** y van
detrás por decisión del lote. Ninguna función de `PT-056` se toca: `costeDe` no comparte estado
con `estadoDelArbol` ni con `checkpointDe`.
