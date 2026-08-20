# PT-089 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | Divergencia con estado **terminal** en el registro: **error** | E1 | `selftest.sh`: «terminal en el registro y vivo en el YAML CAE» | `salidas/comprobacion.txt` | VERIFICADO |
| AC-02 | Entre estados **no terminales**: sigue siendo aviso | E3 · E4 | `selftest.sh`: «dos estados VIVOS distintos no son error» · «…ni dos terminales distintos» | `salidas/comprobacion.txt` | VERIFICADO |
| AC-03 | `avanzar` escribe **las dos** fuentes en el mismo acto | E7 · E8 · E9 | `selftest.sh`: «avanzar a la ultima fase marca terminal» · «…y lo escribe TAMBIEN en el YAML» · «…y no pisa un estado terminal ya declarado» | `salidas/divergencias.txt` | VERIFICADO |
| AC-04 | Las divergencias vivas quedan resueltas | E10 | `selftest.sh`: «el arbol real no tiene ninguna sin sincronizar» | `salidas/divergencias.txt` | VERIFICADO |
| AC-05 | `SUITE-R35` declara su fila en `RIGE_DESDE` | — | **no procede**, y se justifica abajo | `salidas/comprobacion.txt` | VERIFICADO |
| AC-06 | Tras el arreglo bajan los avisos y ninguno es de esta clase | E5 · E6 | `selftest.sh`: «una «phase» divergente NO es error» · «…pero si avisa» | `salidas/divergencias.txt` | VERIFICADO |
| AC-07 | El mensaje declara **qué no establece** | E2 | `selftest.sh`: «…y el mensaje dice que NO elige fuente» | `salidas/comprobacion.txt` | VERIFICADO |

## `AC-05` no procede, y decirlo es el trabajo

El intake pedía una fila en `RIGE_DESDE`. **No hace falta**: las seis divergencias se resolvieron
en esta misma tarea, así que la comprobación nace **verde** sobre el árbol existente.

`PT-088` sí la necesitaba —`EXEC-R04` nacía con 17 fallos sobre trabajo de agosto— y de ahí venía
el criterio. Copiarlo aquí habría añadido una fila que alguien tendría que mantener y que no
protege de nada. **`RIGE_DESDE` es para reglas que romperían el pasado, no para todas.**

## `AC-06` se cumple con otra cifra que la del intake

El intake decía «bajar de 65 avisos». Al abrir el lote eran **24**, y al resolver las seis quedan
**18** — ninguno de la clase que apaga comprobaciones.

La cifra del intake describía otro momento del árbol. Se dice, en vez de reescribirla como si
hubiera acertado.

## `AC-07` no estaba en el intake

Lo trajo `PT-087`, terminado el día antes: el límite de una comprobación tiene que **llegar al
mensaje**, no vivir en un comentario. Aquí el límite es que la comprobación **no dice cuál de las
dos fuentes tiene razón** — y sin esa frase, su rojo se leería como «manda el registro», que es lo
contrario de lo que `PT-004` decidió.
