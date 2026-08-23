# PT-115 — PARADA entra al vocabulario y a las reglas

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-115
type: FEATURE
epic: EP-020
track: STANDARD
status: READY
phase: 1
created: 2026-08-22
structural: si
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «cuando Claude trabaja en algo manda un mensaje explicativo después de cada tanda de herramientas y hace que se detenga. Este mensaje explicativo debe estar en github en su tarea correspondiente de forma que sepamos qué explica y la explicación»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `LEXICON` define `PARADA`: qué es, su lista CERRADA de clases de `motivo`, su lista CERRADA de clases de `desenlace`, y dónde vive | verify-suite: el término existe en LEXICON y ningún otro documento lo redefine (LEX-R23) |
| AC-02 | `RULES.md` define la regla `HARD` que obliga a publicarla, con su severidad y su fila en RIGE_DESDE | regla <ID> la encuentra, y audit la cuenta |
| AC-03 | `FDGE-R52` queda declarada COMO CASO PARTICULAR de la parada —una transición es una parada cuyo desenlace es «cambio de fase»— sin perder ninguna obligación | verify-suite no reporta obligación derogada; los casos vigentes de FDGE-R52 siguen verdes |
| AC-04 | La parada vive en el MISMO destino que la nota de reanclaje —issue si hay plataforma, TRANSICIONES.log si no— y no se inventa un archivo nuevo | LEX-R22: un hecho, un nombre |
| AC-05 | `CORE.md` regenerado la lleva | core:check |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: un agente que sólo cargue `CORE.md` sabe qué es una parada, cuándo publicarla y dónde va.

## 4. Qué NO entra   `[AGENTE]`

- OUT: el comando que la escribe: es PT-116
- OUT: la exigencia mecánica: es PT-117
- OUT: cambiar la lista de compuertas. Una parada NO es una compuerta: no detiene, deja rastro

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Desafío al enunciado literal (`INTAKE-R07`)**: «después de cada tanda de herramientas» produce decenas de comentarios por tarea y entierra `SUITE-R43`, que es la regla que detecta al humano sin responder. **Se recomienda** publicar la parada que lleva una DECISIÓN, con motivo dentro de la lista cerrada. Si el firmante mantiene el literal, se hace y consta como decisión suya.
- **El nombre es vocabulario nuevo y por eso va primero** (`LEX-R21`): introducirlo fuera de `LEXICON` es un defecto por definición.
- **Estructural: sí.** Toca `LEXICON`, `RULES` y `CORE`, que es lo que `FDGE-R44` define como estructural, y por tanto `FDGE-R32` pide regenerar el grafo antes de cerrar `PHASE 8`.
