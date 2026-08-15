# PT-023 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Las 110 filas contrastadas y los 4 candidatos con veredicto | `changes/*/spec-changes.md` | medida | ejecución | — | hecha en `PHASE 2` |
| T2 | El texto copiable dice la forma, no la intención | `SUITE-R44` | párrafo nuevo | `verify-suite` | `FDGE-Prompts.md` | pendiente |
| T3 | Desaparece «normalmente» de ese párrafo | T2 | idem | `selftest.sh` | `FDGE-Prompts.md` | pendiente |
| T4 | El caso que impide perderlo | T2 · T3 | casos nuevos | `selftest.sh` verde | `tools/selftest.sh` | pendiente |
| T5 | El límite declarado con su cifra | `discovery.md` | escrito | lectura | `self-review.md` | pendiente |

**Archivos tocados:**

```
docs/methodology/FDGE-Prompts.md · docs/methodology/tools/selftest.sh
```

Solapamiento (`FDGE-R40`): `selftest.sh` con `PT-015`, `PT-016`, `PT-017`, `PT-020` y `PT-047`,
todos ya integrados en `trabajo`. Sin conflicto: se añade al final.

`FDGE-Prompts.md` no lo toca ninguna otra tarea de `EP-013`.
