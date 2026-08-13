# PT-013 — Lo aplazado se enumera, no se narra

> Tarea de la implementación abierta `EP-004` (`FDGE-R51`).

```yaml
---
id: PT-013
type: BUG
epic: EP-004
track: STANDARD
status: READY
created: 2026-08-13
structural: no
suite_version: 6.0.1
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «es imposible que se te pasen u olviden cosas, se supone que todo está apuntado»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Lo que un lote aplaza **tiene identificador y su issue abierto** | Una allocation `DEFERRED` con su issue en el tablero |
| AC-02 | Se **deriva** de lo que ya se escribe | De los `out-of-scope.md`, no de un registro nuevo (`RULE-01`) |
| AC-07 | Un PT `DEFERRED` no se verifica como uno en curso | Sin intake ni fases, exigírselo sería un rojo permanente |
| AC-03 | Aplazar sin decir a dónde se detecta | Un out-of-scope que difiere sin destino es un agujero |
| AC-04 | Cerrar un lote con algo aplazado sin recoger **no pasa `G4`** | `verify-fdge --gate G4` falla; fuera de `G4` avisa |
| AC-05 | La regla existe en `RULES.md` | Una comprobación sin regla es un capricho del verificador |
| AC-06 | No impide aplazar | Aplazar es legítimo; perderlo de vista no |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: un comando enumera todo lo aplazado y sin recoger de este repositorio, y el
> hallazgo con el que se abrió la sesión aparece en esa lista si no estuviera ya resuelto.

## 4. Qué NO entra   `[AGENTE]`

- OUT: impedir que se aplace nada. Aplazar es una decisión legítima
- OUT: un registro nuevo. Se deriva de lo que ya existe (`RULE-01`)
- OUT: `ROADMAP.md`, que es de `FPGE` y solo su dueño escribe (`SUITE-R10`)
- OUT: interpretar si lo aplazado sigue teniendo sentido. Eso es humano

## 5. Firma

```
Firmado por lote: EP-004
```

---

## Evidencia, y es de esta misma sesión

`EP-001` declaró en su out-of-scope: «la migración del proyecto legado — es la implementación
siguiente». Se abrieron `EP-002` y `EP-003` sin recogerla. Cuatro versiones después seguía sin
hacerse, y lo detectó **una persona preguntando**, no el marco.

Lo aplazado estaba escrito en tres sitios —el out-of-scope del lote, el `HANDOFF` y el
`SESSION_LOG`— y ninguno era **una lista que alguien tuviera que mirar**. Prosa, no enumeración.

Es exactamente la avería que `PTSA-R79` nombra para las auditorías: «la auditoría cierra cuando
la matriz está completa, no cuando el auditor deja de encontrar hallazgos». El marco se lo
exige a PTSA y no se lo exige a sí mismo cuando aplaza trabajo.

---

## Revisiones

### Revisión 1 — 2026-08-13 · lo aplazado no se enumera: **se convierte en issue**

**Qué cambia.** El intake pedía que lo aplazado fuera «enumerable» — una salida que lo listara.
Sube a: **lo aplazado tiene identificador del registro y su propio issue abierto en GitHub**.

**Autorización**, del 2026-08-13:

> «debemos encontrar un mecanismo para que nada quede fuera de alcance o que se integre en un
> issue en github para retomarlo al final y que no se pierda»

**Por qué es mejor que enumerar.** Una lista hay que ir a mirarla. Un issue abierto **está en
el tablero**, con su fase y su compuerta, y el espejo lo comprueba en cada verificación. La
diferencia entre «está apuntado» y «no se puede perder» es exactamente esa.

**Y encaja con lo que el marco ya tiene**, sin inventar nada:

- `DEFERRED` **ya existe** como estado del ciclo de vida en `LEXICON` §5.1. Nunca se usaba.
- El registro sigue asignando (`SUITE-R08`): lo aplazado es una asignación con estado
  `DEFERRED`, no un issue suelto — un issue sin allocation sería denunciado como huérfano por
  el propio espejo.
- `tracker` ya sabe abrir, etiquetar y cerrar issues.

**Lo que hay que decidir en `PHASE 3`** y no estaba: si un PT `DEFERRED` se verifica como
cualquier otro —no puede: no tiene intake ni fases— o si queda exento como los terminales,
pero **vivo** para el espejo, que es lo que mantiene su issue abierto.

**`AC-01` y `AC-04` se reformulan** en consecuencia; los demás siguen.
