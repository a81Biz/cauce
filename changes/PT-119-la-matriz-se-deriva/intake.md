# PT-119 — tools/matriz.mjs deriva MATRIZ.md

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-119
type: FEATURE
epic: EP-020
track: STANDARD
status: READY
phase: 8
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «quiero la matriz para saber qué falta por corregir, qué errores se repiten y cómo los vamos a solventar»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tools/matriz.mjs` escribe `docs/implementation/MATRIZ.md` con: clase · veces · primera y última aparición · tareas · regla dueña · si esa regla tiene verificador · estado | un caso sobre el fixture con clases conocidas |
| AC-02 | TODAS las cifras se DERIVAN de `EVENTOS.jsonl` cruzado con `REGISTRY.json` y con las reglas: ninguna se transcribe | la inversa: alterar el jsonl cambia la cifra sin tocar el .md |
| AC-03 | Lo que no puede leerse sale `SIN EVALUAR` y es distinguible de «cero» | RULE-06; un jsonl ilegible NO produce el mismo informe que uno vacío |
| AC-04 | «regla dueña» y «tiene verificador» se derivan de `RULES.md` y de los `fail()` reales, no de una tabla escrita a mano | el mismo origen que regla --fallos |
| AC-05 | `npm run matriz` existe y `verify-suite` comprueba que `MATRIZ.md` está al día respecto de su fuente | core:check-style: un .md derivado desincronizado falla |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: la pregunta «qué se repite y no tiene dueño» se responde ejecutando un comando.

## 4. Qué NO entra   `[AGENTE]`

- OUT: clasificar: la clasificación es la entrada, no la salida
- OUT: abrir tareas automáticamente desde la matriz. Propone; decide una persona (FPGE-R04)
- OUT: puntuar o priorizar. Eso es FPGE y tiene su propia fórmula

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es `H-007` otra vez, aplicado a una tabla nueva**: `PT-091` demostró que una cifra transcrita caduca en un día. Una matriz escrita a mano sería la decimosexta instancia de su propia primera fila.
- **El tercer desenlace es el que importa** (lección de `PT-110`): sin `SIN EVALUAR`, un `EVENTOS.jsonl` ilegible produciría el mismo informe que uno perfecto.
