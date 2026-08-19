# PT-065 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Qué cambia | Por qué |
|:---|:---|:---|
| `LEXICON.md` §6.2 | **Nuevo archivo**: `SESSION-<usuario>.json` | `LEX-R21` |
| `LEXICON.md` §6.5e | La sesión es **de alguien**, y puede haber varias | `LEX-R21` |
| `CORE.md` | Regenerado | Deriva de `LEXICON` |

**Ninguna regla nueva, y ninguna modificada.**

**`LEX-R26` NO cambia, y conviene decirlo porque la forma se parece.** Esa regla declara que
`CHECKPOINT.json` **es uno**: responde por *la tarea en curso*, y escribirlo sobre otra la
sustituye. Sigue siendo cierto.

`SESSION.json` responde por **una sesión**, y con más de una persona hay varias a la vez. Un
archivo por sesión abierta no contradice `LEX-R26` — la complementa: es lo que hace que «la sesión
es un recurso temporal» (`PT-060`) tenga sentido cuando el recurso no es único.

**`SESSION.json` sin sufijo sigue siendo válido**, y es lo que tiene un proyecto de una persona.
