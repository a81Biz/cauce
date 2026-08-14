# PT-034 — Escenarios de prueba   `PHASE 4` · `FDGE-R23`

| # | Escenario | Esperado |
|:---|:---|:---|
| E1 | `SUITE-R50` en `RULES.md` y `CORE.md` | presente |
| E2 | `cauce start` existe | presente |
| E3 | Y es el primero de la ayuda | `EMPIEZA AQUÍ` |
| E4 | El arranque llama al tablero | `siguiente` |
| E5 | Cita `SUITE-R49`, no la copia | presente |
| E6 | Sin plataforma | lo **declara** `SIN EVALUAR` |
| E7 | `PHASES` declara el arranque | presente |
| E8 | **No** resuelve compuertas | el bloque no contiene `--aplicar` ni `gate` |
| E9 | El núcleo sigue siendo obligatorio | `SUITE-R15` citado |

E8 y E9 son los que importan: comprueban **lo que no debe hacer**. Un arranque que automatizara
una compuerta o sustituyera al núcleo sería peor que no tenerlo.
