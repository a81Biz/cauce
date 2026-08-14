# PT-035 — Sub-issues en vez de enlaces

> Tarea de la implementación abierta `EP-009` (`FDGE-R51`).

```yaml
---
id: PT-035
type: BUG
epic: EP-009
track: STANDARD
status: IN_PROGRESS
created: 2026-08-13
structural: no
suite_version: 7.3.0
phase: 2
---
```

## 1. Qué falla   `[AGENTE]`

`tracker` escribe las tareas de un lote como **enlaces en el cuerpo** del issue del lote. La
plataforma tiene sub-issues de verdad —con progreso, jerarquía y cierre en cascada— y no se
usaban.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Toda tarea con `epic` es sub-issue de su lote | ejecución real |
| AC-02 | Se calcula lo que **falta**, sin repetir lo ya anidado | selftest |
| AC-03 | Si la plataforma no sabe responder, `SIN EVALUAR`: no se afirma que falte | selftest |
| AC-04 | Se aplica también a la historia ya cerrada | ejecución real |
| AC-05 | La jerarquía sigue saliendo del registro, no de la plataforma | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: el árbol del tablero coincide con el del registro y se mantiene solo.

## 4. Qué NO entra   `[AGENTE]`

- OUT: quitar la lista del cuerpo del lote. Sirve para leerlo de un vistazo
- OUT: que la plataforma asigne la jerarquía (`SUITE-R08`)

## 5. Firma

```
Firmado por lote: EP-009
```
