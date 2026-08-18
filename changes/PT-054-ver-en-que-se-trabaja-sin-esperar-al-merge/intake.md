# PT-054 — Ver en qué se trabaja sin esperar al merge

> Tarea de la implementación abierta `EP-014` (`FDGE-R51`).

```yaml
---
id: PT-054
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

> «podremos ver de forma separada en qué está trabajando sin depender de la publicación de la
> rama» · **Decisión 1 del firmante, 2026-08-15: la rama es DERIVADA, no autorada.**

Una rama `cauce/<usuario>` que **agregue el estado de gobernanza de todo lo vivo** y que se pueda
leer sin fusionar nada.

Hoy la visibilidad existe pero está repartida: los artefactos de cada tarea viven en **su** rama,
y `trabajo` solo los recibe cuando la tarea se fusiona. Para ver ocho tareas en curso hay que
mirar ocho ramas.

**Por qué derivada y no autorada.** Si la gobernanza se **mudara** a otra rama, ningún commit
contendría el cambio y su evidencia; `SUITE-R34` compararía fechas entre dos ramas, que no
significa nada; y la trazabilidad —la razón de ser del marco— pasaría a ser una referencia que
git no sostiene. Derivada no rompe nada: **lo derivado no diverge**, que es lo que `EP-013`
aprendió con `REFACTOR_SCOPE.md` y `BACKLOG.md`.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker avanzar` proyecta a `cauce/<usuario>` el estado de gobernanza de lo vivo | selftest |
| AC-02 | La rama de tarea **conserva** artefactos y código juntos: el commit atómico no se toca | selftest |
| AC-03 | Todo lo proyectado se **deriva**. Un commit humano en esa rama se **detecta y se dice** | selftest |
| AC-04 | Cada entrada proyectada lleva el **SHA** de la rama de tarea de la que sale | selftest |
| AC-05 | El usuario sale de la configuración de git; si no se puede saber, **no se proyecta** y se dice (`RULE-06`) | selftest |
| AC-06 | La proyección **no** crea, mueve ni borra ramas remotas sin decirlo (`SUITE-R06f`) | selftest |

`AC-03` es lo que impide que la decisión se erosione sola: una rama derivada en la que alguien
escribe deja de serlo, y entonces vuelve a haber dos fuentes.

`AC-06` no es formalismo: `SUITE-R06f` pone el borrado de ramas remotas en la lista de lo que
**ningún** modo automatiza.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `cauce/<usuario>` muestra el estado de todas las tareas vivas sin haber
> fusionado ninguna, cada entrada cita el SHA del que sale, y un commit escrito a mano en esa
> rama se reporta como lo que es: la pérdida de la propiedad que la hace fiable.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Rangos de ID reservados y convivencia de dos personas | EP-016 |
| El usuario en la rama de tarea (`feature/<usuario>/PT-NNN-slug`) | EP-016 |
| Qué rama resuelve `G4` con varias personas | EP-016 |
| Mover los artefactos fuera de la rama de tarea | — |

La última lleva `—` porque **no se va a hacer**: es la opción que la decisión 1 descartó, y
dejarla como aplazada sería insinuar que sigue viva.

Esta tarea proyecta para **el usuario de git actual**, en singular. No es medio trabajo: es el
mecanismo completo, sobre el que `EP-016` añade identidad y rangos.

## 5. Firma

```
Firmado por lote: EP-014
```
