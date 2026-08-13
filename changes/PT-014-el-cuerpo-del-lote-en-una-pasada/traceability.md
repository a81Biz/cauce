# PT-014 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una sola pasada deja el cuerpo del lote completo | E1 E6 | selftest.sh - «el lote se crea el ultimo» - «el cuerpo del lote ya trae numero» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | El cuerpo del lote se compone despues de que sus tareas tengan numero | E1 E3 | selftest.sh - «el lote se crea el ultimo» - «entre tareas, el orden del registro» - inversa en rojo | salidas/inversa.txt | - | VERIFICADO |
| AC-03 | No se anaden llamadas de mas | E2 E4 E5 | selftest.sh - «y no se pierde ni se duplica» - «no muta la lista que recibe» - «sin nada que abrir, no revienta» | salidas/selftest.txt | - | VERIFICADO |

## Sobre AC-01

No se verifica abriendo un lote nuevo contra GitHub: no hay ninguno que abrir y **inventar uno
para probar dejaría basura en el tablero**. Se verifica sobre las dos piezas que componen el
resultado —el orden y el cuerpo— y se dice aquí que la comprobación es esa y no otra
(`RULE-06`).
