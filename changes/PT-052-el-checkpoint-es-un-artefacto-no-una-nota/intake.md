# PT-052 — El checkpoint es un artefacto, no una nota

> Tarea de la implementación abierta `EP-014` (`FDGE-R51`).

```yaml
---
id: PT-052
type: CHORE
epic: EP-014
track: STANDARD
status: INTEGRATED
created: 2026-08-15
structural: no
suite_version: 8.0.0
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «§5 Checkpoint Manager · los checkpoints deben permitir reconstruir exactamente dónde quedó la
> ejecución» · decisión del firmante del 2026-08-15

Que el estado de una tarea en curso sea **legible por máquina** y esté **atado al commit del
código**.

Hoy ese estado existe, y en dos formas que no sirven para reanudar: prosa en las notas de
reanclaje —que viven en la plataforma— y `HANDOFF.md`, que es del **proyecto** y no de la tarea.
Nada dice, en un formato que un programa pueda leer, «`PT-053` va por `PHASE 5`, tocó estos
archivos, el código está en este SHA, y lo siguiente es esto».

**Y nada ata la gobernanza al código.** Hoy los ata que viajen en el mismo commit. En cuanto
`PT-054` proyecte a otra rama, ese vínculo hay que **escribirlo**.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `CHECKPOINT.json` declara tarea, fase, rama, **SHA del código**, archivos tocados y siguiente acción | selftest |
| AC-02 | Se **sobrescribe**, no se apila: es el estado actual, como `HANDOFF.md` | selftest |
| AC-03 | Todo campo sale de git o del registro. **Ningún campo se rellena de memoria** (`RULE-06`) | selftest |
| AC-04 | El SHA que declara **existe** y es alcanzable: un checkpoint que apunta a nada es peor que ninguno | selftest |
| AC-05 | El nombre y la forma están en `LEXICON` antes de existir en el código (`LEX-R21`) | `verify-suite` |

`AC-04` es el germen de `STATE_MISMATCH` (`EP-015`): aquí solo se exige que el SHA sea real; que
el árbol **corresponda** a ese SHA es del lote siguiente.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: existe `CHECKPOINT.json` con su contrato en `LEXICON`, cada campo se deriva de
> git o del registro, y un checkpoint cuyo SHA no existe **falla** en vez de aceptarse.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Quién **escribe** el checkpoint en cada transición | PT-053 |
| Proyectarlo a otra rama | PT-054 |
| Validar el árbol contra el checkpoint al reanudar (`STATE_MISMATCH`) | EP-015 |
| El presupuesto de sesión y `BLOCKED_BY_CONTEXT` | EP-015 |
| Un ledger append-only de checkpoints | — |

La última lleva `—` y es una decisión, no un olvido: las **transiciones** se apilan en
`SESSION_LOG.md` y el **estado** se sobrescribe, que es la forma que el marco ya usa con
`HISTORY.log` y `HANDOFF.md`. Un ledger nuevo bajo `SUITE-R09` haría permanente lo que es
mecánica de sesión.

## 5. Firma

```
Firmado por lote: EP-014
```

## Estado de cierre   `FDGE-R35`

```
INTEGRATED · integrado en la rama por defecto el 2026-08-18
G4 de EP-014 resuelta por Alberto Martinez: «haz el PR y el merge con lo que falte
de G4 para las tareas». El directorio se CONSERVA: es el registro de la propuesta
y de su evidencia.
```
