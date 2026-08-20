# inventory/entities — los artefactos que el marco gobierna

> Foundation `PHASE 5` · 2026-08-19 · suite 9.0.0 · segunda ejecución. No hay base de datos: las «entidades» son archivos, y su
> esquema está en `LEXICON.md` §6.

## Entidad central

`docs/implementation/REGISTRY.json` — **el único asignador de identificadores** (`SUITE-R08`).

```json
{ "suite_version": "5.2.3", "execution_mode": "SUPERVISED",
  "foundation": { "generated": "…", "validated_by": "…", "pt_at_generation": 0 },
  "graph":      { "generated": "…", "scope": "bin", "pt_at_generation": 0 },
  "tracker":    { "plataforma": "github" },
  "counters":   { "PT":0,"EP":0,"QA":0,"QR":0,"QD":0,"H":0,"E":0,"P":0,"R":0,"INC":0 },
  "allocations": [] }
```

Asignar es leer `counters`, incrementar y añadir a `allocations` **en la misma operación**
(`LEX-R06`). Si el agente no puede escribir aquí, no puede asignar: se detiene.

## Identificadores

| Prefijo | Qué | Dueño |
|:---|:---|:---|
| `PT-NNN` · `EP-NNN` · `PT-NNN.M` | Trabajo, lote, tarea atómica | FDGE |
| `AC-NN` · `TS-NN` · `RC-NN` | Criterio de aceptación, escenario de test, control de regresión | Intake · FDGE |
| `QA-NNN` · `QR-NNN` · `QD-NNN` | Caso, ciclo y defecto de QA | QA |
| `H-NNN` · `E-NNN` · `P-NNN` · `U-NNN` | Hallazgo, evidencia, producto, bloque de fase | PTSA |
| `R-NNN` | Ítem de roadmap | FPGE |
| `INC-NNN` | Incidente / rollback | FDGE |

Monotónicos, únicos y permanentes: nunca se reutilizan, renumeran ni eliminan (`LEX-R04`).

## Estados

Tres enumeraciones y ninguna más (`LEX-R07`), en inglés y `MAYÚSCULA_CON_GUION_BAJO`. El ciclo
de vida: `DRAFT → READY → IN_PROGRESS → IN_REVIEW → {VALIDATION_PENDING} → DONE → INTEGRATED →
CLOSED`, con `BLOCKED`, `REJECTED`, `DEFERRED` y `REVERTED` como ramas.

Un ítem de tipo `BUG` **nunca** pasa de `IN_REVIEW` a `DONE` por acción del agente: pasa por
`VALIDATION_PENDING` y solo un humano lo mueve (`LEX-R08`).

## Ledgers   `docs/implementation/`

| Archivo | Modo | Contiene |
|:---|:---|:---|
| `HISTORY.log` | append-only | Un registro por PT cerrado, con `Estructural: sí\|no` y la línea `Compuertas:` |
| `INCIDENTS.log` | append-only | Un registro por `INC-NNN` |
| `SESSION_LOG.md` | append-only | Una entrada por sesión |
| `RECONCILIATION.log` | append-only | Una decisión por documento reconciliado |
| `MIGRATION.log` | append-only | Una entrada por migración de versión |
| `INSTALL.log` | append-only | Lo que la instalación **ejecutó**, con etiqueta `[Ln]` por decisión |
| `HANDOFF.md` | sobrescribible | Abre con el bloque `ESTADO` (`SUITE-R33`) |
| `BACKLOG.md` | regenerable | PTs vivos y su fase |
| `LAYOUT.md` | firmado, no se sobrescribe | El terreno resuelto en `G0` |
| `SECRETOS-EXCEPCIONES.md` | append | Una fila por huella firmada |

**Append-only es literal** (`SUITE-R09`): corregir una entrada pasada se hace con una entrada
nueva que la referencia. Esta instalación lo aplicó a sí misma — la corrección de `SUITE-R40`
es una entrada nueva de `INSTALL.log`, no una edición de la anterior.

## Estado actual de este proyecto

Contadores a cero, `allocations` vacío: ningún PT abierto ni cerrado. El único trabajo
registrado es la instalación y este paquete de Foundation.
