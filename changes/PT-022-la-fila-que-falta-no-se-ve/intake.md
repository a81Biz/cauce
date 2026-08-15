# PT-022 — La fila que falta no se ve

> Tarea de la implementación abierta `EP-005` (`FDGE-R51`).

```yaml
---
id: PT-022
type: BUG
epic: EP-005
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 7.0.0
phase: 10
---
```

## 1. Qué falla   `[AGENTE]`

`checkAplazado()` recorre las filas **que existen**. Una fila que falta no produce nada.

Consecuencia medida en `EP-004`: tres tareas pasaron `G4` y dos quedaron bloqueadas, y la
diferencia fue que las dos bloqueadas **escribieron** lo que aplazaban. El `out-of-scope` más
pobre es el que mejor pasa.

`SUITE-R44` se escribió contra «es imposible que se te pasen u olviden cosas» y, tal como está,
la forma barata de pasar la compuerta es no escribir lo que aplazas.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Lo que una tarea aplaza a su lote queda **recogido por el lote**, no solo citado | selftest |
| AC-02 | Un lote no cierra dejando sin responder una fila que lo cita | selftest + `G4` |
| AC-03 | Omitir la fila deja de ser gratis | selftest: se detecta el caso |
| AC-04 | No se exige que todas las tareas de un lote escriban lo mismo | selftest: caso inverso |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: declarar lo que aplazas no puede ser más caro que callártelo.

## 4. Qué NO entra   `[AGENTE]`

- OUT: el punto muerto de `CLOSED`. Es `PT-021`
- OUT: exigir un `out-of-scope` idéntico en todas las tareas de un lote. Cada tarea aplaza lo suyo
- OUT: adivinar qué filas «deberían» estar. Eso no es mecánico y se dirá en el diseño

## 5. Firma

```
Firmado por lote: EP-005
```
