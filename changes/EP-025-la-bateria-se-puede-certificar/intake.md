# `EP-025` — la batería se puede certificar: independencia, cierre y sello

```yaml
---
id: EP-025
type: EPIC
status: DRAFT
created: 2026-08-26
suite_version: 13.2.0
origin: la parada de PT-172, que midio por que el sello no se puede construir todavia
---
```

## 1. Objetivo común   `[HUMANO]`

Dicho por el firmante:

> *«empaquetar tareas dentro de la batería y cada "algo" se cierra el paquete… así cada CI "lee"
> sólo los paquetes abiertos. Es una forma de certificar lo que ya se hizo»*

Y con la condición que hace que la idea sea buena en vez de peligrosa:

> *«si se necesita hacer algún cambio de lo que ya está sellado, necesita saber que además del
> cambio debe abrir y probar de nuevo como nuevo»*

**Un paquete sellado no se asume: se comprueba que nada de lo que depende ha cambiado.** La
diferencia entre esas dos frases es todo el lote.

## 2. Criterio de éxito del lote   `[HUMANO]`

**Que un paquete sellado afirme algo cierto y que tocarlo lo abra solo.**

```
MALO   «este paquete paso la ultima vez, asumimos que sigue pasando»
BUENO  «nada de lo que este paquete depende ha cambiado desde que paso»
```

Y una cifra que da la medida del premio: la batería tarda **26 minutos**, y un cambio en una
herramienta debería correr **14 de 45** secciones en vez de 45.

## 3. Por qué no cabía en `EP-024`

`PT-172` midió el terreno y encontró **dos** condiciones, no una:

| | Medido |
|:---|:---|
| **Cierre transitivo** | cambiar `patrones.mjs` activa **15 de 45** y debería activar **43** |
| **Independencia** | **338 de 1439** casos corren sobre el `$WORK` que dejó **otra** sección |

**Ocho secciones tienen el 100 % de sus casos sobre estado ajeno.** `D · migración` son 49 de 49.

Un paquete que no monta su propio estado **no se puede sellar**: su resultado no es una propiedad
suya sino de **la secuencia**.

## 3b. La forma del bloque, dictada por el firmante   `[HUMANO]`

> *«la forma en la que se hagan los bloques que sea por versión mayor, todos los cambios menores y
> parches en el mismo bloque de pruebas, que la versión esté en el intake así si hay algo que
> reparar o revisar poder ir a la prueba exacta. Cuando esté certificada la versión ese bloque ya
> no se vuelve a correr en la batería de pruebas»*

| | |
|:---|:---|
| **Unidad del bloque** | La **versión MAYOR**. `13.x.y` entero es **un** bloque: los `MINOR` y los `PATCH` caen dentro. |
| **Dónde se declara** | En el **intake**. La tarea dice a qué versión pertenece, y de ahí sale a qué bloque van sus casos. |
| **Para qué sirve** | Para **ir a la prueba exacta** al reparar o revisar. Es un índice de vuelta, no una etiqueta. |
| **Al certificar** | El bloque **deja de correr**. No es «corre y se ignora»: no se ejecuta. |

**Esto es lo que abarata la batería, y `PT-169` midió por qué no bastaba podar:** la completa
tardaba `23,6 min` antes y después de la poda. Aquí no se corre más rápido — **se corre menos**.

**Reabrir un bloque sellado no es volver a correrlo.** Un bloque que se toca **pierde su
certificación y vuelve a la batería entera**, y eso tiene que estar escrito donde una compuerta lo
pueda exigir. Es lo que `PT-175` tiene que hacer imposible de olvidar.

**La precondición no se puede saltar.** `338 de 1439` casos corren sobre estado que dejó otra
sección, y **ocho secciones tienen el 100 %** de sus casos sobre estado ambiental. Un bloque que no
monta su propio estado **no se puede sellar**: su resultado es una propiedad de la *secuencia*, no
del bloque. Sellarlo certificaría algo que no se midió — por eso `PT-173` va antes.

## 4. Orden, y no es negociable   `[AGENTE]`

