# PT-094 — El checkpoint de una tarea cerrada bloquea `main`

```yaml
---
id: PT-094
type: BUG
severity: S1
track: STANDARD
complexity: STANDARD
status: IN_PROGRESS
phase: 9
created: 2026-08-21
structural: no
suite_version: 11.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «no se pudo publicar, revisa»

`publicar.yml` se lanzó dos veces contra `main` y **falló las dos**. No falla la publicación: falla
la verificación que corre antes, y la detiene una sola comprobación.

## 2. Comportamiento observado

```
32448409770  publicar  main  workflow_dispatch  failure
32448289929  publicar  main  workflow_dispatch  failure
32445191804  verificación  main  push          failure   ← ya estaba roja, hace una hora
```

```
✗ LEX-R26  CHECKPOINT.json de PT-092 NO corresponde al arbol (STATE_MISMATCH) —
           rama: declarado chore/alberto-martinez/EP-018-cierre, real main.
```

**`main` llevaba una hora en rojo y yo declaré el repositorio limpio.** Miré `git status` y los
issues abiertos; no miré el estado de los workflows. Eso es exactamente el patrón que `EP-018`
cerró ocho veces —comprobar el proxy barato en lugar del hecho— cometido al informar.

## 3. Comportamiento esperado

`verify-fdge --all` pasa en `main` **y** en cualquier rama, sin que nadie tenga que regenerar un
archivo a mano después de cada merge.

## 4. Por qué ocurre — tres huecos, medidos

**`PT-092` está `INTEGRATED` y su rama fue borrada al fusionarse.** El checkpoint sigue
declarándola.

```
PT-092.status  = INTEGRATED
PT-092.branch  = ausente en el registro
git rev-parse refs/heads/chore/alberto-martinez/EP-018-cierre  ->  fatal
```

| | Hueco | Medido |
|:---|:---|:---|
| `a` | `avanzar` escribe el checkpoint **sin pasar `ramaDeclaradaViva`** | `grep ramaDeclaradaViva` da **dos** aciertos: la definición y `checkpoint()`. `avanzar` no está |
| `b` | Sin `alloc.branch`, `rama` cae a la rama de la **sesión**, y `PT-056` sólo comprueba la vida de `alloc.branch` | **80 de 111** allocations no declaran `branch` |
| `c` | `LEX-R26` contrasta el checkpoint de una tarea **ya terminal** | **110 de 111** allocations son terminales |

`(a)` deja muerta, justo en el camino que de verdad escribe el checkpoint, la guarda que `PT-056`
construyó para este caso exacto — su comentario dice literalmente *«al integrar, la rama de tarea
se borra y el checkpoint pasaba a afirmar una referencia muerta»*.

`(c)` es el más de fondo. El propio checkpoint lo tiene escrito dentro:

```json
"siguiente": "PT-092 ya es INTEGRATED. Lo cerrado es evidencia, no estado (SUITE-R36)."
```

**El artefacto declara que no es estado, y la comprobación lo evalúa como estado.**

## 5. Por qué no lo cazó el CI de ningún PR

`actions/checkout` deja **detached HEAD** en un `pull_request`, y `PT-056` trata la cadena `HEAD`
como «no se puede leer la rama», no como un valor. Correcto, y con un efecto no previsto: **la
comprobación es ciega exactamente donde todos los PR la ejecutan**, y sólo abre los ojos en el
`push` a `main` y en `workflow_dispatch` — donde ya no hay PR que bloquear.

Una comprobación que no puede fallar donde se ejecuta siempre, y sólo falla donde nadie la mira
antes de necesitarla, es un caso más de la misma familia.

## 6. Criterios de aceptación

| | Criterio |
|:---|:---|
| `AC-01` | `verify-fdge --all` pasa en `main` **y** en una rama cualquiera, con el mismo árbol |
| `AC-02` | Un checkpoint de una tarea en estado **terminal** no se contrasta contra el árbol, y **se dice** por qué |
| `AC-03` | …y un checkpoint de una tarea **viva** sí se contrasta: el arreglo no apaga la comprobación |
| `AC-04` | `avanzar` deja de escribir una rama que no existe |
| `AC-05` | Un caso reproduce el fallo: rama declarada muerta + PT terminal, y **falla sin el arreglo** |
| `AC-06` | El límite de `detached HEAD` queda **declarado** donde se emite, no sólo en un comentario |
| `AC-09` | Cambiar de rama **dentro de la misma historia** deja de ser una discrepancia… |
| `AC-10` | …y una historia **distinta** sigue siéndolo, con la rama corroborando |

**`AC-03` es el que impide el arreglo fácil.** Silenciar `LEX-R26` para todo checkpoint dejaría
verde el repositorio y quitaría la comprobación que `PT-056` construyó para el caso peligroso: un
`sha` real que describe un árbol que ya no existe, **mientras la tarea sigue abierta**.

**`AC-05` es el que hace que lo demás signifique algo.** Sin él, «arreglado» sería «ya no sale el
mensaje», que es lo que se puede conseguir borrando un archivo.

### `AC-09` y `AC-10` se añadieron ejecutando `G4`, y el alcance creció

**El arreglo de `AC-02` no bastaba.** Al fusionarse el PR de revisión, la rama de esta tarea se
borró: `PT-094` quedó en `DONE` —vivo, luego contrastado— con un checkpoint declarando una rama
muerta y el trabajo **ya contenido** en el árbol. Rojo en `trabajo`, y rojo otra vez en `main` tras
el merge, con otro nombre de rama cada vez.

**Toda fusión invalidaba el checkpoint.** El caso terminal estaba cubierto y el caso normal no.

`AC-10` es el que impide que esto sea apagar la comprobación: una historia **distinta** sigue
bloqueando, y ahí la rama corrobora. La decisión de `PT-056` de que `rama` disparara por sí sola
queda **derogada**, y su caso `E3` se conserva en la batería con el veredicto nuevo para que la
derogación se lea.

## 7. Qué NO entra

```
OUT: regenerar el checkpoint a mano (tracker checkpoint PT-092)  ->  mueve el fallo de rama,
     no lo arregla: escrito en main falla en trabajo, y al reves
