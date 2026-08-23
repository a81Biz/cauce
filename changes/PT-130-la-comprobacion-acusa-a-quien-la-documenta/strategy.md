# Estrategia — `PT-130`   `PHASE 3`

> `FDGE-R54`: viabilidad **`SAFE`**, registrada.

---

## Las tres salidas, y por qué gana la tercera

| Opción | Por qué NO / SÍ |
|:---|:---|
| **Reescribir la prosa** para no nombrar identificadores cerrados | Es lo que se venía haciendo, y el intake lo dejó **fuera de alcance**: documentar la limitación en vez de quitarla. Y empeora el ledger, que es el activo |
| **Ampliar la lista de palabras de corte** (`INTEGRAD`, `CERRAD`, `CLOSED`…) | Es perseguir el síntoma: cada texto nuevo encontraría una redacción que no está en la lista. Y una lista de palabras que crece es `CE-008` esperando |
| **Anclar la lectura al sujeto** | **Gana.** La línea `tarea:` afirma **una** tarea en curso —el checkpoint es uno, `LEX-R26`— y ese es su sujeto: el primer identificador. Lo demás es contexto |

## El anclaje, y su guarda

```
sujeto = primer (PT|EP)-NNN de la línea «tarea:»
falla si   el registro lo tiene TERMINAL
y además   la propia línea NO dice que lo está
```

La segunda condición no sobra: decir «`PT-096` `INTEGRATED`, cerrada el martes» es **correcto**, y
acusarlo sería el mismo defecto por el otro lado — acusar al texto que acierta.

## Lo que no se toca

`SUITE-R34` **no cambia lo que establece**. El hecho que vigila —que el estado retomable no
contradiga al registro— es correcto; lo que fallaba era **cómo lo leía**. El intake lo dejó fuera
de alcance explícitamente.

La línea `implementación:` conserva su lectura: ya estaba anclada por adyacencia
(`EP-NNN … ABIERTA|CERRADA`), que es el mismo principio bien aplicado desde el principio.

## Declarar el alcance es parte del arreglo   `AC-03`

Un rojo sin alcance declarado se lee como «el bloque entero contradice al registro». `SUITE-R34`
entra en el registro de sujetos de `PT-087` diciendo qué establece **y qué no**, con `CE-017`
citada: la clase que la comprobación estuvo cometiendo.

## Enumerar, no prometer   `AC-04`

Las otras lecturas de alcance amplio se **derivan** —no se listan a mano, que caducaría— y quedan
en **once**, con archivo y línea. **No se arreglan aquí**: hacerlo sin un caso que sostenga cada
una sería cambiar once comportamientos a ciegas.

Y la enumeración distingue `null` de `[]`: sin fuentes dice «no se pudo mirar», no «cero». Es la
misma distinción que ya salvó a `PT-110` y a `PT-119`, y aquí tuvo su prueba práctica — la primera
versión del enumerador midió **cero** por una expresión rota, y un cero sin contraste es
indistinguible de un cero real.
