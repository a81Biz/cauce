# Strategy — `PT-098`

## 1. Objetivo

Que `INTEGRATED` sea un **hecho del árbol** y no una afirmación del registro — y que cuando no lo
sea, algo lo diga.

## 2. La tensión que hay que resolver primero

`context.md` §5 la dejó abierta: **`avanzar` no puede negarse sin más**, porque `SUITE-R46` exige
el orden contrario:

> *«el orden es: apuntar el estado terminal en la rama de trabajo, mergear, y cerrar después»*

Negarse haría imposible el orden que otra regla obliga. **Y la salida no es una excepción: es que
`LEXICON` ya distingue los dos estados.**

```
DONE          terminado, esperando G4                 <- lo que SUITE-R46 pide apuntar antes
INTEGRATED    «mergeado a la linea principal»         <- un hecho del arbol
```

`SUITE-R46` habla de un **estado terminal** genérico, y el que se apunta antes del merge es `DONE`
—`FDGE-R34` lo confirma: *«`G4` exige `DONE`»*, no `INTEGRATED`—. Así que no hay choque real: hay
un comando que escribe `INTEGRATED` donde el marco esperaba `DONE`.

**Eso reencuadra la tarea.** No es «impedir un estado falso»: es que `avanzar` **escribe el estado
equivocado** al llegar a la última fase.

## 3. Solución

### `S-1` · `integradoEnPrincipal(a)` — el contraste `AC-01`

Reutiliza lo que `PT-096` construyó: pregunta a git si `changes/<ID>-<slug>/` está en la rama por
defecto.

```
esta en main         -> true
solo en integracion  -> false
no esta en ninguna   -> null   (SIN EVALUAR: no se puede saber)
```

**No necesita que la allocation declare rama**, que es lo que hacía parecer inviable la
comprobación: **58 de las 91** no la declaran.

### `S-2` · `avanzar` escribe `DONE`, no `INTEGRATED` `AC-04`

```js
// antes
if (terminal) a.status = 'INTEGRATED';
// despues
if (terminal) a.status = integradoEnPrincipal(a) === true ? 'INTEGRATED' : 'DONE';
```

**No se niega: escribe lo cierto.** Si el trabajo ya está en la principal, `INTEGRATED`; si no,
`DONE` — que es exactamente lo que `SUITE-R46` pide apuntar antes de mergear y lo que `FDGE-R34`
exige para `G4`.

Y lo **dice** en su salida, porque un cambio silencioso de estado es lo que causó el problema.

### `S-3` · `verify-fdge` reporta el terminal que el árbol no sostiene `AC-02` `AC-03`

```
INTEGRATED y su directorio NO esta en la principal   ->  ERROR
INTEGRATED y no se puede saber                       ->  AVISO · SIN EVALUAR, y se dice
INTEGRATED y esta                                    ->  silencio
```

**El `SIN EVALUAR` no es cortesía.** `RULE-06`: no saber no es permiso, pero tampoco es una
acusación. Un clon superficial o una rama sin traer no dicen nada del estado.

### `S-4` · Los documentos

`LEXICON` §5.1 ya define `INTEGRATED` correctamente; no se toca. Lo que falta es que `PHASES`
diga qué escribe `avanzar` al llegar a la última fase, porque hoy dice «marca terminal» sin
distinguir cuál.

## 4. Alternativas evaluadas

### `A-1` · Que `avanzar` se **niegue** — rechazada

Es lo primero que escribí. Rompe `SUITE-R46`: el estado terminal se apunta **antes** del merge por
diseño. Una guarda que lo impida hace imposible el orden que otra regla exige.

**Lo que tenía de razón** —que un falso `INTEGRATED` no debe poder escribirse— se recoge en `S-2`
escribiendo el estado **correcto** en vez de rechazar la operación.

### `A-2` · Derivar `INTEGRATED` **siempre**, y no guardarlo — rechazada

Sería lo más puro: el estado se calcula, no se almacena. Se rechaza porque el registro es la fuente
(`SUITE-R08`) y porque `git` no está disponible en todos los consumidores —el arnés prueba
funciones puras sin repositorio—. Además rompería la lectura de un registro histórico.

### `A-3` · Quitar la exención de lo terminal en las seis comprobaciones — rechazada

Es `OUT` en el intake y con razón: la exención existe para no exigir bitácora retroactiva a lo
integrado antes de la `5.1.0`, y quitarla pondría en rojo **todo** repositorio con historia.
**Lo que falla es el dato, no la exención.**

## 5. Riesgos

```
RIE-1  «avanzar» es el comando mas delicado del marco: hace CINCO actos atomicos. La guarda va
       DENTRO del calculo del estado, antes de escribir nada, para no romper la atomicidad

RIE-2  integradoEnPrincipal habla con git. En CI el checkout puede no tener «main» — actions/
       checkout deja detached HEAD y PT-056 ya pago por eso DOS veces. Devuelve null y se
       declara SIN EVALUAR: no saber no es rojo

RIE-3  91 allocations en INTEGRATED. Si el contraste fallara para alguna, saldrian 91 errores
       de golpe. Medido ANTES de escribir: las 91 tienen su directorio en main
```

## 6. Criterios de éxito

```
AC-01   integradoEnPrincipal devuelve true/false/null y no necesita la rama declarada
AC-02   verify-fdge reporta el INTEGRATED que el arbol no sostiene
AC-03   lo que no se puede contrastar sale SIN EVALUAR, no en rojo
AC-04   avanzar escribe DONE cuando el arbol no sostiene INTEGRATED, y lo dice
AC-05   los 91 actuales siguen en verde
AC-06   la bateria falla sin el arreglo, con el caso NEGATIVO incluido
```

## 7. Autorrevisión

- **¿Contradice el intake?** No. Lo afina: `§2` decía «que `avanzar` no pueda escribirlo si el
  árbol no lo sostiene», y `S-2` lo cumple escribiendo `DONE` en vez de negarse.
- **¿Alguna regla violada?** Ninguna. `SUITE-R46` queda **mejor** servida: el estado que pide
  apuntar antes del merge es exactamente el que `avanzar` pasará a escribir.
- **¿Estoy inventando algo?** No. `DONE` e `INTEGRATED` ya están definidos en `LEXICON` §5.1 y
  `FDGE-R34` ya exige `DONE` para `G4`. Lo único nuevo es que el comando los distinga.
