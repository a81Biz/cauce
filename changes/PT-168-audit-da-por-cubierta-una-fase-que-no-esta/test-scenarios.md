# `PT-168` · `test-scenarios.md` — `PHASE 4`

| TS | Qué prueba | Cómo puede fallar | Mecanismo |
|:---|:---|:---|:---|
| `TS-01` | Una fase que **no está** en el documento sale como hueco | vuelve la búsqueda sin acotar | `chk` · `Zeta PHASE 1` |
| `TS-02` | …y dice **en cuál** falta | el mensaje deja de nombrar el documento | `chk` · `ausente en` |
| `TS-03` | Los **seis reales** no se vuelven huecos | el acotado se pasa de estricto | `chkno` · `FDGE PHASE` |
| `TS-04` | La anchura sigue publicándose | `audit` deja de recorrer `COMPONENTES` | `chk` · `(7 de 7)` |
| `TS-05` | El árbol real sigue **sin huecos** | aparece uno | `chk` · `sin huecos` |

## `TS-03` es el freno, y por poco no existe

**Un acotado que fallara siempre pasaría `TS-01` y `TS-02`** y sería peor que el defecto: los seis
componentes reales se volverían huecos y alguien quitaría la comprobación entera.

**Y casi pasa de verdad.** La primera versión acotó también el archivo **propio** del componente
—`FDGE-Prompts.md`, que es entero de FDGE y no tiene un `## FDGE` dentro— y produjo **46 huecos
falsos**. `TS-03` es lo que lo habría cazado si no lo hubiera visto antes a mano.

## `TS-01` es el caso que `PT-149` midió

Un componente de prueba con fases `1-3` y **cero** menciones en `PHASES.md` y `CORE.md` era
declarado **cubierto**. Ahora sale hueco en las tres.

## Lo que estos casos NO establecen

Que las **otras** dimensiones de `audit` no tengan el mismo patrón. No está medido.
