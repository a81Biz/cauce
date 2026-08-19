# PT-062 — Los IDs se reparten por rangos reservados

> Tarea de la implementación abierta `EP-016` (`FDGE-R51`).

```yaml
---
id: PT-062
type: CHORE
epic: EP-016
track: STANDARD
status: READY
created: 2026-08-18
structural: no
suite_version: 8.2.0
phase: 5
---
```

## 1. Qué se quiere   `[HUMANO]`

> **Decisión 2 del firmante, 2026-08-15:** «los IDs multiusuario se reparten por **rangos
> reservados por persona**, sin tocar `SUITE-R08` ni namespacear el identificador».

Que dos personas puedan pedir un `PT` a la vez y no reciban el mismo número.

Hoy el registro tiene **un** contador (`counters.PT`). Dos personas trabajando en paralelo lo leen
igual, asignan igual, y **colisionan en el primer merge** — con dos tareas distintas llamadas lo
mismo y una historia que ya no se puede desenredar.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Cada persona tiene un **rango reservado**, declarado en el registro | selftest |
| AC-02 | El **registro sigue asignando** (`SUITE-R08`): el rango acota, no sustituye | selftest |
| AC-03 | El identificador **no se namespacea**: sigue siendo `PT-NNN` | selftest |
| AC-04 | Dos rangos **no se solapan**, y solaparlos **falla** | selftest |
| AC-05 | Agotar un rango se **dice**; no se invade el siguiente | selftest |
| AC-06 | Sin rangos declarados, el comportamiento de hoy **no cambia** | selftest |

`AC-06` es lo que hace esto compatible: un proyecto de una persona no tiene que declarar nada, y
todo sigue igual. `AC-05` es el que impide el daño silencioso — invadir el rango de otro produce
exactamente la colisión que esto existe para evitar, pero más tarde y más difícil de ver.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: dos personas con rangos declarados piden un `PT` cada una y reciben números de
> **su** rango; un rango agotado lo dice; y un proyecto sin rangos declarados funciona como hoy.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Quién es quién | PT-061 |
| El usuario en la rama | PT-063 |
| Namespacear el identificador (`PT-alberto-001`) | — |
| Un servicio central que reparta números | — |
| Renumerar lo ya asignado | — |

**La tercera lleva `—` y es la decisión del firmante**: namespacear cambiaría **todos** los
identificadores del marco —`LEX-R04` los declara permanentes— y rompería cada referencia escrita en
sesenta tareas cerradas.

**La cuarta:** un servicio central necesita estar disponible para asignar. El registro es un
archivo en el repositorio, y eso es lo que hace que `SUITE-R08` funcione sin red.

**Y la quinta:** `LEX-R04` · un identificador **nunca se renumera**. Los rangos aplican a lo que se
asigne desde ahora.

## 5. Firma

```
Firmado por lote: EP-016
```
