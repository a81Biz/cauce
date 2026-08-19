# PT-064 — Estrategia   `PHASE 3`

## Lo que se construye

Las tres derivaciones piden el autor y lo pasan por `personaDe` (`PT-061`):

```
cerradasConCoste()   git log --format=%H %an %ae %s   ->  cada tarea sabe de quien es
porSesion()          idem                             ->  cada sesion sabe de quien es
movidoDesde()        idem                             ->  la sesion abierta, tambien
```

Y las cifras se filtran donde importa:

```
tracker coste [tipo] [complejidad] [--mio | --de "Nombre"]
tracker viabilidad PT-NNN          el precedente y el techo, de MI persona
```

## Las cuatro decisiones

### 1. El precedente y el techo se filtran **siempre**; el coste **a peticion**

`PHASE 2` midio que las tres se rompen distinto:

| | Se filtra | Por que |
|:---|:---|:---|
| **Precedente** | siempre | Decide si empezar AHORA · comparar contra trabajo ajeno es comparar contra nada |
| **Techo** | siempre | Decide si algo NUNCA cabria · inflado, esa salvaguarda no salta |
| **Coste** | a peticion | Mas casos es mejor referencia · mezclar personas ahi no es un defecto |

No es una asimetria por comodidad: es que las dos primeras responden «¿puedo yo, ahora?» y la
tercera responde «¿cuanto suele costar esto?».

### 2. El coste dice SIEMPRE de quien es

Con `--mio` o `--de`, la salida lo dice. Y **sin filtro tambien lo dice** —«de todas las
personas»— porque lo peligroso no es dar una cifra u otra: es no saber cual te estan dando.

### 3. Un commit sin persona declarada no se reparte

`AC-04`. Es `SIN EVALUAR`, no se adjudica por parecido. `PT-061` ya lo decidio y aqui se **aplica**:
si un autor no esta en la tabla, su trabajo no cuenta para el precedente de nadie.

Y se **dice cuantos son**, para que la ausencia se vea en vez de restar en silencio.

### 4. Con una persona, o ninguna, nada cambia

`AC-05`. Es lo que impide que esta tarea rompa `EP-015`: sin `personas` declaradas —el caso de este
repositorio— las tres cifras salen exactamente como hoy.

## Lo que NO se hace

**No se toca la logica de `costeDe` ni de `viabilidadDe`.** `PT-057` y `PT-059` decidieron **como**
se calcula. Esta tarea cambia **de donde salen las entradas**, igual que `PT-060` hizo con el
`desde`. Tocar la logica seria rehacer dos tareas cerradas por la puerta de atras.

**No se compara el rendimiento de nadie.** Esto sirve para que el marco **no decida mal**, no para
medir a personas. Una cifra por persona presentada como comparacion es una herramienta distinta,
con otras consecuencias, y no es esta.

## El riesgo

Que filtrar por persona deje los grupos **demasiado pequenos**. Hoy `CHORE/STANDARD` tiene 17
cerradas; con dos personas serian dos grupos que podrian caer por debajo de `MINIMO_REFERENCIA`.

Eso **ya esta resuelto** y no hace falta nada nuevo: `costeDe` devuelve `SIN REFERENCIA` con su
motivo, y `viabilidadDe` con una cifra `SIN EVALUAR` devuelve `MARGINAL` — no aprueba por omision.
El lote anterior dejo el comportamiento correcto para este caso antes de que el caso existiera.
