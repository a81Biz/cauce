# Autorrevisión — `PT-128`

## Lo que establecí

Que se puede preguntar dónde estamos, de dónde venimos y a dónde vamos, y que la respuesta
**enumera el subárbol** en vez de recordar.

## Lo que NO establecí

- **Que los 68 `SIN EVALUAR` de `EP-019` sean huecos.** No lo son: son fases sin artefacto fijo.
  `RULE-06` — no saber no es lo mismo que estar mal.
- **Que el cursor cubra todo tipo de nodo.** Las compuertas viven dentro de su fase.

## Lo que encontré al retomar esto

**El código estaba escrito, sin confirmar, sin casos y sin evidencia**, con la tarea en `PHASE 1`.
Si se hubiera perdido la copia de trabajo, desaparecía entero.

## Y la prueba que el propio intake declaró, falló

El intake escribió su condición: *«recorrer `EP-019` entero y comprobar si el cursor habría
nombrado los nodos que su cierre se saltó. **Si no los nombra, el cursor no sirve**»*.

**No los nombraba.** Para un lote contaba —«17 cerradas, 0 vivas»— y no enumeraba ni un nodo.

**Contar es lo contrario de enumerar**: un recuento correcto convive con cualquier hueco porque
no dice **cuál**. Es exactamente la forma que `PTSA-R79` rechaza, cometida en la tarea que existe
para aplicar `PTSA-R79`.

Añadida la enumeración del subárbol: 17 tareas recorridas, 68 nodos nombrados uno a uno.

## Lo que hace que esto no mienta

**Tres respuestas, no dos.** Sin `SIN EVALUAR`, el cursor marcaría como hueco toda fase que no
produce archivo — `PHASE 0`, `2`, `5`, `7`— y estaría **inventando incumplimientos**. Distinguir
«no dejó rastro» de «no sé qué buscar» es lo que lo hace utilizable.
