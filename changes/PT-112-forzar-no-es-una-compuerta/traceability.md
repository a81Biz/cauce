# Trazabilidad — `PT-112`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | «--forzar» exige quien lo decide y sin nombre no sobrescribe | `«--forzar» pide quien lo decide` | `selftest.sh:«--forzar» pide quien lo decide` | `salidas/forzar.txt` |
| AC-02 | Deja constancia en INSTALL.log | `…y deja constancia en INSTALL.log` | `selftest.sh:…y deja constancia en INSTALL.log` | `salidas/forzar.txt` |
| AC-03 | Si no puede registrar, NO sobrescribe | `…y si no puede registrarlo, NO sobrescribe` | `selftest.sh:…y si no puede registrarlo, NO sobrescribe` | `salidas/forzar.txt` |
| AC-04 | Una instalacion nueva no se toca | ` la guarda exige !d.nueva` | `por construccion: la guarda exige !d.nueva` | `salidas/forzar.txt` |
| AC-05 | INC-007 e INC-013 quedan declarados sin arreglar | `«--forzar» pide quien lo decide` | `selftest.sh:«--forzar» pide quien lo decide` | `salidas/declarado.txt` |
