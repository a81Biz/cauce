# PT-031 — Estrategia   `PHASE 3`

| Camino | Por qué |
|:---|:---|
| Leer la matriz y comparar a ojo | Es lo que llevaba haciéndose; el caso lleva ahí desde que existe la tabla |
| Buscar palabras de exención en la prosa | `PT-018` ya demostró que perseguir el idioma siempre deja fuera el siguiente sinónimo |
| **Vocabulario cerrado en la matriz** | Una celda dice quién resuelve; si cita un artefacto o una regla, está hablando de lo exigido |

La comprobación no interpreta: **un nombre de archivo o un identificador de regla en una celda de
la matriz es el defecto**, porque esa celda debería contener sólo quién resuelve. Es la misma
forma que `SUITE-R44` — quitar la prosa en vez de mejorar el detector.

Y un aserto extra que no cuesta nada y protege lo importante: la fila de `G4` debe declarar
`ACK humano` en las tres columnas (`EXEC-R04`).
