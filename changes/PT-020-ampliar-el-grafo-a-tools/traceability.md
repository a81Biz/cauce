# PT-020 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | REGISTRY.graph.scope incluye docs/methodology/tools/ | E1 | `selftest.sh:…y las herramientas` | `evidence/PT-020/salidas/grafo.txt` | - | ✓ |
| AC-02 | El grafo regenerado contiene las herramientas | E3 | `selftest.sh:…y las herramientas` | `evidence/PT-020/salidas/grafo.txt` | - | ✓ |
| AC-03 | FDGE-R43 deja de dar por bueno un grafo que no describe el sistema | E4 | `selftest.sh:pt_at_generation no es 0` | `evidence/PT-020/salidas/inversa.txt` | - | ✓ |
| AC-04 | El alcance excluye dependencias, fixtures y mocks (FND-R28) | E2 | `selftest.sh:sin desbordar a la raiz ni a changes` | `evidence/PT-020/salidas/grafo.txt` | - | ✓ |

## Declarado NO verificado   `RULE-06`

| Afirmación | Por qué no se verifica | Dónde queda |
|:---|:---|:---|
| Que el grafo **sirva** para decidir | No es mecanizable. Las tres expectativas de `strategy.md` se contrastan a ojo, y **dos de las tres no se cumplieron como estaban escritas** | [`self-review.md`](self-review.md) |
| Que las dos aristas `calls` entre archivos sean ciertas | **No lo son.** `verify-fdge.mjs` importa solo `./patrones.mjs`; el extractor resuelve por nombre y no por ámbito. Marcadas `INFERRED 0.8`, no `EXTRACTED` | `evidence/PT-020/salidas/grafo.txt` |
