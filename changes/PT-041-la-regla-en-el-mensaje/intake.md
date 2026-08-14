# PT-041 — La regla en el mensaje

> Tarea de la implementación abierta `EP-011` (`FDGE-R51`).

```yaml
---
id: PT-041
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

> «las diez ideas de las que se deduce la regla que no se ha leído… ¿cómo lo evitamos?»

Llegar a la regla desde el mensaje que la incumple.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Se puede pedir una regla por ID y obtener qué exige, por qué existe y qué hacer | ejecución |
| AC-02 | El mensaje de un fallo lleva a la regla, no solo la nombra | selftest |
| AC-03 | Una regla que no existe lo dice, en vez de devolver vacío | selftest |

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
