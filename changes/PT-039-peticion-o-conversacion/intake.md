# PT-039 — Petición o conversación

> Tarea de la implementación abierta `EP-011` (`FDGE-R51`).

```yaml
---
id: PT-039
type: FEATURE
epic: EP-011
track: STANDARD
status: INTEGRATED
created: 2026-08-14
structural: no
suite_version: 7.5.0
phase: 9
---
```

## 1. Qué se quiere   `[HUMANO]`

> «necesitamos distinguir entre las solicitudes de algo y la interacción por el intercambio de ideas para llegar a un punto»

Distinguir qué se me está pidiendo antes de actuar.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `SUITE-R52` define petición por su **condición de terminado** | selftest |
| AC-02 | El núcleo abre preguntando qué es, **antes** de consultar el tablero | selftest |
| AC-03 | Se **declara** en una línea y se puede corregir: no se decide en silencio | selftest |
| AC-04 | Una conversación no abre `allocation` ni gasta compuertas | selftest |
| AC-05 | `siguiente EP-NNN` deja de tomar el identificador como ruta | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: se detalla en `PHASE 1` de esta tarea. El lote está firmado; el alcance
> concreto se cierra al abrirla, no antes — inventarlo ahora sería el mismo defecto que
> `EP-010` corrigió: escribir sin la lista.

## 4. Qué NO entra   `[AGENTE]`

- OUT: lo que resuelven las otras cuatro tareas de `EP-011`
- OUT: publicar. Decisión humana: «antes de publicar, debemos solventar todo»

## 5. Firma

```
Firmado por lote: EP-011
```
