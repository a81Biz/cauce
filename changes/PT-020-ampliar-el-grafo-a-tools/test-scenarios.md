# PT-020 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `REGISTRY.graph.scope` | incluye `docs/methodology/tools` |
| E2 | AC-04 | …y **no** incluye la raíz ni `changes/` | no aparecen |
| E3 | AC-02 | El grafo regenerado | contiene las herramientas |
| E4 | AC-03 | `pt_at_generation` no es `0` | el último integrado |

## Lo que ningún caso puede comprobar

**Que el grafo sirva.** `E1`-`E4` comprueban que cubre lo que dice cubrir; las tres expectativas
de `strategy.md` —`patrones.mjs` como nodo central, `verify-fdge` como el mayor, la huérfana
aislada— se contrastan **a ojo** en `PHASE 6` y su resultado se escribe, se cumpla o no.

Es un `SIN EVALUAR` declarado, y prefiero eso a un caso que compruebe que un archivo existe y
llamarlo verificación.
