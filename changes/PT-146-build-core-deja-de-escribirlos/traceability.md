# PT-146 · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | No queda ningún literal de componente en `build-core.mjs` | TS-02 · TS-03 · TS-06 | — | — | n/a | `PENDIENTE` |
| AC-02 | `CORE.md` y `CORE-PTSA.md` **byte a byte idénticos** | TS-01 | — | — | n/a | `PENDIENTE` |

**Sólo dos `AC`, y el segundo es toda la tarea.** `build-core` genera lo único que el agente carga
(`SUITE-R15`), así que aquí «comportamiento preservado» no es «sin errores»: es **identidad byte a
byte**, y `build-core --check` existe para medirla.

**`AC-01` cubre cuatro sitios, no los tres del intake.** El cuarto —el mapa `label` de `:184`— lo
encontró `PHASE 2`, y no lo cazó la enumeración de `EP-022` porque **el barrido se hizo con `grep`
sobre patrones de prefijo** y `label` es un objeto: sus claves no casan ninguna alternancia.
Declarado en la parada de [#286](https://github.com/a81Biz/cauce/issues/286).

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `CORE.md` y `CORE-PTSA.md` idénticos | `build-core --check` **en cada paso** | `PENDIENTE` |
| RC-02 | El orden de emisión no cambia | TS-04 | `PENDIENTE` |
| RC-03 | `LEX`, `EXEC` y `PTSA` siguen tratándose aparte, cada una leyendo su archivo | TS-05 | `PENDIENTE` |
| RC-04 | Los triggers derivados son los del contrato, y las operaciones siguen ahí | TS-06 | `PENDIENTE` |

## Lo que esta tarea **no** establece, y ya se sabe

El bloque de triggers queda **mitad derivado, mitad literal**. Los `[START …]` salen del contrato;
las operaciones de `LEX-R16` —`resume PT-XXX`, `status FDGE`, `delta QA PT-XXX`,
`promote QD-NNN to FDGE|PTSA`, `audit PTSA close H-XXX`— **siguen escritas a mano**, porque el
contrato no las tiene y añadirlas exigiría un campo con **un solo consumidor**.

Está razonado en la parada de [#281](https://github.com/a81Biz/cauce/issues/281), y `TS-06` lo
fija con un caso para que nadie lo «arregle» creyendo que falta.
