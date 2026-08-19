# PT-074 — Escenarios de prueba   `PHASE 4`

| AC | # | Escenario | Se espera |
|:---|:--|:---|:---|
| AC-01 | E1 | `PHASE 4` y el prompt de `G2` citan `FDGE-R54` | ya pasa: lo dejó `PT-075` |
| AC-02 | E2 | Una allocation con `viabilidad` registrada | el cuerpo del issue lleva el veredicto |
| AC-02 | E3 | …y su `medido_en` | el cuerpo dice contra qué se midió |
| AC-02 | E4 | …y la naturaleza de la cifra | `MEDIDO` / `ESTIMADO` / `SIN EVALUAR` visible |
| AC-03 | E5 | Veredicto `MARGINAL` | el cuerpo dice que obliga a trabajo atómico |
| AC-03 | E6 | Veredicto `UNSAFE` | el cuerpo dice que detiene |
| AC-05 | E7 | Allocation **sin** `viabilidad` | el cuerpo **no** inventa una línea |
| AC-04 | E9 | Se re-registra un veredicto tras `PT-068` | su `medido_en` apunta a la marca **actual**, no a la huérfana |
| AC-06 | E8 | El cuerpo no copia el razonamiento | no aparece el texto del intake (`SUITE-R35`) |

## Inversa

Quitada la línea de `cuerpoDeIssue`:

```
E2 E3 E4 E5 E6  caen
```

Y **sigue pasando** `E7`: no inventar cuando no hay dato no depende de este arreglo, y si
cayera significaría que la línea se emite siempre — que es peor que no tenerla.
