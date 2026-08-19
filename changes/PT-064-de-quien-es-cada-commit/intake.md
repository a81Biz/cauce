# PT-064 — De quién es cada commit

> Tarea de la implementación abierta `EP-016` (`FDGE-R51`).

```yaml
---
id: PT-064
type: CHORE
epic: EP-016
track: STANDARD
status: READY
created: 2026-08-18
structural: no
suite_version: 8.2.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

`EP-015` lo dejó declarado y sin cerrar, con estas palabras:

> «El día de dos personas son **dos sesiones** que `porSesion()` cuenta como **una**, y el techo
> histórico —del que depende `AC-06` de `PT-059`— sale **inflado**.»

Que el coste típico, el precedente de la sesión y el techo histórico dejen de **mezclar personas**.

Hoy `tracker coste` deriva de todas las tareas cerradas y `tracker viabilidad` del trabajo del día,
sin mirar de quién es. Con una persona da igual. Con dos, la compuerta que decide si empezar una
tarea estaría comparando contra el trabajo de otro.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El precedente de una sesión sale **solo** del trabajo de esa persona | selftest |
| AC-02 | El techo histórico se calcula **por persona**, no sumando a todas | selftest |
| AC-03 | El coste típico puede pedirse **de todos** o **de una persona**, y dice cuál es | selftest |
| AC-04 | Un commit sin persona declarada **no se reparte**: cuenta como `SIN EVALUAR` | selftest |
| AC-05 | Con una sola persona declarada, las cifras **no cambian** respecto a hoy | selftest |

`AC-03` es una decisión, no un descuido: el coste típico **de todos** es mejor referencia —más
casos— y el **de una persona** es más ajustado. Las dos valen; lo que no vale es no saber cuál te
están dando.

`AC-05` es lo que impide que esta tarea rompa `EP-015` por el camino.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: con dos personas declaradas, el precedente y el techo de cada una salen de su
> propio trabajo; y con una sola persona todas las cifras son las de hoy.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Quién es quién | PT-061 |
| La sesión por persona | PT-065 |
| Cambiar la lógica de `viabilidadDe` o `costeDe` | — |
| Comparar el rendimiento de dos personas | — |

**La tercera lleva `—` y es deliberada:** `PT-059` y `PT-057` decidieron **cómo** se calcula. Esta
tarea cambia **de dónde salen las entradas**, igual que `PT-060` hizo con el `desde`. Tocar la
lógica sería rehacer dos tareas cerradas por la puerta de atrás.

**La cuarta también, y es lo más importante del lote:** esto sirve para que el marco **no decida
mal**, no para medir a nadie. Una cifra por persona presentada como comparación es una herramienta
distinta, con otras consecuencias, y no es esta.

## 5. Firma

```
Firmado por lote: EP-016
```
