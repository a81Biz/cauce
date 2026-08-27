# `PT-165` — El mapa de fases de `CORE` lo escribe `build-core` a mano, y contradecía `FPGE-R04`

```yaml
---
id: PT-165
type: BUG
severity: S2
epic: EP-024
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Qué pasa

`CORE.md` publica un mapa de fases por componente. `build-core` lo escribía con rangos **a mano** —
literales en el generador— mientras `patrones.mjs` ya declaraba las fases de cada componente en el
contrato. Dos mapas del mismo hecho, y solo uno se comprueba.

Divergieron. El mapa a mano contradecía `FPGE-R04`, y lo publicaba en el documento que el agente
carga por defecto: **el error viajaba a cada sesión**.

## 2. Comportamiento observado, medido

El rango escrito a mano para `FPGE` no coincidía con `fasesDe('FPGE')`, que sale del contrato que
`verify-patrones` ejecuta. `CORE` decía una cosa y la norma otra.

Es `RULE-01` incumplido dentro de la propia herramienta que existe para cumplirla: un hecho, dos
casas. Y es el mismo defecto que `PT-149` encontró en el colador de componentes — un generador que
deriva casi todo y deja un trozo escrito a mano es un generador que promete más de lo que da
(`SUITE-R26`).

## 3. Alcance

| | |
|:---|:---|
| **IN** | `build-core`: el mapa de fases se **deriva** de `fasesDe()` |
| **IN** | `audit`: comprobación de que los rangos publicados coinciden con los derivados |
| **IN** | `CORE.md` regenerado, y su `diff` se lee |
| **OUT** | Cambiar las fases de ningún componente. Se corrige de dónde salen, no cuáles son. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | `build-core` no contiene rangos de fase escritos a mano |
| `AC-02` | El mapa publicado en `CORE.md` coincide con `fasesDe()` para los seis componentes |
| `AC-03` | `audit` falla —de forma distinguible— si el mapa publicado deja de coincidir |
| `AC-04` | `verify-suite` y `verify-patrones` en verde tras regenerar |

## Cómo termina   `FDGE-R53`

> Termina cuando: el mapa de fases de `CORE.md` sale de `fasesDe()` para los seis componentes, y `audit` **falla** si deja de coincidir.

## 5. Riesgo

**Que la derivación tape un hueco en vez de mostrarlo.** Si un componente no declara fases,
derivar produciría un rango vacío que se lee como «no tiene». Por eso `AC-02` exige los **seis**:
un componente ausente del mapa es tan defecto como un rango equivocado.

## 6. Fuera de lo declarado

`SUITE-R06(e)` cubre `docs/methodology/`. Esta tarea lo modifica **con intake firmado**, que es
como se mantiene este repositorio desde `SUITE-R41`. No hay merge, publicación ni borrado de datos
aquí: lo que toque la rama principal se detiene en `G4`, que es humana por definición.

## `G1` — Definition of Ready

VEREDICTO: PASS

Cada criterio nombra el mecanismo que lo comprueba, y el alcance declara qué **no** toca. Lo que se
afirma del comportamiento observado está **medido**, no supuesto: la medición está en §2 con el
comando que la produjo.

Firmado en `PHASE 1` por Alberto Martínez, 2026-08-26.

## Firma   `INTAKE-R06` · `SUITE-R27`

`EP-024` no está firmado como lote, así que esta tarea **no hereda nada de él**: `INTAKE-R08`
*admite* la firma por lote, no la impone.

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-26
He leído este Intake y confirmo que refleja mi intención: SÍ
```

### Constancia de cómo se escribió esta firma

La escribió el agente por delegación, con el VoBo que el firmante dio en sesión para las firmas de
este lote, y consta en `SESSION_LOG.md`. `SUITE-R27` dice lo que esto **no** prueba: que firmara
una persona. Sí lo hace contrastable — el nombre está en `firmantes`, y quien aparece en esa lista
responde de lo que lleva su nombre.
