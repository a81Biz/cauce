# PT-128 — El cursor: donde estas, de donde vienes, a donde vas, y ningun nodo sin visitar

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-128
type: FEATURE
epic: EP-020
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-22
structural: si
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «usar github es una forma de asegurar que las cosas ocurren, pero no podemos hacerlo si no tenemos un cursor que nos indique en dónde estamos parados, de dónde venimos y a dónde vamos, lo más parecido a un cursor en un árbol binario donde cada nodo es una cajita que tiene el dato, el puntero de salida hacia la derecha y el de la izquierda, y va recorriendo los padres e hijos para no perderse ninguna puerta ningún comportamiento»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker cursor` responde, para la posición actual: el NODO, su DATO, de dónde se viene y a dónde se puede ir | un caso por cada uno de los cuatro campos |
| AC-02 | Los nodos y sus aristas se DERIVAN del registro, del árbol y de `PHASES.md`: ninguno se escribe a mano ni se recuerda | alterar el registro mueve el cursor sin tocar ningún .md |
| AC-03 | El recorrido baja y sube: de un lote a sus tareas y de una tarea a su lote, y dentro de una tarea recorre sus fases con sus compuertas como nodos propios | un caso que recorre EP -> PT -> PHASE -> G y vuelve |
| AC-04 | **La garantía es por ENUMERACIÓN, no por consulta**: el cursor puede decir qué nodos del subárbol NO se han visitado. Un nodo sin visitar se nombra; no se asume cumplido | el mismo principio que PTSA-R79: se cierra cuando la enumeración está completa, no cuando el que busca deja de encontrar |
| AC-05 | Un nodo que no se puede evaluar sale `SIN EVALUAR` y es distinguible de «visitado» | RULE-06 |
| AC-06 | El cursor no decide ni avanza: informa. Avanzar sigue siendo `tracker avanzar`, con su nota | la inversa: cursor no escribe nada en el registro |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: se puede preguntar «dónde estamos, de dónde venimos y a dónde vamos» y la respuesta enumera, en vez de recordar.

## 4. Qué NO entra   `[AGENTE]`

- OUT: sustituir a `tracker siguiente`: siguiente responde por una tarea; el cursor recorre el árbol. Si divergen, manda PHASES.md
- OUT: avanzar de fase. El cursor lee; escribir es de avanzar (FDGE-R52)
- OUT: dibujar el árbol. Es una respuesta de consola, no un gráfico
- OUT: sustituir al grafo de graphify: aquel es del código, éste es del recorrido

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es la columna vertebral del lote, y por eso es `S1`.** Sin cursor, una parada es una nota suelta en un flujo; con cursor, una parada es el DATO de un nodo del recorrido. `PT-115` define el nodo, `PT-116` lo escribe y esta tarea lo hace navegable.
- **El principio ya existe en el marco y no se inventa**: `PTSA-R79` —«parada por enumeración: la auditoría cierra cuando la matriz está completa, no cuando el auditor deja de encontrar hallazgos»—. Esta tarea lo aplica a la navegación, que es donde el firmante señaló el hueco: «para no perderse ninguna puerta ningún comportamiento».
- **El desafío honesto (`INTAKE-R07`)**: el árbol de cauce no es binario. Un lote tiene N tareas y una tarea tiene 11 fases; los punteros no son dos sino padre, anterior, siguiente e hijos. Se conserva la propiedad que el firmante pide —no perderse ningún nodo— y no la forma binaria, que aquí mentiría sobre la estructura.
- **Y hay una prueba disponible el día que se escriba**: recorrer `EP-019` entero y comprobar si el cursor habría nombrado los seis nodos que su cierre se saltó. Si no los nombra, el cursor no sirve.
