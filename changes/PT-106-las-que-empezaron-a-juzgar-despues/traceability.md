# Trazabilidad — `PT-106`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Las veinte declaran su version real | `una regla que llego con la 7.0.0 lo declara` · `…y una que llego con la 4.14.0 tambien` · `…y una de la 8.0.0` | `selftest.sh:una regla que llego con la 7.0.0 lo declara` · `selftest.sh:…y una que llego con la 4.14.0 tambien` · `selftest.sh:…y una de la 8.0.0` | `salidas/inversa.txt` · `salidas/derivacion.txt` |
| AC-02 | Las 38 del primer commit NO llevan fila | `una regla del primer commit NO lleva fila` | `selftest.sh:una regla del primer commit NO lleva fila` | `salidas/inversa.txt` |
| AC-03 | Las 87 que no emiten NO llevan fila | `…ni una que no emite nada` | `selftest.sh:…ni una que no emite nada` | `salidas/inversa.txt` |
| AC-04 | Ninguna cifra sale del CHANGELOG | `package.json` | `la derivacion, con git log -S y git show <sha>:package.json` | `salidas/derivacion.txt` |
| AC-05 | Las dos que discrepan conservan su valor | `la que discrepa conserva su valor real` · `…y la otra tambien` | `selftest.sh:la que discrepa conserva su valor real` · `selftest.sh:…y la otra tambien` | `salidas/inversa.txt` |
| AC-06 | La bateria falla sin el arreglo | `la prueba inversa, retirada a retirada` | `la prueba inversa, retirada a retirada` | `salidas/inversa.txt` |

**`AC-04` se verifica por el método, no por un caso**: la derivación se hace con `git log -S`
y `git show <sha>:package.json`, y cada fila lleva su `sha` en el comentario. Recalcularla da
lo mismo; eso es lo que distingue un dato derivado de uno escrito a ojo.


> **Nota de forma.** Esta tabla se reescribió: la primera versión tenía **cuatro** columnas y
> el parser de `FDGE-R15` exige **cinco** —`AC` · criterio · escenario · test · evidencia—, así
> que **ninguna fila se reconocía**. Cuatro tareas quedaron con la trazabilidad inservible y el
> fallo solo aparece en `verify-fdge --all`, que no se corrió hasta que el firmante preguntó por
> el cumplimiento. El criterio y los tests salen ahora del `manifest.json`, que es la fuente.
