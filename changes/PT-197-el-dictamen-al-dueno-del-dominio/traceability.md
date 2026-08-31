# `PT-197` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El Dictamen existe como **componente declarado**, sin tocar herramienta | TS-01 | selftest §EP-026 | evidence/PT-197/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Tiene su especificación, su trigger y su sitio en `CASOS-DE-USO.md` | TS-02 · TS-03 | selftest §EP-026 | evidence/PT-197/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | Produce **un** entregable sobre este repositorio, y el firmante dice si sirve | TS-04 · TS-05 | selftest §EP-026 | evidence/PT-197/salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `AC-03` tiene dos mitades, y sólo una es mecanizable

**Que el entregable exista y tenga las tres secciones con veredicto de los cuatro productos** — eso
se comprueba, y son `TS-04` y `TS-05`.

**Que sirva** no se comprueba: lo dice el firmante. El intake lo reservaba desde el principio —
*«es la única evidencia de que el componente sirve»*— y `FND-R24` dice por qué: el agente puede
describir lo que un producto entrega, pero **si eso vale lo sabe quien conoce el negocio**.

## `TS-03` no es un adorno del `AC-02`

«Las tres secciones» se cumple con las tres **en cualquier orden**. Y la decisión primero es el
defecto típico de un entregable ejecutivo: **una recomendación buscando datos que la sostengan**.
El firmante eligió el orden explícitamente —*«las tres, y el orden importa»*—, así que el orden
**es** criterio y tiene su caso.

## El Dictamen no es evidencia de la tarea, y por eso no se cita como tal

`FDGE-R23` lo dijo en rojo: resuelve las rutas de la columna **dentro de `evidence/`**, así que
citar `docs/implementation/DICTAMEN.md` ahí afirmaba una ruta que no existe. Segunda vez en el
lote, tras `PT-206`.

Y la corrección no es cosmética: **el Dictamen es el PRODUCTO del componente**, no la evidencia de
la tarea. Vive donde vive el estado del proyecto. Lo que prueba que existe y cumple sus tres reglas
es `salida.txt`.
