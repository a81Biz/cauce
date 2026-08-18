# PT-050 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir el reparto real del reloj | ejecución | 205 s / 92 s / 113 s | ejecución | — | hecha en `PHASE 2` |
| T2 | `--solo <patrón>` filtra en `chk` y `chkno` | `selftest.sh:64` | bandera | selftest | `tools/selftest.sh` | pendiente |
| T3 | `--solo` consume su valor y no acaba en el posicional | T2 | parseo | selftest | `tools/selftest.sh` | pendiente |
| T4 | La salida dice **cuántos de cuántos** | T2 | universo | selftest | `tools/selftest.sh` | pendiente |
| T5 | Un patrón sin coincidencias es **rojo** | T2 | guarda | selftest | `tools/selftest.sh` | pendiente |
| T6 | `--solo` y `-q` se combinan | T2 | — | selftest | — | pendiente |

**Archivos tocados:** `docs/methodology/tools/selftest.sh`

Solapamiento (`FDGE-R40`): con `PT-049`, ya **integrado** en `trabajo`. Sin conflicto — esta rama
sale de `trabajo` después de su merge.
