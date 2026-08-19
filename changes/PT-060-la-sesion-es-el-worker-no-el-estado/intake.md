# PT-060 — La sesión es el worker, no el estado

> Tarea de la implementación abierta `EP-015` (`FDGE-R51`).

```yaml
---
id: PT-060
type: CHORE
epic: EP-015
track: STANDARD
status: READY
created: 2026-08-18
structural: no
suite_version: 8.1.0
phase: 5
---
```

## 1. Qué se quiere   `[HUMANO]`

> «`SESSION ≠ STATE` · `SESSION ≠ TASK`. La sesión de IA debe considerarse un recurso temporal. El
> estado real del trabajo debe pertenecer al framework y ser persistente.»

Que la sesión sea una **entidad con su propio estado transitorio**, y que el handoff de cambio de
sesión **se derive** en vez de escribirse.

Y una corrección a la especificación de la que sale este lote, razonada en `EP-014`: sus estados
`CHECKPOINTING`, `HANDOFF_REQUIRED` y `WAITING_NEW_SESSION` **no son estados de tarea**. Durante un
handoff la tarea sigue `IN_PROGRESS`; lo que termina es la sesión. Meterlos en el registro
permanente contaminaría bajo `SUITE-R09` lo que es mecánica transitoria.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `SESSION.json` declara el estado de la **sesión**, y todos sus campos se **derivan** (`LEX-R26`) | selftest |
| AC-02 | Los estados de sesión **no** entran en `REGISTRY.json` | selftest |
| AC-03 | Se **sobrescribe**; las transiciones se apilan en `SESSION_LOG.md` | selftest |
| AC-04 | El handoff de cambio de sesión se **deriva** del checkpoint | selftest |
| AC-05 | **No** sustituye `HANDOFF.md` ni reescribe su prosa: solo su sello | selftest |
| AC-06 | Una tarea puede recorrer dos sesiones sin repetir el análisis | evidencia, ejecutado |

`AC-06` es el criterio de éxito del lote, y es el único que **no** se comprueba con un caso: se
ejecuta y se captura.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: una tarea se para, cambia de sesión y continúa **desde el siguiente punto
> pendiente** sin volver a abrir lo que la sesión anterior ya leyó — y eso está **ejecutado** en la
> evidencia, no descrito.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| La compuerta de presupuesto | PT-059 |
| Validar el árbol al reanudar | PT-056 |
| Los estados de sesión en `LEXICON` como estados de **tarea** | — |
| Un ledger append-only de sesiones aparte de `SESSION_LOG.md` | — |

**La tercera lleva `—` y es la corrección a la especificación**: son de sesión, no de tarea, y
mezclarlas rompería `SESSION ≠ TASK` — que es el principio que la propia especificación enuncia.

**La cuarta también**: `SESSION_LOG.md` ya es el ledger de sesiones. Uno nuevo sería el mismo hecho
en dos sitios (`SUITE-R38`).

## 5. Firma

```
Firmado por lote: EP-015
```
