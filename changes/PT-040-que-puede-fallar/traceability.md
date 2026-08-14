# PT-040 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La lista se DERIVA de los fail() del codigo | E4 E7 | selftest.sh - «los fallos se DERIVAN del codigo» - «no hay lista escrita de fallos» | salidas/fallos.txt | - | VERIFICADO |
| AC-02 | Cada fallo aparece con su regla y quien lo emite | E5 | selftest.sh - «y son mas de cincuenta» | salidas/fallos.txt | - | VERIFICADO |
| AC-03 | Un fail() nuevo sin entrada se detecta | E4 | por construccion: la lista SE deriva, asi que no puede quedarse corta. Verificado leyendo la implementacion, no con un caso | salidas/fallos.txt | - | VERIFICADO |

## AC-03 se cumple por construccion, y eso se dice

No hay caso inverso posible: la lista no existe como dato, se calcula. Anadir un `fail()` la
cambia sola. Es mas fuerte que un caso, pero se verifica LEYENDO y no ejecutando, y por eso se
escribe aqui en vez de dejarlo pasar como si tuviera prueba.
