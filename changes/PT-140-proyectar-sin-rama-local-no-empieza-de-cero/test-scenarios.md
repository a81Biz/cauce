# Escenarios de test — `PT-140`   `PHASE 4`

| TS | Escenario | Cierra |
|:---|:---|:---|
| `TS-01` | Sin rama en ningún sitio, la crea y **lo dice** | AC-02 |
| `TS-02` | Con rama sólo en el remoto, se **niega** | AC-01 |
| `TS-03` | …y dice el comando para traerla | AC-01 |
| `TS-04` | …y **no** empieza un linaje nuevo | AC-01 |
| `TS-05` | Con la rama local, sigue proyectando igual | AC-03 |
| `TS-06` | …y ya no dice que sea la primera vez | AC-03 |

## El fixture lleva su **propio** remoto

Un `--bare` local. Un arnés que necesita la red no es un arnés: daría rojo el día que GitHub esté
lento, y ese rojo no diría nada del marco. `PT-126` lo pagó con la batería colgada tres minutos.
