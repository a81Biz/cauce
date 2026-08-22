# Trazabilidad — `PT-111`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | El espejo reporta un titulo divergente | `el espejo caza un titulo divergente` | `selftest.sh:el espejo caza un titulo divergente` | `salidas/espejo.txt` |
| AC-02 | NO marca el titulo correcto | `…y NO marca el titulo correcto` | `selftest.sh:…y NO marca el titulo correcto` | `salidas/espejo.txt` |
| AC-03 | No corrige: solo reporta | ` compararEspejo es pura` | `por construccion: compararEspejo es pura` | `salidas/espejo.txt` |
| AC-04 | Un comentario humano no cuenta como divergencia | ` no se compara el cuerpo` | `por construccion: no se compara el cuerpo` | `salidas/espejo.txt` |
| AC-05 | La bateria falla sin el arreglo | `los tres casos` | `los tres casos` | `salidas/selftest-completo.txt` |
