# Trazabilidad — `PT-109`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | el aviso dice su compuerta | `el aviso dice en que compuerta se convierte en error` | `selftest.sh` | `salidas/aviso.txt` |
| AC-02 | una regla que no cambia no lleva la coletilla | `…y no se la pega a una regla que no cambia` | `selftest.sh` | `salidas/aviso.txt` |
| AC-03 | `FPGE-R01` mira la fila | `FPGE-R01 mira la FILA del roadmap` | `selftest.sh` | `salidas/aviso.txt` |
| AC-04 | la batería falla sin el arreglo | los cuatro casos | `selftest.sh` | `salidas/selftest-completo.txt` |
| AC-05 | los tres `INC` inaccesibles quedan declarados | `out-of-scope.md` · con el `find` que no los encuentra | — | `changes/…/out-of-scope.md` |
