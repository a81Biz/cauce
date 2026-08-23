# PT-125 — Clasificar las 131 entradas cerradas en EVENTOS.jsonl

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-125
type: INVESTIGATION
epic: EP-020
track: STANDARD
status: READY
phase: 1
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

> **El campo `type` NO está en `REGISTRY.json`**, y no es un olvido: `tracker asignar` rechaza
> `INVESTIGATION` diciendo que «LEXICON declara: BUG · FEATURE · CHANGE · TAREA». `LEXICON` §943 declara
> otra cosa. Es el defecto de `PT-124`, y hasta que cierre el campo se queda **ausente antes que
> inventado** (`RULE-06`).

## 1. Qué se quiere   `[HUMANO]`

> «quiero que releas las tareas ya cerradas y realices una matriz de eventos, quiero saber qué ocurrió, qué se mejoró, qué se repite»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `docs/implementation/EVENTOS.jsonl` existe, es append-only, y lleva un registro por evento con: tarea, fecha, clase, CITA TEXTUAL y naturaleza | un registro sin cita se rechaza |
| AC-02 | Toda clasificación va marcada `DECLARADO`: la clase es un juicio, no una derivación, y se dice | ningún registro se presenta como MEDIDO sin una cifra que lo respalde |
| AC-03 | Las 131 entradas de `HISTORY.log` más `INCIDENTS.log` quedan recorridas, y las que no encajan en ninguna clase se declaran en vez de forzarse | el recuento de recorridas coincide con el de entradas |
| AC-04 | Ninguna tarea cerrada se rejuzga ni se reabre | SUITE-R36: lo cerrado es evidencia, no estado |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: cada afirmación de recurrencia del ledger tiene un registro con su cita y su clase.

## 4. Qué NO entra   `[AGENTE]`

- OUT: producir la matriz: es PT-119. Aquí sólo se clasifica
- OUT: reescribir o corregir entradas de HISTORY.log (SUITE-R09)
- OUT: clasificar lo que ocurra a partir de ahora: eso lo declara cada entrada nueva (PT-126)

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **La medida que justifica la tarea**: 113 de las 131 entradas contienen al menos una afirmación de recurrencia, y ninguna suma con otra.
- **No produce código** (`FDGE-R10`), así que está exenta de la matriz de trazabilidad de tests.
- **El límite es el acceso**: cinco `INC` de `EP-019` viven en el `INCIDENTS.log` de otro proyecto que no está en esta máquina. Se declaran, no se inventan.
