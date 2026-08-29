# `PT-198` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un `status` con comentario en línea **se lee** | TS-01 · TS-05 | selftest §EP-026 | evidence/PT-198/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Un intake **sin** `status` sigue fallando | TS-02 | selftest §EP-026 | evidence/PT-198/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | Los dos casos dan mensajes **distintos** | TS-03 | selftest §EP-026 | evidence/PT-198/manifest.json · salida.txt | no aplica | pendiente |
| AC-04 | La expresión vive en **un** sitio, no en siete | TS-04 · TS-05 | selftest §EP-026 | evidence/PT-198/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los cuatro tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## Doce casos, no cinco

Los escenarios son cinco; los casos ejecutables, **doce**. Los de más son parejas, no escenarios:

| Pareja | Sin ella |
|:---|:---|
| `…y la expresión anclada de antes NO casaba` | `TS-01` lo pasa cualquier lector y no prueba que el arreglo hiciera falta (`PT-192`) |
| `…y el ausente sigue diciendo que NO lo declara` | `TS-03` lo cumple un mensaje único que diga siempre «ESTÁ»: el defecto de hoy con el texto cambiado |
| `…y sobre un archivo que SÍ la tiene, la ve` | `TS-04` lo cumple un `grep` roto — `CE-005` dentro del caso escrito para impedirlo |
| `escribir el campo CONSERVA su comentario` | Un lector que lea y un escritor que borre cambian un defecto por otro |

## `AC-04` dice **siete**, y el intake decía **tres**

La cifra del intake estaba medida sobre `status` solo. `discovery.md` §1 la corrige: son **siete
expresiones sobre cuatro campos** —`type`, `phase`, `status` ×4, `epic`—. Se corrige aquí en vez de
dejarla en tres, que es lo que `CE-010` castiga: una cifra transcrita que ya no describe el árbol.

## `TS-05` no es un extra

`AC-04` lo cumpliría un sitio único que sólo atendiera a `status`, dejando `phase`, `type` y `epic`
con la misma avería. Eso sería escribir la herramienta correcta y no invocarla — `CE-007`, en la
tarea que lo persigue.
