# PT-088 — Cambios de especificación   `SUITE-R00` · `LEX-R22`

**Ninguna regla nueva.** `SUITE-R09`, `EXEC-R04` y `SUITE-R01` ya existían y ya eran `HARD`. Lo
que cambia es que **dos pasan a tener verificador** y **una pasa a estar declarada**.

| Documento | Cambio | Regla que lo obliga |
|:---|:---|:---|
| `tools/patrones.mjs` | `RIGE_DESDE`: `SUITE-R09` y `EXEC-R04` en `[11,0,0]` | `SUITE-R19` · una regla nueva no rige hacia atrás |
| `docs/implementation/NO-VERIFICABLES.md` | fila de `SUITE-R01`, con motivo y firma | `SUITE-R26` · ninguna regla queda sin clasificar |

**`RULES.md` no se toca.** El texto de las tres reglas es correcto tal como está; lo que faltaba
era su comprobación, y las reglas no enuncian sus verificadores (`LEX-R22`).

---

## Lo que sí cambia para un proyecto destino, y por qué es `MAJOR`

Un proyecto que hoy pasa `cauce verify` puede **empezar a fallar** en dos sitios:

```
SUITE-R09   si alguna vez reescribio un ledger y lo commiteo
EXEC-R04    si mergeo a su rama por defecto sin dejar constancia en SESSION_LOG.md
```

Las dos reglas **ya le obligaban** —son `HARD` desde hace versiones— pero nadie las comprobaba.
Empezar a comprobarlas es, en efecto, romper: es exactamente el criterio con el que subió la
`10.0.0`, cuya entrada dice *«`MAJOR` porque rompe: entran reglas `HARD` nuevas con verificadores
que fallan»*.

**La decisión de versión no se toma aquí.** Es fila de la tabla de cierre de `EP-018`, porque
depende de qué traigan las otras seis tareas. Lo que sí queda fijado es el **ancla**: `[11,0,0]`,
y si el lote acabara siendo `MINOR` habría que corregirla antes de sellar — `verify-suite` lo
avisa, que es como se encontró que `SUITE-R57` no tenía la suya.

---

## La guía de migración que esto va a necesitar   `SUITE-R19`

Se escribe al cerrar el lote, y ya se sabe qué tiene que decir:

| Regla | Qué hacer en tu proyecto |
|:---|:---|
| `SUITE-R09` | `git diff <tu-tag-anterior> HEAD -- docs/implementation/HISTORY.log` y comprobar que no hay líneas `-`. Si las hay, **no se reescribe para arreglarlo**: se añade una entrada que corrija |
| `EXEC-R04` | Nada retroactivo: la regla rige desde su versión de entrada. Para los merges nuevos, una entrada `## <fecha> · …G4…` en `SESSION_LOG.md` con un nombre de `firmantes:` |

**El primero es el que puede doler**, y por eso su instrucción dice explícitamente qué **no**
hacer: arreglar una violación de append-only reescribiendo el archivo es cometerla otra vez.
