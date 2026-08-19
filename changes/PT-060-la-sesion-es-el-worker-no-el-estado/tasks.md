# PT-060 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir qué registra hoy una sesión | ejecución | nada registra su inicio | ejecución | — | hecha en `PHASE 2` |
| T2 | `SESSION.json` y la sesión como entidad en `LEXICON` | `LEX-R21` | §6.2 y §6.5e | `verify-suite` | `LEXICON.md` | pendiente |
| T3 | `sesionDe(marca, git, checkpoint)`, pura | `design` | función | selftest | `tools/patrones.mjs` | pendiente |
| T4 | Sin marca ⇒ `SIN EVALUAR`, no el día | T3 | — | selftest | `tools/patrones.mjs` | pendiente |
| T5 | `handoffDeSesion`, derivado del checkpoint | T3 | función | selftest | `tools/patrones.mjs` | pendiente |
| T6 | `tracker sesion abrir` — captura `HEAD` | T3 | acción | selftest | `tools/tracker.mjs` | pendiente |
| T7 | `tracker sesion` — lo derivado | T3 | acción | selftest | `tools/tracker.mjs` | pendiente |
| T8 | `tracker sesion cerrar` — el handoff | T5 | acción | selftest | `tools/tracker.mjs` | pendiente |
| T9 | Las transiciones se apilan en `SESSION_LOG.md` | T6 · T8 | — | selftest | `tools/tracker.mjs` | pendiente |
| T10 | `viabilidad` usa el `desde` si lo hay, y lo dice si no | T6 | — | selftest | `tools/tracker.mjs` | pendiente |
| T11 | `AC-06` ejecutado y capturado | todo | evidencia | ejecución | — | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/patrones.mjs · tools/tracker.mjs · tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `patrones.mjs` y `tracker.mjs` los tocaron `PT-057`, `PT-058` y
`PT-059`, **las tres integradas**. `T10` toca `viabilidad()` de `PT-059`: cambia **de dónde sale**
una entrada, no la lógica de `viabilidadDe`. Es el hueco que `PT-059` declaró como no verificado.
