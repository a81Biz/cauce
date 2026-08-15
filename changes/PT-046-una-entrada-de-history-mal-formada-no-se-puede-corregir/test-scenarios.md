# PT-046 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

Sobre el fixture de `selftest.sh`, que tiene `HISTORY.log` propio y PTs con estado conocido.

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `FDGE-R29` declara la entrada de corrección | presente en `RULES.md` |
| E2 | AC-01 | …y llega al núcleo | presente en `CORE.md` |
| E3 | AC-01 | `CORRIGE` está en `LEXICON.md` | presente |
| E4 | AC-01 | `PHASES.md` lo cita | presente |
| E5 | AC-01 | Una entrada `CORRIGE` **no** dispara el «2 entradas» de `FDGE-R29` | `✓ FDGE-R29` |
| E6 | AC-03 | Con una original sin `Estado:` y una `CORRIGE` que lo declara, `--gate G4` **pasa** | `✓ FDGE-R34` |
| E7 | AC-03 | `FDGE-R44` lee el `Estructural:` de la corrección, no el de la original | `✓ FDGE-R44` |
| E8 | AC-04 | Una `CORRIGE` **sin entrada original** falla | `✗ FDGE-R29` |
| E9 | AC-03 | Con **dos** correcciones manda la **última** | el `Estado:` de la segunda |
| E10 | AC-02 | Sin `CORRIGE`, todo se comporta exactamente igual que antes | `✗ FDGE-R34` sobre la entrada condensada |
| E11 | AC-02 | Una entrada `REVERTIDO` se sigue descontando aparte | `✓ FDGE-R29` |

## Los que tienen que fallar

`E8` y `E10` son la mitad del trabajo. Sin `E8`, `CORRIGE` sería una vía para declarar trabajo
que nunca ocurrió; sin `E10`, el arreglo podría estar aceptándolo todo y no lo sabríamos — un
verificador que no puede fallar no verifica (`SUITE-R38`).

## La comprobación que cierra el `AC-02`

No es un caso del fixture: es `git`. Las cuatro entradas de `PT-039`…`PT-042` tienen que quedar
**byte a byte iguales** tras la tarea, y eso lo dice `git diff` sobre el rango, no yo.
