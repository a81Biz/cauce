# PT-118 — La taxonomia de clases de evento, cerrada, en LEXICON

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-118
type: FEATURE
epic: EP-020
track: STANDARD
status: READY
phase: 8
created: 2026-08-22
structural: si
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «quiero saber qué ocurrió, qué se mejoró, qué se repite»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `LEXICON` declara una TERCERA clase de identificador —ni ítem de trabajo ni regla— y dice explícitamente que NO se asigna desde `REGISTRY.json` | verify-suite; LEX-R04 sigue rigiendo sobre las otras dos clases |
| AC-02 | El prefijo elegido no colisiona con `E-NNN` (PTSA), `P-NNN`, `R-NNN`, `H-NNN` ni `U-NNN` | un caso que enumera los prefijos vivos y comprueba la ausencia de colisión |
| AC-03 | Las quince clases medidas en §2.1 del intake del lote entran como semilla, cada una con su enunciado en una frase | verify-suite: toda clase citada en otro documento existe aquí |
| AC-04 | `CORE.md` la lleva | core:check |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: una clase de evento tiene un nombre canónico y un solo sitio donde se define.

## 4. Qué NO entra   `[AGENTE]`

- OUT: clasificar las entradas: es PT-125
- OUT: añadir un contador de clases a REGISTRY.counters: una clase no es un ítem de trabajo
- OUT: cerrar la lista para siempre. Es cerrada por versión, ampliable por cambio de metodología

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **`E-NNN` ya es de PTSA** y `LEXICON` §4 sólo tiene hoy dos clases de identificador. Si esta tercera no se declara, dentro de dos versiones alguien la asignará contando entradas — que es exactamente lo que `LEX-R04` prohíbe.
- **La lista nace con quince y no se promete completa**: `PT-125` puede encontrar más, y eso es la tarea funcionando.
