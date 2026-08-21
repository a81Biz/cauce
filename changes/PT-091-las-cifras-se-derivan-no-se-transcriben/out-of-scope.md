# PT-091 — Fuera de alcance   `SUITE-R44`

| Qué queda fuera | Por qué | Destino |
|:---|:---|:---|
| Derivar la **prosa** del inventario | Que diga bien cuántas líneas tiene `tracker.mjs` no dice nada sobre si describe bien lo que hace. Sólo las cifras | `—` |
| Regenerar **Foundation** entera | Se ha ejecutado dos veces y no es lo que falla: falla que sus cifras no se recalculen entre ejecuciones | `—` |
| Las cifras de los **otros** documentos de Foundation | `services.md` es el que `PTSA-R76` usa como fuente del universo. Los demás se auditarán cuando alguien construya algo sobre ellos | `—` |
| Un `pre-commit` que las reescriba | Automatiza escritura sobre un documento firmado, y esconde el cambio dentro de un commit ajeno | `—` |
| Que la comprobación **falle** | Una cifra desviada no apaga ninguna comprobación. Bloquear ahí pondría el árbol en rojo cada vez que alguien añade diez líneas, y una comprobación así se apaga (`PT-023`) | `—` |
| Enumerar bien los **comandos** de `CLAUDE.md` | Se comprueba su **cantidad**, no que la lista sea la útil ni esté en orden. Eso es prosa | `—` |

## La última fila es el límite honesto de la tarea

`recuentosDeClaude` cuenta cuántos comandos declara la línea. **No comprueba que sean los que el
binario expone**, sólo que el número cuadre.

Un `CLAUDE.md` que dijera «install · install · install · install · install · install · install»
pasaría. Se dice, en vez de dejar que el verde signifique más de lo que mide.
