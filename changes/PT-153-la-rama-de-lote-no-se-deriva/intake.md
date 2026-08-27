# `PT-153` — La rama de un lote no tiene forma derivable, y se inventa

```yaml
---
id: PT-153
type: BUG
severity: S3
epic: EP-024
track: STANDARD
status: DRAFT
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que la rama de un lote se **derive** del registro, igual que la de una tarea, y que `FDGE-R19b`
pueda contrastar la que existe con la que debería existir.

## 2. Comportamiento observado, medido

```
node -e "…ramaDeTarea(a.type, 'EP-024', a.slug, 'Alberto Martinez')"
  → null
```

`ramaDeTarea` necesita `type`. Y `LEX-R27` dice que **un lote NO lleva `type`**: se reconoce por su
identificador. Las dos cosas son correctas por separado y juntas dan `null` — **no hay forma
derivable para la rama de un lote**, así que se inventa una:

```
chore/alberto-martinez/EP-022-cierre
        ↑ tipo inventado          ↑ slug inventado («cierre» no es su slug)
```

El slug de `EP-022` es `los-componentes-se-declaran`. La rama decía otra cosa, y nada lo vio.

### El mismo campo, por el otro lado

`LEX-R27` es `HARD` y **ningún verificador barre el registro** para hacerla cumplir. `tracker` la
aplica al **escribir** (rechaza `--tipo` sobre un lote) y no al **leer**:

```
EP-001..EP-016  type: EP        ← 16 lotes
EP-019          type: EPIC      ←  1 lote
EP-017,18,20-25 sin type        ←  correcto
```

Diecisiete lotes llevan un campo que la regla prohíbe, con **dos grafías distintas** para el mismo
hecho (`CE-008`). Es el mismo campo: existe donde no debe, y falta donde la derivación lo pide.

## 3. Alcance

| | |
|:---|:---|
| **IN** | `patrones.mjs`: `ramaDeLote(id, slug, usuario)` — derivación que **no** depende de `type` |
| **IN** | `LEXICON` §6: la rama de un lote se declara, con su forma |
| **IN** | `verify-fdge`: barrido de `LEX-R27` sobre el registro — un lote con `type` falla |
| **IN** | Los diecisiete históricos se **cuentan y se declaran**, no se reescriben |
| **OUT** | Dar `type` a los lotes para que `ramaDeTarea` funcione. Es exactamente lo que `LEX-R27` prohíbe. |
| **OUT** | Renombrar ramas ya fusionadas. Reescribir historia es `SUITE-R06(f)`. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | `ramaDeLote` deriva la rama de un lote sin usar `type`, y con el slug del registro |
| `AC-02` | `ramaDeLote` devuelve `null` para lo que no es un lote — no inventa nada fuera de su objeto |
| `AC-03` | `verify-fdge` **barre el registro entero**, no sólo el lote que se verifique por su nombre |
| `AC-04` | Un lote nacido desde `13.2.0` con `type` **falla**; los anteriores se cuentan y se declaran |

## Cómo termina   `FDGE-R53`

> Termina cuando: `ramaDeLote` deriva la rama de un lote sin usar `type` y devuelve `null` fuera de su objeto, y `verify-fdge` **falla** si un lote nacido desde `13.2.0` declara `type`.

## 5. Riesgo

**Corregir hacia atrás.** El primer análisis pedía quitar los diecisiete `type` del registro. Lo
corrigió el propio código: el aviso que ya existía declara por escrito que **no se retrofecha**,
porque `SUITE-R09` hace el registro append-only en los hechos, y reescribirlo sería borrar cómo
estaba puesto para que la cifra cuadre. Lo que se cierra es la puerta hacia adelante — `RIGE_DESDE`
fija la entrada en `13.2.0`, y lo de antes se **declara**, que es lo que `RULE-06` pide de lo que no
se va a corregir.

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
