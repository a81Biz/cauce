# PT-058 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Decidir con la cifra: `SAFE` / `MARGINAL` / `UNSAFE` | PT-059 |
| `SESSION.json` y el handoff derivado | PT-060 |
| Serializar cifras con su naturaleza | PT-060 |
| Multiplicar, dividir, porcentajes | PT-059 |
| Ponderar la referencia de coste por antigüedad | — |
| Reescribir los 50 usos de `SIN EVALUAR` en prosa | — |
| Un cuarto valor para «medido pero poco fiable» | — |
| Medir el contexto restante del modelo | — |

**Las cuatro primeras son el resto del lote.** `PT-059` dirá qué operaciones necesita; adelantarlas
es inventar requisitos, y `sumar`/`restar` entran solo porque sin ellas `AC-03` no sería
comprobable.

**La quinta llegó aquí desde `PT-057` y sale del lote.** Ponderar por antigüedad cambia **qué
significa** la referencia —de «tu tipo de tarea» a «tu tipo de tarea, últimamente»—, y eso es una
decisión de producto del firmante, no un detalle de implementación. `PT-057` la mandó a `PT-058`
suponiendo que aquí se discutiría el **valor** de una cifra; se discute su **naturaleza**, que es
otra cosa. Queda **sin destino asignado**, declarado, en vez de colada en un lote donde no encaja.

**La sexta lleva `—` y es una decisión, no un olvido.** Los 50 usos son mensajes en prosa que
funcionan. Convertirlos a `cifra()` es un refactor de trece archivos —siete de ellos herramientas
que CI ejecuta— sin ninguna mejora hoy. El vocabulario queda declarado; la estructura se usa donde
hay cifras de presupuesto.

**La séptima:** una cifra poco fiable **es** una estimación. Ampliar el vocabulario es perseguir el
idioma, que es lo que `SUITE-R44` ya decidió no hacer.

**Y la octava gobierna el lote entero:** el marco **no puede** medir el contexto restante del
modelo. `SIN EVALUAR` existe precisamente para poder decirlo sin fabricar un número.
