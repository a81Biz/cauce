# Trazabilidad — `PT-109`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Todo aviso de una regla que falla en una compuerta lo dice | `el aviso dice en que compuerta se convierte en error` | `selftest.sh:el aviso dice en que compuerta se convierte en error` | `salidas/aviso.txt` |
| AC-02 | Una regla que NO cambia de severidad no la lleva | `…y no se la pega a una regla que no cambia` | `selftest.sh:…y no se la pega a una regla que no cambia` | `salidas/aviso.txt` |
| AC-03 | FPGE-R01 reconoce un candidato por su FILA | `FPGE-R01 mira la FILA del roadmap, no la mencion` | `selftest.sh:FPGE-R01 mira la FILA del roadmap, no la mencion` | `salidas/aviso.txt` |
| AC-04 | La bateria falla sin el arreglo | `los cuatro casos` | `los cuatro casos` | `salidas/selftest-completo.txt` |
| AC-05 | Los tres INC inaccesibles quedan declarados | `…y ya no casa cualquier linea que lo nombre` | `selftest.sh:…y ya no casa cualquier linea que lo nombre` | `salidas/declarado.txt` |
