# PT-020 — El grafo cubre las herramientas, no solo `bin`

> Tarea de la implementación abierta `EP-013` (`FDGE-R51`).

```yaml
---
id: PT-020
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

Que `REGISTRY.graph` describa el código propio. Hoy declara `scope: bin` y las 15 herramientas viven en `docs/methodology/tools/`: `FDGE-R43` se satisface sobre un grafo que no describe el sistema (`TD-01`, `FND-R28`).

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `REGISTRY.graph.scope` incluye `docs/methodology/tools/` | ejecución |
| AC-02 | El grafo regenerado contiene las 15 herramientas | ejecución |
| AC-03 | `FDGE-R43` deja de dar por bueno un grafo que no describe el sistema | selftest |
| AC-04 | El alcance excluye dependencias, fixtures y mocks (`FND-R28`) | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `REGISTRY.graph.scope` incluye `docs/methodology/tools/` y el grafo regenerado cubre las herramientas, con su fecha y su `pt_at_generation` al día.

## 4. Qué NO entra   `[AGENTE]`

- OUT: lo que resuelven las otras siete tareas de `EP-013`
- OUT: publicar. Decisión humana explícita, sostenida en tres lotes

## 5. Firma

```
Firmado por lote: EP-013
```
