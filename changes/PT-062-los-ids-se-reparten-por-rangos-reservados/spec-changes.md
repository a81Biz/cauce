# PT-062 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Qué cambia | Por qué |
|:---|:---|:---|
| `LEXICON.md` §6.5f | `personas` gana `rango`, con su contrato | `LEX-R21` |
| `CORE.md` | Regenerado por `build-core` | Deriva de `LEXICON` |

**Ninguna regla nueva, y ninguna modificada.**

**`SUITE-R08` no cambia, y es lo importante de esta tarea.** Sigue diciendo que el registro asigna.
Lo que esta tarea hace es **cumplirla por primera vez de forma ejecutable**: `PHASE 2` midió que
ninguna herramienta asignaba, y que la asignación la hacía quien editaba el archivo a mano. La
regla era una afirmación sin nadie que la ejecutara.

`tracker asignar` no es una obligación nueva: es el mecanismo que faltaba para la que ya existía.

**`LEX-R04` tampoco cambia.** Los identificadores siguen siendo permanentes, únicos y no
reutilizables — los rangos dicen **de dónde** sale el número, no lo convierten en otra cosa. Y por
eso el ID **no se namespacea**: sigue siendo `PT-NNN`.

`verify-fdge` gana dos comprobaciones —rangos solapados, y allocation fuera de todo rango— pero
**no reglas**: las dos las respalda `SUITE-R08`, que ya dice que el registro es el asignador.
