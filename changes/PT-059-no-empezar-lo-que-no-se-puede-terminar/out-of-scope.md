# PT-059 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| `SESSION.json` y el handoff derivado | PT-060 |
| De dónde sale la cifra y su naturaleza | PT-057 · PT-058 |
| Que la compuerta resuelva `G1`..`G4` | — |
| Partir automáticamente una tarea que no cabe | — |
| Escribir `BLOCKED_BY_CONTEXT` en el registro desde la consulta | — |
| Medir el contexto restante del modelo | — |
| Un contador de reintentos | — |

**Las dos primeras son el lote**, y las dos ya están hechas: esta tarea **consume** `costeDe` y
`cifra()` sin modificarlos.

**La tercera lleva `—`:** ésta es una compuerta de **viabilidad**, no de **gobernanza**. `G1`..`G4`
siguen decidiendo lo que decidían. Confundirlas metería una condición técnica dentro de una
decisión humana, que es lo contrario de lo que este marco existe para hacer.

**La cuarta también:** partir una tarea cambia su alcance, y el alcance lo firma una persona
(`INTAKE-R06`). La compuerta dice **que hay que partirla**; no lo hace.

**La quinta es una distinción que salió al diseñar:** `tracker viabilidad` **consulta**. Escribir
el estado de una tarea es de `tracker avanzar`, que hace sus siete actos o ninguno. Una consulta
que además escribe sería una acción con efecto oculto — exactamente lo que `PT-054` ordenó por
reversibilidad.

**La sexta gobierna el lote entero** y aquí es más literal que en ninguna otra tarea: `PHASE 2`
midió que `disponible = total − gastado` **no se puede calcular**, porque el total es el contexto
del modelo. La compuerta mide **precedente** en su lugar, y lo dice.

**Y la séptima:** un contador de reintentos diría «van tres veces» sin poder distinguir mala suerte
de imposibilidad. `AC-06` se deriva del historial completo, que sí sabe la diferencia.
