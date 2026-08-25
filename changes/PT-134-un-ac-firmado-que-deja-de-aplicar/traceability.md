# Trazabilidad — `PT-134`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Un `AC` puede declararse caído, y no es Orphan | `TS-01` `TS-02` `TS-06` | `selftest.sh:un AC declarado CAIDO con motivo no es Orphan` · `sin la palabra, sigue siendo Orphan Criterion` | `salidas/selftest-completo.txt` |
| AC-02 | Un `AC` caído **no** cuenta como verificado | `TS-05` | `selftest.sh:CAIDO y verified:true a la vez falla` | `salidas/selftest-completo.txt` |
| AC-03 | Declararlo caído exige motivo | `TS-03` `TS-04` | `selftest.sh:CAIDO sin motivo en el manifiesto falla` · `…y un motivo de dos palabras tampoco vale` | `salidas/selftest-completo.txt` |
| AC-04 | El `AC-06` de `PT-113` se declara caído sin reescribir | — declaración documental | — `FDGE-R29`: se añade, no se borra | `salidas/pt-113.txt` |
| AC-05 | `FDGE-R15` declara el caso | — verificación documental | `verify-suite.mjs` | `salidas/verify-suite.txt` |

**Cinco criterios, cinco con escenario o declaración, cinco con evidencia.** Ningún Orphan
Criterion.

`AC-04` no tiene `TS` a propósito: `PT-113` está `INTEGRATED` y `verify-fdge` no la juzga
(`SUITE-R36`). Lo que se establece es que **la declaración existe** y que la prosa anterior se
conserva — no que un verificador la apruebe, porque no la mira.
