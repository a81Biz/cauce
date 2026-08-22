# Trazabilidad — `PT-103`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | asignar crea una allocation completa | `asignar acepta el tipo` · `…la severidad` · `…el lote al que pertenece` · `…y arranca en PHASE 1` | `selftest.sh:asignar acepta el tipo` · `selftest.sh:…la severidad` · `selftest.sh:…el lote al que pertenece` · `selftest.sh:…y arranca en PHASE 1` | `salidas/inversa.txt` |
| AC-02 | NO acepta un tipo ni una severidad inventados | `…y NO acepta un tipo inventado` | `selftest.sh:…y NO acepta un tipo inventado` | `salidas/inversa.txt` |
| AC-03 | SUITE-R58 existe y verify-fdge la comprueba | `verify-fdge mira si el registro se escribio a mano` · `…y la regla existe` | `selftest.sh:verify-fdge mira si el registro se escribio a mano` · `selftest.sh:…y la regla existe` | `salidas/audit.txt` · `salidas/verify-suite.txt` |
| AC-04 | Avisa y no falla, con RIGE_DESDE | `…y no juzga lo escrito antes de la regla` | `selftest.sh:…y no juzga lo escrito antes de la regla` | `salidas/inversa.txt` |
| AC-05 | La bateria falla sin el arreglo | `la prueba inversa, retirada a retirada` | `la prueba inversa, retirada a retirada` | `salidas/inversa.txt` |


> **Nota de forma.** Esta tabla se reescribió: la primera versión tenía **cuatro** columnas
> y el parser de `FDGE-R15` exige **cinco** —`AC` · criterio · escenario · test · evidencia—,
> así que **ninguna fila se reconocía**. Seis tareas quedaron con la trazabilidad inservible
> y solo aparece en `verify-fdge --all`, que no se corrió hasta que el firmante preguntó por
> el cumplimiento. El criterio y los tests salen del `manifest.json`, que es la fuente.
