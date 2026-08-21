# PT-089 — Cambios de especificación   `SUITE-R00` · `LEX-R22`

**Ninguna regla nueva.** `SUITE-R35` ya existía y ya era `HARD`. Lo que cambia es la **severidad
de un caso concreto** dentro de ella.

| Documento | Cambio |
|:---|:---|
| — | ninguno |

`RULES.md` no se toca: el texto de `SUITE-R35` —el registro asigna, todo lo demás espeja— describe
correctamente lo que ahora se comprueba mejor.

## Sin `RIGE_DESDE`, y hay que justificarlo

`PT-088` ancló sus dos reglas porque nacían con 17 fallos sobre trabajo de agosto. **Aquí no hace
falta**: las seis divergencias se resolvieron en esta misma tarea, así que la comprobación nace
**verde** sobre el árbol existente.

Un ancla que no protege de nada añadiría una fila que alguien tendría que mantener. `RIGE_DESDE`
es para reglas que romperían el pasado, no para todas.

## Lo que un proyecto destino nota

Si tiene una tarea terminal con el YAML atrasado, `cauce verify` pasa de avisar a **fallar**.

La instrucción es una línea, y va en la guía cuando el lote cierre:

```
Sincroniza el «status» del intake con el del registro. NO al reves: PT-004 dice que manda
el YAML, pero si el registro dice INTEGRATED es que la tarea se integro y el YAML se quedo
atras. Lo hace «tracker avanzar» desde esta version, y las de antes se arreglan a mano.
```
