# PT-055 — Cambios de especificación   `PHASE 4`

`FDGE-R22` · lo que esta tarea cambia del comportamiento declarado.

| Qué | Antes | Después |
|:---|:---|:---|
| Argumentos posicionales de `verify-fdge` | sólo `PT-NNN`; un `EP-NNN` se descartaba en silencio | `PT-NNN` y `EP-NNN` |
| Alcance de `SUITE-R45` bloqueante | todos los lotes vivos cuando se pasa `--gate G4` | el lote bajo evaluación; todos si no se nombra ninguno |

**Ninguna regla cambia de texto.** `SUITE-R45` exige lo mismo; cambia a quién se le exige en
modo bloqueante. No hay entrada nueva en `RULES.md`, ni vocabulario nuevo en `LEXICON.md`.

**Documentación que sí hay que tocar:** la cabecera de uso de `verify-fdge.mjs`, que hoy sólo
enseña `--gate G4 PT-042`. Va en la tarea 2.

`CHANGELOG.md`: entrada en la versión que cierre `EP-017`. `PATCH` por sí sola — corrige
comportamiento sin romper compatibilidad —, pero la versión la fija el lote, no esta tarea.
