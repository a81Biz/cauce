# `PT-169` · `spec-changes.md` — `PHASE 4`

| Documento | Cambio | Naturaleza |
|:---|:---|:---|
| `RULES.md` | `SUITE-R61`, `CHECK` | **añade** |
| `PHASES.md` | bloque `PODA` en el cierre de lote | **añade** — cita, no enuncia (`LEX-R22`) |
| `FDGE-Prompts.md` | el texto copiable de `SUITE-R61` | **añade** — sin él, `MANUAL` no la vería |

**Ninguna regla existente cambia de enunciado ni de severidad.** `CORE` pasa de 263 a **264**.

**Contrato de herramienta**: `seccionesDelArnes()` devuelve ahora también `cuerpo`. Es **aditivo**;
quien sólo lea `titulo` y `herramientas` no nota nada.

**Cambio de conducta observable**: `--solo` ya no ejecuta las secciones que no contienen el patrón.
Un uso que dependiera de sus efectos colaterales cambiaría — y **no debería haberlo**: `--solo`
existe para filtrar.

**No sube versión.** `13.2.0` se mantiene: la regla es aditiva y no hay ruptura.
