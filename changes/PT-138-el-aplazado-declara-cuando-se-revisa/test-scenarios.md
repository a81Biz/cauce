# Escenarios de test — `PT-138`   `PHASE 4`

| TS | Escenario | Cierra |
|:---|:---|:---|
| `TS-01` | `aplazar` escribe `DEFERRED` con su bloque completo | AC-01 |
| `TS-02` | Sin `--aplicar` no escribe | AC-01 |
| `TS-03` | Sin `--reentrada` falla | AC-02 |
| `TS-04` | Sin `--revision` falla | AC-02 |
| `TS-05` | Sin `--dueno` falla | AC-02 |
| `TS-06` | `--reentrada` vacía o trivial falla | AC-03 |
| `TS-07` | `--revision` en el pasado falla | AC-04 |
| `TS-08` | `--revision` que no es fecha falla | AC-04 |
| `TS-09` | `--dueno` fuera de la lista falla | AC-05 |
| `TS-10` | Sobre una allocation ya terminal se niega | AC-01 |
| `TS-11` | Sin plataforma escribe igual | AC-01 |

## Prueba inversa — cuatro supresiones, cuatro escenarios distintos

| Supresión sobre copia del módulo real | Cae |
|:---|:---|
| No exigir los tres campos | `TS-03` |
| No comprobar que la reentrada tenga contenido | `TS-06` |
| No comprobar que la fecha sea futura | `TS-07` |
| No contrastar el dueño | `TS-09` |
