# PT-023 — Autorrevisión   `PHASE 6`

## Qué se preguntó y qué se respondió

La pregunta era si `PT-018` declaró cambios de especificación que no hizo. La respuesta es **sí,
uno de tres** — y llegar a ella exigió mirar los cuatro candidatos que la medida escupió, porque
**tres de ellos no eran defectos**.

```
40 spec-changes.md · 110 filas · 4 candidatos · 1 defecto real
```

## El defecto, cerrado

`PT-018` declaró llevar a `FDGE-Prompts.md` lo mismo que a `RULES.md`. No lo tocó. Lo que quedó
fue el párrafo de `PT-013`, anterior, con la palabra **«normalmente»** — la prosa que `SUITE-R44`
existe para eliminar, dentro del documento que `SUITE-R20` manda que sea copiable tal cual.

Corregido, con cinco casos que comprueban el contenido y uno que comprueba que hay contenido.

## Lo que se declara NO verificable, con la cifra que lo sostiene

**Que una declaración de `spec-changes.md` se haya cumplido no es mecanizable.** No es una
limitación de esta tarea: es una propiedad de la declaración. Tres formas de falso positivo, las
tres observadas:

| # | Forma | Caso observado |
|:---|:---|:---|
| 1 | El trabajo entra bajo un commit del **lote** | `PT-037` y `PT-039` no tienen **un solo** commit que los nombre, y sus dos declaraciones están cumplidas |
| 2 | La declaración la cumple **otro PT** | `PT-022` (`EP-005`) escribió lo que `PT-018` (`EP-004`) declaró, cuatro días después, sin saberlo |
| 3 | La medida corre **antes** del commit | El script marcó a **`PT-023`**, esta misma tarea, mientras su cambio estaba sin commitear |
| 4 | **Mencionar** un PT en un mensaje de commit basta para «cumplir» su declaración | El commit de esta tarea nombra `PT-018` al explicar el defecto. Con eso, el defecto **desapareció de la medida** |

La cuarta es la que cierra la discusión, y apareció sola.

```
antes del commit de PT-023   PT-018 · FDGE-Prompts.md   ← el defecto, presente
después del commit           (no aparece)               ← «cumplido»
```

El commit `fc33e2b` corrige `FDGE-Prompts.md` **y** menciona `PT-018` cinco veces al explicar por
qué. El proxy busca el identificador en el mensaje: con eso, el trabajo de `PT-023` pasa a contar
como trabajo de `PT-018` y **el defecto que esta tarea existe para documentar se borra de su
propia medida**.

No hay forma de arreglarlo sin prohibir nombrar otro PT en un mensaje de commit, que es
exactamente lo contrario de lo que se quiere: los mensajes de este repositorio se citan entre sí
a propósito. El indicador y el hábito que lo haría útil son incompatibles.

Las tres primeras formas están en `salidas/medida-antes-del-commit.txt` y `salidas/medida.txt`;
la cuarta es la **diferencia entre los dos archivos**, y por eso se conservan ambos.

Un control con ese comportamiento no se lee: se silencia. Y un control silenciado es peor que
ninguno, porque ocupa el sitio del que haría falta.

## Lo que sí se puede afirmar, y por qué es menos

`E1`–`E4` comprueban el **contenido de un documento**. `E6`–`E7`, la **forma** de la medida —que
cuente sobre todas y que enumere en vez de resumir—, no sus cifras: 110 y 4 cambian con cada PT
nuevo, y fijarlas sería el hecho copiado de `RULE-01` dentro del caso que existe para cazarlo.

Es menos de lo que sería deseable. Es todo lo que se puede decir sin mentir.

## El riesgo que esta tarea corrió

**Cerrarla escribiendo un verificador**, para poder decir que `FDGE-R22` ya se comprueba. Habría
pasado si la medida se hubiera tomado después de decidir en vez de antes: cuatro candidatos leídos
como cuatro defectos, un verificador que los detecta, y una casilla marcada.

Lo impidió el orden: **medir, abrir los cuatro, y solo entonces decidir.** El resultado es que la
tarea entrega una corrección pequeña y un `NO SE PUEDE` con su cifra, en vez de una herramienta
grande que se equivocaría tres de cada cuatro veces.

## Lo que no resuelve

Que `PT-018` declarara tres cambios y ejecutara uno **sin que nada lo notara durante dos meses**.
Eso no se arregla aquí y tampoco con un verificador: lo encontró una persona revisando el tablero,
igual que `SUITE-R35` la primera vez. La conclusión incómoda es que **algunas cosas solo las caza
mirar**, y el marco debería decirlo en vez de dar por hecho que toda regla acaba teniendo script.

`AC` sin cubrir: ninguno. Contradicciones con otras reglas: ninguna.
