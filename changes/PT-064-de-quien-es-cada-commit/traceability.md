# PT-064 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El precedente sale solo del trabajo de esa persona | E1 · E5-E7 · E15 | `selftest.sh`: «filtra por persona» · «las derivaciones piden el autor» · «el precedente se filtra por persona» | `salidas/cifras-reales.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-02 | El techo se calcula por persona | E8 | `selftest.sh`: «…y el techo tambien» · «una sesion es de un dia Y de una persona» | `salidas/cifras-reales.txt` | - | VERIFICADO |
| AC-03 | El coste se pide de todos o de una, y dice cuál | E9-E11 | `selftest.sh`: «sin filtro dice que es de todas» · «--mio dice de quien» · «--de tambien filtra» | `salidas/cifras-reales.txt` | - | VERIFICADO |
| AC-04 | Un commit sin persona no se reparte | E3-E4 · E12 | `selftest.sh`: «…y los sin persona no entran en el de nadie» · «sinPersona los cuenta» | `salidas/inversa.txt` | - | VERIFICADO |
| AC-05 | Con una sola persona, las cifras no cambian | E2 · E13-E14 | `selftest.sh`: «…y con null devuelve TODO» · «coste da una cifra para un grupo grande» | `salidas/cifras-reales.txt` · `salidas/verify-suite.txt` | - | VERIFICADO |

**`AC-05` se comprueba con `E2`, que es una línea de código:** `soloDe(items, null)` devuelve
**todo**. Es lo único que separa esta tarea de romper `EP-015` entero — y la inversa lo confirma al
revés: cuando `soloDe` deja de filtrar, caen los casos que sí necesitan el filtro.

**`AC-03` tiene un caso que parece trivial y no lo es:** «sin filtro dice que es de **todas** las
personas». Lo peligroso no es dar una cifra u otra, es no saber cuál te están dando.
