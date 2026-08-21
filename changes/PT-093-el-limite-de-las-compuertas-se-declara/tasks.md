# PT-093 — Tareas   `PHASE 4`

| # | Qué | Archivo |
|---:|:---|:---|
| 1 | `EXEC-R04` declara qué garantiza y qué no | `docs/methodology/EXECUTION-MODES.md` |
| 2 | `EXEC-R04a` fija la forma de la constancia | `docs/methodology/EXECUTION-MODES.md` |
| 3 | `RE_PROSE_HEAD` y `rulesFrom` aceptan sub-IDs | `docs/methodology/tools/build-core.mjs` |
| 4 | `EXEC-R04a` en `RIGE_DESDE` | `docs/methodology/tools/patrones.mjs` |
| 5 | Emisión propia: constancia **malformada** ≠ ausente | `docs/methodology/tools/verify-fdge.mjs` |
| 6 | 8 casos, sección propia | `docs/methodology/tools/selftest.sh` |

## `3` no estaba en el plan, y es lo más grave que apareció

`LEX-R24` **admite** sub-identificadores con letra minúscula pegada. `reglasDelMarco` los aceptaba
y **los dos extractores de `build-core` los rechazaban**: escribí `EXEC-R04a`, el marco la contó
como regla —225— y **no llegó a `CORE.md`**, que es lo único que el agente carga.

Dos lectores del mismo hecho, divergentes. Es la enfermedad que la v4 existe para eliminar,
dentro de la herramienta que compila el núcleo.

Se arreglaron **los dos** extractores aunque sólo el de prosa tuviera una sub-regla hoy: dejar el
defecto en la mitad que no se estrenó es esperar a que lo encuentre otro.

## `4` lo pidió el marco solo

En cuanto la regla llegó a `CORE`, el detector de `PT-081` la cazó por no declarar desde cuándo
rige. **El mecanismo funcionando**, no una lista que alguien recordó mantener.
