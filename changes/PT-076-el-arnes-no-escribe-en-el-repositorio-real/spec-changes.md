# PT-076 — Cambios de especificación   `PHASE 4`

`FDGE-R22`.

| Qué | Antes | Después |
|:---|:---|:---|
| `sesion abrir` / `sesion cerrar` en el arnés | invocadas por `TRR` contra el repositorio real | por `TR` contra el fixture |
| Invariante del arnés | no declarado | **ninguna acción que escriba se invoca por `TRR`**, y un caso lo comprueba derivándolo del código |
| `SESSION_LOG.md` | 140 entradas de origen desconocido | las mismas, **declaradas** |

**Ninguna regla nueva y ninguna herramienta cambia de comportamiento.** Lo que cambia es desde
dónde se la invoca al probarla, y que eso pase a ser comprobable.

`CHANGELOG`: `PATCH` por sí sola. La versión la fija `EP-017` al cerrar.
