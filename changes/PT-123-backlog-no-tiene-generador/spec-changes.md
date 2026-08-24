# `PT-123` — Cambios de especificación   `PHASE 4`

## `RULES.md` · `FDGE-R31` — enumeración incompleta

| | |
|:---|:---|
| **Antes** | *«El índice de origen (`DISCOVERY.md`, `ENRICHMENT.md` o `REFACTOR_SCOPE.md`)…»* — **tres** |
| **Después** | **Cuatro**, con `BACKLOG.md`, y se declara que de él se deriva **sólo el bloque entre marcas** |

**No cambia la obligación**: un índice que diverge sigue haciendo que `FPGE` re-proponga. Lo que
cambia es que la enumeración deja de presentarse como completa sin serlo — **la misma corrección
que `PT-129` hace en `FDGE-R19`, en el mismo lote**.

Y se añade una precisión que el caso roto obligó a escribir: **se comprueba contra el registro, no
contra la plataforma.** Un proyecto que no espeja también tiene índices.

## Lo que no cambia

- **`LEXICON`**: ningún vocabulario nuevo.
- **`RIGE_DESDE`**: la regla no empieza a juzgar nada nuevo. Empieza a **mirar** un cuarto archivo
  que ya estaba bajo su enunciado.
- **`CHANGELOG`**: entra como corrección al cerrar el lote. No es `MAJOR`.
