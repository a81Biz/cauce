# PT-148 · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `LEXICON` declara el contrato de componente y sus campos | TS-05 | — | — | n/a | `PENDIENTE` |
| AC-02 | `RULES.md` tiene la regla, con ID, severidad y propietario único | TS-06 | — | — | n/a | `PENDIENTE` |
| AC-03 | `CASOS-DE-USO` tiene la fila de alta y la de baja, **citando** la regla | TS-07 | — | — | n/a | `PENDIENTE` |
| AC-04 | Si la regla es `CHECK`, **existe el script que puede fallar** (`SUITE-R38`) | TS-01 · TS-02 · TS-03 · TS-04 | — | — | n/a | `PENDIENTE` |
| AC-05 | `CORE.md` y `CORE-PTSA.md` regenerados, no editados | TS-08 | — | — | n/a | `PENDIENTE` |

**`AC-04` es el criterio que más fácil se incumple sin notarlo**, y `RULES.md` lo dice: *«marcar
`CHECK` una regla que ningún script verifica es una promesa falsa»*. Media comprobación ya existe
—`verify-patrones` exige el contrato completo, con quince aserciones de `PT-144`, `PT-150`,
`PT-145` y `PT-146`—; la otra media **no**, y es `PT-148.2`.

**`TS-02` decide si el barrido sirve.** Un barrido que caza comentarios se desactiva en la primera
corrida, y un verificador desactivado es peor que ninguno.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `CORE` cambia **sólo** por la regla y el vocabulario nuevos | TS-08 · el `diff` se lee | `PENDIENTE` |
| RC-02 | Ninguna regla existente cambia de enunciado ni de severidad | `verify-suite` (`SUITE-R14`) | `PENDIENTE` |
| RC-03 | El vocabulario nuevo no colisiona | `verify-suite` | `PENDIENTE` |
| RC-04 | La regla nueva **puede fallar** | TS-01 | `PENDIENTE` |
