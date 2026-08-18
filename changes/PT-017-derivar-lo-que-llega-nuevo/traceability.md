# PT-017 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La lista sale de COMPARAR, no de una constante | E1 E5 | selftest.sh - «la lista sale de comparar» - «y nombra las dos que faltan» - «y conserva la frase que PT-043 usa» | salidas/selftest.txt · salidas/lista.txt | - | VERIFICADO |
| AC-02 | Anadir un archivo a tools/ aparece sin tocar el codigo | E2 | selftest.sh - «la lista sale de comparar» | salidas/lista.txt (6 -> 7 sobre el legado real) | - | VERIFICADO |
| AC-03 | Si no se puede comparar, se DICE | E3 | selftest.sh - «sin tools/ dice la suite entera» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | Un destino al dia no produce fila vacia | E4 | selftest.sh - «destino al dia, sin fila» | salidas/selftest.txt | - | VERIFICADO |

## Lo que NO cubre

Compara PRESENCIA, no contenido: una herramienta que existe en los dos lados pero cambio no
aparece — eso es `comparar-marco`. Y el filtro es `.mjs` y `.sh`: otra extension no la ve.
