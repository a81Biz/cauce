# `PT-192` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Los cuatro casos siguen detectando lo que detectaban | TS-01 | selftest §7361 · §7362 · §7370 · §7408, en la corrida completa | evidence/PT-192/salida.txt | no aplica | pendiente |
| AC-02 | Añadir líneas al final del fuente **no** los pone en rojo | TS-02 | selftest §EP-026 · `anadir lineas al final NO rompe la extraccion` · `…y con tail -40 SI la rompia` | evidence/PT-192/manifest.json · salida.txt · inversa.txt | no aplica | pendiente |
| AC-03 | El ancla no casa su propia definición | TS-03 | selftest §EP-026 · `el ancla no casa la linea que la busca` | evidence/PT-192/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `AC-02` lleva su pareja, y hace falta

Que la extracción con ancla **aguante** 50 líneas nuevas lo cumple cualquier extracción que
funcione. La mitad que prueba que el arreglo **hacía falta** es la contraria: que con `tail -40`, el
mismo arnés falso, **falla**. Las dos están en la tabla.

## `AC-03` no es teórico

`selftest.sh:7355` documenta que el intento anterior de anclar por texto *«arrancaba en esta misma
línea»*. El caso impide reintroducirlo.

## Lo declarado sin cubrir

Otras extracciones posicionales del arnés (`test-scenarios.md`), y que nadie borre la marca — que es
una convención deliberada, no una garantía.
