# Escenarios de prueba — `PT-105`

## En la batería — siete casos

| Caso | Qué establece |
|:---|:---|
| un no-`BUG` que cierra Validación pasa a `DONE` | el peldaño que faltaba |
| …pero un `BUG` **NO**: se detiene | `FDGE-R26`, `LEX-R08`, `SUITE-R06b` |
| …y sigue parando en Validación | el peldaño de `PT-099`, intacto |
| …un estado ya terminal **no** se toca | `FDGE-R53` |
| …tampoco uno ya integrado | idem |
| …y no se escribe en una fase cualquiera | la atadura a la fase |
| el peldaño se ata al **nombre** de la fase | renumerar no lo apaga en silencio |

## La inversa — cuatro retiradas, cuatro con efecto

```
S-1  el peldano de en medio         caen 2
S-2  la exclusion del BUG           caen 1
S-3  la guarda del estado terminal  caen 2
S-4  la atadura a la fase           caen 1
```

Cada medida llama al módulo **en un proceso aparte**: `import` cachea, y con la versión rota ya
cargada se mediría siempre el código bueno.

## Lo que NO se prueba

- **Si hay más estados que una compuerta exige y ningún comando escribe.** Se mide este.
- Que los quince `FEATURE` históricos fueran correctos. Llegaron a `INTEGRATED`, que es un hecho
  del árbol.
