# PT-044 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | YAML `phase: 1`, registro `phase: 8` | se **reporta** `SUITE-R35` |
| E2 | AC-01 | YAML `status: DRAFT`, registro `INTEGRATED` | se **reporta** |
| E3 | AC-05 | Índice `READY`, registro `INTEGRATED` | se **reporta** |
| E4 | AC-02 | El aviso dice **cuál se usó** | «Se usa el del intake» |
| E5 | AC-03 | YAML y registro coinciden | **ni error ni aviso** |
| E6 | AC-03 | El registro no declara `phase` | **ni error ni aviso**: no se inventa |
| E7 | AC-01 | En `G4` la divergencia **bloquea** | `✗ SUITE-R35` |
| E8 | AC-04 | La regla lo declara, y llega al núcleo | `SUITE-R35` en `RULES.md` y `CORE.md` |

## Los que NO deben avisar

`E5` y `E6` son la mitad del trabajo. Un verificador que avisa siempre es ruido, y el ruido se
aprende a ignorar; uno que inventa una divergencia donde falta un dato hace lo que `RULE-06`
prohíbe. Sin esos dos casos, esta comprobación no se podría distinguir de una que grita.

## Lo que cierra el `AC-04`

No es un caso del fixture: es la **ejecución sobre este repositorio**. Sincronizar los cuatro
YAML enciende comprobaciones que llevaban apagadas desde `EP-011`, y cuáles se enciendan solo se
sabe corriéndolo. Se guarda en `evidence/PT-044/salidas/`.
