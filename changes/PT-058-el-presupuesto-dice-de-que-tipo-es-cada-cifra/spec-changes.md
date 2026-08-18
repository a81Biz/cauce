# PT-058 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Qué cambia | Por qué |
|:---|:---|:---|
| `LEXICON.md` §6.5c | **Nuevo**: `MEDIDO`, `ESTIMADO`, `SIN EVALUAR` como vocabulario cerrado | `LEX-R21` · y regulariza 50 usos existentes |
| `CORE.md` | Regenerado por `build-core` | Deriva de `LEXICON` |

**Ninguna regla nueva, y ninguna modificada.** Entra **vocabulario**, que es exactamente lo que
`LEXICON` es. La obligación de declararlo ahí ya existe y es `LEX-R21`: esta tarea la **cumple**
para tres términos, uno de los cuales el marco lleva ocho lotes usando sin declarar.

**Esto corrige un incumplimiento, no innova.** `SIN EVALUAR` aparece 50 veces en trece archivos
—incluido `RULES.md`— y cero en `LEXICON`. Declararlo no es ampliar el marco: es ponerlo al día
con su propia regla.

`verify-suite` gana una comprobación (`AC-02`), pero no una regla: comprueba que `NATURALEZAS`
siga teniendo tres valores. La obligación que la respalda sigue siendo `LEX-R21`.
