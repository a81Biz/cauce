# PT-098 — Trazabilidad `FDGE-R15`

| AC | Criterio | Caso | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | Contraste mecánico sin depender de la rama declarada | `con merge, da INTEGRATED` · `sin merge, la ultima fase da DONE` | `salidas/contraste.txt` | VERIFICADO |
| AC-02 | `verify-fdge` reporta el `INTEGRATED` que el árbol no sostiene | `un INTEGRATED que main no sostiene se reporta` | `salidas/selftest-completo.txt` · `salidas/inversa.txt` | VERIFICADO |
| AC-03 | Lo que no se puede contrastar sale `SIN EVALUAR` | `sin poder comprobarlo, SIN EVALUAR` · `sin poder saberlo, tampoco INTEGRATED` | `salidas/contraste.txt` · `salidas/inversa.txt` | VERIFICADO |
| AC-04 | `avanzar` escribe lo cierto y lo dice | `sin merge, la ultima fase da DONE` · `con merge, da INTEGRATED` · `lo ya terminal no se reescribe` | `salidas/selftest-completo.txt` · `salidas/inversa.txt` | VERIFICADO |
| AC-05 | Los 91 actuales siguen en verde | `…y uno que SI esta, no` · medición sobre el registro real | `salidas/contraste.txt` | VERIFICADO |
| AC-06 | La batería falla sin el arreglo | la prueba inversa | `salidas/inversa.txt` | VERIFICADO |

## Los tres frenos, y qué impide cada uno

No son relleno. Cada uno bloquea una forma concreta de «arreglarlo» que pasaría los positivos:

```
«…y uno que SI esta, no»          impide que la comprobacion REPORTE SIEMPRE
«con merge, da INTEGRATED»        impide que avanzar escriba SIEMPRE DONE — que seria peor
                                  que el defecto, porque nada llegaria nunca a INTEGRATED
«lo ya terminal no se reescribe»  conserva la guarda que ya habia: un CLOSED no vuelve a
                                  INTEGRATED porque alguien avance de fase
```

## `AC-05` se mide sobre el registro real, no en la batería

Los 91 `INTEGRATED` de este repositorio tienen su directorio en `main` — medido **antes** de
diseñar el arreglo. Si alguno hubiera salido falso, el intake tendría que decir qué se hace con él.

## `CasoQA` — por qué no hay columna

No hay interfaz: el producto es una herramienta de línea de comandos (`SUITE-R11`).
