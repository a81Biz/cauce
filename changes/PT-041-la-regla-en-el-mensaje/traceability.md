# PT-041 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Se pide una regla por ID y responde que exige y quien la comprueba | E1 E2 | selftest.sh - «una regla responde que exige» - «y quien la comprueba» | salidas/regla.txt | - | VERIFICADO |
| AC-02 | El mensaje del fallo lleva a la regla | E8 | selftest.sh - «un ID de regla no es una ruta» + MANUAL y CASOS-DE-USO remiten al comando | salidas/regla.txt | - | VERIFICADO |
| AC-03 | Una regla que no existe lo DICE | E3 E6 | selftest.sh - «una regla que no existe lo DICE» - «las no comprobadas se declaran» | salidas/regla.txt | - | VERIFICADO |

## AC-02 es mas debil de lo que suena

El mensaje de fallo sigue diciendo solo el ID: lo que cambia es que ahora ese ID **se puede
consultar**, y el manual y el catalogo dicen como. Imprimir la regla entera en cada fallo haria
ilegible la salida — esta declarado en el `out-of-scope`. Un revisor puede sostener que «llevar a
la regla» exige mas que «poder preguntarla», y tendria razon en que esto es lo minimo.
