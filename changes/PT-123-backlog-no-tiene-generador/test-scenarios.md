# `PT-123` — Escenarios de test   `PHASE 4`

| TS | Escenario | Espera | Inversa que lo tumba |
|:---|:---|:---|:---|
| `TS-01` | `tracker indices --aplicar` escribe el bloque | el bloque aparece | no cubrirlo ⇒ el archivo vuelve a quedarse atrás |
| `TS-02` | El bloque declara el lote abierto con sus tareas | `EP-020` y sus PT | omitir uno ⇒ el índice miente |
| `TS-03` | Las cifras se **derivan** | «N de M cerradas» exacto | transcribirlas ⇒ caducan (`PT-091`) |
| `TS-04` | Un lote **cerrado** no sale como abierto | ausente | sacarlo ⇒ vuelve el defecto de los cuatro lotes |
| `TS-05` | Si el archivo declara otro lote, `verify-fdge` lo dice | `FDGE-R31` | callarlo ⇒ el generador existe y nada lo echa de menos |
| `TS-06` | Sin marcas, la herramienta **no toca** el archivo | mensaje, sin escritura | añadirlas solo ⇒ decide por su cuenta qué le pertenece |
| `TS-07` | Sin ningún lote vivo, lo **dice** | «Ninguna implementación abierta» | dejar el bloque vacío ⇒ indistinguible de no escrito (`FND-R22`) |

## La inversa que decide

`TS-04` y `TS-05`. Si un lote cerrado pudiera salir como abierto, o si nadie avisara de la
divergencia, el archivo volvería exactamente a donde estaba: **cuatro lotes declarando `EP-015`**.
