# Trazabilidad — `PT-107`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Las cuatro escrituras del registro pasan por una funcion | `ya no queda ninguna escritura del registro a ciegas` · `…todas pasan por el guardia` | `selftest.sh:ya no queda ninguna escritura del registro a ciegas` · `selftest.sh:…todas pasan por el guardia` | `salidas/inversa.txt` |
| AC-02 | Compara con lo leido y no escribe si cambio | `dos comandos a la vez no pierden una allocation en silencio` | `selftest.sh:dos comandos a la vez no pierden una allocation en silencio` | `salidas/inversa.txt` |
| AC-03 | El mensaje dice cifras, comando y que hacer | `…y si una no entra, se DICE que no se escribio nada` | `selftest.sh:…y si una no entra, se DICE que no se escribio nada` | `salidas/inversa.txt` |
| AC-04 | No fusiona y no reintenta | ` la funcion solo lanza` | `por construccion: la funcion solo lanza` | `salidas/inversa.txt` |
| AC-05 | El registro nunca queda a medias | `el registro nunca queda ilegible` | `selftest.sh:el registro nunca queda ilegible` | `salidas/inversa.txt` |
| AC-06 | La bateria REPRODUCE la perdida | `la prueba inversa, con dos asignar en paralelo` | `la prueba inversa, con dos asignar en paralelo` | `salidas/inversa.txt` |

**`AC-06` es el que da valor a los demás.** Una condición de carrera que no se reproduce no
prueba nada: la inversa lanza dos `asignar` en paralelo y, sin el guardia, queda **una**
allocation donde debían estar dos.


> **Nota de forma.** Esta tabla se reescribió: la primera versión tenía **cuatro** columnas y
> el parser de `FDGE-R15` exige **cinco** —`AC` · criterio · escenario · test · evidencia—, así
> que **ninguna fila se reconocía**. Cuatro tareas quedaron con la trazabilidad inservible y el
> fallo solo aparece en `verify-fdge --all`, que no se corrió hasta que el firmante preguntó por
> el cumplimiento. El criterio y los tests salen ahora del `manifest.json`, que es la fuente.
