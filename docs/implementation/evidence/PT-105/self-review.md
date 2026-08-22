# Autorrevisión — `PT-105`

## Lo que establecí

Que `estadoDeFase` tiene los **tres** peldaños que el marco declara, y que ningún estado exigido
por una compuerta queda sin comando que lo escriba.

## Lo que NO establecí

- **Si hay más estados sin comando.** Se midió este; los demás quedan declarados y sin medir.
- **Que los quince `FEATURE` históricos fueran correctos.** Llegaron a `INTEGRATED`, que es un
  hecho del árbol. No se retrofecha.

## Lo que esta tarea enseña sobre el lote

**Salió de aplicar `PT-103`, no de leer código.** Mientras rodear el registro era rutina, este
hueco **no podía notarse**: cada tarea lo tapaba escribiendo `DONE` a mano sin registrar que lo
hacía.

Arreglar el rodeo hizo visible lo que el rodeo ocultaba. Es la razón de ser del lote entero, y
esta vez ocurrió dentro del propio lote.

**Y la escalera estaba a medias sin que ninguna de las dos tareas anteriores pudiera verlo.**
`PT-098` puso el peldaño de arriba y `PT-099` el de abajo; los dos correctos, cada uno en su
caso. El hueco solo aparece mirando la escalera entera — y a la escalera entera solo se la mira
cuando algo obliga a recorrerla sin atajos.

## Lo que hice bien esta vez

**La excepción se declaró antes del rodeo**, con alcance y condición de cierre. En las cuatro
primeras de la sesión el orden fue el contrario, y por eso cuatro quedaron calladas.

**No abrí un segundo sitio que escriba `status`.** `PT-099` lo dejó prohibido por escrito y la
tentación era real: una línea en `avanzar` habría sido más corta.
