# PT-009 — Escenarios de test   `PHASE 4`

| TS | AC | Entrada | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | `mensajeDeCierre({id:'PT-1',status:'INTEGRATED'})` | contiene la marca |
| `TS-02` | `AC-01` | ídem | sigue diciendo el id y el estado — no se perdió el mensaje |
| `TS-03` | `AC-04` | el caso que ya existe, `humano tras el agente` | **no cambia** de resultado |
| `TS-04` | `AC-02` | `verify-fdge --all` sobre este repositorio | sin errores |
| `TS-05` | `AC-03` | `RULES.md` | `SUITE-R43` sigue exigiendo que el comentario se responda — el texto de la regla no cambia |

`TS-03` es el inverso: sin él, «la herramienta firma» podría implementarse haciendo que todo
cuente como firmado, y la regla dejaría de detectar lo que existe para detectar.
