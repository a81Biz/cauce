# PT-040 — Qué puede fallar

> Tarea de la implementación abierta `EP-011` (`FDGE-R51`).

```yaml
---
id: PT-040
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

> «leo que cuando algo falla hay 177 reglas de un mensaje, pero ¿qué es lo que puede fallar?»

Derivar la lista de fallos posibles de los fail() reales.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La lista de fallos posibles se **deriva** de los `fail()` del código, no se escribe | ejecución |
| AC-02 | Cada fallo aparece con su regla y qué hacer | selftest |
| AC-03 | Un `fail()` nuevo sin entrada en la lista se detecta | selftest, caso inverso |

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
