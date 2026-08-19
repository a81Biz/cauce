# PT-075 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La viabilidad tiene fase que la invoca y algo cae si desaparece | E1 · E2 | | | - | PENDIENTE |
| AC-02 | El veredicto queda registrado y `verify-fdge` lo exige | E3 · E4 · E5 | | | - | PENDIENTE |
| AC-03 | Un acto del agente hacia la plataforma se detecta | E6 · E7 · E8 · E9 · E10 · E11 | | | - | PENDIENTE |
| AC-04 | Las dos reglas salen de la lista de las que nada ejecuta | E12 | | | - | PENDIENTE |
| AC-05 | La comprobación inversa está hecha | inversa | | | - | PENDIENTE |
| AC-06 | No se inventa una comprobación que no puede funcionar | E9 · E10 · `TD-14` | | | - | PENDIENTE |

**`AC-06` se verifica de dos formas y las dos hacen falta:** `E9` y `E10` prueban que el
verificador **no acusa** a trabajo correcto, y `TD-14` es la declaración escrita de lo que no se
puede comprobar. Un `AC` que sólo se cumpliera con la declaración sería una excusa; uno que sólo
se cumpliera con los casos no diría qué quedó fuera.
