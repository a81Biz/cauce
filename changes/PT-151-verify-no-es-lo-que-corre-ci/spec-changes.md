# `PT-151` · `spec-changes.md` — `PHASE 4`

| Documento | Cambio | Naturaleza |
|:---|:---|:---|
| `RULES.md` | `SUITE-R62`, `CHECK` | **añade** |
| `PHASES.md` · `FDGE-Prompts.md` | la citan | **añade** — citan, no enuncian (`LEX-R22`) |
| `CLAUDE.md` | «todo lo anterior, como en CI» → «los nueve pasos que corre CI» | **corrige** — la anterior era falsa |

**Ninguna regla existente cambia.** `SUITE-R01` sigue declarada no verificable, y esta tarea lo
**restituye** tras haberla sacado por error de esa lista.

**Cambio de conducta observable**: `npm run verify` corre ahora **nueve** pasos en vez de ocho, e
incluye `verify-fdge --all`, que no es gratis. La cifra se publica.

**No sube versión.**
