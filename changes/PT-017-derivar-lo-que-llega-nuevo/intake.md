# PT-017 — `migrate` deriva «qué llega nuevo»

> Tarea de la implementación abierta `EP-013` (`FDGE-R51`).

```yaml
---
id: PT-017
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

Que la lista de herramientas nuevas que `migrate` imprime salga de **comparar** el paquete con el destino, en vez de estar escrita a mano. Hoy es un hecho copiado (`RULE-01`) y se queda vieja sola.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La lista sale de **comparar** el paquete con el destino, no de una constante | selftest |
| AC-02 | Añadir un archivo a `tools/` aparece en el informe **sin tocar el código** | selftest |
| AC-03 | Si no se puede comparar, se **dice**; no se cae a la lista escrita a mano | selftest |
| AC-04 | Un destino ya al día no produce una fila vacía | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `migrate` enumera lo que llega nuevo comparando los dos árboles, y añadir una herramienta a `tools/` aparece en el informe **sin tocar el código**.

## 4. Qué NO entra   `[AGENTE]`

- OUT: lo que resuelven las otras siete tareas de `EP-013`
- OUT: publicar. Decisión humana explícita, sostenida en tres lotes

## 5. Firma

```
Firmado por lote: EP-013
```
