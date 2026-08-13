# PT-011 — Escenarios de test   `PHASE 4`

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | intake de lote con tabla, y un PT ajeno citado **en prosa** | **no** aparece `INTAKE-R08` sobre ese PT |
| `TS-02` | `AC-02` | el PT que **sí** está en la tabla, sin la línea de firma | aparece `INTAKE-R08` |
| `TS-03` | `AC-03` | intake de lote **sin ninguna tabla**, con un PT citado | sigue comprobándose — respaldo |
| `TS-04` | `AC-04` | ejecución real contra el proyecto legado | de 16 errores a 2 |
| `TS-05` | `AC-05` | `CHANGELOG.md` | la entrada de 4.13.0 lleva la nota de dónde estaba la corrección |

## Los inversos

`TS-02` y `TS-03` son los que impiden que «leer por filas» se implemente dejando de comprobar.
Sin ellos, borrar la comprobación entera pasaría `TS-01` y `TS-04`.
