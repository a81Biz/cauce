# `PT-152` — `CORE.md` publica ocho triggers y `LEXICON` declara trece

```yaml
---
id: PT-152
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

`CORE.md` es **lo único que carga el agente** (`SUITE-R15`). Su bloque de triggers publicaba **ocho**.
`LEXICON` §4 declara **trece**. Un trigger que `LEXICON` declara y `CORE` no publica es un trigger que
el agente no conoce: existe en la norma y no en lo que se lee.

`[START MIGRATE]` es el caso claro. `SUITE-R17` lo exige para migrar el proyecto a la versión vigente
— y no aparecía en `CORE`, porque `build-core` derivaba los triggers de `COMPONENTES`, y `[START
MIGRATE]` **no pertenece a ningún componente**: pertenece a la suite.

## 2. Comportamiento observado, medido

```
node -e "import('./docs/methodology/tools/patrones.mjs').then(m=>console.log(m.triggers().length))"
  8
grep -c '\[START ' docs/methodology/LEXICON.md   → 13
```

La derivación no estaba mal: estaba **incompleta por construcción**. `COMPONENTES` es el contrato de
los seis componentes (`PT-144`), y un trigger de suite no cabe ahí. No había dónde declararlo, así
que no se declaraba — y el hueco no lo veía nadie porque `triggers()` devolvía «todos los de
`COMPONENTES`», que es verdad y no es suficiente. `CE-001`: un proxy en lugar del hecho.

## 3. Alcance

| | |
|:---|:---|
| **IN** | `patrones.mjs`: `TRIGGERS_DE_SUITE`, con regla y propósito por trigger |
| **IN** | `triggers()` compone los de componente **y** los de suite |
| **IN** | `CORE.md` regenerado (`SUITE-R16`) |
| **OUT** | Inventar triggers que `LEXICON` no declare. Se publica lo declarado, no lo imaginable. |
| **OUT** | Mover `[START MIGRATE]` a un componente. No lo es, y fingirlo rompe `PT-144`. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | `patrones.mjs` declara `TRIGGERS_DE_SUITE`, y cada entrada nombra su regla y para qué sirve |
| `AC-02` | `triggers()` devuelve los de `COMPONENTES` **y** los de suite, sin duplicar |
| `AC-03` | `[START MIGRATE]` aparece en el bloque de triggers de `CORE.md` |
| `AC-04` | `verify-suite`, `verify-patrones` y `audit` en verde tras regenerar `CORE` |

## Cómo termina   `FDGE-R53`

> Termina cuando: `triggers()` devuelve los trece que `LEXICON` declara, `CORE.md` los publica, y `[START MIGRATE]` está entre ellos con la regla que lo exige al lado.

## 5. Riesgo

**Que la lista de suite se convierta en el cajón de lo que no encaja.** Por eso cada entrada declara
`regla` y `para`: un trigger sin regla que lo exija no entra. Si mañana algo de esa lista resulta ser
de un componente, se mueve — y `verify-patrones` lo verá, porque el contrato se ejecuta.

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