OUT: borrar CHECKPOINT.json                                      ->  deja verde sin arreglar nada
OUT: los 41 avisos de verify-fdge --all                          ->  no bloquean
OUT: publicar                                                    ->  lo dispara una persona
```

## 8. Cómo termina   `FDGE-R53`

Termina cuando: `verify-fdge --all` pasa en `main` y en `trabajo` **sobre el mismo árbol**, la
batería incluye un caso que falla sin el arreglo, y `publicar.yml` llega más allá del paso de
verificación.

**Y `main` sigue verde después del merge**, que es lo que el primer intento no consiguió: `G4`
habría dejado exactamente el mismo `LEX-R26` con otro nombre de rama.

## Firma   `INTAKE-R06`

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que el comportamiento esperado, la severidad y el out-of-scope reflejan mi intención: SÍ
```

> **Base de esta firma**, escrita por el agente porque `INTAKE-R06` no le permite firmar:
> *«no se pudo publicar, revisa»* y *«lo estás reparando pero no veo que sigas el marco de
> trabajo, no hay issue abierto ni nada»* — la segunda es la que ordena hacerlo así y no por
> fuera. `SUITE-R27` declara qué vale: una afirmación contrastable, no una prueba.

## 15. Resultado de la compuerta `G1`   `[AGENTE]`

```
VEREDICTO: PASS
```

`DoR-1` esperado declarado · `DoR-2` observado con las tres corridas y el mensaje literal ·
`DoR-3` seis criterios, y dos de ellos —`AC-03` y `AC-05`— existen para impedir el arreglo que
sólo apaga el mensaje · `DoR-4` out-of-scope con motivo, incluidos los dos atajos que ya probé y
descarté · `DoR-5` firma con su base y su límite.

## Nota de procedimiento   `SUITE-R06(b)`

Es un `BUG`. **Cerrarlo no se automatiza**: el trabajo llega hasta la evidencia y la validación
la resuelve una persona.
