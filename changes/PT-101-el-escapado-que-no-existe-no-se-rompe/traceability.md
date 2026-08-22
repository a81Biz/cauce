# Trazabilidad — `PT-101`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | La cuenta de roturas vive en un solo sitio | `la cuenta de roturas vive en UN sitio` | `selftest.sh:la cuenta de roturas vive en UN sitio` | `salidas/audit.txt` |
| AC-02 | audit detecta la construccion fragil ANTES de que rompa | `audit caza la construccion fragil` | `selftest.sh:audit caza la construccion fragil` | `salidas/audit.txt` |
| AC-03 | El aviso dice que hacer y no marca lo correcto | `…y NO marca la barra doble, que es correcta` · `…ni lo que solo aparece en un comentario` | `selftest.sh:…y NO marca la barra doble, que es correcta` · `selftest.sh:…ni lo que solo aparece en un comentario` | `salidas/audit.txt` |
| AC-04 | No juzga lo escrito antes de la regla | `…y no juzga lo escrito antes de la regla` | `selftest.sh:…y no juzga lo escrito antes de la regla` | `salidas/audit.txt` |
| AC-05 | La bateria falla sin el arreglo | `los nueve casos` | `los nueve casos` | `salidas/selftest-completo.txt` |
| AC-06 | SUITE-R59 existe y se cita donde se trabaja | `…y SUITE-R59 la convierte en regla` · `…citada donde se escribe codigo` | `selftest.sh:…y SUITE-R59 la convierte en regla` · `selftest.sh:…citada donde se escribe codigo` | `salidas/audit.txt` |
| AC-07 | El normalizador existe y no escribe ninguna barra | `comoPalabra casa la palabra suelta` · `…y NO casa un trozo de otra palabra` · `comoLiteral busca el texto TAL CUAL` | `selftest.sh:comoPalabra casa la palabra suelta` · `selftest.sh:…y NO casa un trozo de otra palabra` · `selftest.sh:comoLiteral busca el texto TAL CUAL` | `salidas/audit.txt` |
| AC-08 | Las tres construcciones fragiles encontradas, arregladas | `el arbol real no tiene ninguna construccion fragil` | `selftest.sh:el arbol real no tiene ninguna construccion fragil` | `salidas/audit.txt` |
