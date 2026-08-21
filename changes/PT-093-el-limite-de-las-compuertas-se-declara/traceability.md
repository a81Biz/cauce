# PT-093 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | `EXEC-R04` declara su límite con la franqueza de `SUITE-R27` | E1 · E2 · E3 | `selftest.sh`: «EXEC-R04 declara que garantiza» · «…y que NO puede garantizar» · «…y que 0 revisores no es un descuido» | `salidas/declaracion.txt` | VERIFICADO |
| AC-02 | La constancia tiene **forma fija** | E4 · E5 | `selftest.sh`: «EXEC-R04a fija la forma de la constancia» · «…y dice DONDE mirar» | `salidas/declaracion.txt` | VERIFICADO |
| AC-03 | Un merge sin constancia se detecta a posteriori | E9 | `selftest.sh`: «AC-03 ya lo entrego PT-088, y se ve» | `salidas/declaracion.txt` | VERIFICADO |
| AC-04 | La decisión del firmante queda **registrada** | E1 · E2 | `EXECUTION-MODES.md` declara la decisión tomada | `salidas/declaracion.txt` | VERIFICADO |

## `AC-03` no requería trabajo, y decirlo es el trabajo

`PT-088` lo entregó, con su límite en el mensaje. Escribir código para un problema resuelto habría
sido ceremonia — es la segunda vez en el lote que un `AC` resulta estar hecho (`PT-089` `AC-03` fue
la primera), y las dos veces se dice en vez de disimularlo.

**Y tiene escenario**, porque `FDGE-R15` lo cazó como criterio huérfano — igual que a `PT-089`
`AC-05`. «Ya está hecho» también se enseña: el mensaje de `PT-088` está ahí y se comprueba.

## `AC-04` es la decisión, y se declara cuál se tomó

**Declarar el límite, no construir una prevención.** Es la salida que la auditoría señalaba como
más probable, y `PHASE 2` midió que los cuatro caminos alternativos mueven el problema a otro sitio.

Escrita bajo el VoBo vigente, con su base en `SESSION_LOG.md`. **Es la única decisión del lote que
el firmante quizá quiera revisar**, y se dice aquí en vez de darla por cerrada.

## Lo que apareció y no estaba en ningún `AC`

`LEX-R24` admite sub-identificadores y **los dos extractores de `build-core` los rechazaban**: la
regla contaba como existente y no llegaba a `CORE.md`. Está en `E6` y `E7`, que son el mismo hecho
por sus dos lados — el resultado y la causa.
