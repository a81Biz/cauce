# `PT-169` · `strategy.md` — `PHASE 3`

## Medir primero cambió la tarea

El encargo era *«quitar lo que ya no se usa o se duplica»*. Medido, **la poda no era el
cuello de botella**: 208 casos `trlib` cuestan **14 segundos entre todos**, y una corrida
filtrada costaba **252 segundos sin asertar nada**.

Si se hubiera empezado podando —lo natural— se habrían retirado casos legítimos persiguiendo
segundos que estaban en otro sitio.

## La corrección grande ya estaba escrita, sin cablear

`PT-086` dejó esto en un comentario:

> *«una sección inactiva se salta ENTERA: sus casos y su andamiaje. `--solo` filtraba solo
> aserciones, y por eso una corrida filtrada seguía costando 171 s de los 600.»*

**Y lo cableó sólo a `--afectados`.** El mecanismo existía, estaba probado, y el concepto que
necesitaba —«las secciones están filtradas»— estaba **pegado a su origen**: `AFECTADOS` significaba
a la vez *qué se filtra* y *por qué*. Separarlo en `ACOTADO` fue todo lo que hizo falta.

Es la misma forma que este marco lleva dos lotes persiguiendo: **un hecho con dos nombres, o dos
hechos con uno**.

## La regla: qué se decidió y con qué dato

| Decisión | Alternativa descartada | Por qué |
|:---|:---|:---|
| Disparador: **cerrar un lote** | «cada N tiempo» | Una fecha en un documento no la mira nadie. El cierre es contrastable y ocurre justo cuando los casos se acumularon |
| Obliga a: **publicar la cuenta por patrón** | «revisar la batería» | «Revisar» no es verificable. Una cuenta sí, y **cero es una cuenta** |
| Comprueba: **el fixture hueco** | los tres patrones | Los otros dos **se delatan solos** poniéndose en rojo. Gastar mecanismo en ellos sería duplicar lo que la propia batería ya hace |
| Adopción: **crece y se declara** | convertir los 61 de golpe | Un cambio grande y ciego sobre 61 fixtures rompería casos por razones que nadie sabría atribuir |

## Lo que NO se intentó, y por qué

**Paralelizar.** Es una vía legítima para el tiempo y está declarada `OUT` en el intake:
*«repartir el trabajo que no debería existir es esconderlo»*. Con el suelo de `--solo` en 47 s y la
corrida completa en 23,6 min, paralelizar seguiría siendo prematuro: primero hay que saber cuánto
de esos 23 minutos es trabajo **necesario**.
