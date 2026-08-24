# Descubrimiento — `PT-128`

## Lo que había, y lo que faltaba

`tracker siguiente` responde **por una tarea**: en qué fase está y qué la bloquea. No recorre.

```
siguiente   una tarea · responde lo que se le pregunta
cursor      el ARBOL  · enumera lo que hay, se pregunte o no
```

La diferencia no es de alcance: es de **garantía**. Una consulta responde lo consultado; una
enumeración nombra lo que falta **aunque nadie pregunte por ello**.

## El principio ya estaba en el marco

`PTSA-R79`: *«parada por enumeración: la auditoría cierra cuando la matriz está completa, no
cuando el auditor deja de encontrar hallazgos»*.

Esta tarea lo traslada a la navegación, que es donde el firmante señaló el hueco: **«para no
perderse ninguna puerta ningún comportamiento»**.

## De dónde sale cada nodo

```
REGISTRY.json     las allocations y su relacion lote -> tarea
PHASES.md         las fases y sus compuertas          (fasesDeFDGE)
el ARBOL          changes/ y evidence/                el rastro de cada fase
```

**Ninguno se escribe a mano.** Alterar el registro mueve el cursor sin tocar un solo `.md`.

## Lo que la prueba declarada encontró

El intake dejó escrita su propia prueba: *«recorrer `EP-019` entero y comprobar si el cursor
habría nombrado los nodos que su cierre se saltó. Si no los nombra, el cursor no sirve»*.

**La primera versión no los nombraba.** Para un lote contaba:

```
PUEDES IR A
  17 tarea(s): 17 cerrada(s), 0 viva(s)
```

**Contar es lo contrario de enumerar**: un recuento correcto convive con cualquier hueco, porque
no dice **cuál**. Con la enumeración del subárbol:

```
tareas recorridas   17
SIN RASTRO          ninguno
SIN EVALUAR         68 nodo(s), nombrados uno a uno
```

## Lo que este descubrimiento NO establece

- **Que los 68 `SIN EVALUAR` sean huecos.** Son fases cuyo artefacto el cursor **no sabe
  nombrar** — `PHASE 0`, `2`, `5`, `7` no producen un archivo fijo. `RULE-06`: no saber no es lo
  mismo que estar mal.
