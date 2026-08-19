# PT-060 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Qué cambia | Por qué |
|:---|:---|:---|
| `LEXICON.md` §6.2 | **Nuevo archivo**: `SESSION.json`, sobrescribible, con su contrato | `LEX-R21` |
| `LEXICON.md` §6.5e | **Nuevo**: la sesión como entidad · `SESSION ≠ STATE ≠ TASK` | `LEX-R21` · antes que el código |
| `CORE.md` | Regenerado por `build-core` | Deriva de `LEXICON` |

**Ninguna regla nueva, y ninguna modificada.** Entra vocabulario y un archivo. `LEX-R26` —todo
campo se deriva— **se aplica** a `SESSION.json` sin cambiarla: `desde` es una **marca**, no
memoria, igual que el `sha` de `CHECKPOINT.json`.

**Lo que NO entra, y se declara:** los tres estados de sesión de la especificación original no
llegan a `LEXICON` §4. No son estados de tarea, y `LEXICON` §4 es donde viven los de tarea. Es la
corrección razonada en `EP-014` y confirmada aquí midiendo: durante un handoff la tarea sigue
`IN_PROGRESS`.
