# PT-060 — Autorrevisión   `PHASE 6`

## Lo entregado

```
tracker sesion abrir       marca el «desde» · lo ÚNICO capturado
tracker sesion             lo derivado, con cada cifra y su naturaleza
tracker sesion cerrar      el handoff DERIVADO · apila en SESSION_LOG
sesionDe · handoffDeSesion puras
SESSION.json               sobrescribible · una sesión a la vez
LEXICON §6.2 y §6.5e       el contrato · sin regla nueva
casos                      784 → 829
```

## La distinción que sostiene la tarea

`LEX-R26` prohíbe un campo que **solo pueda rellenar la memoria** del agente. `desde` no lo es:

| | | |
|:---|:---|:---|
| **Marca** | `desde: <HEAD al arrancar>` | Verificable **en el momento en que se pone** |
| **Memoria** | «llevo unas tres horas» | Afirmación sobre el pasado, sin nada que la respalde |

Es el mismo criterio que hace legítimo el `sha` de `CHECKPOINT.json`. Y si nadie abrió la sesión,
**no se cae al día**: se dice `SIN EVALUAR`.

`PHASE 2` midió por qué eso importa: hoy «commits del día» da 45 y «commits desde el primero de
hoy» da 44 — **coinciden por casualidad**, porque la sesión empezó hoy. El día que no coincidan,
nada lo notaría, y la cifra sobre la que decide `PT-059` sería silenciosamente falsa.

## `AC-06`, que es el criterio del lote

No es una aserción: se ejecutó y está capturado en `salidas/ac06-dos-sesiones.txt`. Del handoff
derivado y `tracker siguiente`, **sin abrir nada más**, salen:

```
QUE tarea      PT-060
EN QUE fase    PHASE 6 · Evidencia
SOBRE QUE      daa057e · chore/PT-060-la-sesion-es-el-worker-no-el-estado
QUE TOCA       cada AC con su evidencia, o declarado no verificado
QUE SIGUE      PHASE 7 · Validacion
```

Y el árbol **corresponde** al checkpoint: si no, `siguiente` habría bloqueado con `STATE_MISMATCH`
(`PT-056`) antes de decir nada de esto. Las cuatro tareas del lote se ven funcionando juntas ahí.

**Con una honestidad que hay que decir:** los cinco pasos ocurrieron dentro de la **misma** sesión.
El «paso 4» simula la siguiente leyendo solo el handoff, pero quien lo lee es el mismo agente que
acaba de escribirlo, y no puede olvidar lo que sabe. Lo demostrado es que **la información basta**,
no que un contexto vacío la use bien.

## Lo que encontró el auditor, otra vez

`audit` reportó `SESSION.json` como hueco: **ningún instalador lo crea y ningún documento operativo
lo usa**. Las dos cosas eran ciertas. `INSTALL.md` ahora lo declara —como `CHECKPOINT.json`, no se
siembra vacío— y `PHASES.md` lo usa en `PHASE 0`, que es donde una sesión se abre.

Es la segunda tarea seguida en que una herramienta del marco encuentra lo que a mí se me pasó.

## Dos patrones que ya son crónicos

**Quinta vez que la detección de `ROOT` se traga un argumento.** `tracker sesion abrir` tomaba
`abrir` por `ROOT`, buscaba el registro en `./abrir` y **no hacía nada, en silencio**. Van `-q`,
`--solo`, `--a`, las etiquetas y ahora los subcomandos.

**Séptima vez que una aserción casa con la prosa de al lado.** El caso que comprueba que
`CHECKPOINTING` no está en el registro casaba con el campo `origin` de `PT-060`, que lo **nombra
para decir que no entra**. Ahora busca la forma de un estado: `"status": "CHECKPOINTING"`.

Los dos se arreglan igual —por **forma**— y los dos reaparecen. Eso ya no es casualidad: es que el
arnés y la herramienta comparten un espacio de nombres con la prosa que los describe.

## Lo que no queda comprobado

**Que alguien abra la sesión.** Sin marca todo sale `SIN EVALUAR` — correcto, y peor que tener el
dato. La herramienta no puede obligarse a sí misma a ser usada.

**Que un agente distinto no vuelva a abrirlo todo.** Lo garantizado es que no le haga falta.

**Que `desde..HEAD` capture todo el trabajo.** Cuenta commits: lo no commiteado no aparece, así que
la cifra es un **suelo**, no un total. Es el límite que `PT-057` ya tenía, heredado.
