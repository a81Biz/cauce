# PT-100 — Trazabilidad `FDGE-R15`

| AC | Criterio | Caso | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | El espacio de `QA` se busca en las dos grafías, y se dice cuál | `verify-qa busca las DOS grafias del espacio de QA` · `…y no queda ninguna grafia suelta` · `…y dice donde busco cuando no lo encuentra` | `salidas/inversa.txt` · `salidas/selftest-completo.txt` | VERIFICADO |
| AC-02 | Un vocabulario de tipos, y la herramienta lo usa | `el tipo de caso QA lo declara LEXICON` · `…y verify-qa usa ese vocabulario` · `…y no el que nadie documentaba` | `salidas/selftest-completo.txt` · `salidas/inversa.txt` | VERIFICADO |
| AC-03 | Un destino para la nota, declarado en la regla | `FDGE-R52 declara el destino que la herramienta usa` · `…y ya no nombra el que no existe` | `salidas/inversa.txt` | VERIFICADO |
| AC-04 | Cero `type === 'EP'` en `verify-fdge` | `verify-fdge ya no pregunta por el type de un lote` · `…ni por su negacion` | `salidas/inversa.txt` | VERIFICADO |
| AC-05 | `LEXICON` declara los dos nombres que faltaban | `LEXICON declara que un lote NO lleva type` · `el tipo de caso QA lo declara LEXICON` | `salidas/audit.txt` | VERIFICADO |
| AC-06 | La batería falla sin el arreglo | la prueba inversa | `salidas/inversa.txt` | VERIFICADO |

## Cinco de los once casos son **negativos**

```
«…y no queda ninguna grafia suelta»            impide que quede un join(ROOT,'qa') olvidado
«…y no el que nadie documentaba»               impide que EDGE|NEG sobreviva en otra linea
«…y ya no nombra el que no existe»             impide que bitacora.md quede en la regla
«verify-fdge ya no pregunta por el type…»      los seis sitios, de golpe
«…ni por su negacion»                          «type !== 'EP'» es el mismo hecho invertido
```

**Un `chkno` es lo único que prueba que algo se fue.** Un positivo demuestra que el nombre nuevo
está; sólo el negativo demuestra que el viejo **ya no**.

## `CasoQA` — sin interfaz (`SUITE-R11`).
