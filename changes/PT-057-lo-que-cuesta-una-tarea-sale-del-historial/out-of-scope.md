# PT-057 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| `MEDIDO` / `ESTIMADO` / `SIN EVALUAR` | PT-058 |
| Decidir con la cifra: `SAFE` / `MARGINAL` / `UNSAFE` | PT-059 |
| `SESSION.json` y el handoff derivado | PT-060 |
| Ponderar la referencia por **antigüedad** | PT-058 |
| Medir el contexto restante del modelo | — |
| Predecir el coste de **una** tarea concreta | — |
| Guardar los costes en un archivo | — |
| Reescribir `HISTORY.log` para hacerlo estructurado | — |

**Las tres primeras son el resto del lote**, y su orden lo fijó el firmante.

**La cuarta es un hallazgo de esta tarea, no un olvido.** `BUG/TRIVIAL` sale más caro que
`BUG/STANDARD` porque sus tareas son anteriores a `FDGE-R19`, cuando un commit llevaba el trabajo
entero: la cifra describe con verdad un pasado que ya no aplica. Ponderar por fecha cambia **qué
significa** la referencia —de «tu tipo de tarea» a «tu tipo de tarea, últimamente»—, y eso es una
decisión de producto. Va a `PT-058`, que es donde ya se va a discutir qué vale una cifra.

**La quinta lleva `—` y gobierna el lote entero.** El marco **no puede** medir el contexto
restante del modelo, y fabricarlo sería un dato falso con forma de medida. Es la decisión 4 del
firmante, y `SIN EVALUAR` no significa cero.

**La sexta también:** esto da el coste **típico de un tipo**, no el de ésta. La dispersión medida
—`CHORE/STANDARD` de 398 a 2491 líneas— hace que prometer lo segundo sea vender una predicción
donde hay una referencia.

**La séptima:** un archivo con los costes diverge en cuanto se cierre la tarea siguiente
(`SUITE-R38`, `RULE-01`), y recalcular es barato.

**Y la octava:** `HISTORY.log` es append-only por `SUITE-R09`. Hacerlo estructurado significaría
reescribir 57 entradas, que es exactamente lo que la regla prohíbe. Su 33 % de cobertura no es un
defecto suyo: es que no es una tabla.
