# PT-021 — Estrategia   `PHASE 3`

| Camino | Por qué |
|:---|:---|
| Quitar la comprobación del propio lote | Devuelve el agujero que `PT-018` cerró: «lo hará este lote» vuelve a pasar mientras el lote está abierto |
| Excluir la fila de `CHANGELOG` del ámbito de la regla | Un caso especial escrito a mano. El siguiente caso legítimo vuelve a bloquear |
| **Aceptar `DONE` además de `CLOSED`** | `DONE` es el estado en el que el trabajo del lote está hecho y solo espera al humano. Ahí ya no es una promesa |

`DRAFT` e `IN_PROGRESS` siguen bloqueando: la intención original queda intacta y se comprueba
con dos casos propios, no se afirma.

El criterio va en una constante, `LOTE_COMPLETO`, y no repetido en línea: `SUITE-R38` — un
criterio que se escribe a mano dos veces diverge.
