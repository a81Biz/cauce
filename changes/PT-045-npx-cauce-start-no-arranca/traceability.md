# PT-045 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un subcomando desconocido dice que pasa y que hacer | E1 E2 E3 E4 | selftest.sh - «un subcomando que no existe lo dice» - «y nombra el subcomando» - «y dice la version que corre» - «y da la salida por si es una copia vieja» - «su codigo de salida sigue siendo 2» | salidas/arranque.txt · salidas/selftest.txt | - | VERIFICADO |
| AC-02 | El arranque documentado funciona dentro del repositorio | E7 | selftest.sh - «npm start apunta al arranque» | salidas/arranque.txt | - | VERIFICADO |
| AC-03 | El manual y el catalogo declaran el comando que de verdad funciona | E5 E6 E8 E9 | selftest.sh - «el manual declara el caso autoalojado» - «y el catalogo tambien» - «sin subcomando NO es un error» - «y su codigo sigue siendo 0» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | SUITE-R50 sigue en pie: el tablero antes que el nucleo | E10 | selftest.sh - «el manual va antes que el núcleo» | salidas/arranque.txt | - | VERIFICADO |

## Lo que NO cubre, y estaba dicho antes de empezar

`npx @a81biz/cauce start` SIGUE sin arrancar desde fuera mientras la publicada sea 7.1.0. Lo que
se logra es que diga por que y que hacer. La causa desaparece al publicar, y publicar esta en el
out-of-scope del lote por decision humana explicita.
