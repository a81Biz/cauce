# `PT-156` — `LEXICON` §3 declara el rango de cinco componentes y hay seis

```yaml
---
id: PT-156
type: CHORE
severity: S3
epic: EP-024
track: STANDARD
status: DRAFT
phase: 8
created: 2026-08-25
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

> **Firma propia, no por lote.** `EP-024` no está firmado como lote, así que esta tarea no puede
> heredar nada de él: `INTAKE-R08` **admite** la firma por lote, no la impone.

## 1. Qué pasa

`patrones.mjs` declara el rango de fases de cada componente. `FPGE` lleva `fases: SIN_EVALUAR`
con este comentario, escrito en `PT-144`:

> `LEXICON` §3 tiene apartados 3.1 a 3.5 para SEIS componentes: no hay ninguno para `FPGE`.
> El dato NO EXISTE, y un rango inventado para que la tabla quede simétrica apagaría la
> comprobación en silencio (`RULE-06`).

`audit` lo reporta como hueco desde que `PT-147` dejó de saltarse los `SIN_EVALUAR`. **Es el
único hueco que le queda a la batería**, y por eso `EP-022` no puede cerrar en verde sin esto.

## 2. Por qué no había apartado, medido

No es un olvido de redacción. **`FPGE` no tiene fases que declarar**: su recorrido operativo
numera siete pasos como `[1]`..`[7]` en `FPGE-Implementation.md:52-114`.

`LEXICON` §2 dice que `PHASE` es la **única** palabra admitida para designar un paso de
cualquier flujo de la suite, y prohíbe explícitamente `Step n` y `Etapa n`. Un `[1]` no está en
esa lista de prohibidos **por escrito**, y así se coló: es la misma cosa con una grafía que la
prohibición no nombró.

Medido: las nueve apariciones de `PHASE` en los tres documentos de `FPGE` se refieren **todas a
`PHASE 1` de FDGE** —dónde entrega lo que promueve—, ninguna a un paso propio.

Así que el apartado de `LEXICON` no se puede escribir *primero*: no habría de dónde derivarlo.

## 3. Alcance

> Termina cuando: `LEXICON` §3 declara el rango de fases de los **seis** componentes, `audit` no
> reporta ningún hueco de clase `fase`, y `verify-patrones` puede **fallar** si alguien declara
> un rango que `LEXICON` no respalda — o lo contrario.


| | |
|:---|:---|
| **IN** | `FPGE-Implementation.md`: los siete pasos pasan a `PHASE n — Nombre` (`LEXICON` §2) |
| **IN** | `LEXICON` §3: apartado nuevo para `FPGE`, con su tabla de fases |
| **IN** | `patrones.mjs`: `FPGE.fases` deja de ser `SIN_EVALUAR` |
| **IN** | `CORE.md` regenerado (`SUITE-R16`) |
| **OUT** | Cambiar **qué hace** cada paso de `FPGE`. Se renombra la grafía, no el proceso. |
| **OUT** | Añadir a §2 la grafía `[n]` a la lista de prohibidos. Es una regla nueva y va con su propia tarea. |
| **OUT** | Mover esta tarea de `EP-024` a `EP-022`. La herramienta no puede, y eso es `PT-162`. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | Los siete pasos de `FPGE-Implementation.md` se escriben `PHASE <n> — <Nombre>` (`LEXICON` §2) |
| `AC-02` | `LEXICON` §3 tiene apartado propio para `FPGE`, con las mismas siete fases y los mismos nombres |
| `AC-03` | `patrones.mjs` declara `FPGE.fases` y **ya no** `SIN_EVALUAR` |
| `AC-04` | `audit` no reporta ningún hueco de clase `fase` |
| `AC-05` | `CORE.md` regenerado, y su `diff` **se lee** — sólo el apartado nuevo |
| `AC-06` | `verify-suite`, `verify-patrones` y `verify-fdge` en verde |

## 5. Riesgo

**El de siempre en este lote: dos mapas que discrepan.** Si `LEXICON` §3 declara siete fases y
`FPGE-Implementation` sigue con `[1]`..`[7]`, el apartado es una afirmación sin respaldo. Por eso
`AC-01` va **antes** que `AC-02`, y `AC-02` exige *los mismos nombres*, no «unos nombres».

## 6. Fuera de lo declarado

`SUITE-R06(e)` cubre `docs/methodology/`. Esta tarea lo modifica **con intake firmado**, que es
como se mantiene este repositorio desde `SUITE-R41`. No hay merge ni publicación aquí.

## `G1` — Definition of Ready

VEREDICTO: PASS

Los seis criterios son comprobables y cada uno nombra su mecanismo. El alcance está acotado a
siete archivos y declara qué **no** toca: el proceso de `FPGE` no cambia. La única incógnita
—si `FPGE` tiene fases que declarar— se resolvió **midiendo** antes de firmar, no suponiendo.

Firmado en `PHASE 1` por Alberto Martínez, 2026-08-25.

## Firma   `INTAKE-R06` · `SUITE-R27`

`EP-024` no está firmado como lote, así que esta tarea **no hereda nada de él**: `INTAKE-R08`
*admite* la firma por lote, no la impone.

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-25
He leído este Intake y confirmo que refleja mi intención: SÍ
```

### Constancia de cómo se escribió esta firma

La escribió el agente por delegación, con el VoBo que el firmante dio en sesión para las firmas
de este trabajo, y consta en `SESSION_LOG.md` del 2026-08-25. `SUITE-R27` dice lo que esto **no**
prueba: que firmara una persona. Sí lo hace contrastable — el nombre está en `firmantes`, y quien
aparece en esa lista responde de lo que lleva su nombre.
