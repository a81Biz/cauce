# PT-096 — Trazabilidad `FDGE-R15`

> `AC` y `Caso` se llenan en `PHASE 4`; `Evidencia` y `Estado`, desde `PHASE 6`.
> Formato de cinco columnas, el de `PT-095`.

| AC | Criterio | Caso | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | El cuerpo enlaza donde está el contenido, y el enlace **se puede volver a leer** | `lo que el cuerpo escribe, refDeEnlace lo lee` · `lo vivo enlaza la rama de trabajo` | — | PENDIENTE |
| AC-02 | Ningún cuerpo publica `null`; la nota no se emite sin enlace | `sin ref durable, no explica el enlace` · `el cuerpo nunca publica «null»` | — | PENDIENTE |
| AC-03 | El espejo reporta el cuerpo mudo teniendo ref durable | `el espejo ve el cuerpo mudo` · `sin el resolvedor, se comporta como hoy` | — | PENDIENTE |
| AC-04 | La reparación alcanza al cuerpo sin enlace, y a las terminales | `un cuerpo mudo con ref durable se repara` · `un issue ajeno no se toca` | — | PENDIENTE |
| AC-05 | 0 mudos y 0 `null` sobre el tablero completo, con denominador | `node tools/tracker.mjs espejo` sobre el tablero real | — | PENDIENTE |
| AC-06 | La batería falla **sin** el arreglo, un caso por punto | la prueba inversa, cambio a cambio | — | PENDIENTE |
| AC-07 | Escrito en `CASOS-DE-USO` y `MANUAL`; `README`/`CLAUDE.md` declarados | `node tools/verify-suite.mjs docs/methodology` | — | PENDIENTE |
| AC-08 | 19 de 19 lotes con cabecera correcta y 0 listas en prosa | `el lote se reconoce por su ID` · `el cuerpo del lote NO lista sus tareas` | — | PENDIENTE |

## Tres criterios se comprueban con una **herramienta**, no con un caso de batería

`AC-05` y `AC-07` no llevan caso de `selftest.sh`, y no es un hueco: la batería **no tiene
credenciales ni red**, así que un caso que simulara el tablero probaría el simulador. Lo que se
nombra en su columna `Caso` es un comando que **pasa o falla**:

```
AC-05   tracker espejo     sobre el tablero REAL. Con S-3 puesto, un cuerpo mudo con ref
                           durable es una divergencia, y en la rama de trabajo BLOQUEA.
                           Su denominador va en salidas/tablero-despues.txt

AC-07   verify-suite       comprueba enlaces rotos, vocabulario derogado y reglas citadas
                           que no existen. Es lo que puede fallar si C5 o el MANUAL quedan
                           mal escritos
```

`AC-06` tampoco es un caso: **es la inversa**, y su evidencia es `salidas/inversa.txt` con el
recuento **por cambio retirado**. Si al retirar uno de los cuatro no cae ningún caso, ese cambio
no está probado — y eso se reporta, no se calla.

## `AC-09` no está en esta tabla

Estaba en la Revisión 1 del intake y **se retira en la Revisión 3**: declarar el `type` canónico
de un lote en `LEXICON` es material de `L-3`.

Mantenerlo aquí como fila `TRASLADADO` habría sido peor que quitarlo — una fila que nunca puede
ponerse en verde ensucia la matriz para siempre y convierte `FDGE-R15` en ruido que se aprende a
ignorar. Vive donde le corresponde: `out-of-scope.md`, con su destino escrito.

`D-1` es lo que lo permite: derivar de `EP-` usa un nombre que `LEXICON` **sí** declara, así que
el arreglo no depende de la decisión pendiente.

## Casos de regresión, que no cuelgan de ningún `AC`

Van aparte a propósito: colgarlos de un `AC` inflaría su cobertura sin probar nada suyo, que es lo
que `EP-018` declaró que no se hace.

| Caso | Protege |
|:---|:---|
| `sin directorio, sigue sin explicar el enlace` | `PT-048` · la rama hermana no se rompe |
| `cuerpoDeIssue escribe el marcador que la reparacion busca` | `RIE-4` · cambiar el texto rompe un caso en vez de apagar la reparación |
| `sin el resolvedor, el espejo se comporta como hoy` | los 12 casos de `compararEspejo` con cuatro argumentos |

## Los dos que cambian de sentido

No aparecen arriba porque **no probaban un `AC`: lo contradecían** (`design.md` `D-6`).

```
selftest.sh:1787   afirmaba que la nota se emite SIN ref durable   -> pasa a trlibno
selftest.sh:1614   afirmaba que la lista en prosa se emite         -> pasa a trlibno
```

## `CasoQA` — por qué no hay columna

`FQAGE` verifica en un navegador real que una persona puede usar el sistema. Aquí no hay interfaz:
el producto es una herramienta de línea de comandos y el cuerpo de un issue. Se dice en vez de
dejar una columna vacía que parecería un olvido (`SUITE-R11`).
