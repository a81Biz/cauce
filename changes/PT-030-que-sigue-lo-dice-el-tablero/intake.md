# PT-030 — Qué sigue lo dice el tablero

> Tarea de la implementación abierta `EP-007` (`FDGE-R51`).

```yaml
---
id: PT-030
type: FEATURE
epic: EP-007
track: STANDARD
status: IN_PROGRESS
created: 2026-08-13
structural: no
suite_version: 7.1.0
phase: 4
---
```

## 1. Qué se quiere   `[HUMANO]`

> «que **no sepa hacer nada** si no consultas directamente a GitHub para saber qué sigue y cómo
> cerrar»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Una acción responde qué produce la fase actual y qué la cierra, **derivado** | selftest |
| AC-02 | La compuerta sale de la fase, no de un campo copiado | selftest |
| AC-03 | Un comentario humano sin responder **bloquea** la respuesta | selftest |
| AC-04 | Sin `phase` declarada la respuesta es `SIN EVALUAR`, no una suposición | selftest |
| AC-05 | Lo terminado no tiene «siguiente» | selftest |
| AC-06 | La regla está citada donde se lee antes de avanzar | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: la respuesta a «qué sigue» se obtiene de un comando y deja de depender de que
> el agente se acuerde.

## 4. Qué NO entra   `[AGENTE]`

- OUT: que el tablero asigne identificadores. El registro asigna (`SUITE-R08`)
- OUT: bloquear mecánicamente a quien no consulte. Un comando no puede exigir haber sido llamado
- OUT: la paridad entre modos de ejecución. Es `PT-031`

## 5. Firma

```
Firmado por lote: EP-007
```
