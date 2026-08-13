# PT-006 — Escenarios de test   `PHASE 4`

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | `PHASES.md` | **no** menciona «milestone» |
| `TS-02` | `AC-02` | `RULES.md` | contiene `SUITE-R42` |
| `TS-03` | `AC-02` | `CORE.md` | contiene `SUITE-R42` tras regenerar |
| `TS-04` | `AC-04` | fixture sin `tracker.plataforma`, `--gate G4` | **no** aparece `SUITE-R42` y la compuerta no se bloquea por ella |
| `TS-05` | `AC-03` | `tracker pr` sin plataforma | código `2` |
| `TS-06` | `AC-05` | `tracker pr` con plataforma y sonda sin acceso | código `3`, distinto del `2` |
| `TS-07` | `AC-07` | `tracker.mjs` | **no** contiene ninguna llamada a `pr merge` ni a `merge` |

## Los inversos

`TS-04` es la garantía de todo proyecto que no declara plataforma: sin él, la regla nueva
rompería a todos los destinos instalados. `TS-07` es negativo a propósito — comprueba que el
código **no** puede fusionar, que es lo único que hace creíble que la compuerta siga siendo
humana.

## Lo que no se prueba aquí

Que `--gate G4` falle sin PR **contra GitHub de verdad**. Requiere una rama sin PR en un
repositorio real; se verifica en `PHASE 6` ejecutándolo sobre este repositorio, donde el PR #7
existe, y sobre una rama inventada donde no.
