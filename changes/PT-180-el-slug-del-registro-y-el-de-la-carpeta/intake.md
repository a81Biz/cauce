# `PT-180` — El slug del registro y el de la carpeta divergen, y cada herramienta usa uno

```yaml
---
id: PT-180
type: BUG
severity: S2
epic: EP-024
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que un comando encuentre la carpeta de un `PT` aunque su slug en el registro no coincida con el del
disco, y que **la divergencia se nombre** en vez de resolverse en silencio.

## 2. Comportamiento observado, medido

Al integrar `EP-024` después de `G4`:

```
✗ FDGE-R23  PT-155: no existe .\changes\PT-155-los-contratos-sin-asercion\intake.md
```

```
registro:  PT-155-los-contratos-sin-asercion
disco:     PT-155-verify-patrones-comprueba-dos-de-siete
```

**Doce sitios** de `tracker.mjs` componían la ruta a mano como `changes/<id>-<slug>` con el slug
**del registro**, y cada uno reacciona distinto cuando no existe: `integrar` revienta, `cursor`
cuenta la fase como «sin rastro», `avanzar` no sincroniza el `YAML` y **no lo dice**.

**Una allocation de 211.** Y con esa sola bastó para **bloquear el cierre de `EP-024` después de
`G4`**: 27 de 28 en estado terminal, y la que faltaba no podía pasar.

Es también el origen de los «30 nodos sin rastro» que el cursor reportaba sobre este lote — un
informe lleno de falsos que por eso nadie miraba.

## 3. Alcance

| | |
|:---|:---|
| **IN** | `carpetaDe()`: la carpeta se **busca por prefijo**, como ya hace `ptDir` en `verify-fdge` |
| **IN** | Los **doce** sitios pasan a usarla — dejar uno fuera reproduce el defecto ahí |
| **IN** | La divergencia se **nombra** en la salida del comando |
| **OUT** | Renombrar la carpeta. Sus rutas están escritas en `HISTORY`, en la evidencia y en commits ya fusionados a `main`. |
| **OUT** | Reescribir el slug del registro. Ningún comando lo hace, y a mano es `SUITE-R08`. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | `integrar` encuentra la carpeta de `PT-155` y lo lleva a `INTEGRATED` |
| AC-02 | La divergencia se **nombra** en la salida, citando los dos nombres |
| AC-03 | Un `PT` cuya carpeta **no existe** sigue dando la ruta esperada, no una inventada |
| AC-04 | Ningún sitio de `tracker.mjs` compone la ruta a mano |

## Cómo termina   `FDGE-R53`

> Termina cuando: `tracker integrar PT-155` funciona, la salida nombra los dos nombres, y ningún
> sitio del archivo compone `changes/<id>-<slug>` por su cuenta.

## 5. Riesgo

**Que encontrar la carpeta se lea como haber arreglado el problema.** No lo arregla: sigue habiendo
**dos nombres para un hecho** (`CE-008`). Lo que se corrige es *suponer que el disco obedeció al
registro*. Por eso `AC-02` no es cosmético — sin él, el defecto sobrevive callado y el siguiente
sitio que componga una ruta a mano vuelve a romperse.

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
