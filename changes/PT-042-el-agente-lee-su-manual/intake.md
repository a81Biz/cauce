# PT-042 — El agente lee su manual

> Tarea de la implementación abierta `EP-011` (`FDGE-R51`).

```yaml
---
id: PT-042
type: FEATURE
epic: EP-011
track: STANDARD
status: DRAFT
created: 2026-08-14
structural: no
suite_version: 7.5.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «el propio agente debe leer su manual al principio y tener la capacidad de autorreferenciarse»

Que el agente lea su manual al instalar y sepa autorreferenciarse.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La instalación **empieza** por leer el manual, no por copiar archivos | ejecución |
| AC-02 | El arranque remite al manual además de al tablero | selftest |
| AC-03 | El agente puede consultar su propio manual por tema (autorreferencia) | ejecución |
| AC-04 | El marco sigue siendo usable si el manual no está | selftest |

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
