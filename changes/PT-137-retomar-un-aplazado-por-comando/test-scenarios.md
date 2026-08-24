# Escenarios de test — `PT-137`   `PHASE 4`

| TS | Escenario | Cierra |
|:---|:---|:---|
| `TS-01` | Un `DEFERRED` **sin directorio** en `changes/` se retoma y queda `DRAFT`/`PHASE 1` | AC-01 |
| `TS-02` | …y no se le pide intake en ningún momento | AC-01 |
| `TS-03` | Sin `--aplicar` no escribe: enseña la transición y el registro queda igual | AC-01 |
| `TS-04` | Firmante de la lista: escribe y lo registra | AC-02 |
| `TS-05` | Firmante inventado: falla y no escribe | AC-02 |
| `TS-06` | `--fecha` se respeta; sin ella, la del último commit | AC-02 |
| `TS-07` | Sobre `INTEGRATED` se niega y **dice el estado que encontró** | AC-03 |
| `TS-08` | Sobre `DRAFT` —vivo— se niega igual | AC-03 |
| `TS-09` | `--epica` a un lote vivo reasigna | AC-04 |
| `TS-10` | `--epica` a un lote **cerrado** falla | AC-04 |
| `TS-11` | Sin `--epica` conserva la que tenía, y se dice | AC-04 |
| `TS-12` | El registro declara `retomada` con quién, cuándo y de qué estado | AC-05 |
| `TS-13` | Sin plataforma escribe igual: `retomar` está en `SIN_PLATAFORMA` | AC-01 |

## Prueba inversa — cuatro supresiones, cuatro escenarios distintos

| Supresión sobre una copia del módulo real | Cae |
|:---|:---|
| No comprobar que el estado sea `DEFERRED` | `TS-07` |
| No contrastar el firmante | `TS-05` |
| No comprobar que el lote destino esté vivo | `TS-10` |
| No escribir `retomada` | `TS-12` |

Cada supresión se aplica sobre una **copia del módulo real**, no sobre una reimplementación, y
se comprueba que cae el escenario esperado **y sólo ése** — el defecto que `PT-122` y `PT-130`
encontraron en sus propias inversas.
