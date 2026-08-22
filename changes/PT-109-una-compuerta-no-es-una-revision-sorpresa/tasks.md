# Tareas — `PT-109`

| # | Qué | Estado |
|:--|:---|:---|
| T-1 | Medir las reglas que cambian de severidad | HECHO · cuatro |
| T-2 | Buscar los `INCIDENTS.log` de los otros tres `INC` | HECHO · **no están** |
| T-3 | Casos en rojo, con el negativo | HECHO · cuatro |
| T-4 | La tabla y la envoltura de `warn` | HECHO |
| T-5 | `FPGE-R01` mira la fila | HECHO |
| T-6 | Reescribir los casos sobre el fixture | HECHO |
| T-7 | Declarar los tres `INC` inaccesibles | HECHO |

**`T-6` corrigió `T-3`.** Los primeros casos corrían `verify-fdge` sobre el **repositorio real** y
sobre una tarea concreta: fallaban porque la batería trabaja desde un proyecto de mentira, y
además habrían caducado en cuanto esa tarea dejara de tener el aviso.
