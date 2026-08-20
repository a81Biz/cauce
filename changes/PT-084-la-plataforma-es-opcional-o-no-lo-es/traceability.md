# PT-084 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | Sin plataforma, `avanzar` funciona | E1 | `selftest.sh`: «sin plataforma, avanzar FUNCIONA» | `salidas/sin-tablero.txt` | PENDIENTE |
| AC-02 | La nota no se pierde: va a un sitio duradero | E2 | `selftest.sh`: «…y la nota va al ledger» · «…con el cuerpo de la transicion» | `salidas/sin-tablero.txt` | PENDIENTE |
| AC-03 | Con plataforma, el comportamiento no cambia | E4 | los casos existentes de `avanzar` siguen verdes | `salidas/sin-tablero.txt` | PENDIENTE |
| AC-04 | `avanzar` sigue exigiendo `--nota` | E3 | `selftest.sh`: «…y --nota SIGUE siendo obligatoria» | `salidas/sin-tablero.txt` | PENDIENTE |
| AC-05 | `migrate` deja de prometer lo que no cumple | E5 | `selftest.sh`: «migrate ya no promete lo que no cumple» | `salidas/sin-tablero.txt` | PENDIENTE |
| AC-06 | Un proyecto sin tablero recorre un `PT` entero | E1 · E2 | reejecutado sobre el proyecto de `PT-072` | `salidas/sin-tablero.txt` | PENDIENTE |

## `AC-03` es la mitad del trabajo

Sin él, cualquier implementación que rompiera el camino con plataforma pasaría `AC-01`, `AC-02` y
`AC-04`. Que los casos existentes de `avanzar` sigan verdes **es** el criterio.

## `AC-06` se verificó donde el defecto apareció

No en un fixture: en `C:/tmp/pt072/nuevo`, el proyecto real que `PT-072` creó y que **no declaró
plataforma a propósito**. Es el mismo sitio que produjo el hallazgo.
