---
auditoria: PTSA-2026-08-20
estado: COMPLETE
phase_confidence: 0.90
---

# Las catorce fases, en una corrida

> `PTSA-R46` · `phase_confidence` = el minimo de `confidence` entre los hallazgos activos creados
> en esa fase. Aqui **0.90**, que es el de `H-009`: su probabilidad es la unica estimada y no medida.

| Fase | Que se hizo | Salida |
|:---|:---|:---|
| `PHASE 0` Value | La Declaracion de Valor ya existia **firmada** (`FND-R24`, `CLAUDE.md`), con cuatro productos y su criterio de validez. El auditor **no la redacto**: midio contra ella | 4 productos · 4 reglas de dominio `RD-01`..`RD-04` |
| `PHASE 1-3` Inventory→Scope | Universo enumerado desde fuentes mecanicas: `inventory/{services,integrations,entities}.md`, `bin/cauce.mjs`, `PHASE 0`. `routes` y `endpoints` declaran «no aplica» y se respeto | `COVERAGE.md` §1 · 51 elementos |
| `PHASE 4` Products | Un archivo por producto | `Products/P-001..P-004.md` |
| `PHASE 5` Criticality | Los cuatro son **primarios**: no hay secundarios que alimenten a un primario. `CORE.md` es transformacion de `P-001`, no producto aparte | — |
| `PHASE 6` **Traceability** | **Hito central** (`PTSA-R45`). Cadena completa e ininterrumpida para los cuatro productos, de derecha a izquierda, sin eslabon inferido | las 4 cadenas, en cada `P-NNN.md` |
| `PHASE 7` Technical `D2` | **No hay base de datos**: el «esquema real» aqui es `REGISTRY.json` y los artefactos de estado, leidos del arbol por shell, nunca de una migracion. Superficie de proceso, dependencias y CI auditadas | `E-001` · `E-006` · `E-010` |
| `PHASE 8` **Acid Test** `D1` | Los cuatro criterios firmados, medidos sobre la **salida real** y nunca sobre tests unitarios (`PTSA-R55`). `P-001` y `P-004`(a,b) pasan; `P-003` pasa su rubrica y falla el dominio (`PTSA-R17`) | `E-002` · `E-003` · `E-004` |
| `PHASE 9` Documentary `D4` | Cifras del inventario y de `CLAUDE.md` contrastadas con `wc -l` y `ls` | `E-007` · `E-008` |
| `PHASE 10` Observability `D3` | **Logs en vivo, no supuestos** (`PTSA-R51`): los 12 artefactos de estado leidos del arbol, con su tamano. `TRANSICIONES.log` ausente, y es correcto: solo nace sin plataforma | `E-005` · `E-009` |
| `PHASE 11-12` Consolidation | Matriz, coverage, los cuatro scores, `Risk`, `Confidence`, roadmap priorizado | `COVERAGE.md` · `RESUMEN.md` |
| `PHASE 13-14` Certification | `freshness 2026-08-20` · `audit_due 2026-09-20` · escala de riesgo declarada porque `PHASE 0` no la fijo (`PTSA-R24`) | `score-history.json` |

## Condiciones de halt que NO se dieron   `PTSA-R73`

Ninguna. Hubo shell, hubo credenciales de `gh`, y **no se pidio al usuario que ejecutara ni un
comando** (`PTSA-R61`). Las diez evidencias son de primera mano.

## Una decision de alcance, declarada

Los 36 documentos de `inventory/components.md` **no son filas de la matriz**. `PTSA-R15` prohibe
auditar modulos aislados sin trazarlos a un producto, y aqui los documentos **son** `P-001` y
`P-002`. Ademas, meterlos como 36 filas con `D2` y `D3` en `NO_APLICA` habria subido el `coverage`
sin auditar nada: la metrica habria mejorado por dilucion.

`verify-suite` los cubre a los 36 para `D4`, y su resultado —sin errores de coherencia— es lo que
sostiene el `PASS` de `D4` en `P-001`.
