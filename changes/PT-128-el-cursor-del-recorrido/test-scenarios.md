# Escenarios de prueba — `PT-128`

| Caso | Qué establece |
|:---|:---|
| dice **dónde estás** | `AC-01` |
| …de **dónde vienes** | `AC-01` |
| …y a **dónde puedes ir** | `AC-01` |
| …con el **dato** del nodo | `AC-01` · la «cajita», no un puntero suelto |
| un lote **enumera su subárbol**, no lo cuenta | `AC-04` · **la prueba del intake** |
| …nombrando cada nodo con su tarea y su fase | `AC-04` |
| …y distingue `SIN EVALUAR` de visitado | `AC-05` · `RULE-06` |
| las fases se derivan de `PHASES.md` | `AC-02` |
| el cursor **NO escribe** en el registro | `AC-06` · **el negativo** |
| …y lo **dice** en su salida | `AC-06` |

## Lo que NO se prueba

- **Que los 68 `SIN EVALUAR` de `EP-019` sean huecos.** No lo son: son fases sin artefacto fijo.
- **Que el cursor cubra todo tipo de nodo.** Recorre lotes y tareas con sus fases. Las compuertas
  aparecen **dentro** de la fase que las cierra, no como nodo propio.
