# Trazabilidad — `PT-137`

| AC | Criterio | Escenario | Evidencia |
|:---|:---|:---|:---|
| AC-01 | Retoma sin exigir intake | `TS-01` `TS-02` `TS-03` `TS-13` | `salidas/casos-137.txt` |
| AC-02 | Firmante contrastado y fecha real | `TS-04` `TS-05` `TS-06` | `salidas/casos-137.txt` · `salidas/inversa.txt` |
| AC-03 | Se niega sobre lo que no es `DEFERRED`, diciendo el estado | `TS-07` `TS-08` | `salidas/casos-137.txt` · `salidas/inversa.txt` |
| AC-04 | Reasigna la épica, y sólo a un lote vivo | `TS-09` `TS-10` `TS-11` | `salidas/casos-137.txt` · `salidas/inversa.txt` |
| AC-05 | Deja rastro: quién, cuándo, de qué estado | `TS-12` | `salidas/casos-137.txt` · `salidas/inversa.txt` |
| AC-06 | `PT-134` retomada **por comando** | — ejecución real | `salidas/pt-134-retomada.txt` |

**Seis criterios, seis con escenario o ejecución, seis con evidencia.** Ningún Orphan Criterion.

`AC-06` no tiene `TS` a propósito: su verificación **es** ejecutar el comando sobre el registro
real. Un escenario de fixture no puede establecer que el caso que motivó la tarea quedó resuelto.
