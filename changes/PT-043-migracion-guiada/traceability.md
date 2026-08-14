# PT-043 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Las decisiones humanas de la migración se conducen una por una | E5 E6 E13 | selftest.sh - «migrar CONDUCE, no enumera» - «el bloque se presenta por lo que es» - «sin pendientes no hay conductor» | salidas/legado.txt · salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Cada una dice que decide, por que no puede decidirla la maquina y que pasa despues | E1 E2 E3 E4 E7 E8 E9 | selftest.sh - «SUITE-R55 existe en RULES» - «y llega al nucleo» - «PHASES la cita» - «FDGE-Prompts la cita» - «cada decision dice por que es tuya» - «ninguna cae en el RULE-06 por defecto» - «ningun titular parte una palabra» | salidas/legado.txt · salidas/selftest.txt | - | VERIFICADO |
| AC-03 | El modo restringido se explica al entrar en el, no se descubre | E10 | selftest.sh - «el modo restringido se EXPLICA» | salidas/legado.txt | - | VERIFICADO |
| AC-04 | Migrar sin resolverlas sigue siendo imposible: no se relaja SUITE-R17 | E11 E12 | selftest.sh - «SUITE-R17 no se relaja: queda en el registro» - «y el codigo de salida sigue siendo 1» | salidas/selftest.txt | - | VERIFICADO |

## Lo que NO cubre, y estaba dicho antes de empezar

Ningun escenario prueba que las seis decisiones se **tomen**. No es comprobable desde aqui, igual
que `SUITE-R54` no puede comprobar que alguien lea el manual. Lo que se comprueba es que se
conduzcan: que esten numeradas, que cada una diga por que es tuya, y que ninguna se quede sin
motivo ni partida a media palabra.

## Los dos defectos que cerro esta trazabilidad

`D1` y `D2` de `PHASE 2` no aparecen como `AC` propios: son incumplimientos de `AC-02` que la
ejecucion contra el legado real hizo visibles. `E8` y `E9` existen para que no vuelvan.
