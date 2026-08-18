# PT-052 — Descubrimiento   `PHASE 2` · `2-B`

## Dónde vive hoy el estado de una tarea en curso

```
HANDOFF.md            63 lineas    del PROYECTO, no de la tarea. Una sola, sobrescrita
REGISTRY.phase        un entero    donde esta, no que hizo ni que sigue
notas de reanclaje    8 en #85     PROSA, en la plataforma, no en el repositorio
HISTORY.log           al cerrar    PHASE 8. Mientras se trabaja no hay nada
CHECKPOINT.json       —            no existe
```

**El estado existe. Lo que no existe es en formato que un programa pueda leer.**

## Las tres cosas que faltan, medidas

### 1 · Nada dice, por tarea, dónde está y qué sigue

`HANDOFF.md` responde por el **proyecto**: «la tarea es `PT-052`, lo siguiente es esto». Con una
tarea viva funciona. Con dos, o con dos personas —que es a donde va `EP-016`—, hay un solo campo
para N respuestas.

`REGISTRY.phase` dice `6` y nada más. `tracker siguiente` deriva de ahí qué toca, y eso ya es
mucho — pero **no dice qué se hizo**, ni sobre qué código.

### 2 · Nada ata la gobernanza al commit

Hoy los ata que **viajen en el mismo commit**. Es un vínculo fuerte y gratuito, y por eso
`FDGE-R19` exige commits atómicos y `SUITE-R34` comprueba contra git que el estado no quede más
viejo que el trabajo.

**Ese vínculo desaparece en cuanto `PT-054` proyecte a otra rama.** Lo que hoy es implícito hay que
escribirlo, y el sitio donde se escribe es éste.

### 3 · Nada permite comprobar, al retomar, que el árbol es el que el estado describe

`SUITE-R33` y `SUITE-R34` comprueban que el `HANDOFF` esté **completo** y sea **más reciente** que
el trabajo. Ninguna comprueba que lo que dice **corresponda** al árbol.

Es el hueco que `EP-015` llamará `STATE_MISMATCH`. Aquí solo se pone lo que lo hace posible: **un
SHA que se pueda contrastar**.

## Lo que ya existe y no hay que reinventar

| Lo que hace falta | De dónde sale hoy |
|:---|:---|
| tarea, tipo, fase, estado, lote, rama | `REGISTRY.json` |
| SHA del código | `git rev-parse HEAD` |
| archivos tocados | `git status --porcelain` |
| siguiente acción | `tracker siguiente`, que ya la **deriva** |
| compuerta que cierra la fase | la tabla `FASES` de `tracker.mjs` |

**Ningún campo hay que inventarlo.** El checkpoint no es una fuente nueva: es una **vista** de
fuentes que ya existen, con la forma que una máquina puede leer.

Eso es lo que lo hace admisible bajo `RULE-06` — y es la diferencia con la especificación de la
que sale `EP-015`, que pedía un `estimated_used: 67` que nadie puede medir.

## El riesgo, y por qué `AC-04` existe

Un checkpoint que declara un SHA **es una afirmación sobre el repositorio**. Si ese SHA no existe
—porque la rama se reescribió, porque se copió el archivo de otro sitio— el checkpoint miente con
la autoridad de un dato estructurado.

**Un checkpoint que apunta a nada es peor que ninguno**: el que no existe se nota, el que miente
no. Por eso `AC-04` exige que el SHA sea **alcanzable**, no solo que tenga la forma de un SHA.

## Lo que NO es el defecto

No es que las notas de reanclaje sobren. Son el único artefacto que reconstruye una sesión perdida
y su prosa es lo que las hace útiles a una persona. Lo que falta es lo **otro**: lo mismo, en
formato que no necesite a nadie leyéndolo.

Y no es que `HANDOFF.md` esté mal. Responde por el proyecto y lo hace bien. Lo que no tiene es
granularidad de tarea.
