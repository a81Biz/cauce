# PT-013 — Escenarios de test   `PHASE 4`

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-03` | out-of-scope con destino «Decisión posterior», sin citar nadie | detectado |
| `TS-02` | `AC-02` | destino que cita `PT-015`, y `PT-015` existe | **no** detectado |
| `TS-03` | `AC-03` | destino `—` | **no** detectado: no aplaza, declara |
| `TS-04` | `AC-04` | lo anterior en `--gate G4` | **falla** |
| `TS-05` | `AC-04` | lo anterior fuera de `G4` | **avisa**, no falla |
| `TS-06` | `AC-07` | un PT en `DEFERRED` sin intake | **no** se le exigen artefactos |
| `TS-07` | `AC-01` | un PT en `DEFERRED` con issue | el espejo lo cuenta **vivo** |
| `TS-08` | `AC-05` | `RULES.md` | contiene `SUITE-R44` |

## Los inversos

`TS-02`, `TS-03` y `TS-05` impiden que «detectar lo aplazado» se implemente denunciando todo.
`TS-06` y `TS-07` son las dos caras de `DEFERRED`: exento para la verificación, vivo para el
espejo — sin los dos, uno de los signos podría invertirse sin que nada saltara.
