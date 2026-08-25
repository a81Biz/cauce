# Escenarios de test — `PT-143`   `PHASE 4`

| TS | Escenario | Cierra |
|:---|:---|:---|
| `TS-01` | `--tipo BUG` sin prefijo ya **no** crea `BUG-001` | AC-01 |
| `TS-02` | …y el identificador no lleva el tipo | AC-01 |
| `TS-03` | Un prefijo declarado sigue funcionando | AC-03 |
| `TS-04` | Un prefijo que `LEXICON` no declara **falla** | AC-02 |
| `TS-05` | …y el error **enumera** los que sí están declarados | AC-02 |

`TS-03` es el que hace válidos a los demás: sin él, una lectura que ignorase todos los prefijos
también pasaría `TS-01`.
