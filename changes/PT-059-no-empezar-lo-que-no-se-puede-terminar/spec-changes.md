# PT-059 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Qué cambia | Por qué |
|:---|:---|:---|
| `LEXICON.md` §4 | **Nuevo estado de tarea**: `BLOCKED_BY_CONTEXT`, no terminal | `LEX-R21` · es un estado, y los estados viven ahí |
| `LEXICON.md` §6.5d | **Nuevo**: `SAFE` / `MARGINAL` / `UNSAFE` y `HOLGURA` | `LEX-R21` · antes que el código |
| `CORE.md` | Regenerado por `build-core` | Deriva de `LEXICON` |

**Ninguna regla nueva, y ninguna modificada.** Entra **vocabulario**: un estado de tarea y tres
veredictos. La compuerta de viabilidad **no impone una obligación nueva** — no dice que haya que
obedecerla, dice qué hay antes de empezar.

**`BLOCKED_BY_CONTEXT` sí toca mecánica existente**, y por eso se declara con cuidado: entra en el
conjunto `VIVOS` de `tracker` y `verify-fdge`. Un estado que no fuera ni terminal ni vivo
desaparecería del tablero sin estar cerrado, que sería peor que cualquiera de las dos cosas.

**Lo que NO cambia:** `ESTADOS_TERMINALES` sigue igual. `BLOCKED_BY_CONTEXT` no cierra nada — la
tarea no está fallando, no debe ejecutarse todavía.
