# Escenarios de prueba — `PT-111`

| Caso | Qué establece |
|:---|:---|
| el espejo caza un título divergente | el defecto |
| …y **NO** marca el título correcto | **el negativo** |
| …y el mensaje dice con qué comando se corrige | `EXEC-R07` |

Se ejercen sobre `compararEspejo`, que es **pura**: sin red y sin tablero.

## Lo que NO se prueba

- **El cuerpo.** Se decidió no compararlo entero: los comentarios humanos son legítimos.
- **Azure.** Se mide sobre GitHub.
