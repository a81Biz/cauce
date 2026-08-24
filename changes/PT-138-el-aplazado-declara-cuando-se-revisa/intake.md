# PT-138 — un aplazado no dice cuándo se revisa, ni quién responde

> Tarea dentro de la implementación abierta `EP-021` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-138
type: BUG
epic: EP-021
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-24
structural: no
suite_version: 13.0.0
origen_parada: EP-021
---
```

## 1. Qué se quiere   `[HUMANO]`

`SUITE-R44` garantiza que un aplazado quede **vivo en el espejo** y **exento de artefactos**, y
ahí termina. Contrastado contra los dos aplazados reales:

| | `PT-134` #255 | `PT-025` #35 |
|:---|:---|:---|
| Condición de reentrada | — | — |
| Fecha de revisión | — | — |
| Dueño | — | — |

**En el tablero son indistinguibles**, y también de un abandono. `PT-137` construyó la puerta de
vuelta; **nadie sabe cuándo cruzarla**.

Y al medirlo aparece la simétrica: **ningún comando escribe `DEFERRED`**. Los dos aplazados que
existen se escribieron a mano. La puerta de salida tampoco existía.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker aplazar PT-NNN` escribe `DEFERRED` **por comando**, y es la única vía sancionada | un caso que lo ejecuta y otro que comprueba que no había ninguna antes |
| AC-02 | Exige **condición de reentrada**, **fecha de revisión** y **dueño**: sin los tres no escribe | un caso por cada campo ausente |
| AC-03 | La condición es un **texto libre con contenido**, no una celda que se rellena para callar | falla con vacío y con menos de lo que una condición necesita |
| AC-04 | La fecha de revisión es **futura**: una revisión ya pasada nace caducada | un caso con fecha anterior |
| AC-05 | El dueño se contrasta contra `REGISTRY.personas`/`firmantes` (`SUITE-R27`) | un dueño inventado falla |
| AC-06 | `SUITE-R44` declara los tres campos, y `LEXICON` el vocabulario | `verify-suite` sin errores |
| AC-07 | Los dos aplazados **existentes** se completan o se declara por qué no | `PT-025` y `PT-134`, uno a uno |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `tracker aplazar` es la única forma de escribir `DEFERRED`, exige los tres
> campos, y ningún aplazado del registro queda sin ellos o sin una razón escrita.

## 4. Qué NO entra   `[AGENTE]`

- OUT: **bloquear en `G4`** por un aplazado caducado. Es `PT-139`: aquí se escriben los datos,
  allí se les pone compuerta.
- OUT: retrofechar `PT-025`. Su condición de reentrada la conoce quien conoce el negocio, y
  inventarla sería exactamente lo que `RULE-06` prohíbe.
- OUT: notificar cuando llegue la fecha. El marco no tiene ni debe tener un reloj que avise.

## 5. Firma

```
Firmado por lote: EP-021
```

---

## Observaciones del agente   `INTAKE-R07`

- **La carencia es simétrica y no se vio hasta construir la mitad.** `PT-137` encontró que no
  había puerta de vuelta; midiendo esta tarea resulta que **tampoco había de ida**. Un estado que
  ninguna herramienta escribe ni retira sólo existe porque alguien lo teclea.
- **El riesgo de esta tarea es el campo que se rellena para callar la comprobación.** Una fecha
  de revisión inventada es peor que ninguna: parece gestión. `AC-04` lo ataca por donde se puede
  —exigiendo que sea futura— y el resto se declara como no mecanizable (`SUITE-R26`).
