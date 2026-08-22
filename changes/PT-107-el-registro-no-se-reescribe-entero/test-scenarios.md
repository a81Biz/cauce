# Escenarios de prueba — `PT-107`

## En la batería — cuatro casos

| Caso | Qué establece |
|:---|:---|
| dos comandos a la vez no pierden una allocation en silencio | **el defecto** |
| …y si una no entra, se dice que no se escribió nada | el registro está intacto |
| ya no queda ninguna escritura del registro a ciegas | las cuatro, a cero |
| …todas pasan por el guardia | `SUITE-R38` |

Los dos primeros aceptan **dos desenlaces válidos**: que entren las dos —si el sistema las
serializó solo— o que una falle **diciéndolo**. Un caso que exigiera siempre el fallo dependería
del reloj, y sería intermitente.

## La inversa — dos retiradas, dos con efecto

```
S-1  el guardia entero    caen 3
S-2  la huella al leer    caen 3
```

**La inversa reproduce la carrera real**: lanza dos `asignar` en paralelo sobre el mismo
registro. Sin el guardia queda **una** allocation donde debían estar dos — que es exactamente lo
que le pasó a `PT-106`.

Una condición de carrera que no se reproduce no prueba nada.

## Lo que NO se prueba

- **Que la carrera no ocurra.** No se arregla la carrera: se arregla el **silencio**.
- **Si `CHECKPOINT.json` y `SESSION.json` tienen el mismo patrón.** Declarados y sin medir.
- **Cuántas veces pasó antes.** Una pérdida silenciosa no deja rastro.
