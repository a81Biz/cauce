# PT-058 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir qué vocabulario existe ya y dónde | ejecución | 50 usos en 13 archivos, 0 en `LEXICON` | ejecución | — | hecha en `PHASE 2` |
| T2 | Las tres naturalezas y su contrato en `LEXICON` | `LEX-R21` | §6.5c | `verify-suite` | `LEXICON.md` | pendiente |
| T3 | `NATURALEZAS` cerrado y **ordenado** | `design` | constante | selftest | `tools/patrones.mjs` | pendiente |
| T4 | `cifra(valor, naturaleza)`, y sin naturaleza **lanza** | T3 | función | selftest | `tools/patrones.mjs` | pendiente |
| T5 | `SIN EVALUAR` lleva `valor: null` | T4 | — | selftest | `tools/patrones.mjs` | pendiente |
| T6 | `peorNaturaleza` — el contagio | T3 | función | selftest | `tools/patrones.mjs` | pendiente |
| T7 | `sumar` y `restar` sobre cifras | T4 · T6 | funciones | selftest | `tools/patrones.mjs` | pendiente |
| T8 | `textoCifra` — la naturaleza pegada al número | T4 | función | selftest | `tools/patrones.mjs` | pendiente |
| T9 | `verify-suite` falla si aparece un cuarto valor | T3 | comprobación | selftest | `tools/verify-suite.mjs` | pendiente |
| T10 | El contrato del patrón, para `verify-patrones` | T3 | contrato | `verify-patrones` | `tools/patrones.mjs` | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/patrones.mjs · tools/verify-suite.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `patrones.mjs` lo tocó `PT-029` (`EXIGIBLE_DESDE`), que está cerrado.
`PT-059` y `PT-060` **no han empezado** y consumirán esto, no lo modificarán. Nada de `PT-056` ni
`PT-057` se toca: `tracker.mjs` no entra en esta tarea.
