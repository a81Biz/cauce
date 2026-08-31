# `PT-196` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Cada acto posterior a `G4` pertenece a una fase o a un comando **declarado** | TS-03 | selftest §EP-026 · `siguiente de un lote listo dice que toca en el cierre` · `…y declara el SEGUNDO merge, con su motivo` | evidence/PT-196/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Ninguna fila de `SUITE-R45` exige en `G4` algo que otra regla prohíbe antes | TS-01 · TS-02 | selftest §EP-026 · `una fila TRAS EL MERGE no bloquea G4` · `…y una PENDIENTE si bloquea` · `…y una HECHO sigue resolviendo` | evidence/PT-196/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | El ciclo de dos viajes está **resuelto o declarado** con su motivo | TS-04 | selftest §EP-026 · `PHASES declara el doble viaje donde se ejecuta` | evidence/PT-196/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## Seis casos, no cuatro

Los escenarios son cuatro; los casos ejecutables, **seis**. Los dos de más no son escenarios nuevos:
son la mitad que impide que su pareja pase por la razón equivocada.

- `…y una HECHO sigue resolviendo` — `TS-01` y `TS-02` prueban la puerta nueva y la que bloquea,
  pero **ninguno prueba que la conducta que ya existía siga en pie**. Sin él, un `SUITE-R45` que
  hubiera dejado de reconocer `HECHO` pasaría los dos.
- `…y declara el SEGUNDO merge, con su motivo` — `TS-03` lo cumple cualquier salida que mencione el
  cierre. Lo que se descubría chocando es el **segundo** merge, y eso es lo que hay que exigir.

## `TS-02` sostiene a `AC-02`

Que una fila `TRAS EL MERGE` no bloquee lo cumple un `SUITE-R45` que **no exija nada**. Sólo la
pareja —que una `PENDIENTE` **sí** bloquee— prueba que la distinción existe y no es una puerta
abierta.

## Lo declarado sin cubrir

**El doble viaje no se elimina**, se declara: lo causa `SUITE-R46`, cuya exigencia nació de una
avería real y quitarla cambiaría una molestia por un defecto. Y el cierre **enumera** los actos de
`SUITE-R06a` —merge a `main` y tag— sin ejecutarlos.
