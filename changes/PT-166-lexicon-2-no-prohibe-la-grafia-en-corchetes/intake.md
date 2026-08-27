# `PT-166` — `LEXICON` §2 prohíbe los pasos por su nombre, y la grafía en corchetes no estaba en la lista

```yaml
---
id: PT-166
type: CHORE
severity: S3
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

`LEXICON` §2 fija cómo se escribe una fase: `PHASE <n> — <Nombre>`. Y lista las grafías **prohibidas**
para que un verificador pueda cazarlas. La grafía `[n]` —`[1]`, `[2]`, la que usaba
`FPGE-Implementation.md`— **no estaba en esa lista**.

Una lista de prohibidos que no incluye la grafía que el repositorio usa es una lista que no protege
de nada en el único sitio donde hacía falta.

## 2. Comportamiento observado, medido

`PT-156` renombró los siete pasos de `FPGE-Implementation.md` de `[n]` a `PHASE n — Nombre`, y dejó
constancia de que la grafía vieja **no era detectable**: ningún verificador la habría visto volver.
El arreglo era correcto y quedaba sin defensa.

## 3. Alcance

| | |
|:---|:---|
| **IN** | `LEXICON` §2: `[n]` entra en la lista de grafías prohibidas |
| **IN** | Declaración explícita de que la lista es **incompleta por construcción** |
| **OUT** | Renombrar nada. Eso ya lo hizo `PT-156`; aquí solo se prohíbe volver atrás. |
| **OUT** | Prometer que la lista es exhaustiva. No puede serlo, y `SUITE-R26` prohíbe prometerlo. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | `LEXICON` §2 incluye `[n]` entre las grafías prohibidas |
| `AC-02` | §2 declara que la lista crece por hallazgo y **no** es exhaustiva |
| `AC-03` | `verify-suite` en verde: ningún documento vigente usa la grafía recién prohibida |

## Cómo termina   `FDGE-R53`

> Termina cuando: `LEXICON` §2 incluye `[n]` entre las grafías prohibidas, declara que la lista es incompleta por construcción, y `verify-suite` queda en verde.

## 5. Riesgo

**Prometer cobertura que la lista no da.** Una lista de prohibidos solo caza lo que alguien ya vio.
Declararlo por escrito es la diferencia entre una herramienta honesta y una que se lee como
exhaustiva sin serlo — `RULE-06`: lo que no se puede comprobar se declara no evaluable.

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
