# PT-063 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Qué cambia | Por qué |
|:---|:---|:---|
| `RULES.md` · `FDGE-R19` | **MODIFICADA**: la rama efímera pasa a `<type>/<usuario>/PT-NNN-slug` | Decisión 3 del firmante |
| `LEXICON.md` §6.5f | El formato de rama de tarea, junto al de `cauce/<usuario>` | `LEX-R21` |
| `CHANGELOG.md` | **Guía de migración**, obligatoria | `SUITE-R19` · es `MAJOR` |
| `CORE.md` | Regenerado | Deriva de `RULES` y `LEXICON` |

**Esta es la única tarea del lote que modifica una regla, y por eso el lote es `MAJOR`.**

**Lo que NO cambia de `FDGE-R19`**, y conviene decirlo porque es la mayor parte de la regla: los
commits atómicos, su formato, los prefijos prohibidos, los **tres niveles** de topología, que el PR
de una tarea es revisión y no `G4`, que `G4` no se multiplica, y que un PT vivo declara su rama en
el registro. Todo eso sigue igual.

Cambia **una cosa**: cómo se llama la rama efímera cuando hay personas declaradas.

**`EXEC-R03` no cambia.** `G4` sigue siendo una por lote, y esta tarea lo **comprueba** en vez de
darlo por hecho.

**La migración es leer.** `PHASE 2` lo midió: ningún verificador parsea el formato, así que ningún
proyecto instalado deja de funcionar. Las ramas existentes siguen valiendo — una rama abierta se
termina como empezó.
