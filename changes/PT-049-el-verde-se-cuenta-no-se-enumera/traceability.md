# PT-049 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `-q` reduce la salida a los fallos y el recuento, en las dos | E1-E2 · E5 · E11 | `selftest.sh` · 4 casos | `evidence/PT-049/salidas/selftest-q.txt` | - | ✓ |
| AC-02 | El recuento nunca se calla: sin denominador no hay veredicto | E3-E4 | `selftest.sh` · 4 casos | `evidence/PT-049/salidas/inversa.txt` | - | ✓ |
| AC-03 | Con fallos, `-q` los enumera todos | E6-E7 | `selftest.sh` · 4 casos | `evidence/PT-049/salidas/inversa.txt` | - | ✓ |
| AC-04 | El código de salida es idéntico con y sin `-q` | E8-E10 | `selftest.sh` · 3 casos | `evidence/PT-049/salidas/selftest.txt` | - | ✓ |

## Declarado NO verificado   `RULE-06`

| Afirmación | Por qué no se verifica | Dónde queda |
|:---|:---|:---|
| El **comportamiento** de `-q` en `selftest`, por la propia batería | Seis de los dieciséis casos comprueban la **forma**: ejecutar la batería dentro de la batería triplicaría su coste. Lo ejecutado de verdad está en la evidencia. `PT-050` lo hará barato | [`test-scenarios.md`](test-scenarios.md) |
| Que la salida en `-q` **baste** para decidir | Se comprueba que el recuento y los fallos están; que eso baste es un juicio. Por eso `-q` **no** es el defecto | [`test-scenarios.md`](test-scenarios.md) |
