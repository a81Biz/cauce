# PT-053 — La transición de fase es un solo acto

> Tarea de la implementación abierta `EP-014` (`FDGE-R51`).

```yaml
---
id: PT-053
type: CHORE
epic: EP-014
track: STANDARD
status: READY
created: 2026-08-15
structural: no
suite_version: 8.0.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «`tracker avanzar` debe convertirse en la operación atómica que concentre: transición, nota de
> reanclaje, registro, YAML, índice, `CHECKPOINT.json`, proyección y validaciones»

Que avanzar de fase sea **un comando**, y que **se niegue a avanzar sin la nota**.

Hoy son cinco actos manuales:

```
1  tracker siguiente             consultar que toca
2  gh issue comment              la nota de reanclaje       FDGE-R52
3  REGISTRY.json  → phase        el registro asigna         SUITE-R08
4  intake.md YAML → phase        el PT dice de si mismo     PT-004
5  el indice / el espejo         cuando cambia el estado    SUITE-R35
```

Y la medida de `EP-013`: **65 transiciones ≈ 325 operaciones** en una sesión, con **ocho fallos de
CI**, los ocho por hacer cuatro de los cinco.

**El efecto que importa no es el ahorro.** Hoy la nota de reanclaje es lo **último** que se hace y
por eso es lo primero que se olvida —`FDGE-R52` cazó la misma transición tres veces—. Si el
comando la exige **como argumento**, escribirla deja de ser un acto de voluntad.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker avanzar PT-NNN --a N --nota "…"` ejecuta los cinco actos y escribe el checkpoint | selftest |
| AC-02 | **Sin `--nota` no avanza.** No es un aviso: es una negativa | selftest |
| AC-03 | Es **atómico**: si un paso falla, ninguno queda aplicado. Cuatro de cinco es el defecto que motiva la tarea | selftest |
| AC-04 | La fase destino se **valida** contra la actual: no se salta ni retrocede en silencio | selftest |
| AC-05 | Sin acceso a la plataforma **lo dice** y no avanza a medias (`RULE-06`, `FND-R30`) | selftest |
| AC-06 | El nombre `avanzar` está en `LEXICON` con las demás acciones del tracker (`LEX-R21`) | `verify-suite` |

`AC-03` es el corazón. La atomicidad no es elegancia: los ocho fallos de CI de `EP-013` fueron
exactamente estados a medias.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: una transición de fase se ejecuta con un comando; sin `--nota` el comando se
> niega; y romper un paso a propósito deja el registro, el YAML, el índice y el checkpoint
> **como estaban**, no a medias.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| El formato y el contrato del checkpoint | PT-052 |
| Proyectar a `cauce/<usuario>` | PT-054 |
| Evaluar el presupuesto antes de avanzar | EP-015 |
| Que `avanzar` resuelva compuertas | — |
| Que `avanzar` haga commit o push | — |

Las dos últimas llevan `—` y son frontera, no pereza. `EXEC-R04` y `SUITE-R06a` dejan las
compuertas en manos humanas; y un comando que además commitea decide **qué entra en el commit**,
que es justo lo que `FDGE-R19` reserva a quien hace el trabajo.

## 5. Firma

```
Firmado por lote: EP-014
```
