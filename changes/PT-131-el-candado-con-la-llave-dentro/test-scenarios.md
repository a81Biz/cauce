# `PT-131` — Escenarios de test   `PHASE 4`

| TS | Escenario | Espera | Inversa que lo tumba |
|:---|:---|:---|:---|
| `TS-01` | Una tarea terminal cuyo `changes/` **está** en el tag más alto **no** cuenta como deuda | fuera de la lista | contarla ⇒ el caso falla — **es el comportamiento de hoy** |
| `TS-02` | Una tarea terminal cuyo `changes/` **no** está en el tag **sí** cuenta | en la lista | no contarla ⇒ la compuerta deja de proteger |
| `TS-03` | Una tarea terminal **sin trabajo** —`DEFERRED`, o cerrada sin artefactos— **no** cuenta | fuera de la lista | contarla ⇒ salen `PT-025` y `PT-032` |
| `TS-04` | Sin tag o sin git, devuelve `null` y el llamador dice `SIN EVALUAR` | `null` | devolver conjunto vacío ⇒ **todo** parecería sellado |
| `TS-05` | `verify-fdge --gate G2` y `tracker sellar` dan **la misma** cuenta | idénticas | dejar una copia sin migrar ⇒ divergen |
| `TS-06` | `ESTADOS_TERMINALES` sigue **sin** `DONE` | `DONE` ausente | meterlo ⇒ seis comprobaciones cambian |

## La inversa que decide si esta tarea vale

**`TS-02`.** El riesgo declarado en `PHASE 3` es que un observable equivocado se equivoque
**hacia el verde**. Si `TS-02` no puede ponerse en rojo, la compuerta ya no protege y el arreglo
es peor que el defecto.

**`TS-04` es la segunda.** Devolver un conjunto vacío en vez de `null` haría que **todo**
pareciera sellado: el verde por omisión que `RULE-06` prohíbe, en la comprobación que autoriza
`G2`.
