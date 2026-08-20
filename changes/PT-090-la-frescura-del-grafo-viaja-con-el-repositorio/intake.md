# PT-090 — La frescura del grafo es comprobable en cualquier clon

> Plantilla de **tarea dentro de una implementacion abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-018` (`INTAKE-R08`).

```yaml
---
id: PT-090
type: BUG
epic: EP-018
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-20
structural: no
suite_version: 10.0.0
severity: S2
---
```

## 1. Que se quiere   `[HUMANO]`

Origen: [`H-005`](../../PTSA/Findings/H-005.md) · `D2` · **MEDIA**. Declarado en `TD-17`.

## 2. El hallazgo, medido

```
$ git check-ignore -v graphify-out/graph.json
.gitignore:13:graphify-out/     graphify-out/graph.json
$ git ls-files graphify-out
(vacio)
```

```
verify-fdge.mjs:267    sin graphify-out/  ->  state MISSING
verify-fdge.mjs:1347   const bloquea = state !== 'FRESH' && state !== 'SUSPECT'
verify-fdge.mjs:1349   fail('FDGE-R43', `${pt}: es MAJOR y el grafo esta ${state}`)
```

**En cualquier clon limpio —CI incluida— el directorio no existe.** Y la deriva de contenido se
calcula contra `mtime` locales, que `git clone` reescribe con la fecha del clon.

## 3. Consecuencia medida, no hipotetica

El sello de la `10.0.0` se resolvio con un grafo verificado `FRESH` **en una sola maquina**, y esa
comprobacion no la repite nadie. Es el patron de `PT-087` aplicado al **alcance** de la
comprobacion en vez de a su contenido.

## 4. Las tres salidas, y la decision es de una persona

| | Que cuesta |
|:---|:---|
| Versionar `graphify-out/` | ~1 MB de artefacto **generado** en la historia, y un merge conflictivo por cada regeneracion |
| `mtime` -> **hash de contenido** | hace el calculo portable sin mover el archivo; no resuelve `MISSING`, solo `SUSPECT` |
| `MISSING` -> aviso «no evaluable en este clon» | honesto y barato; deja `FDGE-R43` sin poder bloquear nunca en CI |

**La combinacion 2+3 es la unica que no miente**: la deriva se mide igual en todas partes, y donde
el grafo no esta se dice que no se pudo evaluar en vez de fingir un bloqueo que nadie alcanza.

## 5. Criterios de aceptacion

| | Criterio |
|:---|:---|
| `AC-01` | La deriva de contenido se calcula con **hash**, no con `mtime`: dos clones del mismo commit dan el mismo veredicto |
| `AC-02` | `MISSING` deja de ser un bloqueo mudo: dice **«no evaluable en este clon»** y por que |
| `AC-03` | …y esa distincion aparece en la salida, no solo en el codigo (`SUITE-R38`) |
| `AC-04` | `FDGE-R43` declara su **sujeto** segun `PT-087`: que hecho establece y cual no |
| `AC-05` | `TD-17` se actualiza con la decision tomada y su motivo, o se retira si queda resuelto |

## 6. Que NO entra

```
OUT: versionar el grafo. Se declara descartada arriba, con su motivo, para que no vuelva a
     discutirse desde cero.
OUT: cambiar el alcance del grafo. Lo calcula plan-layout desde PT-070 y coincide con lo
     declarado en REGISTRY.graph.scope.
```
## Condicion de cierre   `FDGE-R53`

Termina cuando: dos clones del mismo commit dan el mismo veredicto de `FDGE-R43`, y `MISSING` dice «no evaluable en este clon» en vez de bloquear en silencio.

## Firma

```
Firmado por lote: EP-018
```
