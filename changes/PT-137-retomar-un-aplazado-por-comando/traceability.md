# Trazabilidad — `PT-137`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Retoma sin exigir intake, y el destino se deriva | `TS-01` `TS-02` `TS-03` `TS-13` | `selftest.sh:retomar lleva un DEFERRED a DRAFT` · `el aplazado que conserva intake vuelve a READY` | `salidas/selftest-completo.txt` |
| AC-02 | Firmante contrastado y fecha real | `TS-04` `TS-05` `TS-06` | `selftest.sh:un firmante que no esta en la lista falla` · `…y la fecha se puede DECIR, no es la de correr el comando` | `salidas/selftest-completo.txt` |
| AC-03 | Se niega sobre lo que no es `DEFERRED`, diciendo el estado | `TS-07` `TS-08` | `selftest.sh:sobre un INTEGRATED se niega` · `…y dice el estado que encontro` | `salidas/selftest-completo.txt` |
| AC-04 | Reasigna la épica, y sólo a un lote vivo | `TS-09` `TS-10` `TS-11` | `selftest.sh:--epica a un lote vivo reasigna` · `--epica a un lote CERRADO se niega` | `salidas/selftest-completo.txt` |
| AC-05 | Deja rastro: quién, cuándo, de qué estado | `TS-12` | `selftest.sh:el registro declara quien, cuando y de que estado` | `salidas/selftest-completo.txt` |
| AC-06 | `PT-134` retomada **por comando** | — ejecución real | — la salida del comando sobre el registro real | `salidas/pt-134-retomada.txt` |

**Seis criterios, seis con escenario o ejecución, seis con evidencia.** Ningún Orphan Criterion.

`AC-06` no tiene `TS` a propósito: su verificación **es** ejecutar el comando sobre el registro
real. Un escenario de fixture no puede establecer que el caso que motivó la tarea quedó resuelto.
