# `EP-025` — la batería se puede certificar: independencia, cierre y sello

```yaml
---
id: EP-025
type: EPIC
status: CLOSED
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
| Entrada de `CHANGELOG.md` | **HECHO** — `13.4.0`, con el sello, los siete defectos y lo que apareció al cerrar. |
| Número de versión | **HECHO — `13.4.0`, `MINOR`.** No hay reglas nuevas: `RULES.md` es idéntico al de `main`. Lo que entra es **capacidad** —sellar, acotar, `--seccion`, `--todo`— y siete correcciones. Y es `13.4.0` y no más `13.3.0` porque `13.3.0` **ya está en `main` y etiquetada**: repetir el número sería la avería que `EP-024` corrigió al escribir su propia fila. |
| Cuántos de los 338 dependían por **descuido** y cuántos por **diseño** | **HECHO, y la respuesta es que no había 338: son CERO.** 46 secciones aisladas, 46 en verde, 1882 casos en aislado = 1882 en la corrida completa. La cifra del Intake se midió con cuatro criterios estáticos que dieron `595`, `292`, `111` y `276` — los cuatro falsos. Corregido en la Revisión 3; `SUITE-R09`, la cifra original no se borra. |
| Tiempo de la batería con y sin sellos | **HECHO — medido por el camino que ejecuta CI, no forzado.** Completa **2055 s · 1916 casos**; sellada **346 s · 119 casos**: **−83 %**. Las dos cifras que se dieron antes eran malas y se dicen: los `7,2 min` salían de una corrida **forzada** con `--seccion`, que no es el camino por defecto, y el `69 %` se calculó sobre esa medición. Sólo vale el número que produce el camino que de verdad se ejecuta. |
| La cuenta por patrón que `SUITE-R61` exige | **HECHO — `superado 0 · invertido 1 · hueco 0`, y se dice aunque sean ceros.** El **invertido** es el caso que fijaba `^9 pasos$`: al añadir un décimo paso legítimo falló **castigando la mejora**. No se retiró — se **convirtió** en lo que sí se sostiene: que nadie escriba la cuenta a mano. La batería creció de `1850` a `1916` casos. |
| Lo que apareció **al cerrar** | **HECHO — cinco hallazgos, ninguno en el Intake y ninguno mío.** `audit` (dos herramientas nuevas sin declarar) · `SUITE-R62` (`sellar:bloques` en la CI y no en `verify`, el hueco exacto de `PT-151`) · `FND-R14` (el inventario, 9551 frente a 9561) · dos cuentas a mano del mismo hecho en `CLAUDE.md` (**18** y **15**, y son **20**) · y el selector **fallando en silencio**, que por diseño deja la batería corriendo entera para siempre. |
| El carril del propio lote | **CORREGIDO AL CERRAR.** El trabajo estaba ocurriendo sobre `trabajo` y un commit de `PT-188` llegó allí **sin PR**. Se abrió la rama efímera del lote, `trabajo` volvió a `origin/trabajo` y las siete tareas se reanclaron en el registro. Es `FDGE-R19`, y que se saltara **en el lote que existe para impedir saltarse el marco** es el dato, no la anécdota. |
| El tag y la publicación | **PENDIENTE — son del firmante.** `v13.4.0` es posterior al merge (`SUITE-R06a`); `npm publish` sigue **reservado**. |

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

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

## Revisión 1 — 2026-08-27 · `PT-188` entra el primero, antes que `PT-173`

**Qué cambia.** El orden declarado empezaba por `PT-173`. Ahora empieza por **`PT-188`**:

```
1  PT-188  el arnés no puede escribir en el repositorio real   ← nueva, S1
2  PT-173  las secciones montan lo que necesitan
3  PT-174  la selección sigue el grafo de importación
4  PT-175  el sello se deriva de las entradas
5  PT-176  CI corre sólo los paquetes abiertos
```

**Por qué.** Al medir la independencia de las secciones —que es `PT-173`— el arnés **escribió en el
repositorio real**: `git init`, `commit`, `checkout -b`, `merge` sobre `main`. El árbol quedó con
**4 allocations donde había 213** y dos ramas de fixture. La causa es un `( cd "$WORK"` **sin
`&&`**: si el `cd` falla, el subshell sigue en el directorio actual. **Cinco sitios** tienen ese
patrón y los cinco ejecutan `git` dentro.

**No se puede medir la independencia con una herramienta que puede destruir lo que mide.** `PT-173`
necesita correr secciones aisladas, y aislar una sección es exactamente lo que dejó `$WORK` sin
montar.

**Lo que esto no cambia.** El orden de las otras cuatro sigue siendo el declarado y sigue sin ser
negociable: `PT-173` antes que `PT-174`, y `PT-176` el último.

**Lo que el firmante señaló al autorizarlo**, y consta porque es el juicio que ordena este lote:

> *«había orden, en papel, pero al parecer nada se cumplió y hoy estamos sufriendo las
> consecuencias»*

El orden estaba escrito en `§4` y se declaró **no negociable**. Lo que faltaba no era la decisión:
era que **nada la comprobara**. Es la misma forma que `EP-024` midió seis veces — una regla `HARD`
cuya única comprobación vive en la compuerta final, o en ninguna.

## Revisión 2 — 2026-08-27 · `PT-182` entra en el lote, y es la que integra

**Qué cambia.** El orden pasa de cinco a siete, y `PT-182` —que estaba en `EP-026`— entra al final:

```
1  PT-188  el arnés no puede escribir en el repositorio real   ✓ hecha
2  PT-189  la viabilidad no juzga un pronóstico ya cumplido    ✓ hecha
3  PT-173  las secciones montan lo que necesitan
4  PT-174  la selección sigue el grafo de importación
5  PT-175  el sello se deriva de las entradas
6  PT-176  CI corre sólo los paquetes abiertos
7  PT-182  el mapa fase→artefacto, y quién lo consume          ← entra
```

**Por qué.** El firmante lo nombró por su causa:

> *«estamos reconstruyendo muchas cosas por habernos saltado el mismo marco… ya tenemos algunos
> métodos, pero ahora necesitamos integrar todo»*

Medido: `EP-024` y lo que va de `EP-025` produjeron **siete** guardas nuevas, y **cinco de las
siete** arreglan lo mismo — *una regla `HARD` cuya única comprobación vivía en `G4`*. Dos más:
**en ninguna parte**.

**La integración no hay que inventarla: está escrita y desconectada.** `tracker cursor` ya
comprueba, fase a fase, que cada una dejó su artefacto — y **no lo invoca nadie**: ni
`package.json`, ni CI, ni `avanzar`, ni ninguna compuerta.

**Y es la misma pregunta que el sellado.** Un bloque se sella cuando su resultado es suyo; una fase
se cierra cuando su artefacto está. Las dos necesitan saber **qué produce cada cosa**, y ese mapa
está hoy escrito **dos veces y a mano** — `tracker cursor` y `verify-fdge`. Sellar sin resolverlo
certificaría bloques cuyo contenido nadie garantiza completo.

**Lo que esto no cambia.** El orden de las cuatro centrales sigue siendo el declarado en `§4` y
sigue sin ser negociable. `PT-182` va **después** de `PT-176` porque integra lo que las anteriores
dejan construido, no antes.

## Revisión 3 — 2026-08-27 · la cifra de `§3` era falsa: son **cero**, no 338

**Qué cambia.** `§3` y `§3b` declaran:

> *«**338 de 1439** casos corren sobre el `$WORK` que dejó otra sección»*
> *«**Ocho secciones** tienen el 100 %. `D · migración` son 49 de 49»*

**Medido ejecutando, no leyendo:**

```
46 secciones corridas AISLADAS, cada una con $WORK recién creado
46 en verde
1882 casos en aislado  =  1882 de la corrida completa
```

**`D · migración` pasa sola: 49 de 49.** Y las otras siete. **El número correcto es cero.**

**Cómo se llegó al 338, y por qué nadie lo vio.** Antes de ejecutar se midió con **cuatro criterios
estáticos** y salieron `595`, `292`, `111` y `276` — los cuatro falsos, cada uno por una razón
distinta, y ninguno cerca del `338`. Un análisis por líneas de shell no ve comandos multilínea, ni
rutas con variables, ni funciones por sustitución. **Afinar el detector es perseguir la sintaxis.**

**Qué implica para el lote.** La precondición que ordenaba `EP-025` **no existe**: no hay 338 casos
que arreglar. `PT-173` cambia de objeto —de *hacer* independientes las secciones a *dejar
demostrado* que lo son— y **el orden de las demás no cambia**: `PT-174` sigue después, y `PT-176`
sigue siendo la última.

**Lo que esto NO dice.** Que cada sección pase sola y pase en su posición **no prueba** que pase
como parte de un **bloque**: un bloque arranca limpio pero sus secciones se acumulan entre ellas, y
ése es un tercer caso **no medido**. Lo establece `PT-175`.

`SUITE-R09`: la cifra original **no se borra**. Queda escrita en `§3` y esta revisión la corrige,
que es como se ve que se midió mal y cómo se supo.

