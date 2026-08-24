# Trazabilidad — `PT-138`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `aplazar` es la única vía sancionada | `TS-01` `TS-02` `TS-10` `TS-11` | `selftest.sh:aplazar escribe DEFERRED con su bloque` | `salidas/selftest-completo.txt` |
| AC-02 | Exige los tres campos | `TS-03` `TS-04` `TS-05` | `selftest.sh:sin --reentrada falla` | `salidas/selftest-completo.txt` |
| AC-03 | La reentrada tiene contenido real | `TS-06` | `selftest.sh:una reentrada vacia no vale` | `salidas/selftest-completo.txt` |
| AC-04 | La revisión es una fecha futura | `TS-07` `TS-08` | `selftest.sh:una revision en el pasado nace caducada` | `salidas/selftest-completo.txt` |
| AC-05 | El dueño se contrasta | `TS-09` | `selftest.sh:un dueno que no esta en la lista falla` | `salidas/selftest-completo.txt` |
| AC-06 | `SUITE-R44` y `LEXICON` lo declaran | — verificación documental | `verify-suite.mjs` | `salidas/verify-suite.txt` |
| AC-07 | Los aplazados existentes, uno a uno | — ejecución real | — la salida del comando sobre el registro real | `salidas/pt-025.txt` |

**Siete criterios, siete con escenario o ejecución, siete con evidencia.** Ningún Orphan
Criterion.
