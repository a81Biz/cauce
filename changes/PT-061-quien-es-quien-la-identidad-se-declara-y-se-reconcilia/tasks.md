# PT-061 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir qué identidad existe hoy y quién la usa | ejecución | tres identidades, un solo consumidor | ejecución | — | hecha en `PHASE 2` |
| T2 | `personas` y su contrato en `LEXICON` | `LEX-R21` | §6.2 y §6.5f | `verify-suite` | `LEXICON.md` | pendiente |
| T3 | `personaDe(autor, personas)`, pura | `design` | función | selftest | `tools/patrones.mjs` | pendiente |
| T4 | Casa el par **entero**: nombre **y** correo | T3 | — | selftest | `tools/patrones.mjs` | pendiente |
| T5 | Sin declarar ⇒ `null` **con motivo**, nunca un parecido | T3 | — | selftest | `tools/patrones.mjs` | pendiente |
| T6 | `personaLocal` — quién usa esta máquina | T3 | función | selftest | `tools/patrones.mjs` | pendiente |
| T7 | `tracker personas` — declarados y **no declarados** | T3 | acción | selftest | `tools/tracker.mjs` | pendiente |
| T8 | `ramaDe` pasa por la tabla, y sin tabla no cambia | T6 | — | selftest | `tools/tracker.mjs` | pendiente |
| T9 | `verify-suite`: todo firmante existe como persona | T3 | comprobación | selftest | `tools/verify-suite.mjs` | pendiente |
| T10 | Declarar las tres identidades de este repositorio | T2 | `personas` | ejecución | `REGISTRY.json` | pendiente |

**Archivos tocados:**

```
docs/methodology/LEXICON.md · tools/patrones.mjs · tools/tracker.mjs ·
tools/verify-suite.mjs · tools/selftest.sh · docs/implementation/REGISTRY.json
```

Solapamiento (`FDGE-R40`): `patrones.mjs` y `tracker.mjs` los tocó `EP-015`, **cerrada e
integrada**. `PT-062`…`PT-065` **no han empezado** y consumirán esto. `T8` toca `ramaDe` de
`PT-054`: cambia **de dónde sale el nombre**, no lo que hace con él.
