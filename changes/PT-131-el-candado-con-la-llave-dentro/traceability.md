# Trazabilidad — `PT-131`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | La deuda se cuenta contra lo que el tag CONTIENE, no contra lo que su registro declaraba | `TS-01` | `selftest.sh:lo sellado sale del arbol del tag` | ⏳ PHASE 6 |
| AC-02 | G2 deja de estar bloqueada para las 17 de EP-019 | `TS-01` `TS-05` | `verify-fdge --gate G2 PT-129` | ⏳ PHASE 6 |
| AC-03 | La regla SIGUE bloqueando trabajo integrado que no esta en ningun tag | `TS-02` | `selftest.sh:trabajo fuera del tag SI cuenta` | ⏳ PHASE 6 |
| AC-04 | Sin poder leer el arbol o el tag sale SIN EVALUAR, no verde | `TS-04` | `selftest.sh:sin tag ⇒ SIN EVALUAR` | ⏳ PHASE 6 |
| AC-05 | Se declara el limite: no arregla que el estado terminal llegue tarde | — | `out-of-scope.md` cita PT-121 | ⏳ PHASE 6 |
| AC-06 | Una tarea sin trabajo no cuenta como deuda | `TS-03` | `selftest.sh:sin trabajo no hay nada que sellar` | ⏳ PHASE 6 |
| AC-07 | Los dos llamadores derivan del MISMO sitio | `TS-05` `TS-06` | `selftest.sh:sellar y verify-fdge cuentan igual` | ⏳ PHASE 6 |

**`AC-06` y `AC-07` salieron de `PHASE 2` y `PHASE 3`** y no estaban en el intake: la segunda
condición del observable la descubrió medir —`PT-025` y `PT-032`—, y la duplicación la dio el
grafo. Se declaran como ampliación en vez de aparecer en el diff sin explicación.
