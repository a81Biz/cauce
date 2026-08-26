# `PT-149` · `spec-changes.md` — `PHASE 4`

| Documento | Cambio | Naturaleza |
|:---|:---|:---|
| `CASOS-DE-USO.md` `E5` | la **Entrada** pasa de un paso a los cinco medidos | **corrige** — era falsa |
| `CASOS-DE-USO.md` `E5` | se declara que la frase «ninguna herramienta se toca» **no era cierta** hasta esta tarea | **corrige** |

**Ninguna regla cambia de enunciado ni de severidad, y no se añade ninguna.** `SUITE-R60` ya decía
lo que debía decir; lo que no había era un mecanismo que lo sostuviera. `CORE` sigue en **263**.

**Sí cambia el contenido generado de `CORE.md`**: aparece la línea de `FIDE` en el mapa de fases,
que faltaba. No es un cambio de especificación — es la especificación que ya existía, publicada.

**No sube versión.** `13.1.0` se mantiene: no hay contrato nuevo ni ruptura. Un proyecto ya
instalado que regenere `CORE.md` verá una línea más y ninguna menos.
