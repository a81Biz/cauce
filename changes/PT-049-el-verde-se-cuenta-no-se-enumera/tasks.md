# PT-049 — Tareas   `PHASE 4`

| # | Objetivo único | Input | Output | Validación | Archivos | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| T1 | Medir de dónde salen las líneas de las dos salidas | ejecución | 541 / 507 clasificadas | ejecución | — | hecha en `PHASE 2` |
| T2 | `-q` en `verify-fdge`: no recorrer `passed` | `verify-fdge.mjs:1471` | bandera | selftest | `tools/verify-fdge.mjs` | pendiente |
| T3 | `-q` en `selftest`: separar contar de imprimir, sin tocar `TOTAL` | `selftest.sh:28` | bandera | selftest | `tools/selftest.sh` | pendiente |
| T4 | `-q` no se cuela en el posicional `[dir-temporal]` | T3 | filtro | selftest | `tools/selftest.sh` | pendiente |
| T5 | El recuento sobrevive a `-q` en las dos | T2 · T3 | — | selftest | — | pendiente |
| T6 | Con fallos, `-q` los enumera todos y el `exit` no cambia | T2 · T3 | — | selftest | `tools/selftest.sh` | pendiente |

**Archivos tocados:**

```
docs/methodology/tools/verify-fdge.mjs · docs/methodology/tools/selftest.sh
```

Solapamiento (`FDGE-R40`): ninguno vivo. `PT-050` a `PT-054` no han empezado, y las seis tareas de
`EP-014` se ejecutan **secuencialmente** por decisión del lote.
