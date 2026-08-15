# PT-023 — Auditar los cambios de especificación que `PT-018` declaró

> Tarea de la implementación abierta `EP-013` (`FDGE-R51`).

```yaml
---
id: PT-023
type: CHORE
epic: EP-013
track: STANDARD
status: DONE
created: 2026-08-14
structural: no
suite_version: 7.7.0
phase: 8
---
```

## 1. Qué se quiere   `[HUMANO]`

> «hazlos en orden»

Que se sepa **cuántas veces** un `spec-changes.md` declaró un cambio que no se hizo. `PT-021` encontró el primero; al revisar el tablero para abrir este lote apareció el **segundo**: `FDGE-Prompts.md` cita `SUITE-R44` y omite el vocabulario cerrado y la reciprocidad, que es lo que `PT-018` declaró que escribiría ahí.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Cada fila de cada `spec-changes.md` está comprobada contra el documento que dice cambiar | ejecución |
| AC-02 | Lo que se declaró y no se hizo está **enumerado**, no estimado | ejecución |
| AC-03 | El hallazgo ya conocido —`FDGE-Prompts.md` y `SUITE-R44`— queda corregido | selftest |
| AC-04 | Lo que no se puede comprobar mecánicamente se **dice** (`RULE-06`) | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: cada fila de cada `spec-changes.md` de este repositorio está comprobada contra el documento que dice cambiar, y lo que no se hizo está **enumerado**, no estimado.

## 4. Qué NO entra   `[AGENTE]`

- OUT: lo que resuelven las otras siete tareas de `EP-013`
- OUT: publicar. Decisión humana explícita, sostenida en tres lotes

## 5. Firma

```
Firmado por lote: EP-013
```
