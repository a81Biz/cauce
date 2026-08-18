# PT-053 — Autorrevisión   `PHASE 6`

## Lo entregado, y la prueba que más vale

```
tracker avanzar PT-NNN --a N --nota "..."     los cinco actos, en uno
casos                                          579 → 598
```

**La nota de la transición `5 → 6` de esta misma tarea la publicó `avanzar`**, no
`gh issue comment`. Es la primera transición del repositorio que ocurre en un solo acto, y la hizo
la propia herramienta que la tarea existe para escribir.

## La atomicidad, probada rompiéndola

```
ANTES     registro 6 · YAML 6 · checkpoint 6
          «fallo simulado al publicar la nota»
DESPUES   registro 6 · YAML 6 · checkpoint 6
```

Se inyectó un fallo en el paso **irreversible** —publicar la nota— y los tres escritos anteriores
volvieron a como estaban. El mensaje lo dice con las palabras que importan: *«cuatro de cinco no es
una versión degradada del éxito, es el defecto que este comando existe para impedir»*.

## Tres correcciones de la ejecución, y las tres son reincidencias

### 1 · El valor de una bandera se coló en el posicional — **tercera vez en el lote**

```
avanzar PT-053 --a 6 --nota "..."     ->  ROOT = el directorio «6»
```

`-q` en `PT-049`, `--solo` en `PT-050`, `--a` aquí. **Las tres sabiendo del defecto**, porque las
dos anteriores están escritas en el código y en el `HANDOFF`.

Por eso ahora las banderas con valor viven en **una** lista (`CON_VALOR`) y la detección de `ROOT`
la consulta. No es la corrección de este caso: es lo que hace que la cuarta no lo repita.

### 2 · Las validaciones corrían **después** de la compuerta de acceso

En el fixture, «sin `--nota`» se contestaba con un mensaje **sobre la plataforma**: el diagnóstico
equivocado para el defecto real. Quien lo leyera iría a configurar credenciales.

Ahora todo lo que no necesita red se valida primero, y la exigencia de plataforma es **una
validación más** dentro del comando. Es mejor diseño *y* es lo que lo hizo probable en el fixture.

### 3 · Volví a asertar sobre un estado que otro bloque había mutado

El mismo error que `PT-052` cometió y corrigió **dos tareas antes**, con su comentario escrito en
el código. **Saberlo no bastó**: hay que llamar a `build_fixture` en el bloque.

### 4 · Y el peor: `avanzar` hacía **cuatro de cinco**

Con el comando escrito, probado y con su propia transición hecha, `npm run verify` salió en rojo:

```
✗ SUITE-R35   PT-053: su issue #87 declara «fase: 1» y el registro dice «fase: 6»
```

**Le faltaba el espejo.** La etiqueta `fase: N` del issue cambia en **cada** transición, y la
implementación hacía registro, YAML, checkpoint y nota. **Exactamente el defecto que la tarea
existe para impedir, dentro de la tarea.**

No lo vi leyendo el diseño —que **listaba los cinco**—. Lo dijo ejecutar la verificación completa.

Y al añadirlo aparecieron **dos** actos irreversibles, cuyo orden no es indiferente:

```
etiqueta desincronizada   es DERIVADA · se rehace sola con «abrir --aplicar»
nota que falta            no se rehace · es lo que el comando existe para impedir
```

**Lo que se puede recuperar va primero.** Si falla la nota, los tres escritos vuelven atrás y queda
una etiqueta adelantada: trivial de arreglar, y `SUITE-R35` la caza. Al revés habría dejado
abierto el hueco que la tarea combate.

### 5 · Y otra vez: faltaba **el sello del `HANDOFF`**

Con `avanzar` ya integrado en su **propia** `PHASE 9`, la CI volvió a salir en rojo:

```
✗ SUITE-R34   Hubo trabajo en changes/ despues del ultimo estado.
```

`avanzar` escribe el YAML del intake —que vive en `changes/`— y **no tocaba `HANDOFF.md`**. El
estado quedaba más viejo que el trabajo: **el comando violaba por construcción la regla que dice
que el estado viaja con el trabajo.**

**Es la segunda vez en esta tarea que un acto faltaba y lo dijo ejecutar la verificación
completa**, no leer el diseño: primero el espejo (`SUITE-R35`), ahora el sello (`SUITE-R34`). Los
dos estaban en la lista del descubrimiento y **ninguno** en la implementación.

Solo se estampa la línea `actualizado:`, que es **derivable** —la fecha sale de git y el hecho del
registro—. El resto de `HANDOFF.md` es prosa humana y no se toca: estamparla sería inventar, y
`LEX-R26` dice que lo que no se deriva no se escribe.

**Los actos son seis, no cinco.** El intake decía cinco porque contaba los que se hacían a mano; el
sexto —el sello— era el que nadie hacía, y por eso la CI lo cazó tres veces en la sesión.

## El argumento de la tarea, confirmado por la tarea

`PT-053` existe porque *una disciplina que depende de acordarse falla aunque uno se acuerde*. En su
propia implementación esa frase se cumplió **cinco veces**, y las cinco con la lección ya
escrita en el repositorio. Dos de ellas eran **actos que el propio comando no hacía**.

No es retórica del intake. Es lo que pasó mientras se implementaba.

## Lo que NO hace, y por qué cada cosa

```
NO resuelve compuertas   EXEC-R04 y SUITE-R06a: humanas SIN EXCEPCION
NO hace commit ni push   quien decide QUE entra en el commit es quien trabaja (FDGE-R19)
NO evalua presupuesto    EP-015
```

La segunda es la que más tentaba. `SUITE-R34` exige que el estado viaje con el trabajo, así que un
`avanzar` que commiteara parecía cerrar el círculo — pero **agrupar es una decisión de la tarea**:
`PT-052` metió seis documentos en un commit y `PT-049` dos, y las dos veces fue correcto por
razones distintas.

## Lo que no resuelve, declarado

**Nada impide editar `REGISTRY.phase` a mano** y saltarse el comando. No hay forma de evitarlo sin
quitar el acceso al archivo. Lo que hay es que `FDGE-R52` lo cazará **después** —que es donde
estábamos— pero ahora con un camino fácil que no lo requiere.

**Y la medida de si funcionó no está en esta tarea**: será contar, en `EP-015`, cuántas veces
`FDGE-R52` vuelve a cazar la misma transición. En `EP-014` fueron **tres**. Está escrito antes de
saber el resultado, que es lo único que lo hace una medida y no una excusa.

`AC` sin cubrir: ninguno. Contradicciones con otras reglas: ninguna.
