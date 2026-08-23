# `PT-116` — Cambios de especificación   `PHASE 4`

## Ninguno.

`FDGE-R55` y `LEXICON` §8.5 los escribió `PT-115`. Esta tarea **construye el medio** que esa regla
describe; no cambia ninguna regla, ningún nombre y ninguna obligación.

| Documento | Decisión | Motivo |
|:---|:---|:---|
| `RULES.md` | NO PROCEDE | `FDGE-R55` ya está escrita y no cambia |
| `LEXICON.md` | NO PROCEDE | Las dos listas ya están en §8.5. Aquí sólo se **derivan** en código |
| `RIGE_DESDE` | NO PROCEDE | Ninguna regla nueva |
| `CHANGELOG.md` | ACTUALIZADO al cerrar el lote | El comando entra en la entrada de `13.0.0` |

**Y una precisión que conviene dejar dicha:** la constante de las listas vive en `patrones.mjs`,
pero **`verify-suite` todavía NO la compara con `LEXICON` §8.5**. `PT-124` construyó esa
comparación para `TIPOS_DE_ITEM` y aquí falta la equivalente — queda **declarada**, no prometida
(`SUITE-R26`), y entra en `PT-117`, que es quien pone las exigencias de esta cadena.
