# PT-093 — Escenarios   `FDGE-R16`

| | Escenario | Espera |
|:---|:---|:---|
| `E1` | `EXECUTION-MODES.md` | declara **qué garantiza** la compuerta |
| `E2` | idem | …y **qué no**: que una persona ejecutara el merge |
| `E3` | idem | …y que `0` revisores **no es un descuido** |
| `E4` | idem | `EXEC-R04a` fija la **forma** |
| `E5` | idem | …y dice **dónde** mirar: `SESSION_LOG.md` |
| `E6` | `CORE.md` | la sub-regla **llega** al núcleo |
| `E7` | `build-core.mjs` | **los dos** extractores aceptan el sufijo |
| `E8` | `RIGE_DESDE` | la regla nueva declara desde cuándo rige |
| `E9` | `verify-fdge.mjs` | la comprobación de `PT-088` **está ahí**: «ya hecho» se enseña |

## `E3` es el que impide el malentendido más probable

Sin él, `0` revisores aprobadores se lee como configuración descuidada. Es **la única opción
viable** para el equipo de una persona que `SUITE-R22` declara soportado, y decirlo evita que
alguien lo «arregle» rompiendo el flujo.

## `E6` y `E7` son el mismo hecho por sus dos lados

`E6` comprueba el **resultado** —la regla está en `CORE`— y `E7` la **causa** —los dos extractores
la aceptan—. Sólo con `E6`, alguien podría arreglar el de prosa y dejar el de tabla roto: el caso
seguiría verde y el defecto vivo en la mitad que no se estrenó.

## Lo que NO se prueba, y consta

**Que la declaración sea leída.** Un límite declarado en `EXECUTION-MODES.md` y compilado a `CORE`
está donde el agente lo carga; que alguien lo tenga en cuenta al decidir no es mecanizable.

Es el mismo límite que `SUITE-R27` tiene desde que existe, y por eso esta tarea lo **declara** en
vez de prometer que lo resuelve.
