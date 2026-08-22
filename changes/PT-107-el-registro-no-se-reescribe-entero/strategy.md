# Estrategia — `PT-107`

## La decisión

**A-1 · Se detecta y se detiene. No se bloquea, no se fusiona, no se reintenta.**

Una sola función escribe el registro y compara el archivo con lo que se leyó al arrancar. Si
cambió: **no escribe nada** y lanza, diciendo qué pasó y qué hacer.

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Un bloqueo de archivo** | un bloqueo mal liberado deja el proyecto **colgado** — peor que el defecto |
| **Fusionar las dos versiones** | fusionar sin saber cuál gana es como se pierde el dato que esto evita |
| **Reintentar automáticamente** | un reintento repite efectos ya ocurridos: abrir un issue, escribir una nota |
| **Escribir solo lo que cambió** | rehacer la serialización entera del registro, y con más superficie de error |

## Lo que NO se promete

**El registro no queda concurrente.** Dos comandos a la vez siguen sin poder trabajar juntos.
Lo que cambia es que ahora **uno de los dos lo dice** en vez de desaparecer.

Esa distinción es la tarea: no se arregla la carrera, se arregla el **silencio**.

## Por qué la prueba es la parte difícil

Una condición de carrera que no se reproduce no prueba nada. La inversa lanza **dos `asignar` en
paralelo** sobre el mismo registro y comprueba que, sin el guardia, queda **una** allocation
donde debían estar dos — exactamente lo que le pasó a `PT-106`.

Y el caso acepta **dos** desenlaces válidos: que entren las dos —si el sistema las serializó
solo— o que una falle **diciéndolo**. Lo que no acepta es que desaparezca en silencio.

## Termina cuando

Dos comandos a la vez no pueden perder una allocation sin decirlo, y la batería lo reproduce.
