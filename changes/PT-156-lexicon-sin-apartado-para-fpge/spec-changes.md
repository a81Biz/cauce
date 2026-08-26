# `PT-156` · `spec-changes.md` — `PHASE 4`

| Documento | Cambio | Naturaleza |
|:---|:---|:---|
| `LEXICON.md` | apartado `§3.6` nuevo: `FPGE` y su mapa de siete fases | **amplía** — declara un dato que faltaba |
| `LEXICON.md` | `§3.6`→`§3.7`, `§3.7`→`§3.8` (el contrato de componente) | renumeración, sin cambio de contenido |
| `FPGE-Implementation.md` | los siete pasos pasan a `PHASE n` | **corrige** — cumplía `§2` sólo en apariencia |
| `FPGE-Prompts.md` | idem | **corrige** |
| `RULES.md` | `SUITE-R44`: `retomada` vuelve a citar `LEX-R33` | **corrige** una regresión de `PT-148` |

**Ninguna regla cambia de enunciado ni de severidad.** No se añade ni se retira ninguna: `CORE`
sigue en **263**.

**No hay cambio de contrato de herramienta**: `fasesDe('FPGE')` ya devolvía algo, y `SIN_EVALUAR`
era uno de sus valores declarados (`LEXICON` §3.7). Pasa de un valor legítimo a otro.

**No sube versión.** `13.1.0` se mantiene: se completa un dato declarado como no evaluable, que
es exactamente la transición que `RULE-06` contempla.
