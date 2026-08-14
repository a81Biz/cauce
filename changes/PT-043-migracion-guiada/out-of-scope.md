# PT-043 — Fuera de alcance   `PHASE 4`

| Fuera | Por qué | Dónde va |
|:---|:---|:---|
| Preguntar cada decisión por consola | `migrate` corre en CI: una herramienta que espera `stdin` deja de poder verificarse | — |
| Proponer un valor por defecto para cada decisión | `SUITE-R19`: lo que no se automatiza no se inventa | — |
| Tomar alguna de las seis decisiones | Es lo que las hace humanas: el dato no está en el repositorio | — |
| Relajar `SUITE-R17` | El modo restringido se explica, no se levanta | — |
| Publicar `7.6.0` | Decisión humana explícita: «antes de publicar, debemos solventar todo» | — |
| Azure de punta a punta | Decisión humana: «es algo que haremos adelante». Ya vive en `PT-025`, que **no** sale de aquí: esta tarea no lo aplaza, lo tiene fuera | — |
| El YAML de `PT-039`…`PT-042` declara `phase: 1` y `status: DRAFT` mientras el registro dice `phase: 8` y `VALIDATION_PENDING` | Encontrado ejecutando. Repararlo activa `FDGE-R52` sobre cuatro tareas ya hechas, y las notas de reanclaje que pediría **no se escribieron**: fabricarlas ahora sería un rastro falso | `PT-044` |
| `npx @a81biz/cauce start` no arranca | Encontrado ejecutando el arranque documentado. Dentro del repositorio `npx` resuelve el paquete local y no halla el binario; fuera, la publicada más alta es `7.1.0` y no tiene `start` | `PT-045` |

## Las dos últimas filas

No son alcance que crece: son **defectos encontrados al ejecutar**, y por eso están en el tablero
con su `allocation` `DEFERRED` y su issue abierto (`SUITE-R44`) en vez de en un párrafo. Aplazar
algo lo pone a la vista.

`PT-044` toca trabajo de este mismo lote y **no se arregla aquí** por una razón que conviene
escribir: sincronizar los cuatro YAML es una línea por archivo, pero al sincronizarlos
`verify-fdge` empieza a exigir siete notas de reanclaje por tarea que nadie escribió. Ponerlas
retroactivamente es exactamente lo que el `HANDOFF` prohíbe —«fabricar artefactos para poner una
compuerta en verde»—, así que la decisión de qué hacer con ellas es humana y va a su propia tarea.
