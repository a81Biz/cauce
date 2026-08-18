# PT-051 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `--donde` sobre una regla con verificador | archivo **y línea** |
| E2 | AC-04 | …sobre una emitida desde **dos** herramientas | las enumera todas |
| E3 | AC-01 | …y distingue `fail` de `warn` | el tipo va al lado |
| E4 | AC-01 | **Dos emisiones en el mismo archivo dan líneas DISTINTAS** | el caso que separa `m.index` de `indexOf` |
| E5 | AC-03 | `--donde` sobre una regla sin verificador | lo **dice**; no una lista vacía |
| E6 | AC-03 | …y cita la cifra de `TD-08` sin recalcularla | 62 |
| E7 | AC-02 | No hay tabla escrita: sale del código | el caso que ya existía sigue verde |
| E8 | AC-02 | `regla --fallos` no cambia | la forma pública se deriva |
| E9 | AC-02 | `regla <ID>` sin la bandera no cambia | idéntico |

`E4` es el caso central y el único que distingue una implementación correcta de una plausible.
Con **una sola** emisión por archivo, `m.index` e `indexOf` dan lo mismo y el caso pasaría con
las dos. `PT-043` documentó ese defecto en la lectura de las entradas `CORRIGE`.

## Lo que ningún caso puede comprobar

**Que la línea informada sea la útil.** Un `fail()` puede estar dentro de una función auxiliar
llamada desde otro sitio: la línea es correcta —ahí se emite— y aun así el lector puede querer
ver quién la llama. `--donde` responde *dónde se emite*, no *por qué se llega ahí*, y eso último
no es derivable sin analizar el flujo.
