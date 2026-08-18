# PT-053 — Estrategia   `PHASE 3`

## Objetivo

Que avanzar de fase sea **un acto**, y que el que se olvida —la nota— **impida avanzar si falta**.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Un aviso: «no olvides la nota» | Es lo que `FDGE-R52` ya hace, **después**. Cazó tres veces en este lote y la tercera con el fallo anunciado: avisar no es impedir |
| Un `git hook` que compruebe la nota antes del commit | El commit y la transición no coinciden: hay transiciones sin commit y commits sin transición |
| Documentarlo mejor en `PHASES` | Ya está documentado. El defecto no es de conocimiento — lo demostró `PT-051` fallando **sabiendo** |
| Que `verify-fdge` bloquee antes en vez de después | Bloquear antes de que exista la nota impediría llegar a escribirla. Es el choque que `PT-029` catalogó |
| Un comando que haga los seis actos, con la nota **opcional** | El acto que se olvida seguiría siendo el que no cuesta nada olvidar |
| **Un comando que haga los seis, con la nota como argumento obligatorio** | Escribir la nota deja de ser un acto de voluntad: es la única forma de invocar el comando |

## Solución

```
tracker avanzar PT-NNN --a 6 --nota "..."
```

**Seis actos, uno detrás de otro, y el orden lo decide la reversibilidad:**

```
0  VALIDAR       el PT existe · vive · la fase destino es la siguiente · hay nota · hay acceso
1  registro      REGISTRY.phase                                      reversible
2  YAML          el intake del PT                                    reversible
3  indice        la linea de estado, si cambia                       reversible
4  checkpoint    CHECKPOINT.json                                     reversible
5  NOTA          el comentario en el issue                            IRREVERSIBLE — va al final
```

**Lo irreversible va último, y todo lo anterior se revierte si falla.** Si el comentario no se
puede publicar, los cuatro escritos vuelven a como estaban y el comando termina en rojo. El
repositorio nunca queda a medias — que es el estado del que salieron los ocho fallos de CI de
`EP-013`.

## Las tres invariantes

```
1  SIN --nota NO AVANZA. No es un aviso: es una negativa. El comando no se puede
   invocar sin ella, asi que escribirla deja de depender de acordarse
2  ES ATOMICO. Si un paso falla, NINGUNO queda aplicado. Cuatro de cinco es el
   defecto que motiva la tarea, no una version degradada de exito
3  LA FASE DESTINO SE VALIDA contra la actual. Ni se salta ni se retrocede en
   silencio: eso apagaria las comprobaciones que la fase saltada habilita
```

## Lo que **no** hace, y es tan importante como lo que hace

```
NO resuelve compuertas      EXEC-R04 y SUITE-R06a las dejan en manos humanas
NO hace commit ni push      quien decide QUE entra en el commit es quien trabaja (FDGE-R19)
NO evalua presupuesto       eso es EP-015
```

La segunda merece explicación: un comando que además commitea **decide qué entra en el commit**.
`SUITE-R34` exige que el estado viaje con el trabajo, y quién agrupa qué es una decisión de la
tarea, no del tracker.

## Sin plataforma declarada

`avanzar` **exige plataforma**, y es lo contrario que `checkpoint`. La razón es la nota: sin
plataforma no tiene dónde ir, y un `avanzar` que avanza sin escribirla sería exactamente el defecto
que la tarea corrige, con una excusa.

Sin plataforma, el comando **falla y dice qué hacer**: los actos siguen disponibles por separado.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| Las otras acciones de `tracker` | `avanzar` **llama** a lo que ya existe; no reimplementa nada. Caso propio |
| `FDGE-R52` | No se toca: sigue contando notas. Lo que cambia es que ahora siempre haya una |
| Un PT en estado terminal | No avanza: `queSigue` ya lo dice, y `avanzar` lo respeta. Caso propio |
| Saltar una fase | Se valida contra la actual. Caso propio en las dos direcciones |
| El repositorio a medias | Caso propio: se rompe el paso 5 a propósito y se comprueba que 1-4 volvieron |

## Criterios de éxito, derivados de los AC

- `AC-01` → los cinco actos y el checkpoint, con un comando
- `AC-02` → sin `--nota` no avanza
- `AC-03` → atómico: si falla uno, ninguno queda
- `AC-04` → la fase destino se valida
- `AC-05` → sin acceso lo dice y no avanza a medias
- `AC-06` → `avanzar` está en `LEXICON` con las demás acciones

## Autorrevisión

**El riesgo es que `avanzar` sea otro acto más**, y no el que los sustituye. Si alguien puede
avanzar la fase a mano y el comando es una comodidad, no cambia nada: la disciplina sigue siendo el
control. Por eso `--nota` es **obligatoria** —la única forma de invocarlo es con ella— y por eso la
atomicidad es un `AC` y no una mejora.

**El segundo riesgo es hacer demasiado.** Un comando que además commitea, resuelve compuertas y
evalúa presupuesto sería el sitio donde todo se rompe a la vez. Las tres cosas están fuera con su
destino escrito.

Contradicciones: ninguna. `AC` sin cubrir: ninguno.

**Lo que no resuelve:** que alguien edite `REGISTRY.phase` a mano y se salte el comando. No hay
forma de impedirlo sin quitar el acceso al archivo, y quitarlo rompería todo lo demás. Lo que sí
hay es que **`FDGE-R52` lo cazará después** — que es donde estábamos, pero ahora con un camino
fácil que no lo requiere.
