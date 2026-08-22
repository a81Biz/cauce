# Contexto — `PT-105`

## De dónde sale

**De aplicar `PT-103`, no de leer código.** `PT-104` fue la primera tarea de la sesión creada
entera desde el comando; al llegar a `PHASE 8` seguía en `DRAFT`, y `FDGE-R34` exige `DONE` para
pasar `G4`.

El defecto llevaba **quince `FEATURE`** sin verse porque siempre se había tapado escribiendo el
registro a mano. Arreglar el rodeo hizo visible lo que el rodeo ocultaba.

## La escalera, medida

```
PT-099   peldaño de abajo    BUG entra en Validacion   -> VALIDATION_PENDING
   ?     peldaño de en medio no-BUG sale de Validacion -> nada
PT-098   peldaño de arriba   fase FINAL (PHASE 10)     -> DONE o INTEGRATED
```

`G4` es `PHASE 9`. El único peldaño que escribía `DONE` estaba **después** de la compuerta que lo
exige.

## Por qué ninguna de las dos tareas anteriores lo vio

Cada una resolvía su propio caso y los dos eran correctos:

- `PT-098` corrigió que se escribiera `INTEGRATED` sin mirar el árbol.
- `PT-099` corrigió que la parada de un `BUG` dependiera de la memoria del agente.

**El hueco no era de ninguna de las dos**: aparecía solo al mirar la escalera entera, y a la
escalera entera solo se la mira cuando algo obliga a recorrerla sin atajos.

## Lo que este contexto NO establece

- **Si hay más estados que una compuerta exige y ningún comando escribe.** Se mide este.
