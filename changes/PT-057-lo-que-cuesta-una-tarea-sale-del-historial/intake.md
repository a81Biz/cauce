# PT-057 — Lo que cuesta una tarea sale del historial

> Tarea de la implementación abierta `EP-015` (`FDGE-R51`).

```yaml
---
id: PT-057
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

> **Decisión 4 del firmante:** «el presupuesto se calculará mediante señales observables e
> historial real del repositorio… El framework estima el riesgo de que una tarea no pueda terminar
> dentro de la sesión; no pretende conocer artificialmente cuántos tokens de contexto le quedan al
> modelo.»

Que exista una cifra de **lo que cuesta una tarea**, y que salga de las **56 tareas cerradas** que
este repositorio ya tiene en `HISTORY.log` — no de una estimación escrita a mano ni de un número
que el marco no puede medir.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El coste se **deriva** de tareas cerradas: archivos, commits, notas, casos | selftest |
| AC-02 | Se puede comparar una tarea nueva con las **de su mismo tipo y complejidad** | selftest |
| AC-03 | Con pocas tareas cerradas de ese tipo, lo **dice**; no extrapola en silencio | selftest |
| AC-04 | Ninguna cifra sale de la memoria del agente ni de una tabla escrita a mano | selftest |

`AC-03` es el que impide que esto sea peor que nada: una media de **dos** tareas presentada con la
misma seguridad que una de treinta es una cifra que engaña por precisión aparente.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: preguntar por el coste de un `CHORE/STANDARD` responde con una cifra **derivada
> de las tareas cerradas de ese tipo**, dice **de cuántas** sale, y con muy pocas lo declara en vez
> de dar un número.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Distinguir `MEDIDO` de `ESTIMADO` | PT-058 |
| Decidir con la cifra: `SAFE`/`MARGINAL`/`UNSAFE` | PT-059 |
| Medir el contexto restante del modelo | — |
| Predecir el coste de una tarea concreta | — |

**La tercera lleva `—` y es la decisión que gobierna el lote entero.** El marco **no puede** medir
el contexto restante, y fabricarlo sería un dato falso con forma de medida.

La cuarta también: esto da el coste **típico de un tipo de tarea**, no el de *ésta*. Prometer lo
segundo sería vender una predicción donde hay una referencia.

## 5. Firma

```
Firmado por lote: EP-015
```
