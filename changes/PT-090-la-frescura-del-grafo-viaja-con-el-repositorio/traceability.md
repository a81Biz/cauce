# PT-090 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | La deriva se calcula con **hash**: dos clones del mismo commit, mismo veredicto | E1 · E2 | `selftest.sh`: «mismo hash, distinto mtime: NO hay deriva» · «hash distinto: SI hay deriva» | `salidas/deriva.txt` | VERIFICADO |
| AC-02 | `MISSING` dice **«no evaluable en este clon»** | E9 · E10 | `selftest.sh`: «sin graphify-out dice NO ES EVALUABLE» · «…y no promete bloquear lo que no evalua» | `salidas/missing.txt` | VERIFICADO |
| AC-03 | …y la distinción aparece **en la salida** | E9 | `selftest.sh`: «…y ya no dice que bloquea G2» | `salidas/missing.txt` | VERIFICADO |
| AC-04 | `FDGE-R43` declara su **sujeto** (`PT-087`) | E3 · E8 | `selftest.sh`: «sin hash en el manifiesto, cae al mtime» · «…y si la raiz no casa, no se inventa nada» | `salidas/deriva.txt` | VERIFICADO |
| AC-05 | Las rutas **absolutas** del manifiesto se normalizan | E5 · E6 · E7 | `selftest.sh`: «una ruta absoluta de windows se relativiza» · «…y una de posix tambien» · «…y una ya relativa se queda igual» | `salidas/rutas.txt` | VERIFICADO |

## `AC-05` no estaba en el intake **ni en `H-005`**

El hallazgo daba por hecho que versionar el grafo resolvería el problema. **No lo resolvería:** las
rutas del manifiesto son absolutas, así que sólo sirve en un disco donde el proyecto esté
exactamente ahí.

Eso invalida el análisis del hallazgo, no lo matiza — y se dice en la revisión de `H-005`.

## `TD-17` se actualiza al cerrar el lote

Junto con la entrada del `CHANGELOG`, y con la decisión tomada: **no se versiona**, con su coste
medido en `out-of-scope.md`.
