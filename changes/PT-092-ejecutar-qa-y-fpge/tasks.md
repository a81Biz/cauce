# PT-092 — Tareas   `PHASE 4`

| # | Qué | Archivo |
|---:|:---|:---|
| 1 | `FPGE` ejecutado: frescura, evidencia, candidatos, prioridad, emisión | `docs/implementation/ROADMAP.md` |
| 2 | Histórico append-only de la corrida | `docs/implementation/ROADMAP_HISTORY.log` |
| 3 | `QA` declarado **hueco**, con motivo | `docs/methodology/CASOS-DE-USO.md` |
| 4 | `TD-15` separa «no aplica» de «pendiente» | `docs/enterprise-documentation/10-Technical-Debt.md` |
| 5 | `INC-001` reconstruido y registrado | `docs/implementation/INCIDENTS.log` |
| 6 | `H-008` a `VALIDATION_PENDING` con lo que queda | `PTSA/Findings/H-008.md` |
| 7 | 11 casos, sección propia | `docs/methodology/tools/selftest.sh` |

## `5` no estaba en el plan

Apareció **ejecutando `FPGE PHASE 2`**, que es la fase que lee los hallazgos vivos. Sin ejecutar el
componente, el cierre perdido habría seguido invisible.

Es el argumento del lote entero en pequeño: **ejecutar encuentra lo que leer no encuentra.**

## `4` es más que un retoque

`TD-15` contaba **tres** componentes sin ejecutar como si fueran el mismo hecho. Dos se han
ejecutado y el tercero **no aplica** — y «no aplica» y «pendiente» no debían sumarse nunca.
