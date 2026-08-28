# `PT-193` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Los casos que usan el valor siguen midiendo lo mismo y en verde | TS-01 | selftest §EP-025 · `la palabra cerca del principio sigue eximiendo` · `…y lejos deja de eximir: es un desplazamiento` · `la declaracion explicita exime a cualquier altura` — y selftest §FDGE · `secreto en el intake ⇒ falla` | evidence/PT-193/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | El **fuente** de `selftest.sh` ya no contiene el literal entero | TS-02 | **sin caso de batería, y declarado** — ver abajo | evidence/PT-193/grep.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los dos del intake tienen escenario, y no hay escenario sin `AC`.

## `AC-01` cubre CUATRO casos, no tres   `spec-changes.md`

El intake decía «los tres casos de `PT-190`». Al pasar el eje del alcance del **fixture** al
**valor**, se partió también la aparición del fixture de `FDGE-R45` (`:1369`), y ese caso —`secreto
en el intake ⇒ falla`— pasa a estar afectado.

Se añade aquí en vez de dejarlo fuera: **tocar un fixture y no mirar su caso es exactamente la
regresión que `AC-01` existe para descartar.** El criterio no cambia de sentido; cambia el conjunto
al que se aplica, y ese cambio está declarado en [`spec-changes.md`](spec-changes.md).

## Por qué `AC-02` no lleva caso de batería   `SUITE-R26`

Un caso que buscara el literal entero dentro del arnés **tendría que contener el literal entero**
para buscarlo — y volvería a meterlo en el fuente y en la historia, que es exactamente lo que este
arreglo quita. El caso se destruiría a sí mismo.

Se comprueba con `grep` y la salida queda en `evidence/PT-193/grep.txt`, que **tampoco cita el
valor**: el patrón se ensambla en el comando. Es la misma regla que `SECRETOS-EXCEPCIONES.md` se
aplica a sí mismo —«se describen; no se reproducen»— y donde `PT-015` dejó esta misma comprobación.
