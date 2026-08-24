# Estrategia — `PT-128`

## La decisión

**A-1 · Enumerar el subárbol, y decir de qué no se sabe.**

Tres respuestas posibles por nodo, y las tres hacen falta:

| | Qué significa |
|:---|:---|
| **con rastro** | la fase dejó su artefacto |
| **SIN RASTRO** | la tarea dice haber pasado y **no** dejó el artefacto |
| **SIN EVALUAR** | el cursor **no sabe** qué artefacto buscar (`RULE-06`) |

**Sin la tercera, el cursor mentiría**: marcaría como hueco toda fase que no produzca archivo.

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Contar tareas** | un recuento correcto convive con cualquier hueco: no dice **cuál** |
| **Un árbol binario** | el árbol de cauce no lo es: un lote tiene N tareas y una tarea 11 fases |
| **Que el cursor avance** | consultar dónde estás cambiaría dónde estás |
| **Sustituir a `siguiente`** | responden preguntas distintas; si divergen, manda `PHASES.md` |

## Lo que se conserva del planteamiento del firmante, y lo que no

Pidió *«lo más parecido a un cursor en un árbol binario»*. **Se conserva la propiedad** —no
perderse ningún nodo— y **no la forma**: los punteros aquí son padre, siguiente e hijos, no dos.
Fingir una forma binaria mentiría sobre la estructura.

## Termina cuando

Se puede preguntar dónde estamos, de dónde venimos y a dónde vamos, y la respuesta **enumera** en
vez de recordar.
