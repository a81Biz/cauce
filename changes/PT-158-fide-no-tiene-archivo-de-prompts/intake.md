# `PT-158` — `FIDE` no tiene archivo de prompts, y `LEX-R15` decía que todo componente tiene uno

```yaml
---
id: PT-158
type: BUG
severity: S3
epic: EP-024
track: STANDARD
status: DONE
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Qué pasa

`LEX-R15` declaraba: *«todo componente tiene exactamente un archivo de prompts»*. `FIDE` tiene
`FIDE-CLAUDE-Launcher.md`, que no es un `*-Prompts.md`. Seis componentes, cinco archivos de prompts.

La regla afirmaba un universal que el repositorio desmentía — y lo desmentía **desde antes de que la
regla existiera**. La regla no describía lo que hay: describía lo que se esperaba que hubiera.

## 2. Comportamiento observado, medido

```
ls docs/methodology/**/*-Prompts.md
  Foundation-Prompts.md · FDGE-Prompts.md · FPGE-Prompts.md · QA-Prompts.md · PTSA-Prompts.md
  → 5
```

`FIDE` incuba un proyecto **desde una idea de negocio**, antes de que exista repositorio. Sus textos
no son prompts de fase sobre un árbol: son un lanzador conversacional. No es un hueco por descuido —
es un componente cuya forma **es distinta**, y la regla no lo admitía.

## 3. Alcance

| | |
|:---|:---|
| **IN** | `LEX-R15` admite la excepción **declarada**: «o declara por qué no puede tenerlo» |
| **IN** | `FIDE` declara por qué, en el documento que le corresponde |
| **OUT** | Fabricar un `FIDE-Prompts.md` vacío para que la cifra cuadre. Es `CE-001`: el proxy en lugar del hecho. |
| **OUT** | Quitar `FIDE` de `COMPONENTES`. Es un componente; lo dice `CLAUDE.md` y lo dice el ciclo. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | `LEX-R15` admite la excepción declarada, con esa forma exacta |
| `AC-02` | `FIDE` declara por escrito por qué no tiene archivo de prompts |
| `AC-03` | Ningún verificador reporta el hueco de `FIDE` como incumplimiento sin declarar |

## Cómo termina   `FDGE-R53`

> Termina cuando: `LEX-R15` admite la excepción declarada, `FIDE` declara por escrito por qué no puede tener archivo de prompts, y ningún verificador reporta el hueco.

## 5. Riesgo

**Que «o declara por qué no» se convierta en la puerta de salida de cualquier regla.** La diferencia
está en que la excepción es **nominal y escrita**: se sabe quién la usa y por qué. Una excepción que
hay que escribir y firmar cuesta más que cumplir, salvo cuando cumplir es imposible — que es
exactamente el caso que se quiere admitir.

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
