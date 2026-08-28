# `PT-190` · `test-scenarios.md`

| | Escenario | Qué establece |
|:---|:---|:---|
| `TS-01` | `la palabra cerca del principio sigue eximiendo` | La heurística **no cambia** para quien ya dependía de ella (`CE-014`) |
| `TS-02` | `…y lejos deja de eximir: es un desplazamiento` | El defecto queda **visible y ejecutable**: misma palabra, misma línea, sólo más abajo |
| `TS-03` | `la declaracion explicita exime a cualquier altura` | La declaración vale **esté donde esté** |

Los tres usan el **mismo** fixture y varían **una sola** cosa: cuánto relleno precede a la palabra.
Es lo que hace la demostración concluyente — si variaran dos, no se sabría cuál manda.

`TS-02` **no** afirma que el comportamiento sea correcto: afirma que es el que hay. Un caso que
documenta un límite conocido es lo contrario de un caso que lo tapa (`RULE-06`).
