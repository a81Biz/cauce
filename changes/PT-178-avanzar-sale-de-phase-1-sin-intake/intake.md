# `PT-178` — `avanzar` deja salir de `PHASE 1` sin que exista el Intake

```yaml
---
id: PT-178
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

Que `FDGE-R01` —*todo trabajo entra por un Intake*— se compruebe **cuando se puede corregir barato**,
y no sólo en `G4`.

## 2. Comportamiento observado, medido

```
node docs/methodology/tools/verify-fdge.mjs PT-152
  ✗ FDGE-R01   PT-152: no existe changes/PT-152-slug/. Todo trabajo entra por un Intake.
```

**Nueve tareas de `EP-024` sin intake**, y **cinco** llevadas de `PHASE 1` a `PHASE 5` en una sola
sesión sin que ningún comando dijera nada:

```
PT-152 · PT-153 · PT-154 · PT-157 · PT-158 · PT-162 · PT-165 · PT-166 · PT-170
```

`tracker avanzar` **sí toca el intake**: estampa su YAML y lo incluye en el respaldo, así que ya
calcula su ruta. Cuando el archivo no está, sigue adelante en silencio. `CE-005`: verde por no mirar.

`FDGE-R52` hace de `avanzar` la única forma sancionada de cambiar de fase. Un comando que es la única
puerta y no mira lo que la regla exige al cruzarla convierte una regla `HARD` en un aviso tardío.

## 3. Alcance

| | |
|:---|:---|
| **IN** | `tracker avanzar`: rechaza salir de `PHASE 1` si no existe `changes/<ID>-<slug>/intake.md` |
| **IN** | El mensaje dice la ruta que falta y qué hacer |
| **OUT** | Exigir el intake **para entrar** en `PHASE 1`. Es la fase que lo produce; pedirlo antes sería pedir el resultado para poder empezar. |
| **OUT** | Comprobar el **contenido** del intake. Eso ya lo hacen `INTAKE-R06` y `FDGE-R15`, y no se duplica. |

## 4. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| `AC-01` | `avanzar --a 2` sobre una tarea sin intake **falla**, y el mensaje nombra la ruta que falta |
| `AC-02` | Con el intake presente, `avanzar --a 2` pasa — el bloqueo no es una parada permanente |
| `AC-03` | Avanzar **dentro** de `PHASE 1` o entre fases posteriores no se ve afectado |
| `AC-04` | Las nueve tareas de `EP-024` tienen intake, y `verify-fdge` no reporta `FDGE-R01` |

## Cómo termina   `FDGE-R53`

> Termina cuando: `avanzar --a 2` sobre una tarea sin intake **falla** nombrando la ruta que falta, pasa con el intake presente, y `verify-fdge` no reporta `FDGE-R01` en ninguna tarea de `EP-024`.

## 5. Riesgo

**Bloquear una puerta que ya se usa.** Si alguna tarea en curso no tuviera intake, el comando la
detendría en seco. Es el efecto buscado —y por eso `AC-04` exige dejar el repositorio en el estado
que la regla pide **antes** de que el bloqueo entre en vigor, no después.

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
