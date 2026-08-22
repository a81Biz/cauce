# Trazabilidad — `PT-108`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | version.mjs ve el suite_version del registro | `a mano, sobre el registro real` | `a mano, sobre el registro real` | `salidas/alineado.txt` |
| AC-02 | No toca ningun otro campo del registro | `leer allocations y contador tras alinear` | `leer allocations y contador tras alinear` | `salidas/alineado.txt` |
| AC-03 | El limite del cerrojo queda declarado | ` el comentario lo dice` | `por construccion: el comentario lo dice` | `salidas/alineado.txt` |
| AC-04 | La bateria falla sin el arreglo | `version.mjs ve la version del REGISTRO` · `…y la alinea` · `…sin tocar ningun otro campo` | `selftest.sh:version.mjs ve la version del REGISTRO` · `selftest.sh:…y la alinea` · `selftest.sh:…sin tocar ningun otro campo` | `salidas/selftest-completo.txt` |

> **`AC-04` se escribió cuando `G4` lo rechazó.** Lo había declarado como deuda —comprobado
> a mano— y la compuerta lo trató como *Orphan Criterion* (`FDGE-R15`). Tenía razón: declarar
> una deuda la hace **honesta**, no la hace **pasable**.
