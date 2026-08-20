# AUDIT_LOG — append-only   `PTSA-R06`

Registro inmutable y acumulativo de operaciones de auditoria. **No se sobrescribe** (`PTSA-R19`,
`PTSA-R67`): las revisiones se anaden al final.

---

## 2026-08-20 · PTSA-2026-08-20 · primera auditoria de cauce

**Disparo:** `[START PTSA]` a peticion del firmante, antes de publicar la `10.0.0`.
**Instruccion literal:** «necesitamos auditar el sistema completamente para buscar, encontrar y
eliminar cualquier riesgo que pudiera tener, usemos el mismo PTSA que tiene el propio marco de
trabajo para hacer la auditoria, que sea desde el mismo marco hasta su documentacion».

**Carga:** `CORE.md` + `CORE-PTSA.md` (`SUITE-R25`). Sin el overlay se habria auditado con 23 de
las 80 reglas.

**Arbol auditado:** rama `trabajo`, commit `b67dc92`, version `10.0.0`, 9 commits por delante de
`main` y **sin fusionar**: `G4` se retuvo a proposito para que la auditoria informara la decision
en vez de llegar despues.

| Operacion | Resultado |
|:---|:---|
| Universo enumerado desde 6 fuentes mecanicas | 51 elementos |
| Matriz `COVERAGE.md` | 204 celdas · 8 `NO_APLICA` · 196 de universo · 175 evaluadas |
| Evidencia capturada por shell | 10 (`E-001`..`E-010`), ninguna pedida al usuario |
| Hallazgos abiertos | 9 (`H-001`..`H-009`) |
| Productos con ficha | 4, ninguno en `DRAFT` |
| `verify-ptsa` | **sin errores** |
| Scores | `D1` 60 · `D2` 80 · `D3` 95 · `D4` 94 · Health 79.9 · Risk 73 · Confidence 0.94 |
| Certificacion | **B** |

**Dictamen:** no publicar todavia. `H-001` es un defecto del acto de publicar y cuesta una linea.

**Hallazgo que la auditoria cerro sin proponerselo:** `TD-15` declaraba tres componentes nunca
ejecutados. Esta corrida es la primera ejecucion de `PTSA` y deja dos: `QA` y `FPGE`.

**Ningun hallazgo se cierra aqui.** `PTSA-R44`: los de tipo `BUG` y `DOMAIN` los valida y cierra
una persona.
