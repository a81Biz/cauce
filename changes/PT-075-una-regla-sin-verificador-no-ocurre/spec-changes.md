# PT-075 — Cambios de especificación   `PHASE 4`

`FDGE-R22`.

| Qué | Antes | Después |
|:---|:---|:---|
| Regla | no existía | **`FDGE-R54`**, HARD: la viabilidad se consulta y **consta** antes de `G2` |
| `PHASE 4` | no nombraba la viabilidad | la cita, con el comando |
| `REGISTRY.allocations[]` | sin `viabilidad` | bloque `viabilidad` derivado |
| `tracker viabilidad` | sólo consulta | `--registrar` escribe lo derivado |
| `SUITE-R42` en `verify-fdge` | comprobaba que el PR **exista** | y además que el PT no se escribiera en la rama de integración, y que el comando humano esté **descrito** |
| `10-Technical-Debt` | — | `TD-14`: quién abrió un PR no es determinable desde el repositorio |

**`SUITE-R42` no cambia de texto.** Ya decía las dos cosas; lo que se añade es el verificador de
la mitad que no tenía.

**`FDGE-R54` es regla nueva ⇒ `MINOR`** en `CHANGELOG.md`. La versión la fija `EP-017` al
cerrar, no esta tarea.

**Migración:** los PT ya integrados no llevan `viabilidad` y **no se retrofecha** — la
comprobación mira los vivos. Mismo criterio que `FDGE-R19` y `FDGE-R52`.
