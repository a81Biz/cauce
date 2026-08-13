# PTSA — espacio de trabajo de la auditoría

**Sin auditoría todavía.** Este archivo sostiene el espacio (`SUITE-R32`): un `PTSA/` creado y
nunca escrito desaparece en el primer clon, y `verify-ptsa` lo reportaría como «nada que
auditar» — indistinguible de «no aplica», que es justo lo que la regla existe para evitar.

`[START PTSA]` lo puebla: `RESUMEN.md`, `Products/P-NNN.md`, `Findings/H-NNN.md`,
`COVERAGE.md` y `Phases/`. Carga `CORE.md` **y** el overlay `CORE-PTSA.md` (`SUITE-R25`): sin
el overlay auditaría con 23 de sus 80 reglas.

PTSA audita los productos contra la **Declaración de Valor** firmada (`FND-R24`), que aquí
todavía no existe: la produce Foundation `PHASE 0`. Sin ella, la auditoría no tiene contra qué
contrastar.
