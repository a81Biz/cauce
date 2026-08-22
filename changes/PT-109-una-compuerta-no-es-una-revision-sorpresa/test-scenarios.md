# Escenarios de prueba — `PT-109`

| Caso | Qué establece |
|:---|:---|
| el aviso dice en qué compuerta se convierte en error | `INC-010` |
| …y **no** se la pega a una regla que no cambia | **el negativo** |
| `FPGE-R01` mira la fila del roadmap | `INC-015` |
| …y ya no casa cualquier línea que lo nombre | **el negativo** |

Sobre el **proyecto de mentira**, como el resto de la batería: correrlos sobre el repositorio real
los ataría a que una tarea concreta siga teniendo el aviso, y eso caduca.

## Lo que NO se prueba

- `INC-003`, `INC-005`, `INC-014`: **sin descripción accesible**.
- Si hay más reglas que cambian de severidad: se midieron con un `grep`.
