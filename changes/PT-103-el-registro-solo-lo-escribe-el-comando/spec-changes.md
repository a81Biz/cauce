# Cambios de especificación — `PT-103`

| | |
|:---|:---|
| Reglas nuevas | **`SUITE-R58`** (HARD) |
| Reglas modificadas | ninguna |
| Reglas derogadas | ninguna |
| `RIGE_DESDE` | `SUITE-R58: [12, 0, 0]` |
| Vocabulario nuevo | ninguno — `type` y `severity` ya están en `LEXICON` |

## `SUITE-R58` — el registro solo lo escribe el comando

Toda `allocation` nace con los campos que el marco exige, y los escribe `tracker asignar`, no
una mano. `verify-fdge` **avisa** de la allocation incompleta y **dice qué campo falta**.

**Avisa y no falla**, y no es indulgencia: durante 41 tareas `asignar` escribió cuatro campos de
nueve, así que lo anterior se escribió cuando el comando no permitía otra cosa (`SUITE-R09`,
`RIGE_DESDE`).

## Sube `MAJOR`

Una regla `HARD` nueva. La entrada del `CHANGELOG` y la guía de migración van en el sello del
lote (`SUITE-R57`), no aquí.

## Y una corrección que NO es un cambio de especificación

Al abrir esta tarea afirmé que `PT-100` había dejado `FDGE-R52` apuntando a un archivo
inexistente. **Es falso**: la regla nombra las dos ramas —issue si hay plataforma,
`TRANSICIONES.log` si no— y el archivo no existe aquí porque **sí** la hay. `FDGE-R52` **no se
toca**. Corregido en `SESSION_LOG.md`.