1. **`PT-173` · las secciones montan lo que necesitan.** **338 casos por revisar.** Sin esto,
   sellar certifica una propiedad que el paquete **no tiene**: la suya sería de la secuencia.
2. **`PT-174` · la selección sigue el grafo de importación.** Sin esto, sellar certifica sobre
   **entradas incompletas** — hoy `patrones.mjs` activa 15 de 45 y debería activar 43.
3. **`PT-175` · el sello se deriva de las entradas.** Con 1 y 2, es lo fácil: `selloDe` ya existe.
4. **`PT-176` · CI corre sólo los paquetes abiertos.** **El último.** Cambiar lo que CI ejecuta
   antes de demostrarlo en local sería apagar la única compuerta que hoy mira todo.

> Las cuatro nacen **aplazadas** con su condición de reentrada (`LEX-R34`): el lote está **abierto
> y sin empezar** por decisión del firmante, y un aplazado declara qué tiene que pasar para
> retomarlo. Se escriben aquí como lista y no como tabla a propósito — `INTAKE-R09` exige carpeta
> de trabajo a todo `PT` que un lote liste **en fila de tabla**, y crearlas ahora sería fabricar
> artefactos vacíos para satisfacer una comprobación.

## 5. Qué NO entra   `OUT`

| Qué | Por qué | Dónde va |
|:---|:---|:---|
| Sellar a mano | Un sello que alguien pone porque «eso ya funcionaba» es la firma de un verde que nadie comprobó. **El sello se deriva o no existe** | — |
| Paralelizar la batería | Otra vía para el tiempo, y `PT-169` ya declaró por qué no es ésta | — |
| Podar casos muertos | Es `SUITE-R61` y `PT-169`, ya escrito | `EP-024` |
| Reescribir el arnés | Se corrige la dependencia de estado, no se rehace | — |

## 6. Análisis de solapamiento   `SUITE-R45`

- **`PT-173` y `PT-169`** tocan los dos el arnés. `PT-169` **podó y ordenó**; `PT-173` da fixture
  propio. Van en orden y `PT-173` corre sobre el árbol ya podado — si no, daría fixture a casos que
  van a desaparecer.
- **`PT-174` y `PT-086`**: aquella escribió `seccionesAfectadas`; ésta le añade el cierre
  transitivo. **Amplía, no sustituye** — la selección por nombre sigue siendo la base.
- **`PT-175` y `SUITE-R57`**: el marco ya sella versiones. El sello de paquete es **otro objeto**
  con el mismo mecanismo (`selloDe`), y hay que decidir si comparten regla o son dos.

## 7. Lo que este lote NO va a poder afirmar   `SUITE-R26`

**Que los 338 casos dependan del ambiente por descuido.** Algunos pueden hacerlo **a propósito**:
comprobar que un estado sobrevive entre fases es una propiedad legítima. Distinguir «depende por
descuido» de «depende por diseño» exige **leerlos**, y `PT-173` los revisa **todos** — pero el
veredicto de cada uno es de quien conoce el caso, no de un barrido.

**Y el firmante ya decidió cómo tratarlos**: se revisan todos en este lote; si más adelante hay que
volver a alguno, se vuelve. No se deja una lista abierta esperando.

## 8. Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` | PENDIENTE |
| Número de versión | PENDIENTE — `MINOR` si sólo añade reglas y comprobaciones |
| Cuántos de los 338 dependían por **descuido** y cuántos por **diseño** | PENDIENTE — la cifra se publica, no se resume |
| Tiempo de la batería con y sin sellos | PENDIENTE — medido, no estimado |
| La cuenta por patrón que `SUITE-R61` exige | PENDIENTE |

## 9. Firma   `INTAKE-R06` · `SUITE-R27`

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-26
He leído el Intake de cada PT listado en §4 y confirmo que todos reflejan mi intención: SÍ
```

### Constancia

La escribió el agente por delegación, con la decisión que el firmante tomó en sesión: *«como lote
propio, revísalos todos pero que sea un lote»*. `SUITE-R27` dice lo que esto **no** prueba: que
firmara una persona. Sí lo hace contrastable — el nombre está en `firmantes`.
