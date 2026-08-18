# PT-051 — Autorrevisión   `PHASE 6`

## Lo entregado

```
regla SUITE-R34 --donde    verify-fdge.mjs:472    fail     1 emision
regla SUITE-R35 --donde    dos herramientas       8 emisiones, todas con su linea
regla SUITE-R22 --donde    «ningun verificador la emite con su nombre» + TD-08
regla --donde              exit 2, error explicito
casos                      550 → 563
```

**No se añadió una capacidad: se dejó de tirar una.** `fallosPosibles` ya recorría cada `fail()`
uno a uno y descartaba el `m.index`. Lo que cambia es que la información que ya circulaba llega
entera a quien pregunta.

Y la forma pública no cambia: `herramientas`, `bloquea` y `avisa` se **derivan** de las emisiones.
Guardarlas aparte habría creado dos fuentes del mismo hecho — `SUITE-R38`.

## El defecto que la propia tarea destapó, y era mío

La primera versión de esta función escribió el patrón literal `fail('SUITE-R35', …)` **dentro de
su propio comentario**. `--donde` lo delató en la primera ejecución:

```
SUITE-R35   regla.mjs:69   fail        ← un comentario
```

**El defecto ya existía antes de esta tarea y era invisible.** `fallosPosibles` siempre casó
dentro de comentarios; sin número de línea, un archivo de más en la lista de «quién la comprueba»
no llama la atención de nadie. Bastó **poner la línea** para que saltara.

Medido: de las 214 coincidencias, **una** estaba en un comentario, y era la que yo acababa de
escribir. Las 213 anteriores estaban limpias.

Se arregló en los dos sentidos: el comentario ya no lleva el patrón, y hay una **guarda** para que
el siguiente no pueda. Su límite se declara —es una heurística de línea, y un `fail()` en la misma
línea que código detrás de un bloque `/* */` se contaría—, porque una heurística sin límite escrito
se acaba leyendo como una garantía.

## El caso que discrimina, y por qué hacía falta

```
texto de prueba:  linea 2   fail('ZZ-R99', 'primera')
                  linea 5   fail('ZZ-R99', 'segunda')

con m.index                 →  2,5   LINEAS_DISTINTAS
con indexOf(m[0])           →  2,2   MISMA_LINEA
```

**Con una sola emisión por archivo, las dos implementaciones dan lo mismo.** Un caso escrito sin
pensarlo habría pasado con la versión rota — y esa versión da una línea **plausible**: quien la
abriera vería código y creería que es el que busca. Una línea equivocada y creíble es peor que
ninguna.

Es el mismo defecto que `PT-043` documentó leyendo las entradas `CORRIGE` de `HISTORY.log`. **La
segunda vez que aparece en el repositorio, y la primera que se le escribe un caso.**

## Comprobación inversa, en las dos direcciones

```
lineaDe con indexOf(m[0])       ✗ «dos emisiones dan lineas DISTINTAS»
sin la guarda de comentarios    ✗ «…y una COMENTADA no cuenta»
```

Y un descuido al ejecutarla que conviene decir: el segundo restaurado se lo tragó un `|| true` mal
puesto, así que el árbol quedó un momento sin la guarda. Lo delató el `grep` de comprobación —**la
misma disciplina de comprobar después de restaurar que evitó dejarlo así**— y se repuso antes del
commit.

## Lo que no da

`--donde` responde **dónde se emite**, no **por qué se llega ahí**. Un `fail()` dentro de una
función auxiliar da una línea correcta y aun así el lector puede querer ver quién la llama. Eso
exige analizar el flujo y está con `—` en el `out-of-scope`.

Y las **62** reglas sin verificador siguen sin tenerlo. `--donde` las hace visibles **una a una**
en vez de como una cifra en `TD-08`. Es menos que arreglarlo y más que nada.

`AC` sin cubrir: ninguno. Contradicciones con otras reglas: ninguna.
