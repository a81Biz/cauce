# PT-057 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Qué cambia | Por qué |
|:---|:---|:---|
| `LEXICON.md` §6 | **Nuevo**: «referencia de coste», su contrato y `MINIMO_REFERENCIA` | `LEX-R21` · el nombre antes que el código |
| `CORE.md` | Regenerado por `build-core` | Deriva de `LEXICON` |

**Ninguna regla nueva, y ninguna modificada.** Lo que entra es **vocabulario**: qué es una
referencia de coste, de qué se deriva, y cuándo **no la hay**. No hay obligación nueva que imponer
a nadie — `tracker coste` responde una pregunta, no exige nada.

`LEX-R26` **no** aplica: habla del `CHECKPOINT.json` y esto no lo toca.

Se declara aquí porque `FDGE-R22` pide declarar el cambio **antes** de hacerlo, y porque el patrón
que este repositorio ha repetido —una regla escrita a mano en cuatro sitios que divergen— empieza
por introducir un nombre fuera de `LEXICON`.
