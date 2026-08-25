# Escenarios de test — `PT-142`   `PHASE 4`

| TS | Escenario | Cierra |
|:---|:---|:---|
| `TS-01` | El nombre se **deriva** del `type` del ítem | AC-02 |
| `TS-02` | …y lleva el usuario cuando lo hay | AC-02 |
| `TS-03` | Sin `type` no hay nombre esperado: `null` | AC-04 |
| `TS-04` | Un lote no lleva `type`, y por eso da `null` | AC-01 |

## `TS-04` es la contradicción, hecha caso

`ramaDeTarea` devolvía `null` para un `EP` **y se inventó el nombre igual**. El caso fija que
`null` es la respuesta correcta, no un hueco que rellenar.
