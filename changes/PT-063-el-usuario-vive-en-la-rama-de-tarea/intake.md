# PT-063 — El usuario vive en la rama de tarea

> Tarea de la implementación abierta `EP-016` (`FDGE-R51`).

```yaml
---
id: PT-063
type: CHORE
epic: EP-016
track: STANDARD
status: READY
created: 2026-08-18
structural: no
suite_version: 8.2.0
phase: 4
---
```

## 1. Qué se quiere   `[HUMANO]`

> **Decisión 3 del firmante, 2026-08-15:** «el usuario vive en la **rama de tarea** y `trabajo`
> sigue siendo única, para no añadir un cuarto nivel ni multiplicar `G4` contra `EXEC-R03`».

```
antes    <type>/PT-NNN-slug
ahora    <type>/<usuario>/PT-NNN-slug
```

`trabajo` sigue siendo **una**. `G4` sigue siendo **una por lote**. Lo único que cambia es que la
rama de tarea dice de quién es.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La rama de tarea lleva al usuario: `<type>/<usuario>/PT-NNN-slug` | selftest |
| AC-02 | `trabajo` sigue siendo **única**: no hay `trabajo/<usuario>` | selftest |
| AC-03 | `G4` sigue siendo **una por lote** (`EXEC-R03`) | selftest |
| AC-04 | Una rama con el formato **anterior** sigue valiendo: se termina como empezó | selftest |
| AC-05 | El usuario sale de la identidad declarada (`PT-061`), no de `git config` a pelo | selftest |
| AC-06 | `FDGE-R19` dice el formato nuevo, y el `CHANGELOG` trae **guía de migración** | `verify-suite` |

`AC-04` es lo que hace que esto no rompa a nadie a mitad de trabajo: una rama abierta con el
formato viejo no se renombra — se termina.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: una tarea nueva nace en `<type>/<usuario>/PT-NNN-slug`, una rama con el formato
> anterior sigue verificando sin errores, y `trabajo` y `G4` no se han multiplicado.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Quién es quién | PT-061 |
| `trabajo/<usuario>` | — |
| Una compuerta `G4` por persona | — |
| Renombrar ramas ya abiertas | — |

**La segunda y la tercera llevan `—` porque son la decisión 3 del firmante**, y el motivo está
razonado: un cuarto nivel de rama obliga a decidir quién integra el trabajo de quién antes de
`trabajo`, y `G4` por persona la convertiría en ocho compuertas en un lote de ocho tareas — que es
justo lo que `EXEC-R03` impide.

**La cuarta:** renombrar una rama viva rompe el PR abierto sobre ella. `AC-04` la deja terminar.

## 5. Firma

```
Firmado por lote: EP-016
```

> **Este es el cambio `MAJOR` del lote** (`SUITE-R19`). La guía de migración es obligatoria y se
> escribe al cerrar `EP-016`, no aquí.
