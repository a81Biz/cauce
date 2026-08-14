# PT-034 — Estrategia   `PHASE 3`

`cauce start`: imprime el estado del tablero y **después** el núcleo, en ese orden.

| Camino | Por qué |
|:---|:---|
| Un hook que corra antes de cada turno | No es del marco: depende del arnés del agente y no viaja en el paquete |
| Un agente separado con su propio prompt | Duplicaría `CORE.md` — la copia que `SUITE-R38` prohíbe |
| **Un comando de arranque en el binario** | Viaja con el paquete, no duplica nada, y el orden es la garantía |

## Tres cosas que no puede hacer, y se comprueban

- **No sustituye a `CORE.md`.** El marco tiene que seguir siendo usable sin el binario
  (`AC-04`): un caso comprueba que el núcleo sigue siendo lo obligatorio.
- **No automatiza compuertas.** Un caso comprueba que el bloque de `start` no contiene `--aplicar`
  ni resuelve un gate.
- **No escribe su propia definición de «consultado».** Cita `SUITE-R49`.

## Y lo que sigue sin cerrarse

Quien no ejecute `cauce start` sigue sin ver nada. **Lo honesto es decirlo**: esto no impide
arrancar de otra forma, hace que la forma correcta sea la que el paquete ofrece y documenta. La
diferencia con las dos reglas anteriores es que aquí el orden **está en el código**, no en un
texto que alguien tiene que respetar.
